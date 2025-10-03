# OpenRouter API Key Setup Guide

## API Key
```
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
```

## Setup Methods

### Method 1: Via UI (Immediate - Browser Only)
1. Start a chat in the app
2. Scroll down to the model selector area
3. Find "OpenRouter API Key" section
4. Click the blue pencil icon (edit button)
5. Paste the API key above
6. Click the green checkmark to save

**Storage:** Stored in browser cookies under key "apiKeys"

### Method 2: Via Cloudflare Dashboard (Production - Server-side)

#### Steps:
1. Go to: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages** → **Your Project (cody)**
3. Go to: **Settings** → **Environment variables**
4. Click: **Add variable**
5. Enter:
   - **Variable name:** `OPEN_ROUTER_API_KEY`
   - **Value:** `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`
6. Select both:
   - ✅ Production
   - ✅ Preview
7. Click **Save**
8. **Redeploy your project** for changes to take effect

### Method 3: Via Local Environment (Development)

Create a `.env.local` file in the project root:

```bash
# OpenRouter API Key
OPEN_ROUTER_API_KEY=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
```

Then restart your local server:
```bash
pnpm run build
pnpm run preview
```

## Verification

### Check if Key is Set (UI)
- When you select OpenRouter as provider, you should see:
  - ✅ Green checkmark with "Set via UI" (if set via browser)
  - ✅ Green checkmark with "Set via environment variable" (if set via Cloudflare/env)
  - ❌ Red X with "Not Set" (if not configured)

### Check if Key is Working
1. Select OpenRouter as your provider
2. Select a model (e.g., "Claude 3.5 Sonnet" or "GPT-4o")
3. Send a message
4. Should receive response without "Invalid or missing API key" error

## Troubleshooting

### Error: "Invalid or missing API key"
**Causes:**
1. API key not set in any location
2. API key format incorrect
3. Cloudflare environment variable not saved
4. Project not redeployed after adding env variable
5. Cookie expired or cleared

**Solutions:**
1. Use Method 1 (UI) for immediate testing
2. Verify the API key format: `sk-or-v1-...`
3. Check Cloudflare dashboard to confirm variable is saved
4. Redeploy after adding environment variables
5. Re-enter API key in UI if cookies cleared

### API Key Priority Order
The system checks for API keys in this order:
1. **Browser cookies** (`apiKeys` cookie) - Set via UI
2. **Cloudflare environment** (`context.env.OPEN_ROUTER_API_KEY`) 
3. **Local environment** (`process.env.OPEN_ROUTER_API_KEY`) - Only works locally
4. **LLMManager environment** - Internal fallback

## Files Involved

- **Provider:** `app/lib/modules/llm/providers/open-router.ts`
- **API Key Manager:** `app/components/chat/APIKeyManager.tsx`
- **Environment Variable:** `OPEN_ROUTER_API_KEY`
- **Cookie Key:** `apiKeys` (JSON object with provider name as key)

## OpenRouter Details

- **Provider Name:** `OpenRouter`
- **API Endpoint:** `https://openrouter.ai/api/v1`
- **Get API Key:** https://openrouter.ai/settings/keys
- **Environment Variable:** `OPEN_ROUTER_API_KEY` (with underscore)

## Quick Test Commands

```bash
# Check if environment variable is accessible (local only)
# This won't work on Cloudflare - must use UI or Cloudflare dashboard
echo $OPEN_ROUTER_API_KEY

# Check cookies in browser console
document.cookie

# Test API endpoint directly
curl -H "Authorization: Bearer sk-or-v1-..." https://openrouter.ai/api/v1/models
```

## Notes

⚠️ **Important:**
- Never commit `.env.local` to git (already in `.gitignore`)
- For production (Cloudflare), MUST use Cloudflare dashboard or UI
- `process.env` does NOT work in Cloudflare Workers runtime
- API key from UI (cookies) is client-side only
- Environment variables are server-side

✅ **Recommended Approach:**
- **Development:** Use `.env.local` file
- **Production:** Use Cloudflare dashboard environment variables
- **Quick Testing:** Use UI (cookies) - works immediately


