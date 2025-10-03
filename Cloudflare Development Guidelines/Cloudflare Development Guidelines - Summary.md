# Cloudflare Development Guidelines - Summary

**Created:** October 3, 2025  
**Repository:** khamis1992/cody  
**Status:** ✅ Committed and Pushed (commit e0bd6e8)

---

## 📦 What Was Created

I've created a comprehensive set of guidelines, documentation, and automated tools to prevent future Cloudflare deployment failures. All files have been committed to the cody repository.

---

## 📄 Documentation Files

### 1. **CLOUDFLARE_DEVELOPMENT_RULES.md** (Main Document)
**Location:** `/CLOUDFLARE_DEVELOPMENT_RULES.md`  
**Size:** ~1,200 lines  
**Purpose:** Complete mandatory rules for all developers

**Key Sections:**
- ⚠️ **10 Critical Rules** - NEVER violate these
- 🔍 **Pre-Commit Checklist** - Must check before every commit
- 🚨 **Common Errors and Solutions** - Troubleshooting guide
- 📚 **Required Reading** - Links to official docs
- 🎯 **Golden Rules Summary** - Quick reference

**Most Important Rules:**
1. NEVER import Node.js built-in modules (`crypto`, `fs`, `path`, etc.)
2. Always use Web Crypto API (`crypto.subtle`)
3. Use `fetch` API (not axios, node-fetch)
4. Check dependencies before installing
5. Keep `wrangler.toml` updated with `nodejs_compat`
6. Test locally before pushing
7. Keep functions handler simple
8. No file system operations (use KV/R2/D1)
9. Use `context.env` (not `process.env`)
10. Follow the checklist

---

### 2. **CLOUDFLARE_QUICK_REFERENCE.md**
**Location:** `/CLOUDFLARE_QUICK_REFERENCE.md`  
**Size:** ~800 lines  
**Purpose:** Quick code examples and patterns

**Contains Ready-to-Use Code For:**
- **Cryptography:** SHA-256, SHA-1, HMAC, random bytes, UUID
- **HTTP Requests:** GET, POST, form data, timeouts
- **Storage:** KV operations, R2 file storage, D1 database queries
- **Environment Variables:** Type-safe access patterns
- **Text Encoding:** Encoding, decoding, Base64
- **URL Manipulation:** Parsing, modifying, search params
- **Date/Time:** Formatting, parsing
- **Common Patterns:** JSON responses, redirects, streaming
- **Performance:** Caching, parallel requests
- **Package Alternatives:** Node.js → Cloudflare replacements

**Example Usage:**
```typescript
// Need to hash something? Copy this:
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
```

---

### 3. **CLOUDFLARE_README.md**
**Location:** `/CLOUDFLARE_README.md`  
**Size:** ~600 lines  
**Purpose:** Overview and quick start guide

**Key Sections:**
- 📚 Documentation overview
- 🛠️ Tools description
- 🚀 Quick start for new developers
- ⚠️ Common mistakes with solutions
- 🆘 Getting help guide
- 📋 Feature completion checklist
- 🎯 Success criteria

---

### 4. **PULL_REQUEST_TEMPLATE.md**
**Location:** `/.github/PULL_REQUEST_TEMPLATE.md`  
**Purpose:** Automated PR checklist

**What It Does:**
- Appears automatically when creating a pull request
- Contains Cloudflare compatibility checklist
- Requires testing evidence (build logs, screenshots)
- Ensures code review includes Cloudflare checks

**Checklist Items:**
- Code compatibility (no Node.js imports, using Web APIs)
- Dependencies (Cloudflare-compatible)
- Testing (local build, preview)
- Configuration (wrangler.toml, functions handler)
- Documentation updates

---

## 🛠️ Automated Tools

### 1. **Pre-Commit Hook**
**Location:** `/.husky/pre-commit`  
**Type:** Git hook (runs automatically)  
**Language:** Shell script

**What It Does:**
- Runs automatically before every `git commit`
- Scans staged files for Node.js built-in imports
- Checks if `wrangler.toml` exists
- **Blocks commit** if issues found
- Shows helpful error messages

**Example Output:**
```bash
🔍 Running Cloudflare compatibility checks...
Checking for Node.js built-in imports...
❌ ERROR: Node.js built-in imports detected!

Files with forbidden imports:
app/routes/api.example.ts

🚫 FORBIDDEN: import crypto from 'crypto'
✅ USE: crypto.subtle (Web Crypto API)

Read CLOUDFLARE_DEVELOPMENT_RULES.md for details.
```

**To Bypass (NOT RECOMMENDED):**
```bash
git commit --no-verify
```

---

### 2. **Compatibility Checker Script**
**Location:** `/scripts/check-cloudflare-compat.sh`  
**Type:** Shell script (run manually)  
**Language:** Bash

**What It Checks:**
1. ✅ Node.js built-in imports
2. ✅ wrangler.toml existence and configuration
3. ✅ Functions handler complexity
4. ✅ Problematic dependencies (axios, bcrypt, etc.)
5. ✅ process.env usage
6. ✅ File system operations
7. ✅ Build success

**How to Run:**
```bash
# Via npm script
pnpm run check:cloudflare

# Or directly
bash scripts/check-cloudflare-compat.sh
```

**Example Output:**
```bash
🔍 Cloudflare Compatibility Checker
====================================

📦 Checking for Node.js built-in imports...
✅ No Node.js built-in imports found

📄 Checking for wrangler.toml...
✅ wrangler.toml exists
✅ nodejs_compat is enabled

🔧 Checking functions handler...
✅ functions/[[path]].ts exists and is simple

📚 Checking for problematic dependencies...
✅ No known problematic dependencies

🌍 Checking for process.env usage...
✅ No process.env usage found

📁 Checking for file system operations...
✅ No file system operations found

🏗️  Testing build...
✅ Build succeeded

====================================
📊 Summary
====================================
Errors: 0
Warnings: 0

✅ ALL CHECKS PASSED: Ready for Cloudflare deployment!
```

---

## 🚀 How to Use These Guidelines

### For New Developers (First Time Setup)

1. **Read the main rules** (15-20 minutes):
   ```bash
   cat CLOUDFLARE_DEVELOPMENT_RULES.md
   ```

2. **Bookmark the quick reference**:
   ```bash
   cat CLOUDFLARE_QUICK_REFERENCE.md
   ```

3. **Install pre-commit hooks**:
   ```bash
   pnpm install  # Installs husky hooks automatically
   ```

4. **Run compatibility check**:
   ```bash
   pnpm run check:cloudflare
   ```

---

### Before Adding Any New Feature

1. **Review the rules** relevant to your feature
2. **Check the quick reference** for code examples
3. **Verify dependencies** are Cloudflare-compatible
4. **Use Web APIs** instead of Node.js modules

---

### Before Every Commit

1. **Pre-commit hook runs automatically**
2. **If blocked, fix the issues**:
   ```bash
   pnpm run check:cloudflare  # See what's wrong
   # Fix the issues
   git commit  # Try again
   ```

---

### Before Creating a Pull Request

1. **Run full compatibility check**:
   ```bash
   pnpm run check:cloudflare
   ```

2. **Test locally**:
   ```bash
   pnpm run build
   pnpm run preview
   ```

3. **Fill out PR template** (appears automatically)

4. **Include testing evidence** (build logs, screenshots)

---

## 📋 Quick Reference Card

**Print this and keep it visible:**

```
╔══════════════════════════════════════════════════════════════╗
║           CLOUDFLARE DEVELOPMENT RULES                       ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ❌ NEVER USE:                                               ║
║     import crypto from 'crypto'                              ║
║     import fs from 'fs'                                      ║
║     import path from 'path'                                  ║
║     process.env.VARIABLE                                     ║
║     axios, node-fetch, bcrypt                                ║
║                                                              ║
║  ✅ ALWAYS USE:                                              ║
║     crypto.subtle (Web Crypto API)                           ║
║     fetch (native)                                           ║
║     context.env.VARIABLE                                     ║
║     Cloudflare KV/R2/D1                                      ║
║                                                              ║
║  🔍 BEFORE COMMIT:                                           ║
║     pnpm run check:cloudflare                                ║
║     pnpm run build                                           ║
║     pnpm run preview                                         ║
║                                                              ║
║  📚 WHEN STUCK:                                              ║
║     Read: CLOUDFLARE_QUICK_REFERENCE.md                      ║
║     Check: CLOUDFLARE_DEVELOPMENT_RULES.md                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🎯 Success Metrics

**Your code is ready for Cloudflare when:**

- ✅ `pnpm run build` succeeds
- ✅ `pnpm run preview` works in browser
- ✅ `pnpm run check:cloudflare` passes (0 errors)
- ✅ Pre-commit hook passes
- ✅ PR checklist complete
- ✅ No Node.js built-in imports
- ✅ All dependencies compatible

---

## 🔄 Maintenance

### When to Update These Guidelines

1. **New Cloudflare features** - Update compatibility_date
2. **New problematic packages discovered** - Add to checker script
3. **New common mistakes** - Add to rules document
4. **Team feedback** - Improve clarity

### How to Update

1. Edit the relevant `.md` file
2. Update the checker script if needed
3. Test the changes
4. Commit and push
5. Notify the team

---

## 📊 Files Summary

| File | Size | Purpose | When to Use |
|------|------|---------|-------------|
| `CLOUDFLARE_DEVELOPMENT_RULES.md` | ~1200 lines | Complete rules | Before any feature |
| `CLOUDFLARE_QUICK_REFERENCE.md` | ~800 lines | Code examples | When coding |
| `CLOUDFLARE_README.md` | ~600 lines | Overview | First time setup |
| `.github/PULL_REQUEST_TEMPLATE.md` | ~100 lines | PR checklist | Creating PR |
| `.husky/pre-commit` | ~40 lines | Auto checks | Every commit |
| `scripts/check-cloudflare-compat.sh` | ~150 lines | Full audit | Before deploy |

**Total:** ~2,900 lines of documentation and tooling

---

## 🎉 Benefits

These guidelines and tools will:

1. ✅ **Prevent deployment failures** - Catch issues before pushing
2. ✅ **Speed up development** - Ready-to-use code examples
3. ✅ **Improve code quality** - Consistent patterns
4. ✅ **Reduce debugging time** - Clear error messages
5. ✅ **Onboard new developers faster** - Complete documentation
6. ✅ **Ensure team alignment** - Shared standards

---

## 📞 Support

**If you encounter issues:**

1. Check `CLOUDFLARE_QUICK_REFERENCE.md` for examples
2. Read `CLOUDFLARE_DEVELOPMENT_RULES.md` for rules
3. Run `pnpm run check:cloudflare` for diagnostics
4. Check Cloudflare docs: https://developers.cloudflare.com/workers/

---

**All files are now in the repository and ready to use!**

**Commit:** `e0bd6e8`  
**Repository:** https://github.com/khamis1992/cody
