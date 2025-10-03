# Cloudflare Environment Variable Troubleshooting

## 🔴 Current Error
```
Authentication Error
Authentication failed with OpenRouter. Please check your API key.
Error Details: Custom error: Invalid or missing API key. Please check your API key configuration.
```

## ✅ Solution: Force Redeploy After Adding Environment Variables

### Step 1: Verify Environment Variable in Cloudflare

1. Go to: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages** → **cody** (your project)
3. Click: **Settings** → **Environment variables**
4. Verify you see:
   - **Variable name:** `OPEN_ROUTER_API_KEY` (with underscore!)
   - **Value:** `sk-or-v1-...` (should be set)
   - **Environments:** ✅ Production, ✅ Preview

### Step 2: Force Redeploy (CRITICAL!)

Environment variables in Cloudflare Pages **DO NOT** apply to existing deployments. You MUST redeploy.

**Option A: Redeploy from Cloudflare Dashboard**
1. Go to: **Deployments** tab
2. Find the latest deployment
3. Click the **"..."** menu → **Retry deployment**
4. OR make a dummy commit and push to trigger new deployment

**Option B: Trigger New Deployment via Git**
```bash
# Make a small change and push
git commit --allow-empty -m "Trigger redeploy for env vars"
git push origin master
```

**Option C: Deploy via Wrangler CLI**
```bash
cd c:\Users\khamis\Desktop\cody
pnpm run build
wrangler pages deploy build/client
```

### Step 3: Wait for Deployment to Complete

- Watch the **Deployments** tab in Cloudflare dashboard
- Wait for status to show: ✅ **Success**
- This usually takes 2-5 minutes

### Step 4: Clear Browser Cache & Test

After successful deployment:
1. **Hard refresh** the page: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
2. **Clear cookies** if needed
3. Try sending a message again

---

## 🔍 How to Verify the Fix

### Check 1: API Key Status in UI
1. Start a chat
2. Look at model selector area
3. Should show: **"✅ Set via environment variable"** (green)
4. Should NOT show: **"❌ Not Set"** (red)

### Check 2: Test Request
1. Select **OpenRouter** as provider
2. Select any model (e.g., "Claude 3.5 Sonnet")
3. Send a test message
4. Should get response without authentication error

---

## 🚨 Common Mistakes

### ❌ Wrong Variable Name
**Incorrect:**
- `OPENROUTER_API_KEY` (no underscore)
- `OPEN_ROUTER_KEY` (missing API)
- `openrouter_api_key` (lowercase)

**Correct:**
- `OPEN_ROUTER_API_KEY` (with underscore, uppercase)

### ❌ Not Selecting Both Environments
Must select:
- ✅ **Production**
- ✅ **Preview**

### ❌ Forgetting to Redeploy
Environment variables only apply to **new deployments**, not existing ones.

### ❌ Testing Too Soon
Wait for deployment to complete (green checkmark) before testing.

---

## 🔧 Alternative: Use UI API Key (Immediate Fix)

If you need it working **right now** while waiting for deployment:

1. **Open your app** in browser
2. **Start a chat**
3. **Scroll to model selector**
4. **Click the blue pencil icon** next to "OpenRouter API Key"
5. **Paste:**
   ```
   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
   ```
6. **Click the green checkmark** ✅

This stores the key in browser cookies and works **immediately** without redeployment.

---

## 📊 Debugging Commands

### Check Deployment Status
```bash
# Via wrangler
wrangler pages deployment list --project-name=cody

# Via git (check latest commit)
git log -1
```

### Check if Variable is Accessible (After Deployment)
Unfortunately, you can't directly check environment variables in Cloudflare Workers. But the app will show:
- ✅ Green "Set via environment variable" if it's working
- ❌ Red "Not Set" if it's not accessible

### Check Cloudflare Logs
```bash
wrangler pages deployment tail
```

---

## 📝 Verification Checklist

After redeployment, verify:
- [ ] Deployment shows **Success** in Cloudflare dashboard
- [ ] Environment variable `OPEN_ROUTER_API_KEY` is visible in Settings
- [ ] Both Production and Preview environments are checked
- [ ] Browser cache cleared (Ctrl + F5)
- [ ] UI shows "✅ Set via environment variable" for OpenRouter
- [ ] Test message sends successfully without error

---

## 🆘 Still Not Working?

If after redeployment it still doesn't work:

### Option 1: Check Exact Variable Name
Run this check in your browser console while on the app:
```javascript
fetch('/api/check-env-key?provider=OpenRouter')
  .then(r => r.json())
  .then(d => console.log('Is OpenRouter key set?', d.isSet));
```

Should return: `{ isSet: true }`

### Option 2: Use UI Method (Temporary)
Store the key in browser cookies via the UI as described above.

### Option 3: Check Cloudflare Bindings
Verify in `wrangler.toml` that nodejs_compat is enabled:
```toml
compatibility_flags = ["nodejs_compat"]
```

### Option 4: Check Provider Name
The provider name MUST be exactly: `OpenRouter` (capital O, capital R)

---

## 💡 Pro Tips

1. **Always redeploy after changing environment variables**
2. **Use UI method for immediate testing**
3. **Use Cloudflare env vars for production**
4. **Clear browser cache after deployment**
5. **Check deployment status before testing**

---

## 🔐 Security Note

- Never commit API keys to git
- Use Cloudflare environment variables for production
- Use `.env.local` for local development only
- Clear API keys from UI (cookies) if testing environment variables


