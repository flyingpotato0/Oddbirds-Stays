# Oddbirds Stays — Static Prototype

A small static HTML/CSS/JavaScript prototype for the Oddbirds Stays website. This repository contains a single-page prototype and two demo room pages that showcase layout, image slideshows and small interactive UI behaviors without any build step.

Quick local preview

1. Open [index.html](index.html) in your browser (double-click or drag into the browser).

What you'll find

- **Landing / demo**: a simple homepage with a card-style layout and an "Our Spaces" preview.
- **Room demos**: `suite-a.html` and `suite-b.html` contain crossfading image slideshows for two sample rooms.
- **No build step**: plain HTML, CSS and vanilla JS — edit files and reload the browser.

Project structure

- [index.html](index.html) — main prototype entry
- [suite-a.html](suite-a.html), [suite-b.html](suite-b.html) — room demo pages with slideshows
- [script.js](script.js) — interactive behaviors (mobile nav, slideshow setup)
- [styles.css](styles.css) — site styles
- [Images/](Images/) — local images used by the slideshows and preview cards
- [places.txt](places.txt) — sample data used by the demo

Notes about images and slideshows

- The demo uses images stored in the `Images/` folder. If you add or replace images, keep filenames consistent with the slideshow markup in the HTML pages.
- The "Our Spaces" card uses a default preview image (see image elements in `index.html`).

Development & editing tips

- To change slideshow timing or behavior, edit `script.js` where slideshows are initialized.
- There is no package.json or build tools — simply edit and refresh.

Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes and history.
