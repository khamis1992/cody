# ✅ Cloudflare Pages Deployment Checklist

Before deploying to Cloudflare Pages, verify all items below:

## 📁 Repository Configuration

- [ ] `wrangler.toml` is renamed to `wrangler.toml.manual` (NOT in git)
- [ ] `functions/` directory is renamed to `functions.manual/` (NOT in git)
- [ ] `.nvmrc` exists with Node 20.11.0
- [ ] `.node-version` exists with Node 20.11.0
- [ ] `public/_routes.json` is configured correctly
- [ ] `.gitignore` excludes deployment files

## 🔑 API Keys Ready

Gather these API keys (you'll need them in Cloudflare):

- [ ] ANTHROPIC_API_KEY (Claude)
- [ ] OPENAI_API_KEY (GPT models)
- [ ] GOOGLE_GENERATIVE_AI_API_KEY (Gemini)
- [ ] GROQ_API_KEY
- [ ] HuggingFace_API_KEY
- [ ] OPENROUTER_API_KEY
- [ ] DEEPSEEK_API_KEY
- [ ] MISTRAL_API_KEY
- [ ] COHERE_API_KEY
- [ ] XAI_API_KEY

### Optional Keys
- [ ] OLLAMA_API_BASE_URL
- [ ] SUPABASE_URL
- [ ] SUPABASE_ANON_KEY
- [ ] GITHUB_TOKEN

## 🚀 Cloudflare Pages Dashboard Setup

### Build Configuration
- [ ] Framework preset: **Remix**
- [ ] Build command: `pnpm install && pnpm run build`
- [ ] Build output directory: `build/client`
- [ ] Root directory: (blank)

### Environment Variables
- [ ] All API keys added (without `=` in names!)
- [ ] Variables are for "Production" environment
- [ ] No extra spaces in values

### Runtime Settings (After first deployment)
- [ ] Compatibility date: `2024-09-02`
- [ ] Compatibility flags: `nodejs_compat`

## 🧪 After Deployment

- [ ] Deployment shows "Success"
- [ ] Site URL is accessible
- [ ] Chat interface loads
- [ ] AI models are available in selector
- [ ] Can send a test message
- [ ] Response is generated successfully

## 🔄 If Deployment Fails

1. [ ] Check build logs for specific errors
2. [ ] Verify compatibility settings
3. [ ] Check environment variables format
4. [ ] Retry deployment
5. [ ] If still failing, check [CLOUDFLARE_DEPLOYMENT_GUIDE.md](./CLOUDFLARE_DEPLOYMENT_GUIDE.md)

## 📝 Commit Before Deploying

```bash
git add .
git commit -m "Configure for Cloudflare Pages deployment"
git push origin master
```

---

## 🎯 Quick Links

- [Full Deployment Guide](./CLOUDFLARE_DEPLOYMENT_GUIDE.md)
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Troubleshooting Guide](./CLOUDFLARE_DEPLOYMENT_GUIDE.md#-troubleshooting)

