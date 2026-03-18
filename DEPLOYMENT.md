# Firebase Deployment Guide

## Prerequisites

1. **Node.js and npm** installed
2. **Google Account** with Firebase project access
3. **Firebase CLI** installed globally:
   ```bash
   npm install -g firebase-tools
   ```
4. **Firebase Project**: `side-quest-5f019`

## Setup Steps

### 1. Authenticate with Firebase

```bash
firebase login
```

This opens your browser to authenticate with your Google account.

### 2. Verify Firebase Project

```bash
firebase projects:list
```

Ensure `side-quest-5f019` is listed.

### 3. Configure Environment Variables

Create a `.env.production.local` file (not committed to git):

```
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
VITE_APP_URL=https://side-quest-5f019.web.app/
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Build the Project

```bash
npm run build
```

This generates the `dist/` folder for deployment.

## Deployment

### Deploy to Firebase Hosting

```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy with Firebase functions (if configured)
firebase deploy

# Deploy to a specific target/channel
firebase deploy --only hosting:side-quest-5f019 --message "Your message"
```

### Monitor Deployment

```bash
# Live deployment status
firebase hosting:channel:list

# View deployment history
firebase hosting:releases:list
```

## Post-Deployment

### Verify Deployment

- Visit: `https://side-quest-5f019.web.app/`
- Check Firebase Console: https://console.firebase.google.com/

### Test Features

- Test authentication flows
- Verify Firestore database connections
- Check API calls in browser console
- Verify image and asset loading

### Troubleshooting

**Build fails:**

- Check `npm run build` output
- Verify all environment variables are set
- Clear node_modules: `npm ci`

**Deployment fails:**

- Ensure you're authenticated: `firebase login`
- Verify project: `firebase use side-quest-5f019`
- Check file permissions

**App not loading correctly:**

- Check browser console for errors
- Verify Firebase SDK initialization
- Clear browser cache (Ctrl+Shift+Delete)
- Check Firebase security rules

## Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: "${{ secrets.GITHUB_TOKEN }}"
          firebaseServiceAccount: "${{ secrets.FIREBASE_SERVICE_ACCOUNT }}"
          projectId: side-quest-5f019
```

Get service account key:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Encode as base64 and add as GitHub secret: `FIREBASE_SERVICE_ACCOUNT`

## Rollback

To rollback to a previous version:

```bash
firebase hosting:releases:list
firebase hosting:clone last-version-id your-target
```

## Environment & Secrets

**Important:** Never commit `.env.production.local` file!

- `.env.example` - Template for developers
- `.env.production` - Production defaults (can be committed)
- `.env.production.local` - Secrets (must be in .gitignore)

## Project Information

- **Firebase Project**: side-quest-5f019
- **Hosting URL**: https://side-quest-5f019.web.app/
- **Firebase Console**: https://console.firebase.google.com/project/side-quest-5f019
- **Build Directory**: `dist/`
- **Build Command**: `npm run build`
