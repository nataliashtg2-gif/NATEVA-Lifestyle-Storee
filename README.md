# NATEVA — Lifestyle Store

Responsive product catalog built with **HTML, CSS, JavaScript, and Bootstrap 5**.

## Project Structure

```text
NATEVA-Lifestyle-Store/
├── index.html
├── style.css
├── script.js
├── README.md
└── .gitignore
```

## Features

- Responsive mobile-first layout
- Responsive navbar with hamburger menu
- Product grid
- Product category filtering
- Product search
- Wishlist with counter
- Shopping cart with:
  - Add product
  - Quantity + / -
  - Remove product
  - Automatic subtotal
  - Empty-cart state
  - `localStorage` persistence
- Responsive images
- Typography using CSS `clamp()`
- Promo banner
- Benefits section
- Newsletter form
- Footer
- Bootstrap Offcanvas shopping cart
- Bootstrap Toast notifications

## Responsive Breakpoints

The product grid uses:

```html
col-12 col-sm-6 col-lg-4 col-xl-3
```

Therefore:

| Screen | Bootstrap breakpoint | Product columns |
|---|---:|---:|
| Mobile | `< 576px` | 1 |
| Small / Tablet | `≥ 576px` | 2 |
| Large / Laptop | `≥ 992px` | 3 |
| Extra Large / Desktop | `≥ 1200px` | 4 |

The CSS also includes custom media queries at the same responsive ranges to refine spacing and layout.

## `clamp()` Typography

The design uses `clamp()` so headings adapt to the viewport:

```css
font-size: clamp(2.7rem, 8vw, 5.8rem);
```

This keeps typography responsive instead of using one fixed font size.

## How to Run

1. Extract the project ZIP.
2. Open the `NATEVA-Lifestyle-Store` folder in VS Code.
3. Open `index.html`.
4. Right-click `index.html`.
5. Select **Open with Live Server**.
6. Make sure internet access is available because Bootstrap and product images are loaded from CDN/online image URLs.

## Responsive Testing

Open Chrome DevTools:

```text
F12
```

Then enable:

```text
Toggle device toolbar
```

or:

```text
Ctrl + Shift + M
```

Recommended screenshots:

### Mobile
`375 × 667`

Expected:
- Hamburger navigation
- 1 product column
- Images stay inside their containers
- No horizontal overflow

### Tablet
`768 × 1024`

Expected:
- 2 product columns
- Category cards arranged neatly
- Navigation remains usable

### Desktop
`1440 × 900`

Expected:
- 4 product columns
- Hero uses two-column layout
- Footer is arranged in multiple columns
- No horizontal overflow

## Screenshot Documentation

After testing, create:

```text
screenshots/
├── mobile.png
├── tablet.png
└── desktop.png
```

Then add to this README:

```markdown
## Documentation

### Mobile — 375 × 667
![Mobile](screenshots/mobile.png)

### Tablet — 768 × 1024
![Tablet](screenshots/tablet.png)

### Desktop — 1440 × 900
![Desktop](screenshots/desktop.png)
```

## GitHub Repository

Recommended repository name:

```text
TugasWeb-Pertemuan3-Katalog
```

Commands:

```bash
git init
git add .
git commit -m "Create NATEVA responsive product catalog"
git branch -M main
git remote add origin https://github.com/USERNAME/TugasWeb-Pertemuan3-Katalog.git
git push -u origin main
```

Replace `USERNAME` with the GitHub username.

## Notes

The website intentionally does not display academic/task labels. Task-specific explanations are kept in this README and source structure so the storefront itself feels like a real product catalog.

Product images are loaded from Unsplash and require an internet connection.
