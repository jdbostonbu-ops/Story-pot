<p align="center">
  <img src="booknotelogo.png" alt="Story Pot Logo" width="140">
</p>

A family memory archive built for the moment that's slipping away &mdash; *the recipe Nana never wrote down, the lullaby Abuela hummed at the stove, the story Papi tells the same way every Christmas*. Story Pot records audio and video directly from the browser, transcribes the speech in 67 languages, and saves everything locally on your device so the recordings outlive the moment. No accounts, no servers, no cloud &mdash; *what we cooked, what we sang, what we said*.

## 👤 Author
**Jacqueline**
[Check out my GitHub Profile](https://github.com/jdbostonbu-ops)
🚀 **[Try the Live App](https://jdbostonbu-ops.github.io/Story-pot/)**

<p align="center">
  <img src="storypot.gif" alt="Story Pot Showcase Demo" width="750">
</p>

## 🎨 Brand Identity — Dark Editorial Theme

Story Pot's brand is built around one idea: **some things outlive us, and the voice is one of them**. The aesthetic is dark editorial &mdash; pure black background, white serif type, indigo accent &mdash; because the work the app does (preserving the voices of people who won't always be here) deserves a brand that feels like a quiet evening reading, not a Saturday morning push notification.

This was the winner of a four-folder design exploration. Three other versions exist (a warm pastel "Dream Birds" edition, an austere all-white modern editorial edition, and an experimental cozy edition), but **the dark editorial direction was the one that landed**. Photos pop dramatically against black surfaces. Headlines feel like magazine covers. The accent indigo glows against the dark like ink against velvet.

### The Indigo, Black, and Quiet Light Palette

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Paper** | `#0A0A0A` | Primary background &mdash; near-black, never pure black (true `#000` is harsh on white text) |
| **Surface 1** | `#161616` | Card and modal backgrounds |
| **Surface 2** | `#1F1F1F` | Hover states, transcript blockquotes |
| **Ink** | `#F5F5F5` | Primary text &mdash; near-white, never pure white |
| **Ink Soft** | `#A8A8A8` | Body and secondary text |
| **Muted** | `#6B6B6B` | Labels, metadata, mono captions |
| **Indigo** | `#7C8FFF` | The accent &mdash; recording pills, "what we sang", FAB record button (slightly lighter than typical indigo because indigo on black needs more luminance) |
| **Indigo Deep** | `#5048E5` | Hover state for accent elements |
| **Amber** | `#FFB347` | The Song category |
| **Pink** | `#FF6B9D` | The Poem category |
| **Silver** | `#A8A8A8` | The Story category |

The palette breaks the warm-and-fuzzy convention of memory apps. Most family-archive apps default to soft sepia, gentle creams, dusty roses. Story Pot doesn't whisper. **Color does specific jobs:** indigo is action and emphasis (record, hover, the operative word in the hero headline). Amber and pink and silver each own one category. Ink is content. The surface graduates from `#0A0A0A` to `#1F1F1F` so cards lift off the background subtly without needing borders or shadows.

### The Hero — Editorial Headline, One Strong Move

The welcome page is built around a single move: a massive Fraunces serif headline that reads *"What we cooked, **what we sang**, what we said."* &mdash; with **"what we sang"** in glowing indigo italic. Three short clauses, each on its own line, each a verb in the past tense. The grammar IS the brand: this is what we kept of the people who are gone.

The Storypot wordmark sits small and quiet in the top-left corner with a `V.1` version stamp on the right and a thin horizontal divider underneath. The hero space below is mostly empty &mdash; the headline carries the weight. A small "A FAMILY MEMORY ARCHIVE" eyebrow in tracked uppercase mono sits above the headline. The "Begin →" CTA is a glowing indigo pill button. Quiet trust line below: *"No account · Stays on your device."*

### Typography — Fraunces + Inter

| Typeface | Use | Why |
| :--- | :--- | :--- |
| **Fraunces** (serif display, 400-900 + italic) | Wordmark, hero headline, recording titles, modal headers | Modern serif with strong italic personality &mdash; reads as editorial, not sentimental. The italic is reserved for the operative emphasis word in headlines (*"the voices,"* *"what we sang,"*) where the indigo accent picks it up. |
| **Inter** (sans, 400/500/600/700) | Body text, transcribed prose, supporting paragraphs | Clean, neutral, readable at every size. **The grandmother's actual words live here** &mdash; the recipes, stories, songs &mdash; in mixed-case Inter. |
| **ui-monospace** (system mono) | Utility UI, captions, version stamps, metadata | Monospace gives the technical voice. Every character holds the same width. Used UPPERCASE for labels, never as prose. |

Three voices for three jobs: serif for the brand and headlines, mono for utility scaffolding, humanist sans for transcribed prose. **The contrast is the brand.** A dark editorial app that yelled the recipe content in mono caps would betray its own purpose. Inside the frame, your grandmother's voice is plain Inter, normal weight, mixed-case &mdash; just her words.

## 🎓 Built During Next Chapter — Phase I

This project was designed and built during **Phase I of Thinking with AI** at Next Chapter Apprenticeship. Each lesson fed directly into this build:

- **Computational Thinking** — Decomposing the project into five independent factory functions (`createArchive`, `createPersonStore`, `createMediaRecorder`, `createTranscriber`, `createSearchIndex`), recognizing the recurring closure-based factory pattern, abstracting media capture into a single factory that handles audio-only or audio-plus-video without the UI knowing the difference, and surfacing the data model split between metadata (small, fast, in localStorage) and blobs (big, slow, in IndexedDB).
- **HTML / CSS / Forms** — Semantic landmark structure, accessible labels with `for` attributes on every form input, button-group containers using `role="group"` and `aria-labelledby` for screen readers (because `<label>` semantically belongs only with form inputs, not with control groups), mobile-first responsive layouts, modal stacking handled with explicit `z-index` ordering when modals open from inside other modals, and case-insensitive duplicate-prevention on every form input that creates a new record.
- **JavaScript Fundamentals** — Closure-based factory functions keeping all state private; `IndexedDB` for storing megabyte-sized audio and video blobs (since `localStorage` caps at 5 MB); `textContent` for every user-rendered string (XSS-safe by construction); migration code that runs once per page load to add missing default categories and merge user-created duplicates with new built-ins; defensive ID-based category references so the home page Poems slot finds recordings filed under either the built-in "poem" or a legacy custom "Poem" category.
- **Audio & Video Programming** — Reading the `MediaRecorder` API spec carefully enough to satisfy mobile autoplay and permission policies (lazy `AudioContext` on first user gesture, defensive permission handling), feature-detecting MIME-type support across browsers (WebM Opus on Chrome/Firefox/Edge, MP4 on iOS Safari), wiring the Web Speech API for live transcription in 67 BCP 47 languages, and using `canvas.toDataURL` (synchronous, reliable everywhere) instead of `canvas.toBlob` (async, silently fails on Safari with `getUserMedia` streams) for in-browser camera snapshots.

The project demonstrates everything Phase I covered, deployed as a working PWA with full audio recording, video recording, multilingual transcription, in-browser camera capture, and photo upload &mdash; all running offline once installed.

## 🌐 Browser & Device Compatibility

| Browser / Device | Status | Performance Notes |
| :--- | :--- | :--- |
| **Google Chrome** | ✅ Tested | Full support &mdash; audio, video, transcription in all 67 languages, camera snap photo, photo upload, PWA install. |
| **Microsoft Edge** | ✅ Tested | Matches Chrome rendering and Web Speech API behavior exactly. |
| **Firefox** | ⚠️ Partial | Audio + video recording works fully. Camera snap photo and photo upload work fully. Transcription unavailable &mdash; Firefox does not implement the Web Speech API. The transcription toggle is auto-disabled with a clear notice. |
| **Apple Safari (macOS)** | ✅ Tested | Lazy AudioContext correctly waits for first user gesture. Snap photo uses `toDataURL` because `toBlob` silently fails on Safari with getUserMedia streams. Transcription routes through Apple's recognizer. |
| **iPhone (iOS Safari)** | ✅ Tested | PWA installs to home screen, microphone and camera permissions handled correctly, audio survives app backgrounding. Snap photo opens the live camera modal above the recording flow with proper z-index stacking. |
| **iPad / iPadOS** | ✅ Tested | Recording flow scales correctly across viewport sizes. |

## 🌟 Key Features

- **Audio Recording with Live Waveform:** Capture voice memos of any length using the `MediaRecorder` API. The recording screen shows a live indigo waveform driven by Web Audio's `AnalyserNode`, a big Fraunces serif timer counting up in indigo, and a pulsing red recording dot. Pause and resume mid-recording without losing the take.
- **Video Recording for Technique Demonstrations:** When Nana wants to *show* you how to fold the pierogi or roll the sushi, switch to video mode. The same `MediaRecorder` factory handles it &mdash; `getUserMedia` requests both audio and video tracks, the camera preview appears live in the recording screen, and on save the full audio + video blob lands in IndexedDB.
- **Snap Photo from the Browser:** A "Take photo" button opens a fullscreen camera modal with live video, a "Snap" button captures the current frame as a 1200px-max JPEG (canvas → dataURL → Blob), and the snapped photo attaches as the cover image of the recording you're about to make. No leaving the app, no fumbling with the native camera and re-uploading.
- **Photo Upload as an Alternative:** Don't want to use the live camera? Tap "Upload" and pick an image from your library. Same end result &mdash; photo attaches to the recording, displays as the cover thumbnail.
- **Transcription in 67 Languages:** The Web Speech API turns the spoken recording into searchable text in real time. The language picker on the recording-setup screen organizes options into 10 grouped sections via native `<optgroup>`: ENGLISH (8 dialects), SPANISH (8 regional variants), CHINESE (Mandarin CN, Mandarin TW, Cantonese), ARABIC (6 regional variants), PORTUGUESE (BR + PT), FRENCH (FR + CA), EUROPEAN (18 languages from Italian to Hebrew), SOUTH ASIAN (10 languages from Hindi to Urdu), EAST + SE ASIAN (7 languages including Korean, Vietnamese, Tagalog), and AFRICAN (Swahili, Afrikaans, Zulu).
- **Four Default Categories + Custom:** Recipe, Song, Story, Poem ship by default &mdash; each with its own color (indigo, amber, silver, pink) and filter pill on the recording screen. Add custom categories like "BLESSING" or "JOKE" via the + new button. Every custom category gets duplicate-prevented at creation time and reassigned via migration if a user-created category later matches a built-in name.
- **Per-Person Family Archive:** Add Nana, Abuela, Papi, Yia Yia, or anyone else as their own avatar in the FAMILY row. Each person gets a colored initial-circle in one of six bright pop colors that read well against black; tap an avatar to filter the recordings list to just that person.
- **Four-Slot Home Dashboard:** The home page shows four large category cards in a 2×2 grid &mdash; Stories, Recipes, Songs, Poems &mdash; each displaying the most recent photo from that category as a hero image with the recording title and attribution underneath. Empty categories show placeholder text inviting the first recording. Categories with multiple photos show a "+N" badge.
- **Gallery Overlay for Multi-Photo Categories:** Tap a category card with 2+ photos and an in-page gallery overlay opens, showing every photo in that category as a tile grid with title and attribution captions. Tap any tile to jump to that recording's detail view.
- **Duplicate Prevention with "Use Existing":** Try to add a person or category that already exists &mdash; even with a case mismatch ("nana" vs "NANA") &mdash; and the app intercepts before saving. A friendly modal asks: *"Nana already exists. Use the one you already have?"* Tap **Use existing** to set the existing one as active; tap **Cancel** to fix the name. Works for both people and categories.
- **Live Duplicate Hint:** As you type a name in the Add Person or Add Category modal, a subtle hint appears under the input the moment a match is detected: *"Name already exists ▸"*. Catch the duplicate before tapping Save.
- **Single-Page Detail View:** Tap any recording on the home screen and a detail modal opens with everything visible at once: the category pill in indigo, the recording title in Fraunces serif, the attribution (*"from Nana Tule · May 2026"*), the audio or video player with full native controls, the duration and mode meta row, the photo if attached, and the transcript in mixed-case Inter against a slightly-lifted dark surface &mdash; all on one scroll-free screen.
- **Edit Transcript:** Auto-transcription is great but not perfect. The detail view has an Edit transcript button that opens a textarea pre-loaded with the current transcript. Fix typos, correct names, fill in inaudible parts by hand. The audio recording stays exactly as recorded; only the searchable text changes.
- **Search by Anything:** The search bar matches across recording title, person name, category name, and the full transcript text &mdash; case-insensitive. Type *"pierogi"* and find Nana's recipe. Type *"Spanish"* and find every recording in any Spanish dialect. Type *"Christmas"* and find every story that mentions it.
- **List View + Grid View:** Toggle between a vertical list (with cover thumbnails, titles, attribution, and metadata) and a 2 or 3 column grid (visual gallery with cover photos as tiles). Choice is remembered across sessions.
- **Storage Meter:** A subtle bar at the bottom of the home screen shows current IndexedDB usage in human-readable units (KB / MB / GB) and the percentage of the device's quota used.
- **PWA Installable:** Add to Home Screen on iPhone, ⬇ Install on Chrome/Edge desktop. Story Pot becomes a standalone app, opens fullscreen with no Safari URL bar, and works exactly like a native app.
- **Mobile-First Throughout:** Recording flow scales correctly on every device, family avatar row scrolls horizontally on touch, the FAB record button anchors to the safe-area inset on iPhones with home indicators, and every text input has `autocomplete` and `autocapitalize` attributes set.
- **Accessible Throughout:** Every form `<label>` is associated with a form field via `for=`, button groups use `role="group"` with `aria-labelledby`, modals use `role="dialog"` and `aria-modal`, every animation respects `@media (prefers-reduced-motion)`, the FAB and category pills have `aria-label` attributes, and color is never the only signal (icons and text labels accompany every color-coded element).

## 🔒 Privacy & Your Data

Story Pot was built to know nothing about you, period.

- **No account, no signup.** You can add family members, record voices, transcribe in any of 67 languages, and search your archive without creating an account or sharing personal information.
- **No server, anywhere.** Story Pot has no backend, no database, no API. It's a static site. Once your browser loads it, every recording, every transcript, every person you add lives only on your device.
- **Recordings stay on your device.** Audio and video blobs save directly to IndexedDB on your phone or laptop. They never get uploaded, streamed, or backed up to the cloud.
- **The one privacy trade-off &mdash; transcription.** The Web Speech API works by sending audio to Apple or Google's recognizer for the seconds it takes to convert speech to text, then returns the text. **Story Pot is transparent about this:** the trust line and the privacy notes inside the app explain what happens. You can decline transcription and use Story Pot as a pure-local audio archive.
- **No notifications, no permissions you don't expect.** Story Pot asks for the microphone (for audio) and camera (for video and snap photo) permissions only when you tap the relevant button &mdash; never on page load. No location, no contacts, no notification permission, nothing else.

Story Pot doesn't use cookies, doesn't track you, and doesn't have a database that stores anything about you.

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+) &mdash; five closure-based factory functions, `crypto.randomUUID()` for record IDs, `requestAnimationFrame` for the live waveform, native `<optgroup>` for the language picker, `textContent` for every user-supplied string
- **Storage:** **IndexedDB** for media blobs and photo blobs (audio and video can be megabytes; localStorage caps at 5 MB), **localStorage** for metadata (people, categories, recording records, view-mode preference). Two-tier storage keeps the metadata light and instantly searchable while the heavy media stays in the right place. Keys are namespaced as `storypot-dark.*` so this folder operates entirely independently of the other Story Pot variants.
- **Styling:** CSS3 &mdash; Custom Properties, CSS Grid, Flexbox, restrained `border-radius` system (4px / 8px / 12px / 999px pill), 1px dividers, no soft drop shadows on light surfaces, glowing `box-shadow` on the indigo accent button (because light radiating against dark is the whole aesthetic), `clamp()` for fluid headline sizing, `prefers-reduced-motion` overrides for every transition, mobile-first breakpoints
- **Modal Stacking:** Explicit z-index hierarchy &mdash; recording flow at `200`, camera modal at `300` so it stacks above the recording flow when opened from inside it, gallery overlay at `1000` for the home dashboard
- **Typography:** Fraunces (serif display + italic), Inter (body and prose), ui-monospace (system mono for utility) &mdash; Google Fonts
- **Audio:** Web Audio API &mdash; `AudioContext`, `AnalyserNode` for the live waveform, lazy context creation to satisfy iOS Safari and Chrome mobile autoplay policies
- **Recording:** `MediaRecorder` API with feature-detected MIME types (WebM Opus on Chrome/Firefox/Edge, MP4 on iOS Safari), `getUserMedia` for microphone-only or microphone-plus-camera streams
- **Photo Capture:** `getUserMedia` for camera access, `<canvas>` element with `drawImage(video, ...)` to grab the current frame, `canvas.toDataURL` → `atob` + `Uint8Array` → `Blob` conversion for synchronous, cross-browser-reliable JPEG output (deliberately avoiding `canvas.toBlob` which silently fails on some Safari versions with getUserMedia streams)
- **Transcription:** Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`), with 67 BCP 47 language codes from `en-US` to `sw-KE`
- **PWA:** Web App Manifest with `theme_color: "#0A0A0A"` for the dark mode browser chrome, service worker (`sw.js`) using network-first strategy with offline fallback, full Add-to-Home-Screen support, namespaced cache key `storypot-dark-v2`
- **Deployment:** GitHub Pages &mdash; static site, automatic HTTPS, auto-deploy on every push to `main`

## 🚀 The User Flow

- **Land on the welcome page** → see the Storypot wordmark in serif at the top-left, V.1 stamp at top-right, "A FAMILY MEMORY ARCHIVE" eyebrow, the massive Fraunces hero headline *"What we cooked, **what we sang**, what we said."* with the indigo italic emphasis, supporting paragraph, glowing indigo "Begin →" button, and the In-the-pot dashboard below
- **Tap Begin →** → arrive on the recorder page; see the wordmark masthead, the search input, the empty Family row prompting you to add someone
- **Tap + add in the Family row** → modal opens; type a name (e.g., "Nana"), pick a relation, pick an avatar color from six bright pops (indigo / amber / pink / teal / sun / silver), pick a primary language for transcription, tap Save
- **Tap the indigo glowing FAB record button** → recording-setup screen opens; pick the person, pick a category (Recipe / Song / Story / Poem / custom), type a title, pick a language from the 67-language `<optgroup>` dropdown, choose audio or video mode, optionally take a photo or upload one, toggle transcription on or off
- **Tap Start ▸** → the browser asks for microphone (and camera if video mode) permission; recording begins; the timer counts up in indigo Fraunces, the waveform pulses live in indigo, the transcription previews in a bordered dark surface if enabled
- **Tap the big stop button** → recording saves to IndexedDB immediately; toast: *"Saved to the pot."*; the recording appears at the top of the Recent list with the person's avatar, category pill, title, photo thumbnail (if attached), duration, and date
- **Tap a recording** → detail modal opens with everything visible: photo at the top, title in Fraunces serif, attribution, audio or video player with full controls, duration and mode meta row, transcript in mixed-case Inter
- **Optionally tap Edit transcript** → textarea opens pre-loaded with the current transcript; fix typos or fill in inaudible parts; tap Save; the searchable text updates
- **Search the archive** → type any word in the search bar; matches return across title, person name, category name, and transcript text
- **Filter by person** → tap an avatar in the Family row to show only that person's recordings; tap again to clear
- **Filter by category** → tap a colored pill (Recipe in indigo, Song in amber, Story in silver, Poem in pink, or any custom one) to filter
- **Switch to grid view** → tap the Grid toggle to see all recordings as cover-photo tiles in a 2 or 3 column grid
- **Return to home** → tap the Storypot wordmark; the four-slot dashboard now shows the most recent photo from each category as a hero image
- **Tap a category card on home** → if 2+ photos exist, the gallery overlay opens with every photo in that category as a tile grid; if only 1, it jumps to the recorder

## 🎼 The Architecture — Five Factory Functions

Story Pot's five factory functions are the engineering heart of the project. Each one owns one thing, keeps its state private via closure, and exposes a small public API. The `init()` function wires them together with the DOM.

### `createArchive()` — IndexedDB Blob Storage

Holds the audio, video, and photo blobs. Each blob is stored under an auto-incrementing key. Audio recordings are typically 200 KB to 2 MB; video recordings are 5 MB to 50 MB; photos are 50 KB to 400 KB after the 1200px resize. localStorage's 5 MB cap can't hold even one video, which is why the two-tier architecture exists.

```js
async saveBlob(blob, mimeType, durationMs) { /* writes blob, returns id */ }
async getBlob(id) { /* returns { blob, mimeType, durationMs, createdAt } */ }
async deleteBlob(id) { /* removes blob */ }
async getStorageEstimate() { /* returns { usage, quota } for the meter */ }
```

### `createPersonStore()` — localStorage Metadata

Holds people, categories, recording records (without the heavy blobs), and app meta-flags like `hasSeenTranscribeNote`. Everything is stored as JSON under four namespaced keys: `storypot-dark.people.v1`, `storypot-dark.categories.v1`, `storypot-dark.recordings.v1`, and `storypot-dark.meta.v1`. An observer pattern (`onChange`) re-renders the home screen whenever the data changes. Includes a one-time migration that adds any missing default category (so adding "Poem" as a 4th default in v2 didn't require users to lose their data) and merges user-created duplicates with new built-ins (so a custom "Poem" category created before the v2 migration gets reassigned to the built-in `'poem'` id).

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

1. **The metadata** lives in `localStorage` under `storypot-dark.recordings.v1`:

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

2. **The media blob** (audio or video) lives in IndexedDB at the key `blobId`. **The photo blob** lives separately at the key `photoBlobId` so the home page can fetch just the photo for the dashboard cards without loading the whole audio/video. When you tap a recording on the home screen, Story Pot looks up the metadata, reads the blob ids, fetches both from IndexedDB, and creates temporary `Object URL`s for the audio/video player and the photo display.

This split lets the home dashboard render instantly (metadata is tiny and lives in localStorage, which loads synchronously) while the heavy media gets loaded only when needed.

## 📲 Add Story Pot to Your iPhone

Story Pot is a Progressive Web App (PWA), which means it can install to your home screen exactly like a native app &mdash; same icon, same fullscreen experience, same access to the microphone and camera.

### Install Steps

1. **Open Safari on your iPhone** (not Chrome &mdash; iOS only allows PWA installation through Safari)
2. **Visit** the deployed URL (e.g. `https://jdbostonbu-ops.github.io/storypot-dark/`)
3. **Tap the Share button** &mdash; the square with the up-arrow at the bottom of Safari
4. **Scroll down and tap "Add to Home Screen"**
5. **Confirm the name** (default is "Story Pot") and tap **Add**
6. **Find Story Pot on your home screen** and tap to open

The app launches fullscreen, no Safari URL bar. Looks and feels like a native app.

### First-Time Permissions

When you tap the indigo record button for the first time, iOS will ask: *"'Story Pot' Would Like to Access the Microphone."* Tap **Allow**. If you record video or use Snap photo, it'll also ask for camera access. After that one-time permission, Story Pot has full access for all future recordings.

### iOS-Specific Notes

- **Web Speech transcription on iOS Safari** routes through Apple's speech recognizer, which is excellent for English, Spanish, French, Italian, and other major languages, and varies for smaller regional dialects.
- **Audio survives app backgrounding** &mdash; if you switch apps mid-recording, Story Pot continues capturing.
- **iOS storage retention** &mdash; Apple sometimes clears Web Storage (including IndexedDB) for PWAs that haven't been opened in 7-30 days. For long-term family archiving, recordings should be opened periodically. A future v2 will add an export feature for permanent backups.

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
  ↓ User taps + add / FAB record / a recording card
Closure-based factories
  ↓ createArchive()
  ↓   - Private state: IndexedDB connection, schema version
  ↓   - Public API: saveBlob, getBlob, deleteBlob, getStorageEstimate
  ↓ createPersonStore()
  ↓   - Private state: people, categories, recordings, observers
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
  ↓ IndexedDB (blob storage)
  ↓ localStorage (metadata, namespaced as storypot-dark.*)
  ↓ Service Worker (offline + PWA install)
```

The whole app is **five factory functions** wired together by an `init()` function. State stays private. The UI subscribes to changes. Every user-supplied string flows through `textContent` (XSS-safe by construction).

## 🎓 Future Vision

- **Export Recordings:** A way to download recordings as standard `.webm` / `.mp4` files for permanent backup outside the browser. Solves the iOS-storage-retention concern for long-term family archiving.
- **Family Sharing (Optional):** Generate a shareable link to a single recording (encoded as a data URL or pushed to a one-time-use share endpoint) so a family member can hear Nana's pierogi recipe without installing the app themselves.
- **Bulk Tag Editing:** Multi-select recordings and re-categorize or re-attribute them in one move.
- **Recording Notes:** Add written notes alongside the transcript (e.g., *"This is the version Nana made for Christmas, not the everyday one"*).
- **Edit Photo After the Fact:** Replace a recording's cover photo from the detail view if the original snap didn't turn out well.
- **Per-Person Settings Panel:** Edit a person's name, color, or default language after they've been added; merge two people if they were accidentally added twice with different spellings.
- **Print Recipe Cards:** Generate a printable PDF version of any Recipe-categorized recording &mdash; title, attribution, transcript formatted as a real recipe card. Family-cookbook output, on demand.

## 🧰 Run It Locally

If you want to run a local copy for development:

```bash
# Clone the repo
git clone <your-repo-url>
cd storypot-dark

# Serve as a static site — any of these work:
python3 -m http.server 8000
# OR with VS Code's Live Server extension
# OR with any static file server you prefer

# Open http://localhost:8000 in your browser
```

There's no build step, no `npm install`, no backend to run. Story Pot is plain HTML, CSS, and JavaScript &mdash; open the folder, serve it, you're running it. PWA features (service worker, install button, microphone access, camera access) require HTTPS or localhost, both of which the above setup satisfies.

## 🎓 Phase I

Story Pot is what I built during Phase I of Thinking with AI &mdash; a single, focused tool that solves one real problem (the recipes and stories that vanish when the people who held them are gone) using only the browser, with no backend, no API key, no account, no audio files uploaded anywhere, and a five-factory architecture that handles audio recording, video recording, in-browser camera capture, IndexedDB storage, and 67-language transcription from first principles.

The dark editorial direction is the one that won the four-folder design battle &mdash; chosen for the way photos pop against black, the way the indigo italic glows against the dark like ink against velvet, and the way the editorial typography lets *"what we sang"* land as the emotional heart of the page.

⭐ Love this project? Give it a star and explore the other deployed projects in this portfolio.

<p align="center">
  <img src="booknotelogo.png" alt="Story Pot Logo" width="240">
</p>