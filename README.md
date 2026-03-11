# Peptide Stack Tool

Fully unlocked peptide stack recommendation quiz built with Next.js App Router + Tailwind CSS.

## What changed

- Removed the free-question limit, email gate, paywall, upsell blur, pricing copy, and upgrade CTAs
- Full questionnaire now flows straight into the full printable report
- Added blend deduplication logic for KLOW, GLOW, Wolverine, and REGENO
- Added single-GLP-1 enforcement so only one GLP-1-family product can appear in a stack
- Added footer branding: Powered by PeptideLaunch | peptidelaunch.com

## Build

```bash
npm install
npm run build
npm run start
```

## Deployment

Intended for Vercel deployment.
