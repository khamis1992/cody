# Cloudflare Development Rules

**MANDATORY RULES FOR ALL DEVELOPERS**  
**Last Updated:** October 3, 2025  
**Status:** ENFORCED

---

## ⚠️ CRITICAL RULES - NEVER VIOLATE

### Rule #1: NEVER Import Node.js Built-in Modules

**❌ FORBIDDEN:**
```typescript
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import os from 'os';
import child_process from 'child_process';
import http from 'http';
import https from 'https';
import net from 'net';
import stream from 'stream';
import buffer from 'buffer';
```

**✅ ALLOWED (Web APIs):**
```typescript
// Use Web Crypto API
const hash = await crypto.subtle.digest('SHA-256', data);

// Use fetch API
const response = await fetch('https://api.example.com');

// Use TextEncoder/TextDecoder
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Use URL API
const url = new URL('https://example.com');
```

**WHY:** Cloudflare Workers runtime doesn't support Node.js built-in modules. They will cause build failures.

---

### Rule #2: Always Use Web Crypto API for Cryptography

**❌ WRONG:**
```typescript
import crypto from 'crypto';
const hash = crypto.createHash('sha256').update(data).digest('hex');
```

**✅ CORRECT:**
```typescript
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Usage
const hash = await sha256(data);
```

**Common Hash Algorithms:**
- SHA-1: `crypto.subtle.digest('SHA-1', data)`
- SHA-256: `crypto.subtle.digest('SHA-256', data)`
- SHA-384: `crypto.subtle.digest('SHA-384', data)`
- SHA-512: `crypto.subtle.digest('SHA-512', data)`

---

### Rule #3: Use Fetch API for HTTP Requests

**❌ WRONG:**
```typescript
import http from 'http';
import https from 'https';
import axios from 'axios'; // Uses Node.js http/https internally
```

**✅ CORRECT:**
```typescript
// Use native fetch
const response = await fetch('https://api.example.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});

const result = await response.json();
```

---

### Rule #4: Check Dependencies Before Installing

**BEFORE installing any new package:**

```bash
# 1. Check if it uses Node.js built-ins
npm info <package-name> dependencies

# 2. Check the package source on npm/GitHub
# Look for imports of: fs, path, crypto, http, child_process, etc.

# 3. Search for Cloudflare-compatible alternatives
# Example: Use 'jose' instead of 'jsonwebtoken'
```

**Common Problematic Packages:**
- ❌ `express` (use only with nodejs_compat)
- ❌ `jsonwebtoken` (use `jose` instead)
- ❌ `bcrypt` (use `bcryptjs` instead)
- ❌ `node-fetch` (use native `fetch`)
- ❌ `axios` (use native `fetch`)

**Cloudflare-Compatible Alternatives:**
- ✅ `jose` for JWT
- ✅ `bcryptjs` for password hashing
- ✅ Native `fetch` for HTTP
- ✅ `@cloudflare/workers-types` for types

---

### Rule #5: Keep wrangler.toml Updated

**Minimum Required Configuration:**

```toml
name = "cody"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "build/client"
```

**NEVER remove wrangler.toml** unless you're 100% sure no dependencies need Node.js modules.

**When to update compatibility_date:**
- When Cloudflare releases new features
- At least every 6 months
- Check: https://developers.cloudflare.com/workers/configuration/compatibility-dates/

---

### Rule #6: Test Locally Before Pushing

**MANDATORY before every commit:**

```bash
# 1. Clean build
rm -rf build .cache

# 2. Build the project
pnpm run build

# 3. Test with wrangler locally
pnpm run preview
# OR
wrangler pages dev build/client

# 4. Test in browser
open http://localhost:8788
```

**If build fails locally, it WILL fail on Cloudflare.**

---

### Rule #7: Use Remix Cloudflare Packages

**✅ CORRECT:**
```json
{
  "dependencies": {
    "@remix-run/cloudflare": "^2.17.1",
    "@remix-run/cloudflare-pages": "^2.17.1",
    "@remix-run/react": "^2.17.1"
  },
  "devDependencies": {
    "@remix-run/dev": "^2.17.1"
  }
}
```

**⚠️ CAREFUL WITH:**
```json
{
  "dependencies": {
    "@remix-run/node": "^2.17.1"  // Only if you need it AND have nodejs_compat
  }
}
```

---

### Rule #8: Keep Functions Handler Simple

**File:** `functions/[[path]].ts`

**✅ CORRECT (Simple):**
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

**❌ WRONG (Complex):**
- Don't add custom error handling
- Don't add manual routing logic
- Don't add API route handling
- Let Remix handle everything

---

### Rule #9: Avoid File System Operations

**❌ FORBIDDEN:**
```typescript
import fs from 'fs';
fs.readFileSync('file.txt');
fs.writeFileSync('file.txt', data);
```

**✅ ALTERNATIVES:**
```typescript
// Use Cloudflare KV for key-value storage
await env.MY_KV.put('key', 'value');
const value = await env.MY_KV.get('key');

// Use Cloudflare R2 for file storage
await env.MY_BUCKET.put('file.txt', data);
const file = await env.MY_BUCKET.get('file.txt');

// Use Cloudflare D1 for database
const result = await env.DB.prepare('SELECT * FROM users').all();
```

---

### Rule #10: Use Environment Variables Correctly

**In Cloudflare Pages:**

```typescript
// ✅ Access via context.env
export const loader = async ({ context }: LoaderFunctionArgs) => {
  const apiKey = context.env.API_KEY;
  return json({ apiKey });
};

// ❌ WRONG - process.env doesn't work in Workers
const apiKey = process.env.API_KEY; // undefined!
```

**Set environment variables in Cloudflare Dashboard:**
1. Go to Pages project → Settings → Environment variables
2. Add variables for Production and Preview
3. Redeploy after adding variables

---

## 🔍 PRE-COMMIT CHECKLIST

Before committing any code, verify:

- [ ] No Node.js built-in imports (`crypto`, `fs`, `path`, etc.)
- [ ] Using Web Crypto API for hashing/encryption
- [ ] Using `fetch` for HTTP requests
- [ ] All dependencies are Cloudflare-compatible
- [ ] `wrangler.toml` is present and correct
- [ ] Local build succeeds (`pnpm run build`)
- [ ] Local preview works (`pnpm run preview`)
- [ ] No file system operations
- [ ] Environment variables accessed via `context.env`
- [ ] Functions handler is simple and clean

---

## 🚨 COMMON ERRORS AND SOLUTIONS

### Error: "Could not resolve 'crypto'"

**Cause:** Using Node.js crypto module

**Solution:**
```typescript
// Replace this:
import crypto from 'crypto';

// With this:
// Use crypto.subtle (Web Crypto API)
```

### Error: "Could not resolve 'fs'"

**Cause:** Trying to use file system

**Solution:**
- Use Cloudflare R2 for file storage
- Use Cloudflare KV for key-value storage
- Remove file system operations

### Error: "Failed building Pages Functions"

**Cause:** Dependencies using Node.js built-ins

**Solution:**
1. Add `nodejs_compat` to `wrangler.toml`:
```toml
compatibility_flags = ["nodejs_compat"]
```
2. OR replace the dependency with a Cloudflare-compatible alternative

### Error: "process.env is undefined"

**Cause:** Using Node.js process.env

**Solution:**
```typescript
// Replace this:
const apiKey = process.env.API_KEY;

// With this:
export const loader = async ({ context }: LoaderFunctionArgs) => {
  const apiKey = context.env.API_KEY;
};
```

---

## 📚 REQUIRED READING

**Before adding ANY new feature, read:**

1. [Cloudflare Workers Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/)
2. [Remix on Cloudflare Pages](https://remix.run/docs/en/main/guides/deployment#cloudflare-pages)
3. [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
4. [Compatibility Dates](https://developers.cloudflare.com/workers/configuration/compatibility-dates/)

---

## 🎯 GOLDEN RULES SUMMARY

1. **NO Node.js built-ins** - Use Web APIs
2. **Use Web Crypto API** - Not Node.js crypto
3. **Use fetch** - Not http/https/axios
4. **Check dependencies** - Before installing
5. **Keep wrangler.toml** - With nodejs_compat
6. **Test locally** - Before pushing
7. **Simple functions handler** - Don't overcomplicate
8. **No file system** - Use KV/R2/D1
9. **Use context.env** - Not process.env
10. **Follow checklist** - Before every commit

---

**VIOLATION OF THESE RULES WILL CAUSE DEPLOYMENT FAILURES**

**When in doubt, ask:** "Does this work in a browser?" If no, it won't work on Cloudflare.
