# Wedding invitation website

A single-page, dependency-free invitation (plain HTML, CSS and JavaScript). No build step.
The folder to publish is **`src/`**.

## Run it

```bash
npm start            # serves src/ at http://localhost:8080  (needs python3)
# or any static server, e.g.  npx serve src
npm test             # unit tests for time zones, countdown, plurals, RSVP logic (Node 18+)
```

Open `src/index.html` through a server rather than by double-clicking, so fonts and images load correctly.

## Personalise it (one file)

Edit **`src/config.js`**. Everything marked `// PLACEHOLDER` is demonstration content that must be replaced:

| What | Where in `config.js` |
| --- | --- |
| Names, hashtag | `couple` |
| Date, time, **time zone** (IANA name, e.g. `Asia/Almaty`) | `event` |
| Invitation text, story, schedule, dress code, closing | `invitation`, `story`, `schedule`, `dressCode`, `closing` |
| Venue name, address, map destination (`mapQuery`, optional `twoGisUrl` button) | `venue` |
| RSVP deadline, max party size, endpoint | `rsvp` |
| Contacts | `contacts` |
| Photos | `images` |
| Languages | `languages` |
| Turn sections off (story, countdown, schedule, venue, dress code, RSVP) | `sections` |

Interface wording (buttons, labels, errors) is in **`src/strings.js`**, one block per language.
English and Russian are included. To add a language, add its code to `languages.available`,
copy an existing block in `strings.js`, and add the code to each `{ en: …, ru: … }` text in `config.js`.

The countdown reads `event.start` as local time **at the venue** and converts it with `event.timeZone`,
so it is correct for every visitor.

## Photographs

The included images in `src/images/` are generated illustrations, there only so nothing is empty.
Replace them by putting your own files in `src/images/` and changing the paths in `config.js`
(JPG or WebP; about 2000px wide for the hero, 1200px for the rest). Set `heroFocal` (e.g. `'50% 40%'`)
so the important part of the hero photo survives cropping on phones.
`npm run art` regenerates the illustrations if you want them back.

## Collecting RSVPs (required before sharing)

Out of the box **no replies are saved**. The form validates and then tells the guest plainly that
nothing was sent, because `rsvp.endpoint` is empty. It never shows a success message unless the
server answered with a 2xx status. To collect real replies, set `rsvp.endpoint` to one of:

- **Formspree** (or similar): create a form, paste its URL, keep `format: 'json'`.
- **Google Apps Script web app** writing to a Google Sheet: deploy it as a web app, paste its URL, set `format: 'form'`.
- **Your own server**: accept a POST of `{ fullName, attendance, guests, dietary, message, language, submittedAt }`.

Then submit a test reply and confirm it arrives before you send out the link.
A hidden honeypot field filters simple bots; add server-side rate limiting if you expect abuse.

## Before you publish

1. Replace every `PLACEHOLDER` in `config.js`; check the time zone.
2. Replace images and the share preview `src/images/og.jpg` (1200×630). Then set `og:image` in
   `src/index.html` to an **absolute https URL**, because social networks ignore relative paths.
3. Update the `<title>` and meta description in `index.html` (they are also set from your names at runtime for visitors,
   but link previews read the HTML).
4. Connect the RSVP endpoint and test it.
5. Fonts (Cormorant, Jost) load from Google Fonts with system-font fallbacks. For stricter privacy or offline use, self-host them.
6. The map section shows a built-in preview that opens Google Maps directions. To show a live map, paste a Google Maps
   "Embed a map" URL into `venue.mapEmbedUrl` on your own hosting.

## Files

```
src/index.html   page shell and metadata
src/config.js    all wedding facts (edit this)
src/strings.js   interface text per language
src/lib.js       time zones, countdown, validation, RSVP sending (unit-tested)
src/app.js       renders sections, motion, form behaviour
src/styles.css   design tokens and layout
tools/gen-art.mjs  generator for the demo illustrations
tests/           unit tests
```
