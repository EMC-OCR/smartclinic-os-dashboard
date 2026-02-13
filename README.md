# Smart Clinic OS — Dashboard

AI-powered healthcare management platform for Elgin Endocrinology Clinic & Elgin Metabolic Center.

## Features

- **7 Role-Based Portals**: Admin, Reception, MA, NP, Provider, Billing, HR
- **Dual Practice Switcher**: Toggle between EEC and EMC with per-practice data
- **3 Sub-Panels**: Credentialing, HR & Payroll, Revalidation
- **Glass UI Dark Theme**: Professional healthcare dashboard aesthetic
- **Architecture Blueprint**: Built-in Bubble.io build guide (ARCH button)
- **AI Copilot Bar**: Voice command interface ready
- **Particle Animation**: Ambient canvas background

## Quick Start (Local)

```bash
npm install
npm run dev
```

Open http://localhost:5173/smartclinic-os-dashboard/

## Deploy to GitHub Pages

### Option 1: Automatic (Push to main)

1. Create a new GitHub repo named `smartclinic-os-dashboard`
2. Push this code to `main` branch
3. Go to repo **Settings → Pages → Source → GitHub Actions**
4. Every push to `main` auto-deploys

```bash
git init
git add .
git commit -m "Smart Clinic OS Dashboard v3"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smartclinic-os-dashboard.git
git push -u origin main
```

### Option 2: Manual

```bash
npm run build
# Upload the `dist` folder contents to any static host
```

## Live URL

After deployment:
`https://YOUR_USERNAME.github.io/smartclinic-os-dashboard/`

## Demo

Click any role button on the login screen to preview that portal.
Use the letter buttons (A R M N P B H) in the header to switch roles.
Use EEC/EMC toggle to switch practices.
Click ARCH button to view the Bubble.io build blueprint.

## Tech Stack

- React 18
- Vite 5
- Vanilla CSS (inline styles, no dependencies)
- Canvas API (particle animation)
- Google Fonts (Manrope)

## License

Proprietary — Smart Clinic OS © 2026 Qazi Farooq / Associates in Endocrinology Inc.
