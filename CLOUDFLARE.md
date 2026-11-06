# Cloudflare Pages Deployment Guide for Jivan Setu Enhance 🚑

> **Deploying Jivan Setu Enhance to Cloudflare Pages**

---

## 🚀 Deployment Options

### Option 1: Connect GitHub Repository to Cloudflare Pages (Recommended)

1. Open the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, click **Compute (Workers & Pages)** > **Create application** > select **Pages** tab > click **Connect to Git**.
3. Select your GitHub account and choose the repository:
   - **Repository**: [`shivamsisodiya9568-cpu/jivan-setu-enhance`](https://github.com/shivamsisodiya9568-cpu/jivan-setu-enhance)
4. Set the build configuration:
   - **Project Name**: `jivan-setu-enhance`
   - **Production branch**: `main`
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**.
6. Cloudflare Pages will build the app and assign a free production URL:
   - `https://jivan-setu-enhance.pages.dev`

---

### Option 2: Deploy Directly via Wrangler CLI

If you prefer deploying directly from your terminal:

1. Build the production application:
   ```bash
   npm run build
   ```

2. Log in to Cloudflare (opens browser authentication once):
   ```bash
   npx wrangler login
   ```

3. Deploy the build output to Cloudflare Pages:
   ```bash
   npx wrangler pages deploy dist --project-name=jivan-setu-enhance
   ```

---

## 📄 Single Page Application (SPA) Routing Setup

The repository includes [`public/_redirects`](./public/_redirects) configured for Cloudflare Pages:

```
/*  /index.html  200
```

This ensures deep routes (`/dashboard`, `/sos`, `/onboarding`, `/ambulance`, `/hospital`, `/reviews`, `/profile`) reload smoothly without 404 errors.
