// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import outboundNofollow from './scripts/astro-outbound-nofollow.mjs';

export default defineConfig({
  site: 'https://www.slothub.com.tw',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  integrations: [react(), outboundNofollow()],
});
