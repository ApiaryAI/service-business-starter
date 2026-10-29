const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { execFileSync } = require('node:child_process');

const output = mkdtempSync(join(tmpdir(), 'service-starter-enquiry-tests-'));
execFileSync(join(process.cwd(), 'node_modules/.bin/tsc'), [
  '--ignoreConfig', 'lib/enquiry-server.ts', '--outDir', output, '--module', 'nodenext',
  '--target', 'es2022', '--types', 'node', '--esModuleInterop', '--skipLibCheck', '--strict',
], { stdio: 'inherit' });
const { createEnquiryHandler } = require(join(output, 'enquiry-server.js'));

const origin = 'https://example.com';
const valid = {
  name: 'Test Customer', phone: '0400000000', email: 'customer@example.com',
  location: 'Example suburb', projectType: 'Commercial property', service: 'Ongoing maintenance agreement',
  message: 'Please discuss equipment maintenance for our building.', source: 'Google search',
  sourceDetail: '', website: '', requestId: 'e75b3048-4d21-4f90-8c3a-4c9a2b5b48aa',
};
function request(body = valid, headers = {}) {
  return new Request(origin + '/api/enquiries/', {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
function setup(options = {}) {
  const calls = [];
  const logs = [];
  const handler = createEnquiryHandler({
    apiKey: 'test-only-not-a-real-key', from: 'Your Service Business <enquiries@forms.example.com>',
    origins: [origin], log: (status) => logs.push(status),
    verifyBot: async () => ({ isBot: false }),
    fetch: async (url, init) => {
      calls.push({ url, init, payload: JSON.parse(init.body) });
      return Response.json({ id: 'test-provider-id' });
    }, ...options,
  });
  return { handler, calls, logs };
}

test('valid enquiry uses fixed recipient and visitor Reply-To, with no raw provider data returned', async () => {
  const { handler, calls } = setup();
  const result = await handler(request({ ...valid, to: ['attacker@example.com'], from: 'attacker@example.com' }));
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true });
  assert.deepEqual(calls[0].payload.to, ['enquiries@example.com']);
  assert.equal(calls[0].payload.from, 'Your Service Business <enquiries@forms.example.com>');
  assert.equal(calls[0].payload.reply_to, 'customer@example.com');
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
});
test('retry preserves idempotency key; changed content uses a different key', async () => {
  const { handler, calls } = setup();
  await handler(request()); await handler(request());
  await handler(request({ ...valid, message: 'A different maintenance request.' }));
  assert.equal(calls[0].init.headers['Idempotency-Key'], calls[1].init.headers['Idempotency-Key']);
  assert.notEqual(calls[0].init.headers['Idempotency-Key'], calls[2].init.headers['Idempotency-Key']);
});
test('phone-only enquiries omit Reply-To rather than spoofing a sender', async () => {
  const { handler, calls } = setup();
  assert.equal((await handler(request({ ...valid, email: '' }))).status, 200);
  assert.equal('reply_to' in calls[0].payload, false);
});
test('untrusted or missing origins never contact the provider', async () => {
  const { handler, calls } = setup();
  assert.equal((await handler(request(valid, { Origin: 'https://attacker.example' }))).status, 403);
  assert.equal((await handler(request(valid, { Origin: '' }))).status, 403);
  assert.equal(calls.length, 0);
});
test('malformed, overlong and forged fields fail before delivery', async () => {
  const { handler, calls } = setup();
  for (const fields of [
    { email: 'test@example.com\r\nBcc: attacker@example.com' },
    { location: 'Example suburb\r\nInjected header' },
    { name: 'A' }, { name: {} }, { phone: 'hello' },
    { message: 'x'.repeat(1501) }, { service: 'Fake service' },
    { projectType: 'Fake equipment' }, { source: 'Fake attribution' },
    { requestId: '../bad' }, { website: 'spam.example' },
  ]) assert.equal((await handler(request({ ...valid, ...fields }))).status, 400);
  assert.equal((await handler(request('{broken'))).status, 400);
  assert.equal(calls.length, 0);
});
test('oversized body is rejected even without a Content-Length header', async () => {
  const { handler, calls } = setup();
  assert.equal((await handler(request(JSON.stringify({ ...valid, extra: 'x'.repeat(4_400_001) })))).status, 413);
  assert.equal(calls.length, 0);
});
test('wrong content type and method do not send email', async () => {
  const { handler, calls } = setup();
  assert.equal((await handler(request(valid, { 'Content-Type': 'text/plain' }))).status, 415);
  assert.equal((await handler(new Request(origin + '/api/enquiries/'))).status, 405);
  assert.equal(calls.length, 0);
});
test('missing configuration fails safely without claiming success', async () => {
  const { handler, calls } = setup({ apiKey: undefined });
  assert.equal((await handler(request())).status, 503);
  assert.equal(calls.length, 0);
});
test('provider failures and unexpected responses never claim successful submission or leak content', async () => {
  for (const provider of [
    async () => Response.json({ message: 'secret provider error' }, { status: 403 }),
    async () => Response.json({}),
    async () => { throw new Error('secret timeout details'); },
  ]) {
    const { handler, logs } = setup({ fetch: provider });
    const result = await handler(request());
    assert.equal(result.status, 502);
    assert.equal((await result.text()).includes('secret'), false);
    assert.equal(logs.length, 1);
  }
});
test('provider throttling stays a retryable 429', async () => {
  const { handler } = setup({ fetch: async () => Response.json({}, { status: 429 }) });
  assert.equal((await handler(request())).status, 429);
});

test('bot verdicts and inconclusive verification cannot send even a valid enquiry', async () => {
  for (const verdict of [{ isBot: true }, {}]) {
    const { handler, calls } = setup({ verifyBot: async () => verdict });
    assert.equal((await handler(request())).status, 403);
    assert.equal(calls.length, 0);
  }
});
test('bot verification errors fail closed without leaking details or sending', async () => {
  const { handler, calls } = setup({ verifyBot: async () => { throw new Error('secret check failure'); } });
  const result = await handler(request());
  assert.equal(result.status, 503);
  assert.equal((await result.text()).includes('secret'), false);
  assert.equal(calls.length, 0);
});
test('a service page enquiry names that page in the email', async () => {
  const { handler, calls } = setup();
  const result = await handler(request({ ...valid, page: 'equipment-maintenance' }));
  assert.equal(result.status, 200);
  assert.match(calls[0].payload.text, /Sent from: Equipment maintenance page/);
});
test('enquiries without a page omit the line; unknown pages are rejected', async () => {
  const { handler, calls } = setup();
  await handler(request());
  assert.doesNotMatch(calls[0].payload.text, /Sent from:/);
  const result = await handler(request({ ...valid, page: 'https://attacker.example/' }));
  assert.equal(result.status, 400);
  assert.equal(calls.length, 1);
});
const jpeg = (size = 2000) => Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(size)]).toString('base64');
test('photos are attached as JPEGs with server-chosen names and counted in the email', async () => {
  const { handler, calls } = setup();
  const result = await handler(request({ ...valid, photos: [jpeg(), jpeg()] }));
  assert.equal(result.status, 200);
  assert.deepEqual(calls[0].payload.attachments.map((a) => a.filename), ['photo-1.jpg', 'photo-2.jpg']);
  assert.equal(calls[0].payload.attachments[0].content, jpeg());
  assert.match(calls[0].payload.text, /Photos attached: 2/);
});
test('enquiries without photos send no attachments', async () => {
  const { handler, calls } = setup();
  await handler(request());
  assert.equal(calls[0].payload.attachments, undefined);
  assert.doesNotMatch(calls[0].payload.text, /Photos attached/);
});
test('too many, non-JPEG, oversized or malformed photos are rejected without sending', async () => {
  const { handler, calls } = setup();
  const bad = [
    [jpeg(), jpeg(), jpeg(), jpeg(), jpeg()],
    [Buffer.from('%PDF-1.7 not a photo').toString('base64')],
    [jpeg(950_000)],
    ['not base64!'],
    'photo',
  ];
  for (const photos of bad) assert.equal((await handler(request({ ...valid, photos }))).status, 400);
  assert.equal(calls.length, 0);
});
