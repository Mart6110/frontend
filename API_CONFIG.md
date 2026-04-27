# API Configuration Guide

## Production API Endpoint

The production API is now configured to use:
```
https://dunepower-api.acceptable.pro/api/v1
```

## Environment Configurations

### 1. Local Development (Default)

**File:** `.env.development`

API requests go through Vite proxy to local backend:
```env
VITE_API_BASE_URL=/api/v1
VITE_PROXY_TARGET=http://localhost:8080
```

**How it works:**
- Frontend makes requests to `/api/v1/*` (relative URL)
- Vite dev server proxies them to `http://localhost:8080/api/v1/*`
- No CORS issues (same origin for browser)

**Usage:**
```bash
npm run dev
```

### 2. Development Against Production API

**Script:** `npm run dev:prod`

API requests go through Vite proxy to **production** backend:
```env
VITE_API_BASE_URL=/api/v1
VITE_PROXY_TARGET=https://dunepower-api.acceptable.pro
```

**How it works:**
- Frontend still makes requests to `/api/v1/*`
- Vite dev server proxies them to `https://dunepower-api.acceptable.pro/api/v1/*`
- No CORS issues (Vite proxy handles cross-origin requests)
- Console logs show proxy activity

**Usage:**
```bash
npm run dev:prod
# or
bun run dev:prod
```

**Alternative:** Create `.env.local` to always proxy to production:
```bash
echo "VITE_PROXY_TARGET=https://dunepower-api.acceptable.pro" > .env.local
npm run dev
```

### 3. Production Build

**File:** `.env.production`

Direct API calls to production (no proxy):
```env
VITE_API_BASE_URL=https://dunepower-api.acceptable.pro/api/v1
```

**Usage:**
```bash
npm run build
```

## Environment Priority

Vite loads environment files in this order (later overrides earlier):

1. `.env` - Base config
2. `.env.development` or `.env.production` - Mode-specific
3. `.env.local` - Local overrides (gitignored) ⭐ **Highest priority**

## Quick Setup Commands

### Run dev with local backend:
```bash
npm run dev
# Proxies to http://localhost:8080
```

### Run dev with production API:
```bash
npm run dev:prod
# Proxies to https://dunepower-api.acceptable.pro
# Avoids CORS issues!
```

### Build for production:
```bash
npm run build
# Uses .env.production automatically
```

### Docker production:
```bash
docker-compose up -d
# Uses .env.production during build
# Serves at http://localhost:3000
```

## Troubleshooting

### CORS Issues in Development

**Problem:** "Access to fetch at 'https://dunepower-api.acceptable.pro/...' has been blocked by CORS policy"

**Root Cause:** Browsers block cross-origin requests when:
- Frontend: `http://localhost:5173`
- Backend: `https://dunepower-api.acceptable.pro`
- Backend doesn't send `Access-Control-Allow-Origin` header

**Solution:** Use Vite proxy (already configured!)

```bash
# Use the dev:prod script - it proxies through Vite
npm run dev:prod
```

The proxy makes requests server-side (no CORS) and forwards them to your frontend.

**How the proxy works:**
```
Browser → http://localhost:5173/api/v1/data/latest
           ↓ (Vite proxy, no CORS)
         https://dunepower-api.acceptable.pro/api/v1/data/latest
           ↓
         Response
           ↓
Browser ← http://localhost:5173/api/v1/data/latest
```

**Alternative (not recommended):** Ask backend team to add CORS headers:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Product-Key
```

### Environment Not Updating

After changing `.env` files:

```bash
# Stop dev server (Ctrl+C)
# Restart it
npm run dev
```

Vite only reads environment variables at startup.

### Checking Current Config

The API base URL is logged in the browser console on startup. Check DevTools → Console:

```
API Base URL: https://dunepower-api.acceptable.pro/api/v1
```

## Security Notes

- ✅ `.env.local` is gitignored (safe for secrets)
- ✅ `.env.development` and `.env.production` are committed
- ⚠️ Never commit API keys or secrets to version control
- ⚠️ API key is stored in browser cookie (see apiKeySlice.ts)
