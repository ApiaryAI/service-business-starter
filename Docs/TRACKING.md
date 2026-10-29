# Enquiry measurement

The retained implementation separates stages from contact outcomes. Vercel receives the detailed stages; additional providers receive contact events only when configured and permitted.

| Event | Meaning |
| --- | --- |
| `enquiry_cta_click` | Same-origin contact link or the service page's `#enquire` button |
| `enquiry_form_start` | First field edit per form mount |
| `enquiry_review` | First valid review in email-app mode; direct sending skips it |
| `enquiry_send_attempt` | Attempt to send through the website |
| `enquiry_send_failed` | Fixed verification/rate_limit/server/network error category |
| `enquiry_copy` | Prepared message copied successfully |
| `enquiry`, `kind=form` | Server confirms acceptance, not inbox delivery or a won job |
| `enquiry`, `kind=phone` / `email` | Phone/email link tap, not a connected call or sent email |

Vercel custom properties are pathname and placement (`header`, `footer`, `hero`, `contact_band`, `enquiry_form`, `content`); failures also have a fixed category. No form values, query strings, contacts or exception text are included. Inspect enabled SDK pageview behaviour separately for the deployed configuration.

Optional integrations: PostHog (`enquiry`, autocapture and session replay disabled), GA4 (`generate_lead`), Google Ads conversion, Meta (`Lead` for forms, `Contact` for phone/email). Empty IDs keep each provider off. The cookie-consent key is `service-consent-v1`; preferences expire after 180 days. With only cookieless Vercel configured, the site does not show a cookie banner.

Do not add stage totals together as leads. Aggregate event counts do not establish a person's ordered journey or a reliable abandonment rate. Email-app review counts and direct-submit counts describe different paths. Repeated phone taps are not multiple confirmed leads. Validate traffic volume and test activity before changing the form based on percentages.
