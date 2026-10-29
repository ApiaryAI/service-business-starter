'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { company, services } from '../lib/content';
import { PROJECT_TYPES, SOURCES, EMPTY, compose, type Fields } from '../lib/enquiry';
import { trackAction, trackEnquiry } from '../lib/tracking';
import { MAX_PHOTOS, shrinkPhoto, type Photo } from '../lib/photos';

/* Direct sending is enabled only when the server has its sender and API key configured.
   With it, the form sends straight away; without it, the visitor reviews an email to send themselves.
   On a service page, `service` preselects that service and `page` names the page in the enquiry. */

export function Enquiry({ enabled = false, service, page }: { enabled?: boolean; service?: string; page?: { slug: string; title: string } }) {
  const [f, setF] = useState<Fields>(() => {
    const match = services.find((s) => s.id === service);
    return match ? { ...EMPTY, service: match.enquiry } : EMPTY;
  });
  const [ready, setReady] = useState(false);
  const [copy, setCopy] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');
  const [website, setWebsite] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoNote, setPhotoNote] = useState('');
  const [shrinking, setShrinking] = useState(false);
  const photoUrls = useRef<string[]>([]);
  const started = useRef(false);
  const reviewed = useRef(false);
  const inFlight = useRef(false);
  const requestId = useRef('');
  const status = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('service');
    const match = services.find((s) => s.id === wanted);
    if (match) setF((x) => ({ ...x, service: match.enquiry }));
  }, []);

  useEffect(() => { if (ready || sent || sendError) status.current?.focus(); }, [ready, sent, sendError]);
  useEffect(() => { photoUrls.current = photos.map((p) => p.url); }, [photos]);
  useEffect(() => () => photoUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const changed = () => { setReady(false); setCopy(''); setSendError(''); requestId.current = ''; };

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    const room = MAX_PHOTOS - photos.length;
    const chosen = Array.from(files).slice(0, room);
    const notes: string[] = files.length > room ? [`You can attach up to ${MAX_PHOTOS} photos.`] : [];
    setShrinking(true);
    const added: Photo[] = [];
    for (const file of chosen) {
      try { added.push(await shrinkPhoto(file)); }
      catch { notes.push(`${file.name} could not be read. Please use a JPEG or PNG photo.`); }
    }
    setShrinking(false);
    setPhotos((x) => [...x, ...added]);
    setPhotoNote(notes.join(' '));
    if (added.length) changed();
  };

  const removePhoto = (id: string) => {
    setPhotos((x) => {
      const gone = x.find((p) => p.id === id);
      if (gone) URL.revokeObjectURL(gone.url);
      return x.filter((p) => p.id !== id);
    });
    setPhotoNote('');
    changed();
  };

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    if (!started.current) {
      started.current = true;
      trackAction('enquiry_form_start');
    }
    setF((x) => ({ ...x, [k]: e.target.value }));
    setReady(false);
    setCopy('');
    setSendError('');
    requestId.current = '';
  };

  // Photos travel only with direct sending; an email app cannot receive them from this page.
  const { subject, body } = compose(f, page?.title, enabled ? photos.length : 0);
  const mailto = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, '\r\n'))}`;

  const send = async () => {
    if (inFlight.current || sending || sent) return;
    inFlight.current = true;
    if (!requestId.current) requestId.current = crypto.randomUUID();
    if (!website.trim()) trackAction('enquiry_send_attempt');
    let failure: 'verification' | 'rate_limit' | 'server' | 'network' = 'network';
    setSending(true);
    setSendError('');
    try {
      const response = await fetch('/api/enquiries/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, ...(page ? { page: page.slug } : {}), ...(photos.length ? { photos: photos.map((p) => p.content) } : {}), website, requestId: requestId.current }),
      });
      failure = response.status === 403 ? 'verification' : response.status === 429 ? 'rate_limit' : 'server';
      if (response.status === 413) throw new Error('Your photos are too large to send. Remove one or two and try again, or email them to us.');
      if (!response.ok) {
        if (response.status === 403) throw new Error('Browser verification failed. Please reload this page and try again, or email or call us.');
        if (response.status === 429) throw new Error('Too many attempts. Please wait a minute and try again, or call us.');
        throw new Error('Your enquiry could not be sent. Please try again, email us directly or call us.');
      }
      const result = await response.json();
      if (result.ok !== true) throw new Error('Your enquiry could not be sent. Please email or call us.');
      setSent(true);
      // The honeypot response looks like success, but it is not a real enquiry.
      if (!website.trim()) trackEnquiry('form', 'enquiry_form');
    } catch (error) {
      if (!website.trim()) trackAction('enquiry_send_failed', 'enquiry_form', failure);
      setSendError(error instanceof Error ? error.message : 'Your enquiry could not be sent. Please email or call us.');
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (enabled) return send();
    if (!reviewed.current) { reviewed.current = true; trackAction('enquiry_review'); }
    setReady(true);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${company.email}\nSubject: ${subject}\n\n${body}`);
      trackAction('enquiry_copy');
      setCopy('Copied. Paste it into a new email to ' + company.email + '.');
    } catch {
      setCopy('Copying is not available in this browser. Select the preview text and copy it manually.');
    }
  };

  const field = (k: keyof Fields) => `${id}-${k}`;
  const chosenSource = SOURCES.find((x) => x.label === f.source);
  const sourceDetail = chosenSource?.detail;

  return (
    <div className="hk-enquiry">
      <p className="hk-enquiry__note">
        {enabled ? 'Send your enquiry directly to our team. Contact us to confirm availability.' : 'Prepare an email to send from your own email app, or call our team.'}
      </p>
      <form onSubmit={submit}>
        <fieldset disabled={sending || sent} className="hk-enquiry__fieldset">
        <div className="hk-enquiry__trap" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Leave this field empty</label>
          <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <div className="hk-fields">
          <div className="field">
            <label htmlFor={field('name')}>Your name <span aria-hidden="true">*</span></label>
            <input id={field('name')} required minLength={2} maxLength={100} autoComplete="name" value={f.name} onChange={set('name')} />
          </div>
          <div className="field">
            <label htmlFor={field('phone')}>Phone <span aria-hidden="true">*</span></label>
            <input id={field('phone')} required minLength={6} maxLength={40} type="tel" autoComplete="tel" inputMode="tel" value={f.phone} onChange={set('phone')} />
          </div>
          <div className="field">
            <label htmlFor={field('email')}>Email</label>
            <input id={field('email')} type="email" maxLength={254} autoComplete="email" value={f.email} onChange={set('email')} />
          </div>
          <div className="field">
            <label htmlFor={field('location')}>Site suburb or address</label>
            <input id={field('location')} maxLength={200} autoComplete="street-address" value={f.location} onChange={set('location')} />
          </div>
          <div className="field">
            <label htmlFor={field('service')}>Service</label>
            <select id={field('service')} value={f.service} onChange={set('service')}>
              {services.map((s) => <option key={s.id}>{s.enquiry}</option>)}
              <option>General enquiry</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor={field('projectType')}>Project type</label>
            <select id={field('projectType')} value={f.projectType} onChange={set('projectType')}>
              {PROJECT_TYPES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="field field--wide">
            <label htmlFor={field('message')}>How can we help? <span aria-hidden="true">*</span></label>
            <textarea id={field('message')} required minLength={10} rows={5} maxLength={1500} value={f.message} onChange={set('message')} placeholder="For example: the equipment or property, the issue you have noticed, or the service you would like." />
          </div>
          <div className="field">
            <label htmlFor={field('source')}>How did you find us?</label>
            <select id={field('source')} value={f.source} onChange={(e) => { set('source')(e); setF((x) => ({ ...x, sourceDetail: '' })); }}>
              <option value="">Choose one (optional)</option>
              {SOURCES.map((x) => <option key={x.label}>{x.label}</option>)}
            </select>
          </div>
          <div className="field field--wide">
            <label htmlFor={`${id}-photos`}>Photos (optional)</label>
            <p className="hk-photos__hint" id={`${id}-photos-hint`}>Up to {MAX_PHOTOS} photos of the equipment, property or problem. We shrink them and remove location data before sending.</p>
            {photos.length < MAX_PHOTOS && (
              <input id={`${id}-photos`} type="file" accept="image/*" multiple aria-describedby={`${id}-photos-hint`} disabled={shrinking} onChange={(e) => { void addPhotos(e.target.files); e.target.value = ''; }} />
            )}
            {shrinking && <p className="hk-photos__hint" role="status">Preparing photos…</p>}
            {photos.length > 0 && (
              <ul className="hk-photos" aria-label="Attached photos">
                {photos.map((p, i) => (
                  <li key={p.id}>
                    {/* A local blob preview, so a plain img rather than next/image. */}
                    <img src={p.url} alt={`Photo ${i + 1}`} />
                    <button type="button" onClick={() => removePhoto(p.id)} aria-label={`Remove photo ${i + 1}`}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
            {photoNote && <p className="hk-photos__note" role="alert">{photoNote}</p>}
          </div>
          {sourceDetail && (
            <div className="field">
              <label htmlFor={field('sourceDetail')}>{sourceDetail}</label>
              <input id={field('sourceDetail')} maxLength={120} placeholder={chosenSource?.hint} value={f.sourceDetail} onChange={set('sourceDetail')} />
            </div>
          )}
        </div>
        <p className="hk-enquiry__req"><span aria-hidden="true">*</span> Required</p>
        <button type="submit" className="btn">{!enabled ? 'Review enquiry' : sent ? 'Enquiry sent ✓' : sending ? 'Sending…' : 'Send enquiry'}</button>
        </fieldset>
      </form>

      {enabled && (sent || sendError) && (
        <div className="hk-enquiry__result" ref={status} tabIndex={-1}>
          {sent
            ? <p className="hk-enquiry__status" role="status"><strong>Your enquiry has been sent.</strong> Our team will get back to you. For availability, phone {company.phone}.</p>
            : <p className="hk-enquiry__status" role="alert">{sendError}<br /><a href={mailto}>{company.email}</a> · <a href={company.tel}>{company.phone}</a></p>}
        </div>
      )}

      {!enabled && ready && (
        <div className="hk-enquiry__ready" ref={status} tabIndex={-1} role="region" aria-label="Enquiry preview">
          <p className="hk-enquiry__status" role="status">
            <strong>Not sent yet.</strong> Check the details below, then open them in your email app and press send.
          </p>
          {photos.length > 0 && <p className="hk-photos__note">Attach your {photos.length === 1 ? 'photo' : `${photos.length} photos`} to the email before you send it. Your email app cannot receive them from this page.</p>}
          <pre className="hk-enquiry__preview">{`To: ${company.email}\nSubject: ${subject}\n\n${body}`}</pre>
          <div className="hk-enquiry__actions">
            <a className="btn" href={mailto}>Open in email app</a>
            <button type="button" className="btn btn--ghost" onClick={copyText}>Copy enquiry</button>
          </div>
          <p className="hk-enquiry__copy" aria-live="polite">{copy}</p>
          <p className="hk-enquiry__fallback">
            If your email app does not open, email <a href={`mailto:${company.email}`}>{company.email}</a> or call <a href={company.tel}>{company.phone}</a>.
          </p>
        </div>
      )}
    </div>
  );
}
