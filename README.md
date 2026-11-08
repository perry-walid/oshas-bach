# 🐪 Osha's Last Fling — Fayoum bachelorette site

A playful, phone-first site for the bride's friends. Friends **brush away the sand** to uncover their invite, then get the countdown, squad polaroid wall, itinerary, need-to-know info and a packing list.

## Edit the content
Everything you'd want to change lives in **`content.js`**. Search for `TODO` to find every placeholder:
- bride name, trip title, dates (`start` / `end` drive the countdown)
- squad (crop photos to 4:5, put them in `img/` and set `photo: "img/name.jpg"`)
- itinerary days and stops (`dress` adds a dress-code tag)
- FAQ answers, packing list

Keep phone numbers and exact addresses **off** the site (the link is public). Point to the group chat instead.

## Preview locally
```bash
python3 -m http.server 5173   # then open http://localhost:5173
```
To replay the sand game, tap "↺ replay the dig" in the footer (the site remembers you already entered).

## Deploy (free)
**GitHub Pages:** push this folder to a repo → Settings → Pages → "Deploy from branch: main / root".
**Vercel:** `npx vercel` in this folder, or drag the folder onto vercel.com/new (Vercel Drop).

After deploying, add a preview image for WhatsApp: put `img/preview.jpg` (1200×630) in the repo and uncomment the `og:image` tag in `index.html` with the **full** URL.

## Decision log
| Decision | Alternatives | Why |
|---|---|---|
| Fayoum theme: sand, pottery, lake, safari | disco cowgirl, Y2K, editorial | Matches the real trip (Tunis Village, Lake Qarun, Wadi El Rayan, Whale Valley) |
| Entry game: brush the sand | shape a pot, sandboard runner, bride quiz | Most natural touch gesture, nobody gets stuck, ~10s; quiz explicitly not wanted |
| Plain HTML/CSS/JS, no build | React / Next.js | Nothing to install; free hosting anywhere; easy to edit |
| Content in `content.js` (not JSON + fetch) | `content.json` | Works even when opening the file directly (no server) |
| Packing ticks in localStorage | shared database | Personal checklist; no backend needed |
