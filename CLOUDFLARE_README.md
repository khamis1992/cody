# Cloudflare Development Guidelines

This directory contains comprehensive guidelines and tools to prevent Cloudflare deployment failures.

---

## 📚 Documentation Files

### 1. **CLOUDFLARE_DEVELOPMENT_RULES.md** (MUST READ)
**Purpose:** Complete set of mandatory rules for all developers

**When to read:**
- Before starting any new feature
- Before adding any new dependency
- When encountering deployment errors
- During code review

**Key sections:**
- Critical rules (NEVER violate)
- Pre-commit checklist
- Common errors and solutions
- Required reading

### 2. **CLOUDFLARE_QUICK_REFERENCE.md**
**Purpose:** Quick lookup for common patterns

**When to use:**
- Need to hash data (use Web Crypto API)
- Need to make HTTP requests (use fetch)
- Need to store data (use KV/R2/D1)
- Need code examples

**Key sections:**
- Cryptography examples
- HTTP request patterns
- Storage operations
- Package alternatives

### 3. **PULL_REQUEST_TEMPLATE.md**
**Purpose:** Checklist for code reviews

**When to use:**
- Creating a pull request
- Reviewing someone's code
- Before merging to main

---

## 🛠️ Tools

### 1. Pre-commit Hook (`.husky/pre-commit`)
**Purpose:** Automatically check for Node.js imports before commit

**What it does:**
- Scans staged files for forbidden imports
- Checks if wrangler.toml exists
- Blocks commit if issues found

**How to use:**
```bash
# Automatically runs on: git commit
# To bypass (NOT RECOMMENDED): git commit --no-verify
```

### 2. Compatibility Checker (`scripts/check-cloudflare-compat.sh`)
**Purpose:** Comprehensive compatibility audit

**What it checks:**
- Node.js built-in imports
- wrangler.toml configuration
- Functions handler complexity
- Problematic dependencies
- process.env usage
- File system operations
- Build success

**How to use:**
```bash
# Run manually
pnpm run check:cloudflare

# Or directly
bash scripts/check-cloudflare-compat.sh
```

---

## 🚀 Quick Start

### For New Developers

1. **Read the rules** (15 minutes)
   ```bash
   cat CLOUDFLARE_DEVELOPMENT_RULES.md
   ```

2. **Bookmark the quick reference**
   ```bash
   cat CLOUDFLARE_QUICK_REFERENCE.md
   ```

3. **Run the compatibility checker**
   ```bash
   pnpm run check:cloudflare
   ```

4. **Install pre-commit hooks**
   ```bash
   pnpm install  # Installs husky hooks automatically
   ```

### Before Adding a New Feature

1. **Check if you need Node.js modules**
   - If yes: Use Web APIs instead
   - If unavoidable: Ensure `nodejs_compat` is in wrangler.toml

2. **Check dependencies**
   ```bash
   npm info <package-name> dependencies
   # Look for: crypto, fs, path, http, https, child_process
   ```

3. **Use the quick reference**
   - Find the pattern you need
   - Copy the code example
   - Adapt to your use case

4. **Test locally**
   ```bash
   pnpm run build
   pnpm run preview
   ```

5. **Run compatibility check**
   ```bash
   pnpm run check:cloudflare
   ```

### Before Committing

1. **Run pre-commit checks** (automatic)
   ```bash
   git commit -m "Your message"
   # Pre-commit hook runs automatically
   ```

2. **If blocked, fix the issues**
   ```bash
   # Check what's wrong
   pnpm run check:cloudflare
   
   # Fix the issues
   # Then commit again
   ```

### Before Creating a Pull Request

1. **Fill out the PR template**
   - Check ALL items in the Cloudflare compatibility checklist
   - Provide testing evidence
   - Include build logs

2. **Ensure all checks pass**
   ```bash
   pnpm run check:cloudflare
   pnpm run build
   pnpm run preview
   ```

---

## ⚠️ Common Mistakes

### Mistake #1: Using Node.js crypto
```typescript
// ❌ WRONG
import crypto from 'crypto';
const hash = crypto.createHash('sha256').update(data).digest('hex');

// ✅ CORRECT
async function sha256(data: string) {
  const msgBuffer = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
```

### Mistake #2: Using axios
```typescript
// ❌ WRONG
import axios from 'axios';
const response = await axios.get('https://api.example.com');

// ✅ CORRECT
const response = await fetch('https://api.example.com');
const data = await response.json();
```

### Mistake #3: Using process.env
```typescript
// ❌ WRONG
const apiKey = process.env.API_KEY;

// ✅ CORRECT
export const loader = async ({ context }: LoaderFunctionArgs) => {
  const apiKey = context.env.API_KEY;
  return json({ apiKey });
};
```

### Mistake #4: File system operations
```typescript
// ❌ WRONG
import fs from 'fs';
const content = fs.readFileSync('file.txt', 'utf-8');

// ✅ CORRECT - Use R2
const object = await context.env.MY_BUCKET.get('file.txt');
const content = await object.text();
```

---

## 🆘 Getting Help

### If Build Fails Locally

1. **Check the error message**
   ```bash
   pnpm run build 2>&1 | grep ERROR
   ```

2. **Look for "Could not resolve"**
   - This means you're using a Node.js module
   - Check CLOUDFLARE_DEVELOPMENT_RULES.md for alternatives

3. **Run the compatibility checker**
   ```bash
   pnpm run check:cloudflare
   ```

### If Build Fails on Cloudflare

1. **Download the build log**
   - Go to Cloudflare Pages dashboard
   - Click on failed deployment
   - Download log

2. **Search for the error**
   ```bash
   grep -i "error\|failed" build.log
   ```

3. **Common errors:**
   - "Could not resolve 'crypto'" → Use Web Crypto API
   - "Could not resolve 'fs'" → Use R2/KV
   - "process is not defined" → Use context.env
   - "Failed building Pages Functions" → Check dependencies

### If Still Stuck

1. **Check the quick reference** for code examples
2. **Read the full rules** for detailed explanations
3. **Search Cloudflare docs:** https://developers.cloudflare.com/workers/
4. **Check Remix docs:** https://remix.run/docs/en/main/guides/deployment#cloudflare-pages

---

## 📋 Checklist for Every Feature

Before marking a feature as "done":

- [ ] No Node.js built-in imports
- [ ] Using Web APIs (crypto.subtle, fetch, etc.)
- [ ] All dependencies are Cloudflare-compatible
- [ ] wrangler.toml is correct
- [ ] Local build succeeds
- [ ] Local preview works
- [ ] Compatibility checker passes
- [ ] Pre-commit hook passes
- [ ] PR template filled out
- [ ] Code reviewed

---

## 🎯 Success Criteria

Your code is ready for Cloudflare when:

1. ✅ `pnpm run build` succeeds
2. ✅ `pnpm run preview` works in browser
3. ✅ `pnpm run check:cloudflare` passes with 0 errors
4. ✅ No Node.js built-in imports in code
5. ✅ All dependencies are compatible
6. ✅ Pre-commit hook passes
7. ✅ PR checklist is complete

---

## 📖 Additional Resources

- [Cloudflare Workers Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Remix on Cloudflare](https://remix.run/docs/en/main/guides/deployment#cloudflare-pages)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Compatibility Dates](https://developers.cloudflare.com/workers/configuration/compatibility-dates/)

---

**Remember:** When in doubt, ask "Does this work in a browser?" If no, it won't work on Cloudflare.
