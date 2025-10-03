# 🚀 Cloudflare Pages Deployment Guide

This guide will help you deploy your Cody application to Cloudflare Pages following the recommended approach from the Bolt.diy stable branch.

## ⚠️ Important Notes

- **DO NOT** push `wrangler.toml` to your repository (it's renamed to `wrangler.toml.manual`)
- **DO NOT** include the `functions/` directory (it's renamed to `functions.manual`)
- Configure everything through the Cloudflare Pages dashboard

---

## 📋 Prerequisites

1. **Cloudflare Account** - Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Account** - Your repository should be on GitHub
3. **API Keys Ready** - Have your AI provider API keys ready (OpenAI, Anthropic, Google, etc.)

---

## 🔧 Step 1: Prepare Your Repository

### 1.1 Verify Files Are Renamed

Ensure these files/directories are NOT in your git repository:
```bash
# These should be renamed or in .gitignore
wrangler.toml       # → wrangler.toml.manual
functions/          # → functions.manual
```

### 1.2 Verify Required Files Exist

Check that these files exist:
- ✅ `.nvmrc` (contains: 20.11.0)
- ✅ `.node-version` (contains: 20.11.0)
- ✅ `public/_routes.json` (configured for Remix)
- ✅ `package.json` (with correct build script)

### 1.3 Commit and Push Changes

```bash
git add .
git commit -m "Prepare for Cloudflare Pages deployment"
git push origin master
```

---

## 🌐 Step 2: Set Up Cloudflare Pages

### 2.1 Create New Pages Project

1. Go to **Cloudflare Dashboard** → **Workers & Pages**
2. Click **Create** → Select **Pages** tab
3. Click **Connect to Git**
4. Authorize GitHub if this is your first time
5. Select your repository: `cody`

### 2.2 Configure Build Settings

#### Framework Preset
- Select: **Remix**

#### Build Configuration
- **Build command**: 
  ```
  pnpm install && pnpm run build
  ```
  
- **Build output directory**: 
  ```
  build/client
  ```

- **Root directory**: Leave blank (/)

### 2.3 Environment Variables

Click **Add variable** for each of these (click the three dots to see settings):

#### Required Variables (Add as many as you have)

```
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
GROQ_API_KEY=your_groq_key
HuggingFace_API_KEY=your_huggingface_key
OPENROUTER_API_KEY=your_openrouter_key
DEEPSEEK_API_KEY=your_deepseek_key
MISTRAL_API_KEY=your_mistral_key
COHERE_API_KEY=your_cohere_key
XAI_API_KEY=your_xai_key

# Optional - Custom API Base URLs
OLLAMA_API_BASE_URL=your_ollama_url
LMSTUDIO_API_BASE_URL=your_lmstudio_url
OPENAI_LIKE_API_BASE_URL=your_custom_url
OPENAI_LIKE_API_MODELS=model1,model2

# Database (if using Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub Integration (optional)
GITHUB_TOKEN=your_github_token
```

**⚠️ CRITICAL**: Do NOT include the `=` sign in the variable name!
- ✅ Correct: `OPENAI_API_KEY` (name) = `sk-...` (value)
- ❌ Wrong: `OPENAI_API_KEY=` (name) = `sk-...` (value)

### 2.4 Save and Deploy

Click **Save and Deploy**

The initial deployment will take 3-5 minutes.

---

## ⚙️ Step 3: Configure Runtime Settings

### 3.1 Update Compatibility Settings

After the first deployment (even if it fails):

1. Go to **Settings** → **Functions**
2. Scroll down to **Compatibility flags**
3. Click **Add flag**
4. Type: `nodejs_compat`
5. Click **Save**

6. Scroll to **Compatibility date**
7. Click **Edit**
8. Enter: `2024-09-02`
9. Click **Save**

### 3.2 Retry Deployment

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Retry deployment**

---

## 🎯 Step 4: Update Branch (Optional but Recommended)

### 4.1 Change Build Branch

If you want to deploy from the `stable` branch instead of `master`:

1. Go to **Settings** → **Builds & deployments**
2. Under **Branch control**, click **Edit**
3. Change to: `stable`
4. Click **Save**

---

## ✅ Step 5: Verify Deployment

### 5.1 Check Deployment Status

Wait for the deployment to complete. You should see:
- ✅ Build successful
- ✅ Deployment successful
- 🌐 Your site URL (e.g., `cody-xyz.pages.dev`)

### 5.2 Test Your Application

1. Visit your site URL
2. Test the chat interface
3. Verify AI models are available
4. Check that API keys are working (it should show "API Key Set" in the model selector)

### 5.3 Common First-Load Issues

If the page doesn't load correctly on the first try:
- Wait 1-2 minutes (caching propagation)
- Clear your browser cache
- Try in an incognito window
- Check the Cloudflare Pages deployment logs

---

## 🔍 Troubleshooting

### Build Fails with "Failed to publish assets"

**Solution**: 
1. Verify compatibility flags are set correctly
2. Check that environment variables don't have `=` in names
3. Retry the deployment

### "Internal error occurred" during deployment

**Solution**:
1. Check Cloudflare status page
2. Wait 5 minutes and retry
3. Contact Cloudflare support with deployment ID (from logs)

### API Keys Not Working

**Solution**:
1. Go to Settings → Environment Variables
2. Verify keys are set correctly (no extra spaces)
3. Click **Redeploy** to apply changes

### Page Styling Is Broken

**Solution**:
1. Verify build command is: `pnpm install && pnpm run build`
2. Check build output directory is: `build/client`
3. Verify `public/_routes.json` exists and is correct

### "Cannot find module" errors

**Solution**:
1. Check compatibility date is set to `2024-09-02`
2. Verify `nodejs_compat` flag is enabled
3. Retry deployment

---

## 🔄 Updating Your Deployment

### For Code Changes

Cloudflare Pages automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Your update message"
git push origin master
```

### For Environment Variable Changes

1. Go to **Settings** → **Environment Variables**
2. Update/Add variables
3. Go to **Deployments** → Click **Retry deployment** on latest

---

## 📊 Monitoring & Logs

### View Build Logs

1. Go to **Deployments**
2. Click on any deployment
3. Click **View details**
4. Check build logs and function logs

### View Runtime Logs

1. Go to **Functions** → **Logs**
2. Enable real-time logs
3. Monitor your application in production

---

## 🎉 Success!

Your Cody application is now deployed on Cloudflare Pages!

**Your deployment URL**: `https://cody-xyz.pages.dev`

### Next Steps

1. **Custom Domain**: Add your custom domain in Settings → Custom domains
2. **Analytics**: Enable Web Analytics in the Analytics tab
3. **Security**: Configure security headers in Settings → Security
4. **Auto-Updates**: Enable automatic deployments from your repo

---

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Remix on Cloudflare Pages](https://remix.run/docs/en/main/guides/deployment#cloudflare-pages)
- [Bolt.diy Deployment Guide](https://thinktank.ottomator.ai/t/deploying-bolt-diy-with-cloudflare-pages-the-easy-way/2403)

---

## 🆘 Need Help?

- **Cloudflare Discord**: [discord.gg/cloudflaredev](https://discord.gg/cloudflaredev)
- **Cloudflare Support**: Create a ticket with your deployment ID
- **Check Logs**: Always check deployment logs first for specific errors

