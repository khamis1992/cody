# Deployment Guide

## Vercel Deployment

This project is optimized for deployment on Vercel with the following configuration:

### Prerequisites

1. A Vercel account
2. GitHub repository connected to Vercel
3. Environment variables configured

### Environment Variables

Copy `.env.example` to `.env.local` and configure the following variables in Vercel:

#### Required Variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `OPENROUTER_API_KEY` - Your OpenRouter API key
- `DEEPSEEK_API_KEY` - Your DeepSeek API key

#### Optional Variables:
- `NODE_ENV` - Set to `production` for production builds
- `VITE_LOG_LEVEL` - Logging level (debug, info, warn, error)

### Deployment Steps

1. **Connect Repository**: Import your GitHub repository to Vercel
2. **Configure Environment Variables**: Add the required environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically detect the Remix configuration and deploy

### Configuration Files

- `vercel.json` - Vercel-specific configuration with memory optimization
- `vite.config.ts` - Vite configuration with Vercel preset
- `.npmrc` - npm configuration for dependency resolution
- `.env.example` - Template for environment variables

### Build Details

- **Build Command**: `npm run vercel-build`
- **Memory Allocation**: 4GB (configured in vercel.json)
- **Node.js Version**: 18.x or higher
- **Framework**: Remix with Vite
- **Preset**: @vercel/remix/vite for optimal performance

### Features Enabled

- ✅ Streaming SSR
- ✅ Vercel Functions (API routes)
- ✅ Memory optimization
- ✅ Cross-origin headers for WebContainer support
- ✅ Automatic framework detection
- ✅ Edge runtime compatibility

### Troubleshooting

If you encounter deployment issues:

1. Check that all environment variables are set in Vercel
2. Ensure Node.js version is 18.x or higher
3. Verify that the build completes successfully locally
4. Check Vercel function logs for runtime errors

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run start
```