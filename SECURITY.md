# Security Guidelines

## 🔐 API Key Security

### CRITICAL RULES

1. **NEVER commit API keys to Git**
   - ❌ Don't hardcode keys in documentation files
   - ❌ Don't include keys in example files
   - ❌ Don't commit `.env` or `.env.local` files
   - ✅ Use `.env.local.example` with placeholder values only

2. **Use Environment Variables**
   - **Local Development:** Store in `.env.local` (already in `.gitignore`)
   - **Production:** Use Cloudflare Dashboard → Environment Variables
   - **Never:** Hardcode in source code or documentation

3. **If You Accidentally Expose a Key:**
   - ⚠️ **Immediately rotate** the key at the provider's dashboard
   - 🗑️ Remove the key from all files in the repository
   - 🔄 Commit and push the changes
   - 🔍 Check git history and force-push if needed to remove old commits

## 🛡️ Key Storage Locations

### ✅ SAFE (These are OK)
- `.env.local` - Local development (gitignored)
- `.env.local.example` - Template with placeholders only
- Cloudflare Dashboard Environment Variables
- Browser cookies (for UI-based key entry)

### ❌ UNSAFE (NEVER use these)
- Any `.md` documentation files
- Source code files (`.ts`, `.tsx`, `.js`, etc.)
- Configuration files committed to git
- README files or setup guides

## 🔄 Key Rotation Process

If your key has been exposed:

1. **Go to the provider's dashboard:**
   - OpenRouter: https://openrouter.ai/keys
   - Anthropic: https://console.anthropic.com/
   - OpenAI: https://platform.openai.com/api-keys

2. **Delete or rotate the exposed key**

3. **Generate a new key**

4. **Update the key in secure locations:**
   - Local: Update `.env.local`
   - Production: Update Cloudflare Dashboard → Environment Variables
   - UI: Clear cookies and re-enter via API Key Manager

5. **Redeploy if using Cloudflare Environment Variables:**
   ```bash
   git commit --allow-empty -m "Force redeploy after key rotation"
   git push
   ```

## 🔍 How to Check for Exposed Keys

Run these commands before committing:

```bash
# Check for OpenRouter keys
git grep -E "sk-or-v1-[a-zA-Z0-9]+"

# Check for generic API key patterns
git grep -E "(api[_-]?key|apikey|secret)" --ignore-case

# Check what's being committed
git diff --cached
```

## 📋 Pre-Commit Checklist

Before every commit:
- [ ] No API keys in changed files
- [ ] `.env.local` not included in commit
- [ ] Documentation uses placeholders only
- [ ] Secrets stored in Cloudflare Dashboard (production)

## 🆘 Emergency Response

If you receive a security alert:

1. **Don't panic** - but act quickly
2. **Rotate the key immediately** at the provider's dashboard
3. **Remove the key** from all files in your repository
4. **Update the memory** to include the new key in secure locations
5. **Force push** if needed to remove from git history (use carefully)

## 📞 Resources

- [Cloudflare Environment Variables Guide](CLOUDFLARE_ENV_TROUBLESHOOTING.md)
- [OpenRouter Setup Guide](OPENROUTER_SETUP.md)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

## 🔒 Remember

> **"If it's secret, it shouldn't be in git"**

Every API key, password, or secret should be:
- Stored in environment variables
- Never committed to version control
- Rotated immediately if exposed

