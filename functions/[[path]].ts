import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

// Cloudflare Pages Function handler for Remix
export const onRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => {
    return {
      cloudflare: context.env,
    };
  },
});
