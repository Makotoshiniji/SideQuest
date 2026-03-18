# Firebase Deployment Quick Commands

## Authentication

```bash
npm run firebase:login          # Login to Firebase
firebase logout                 # Logout from Firebase
firebase projects:list          # Show available projects
firebase use side-quest-5f019   # Set default project
```

## Build & Deploy

```bash
npm run build                   # Build for production
npm run preview                 # Preview production build locally
npm run deploy                  # Build and deploy
npm run deploy:prod             # Deploy with message
```

## Monitoring

```bash
npm run firebase:status         # Check deployment channels
npm run firebase:releases       # View deployment history
firebase hosting:channel:list   # List all channels
```

## Development

```bash
npm install                     # Install dependencies
npm run dev                     # Start dev server (port 3000)
npm run lint                    # Type check with TypeScript
```

## Cleanup

```bash
npm run clean                   # Remove dist folder
npm install                     # Reinstall dependencies
```

## Environment Files

```
.env.example              ← Template (commit this)
.env.local               ← Dev secrets (DO NOT commit)
.env.production          ← Prod defaults (can commit)
.env.production.local    ← Prod secrets (DO NOT commit)
```

## Important URLs

- Live Site: https://side-quest-5f019.web.app/
- Firebase Console: https://console.firebase.google.com/project/side-quest-5f019
- GitHub Repo: [your-repo-url]

## Before First Deployment

1. Run `npm run firebase:login`
2. Create `.env.production.local` with actual API keys
3. Run `npm run build` and `npm run preview`
4. Test thoroughly locally before deploying

## Deployment Checklist

- [ ] All tests pass (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Preview looks good (`npm run preview`)
- [ ] Environment variables set in `.env.production.local`
- [ ] Authenticated with Firebase (`npm run firebase:login`)
- [ ] Deploy with `npm run deploy`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide.
See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for setup details.
