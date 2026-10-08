# Winter Fancy Match

A mobile-first, sponsor-friendly memory game created for Winter FancyFaire. Players match exhibitor wordmarks, discover a brand profile after each match, and keep their best score on their own device. The site is plain HTML, CSS, and vanilla JavaScript; it has no build step, server, or framework and can be hosted as a static GitHub Pages site.

> **Demo content:** Exhibitor names and wordmarks are fictional samples generated in `data/exhibitors.js`. Replace them with approved exhibitor details and logo assets before publishing the activation.

## Screenshots

Add current screenshots here after opening the game on desktop and mobile:

![Home screen screenshot placeholder](screenshots/home-screen.png)

![Matching board screenshot placeholder](screenshots/game-board.png)

![Activation dashboard screenshot placeholder](screenshots/admin-dashboard.png)

## Run locally

Open `index.html` in a modern browser, or serve this folder with any static web server. The game does not need a backend. For example, with Python installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. The hidden dashboard is available at `/admin/dashboard.html`. It includes generated demo analytics plus real events saved in the same browser's local storage.

## GitHub Pages deployment

1. Create a GitHub repository named **`wff-fancy-match`**.
2. Push all files in this project to the repository's `main` branch. For a new local clone, the commands are:

   ```bash
   git add .
   git commit -m "Create Winter Fancy Match"
   git branch -M main
   git remote add origin https://github.com/YOUR-ACCOUNT/wff-fancy-match.git
   git push -u origin main
   ```

3. Open the repository's **Settings**.
4. Open **Pages**.
5. Under **Build and deployment**, set **Source** to **Deploy from Branch**.
6. Set **Branch** to **`main`**.
7. Set the folder to **`/root`** (the repository-root option, shown as **`/(root)`** in the Pages selector).
8. Select **Save**. After GitHub Pages finishes deploying, visit `https://YOUR-ACCOUNT.github.io/wff-fancy-match/`.

Keep `index.html` at the repository root and retain the provided relative asset paths so the game works both at a project-site URL and locally. GitHub Pages deployment can take a few minutes after the first save.

## Replace demo exhibitors and logos

1. Get permission to use each exhibitor's approved logo and profile link. Use a web-ready SVG or transparent PNG; avoid artwork that is only available inside a design application file. Add approved image files under `assets/logos/`, for example `assets/logos/acme-foods.svg`.
2. Edit `data/exhibitors.js`. Each entry contains the required fields: `companyName`, `logo`, `boothNumber`, `category`, `profileUrl`, and `sponsorLevel` (it also has an `id` used to match analytics). Point `logo` at the new local asset, e.g. `logo: "assets/logos/acme-foods.svg"`, and replace the sample profile URL with the exhibitor's approved public profile URL. Remove or replace every sample record.
3. To remove the generated sample wordmarks, replace the `logo` value for each record with its asset path. The `makeDemoLogo` helper near the top of `data/exhibitors.js` is only used to create the fictional demo wordmarks.
4. Keep every `id` unique and stable, and provide at least **18 exhibitors** so Hard mode can deal 18 different pairs. Confirm every logo path and external profile URL before deployment. Add real names, booths, categories, and sponsor levels so the match reveals and dashboard tables are accurate.
5. Open the site and play through each difficulty. Check logo contrast on the card face, the exhibitor reveal details, the Learn More destination, and the dashboard. Then commit the approved asset files and data updates.

The supplied Reti Yeti waving artwork is included at `assets/brand/reti-yeti-waving.png` and displayed on the welcome screen. The `assets/logos/` directory is where approved exhibitor logo files can be added.

## Gameplay and stored data

- **Easy:** 4 × 4 grid, 8 pairs. **Medium:** 5 × 4 grid, 10 pairs. **Hard:** 6 × 6 grid, 18 pairs.
- Best score, sound preference, a random local player ID, visit status, and event records are held in local storage in the visitor's browser.
- The game records `first_visit`, `returning_visit`, `game_started`, `card_flipped`, `match_found`, `game_completed`, and `exhibitor_clicked` events. Nothing is sent to an analytics server.
- The dashboard generates sample/demo activity when it opens, then adds events available in that browser. It is a preview tool, not an authenticated administration system or a shared multi-visitor reporting service. A static GitHub Pages site cannot protect a hidden page or aggregate visitors' local storage; connect a properly secured analytics service if production-wide reporting or access control is required.
- The UI respects reduced-motion preferences, supports keyboard activation of controls, and adapts to small screens.

## Project files

```text
/
├── index.html
├── css/styles.css
├── js/app.js
├── js/game.js
├── js/analytics.js
├── data/exhibitors.js
├── assets/brand/reti-yeti-waving.png
├── assets/logos/
├── admin/dashboard.html
├── admin/dashboard.js
├── admin/dashboard.css
└── README.md
```
