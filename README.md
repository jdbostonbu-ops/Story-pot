<p align="center">
  <img src="booknotelogo.png" alt="Story Pot Logo" width="140">
</p>

A memory archive built for two kinds of people, and one moment that's slipping away. **At home:** *the recipe Nana never wrote down, the lullaby Abuela hummed at the stove, the story Papi tells the same way every Christmas.* **At work:** *the founding story only the first three employees know, the recipe a coworker brings every Heritage Month, the inside joke that became the team's anthem.* Story Pot records audio and video directly from the browser, transcribes the speech in 67 languages, and saves everything locally on your device so the recordings outlive the moment. No accounts, no servers, no cloud &mdash; *what we cooked, what we sang, what we said.*

## 👤 Author
**Jacqueline**
[Check out my GitHub Profile](https://github.com/jdbostonbu-ops)
🚀 **[Try the Live App](https://jdbostonbu-ops.github.io/Story-pot/)**

<p align="center">
  <img src="storypot.gif" alt="Story Pot Showcase Demo" width="750">
</p>

## 🏠🏢 Two Archives, One App — Family Mode and Team Mode

Story Pot ships with a built-in mode toggle on the home screen masthead. Tap **Family** or **Team** to switch the entire archive between two parallel namespaces &mdash; each with its own people, categories, recordings, photos, and transcripts. The two archives never see each other. Switching modes reloads the page so every render, factory, and storage read re-initializes against the active namespace.

### Family Mode — The original Story Pot
The recipe Nana never wrote down. The lullaby Abuela hummed at the stove. The story Papi tells the same way every Christmas. Family mode is built around the people in your life who hold traditions in their voices and hands. Add Nana, Abuela, Papi, Yia Yia as individual people. Filter the archive by person. Cards on the home dashboard are titled *Stories*, *Recipes*, *Songs*, *Poems*. The masthead reads *"A family memory archive."*

### Team Mode — The culture rituals of small companies
The founding story only the first three employees know. The Recipe Friday a coworker brings every Heritage Month. The team anthem someone wrote at the offsite. The inside joke that became a Slack channel. Team mode is built for small businesses and small companies who want to keep the human texture of their culture &mdash; not org charts, not OKRs, but the rituals and stories that make a team feel like a team. The masthead reads *"A team memory archive."* The fourth home-dashboard slot swaps from **Poems** to **Jokes**. Microcopy adjusts throughout: *Family* becomes *Team*, *Add person* becomes *Add contributor*, and category placeholders reframe around culture rituals (*"Recipe Fridays. Heritage Month. The shared kitchen."* / *"Team songs, anthems, celebrations."* / *"Inside jokes, ice-breakers, things that make the team laugh."*). **And the whole app flips to a cool-gray light theme** &mdash; index, recorder, detail view, even the mobile browser address-bar tint &mdash; so the visual context itself signals *you are in the team archive now*, not just a swapped logo. The indigo accent stays the same across both modes, so Story Pot still feels like one brand wearing two outfits.

### How the two archives stay separate

Every piece of mode-scoped data lives under a namespaced localStorage key:

```
storypot-dark.family.people.v1       storypot-dark.team.people.v1
storypot-dark.family.categories.v1   storypot-dark.team.categories.v1
storypot-dark.family.recordings.v1   storypot-dark.team.recordings.v1
storypot-dark.family.meta.v1         storypot-dark.team.meta.v1
```

The IndexedDB blob store is shared across both modes (the media blobs themselves are content, not context &mdash; each recording's metadata knows which mode it belongs to). A legacy migration runs on first load to move any un-namespaced data from a previous version into the `family.*` namespace, so users who installed the v1 single-mode app don't lose anything when they update.

### Who Story Pot is for

- **Personal users and families** &mdash; anyone with a grandmother's recipe, a parent's song, an aunt's story, a relative's voice they want to keep before the moment slips away.
- **Small businesses and small teams** &mdash; cooperatives, design studios, agencies, restaurants, nonprofits, classrooms, mutual-aid groups, any organization small enough that the culture lives in the people, not in a process manual.

Either audience opens the same app. The toggle takes one tap.

## 🎨 Brand Identity — Dark Editorial Theme (and its Team Light Variant)

Story Pot's brand is built around one idea: **some things outlive us, and the voice is one of them**. The aesthetic is dark editorial &mdash; pure black background, white serif type, indigo accent &mdash; because the work the app does (preserving the voices of people who won't always be here, the culture rituals of teams who won't always be the same) deserves a brand that feels like a quiet evening reading, not a Saturday morning push notification.

This was the winner of a four-folder design exploration. Three other versions exist (a warm pastel "Dream Birds" edition, an austere all-white modern editorial edition, and an experimental cozy edition), but **the dark editorial direction was the one that landed**. Photos pop dramatically against black surfaces. Headlines feel like magazine covers. The accent indigo glows against the dark like ink against velvet.

**Team mode runs a light variant of the same brand.** Family mode keeps the original dark editorial aesthetic untouched. Team mode flips the surface and ink palette to cool gray and near-black for instant visual recognition of which archive you're in &mdash; same Fraunces serif, same Inter body type, same indigo accent, same editorial restraint. The two modes are *one brand in two registers*, not two different products: dark for the family evening, light for the team workday.

### The Indigo, Black, and Quiet Light Palette

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Paper** | `#0A0A0A` | Primary background &mdash; near-black, never pure black (true `#000` is harsh on white text) |
| **Surface 1** | `#161616` | Card and modal backgrounds |
| **Surface 2** | `#1F1F1F` | Hover states, transcript blockquotes |
| **Ink** | `#F5F5F5` | Primary text &mdash; near-white, never pure white |
| **Ink Soft** | `#A8A8A8` | Body and secondary text |
| **Muted** | `#6B6B6B` | Labels, metadata, mono captions |
| **Indigo** | `#7C8FFF` | The accent &mdash; recording pills, "what we sang", FAB record button, active mode-toggle pill (slightly lighter than typical indigo because indigo on black needs more luminance) |
| **Indigo Deep** | `#5048E5` | Hover state for accent elements |
| **Amber** | `#FFB347` | The Song category |
| **Pink** | `#FF6B9D` | The Poem / Joke category |
| **Silver** | `#A8A8A8` | The Story category |

The palette breaks the warm-and-fuzzy convention of memory apps. Most family-archive apps default to soft sepia, gentle creams, dusty roses. Story Pot doesn't whisper. **Color does specific jobs:** indigo is action and emphasis (record, hover, the operative word in the hero headline, the active mode pill). Amber and pink and silver each own one category. Ink is content. The surface graduates from `#0A0A0A` to `#1F1F1F` so cards lift off the background subtly without needing borders or shadows.

### The Team Mode Light Palette — Same Brand, Different Register

When the user toggles to Team Archive, the same CSS custom-property system that paints the dark theme re-points to a cool-gray light palette. The brand colors (indigo accent, amber/pink/silver category colors) stay untouched. Only the surfaces and ink flip:

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Paper (light)** | `#F4F6FA` | Primary background &mdash; cool gray, distinct from Family mode's near-black at a glance |
| **Surface 1 (light)** | `#FFFFFF` | Card and panel backgrounds &mdash; the whitest surface, where content lives |
| **Surface 2 (light)** | `#E8ECF3` | Deepest light surface &mdash; inputs, gallery tile backgrounds |
| **Divider (light)** | `#E1E5EC` | Hairline borders, separators |
| **Divider Strong** | `#C9CFDA` | Stronger borders, focus rings |
| **Ink (light)** | `#1A1A1A` | Primary text &mdash; near-black on light, matching the contrast ratio of `#F5F5F5` on `#0A0A0A` |
| **Ink Soft (light)** | `#5A5A5A` | Body and secondary text |
| **Muted (light)** | `#8A8A8A` | Labels, metadata, mono captions |

The light variant is **a single CSS scope** &mdash; `body.mode-team` redefines the color custom properties, and every component on every page re-skins itself with zero per-component changes. The `<meta name="theme-color">` tag also flips dynamically in JavaScript so the mobile browser's address-bar tint matches the active mode. The card shadow softens from `rgba(0,0,0,0.5)` to `rgba(20,30,60,0.08)` because heavy dark shadows look harsh on light surfaces. **No HTML changed** to ship this feature &mdash; the body-class hook was already in place from the original mode toggle, and the CSS variables were already in use throughout. It is the kind of feature that only becomes a one-afternoon job when the codebase has been built with separation of concerns from day one.

<p align="center">
  <img src="twobookslogo.png" alt="Story Pot Logo" width="240">
</p>

### The Two Logos

Story Pot ships with two book-illustrated logos that swap based on the active mode. **Family mode** uses `booknotelogo.png` &mdash; a single book with musical notes flowing from it, the original Story Pot mark. **Team mode** uses `twobookslogo.png` &mdash; two books side by side, signaling the shared, collective nature of the team archive. Both render in the same cyan-and-purple palette so the masthead feels like one design system, not two different brands.

### The Hero — Editorial Headline, One Strong Move

The welcome page is built around a single move: a massive Fraunces serif headline that reads *"What we cooked, **what we sang**, what we said."* &mdash; with **"what we sang"** in glowing indigo italic. Three short clauses, each on its own line, each a verb in the past tense. The grammar IS the brand: this is what we kept of the people who are gone, the teams who change, the moments that don't come back.

The Storypot wordmark sits small and quiet in the top-left corner of every page. The mode toggle (Family / Team) sits on the top-right next to a `V.1` version stamp, with a thin horizontal divider underneath. The hero space below is mostly empty &mdash; the headline carries the weight. A small eyebrow in tracked uppercase mono sits above the headline; its text swaps per mode (*"A FAMILY MEMORY ARCHIVE"* / *"A TEAM MEMORY ARCHIVE"*). The "Begin →" CTA is a glowing indigo pill button. Quiet trust line below: *"No account · Stays on your device."*

### Typography — Fraunces + Inter

| Typeface | Use | Why |
| :--- | :--- | :--- |
| **Fraunces** (serif display, 400-900 + italic) | Wordmark, hero headline, recording titles, modal headers | Modern serif with strong italic personality &mdash; reads as editorial, not sentimental. The italic is reserved for the operative emphasis word in headlines (*"the voices,"* *"what we sang,"*) where the indigo accent picks it up. |
| **Inter** (sans, 400/500/600/700) | Body text, transcribed prose, supporting paragraphs | Clean, neutral, readable at every size. **The grandmother's actual words live here** &mdash; the recipes, stories, songs &mdash; in mixed-case Inter. **The team's actual words live here too** &mdash; the inside jokes, the founding stories, the anthems. |
| **ui-monospace** (system mono) | Utility UI, captions, version stamps, mode-toggle pill labels, metadata | Monospace gives the technical voice. Every character holds the same width. Used UPPERCASE for labels, never as prose. |

Three voices for three jobs: serif for the brand and headlines, mono for utility scaffolding, humanist sans for transcribed prose. **The contrast is the brand.** A dark editorial app that yelled the recipe content in mono caps would betray its own purpose. Inside the frame, your grandmother's voice is plain Inter, normal weight, mixed-case &mdash; just her words. Your team's founding story renders the same way.

## 🎓 Built During Next Chapter — Phase I

This project was designed and built during **Phase I of Thinking with AI** at Next Chapter Apprenticeship. Each lesson fed directly into this build:

- **Computational Thinking** — Decomposing the project into five independent factory functions (`createArchive`, `createPersonStore`, `createMediaRecorder`, `createTranscriber`, `createSearchIndex`), recognizing the recurring closure-based factory pattern, abstracting media capture into a single factory that handles audio-only or audio-plus-video without the UI knowing the difference, surfacing the data model split between metadata (small, fast, in localStorage) and blobs (big, slow, in IndexedDB), and recognizing that "the same app for families and teams" could be achieved with namespaced storage keys rather than a parallel codebase.
- **HTML / CSS / Forms** — Semantic landmark structure, accessible labels with `for` attributes on every form input, button-group containers using `role="group"` and `aria-labelledby` for screen readers (because `<label>` semantically belongs only with form inputs, not with control groups), mobile-first responsive layouts, modal stacking handled with explicit `z-index` ordering when modals open from inside other modals, case-insensitive duplicate-prevention on every form input that creates a new record, and a single `data-mode-label` attribute scheme that lets one HTML template render different microcopy per mode without duplicating markup.
- **JavaScript Fundamentals** — Closure-based factory functions keeping all state private; `IndexedDB` for storing megabyte-sized audio and video blobs (since `localStorage` caps at 5 MB); `textContent` for every user-rendered string (XSS-safe by construction); migration code that runs once per page load to add missing default categories, merge user-created duplicates with new built-ins, and move legacy un-namespaced storage keys into the new `family.*` namespace when users upgrade from the single-mode v1; defensive ID-based category references so the home page Poems slot finds recordings filed under either the built-in "poem" or a legacy custom "Poem" category.
- **Audio & Video Programming** — Reading the `MediaRecorder` API spec carefully enough to satisfy mobile autoplay and permission policies (lazy `AudioContext` on first user gesture, defensive permission handling), feature-detecting MIME-type support across browsers (WebM Opus on Chrome/Firefox/Edge, MP4 on iOS Safari), wiring the Web Speech API for live transcription in 67 BCP 47 languages, and using `canvas.toDataURL` (synchronous, reliable everywhere) instead of `canvas.toBlob` (async, silently fails on Safari with `getUserMedia` streams) for in-browser camera snapshots.

The project demonstrates everything Phase I covered, deployed as a working PWA with full audio recording, video recording, multilingual transcription, in-browser camera capture, photo upload, **and a two-mode toggle that ships one app for two audiences** &mdash; all running offline once installed.

## 🌐 Browser & Device Compatibility

| Browser / Device | Status | Performance Notes |
| :--- | :--- | :--- |
| **Google Chrome** | ✅ Tested | Full support &mdash; audio, video, transcription in all 67 languages, camera snap photo, photo upload, PWA install, mode toggle. |
| **Microsoft Edge** | ✅ Tested | Matches Chrome rendering and Web Speech API behavior exactly. |
| **Firefox** | ⚠️ Partial | Audio + video recording works fully. Camera snap photo and photo upload work fully. Mode toggle works fully. Transcription unavailable &mdash; Firefox does not implement the Web Speech API. The transcription toggle is auto-disabled with a clear notice. |
| **Apple Safari (macOS)** | ✅ Tested | Lazy AudioContext correctly waits for first user gesture. Snap photo uses `toDataURL` because `toBlob` silently fails on Safari with getUserMedia streams. Transcription routes through Apple's recognizer. |
| **iPhone (iOS Safari)** | ✅ Tested | PWA installs to home screen, microphone and camera permissions handled correctly, audio survives app backgrounding. Snap photo opens the live camera modal above the recording flow with proper z-index stacking. |
| **iPad / iPadOS** | ✅ Tested | Recording flow scales correctly across viewport sizes. |

## 🌟 Key Features

- **Family Mode and Team Mode:** Tap the toggle in the masthead to switch between two parallel archives. Each mode has its own people (or contributors), its own categories, its own recordings, its own photos, its own transcripts. Storage namespaces keep the two completely separate. Microcopy adjusts throughout: the masthead eyebrow swaps, *Family* becomes *Team*, *Add person* becomes *Add contributor*, the fourth dashboard slot swaps from **Poems** to **Jokes**, and category placeholders reframe around team culture rituals. **The whole app flips from dark editorial to a cool-gray light theme** when Team mode is active &mdash; index, recorder, detail view, and the mobile browser address bar &mdash; so the visual context itself signals which archive you're in, not just a swapped logo.
- **Audio Recording with Live Waveform:** Capture voice memos of any length using the `MediaRecorder` API. The recording screen shows a live indigo waveform driven by Web Audio's `AnalyserNode`, a big Fraunces serif timer counting up in indigo, and a pulsing red recording dot. Pause and resume mid-recording without losing the take.
- **Video Recording for Technique Demonstrations:** When Nana wants to *show* you how to fold the pierogi, or when a teammate wants to demo the technique behind the team's signature dish at Recipe Friday, switch to video mode. The same `MediaRecorder` factory handles it &mdash; `getUserMedia` requests both audio and video tracks, the camera preview appears live in the recording screen, and on save the full audio + video blob lands in IndexedDB.
- **Snap Photo from the Browser:** A "Take photo" button opens a fullscreen camera modal with live video, a "Snap" button captures the current frame as a 1200px-max JPEG (canvas → dataURL → Blob), and the snapped photo attaches as the cover image of the recording you're about to make. No leaving the app, no fumbling with the native camera and re-uploading.
- **Photo Upload as an Alternative:** Don't want to use the live camera? Tap "Upload" and pick an image from your library. Same end result &mdash; photo attaches to the recording, displays as the cover thumbnail.
- **Transcription in 67 Languages:** The Web Speech API turns the spoken recording into searchable text in real time. The language picker on the recording-setup screen organizes options into 10 grouped sections via native `<optgroup>`: ENGLISH (8 dialects), SPANISH (8 regional variants), CHINESE (Mandarin CN, Mandarin TW, Cantonese), ARABIC (6 regional variants), PORTUGUESE (BR + PT), FRENCH (FR + CA), EUROPEAN (18 languages from Italian to Hebrew), SOUTH ASIAN (10 languages from Hindi to Urdu), EAST + SE ASIAN (7 languages including Korean, Vietnamese, Tagalog), and AFRICAN (Swahili, Afrikaans, Zulu).
- **Four Default Categories + Custom:** Recipe, Song, Story, and a fourth slot that's **Poem** in Family mode or **Joke** in Team mode &mdash; each with its own color (indigo, amber, silver, pink) and filter pill on the recording screen. Add custom categories like "BLESSING" or "ICE-BREAKER" via the + new button. Every custom category gets duplicate-prevented at creation time and reassigned via migration if a user-created category later matches a built-in name.
- **Per-Person / Per-Contributor Archive:** In Family mode, add Nana, Abuela, Papi, Yia Yia, or anyone else as their own avatar in the FAMILY row. In Team mode, add coworkers as contributors in the TEAM row. Each person gets a colored initial-circle in one of six bright pop colors that read well against black; tap an avatar to filter the recordings list to just that person.
- **Four-Slot Home Dashboard:** The home page shows four large category cards in a 2×2 grid &mdash; *Stories, Recipes, Songs, Poems* in Family mode or *Stories, Recipes, Songs, Jokes* in Team mode &mdash; each displaying the most recent photo from that category as a hero image with the recording title and attribution underneath. Empty categories show mode-appropriate placeholder text inviting the first recording. Categories with multiple photos show a "+N" badge.
- **Gallery Overlay for Multi-Photo Categories:** Tap a category card with 2+ photos and an in-page gallery overlay opens, showing every photo in that category as a tile grid with title and attribution captions. Tap any tile to jump to that recording's detail view.
- **Duplicate Prevention with "Use Existing":** Try to add a person or category that already exists &mdash; even with a case mismatch ("nana" vs "NANA") &mdash; and the app intercepts before saving. A friendly modal asks: *"Nana already exists. Use the one you already have?"* Tap **Use existing** to set the existing one as active; tap **Cancel** to fix the name. Works for both people and categories, in both modes.
- **Live Duplicate Hint:** As you type a name in the Add Person / Add Contributor or Add Category modal, a subtle hint appears under the input the moment a match is detected: *"Name already exists ▸"*. Catch the duplicate before tapping Save.
- **Single-Page Detail View:** Tap any recording on the home screen and a detail modal opens with everything visible at once: the category pill in indigo, the recording title in Fraunces serif, the attribution (*"from Nana Tule · May 2026"* in Family mode, *"from Maria, Operations · May 2026"* in Team mode), the audio or video player with full native controls, the duration and mode meta row, the photo if attached, and the transcript in mixed-case Inter against a slightly-lifted dark surface &mdash; all on one scroll-free screen.
- **Edit Transcript:** Auto-transcription is great but not perfect. The detail view has an Edit transcript button that opens a textarea pre-loaded with the current transcript. Fix typos, correct names, fill in inaudible parts by hand. The audio recording stays exactly as recorded; only the searchable text changes.
- **Search by Anything:** The search bar matches across recording title, person name, category name, and the full transcript text &mdash; case-insensitive. Type *"pierogi"* and find Nana's recipe. Type *"Spanish"* and find every recording in any Spanish dialect. Type *"founding"* and find every team origin story.
- **List View + Grid View:** Toggle between a vertical list (with cover thumbnails, titles, attribution, and metadata) and a 2 or 3 column grid (visual gallery with cover photos as tiles). Choice is remembered across sessions.
- **Storage Meter:** A subtle bar at the bottom of the home screen shows current IndexedDB usage in human-readable units (KB / MB / GB) and the percentage of the device's quota used. The meter reads across both modes since the blob store is shared.
- **PWA Installable:** Add to Home Screen on iPhone, ⬇ Install on Chrome/Edge desktop. Story Pot becomes a standalone app, opens fullscreen with no Safari URL bar, and works exactly like a native app.
- **Mobile-First Throughout:** Recording flow scales correctly on every device, family/team avatar row scrolls horizontally on touch, the FAB record button anchors to the safe-area inset on iPhones with home indicators, and every text input has `autocomplete` and `autocapitalize` attributes set.
- **Accessible Throughout:** Every form `<label>` is associated with a form field via `for=`, button groups use `role="group"` with `aria-labelledby`, modals use `role="dialog"` and `aria-modal`, the mode toggle uses `aria-pressed` to announce the active mode to screen readers, every animation respects `@media (prefers-reduced-motion)`, the FAB and category pills have `aria-label` attributes, and color is never the only signal (icons and text labels accompany every color-coded element).

## 🔒 Privacy & Your Data

Story Pot was built to know nothing about you, period. This is true in both Family and Team modes.

- **No account, no signup.** You can add family members or team contributors, record voices, transcribe in any of 67 languages, and search your archive without creating an account or sharing personal information.
- **No server, anywhere.** Story Pot has no backend, no database, no API. It's a static site. Once your browser loads it, every recording, every transcript, every person you add lives only on your device.
- **Recordings stay on your device.** Audio and video blobs save directly to IndexedDB on your phone or laptop. They never get uploaded, streamed, or backed up to the cloud. This matters double in Team mode &mdash; the things that make a small company feel like a small company often shouldn't live on a corporate server.
- **The one privacy trade-off &mdash; transcription.** The Web Speech API works by sending audio to Apple or Google's recognizer for the seconds it takes to convert speech to text, then returns the text. **Story Pot is transparent about this:** the trust line and the privacy notes inside the app explain what happens. You can decline transcription and use Story Pot as a pure-local audio archive.
- **No notifications, no permissions you don't expect.** Story Pot asks for the microphone (for audio) and camera (for video and snap photo) permissions only when you tap the relevant button &mdash; never on page load. No location, no contacts, no notification permission, nothing else.

`However, if you don't use the Story Pot app per iOS policy, for 7-30 days your data will be erased.`

Story Pot doesn't use cookies, doesn't track you, and doesn't have a database that stores anything about you.

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+) &mdash; five closure-based factory functions, `crypto.randomUUID()` for record IDs, `requestAnimationFrame` for the live waveform, native `<optgroup>` for the language picker, `textContent` for every user-supplied string
- **Storage:** **IndexedDB** for media blobs and photo blobs (audio and video can be megabytes; localStorage caps at 5 MB), **localStorage** for metadata (people, categories, recording records, view-mode preference). Two-tier storage keeps the metadata light and instantly searchable while the heavy media stays in the right place. Keys are namespaced as `storypot-dark.<mode>.*` where `<mode>` is `family` or `team`, so the two archives operate entirely independently. The active mode itself lives at `storypot-dark.active-mode` (un-namespaced, since it determines which namespace to use).
- **Styling:** CSS3 &mdash; Custom Properties, CSS Grid, Flexbox, restrained `border-radius` system (4px / 8px / 12px / 999px pill), 1px dividers, no soft drop shadows on light surfaces, glowing `box-shadow` on the indigo accent button (because light radiating against dark is the whole aesthetic), `clamp()` for fluid headline sizing, `prefers-reduced-motion` overrides for every transition, mobile-first breakpoints
- **Modal Stacking:** Explicit z-index hierarchy &mdash; recording flow at `200`, camera modal at `300` so it stacks above the recording flow when opened from inside it, gallery overlay at `1000` for the home dashboard
- **Typography:** Fraunces (serif display + italic), Inter (body and prose), ui-monospace (system mono for utility) &mdash; Google Fonts
- **Audio:** Web Audio API &mdash; `AudioContext`, `AnalyserNode` for the live waveform, lazy context creation to satisfy iOS Safari and Chrome mobile autoplay policies
- **Recording:** `MediaRecorder` API with feature-detected MIME types (WebM Opus on Chrome/Firefox/Edge, MP4 on iOS Safari), `getUserMedia` for microphone-only or microphone-plus-camera streams
- **Photo Capture:** `getUserMedia` for camera access, `<canvas>` element with `drawImage(video, ...)` to grab the current frame, `canvas.toDataURL` → `atob` + `Uint8Array` → `Blob` conversion for synchronous, cross-browser-reliable JPEG output (deliberately avoiding `canvas.toBlob` which silently fails on some Safari versions with getUserMedia streams)
- **Transcription:** Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`), with 67 BCP 47 language codes from `en-US` to `sw-KE`
- **PWA:** Web App Manifest with `theme_color: "#0A0A0A"` for the dark mode browser chrome (the manifest stays dark because the app boots into Family mode by default), a `<meta name="theme-color">` tag in each HTML page that gets updated dynamically in JavaScript so the mobile address-bar tint flips to `#F4F6FA` when Team mode is active, service worker (`sw.js`) using network-first strategy with offline fallback, full Add-to-Home-Screen support, namespaced cache key `storypot-dark-v9` (bumps on every release that changes shipped assets)
- **Deployment:** GitHub Pages and Vercel &mdash; static site, automatic HTTPS, auto-deploy on every push to `main`

## 🚀 The User Flow

- **Land on the welcome page** → see the Storypot wordmark in serif at the top-left, the **Family / Team mode toggle** and V.1 stamp at top-right, mode-appropriate eyebrow (*"A FAMILY MEMORY ARCHIVE"* or *"A TEAM MEMORY ARCHIVE"*), the massive Fraunces hero headline *"What we cooked, **what we sang**, what we said."* with the indigo italic emphasis, supporting paragraph, glowing indigo "Begin →" button, and the four-slot dashboard below
- **Optionally tap the mode toggle** → switch between Family and Team archives; the page reloads and every label, logo, and storage namespace re-initializes against the new mode. **Team mode flips the entire app to a cool-gray light theme &mdash; instant visual confirmation that you're in the team archive, not the family one.** Your other archive stays intact for the next time you toggle back.
- **Tap Begin →** → arrive on the recorder page; see the wordmark masthead, the search input, the empty Family/Team row prompting you to add the first person or contributor
- **Tap + add in the Family / Team row** → modal opens; type a name (e.g., "Nana" or "Maria"), pick a relation or role, pick an avatar color from six bright pops (indigo / amber / pink / teal / sun / silver), pick a primary language for transcription, tap Save
- **Tap the indigo glowing FAB record button** → recording-setup screen opens; pick the person/contributor, pick a category (Recipe / Song / Story / Poem-or-Joke / custom), type a title, pick a language from the 67-language `<optgroup>` dropdown, choose audio or video mode, optionally take a photo or upload one, toggle transcription on or off
- **Tap Start ▸** → the browser asks for microphone (and camera if video mode) permission; recording begins; the timer counts up in indigo Fraunces, the waveform pulses live in indigo, the transcription previews in a bordered dark surface if enabled
- **Tap the big stop button** → recording saves to IndexedDB immediately; toast: *"Saved to the pot."*; the recording appears at the top of the Recent list with the person's avatar, category pill, title, photo thumbnail (if attached), duration, and date
- **Tap a recording** → detail modal opens with everything visible: photo at the top, title in Fraunces serif, attribution, audio or video player with full controls, duration and mode meta row, transcript in mixed-case Inter
- **Optionally tap Edit transcript** → textarea opens pre-loaded with the current transcript; fix typos or fill in inaudible parts; tap Save; the searchable text updates
- **Search the archive** → type any word in the search bar; matches return across title, person name, category name, and transcript text
- **Filter by person/contributor** → tap an avatar in the Family/Team row to show only that person's recordings; tap again to clear
- **Filter by category** → tap a colored pill (Recipe in indigo, Song in amber, Story in silver, Poem-or-Joke in pink, or any custom one) to filter
- **Switch to grid view** → tap the Grid toggle to see all recordings as cover-photo tiles in a 2 or 3 column grid
- **Return to home** → tap the Storypot wordmark; the four-slot dashboard shows the most recent photo from each category as a hero image
- **Tap a category card on home** → if 2+ photos exist, the gallery overlay opens with every photo in that category as a tile grid; if only 1, it jumps to the recorder

## 🎼 The Architecture — Five Factory Functions

Story Pot's five factory functions are the engineering heart of the project. Each one owns one thing, keeps its state private via closure, and exposes a small public API. The `init()` function wires them together with the DOM. All four mode-scoped factories read the active mode at construction time and use the namespaced keys for the active archive.

### `createArchive()` — IndexedDB Blob Storage

Holds the audio, video, and photo blobs. Shared across both modes (the blob store name is `storypot-dark.archive`, no per-mode suffix). Each blob is stored under an auto-incrementing key. Audio recordings are typically 200 KB to 2 MB; video recordings are 5 MB to 50 MB; photos are 50 KB to 400 KB after the 1200px resize. localStorage's 5 MB cap can't hold even one video, which is why the two-tier architecture exists.

```js
async saveBlob(blob, mimeType, durationMs) { /* writes blob, returns id */ }
async getBlob(id) { /* returns { blob, mimeType, durationMs, createdAt } */ }
async deleteBlob(id) { /* removes blob */ }
async getStorageEstimate() { /* returns { usage, quota } for the meter */ }
```

### `createPersonStore()` — localStorage Metadata (Mode-Scoped)

Holds people, categories, recording records (without the heavy blobs), and app meta-flags like `hasSeenTranscribeNote`. Everything is stored as JSON under four namespaced keys per mode: `storypot-dark.family.people.v1` / `storypot-dark.team.people.v1`, and so on for categories, recordings, and meta. An observer pattern (`onChange`) re-renders the home screen whenever the data changes. Includes a one-time migration that adds any missing default category (so adding "Poem" as a 4th default in v2 didn't require users to lose their data), merges user-created duplicates with new built-ins, and migrates any legacy un-namespaced storage keys into the `family.*` namespace so v1 users don't lose data when they upgrade to the two-mode v2.

### `createMediaRecorder()` — Audio + Video Capture

Wraps the `MediaRecorder` API. The same factory handles audio-only or audio-plus-video. Feature-detects MIME-type support across browsers. Drives the live waveform via Web Audio's `AnalyserNode`. Returns the captured `Blob` on stop.

```js
async start({ mode, videoEl, onWave }) { /* starts capture */ }
pause() / resume() / cancel() / stop() // returns { blob, mimeType, durationMs }
```

### `createTranscriber()` — Web Speech API Wrapper

Wraps `SpeechRecognition` / `webkitSpeechRecognition` for live transcription. Accepts a BCP 47 language code on `start()`, falls back to `navigator.language` if none is provided. Handles browser quirks: silent restarts when the API stops after a pause, accumulating final + interim results, gracefully degrading on Firefox where the API doesn't exist.

### `createSearchIndex()` — Substring Matcher

Pure function. Filters the recordings list across title, person name, category name, and transcript text &mdash; case-insensitive. Combines with the active person filter and active category filter for the home-screen result list.

## 🎓 The Data Model — How Recordings Are Stored

Each recording is stored as **two pieces** living in two different places:

1. **The metadata** lives in `localStorage` under the active mode's recordings key (`storypot-dark.family.recordings.v1` or `storypot-dark.team.recordings.v1`):

```json
{
  "id": "uuid-1234",
  "personId": "uuid-nana",
  "categoryId": "recipe",
  "title": "Pierogi",
  "mode": "video",
  "blobId": 7,
  "photoBlobId": 8,
  "mimeType": "video/webm",
  "durationMs": 247000,
  "transcript": "First you mix the flour with the egg...",
  "language": "pl-PL",
  "createdAt": 1715284800000
}
```

2. **The media blob** (audio or video) lives in IndexedDB at the key `blobId`. **The photo blob** lives separately at the key `photoBlobId` so the home page can fetch just the photo for the dashboard cards without loading the whole audio/video. When you tap a recording on the home screen, Story Pot looks up the metadata in the active mode's namespace, reads the blob ids, fetches both from IndexedDB, and creates temporary `Object URL`s for the audio/video player and the photo display.

This split lets the home dashboard render instantly (metadata is tiny and lives in localStorage, which loads synchronously) while the heavy media gets loaded only when needed. The two-tier model also means switching modes is fast &mdash; only the metadata-namespace pointer changes, the blob store doesn't have to reindex.

## 📲 Add Story Pot to Your iPhone

Story Pot is a Progressive Web App (PWA), which means it can install to your home screen exactly like a native app &mdash; same icon, same fullscreen experience, same access to the microphone and camera.

### Install Steps

1. **Open Safari on your iPhone** (not Chrome &mdash; iOS only allows PWA installation through Safari)
2. **Visit** the deployed URL (e.g. `https://story-pot.vercel.app/`)
3. **Tap the Share button** &mdash; the square with the up-arrow at the bottom of Safari
4. **Scroll down and tap "Add to Home Screen"**
5. **Confirm the name** (default is "Story Pot") and tap **Add**
6. **Find Story Pot on your home screen** and tap to open

The app launches fullscreen, no Safari URL bar. Looks and feels like a native app. The same install supports both Family and Team modes &mdash; toggle inside the app to choose.

### First-Time Permissions

When you tap the indigo record button for the first time, iOS will ask: *"'Story Pot' Would Like to Access the Microphone."* Tap **Allow**. If you record video or use Snap photo, it'll also ask for camera access. After that one-time permission, Story Pot has full access for all future recordings.

### iOS-Specific Notes

- **Web Speech transcription on iOS Safari** routes through Apple's speech recognizer, which is excellent for English, Spanish, French, Italian, and other major languages, and varies for smaller regional dialects.
- **Audio survives app backgrounding** &mdash; if you switch apps mid-recording, Story Pot continues capturing.
- **iOS storage retention** &mdash; Apple sometimes clears Web Storage (including IndexedDB) for PWAs that haven't been opened in 7-30 days. For long-term family or team archiving, recordings should be opened periodically. A future version will add an export feature for permanent backups.

### Updating an Already-Installed PWA

If you installed Story Pot to the home screen earlier and updates have shipped since, your home-screen version might be cached:

1. Long-press the Story Pot icon on your home screen
2. Tap Remove App → Delete from Home Screen
3. Open Safari, visit your Story Pot URL fresh
4. Pull down to refresh the page
5. Tap Share → Add to Home Screen → Add
6. Open the fresh icon

## 🔐 Architecture Overview

```
Browser (everything happens here)
  ↓ User taps Family/Team toggle, + add, FAB record, or a recording card
Mode bootstrap (runs first on every page)
  ↓ Reads storypot-dark.active-mode from localStorage
  ↓ Swaps masthead labels and logo per mode
  ↓ Sets body.mode-family or body.mode-team for CSS hooks
Closure-based factories (mode-aware)
  ↓ createArchive()
  ↓   - Private state: IndexedDB connection, schema version
  ↓   - Public API: saveBlob, getBlob, deleteBlob, getStorageEstimate
  ↓   - Shared across modes (blob store is content-only)
  ↓ createPersonStore()
  ↓   - Private state: people, categories, recordings, observers
  ↓   - Reads/writes under storypot-dark.<active-mode>.* keys
  ↓   - Public API: addPerson, addCategory, addRecording, updateRecording,
  ↓                  removeRecording, getPeople, getCategories, getRecordings,
  ↓                  setMeta, onChange
  ↓ createMediaRecorder()
  ↓   - Private state: MediaStream, MediaRecorder, audio context, analyser, chunks
  ↓   - Public API: start, pause, resume, stop, cancel, getState, getElapsedMs
  ↓ createTranscriber()
  ↓   - Private state: SpeechRecognition instance, interim text, final text
  ↓   - Public API: isSupported, start(callback, lang), stop, getCurrentText
  ↓ createSearchIndex()
  ↓   - Pure function: search(recordings, people, categories, query, categoryFilter)
Render layer
  ↓ Master render() rebuilds the recorder screen on every store change
  ↓ Home dashboard renders from the same store, four slots + gallery overlay
  ↓ Detail modal loads media + photo blobs on demand from IndexedDB
Browser APIs
  ↓ MediaRecorder (audio + video capture)
  ↓ getUserMedia + canvas.toDataURL (snap photo)
  ↓ Web Audio (live waveform via AnalyserNode)
  ↓ Web Speech (live transcription, 67 languages)
  ↓ IndexedDB (blob storage, shared across modes)
  ↓ localStorage (metadata, namespaced as storypot-dark.<mode>.*)
  ↓ Service Worker (offline + PWA install)
```

The whole app is **five factory functions** wired together by an `init()` function, with a small mode-bootstrap script that runs first to set the active namespace. State stays private. The UI subscribes to changes. Every user-supplied string flows through `textContent` (XSS-safe by construction). The same five factories serve both Family and Team modes &mdash; they just point at different storage keys.

## 🎓 Future Vision

- **Export Recordings:** A way to download recordings as standard `.webm` / `.mp4` files for permanent backup outside the browser. Solves the iOS-storage-retention concern for long-term archiving in both modes.
- **Bulk Tag Editing:** Multi-select recordings and re-categorize or re-attribute them in one move.
- **Recording Notes:** Add written notes alongside the transcript (e.g., *"This is the version Nana made for Christmas, not the everyday one,"* or *"Recorded at the offsite, March 2026"*).
- **Print Recipe Cards / Story Cards:** Generate a printable PDF version of any recording &mdash; title, attribution, transcript formatted as a real card. Family-cookbook output for home users; team-yearbook output for small companies.
- **Cross-Mode Linking (carefully):** Right now the two modes are strictly separate by design. A future option might let a user mark a single recording as "shared across modes" &mdash; useful for the recipe a coworker brings from home that also lives in their family archive. Strictly opt-in, never automatic, because the privacy story of mode separation matters.
- **Shareable Archive Snapshots:** Generate a read-only HTML snapshot of an archive (one mode at a time) that can be passed to a relative or a teammate via AirDrop, USB, or email. Useful for sharing without a server.

## 🧰 Run It Locally

If you want to run a local copy for development:

```bash
# Clone the repo
git clone https://github.com/jdbostonbu-ops/Story-pot.git
cd Story-pot

# Serve as a static site — any of these work:
python3 -m http.server 8000
# OR with VS Code's Live Server extension
# OR with any static file server you prefer

# Open http://localhost:8000 in your browser
```

There's no build step, no `npm install`, no backend to run. Story Pot is plain HTML, CSS, and JavaScript &mdash; open the folder, serve it, you're running it. PWA features (service worker, install button, microphone access, camera access) require HTTPS or localhost, both of which the above setup satisfies.

A note on Live Server specifically: open `index.html` before clicking "Go Live," or set Live Server's default root file to `index.html` in your VS Code settings. Otherwise it may open the file you currently have focused in the editor (e.g., `card.html`) instead of the home page, which will look like a bug but isn't one &mdash; the deeper pages just need the home flow to feed them data.

## 🎓 Phase I

Story Pot is what I built during Phase I of Thinking with AI &mdash; a single, focused tool that solves one real problem (the recipes, stories, songs, and culture rituals that vanish when the people who held them are gone or the team that lived them moves on) using only the browser, with no backend, no API key, no account, no audio files uploaded anywhere, and a five-factory architecture that handles audio recording, video recording, in-browser camera capture, IndexedDB storage, 67-language transcription, and a two-mode toggle that ships one app for two audiences &mdash; all from first principles.

The dark editorial direction is the one that won the four-folder design battle &mdash; chosen for the way photos pop against black, the way the indigo italic glows against the dark like ink against velvet, and the way the editorial typography lets *"what we sang"* land as the emotional heart of the page. The two-mode toggle was the stretch user story &mdash; the recognition that the same architecture (namespaced storage, mode-aware factories, label swaps) could serve families preserving recipes *and* small companies preserving culture rituals, without forking the codebase, without compromising either audience's experience. The **Team-mode light theme** was a refinement layered on top of that stretch &mdash; a small CSS-only feature that the disciplined separation of structure (HTML), presentation (CSS variables), and behavior (a single `body.mode-team` class hook) made possible in an afternoon instead of an overhaul.

⭐ Love this project? Give it a star and explore the other deployed projects in this portfolio.

