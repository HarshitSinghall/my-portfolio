# Harshit Singhal — Portfolio

An interactive, animated portfolio built as an **AI automation canvas** — a node-graph / terminal
aesthetic that mirrors how Harshit actually works (prompt engineering + n8n workflows).

## Files
- `index.html` — structure & content
- `styles.css` — all styling, theme tokens, animations
- `main.js` — cursor, reveals, hero node-network, the live workflow wires/pulses, counters

No build step, no dependencies (fonts load from Google Fonts).

## Run locally
Just open `index.html` in a browser. For the fonts/animations to behave best, serve it:

```bash
# from the portfolio/ folder
npx serve .
# or
python -m http.server 5173
```

## Deploy (Vercel — you already know it)
```bash
cd portfolio
vercel
```
Or drag the `portfolio` folder into the Vercel / Netlify dashboard. It's fully static.

## ▸ Add the LeadUpAI founders testimonial video
Open `index.html`, find the **TESTIMONIAL VIDEO PLACEHOLDER** section (search `vid__placeholder`).
Replace the `<div class="vid__placeholder">…</div>` with one of these:

**Local / hosted file**
```html
<video class="vid__media" controls poster="thumb.jpg" preload="metadata">
  <source src="leadupai-testimonial.mp4" type="video/mp4" />
</video>
```

**YouTube / Loom / Vimeo embed**
```html
<iframe class="vid__media" src="https://www.youtube.com/embed/VIDEO_ID"
  title="LeadUpAI founders testimonial" frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen></iframe>
```
The reserved slot is already styled at a 16:9 ratio, so the video drops straight in.

## Customising
- Colors/fonts: edit the `:root` tokens at the top of `styles.css`.
- Accent is electric lime `--accent: #c9f24d`; swap it once and the whole site re-themes.
- Hero rotating words: `words` array in `main.js`.
