# hdrahm.dev — Full Deployment Guide
## React + Vite → GitHub → Cloudflare Pages (auto-deploy on every commit)

---

## What You Have Now

```
portfolio/
├── index.html              ✅
├── package.json            ✅ (just added)
├── vite.config.js          ✅ (just added)
├── eslint.config.js        ✅ (just added)
├── .gitignore              ✅ (just added)
├── public/
│   ├── favicon.svg         ✅ (just added — replace with your real one)
│   └── _redirects          ✅ (just added — needed for Cloudflare SPA)
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── utils/scroll.js
    └── components/
        ├── Nav.jsx
        ├── Hero.jsx
        ├── Skills.jsx
        ├── Projects.jsx
        ├── About.jsx
        ├── Contact.jsx
        ├── Cursor.jsx
        ├── SpaceCanvas.jsx
        └── games/  (all game components)
```

---

## STEP 1 — Test locally first

```bash
# Install dependencies
npm install

# Run dev server — opens at http://localhost:5173
npm run dev

# Test the production build
npm run build
npm run preview
```

If it works → move to Step 2.

---

## STEP 2 — Create GitHub Repository

1. Go to https://github.com/new
2. Name it: `portfolio` (or `hdrahm.dev`)
3. Set it to **Public** (required for free Cloudflare Pages)
4. **Do NOT** initialize with README (you already have files)
5. Click **Create repository**

Then in your terminal, inside the `portfolio/` folder:

```bash
git init
git add .
git commit -m "initial commit — production portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## STEP 3 — Connect to Cloudflare Pages

1. Go to https://dash.cloudflare.com
2. In the left sidebar → **Workers & Pages** → **Pages**
3. Click **Create a project** → **Connect to Git**
4. Authorize Cloudflare to access your GitHub
5. Select your `portfolio` repo → Click **Begin setup**

### Build settings (IMPORTANT — fill these exactly):

| Field | Value |
|-------|-------|
| Project name | `hdrahm` (will give you hdrahm.pages.dev) |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave empty)* |

6. Click **Save and Deploy**

Cloudflare will build your project (~1-2 min). You'll get a URL like `hdrahm.pages.dev`.

---

## STEP 4 — Connect Your Custom Domain (hdrahm.dev)

After the first deploy succeeds:

1. In Cloudflare Pages → your project → **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter: `hdrahm.dev` → click **Continue**
4. Since your domain is already on Cloudflare, it will auto-add the DNS record
5. Click **Activate domain**

Also add `www` if you want:
- Add `www.hdrahm.dev` as a second custom domain
- Cloudflare will redirect www → root automatically

SSL is automatic and free. Your site will be live at `https://hdrahm.dev` within minutes.

---

## STEP 5 — Auto-Deploy on Every Git Push (already works!)

Once connected, **every `git push` to `main` triggers a new deploy automatically**.

```bash
# Make a change, then:
git add .
git commit -m "update hero section"
git push

# → Cloudflare builds & deploys in ~1 minute
# → hdrahm.dev updates automatically
```

You can watch the build live in the Cloudflare Pages dashboard.

---

## OPTIONAL — Add og.png (for LinkedIn/Twitter previews)

Your `index.html` references `/og.png`. Without it, social previews won't show an image.

1. Create a 1200×630px image (your name, title, dark background)
2. Save as `og.png`
3. Place it in the `public/` folder
4. Push to GitHub → auto-deploys

---

## OPTIONAL — Preview Deployments for Branches

Every branch you push also gets a unique preview URL automatically:

```bash
git checkout -b new-feature
# make changes
git push origin new-feature
# → Cloudflare gives you: new-feature.hdrahm.pages.dev
```

Great for testing before merging to main.

---

## Checklist Before Going Live

- [ ] `npm run dev` works locally
- [ ] `npm run build` completes with no errors
- [ ] `npm run preview` shows the built site correctly
- [ ] All images/assets are in `public/` folder
- [ ] GitHub repo pushed
- [ ] Cloudflare Pages connected & first deploy succeeded
- [ ] Custom domain `hdrahm.dev` added in Cloudflare
- [ ] `og.png` added to `public/` for social previews

---

## Troubleshooting

**Build fails on Cloudflare?**
- Check the build log in the Pages dashboard
- Make sure build command is `npm run build` and output is `dist`

**Page shows 404 on refresh?**
- The `public/_redirects` file handles this — it's already included ✅

**Domain not working?**
- Wait 5-10 min for DNS propagation
- Check Cloudflare DNS tab — you should see a `CNAME` record for `hdrahm.dev`

**Fonts not loading?**
- They're loaded from Google Fonts in `index.html` — works fine in production
