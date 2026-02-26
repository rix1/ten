# Otovo 10 Years Event Site

This is a static one-page event site built with plain HTML, CSS, and JS.

## Structure

- `index.html` — page markup and content
- `styles.css` — all styling, theme tokens, layout, and animations
- `main.js` — reveal animations and RSVP mailto behavior

## Local preview

Serve the folder with any static file server. Example with Deno:

```bash
deno run --allow-read --allow-net jsr:@std/http/file-server . --port 3000
```

Then open [http://localhost:3000](http://localhost:3000).

## Deployment

Deploy this folder as a static site (no Next.js build required).
