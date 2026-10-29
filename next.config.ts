import type { NextConfig } from 'next';
import { withBotId } from 'botid/next/config';
const posthogRegion = process.env.NEXT_PUBLIC_POSTHOG_REGION === 'eu' ? 'eu' : 'us';
// Pages remain pre-rendered; the enquiry POST needs a Vercel server function.
const config: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  // Serves PostHog through this domain so tracking blockers drop fewer events.
  // Keep the path in sync with posthogProxyPath in lib/tracking.ts.
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: `https://${posthogRegion}-assets.i.posthog.com/static/:path*` },
      { source: '/ingest/array/:path*', destination: `https://${posthogRegion}-assets.i.posthog.com/array/:path*` },
      { source: '/ingest/:path*', destination: `https://${posthogRegion}.i.posthog.com/:path*` },
    ];
  },
};
export default withBotId(config);
