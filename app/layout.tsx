import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '../components/blocks';
import { Header } from '../components/Header';
import { Tracking } from '../components/Tracking';
import { EmergencyBar } from '../components/Sections';
import { socialProfiles } from '../lib/sections';
import { getMenus } from '../lib/menus';
import { company } from '../lib/content';
import { motionBootScript } from '../lib/motion-boot';
import { businessStructuredData, IS_PRODUCTION_DEPLOYMENT, SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from '../lib/seo';
import './globals.css';
export const metadata: Metadata = {
 metadataBase: new URL(SITE_URL), title: { default: SITE_TITLE, template: `%s | ${company.name}` },
 description: SITE_DESCRIPTION, applicationName: company.name,
 robots: { index: IS_PRODUCTION_DEPLOYMENT, follow: IS_PRODUCTION_DEPLOYMENT },
 openGraph: { type: 'website', locale: company.locale, siteName: company.name, title: SITE_TITLE, description: SITE_DESCRIPTION },
 formatDetection: { telephone: true, email: true },
};
export const viewport: Viewport = { themeColor: '#ffffff', colorScheme: 'light' };
const sameAs = socialProfiles(company.readyForLaunch);
const withProfiles = sameAs.length ? { ...businessStructuredData, '@graph': businessStructuredData['@graph'].map(n => n['@type'] === 'Organization' ? { ...n, sameAs } : n) } : businessStructuredData;
export default function RootLayout({ children }: { children: ReactNode }) {
 return <html lang={company.language} suppressHydrationWarning><head>
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(withProfiles).replace(/</g, '\\u003c') }} />
  <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
  <link rel="preload" href="/libre-franklin.woff2" as="font" type="font/woff2" crossOrigin="" />
 </head><body>
  <a className="skip-link" href="#main">Skip to content</a>
  {!company.readyForLaunch && <div className="starter-demo">Demonstration site — business and contact details are examples.</div>}
  <EmergencyBar />
  <Header menus={getMenus(true)} /><main id="main" tabIndex={-1}>{children}</main><Footer showGuides /><Tracking />
 </body></html>;
}
