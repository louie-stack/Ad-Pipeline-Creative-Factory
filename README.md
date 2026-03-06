# Ad Publishing Pipeline

AI-powered ad creative pipeline. Brief in → platform-ready ads out for Meta, Google & TikTok.

## Stack
- React 18 + Vite
- Anthropic Claude API (via secure serverless proxy)
- Vercel Serverless Functions

## Features
- 5 preset campaign briefs + custom brief input
- Generates Meta ads (3 variants with image direction, hooks, char validation)
- Generates Google Responsive Search Ads (headlines, descriptions, sitelinks, keyword themes)
- Generates TikTok video scripts (scene-by-scene with timing, hooks, text overlays)
- Platform spec validation with character counts
- JSON export for developer handoff
- Session history tracking

## Setup

```bash
npm install
npm run dev
```

Add `ANTHROPIC_KEY` environment variable in Vercel for production.

---
Powered by [Maupan](https://maupan.com) · AI Marketing Intelligence
