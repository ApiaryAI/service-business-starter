const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { transformSync } = require('next/dist/build/swc');
const plain = value => JSON.parse(JSON.stringify(value));
function compile(file, globals = {}, imports = {}) {
  const exports = {};
  vm.runInNewContext(transformSync(fs.readFileSync(file, 'utf8'), {
    filename: file, module: { type: 'commonjs' },
    jsc: { target: 'es2022', parser: { syntax: 'typescript', tsx: file.endsWith('.tsx') }, transform: { react: { runtime: 'automatic' } } },
  }).code, { exports, module: { exports }, require: name => imports[name] ?? require(name), ...globals });
  return exports;
}
function setup(env = {}) {
  const calls = [];
  const tracking = compile('lib/tracking.ts', {
    process: { env }, URL, crypto: { randomUUID: () => 'test-enquiry-id' },
    window: { location: { origin: 'https://example.com', pathname: '/contact/', search: '?email=private@example.com' } },
  });
  const connect = () => tracking.setVercelTracker((...args) => calls.push(plain(args)));
  const consent = analytics => tracking.setTrackingConsent({ analytics, marketing: false });
  return { tracking, calls, connect, consent };
}
test('unconsented actions never enter a later SDK queue', () => {
  const x = setup();
  x.tracking.trackAction('enquiry_form_start'); x.tracking.trackEnquiry('phone');
  x.consent(true); x.connect(); assert.equal(x.calls.length, 0);
});
test('early actions flush once; withdrawing consent drops queued history', () => {
  const x = setup(); x.consent(true); x.tracking.trackAction('enquiry_review');
  x.connect(); x.connect(); assert.equal(x.calls.length, 1);
  const y = setup(); y.consent(true); y.tracking.trackAction('enquiry_review');
  y.consent(false); y.consent(true); y.connect(); assert.equal(y.calls.length, 0);
});
test('blocked SDK queues stay bounded and provider exceptions cannot break a form', () => {
  const x = setup(); x.consent(true);
  for (let i = 0; i < 130; i++) x.tracking.trackAction('enquiry_review');
  x.connect(); assert.equal(x.calls.length, 100);
  x.tracking.setVercelTracker(() => { throw Error('blocked SDK'); });
  assert.doesNotThrow(() => x.tracking.trackAction('enquiry_review'));
  assert.doesNotThrow(() => x.tracking.trackEnquiry('form'));
});
test('contact link classification strips mail contents and URL queries, ignores external and unrelated links', () => {
  const x = setup(); x.consent(true); x.connect();
  const link = (href, location = '') => ({ getAttribute: () => href, closest: selector => selector.includes(location) && location ? {} : null });
  x.tracking.trackContactLink(link('tel:+61399999999', '.hk-header'));
  x.tracking.trackContactLink(link('mailto:private@example.com?body=Secret', '.hk-enquiry'));
  x.tracking.trackContactLink(link('/contact/?service=Secret', '.hk-hero'));
  x.tracking.trackContactLink(link('https://elsewhere.example/contact/'));
  x.tracking.trackContactLink(link('/guides/'));
  x.tracking.trackContactLink(link('#enquire', '.hk-phero'));
  x.tracking.trackContactLink(link('#main'));
  assert.deepEqual(x.calls, [
    ['enquiry', { kind: 'phone', page: '/contact/', placement: 'header' }],
    ['enquiry', { kind: 'email', page: '/contact/', placement: 'enquiry_form' }],
    ['enquiry_cta_click', { page: '/contact/', placement: 'hero' }],
    ['enquiry_cta_click', { page: '/contact/', placement: 'hero' }],
  ]);
});
test('funnel events never become Google or Meta conversions', () => {
  const x = setup({ NEXT_PUBLIC_GA_ID: 'G-TEST', NEXT_PUBLIC_GOOGLE_ADS_ID: 'AW-TEST', NEXT_PUBLIC_GOOGLE_ADS_ENQUIRY: 'AW-TEST/label', NEXT_PUBLIC_META_PIXEL_ID: 'test' });
  const ads = []; x.tracking.setTrackingConsent({ analytics: true, marketing: true }); x.connect();
  x.tracking.setGoogleTag((...args) => ads.push(args)); x.tracking.setMetaPixel((...args) => ads.push(args));
  x.tracking.trackAction('enquiry_send_attempt'); assert.equal(ads.length, 0);
  x.tracking.trackEnquiry('form'); assert.equal(ads.length, 3);
});
function formHarness(response, enabled = true) {
  const x = setup(); x.consent(true); x.connect();
  const slots = []; let cursor = 0;
  const react = {
    useEffect: () => {}, useId: () => 'test-form',
    useState: initial => { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; },
    useRef: initial => { const i = cursor++; return slots[i] ??= { current: initial }; },
  };
  const mod = compile('components/Enquiry.tsx', { crypto: { randomUUID: () => 'request-test' }, fetch: response }, {
    react, '../lib/tracking': x.tracking,
    '../lib/photos': { MAX_PHOTOS: 4, shrinkPhoto: async () => { throw new Error('not used in tracking tests'); } },
    '../lib/content': { company: { email: 'admin@example.com', tel: 'tel:123', phone: '123' }, services: [] },
    '../lib/enquiry': { EMPTY: { name: '', phone: '', message: '', source: '' }, SOURCES: [], PROJECT_TYPES: [], compose: () => ({ subject: 'Private subject', body: 'Private customer details' }) },
  });
  const render = () => { cursor = 0; return mod.Enquiry({ enabled }); };
  function nodes(node) {
    if (!node || typeof node !== 'object') return [];
    if (Array.isArray(node)) return node.flatMap(nodes);
    return [node, ...nodes(node.props?.children)];
  }
  const find = pred => nodes(render()).find(pred);
  return { ...x, find };
}
test('without direct sending, editing multiple fields and re-reviewing counts one start and review, not a lead', () => {
  const x = formHarness(undefined, false);
  x.find(n => n.type === 'input' && n.props.autoComplete === 'name').props.onChange({ target: { value: 'Private name' } });
  x.find(n => n.type === 'input' && n.props.type === 'tel').props.onChange({ target: { value: '0400000000' } });
  for (let i = 0; i < 2; i++) x.find(n => n.type === 'form').props.onSubmit({ preventDefault() {} });
  assert.deepEqual(x.calls.map(c => c[0]), ['enquiry_form_start', 'enquiry_review']);
  assert.ok(!JSON.stringify(x.calls).includes('Private'));
});
test('accepted send records a single form lead; subsequent sends and honeypot successes do not', async () => {
  const x = formHarness(async () => ({ ok: true, status: 200, json: async () => ({ ok: true }) }));
  const submit = () => x.find(n => n.type === 'form').props.onSubmit({ preventDefault() {} });
  await Promise.all([submit(), submit()]);
  assert.deepEqual(x.calls.map(c => c[0]), ['enquiry_send_attempt', 'enquiry']);
  assert.equal(x.find(n => n.type === 'button' && n.props.type === 'submit').props.children, 'Enquiry sent ✓');
  assert.equal(x.find(n => n.type === 'pre'), undefined);
  const bot = formHarness(async () => ({ ok: true, status: 200, json: async () => ({ ok: true }) }));
  bot.find(n => n.type === 'input' && n.props.name === 'website').props.onChange({ target: { value: 'bot' } });
  await bot.find(n => n.type === 'form').props.onSubmit({ preventDefault() {} });
  assert.ok(!bot.calls.some(c => c[0] === 'enquiry'));
});
test('verification, throttling, server and network failures produce no lead or private exception text', async () => {
  for (const [status, failure] of [[403, 'verification'], [429, 'rate_limit'], [500, 'server'], [0, 'network']]) {
    const x = formHarness(async () => { if (!status) throw Error('Private network information'); return { status, ok: false }; });
    await x.find(n => n.type === 'form').props.onSubmit({ preventDefault() {} });
    assert.deepEqual(x.calls.map(c => c[0]), ['enquiry_send_attempt', 'enquiry_send_failed']);
    assert.equal(x.calls.at(-1)[1].failure, failure);
    assert.ok(!JSON.stringify(x.calls).includes('Private'));
  }
});
