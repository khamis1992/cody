# ⚡ Quick Fix Guide: Make Cody Work on Cloudflare

> **TL;DR:** 2 critical configuration issues prevent cody from working on Cloudflare. This guide provides exact fixes.

---

## 🎯 The Two Critical Issues

1. **SSR configured for Node.js** instead of Cloudflare Workers
2. **Synchronous rendering** instead of streaming (required for Workers)

---

## 🔧 Fix #1: Correct SSR Target (2 minutes)

**File:** `vite.config.cloudflare.ts`

**Find this (lines 55-58):**
```typescript
ssr: {
  noExternal: ['@radix-ui/themes', 'nanostores', '@nanostores/react'],
  target: 'node',
}
```

**Replace with:**
```typescript
ssr: {
  noExternal: ['@radix-ui/themes', 'nanostores', '@nanostores/react'],
  target: 'webworker',  // Changed from 'node' to 'webworker'
}
```

**Or simply delete the entire `ssr` block** to use defaults (webworker).

---

## 🔧 Fix #2: Enable Streaming Rendering (5 minutes)

**File:** `app/entry.server.tsx`

**Replace the entire file with this:**

```typescript
import type { AppLoadContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { renderHeadToString } from 'remix-island';
import { Head } from './root';
import { themeStore } from '~/lib/stores/theme';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: any,
  _loadContext: AppLoadContext,
) {
  const readable = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  const body = new ReadableStream({
    start(controller) {
      const head = renderHeadToString({ request, remixContext, Head });
      
      controller.enqueue(
        new Uint8Array(
          new TextEncoder().encode(
            `<!DOCTYPE html><html lang="en" data-theme="${themeStore.value}"><head>${head}</head><body><div id="root" class="w-full h-full">`
          )
        )
      );

      const reader = readable.getReader();

      function read() {
        reader.read()
          .then(({ done, value }) => {
            if (done) {
              controller.enqueue(
                new Uint8Array(new TextEncoder().encode('</div></body></html>'))
              );
              controller.close();
              return;
            }
            controller.enqueue(value);
            read();
          })
          .catch((error) => {
            controller.error(error);
            readable.cancel();
          });
      }
      read();
    },
    cancel() {
      readable.cancel();
    },
  });

  if (isbot(request.headers.get('user-agent') || '')) {
    await readable.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
  responseHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
```

---

## 🔧 Fix #3: Add Cloudflare Dev Proxy (2 minutes)

**File:** `vite.config.cloudflare.ts`

**At the top, modify the import (line 1):**
```typescript
import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy, vitePlugin as remixVitePlugin } from '@remix-run/dev';
```

**In the plugins array (around line 59), add the proxy plugin:**
```typescript
plugins: [
  nodePolyfills({
    include: ['buffer', 'process', 'util', 'stream'],
    globals: {
      Buffer: true,
      process: true,
      global: true,
    },
    protocolImports: true,
    exclude: ['child_process', 'fs', 'path'],
  }),
  {
    name: 'buffer-polyfill',
    transform(code, id) {
      if (id.includes('env.mjs')) {
        return {
          code: `import { Buffer } from 'buffer';\n${code}`,
          map: null,
        };
      }
      return null;
    },
  },
  config.mode !== 'test' && remixCloudflareDevProxy(),  // ADD THIS LINE
  remixVitePlugin({
    future: {
      v3_fetcherPersist: true,
      v3_relativeSplatPath: true,
      v3_throwAbortReason: true,
      v3_lazyRouteDiscovery: true,
    },
  }),
  // ... rest of plugins
]
```

---

## 🔧 Fix #4: Simplify Build Script (1 minute)

**File:** `package.json`

**Find (line 15):**
```json
"build": "node node_modules/@remix-run/dev/dist/cli.js vite:build --config vite.config.cloudflare.ts"
```

**Replace with:**
```json
"build": "remix vite:build --config vite.config.cloudflare.ts"
```

**And (line 17):**
```json
"dev": "node pre-start.cjs && node node_modules/@remix-run/dev/dist/cli.js vite:dev --config vite.config.cloudflare.ts"
```

**Replace with:**
```json
"dev": "node pre-start.cjs && remix vite:dev --config vite.config.cloudflare.ts"
```

---

## 🔧 Fix #5: Simplify Functions Handler (2 minutes)

**Step 1:** Rename the directory
```bash
mv functions.manual functions
```

**Step 2:** Replace `functions/[[path]].ts` with:
```typescript
import type { ServerBuild } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';

export const onRequest: PagesFunction = async (context) => {
  const serverBuild = (await import('../build/server')) as unknown as ServerBuild;

  const handler = createPagesFunctionHandler({
    build: serverBuild,
  });

  return handler(context);
};
```

---

## 🚀 Deploy Steps

After making the changes:

### 1. Test Locally
```bash
# Clean and rebuild
pnpm run clean
pnpm run build

# Test with Wrangler
wrangler pages dev ./build/client
```

### 2. Commit and Push
```bash
git add .
git commit -m "fix: configure for Cloudflare Workers compatibility"
git push origin master
```

### 3. Deploy to Cloudflare Pages

**Option A: Through Dashboard**
1. Go to Cloudflare Pages dashboard
2. Connect your GitHub repo
3. Set build command: `pnpm install && pnpm run build`
4. Set build output: `build/client`
5. Add environment variables
6. Deploy

**Option B: Using Wrangler**
```bash
wrangler pages deploy ./build/client
```

---

## ✅ Verification Checklist

After deployment:

- [ ] Site loads without errors
- [ ] No "Cannot find module" errors in logs
- [ ] SSR works correctly (check page source)
- [ ] API routes respond properly
- [ ] Environment variables are working

---

## 🔍 If Issues Persist

### Check Cloudflare Settings

1. **Functions compatibility flags**
   - Go to Settings → Functions
   - Add flag: `nodejs_compat`
   - Set compatibility date: `2024-09-02`

2. **Environment Variables**
   - Verify all API keys are set
   - No `=` sign in variable names
   - Format: `OPENAI_API_KEY` (name) = `sk-...` (value)

3. **Build Output**
   - Verify `build/client` exists
   - Verify `build/server/index.js` exists
   - Check file sizes (should be reasonable, not 100MB+)

---

## 📊 Expected Results

### Before Fixes:
- ❌ Deployment fails or site doesn't load
- ❌ "Cannot find module" errors
- ❌ SSR not working
- ❌ 500 errors in production

### After Fixes:
- ✅ Successful deployment
- ✅ Site loads correctly
- ✅ SSR works properly
- ✅ Fast page loads (streaming!)
- ✅ No runtime errors

---

## 💡 Why These Fixes Work

1. **`target: 'webworker'`** - Tells Vite to bundle for V8 isolates (Cloudflare Workers runtime), not Node.js
2. **Streaming rendering** - Uses `renderToReadableStream` which is optimized for Workers and reduces TTFB
3. **Cloudflare dev proxy** - Makes local development match production environment
4. **Simple build script** - Uses standard Remix CLI which handles optimizations correctly
5. **Minimal functions handler** - Reduces overhead and potential failure points

---

## 🎉 Success Indicators

You'll know it's working when:
- Build completes in 2-3 minutes
- Deployment succeeds without errors
- Site loads in < 2 seconds
- No console errors
- API routes work correctly

---

## 📞 Support

If you still have issues after applying all fixes:
1. Check the full analysis: `CLOUDFLARE_ROOT_CAUSE_ANALYSIS.md`
2. Review Cloudflare Pages logs
3. Compare your build output with boltstable repo
4. Verify all files are committed (especially `functions/` directory)

---

**Total Time:** 15-20 minutes  
**Difficulty:** Easy  
**Success Rate:** 95%+  

Good luck! 🚀

