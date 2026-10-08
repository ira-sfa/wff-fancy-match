# Winter Fancy Match

A mobile-first, sponsor-friendly memory game created for Winter FancyFaire*. Players match specialty-food products, discover the exhibitor and booth after a match, and keep their best score on their own device. The site is plain HTML, CSS, and vanilla JavaScript; it has no build step, server, or framework and can be hosted as a static GitHub Pages site.

> **Demo content:** Exhibitor names and wordmarks are fictional samples. The matching cards feature simple, original food illustrations on clean, light backgrounds and the supplied sample Galactic Granola product photograph. These are concept images, not actual exhibitor products. Replace them with approved exhibitor details and product photography before promoting a live activation.

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

## Replace demo exhibitors and product images

1. Get permission to use each exhibitor's product photography, brand name, and public profile link. Choose a well-lit, web-ready product pack shot (transparent PNG/WebP or square JPEG) with its packaging easy to recognize. Add approved product photos under `assets/products/`, such as `assets/products/acme-sea-salt-chips.jpg`.
2. Edit `data/exhibitors.js`. Each entry includes `companyName`, `logo`, `boothNumber`, `category`, `profileUrl`, and `sponsorLevel`, as well as `productName`, `productImage`, and a stable analytics `id`. Set `productName` to the featured item and `productImage` to its local image path, e.g. `productImage: "assets/products/acme-sea-salt-chips.jpg"`. Replace the sample profile URL with the exhibitor's approved public profile.
3. Replace the fictional company names, package mockups, and sample product images before publishing. The memory cards and matched-brand cards use `productImage`; matches reveal the exhibitor name, featured product, booth, category, sponsor level, and Learn More link. The `logo` field is available for the exhibitor's approved company mark; it is separate from the product image.
4. Keep every `id` unique and stable and provide at least **12 exhibitors** so Hard mode can deal 12 different pairs. Verify each product image, company, booth, sponsor level, and profile URL.
5. Play each difficulty. Check that the product packaging is recognizable at card size, each match reveals the correct exhibitor and booth, and Learn More opens the correct profile. Review the dashboard, then commit the approved assets and data.

The supplied Reti Yeti waving artwork is included at `assets/brand/reti-yeti-waving.png` and displayed on the welcome screen. The approved white Specialty Food Association wordmark from the supplied artwork is at `assets/brand/sfa-logo-white.png`; it is shown unaltered against the game's dark background in the header, dashboard, and card backs. The supplied Galactic Granola image is included at `assets/products/galactic-granola-clusters.png`. Other product illustrations are original concept art, not actual exhibitor products; the illustrations omit package text so the distinct food motifs remain legible at small card sizes. Product categories take inspiration from the variety on the [2026 Summer Fancy Food Show products page](https://events.specialtyfood.com/event/2026-summer-fancy-food-show/products/RXZlbnRWaWV3XzEyNTgzMTU=); its exhibitors' photographs are not reused. Add approved company marks under `assets/logos/` and product photos under `assets/products/`.

## Gameplay and stored data

- **Easy:** 3 × 3 grid, 4 pairs. **Medium:** 4 × 4 grid, 8 pairs. **Hard:** 5 × 5 grid, 12 pairs. To keep each square board, an odd-size mode has one decorative, non-interactive snowflake tile.
- Cards feature a specialty-food product. Matching it reveals its demo exhibitor, featured product, booth, category, sponsor level, and profile link.
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
├── assets/products/
├── assets/logos/
├── admin/dashboard.html
├── admin/dashboard.js
├── admin/dashboard.css
└── README.md
```
