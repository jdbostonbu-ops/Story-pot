/* ════════════════════════════════════════════════════════════════
   STORY POT — HOME PAGE RENDERER (Dream Birds, four-slot model)
   The home page has 4 fixed cards: Stories, Recipes, Songs, Poems.
   For each category:
     - If any recording in that category has a photo, show the most
       recent photo + title big + "from [person]" small underneath.
     - If multiple photos exist, tapping the card opens a gallery
       overlay showing all photos in that category.
     - If no photos yet, show the original placeholder card.
   ════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    /* ─── Mode awareness ───
       Story Pot has two modes: Family Archive and Team Archive.
       Each mode has its own localStorage namespace. We read the
       active mode and namespace our keys accordingly. */
    function activeMode() {
        try { return localStorage.getItem('storypot-dark.active-mode') || 'family'; }
        catch { return 'family'; }
    }
    function modeKey(suffix) {
        return `storypot-dark.${activeMode()}.${suffix}`;
    }

    /* ─── Mode bootstrap (masthead labels, logo swap, toggle wiring) ───
       Applies on DOMContentLoaded. Mirrors the bootstrap in app.js so
       index.html (which loads home.js, not app.js) gets the same
       Family / Team toggle behavior. */
    const MODE_KEY = 'storypot-dark.active-mode';
    const MODE_LABELS = {
        family: {
            eyebrow: 'A family memory archive',
            logo:    'booknotelogo2.png'
        },
        team: {
            eyebrow: 'A team memory archive',
            logo:    'twobookslogo.png'
        }
    };

    function applyMode() {
        const mode = activeMode();
        const labels = MODE_LABELS[mode] || MODE_LABELS.family;

        document.querySelectorAll('[data-mode-label]').forEach(el => {
            const key = el.getAttribute('data-mode-label');
            if (labels[key]) el.textContent = labels[key];
        });

        const logo = document.getElementById('masthead-logo');
        if (logo) logo.src = labels.logo;

        document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
            const isActive = btn.getAttribute('data-mode') === mode;
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            btn.classList.toggle('mode-toggle-btn--active', isActive);
        });

        document.body.classList.toggle('mode-team',   mode === 'team');
        document.body.classList.toggle('mode-family', mode === 'family');

        /* Update the browser chrome color to match the active mode.
           The <meta name="theme-color"> tag controls the address-bar
           tint on mobile browsers and the title-bar color in
           installed PWAs. Family mode = near-black to match the
           dark theme; Team mode = cool gray to match the light theme.
           Must match the --paper value for the active mode in home.css. */
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.setAttribute(
                'content',
                mode === 'team' ? '#F4F6FA' : '#0A0A0A'
            );
        }
    }

    function switchMode(newMode) {
        if (newMode !== 'family' && newMode !== 'team') return;
        if (newMode === activeMode()) return;
        try { localStorage.setItem(MODE_KEY, newMode); } catch {}
        window.location.reload();
    }

    function bindModeToggle() {
        document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                switchMode(btn.getAttribute('data-mode'));
            });
        });
    }

    /* Storage keys — mode-scoped, must match app.js */
    const KEY_PEOPLE     = modeKey('people.v1');
    const KEY_CATEGORIES = modeKey('categories.v1');
    const KEY_RECORDINGS = modeKey('recordings.v1');

    /* IndexedDB config — shared across modes (blobs are content,
       not context; the recording metadata knows the mode). */
    const DB_NAME    = 'storypot-dark.archive';
    const STORE_NAME = 'media';
    const DB_VERSION = 1;

    /* The four canonical home slots. The fourth slot's label and
       placeholder text change per mode:
         Family mode:  Stories, Recipes, Songs, Poems
         Team mode:    Stories, Recipes, Songs, Jokes
       All four use the same category IDs as app.js. */
    const HOME_SLOTS_FAMILY = [
        { id: 'story',  label: 'Stories', placeholder: 'Save memories and the voices behind them.', accent: '#C7568A' },
        { id: 'recipe', label: 'Recipes', placeholder: 'Capture family cooking traditions, step by step.', accent: '#4A8C72' },
        { id: 'song',   label: 'Songs',   placeholder: 'Preserve lullabies, hymns, and humming.', accent: '#6777FF' },
        { id: 'poem',   label: 'Poems',   placeholder: 'Keep prayers, blessings, and handwritten words.', accent: '#B47828' }
    ];
    const HOME_SLOTS_TEAM = [
        { id: 'story',  label: 'Stories', placeholder: 'Storytime retros, founding stories, on-the-job moments.', accent: '#C7568A' },
        { id: 'recipe', label: 'Recipes', placeholder: 'Recipe Fridays. Heritage Month. The shared kitchen.', accent: '#4A8C72' },
        { id: 'song',   label: 'Songs',   placeholder: 'Team songs, anthems, celebrations.', accent: '#6777FF' },
        { id: 'poem',   label: 'Jokes',   placeholder: 'Inside jokes, ice-breakers, things that make the team laugh.', accent: '#B47828' }
    ];
    const HOME_SLOTS = activeMode() === 'team' ? HOME_SLOTS_TEAM : HOME_SLOTS_FAMILY;

    /* ─── Storage helpers ─── */
    function loadJSON(key, fallback) {
        try {
            const raw = window.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (err) {
            console.warn('[home] Storage read failed for', key, err);
            return fallback;
        }
    }

    function openDB() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function getBlob(id) {
        if (!id) return null;
        try {
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.get(id);
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => reject(req.error);
            });
        } catch (err) {
            console.warn('[home] IndexedDB open failed:', err);
            return null;
        }
    }

    /* ─── Helpers ─── */
    function isLightOnColor(hex) {
        const c = (hex || '#000').replace('#', '');
        if (c.length < 6) return true;
        const r = parseInt(c.slice(0, 2), 16);
        const g = parseInt(c.slice(2, 4), 16);
        const b = parseInt(c.slice(4, 6), 16);
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return lum < 0.55;
    }

    /* For a given category id, returns recordings in that category that
       have a photo, sorted newest first. */
    function recordingsWithPhotos(recordings, categoryId) {
        return recordings
            .filter(r => r.categoryId === categoryId && r.photoBlobId)
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    /* ─── Build a placeholder card (no photos in category) ─── */
    function buildPlaceholderCard(slot) {
        const card = document.createElement('article');
        card.className = 'home-card home-card--placeholder';
        card.style.borderTop = `3px solid ${slot.accent}`;

        const title = document.createElement('h3');
        title.textContent = slot.label;
        card.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = slot.placeholder;
        card.appendChild(desc);

        // Tapping a placeholder takes the user to the recorder
        card.addEventListener('click', () => {
            window.location.href = 'recorder.html';
        });

        return card;
    }

    /* ─── Build a photo card (one or more photos in category) ─── */
    function buildPhotoCard(slot, latestRec, person, allWithPhotos) {
        const card = document.createElement('article');
        card.className = 'home-card home-card--photo';

        // Photo at top
        const photoWrap = document.createElement('div');
        photoWrap.className = 'home-card-photo';
        const img = document.createElement('img');
        img.alt = '';
        img.loading = 'lazy';
        photoWrap.appendChild(img);

        // If multiple photos, show count badge
        if (allWithPhotos.length > 1) {
            const badge = document.createElement('span');
            badge.className = 'home-card-badge';
            badge.textContent = `+${allWithPhotos.length - 1}`;
            badge.title = `${allWithPhotos.length} photos in ${slot.label}`;
            photoWrap.appendChild(badge);
        }

        card.appendChild(photoWrap);

        // Load the photo asynchronously
        getBlob(latestRec.photoBlobId).then(record => {
            if (record && record.blob) {
                img.src = URL.createObjectURL(record.blob);
            }
        }).catch(err => console.warn('[home] Photo load failed:', err));

        // Caption: title big, "from [person]" small underneath
        const caption = document.createElement('div');
        caption.className = 'home-card-caption';

        const title = document.createElement('h3');
        title.className = 'home-card-title';
        title.textContent = (latestRec.title || 'untitled').trim();
        caption.appendChild(title);

        if (person) {
            const sub = document.createElement('p');
            sub.className = 'home-card-sub';
            sub.textContent = `from ${person.name}`;
            caption.appendChild(sub);
        }

        card.appendChild(caption);

        // Click behavior:
        // - If only 1 photo, jump to recorder so user can play it back
        // - If multiple, open the in-page gallery overlay for that category
        card.addEventListener('click', () => {
            if (allWithPhotos.length > 1) {
                openGallery(slot, allWithPhotos);
            } else {
                window.location.href = 'recorder.html';
            }
        });

        return card;
    }

    /* ─── Gallery overlay — opens when user taps a multi-photo card ─── */
    function openGallery(slot, recordings) {
        const people = loadJSON(KEY_PEOPLE, []);

        // Build the overlay container
        const overlay = document.createElement('div');
        overlay.className = 'home-gallery-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', `${slot.label} gallery`);

        const panel = document.createElement('div');
        panel.className = 'home-gallery-panel';

        // Header
        const head = document.createElement('header');
        head.className = 'home-gallery-head';

        const heading = document.createElement('h2');
        heading.className = 'home-gallery-title';
        heading.textContent = slot.label;
        head.appendChild(heading);

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'home-gallery-close';
        closeBtn.setAttribute('aria-label', 'Close gallery');
        closeBtn.textContent = '✕';
        head.appendChild(closeBtn);

        panel.appendChild(head);

        const sub = document.createElement('p');
        sub.className = 'home-gallery-sub';
        sub.textContent = `${recordings.length} ${recordings.length === 1 ? 'photo' : 'photos'}`;
        panel.appendChild(sub);

        // Grid of all photos in this category
        const grid = document.createElement('div');
        grid.className = 'home-gallery-grid';

        recordings.forEach(rec => {
            const person = people.find(p => p.id === rec.personId);
            const tile = document.createElement('article');
            tile.className = 'home-gallery-tile';

            const tilePhotoWrap = document.createElement('div');
            tilePhotoWrap.className = 'home-gallery-photo';
            const tileImg = document.createElement('img');
            tileImg.alt = '';
            tileImg.loading = 'lazy';
            tilePhotoWrap.appendChild(tileImg);
            tile.appendChild(tilePhotoWrap);

            getBlob(rec.photoBlobId).then(record => {
                if (record && record.blob) {
                    tileImg.src = URL.createObjectURL(record.blob);
                }
            }).catch(err => console.warn('[home] Gallery photo load failed:', err));

            const tileCap = document.createElement('div');
            tileCap.className = 'home-gallery-cap';
            const tileTitle = document.createElement('h4');
            tileTitle.textContent = (rec.title || 'untitled').trim();
            tileCap.appendChild(tileTitle);
            if (person) {
                const tileSub = document.createElement('p');
                tileSub.textContent = `from ${person.name}`;
                tileCap.appendChild(tileSub);
            }
            tile.appendChild(tileCap);

            tile.addEventListener('click', () => {
                window.location.href = 'recorder.html';
            });

            grid.appendChild(tile);
        });

        panel.appendChild(grid);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        document.body.classList.add('gallery-open');

        // Close handlers
        function close() {
            document.body.classList.remove('gallery-open');
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            document.removeEventListener('keydown', onKey);
        }
        function onKey(e) {
            if (e.key === 'Escape') close();
        }
        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            // Click outside the panel closes
            if (e.target === overlay) close();
        });
        document.addEventListener('keydown', onKey);
    }

    /* ─── Main render — always renders 4 cards ─── */
    function render() {
        const container = document.getElementById('homeRecordings');
        if (!container) return;

        const recordings = loadJSON(KEY_RECORDINGS, []);
        const people     = loadJSON(KEY_PEOPLE, []);

        console.log('[home] Rendering with', recordings.length, 'recordings');
        const photoCount = recordings.filter(r => r.photoBlobId).length;
        console.log('[home] Recordings with photos:', photoCount);

        const wrapper = document.createElement('div');

        // Section header
        const head = document.createElement('div');
        head.className = 'home-section-head';
        const headLabel = document.createElement('h2');
        headLabel.className = 'home-section-label';
        headLabel.textContent = activeMode() === 'team' ? 'In the team pot' : 'In the pot';
        head.appendChild(headLabel);
        wrapper.appendChild(head);

        // 4-slot grid
        const grid = document.createElement('div');
        grid.className = 'home-grid';

        HOME_SLOTS.forEach(slot => {
            const withPhotos = recordingsWithPhotos(recordings, slot.id);
            if (withPhotos.length > 0) {
                // Show the most recent photo card
                const latest = withPhotos[0];
                const person = people.find(p => p.id === latest.personId);
                grid.appendChild(buildPhotoCard(slot, latest, person, withPhotos));
            } else {
                // No photos in this category yet — show placeholder
                grid.appendChild(buildPlaceholderCard(slot));
            }
        });

        wrapper.appendChild(grid);
        container.innerHTML = '';
        container.appendChild(wrapper);
    }

    /* On-load entry point — apply mode UI first so the masthead is
       correct before render() paints the cards. */
    function init() {
        applyMode();
        bindModeToggle();
        render();
    }

    /* Run on load. Re-render when the user comes back from the recorder. */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') render();
    });

    /* Expose the same global the old inline script published, in case
       any other code (or a future page) wants to query/apply mode. */
    window.StoryPotMode = { get: activeMode, apply: applyMode };

})();
