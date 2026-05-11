/* ════════════════════════════════════════════════════════════════
   STORY POT · app.js
   Record family recipes, songs, and stories before they're gone.
   Vanilla JS · no libraries · five closure-based factory functions.
   textContent for every user-supplied string (XSS-safe).
   IndexedDB for media blobs (audio/video). localStorage for metadata.
   ════════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   LANGUAGES — for transcription dropdown.
   60+ languages grouped by family. Each group becomes an
   <optgroup> with a bold non-selectable header in the dropdown.
   Codes are BCP 47 (what Web Speech API expects).
   ──────────────────────────────────────────────────────────── */

const LANGUAGE_GROUPS = [
    { group: 'ENGLISH', items: [
        { code: 'en-US', label: 'UNITED STATES' },
        { code: 'en-GB', label: 'UNITED KINGDOM' },
        { code: 'en-AU', label: 'AUSTRALIA' },
        { code: 'en-CA', label: 'CANADA' },
        { code: 'en-IN', label: 'INDIA' },
        { code: 'en-IE', label: 'IRELAND' },
        { code: 'en-NZ', label: 'NEW ZEALAND' },
        { code: 'en-ZA', label: 'SOUTH AFRICA' }
    ]},
    { group: 'SPANISH', items: [
        { code: 'es-MX', label: 'MEXICO' },
        { code: 'es-ES', label: 'SPAIN' },
        { code: 'es-AR', label: 'ARGENTINA' },
        { code: 'es-CO', label: 'COLOMBIA' },
        { code: 'es-CL', label: 'CHILE' },
        { code: 'es-PE', label: 'PERU' },
        { code: 'es-VE', label: 'VENEZUELA' },
        { code: 'es-US', label: 'UNITED STATES' }
    ]},
    { group: 'CHINESE', items: [
        { code: 'zh-CN', label: 'MANDARIN (CHINA)' },
        { code: 'zh-TW', label: 'MANDARIN (TAIWAN)' },
        { code: 'zh-HK', label: 'CANTONESE (HK)' }
    ]},
    { group: 'ARABIC', items: [
        { code: 'ar-EG', label: 'EGYPT' },
        { code: 'ar-SA', label: 'SAUDI ARABIA' },
        { code: 'ar-AE', label: 'UAE' },
        { code: 'ar-MA', label: 'MOROCCO' },
        { code: 'ar-LB', label: 'LEBANON' },
        { code: 'ar-JO', label: 'JORDAN' }
    ]},
    { group: 'PORTUGUESE', items: [
        { code: 'pt-BR', label: 'BRAZIL' },
        { code: 'pt-PT', label: 'PORTUGAL' }
    ]},
    { group: 'FRENCH', items: [
        { code: 'fr-FR', label: 'FRANCE' },
        { code: 'fr-CA', label: 'CANADA' }
    ]},
    { group: 'EUROPEAN', items: [
        { code: 'it-IT', label: 'ITALIAN' },
        { code: 'de-DE', label: 'GERMAN' },
        { code: 'nl-NL', label: 'DUTCH' },
        { code: 'pl-PL', label: 'POLISH' },
        { code: 'ru-RU', label: 'RUSSIAN' },
        { code: 'uk-UA', label: 'UKRAINIAN' },
        { code: 'cs-CZ', label: 'CZECH' },
        { code: 'sk-SK', label: 'SLOVAK' },
        { code: 'hu-HU', label: 'HUNGARIAN' },
        { code: 'ro-RO', label: 'ROMANIAN' },
        { code: 'bg-BG', label: 'BULGARIAN' },
        { code: 'el-GR', label: 'GREEK' },
        { code: 'sv-SE', label: 'SWEDISH' },
        { code: 'no-NO', label: 'NORWEGIAN' },
        { code: 'da-DK', label: 'DANISH' },
        { code: 'fi-FI', label: 'FINNISH' },
        { code: 'tr-TR', label: 'TURKISH' },
        { code: 'he-IL', label: 'HEBREW' }
    ]},
    { group: 'SOUTH ASIAN', items: [
        { code: 'hi-IN', label: 'HINDI' },
        { code: 'bn-IN', label: 'BENGALI' },
        { code: 'ta-IN', label: 'TAMIL' },
        { code: 'te-IN', label: 'TELUGU' },
        { code: 'mr-IN', label: 'MARATHI' },
        { code: 'gu-IN', label: 'GUJARATI' },
        { code: 'kn-IN', label: 'KANNADA' },
        { code: 'ml-IN', label: 'MALAYALAM' },
        { code: 'pa-IN', label: 'PUNJABI' },
        { code: 'ur-PK', label: 'URDU' }
    ]},
    { group: 'EAST + SE ASIAN', items: [
        { code: 'ja-JP', label: 'JAPANESE' },
        { code: 'ko-KR', label: 'KOREAN' },
        { code: 'vi-VN', label: 'VIETNAMESE' },
        { code: 'th-TH', label: 'THAI' },
        { code: 'id-ID', label: 'INDONESIAN' },
        { code: 'ms-MY', label: 'MALAY' },
        { code: 'fil-PH', label: 'TAGALOG' }
    ]},
    { group: 'AFRICAN', items: [
        { code: 'sw-KE', label: 'SWAHILI' },
        { code: 'af-ZA', label: 'AFRIKAANS' },
        { code: 'zu-ZA', label: 'ZULU' }
    ]}
];

/* ─────────────────────────────────────────────────────────────
   ARCHIVE FACTORY — IndexedDB-backed blob storage
   Holds the actual audio/video blob data. Each blob can be
   megabytes; localStorage's 5 MB cap won't hold even one video.
   IndexedDB handles gigabytes and supports binary blobs natively.

   Schema:
     - objectStore "media" with autoIncrement key
     - { id, blob, mimeType, durationMs, createdAt }
   ──────────────────────────────────────────────────────────── */

function createArchive() {
    const DB_NAME    = 'storypot-dark.archive';
    const STORE_NAME = 'media';
    const DB_VERSION = 1;
    let _db = null;

    /* Open (or create) the database. Called lazily. */
    function _openDB() {
        if (_db) return Promise.resolve(_db);
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                reject(new Error('IndexedDB not supported in this browser.'));
                return;
            }
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onerror = () => reject(req.error);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                }
            };
            req.onsuccess = () => {
                _db = req.result;
                resolve(_db);
            };
        });
    }

    /* Wrap an IDB transaction in a Promise. */
    function _txn(mode, fn) {
        return _openDB().then(db => new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, mode);
            const store = tx.objectStore(STORE_NAME);
            const result = fn(store);
            tx.oncomplete = () => resolve(result);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        }));
    }

    return {
        /* Save a blob, return the auto-generated id. */
        async saveBlob(blob, mimeType, durationMs) {
            const db = await _openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const record = { blob, mimeType, durationMs: durationMs || 0, createdAt: Date.now() };
                const req = store.add(record);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
        },

        /* Fetch a blob record by id. Returns { blob, mimeType, ... } or null. */
        async getBlob(id) {
            const db = await _openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.get(id);
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => reject(req.error);
            });
        },

        /* Delete a blob by id. */
        async deleteBlob(id) {
            const db = await _openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const req = store.delete(id);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
        },

        /* Estimate current storage usage (for the storage meter). */
        async getStorageEstimate() {
            if (navigator.storage && navigator.storage.estimate) {
                try {
                    const est = await navigator.storage.estimate();
                    return { usage: est.usage || 0, quota: est.quota || 0 };
                } catch (e) {
                    return { usage: 0, quota: 0 };
                }
            }
            return { usage: 0, quota: 0 };
        }
    };
}


/* ─────────────────────────────────────────────────────────────
   PERSON STORE FACTORY — closure over the people, categories,
   and recordings metadata. All saved to localStorage. The actual
   media blobs are held by the archive (IndexedDB) above.
   ──────────────────────────────────────────────────────────── */

function createPersonStore() {
    const KEY_PEOPLE     = 'storypot-dark.people.v1';
    const KEY_CATEGORIES = 'storypot-dark.categories.v1';
    const KEY_RECORDINGS = 'storypot-dark.recordings.v1';
    const KEY_META       = 'storypot-dark.meta.v1';

    /* Default categories shipped with the app. */
    const DEFAULT_CATEGORIES = [
        { id: 'recipe', name: 'Recipe', color: '#7C8FFF', isDefault: true },
        { id: 'song',   name: 'Song',   color: '#FFB347', isDefault: true },
        { id: 'story',  name: 'Story',  color: '#A8A8A8', isDefault: true },
        { id: 'poem',   name: 'Poem',   color: '#FF6B9D', isDefault: true }
    ];

    function _loadJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return fallback;
            return JSON.parse(raw);
        } catch (e) {
            return fallback;
        }
    }

    function _saveJSON(key, val) {
        try {
            localStorage.setItem(key, JSON.stringify(val));
            return true;
        } catch (e) {
            return false;
        }
    }

    let _people     = _loadJSON(KEY_PEOPLE, []);
    let _categories = _loadJSON(KEY_CATEGORIES, DEFAULT_CATEGORIES);
    let _recordings = _loadJSON(KEY_RECORDINGS, []);
    let _meta       = _loadJSON(KEY_META, { hasSeenTranscribeNote: false });

    /* Migration: ensure every default category exists in saved data, AND
       merge any user-created duplicates that match a default by name.

       Earlier versions of Folder 3 only shipped 3 categories (recipe/song/story).
       The home page reserves a 4th slot for Poems, so if Poem is missing,
       silently add it so future recordings can use it.

       If the user already created a custom category with the same name as a
       new default (e.g., they made their own "Poem" category before this
       update), reassign their recordings to the built-in category id and
       remove the duplicate. Runs once per page load. */
    (function ensureDefaultCategories() {
        let categoriesChanged = false;
        let recordingsChanged = false;

        DEFAULT_CATEGORIES.forEach(defaultCat => {
            const builtinExists = _categories.some(c => c.id === defaultCat.id);

            // Look for a user-created duplicate (same name, different id)
            const duplicate = _categories.find(c =>
                c.id !== defaultCat.id &&
                c.name.toLowerCase().trim() === defaultCat.name.toLowerCase().trim()
            );

            if (duplicate) {
                // Reassign recordings from the duplicate to the built-in id
                _recordings.forEach(rec => {
                    if (rec.categoryId === duplicate.id) {
                        rec.categoryId = defaultCat.id;
                        recordingsChanged = true;
                    }
                });
                // Remove the duplicate from the categories list
                _categories = _categories.filter(c => c.id !== duplicate.id);
                categoriesChanged = true;
            }

            // Add the built-in category if it doesn't exist yet
            if (!builtinExists) {
                _categories.push(defaultCat);
                categoriesChanged = true;
            }
        });

        if (categoriesChanged) _saveJSON(KEY_CATEGORIES, _categories);
        if (recordingsChanged) _saveJSON(KEY_RECORDINGS, _recordings);
    })();


    const _listeners = [];

    function _generateId() {
        if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
        return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
    }

    function _emit() {
        _listeners.forEach(fn => fn({
            people: [..._people],
            categories: [..._categories],
            recordings: [..._recordings]
        }));
    }

    return {
        /* People */
        getPeople: () => [..._people],
        addPerson(person) {
            const p = {
                id: _generateId(),
                name: String(person.name || '').trim(),
                relation: String(person.relation || '').trim(),
                color: person.color || '#FF4D14',
                createdAt: Date.now()
            };
            _people.push(p);
            _saveJSON(KEY_PEOPLE, _people);
            _emit();
            return p;
        },
        getPersonById(id) {
            return _people.find(p => p.id === id) || null;
        },
        updatePerson(id, patch) {
            const idx = _people.findIndex(p => p.id === id);
            if (idx < 0) return null;
            const updated = {
                ..._people[idx],
                ...(patch.name !== undefined ? { name: String(patch.name).trim() } : {}),
                ...(patch.relation !== undefined ? { relation: String(patch.relation).trim() } : {}),
                ...(patch.color !== undefined ? { color: patch.color } : {})
            };
            _people[idx] = updated;
            _saveJSON(KEY_PEOPLE, _people);
            _emit();
            return updated;
        },
        removePerson(id) {
            const idx = _people.findIndex(p => p.id === id);
            if (idx < 0) return false;
            _people.splice(idx, 1);
            _saveJSON(KEY_PEOPLE, _people);
            _emit();
            return true;
        },

        /* Categories */
        getCategories: () => [..._categories],
        addCategory(cat) {
            const c = {
                id: _generateId(),
                name: String(cat.name || '').trim(),
                color: cat.color || '#7A1FBF',
                isDefault: false
            };
            _categories.push(c);
            _saveJSON(KEY_CATEGORIES, _categories);
            _emit();
            return c;
        },
        getCategoryById(id) {
            return _categories.find(c => c.id === id) || null;
        },

        /* Recordings */
        getRecordings: () => [..._recordings],
        addRecording(rec) {
            const r = {
                id: _generateId(),
                personId: rec.personId,
                categoryId: rec.categoryId,
                title: String(rec.title || '').trim(),
                mode: rec.mode === 'video' ? 'video' : 'audio',
                blobId: rec.blobId,
                mimeType: rec.mimeType,
                durationMs: rec.durationMs || 0,
                transcript: String(rec.transcript || ''),
                photoBlobId: rec.photoBlobId || null,
                createdAt: Date.now()
            };
            _recordings.unshift(r);  // newest first
            _saveJSON(KEY_RECORDINGS, _recordings);
            _emit();
            return r;
        },
        updateRecording(id, patch) {
            const idx = _recordings.findIndex(r => r.id === id);
            if (idx === -1) return null;
            _recordings[idx] = { ..._recordings[idx], ...patch };
            _saveJSON(KEY_RECORDINGS, _recordings);
            _emit();
            return _recordings[idx];
        },
        removeRecording(id) {
            const idx = _recordings.findIndex(r => r.id === id);
            if (idx === -1) return null;
            const removed = _recordings.splice(idx, 1)[0];
            _saveJSON(KEY_RECORDINGS, _recordings);
            _emit();
            return removed;
        },
        getRecordingById(id) {
            return _recordings.find(r => r.id === id) || null;
        },

        /* Meta — flags like "has seen transcribe disclosure" */
        getMeta: () => ({ ..._meta }),
        setMeta(patch) {
            _meta = { ..._meta, ...patch };
            _saveJSON(KEY_META, _meta);
        },

        onChange(fn) {
            _listeners.push(fn);
            fn({
                people: [..._people],
                categories: [..._categories],
                recordings: [..._recordings]
            });
        }
    };
}


/* ─────────────────────────────────────────────────────────────
   MEDIA RECORDER FACTORY — wraps the MediaRecorder API
   Handles audio-only and audio+video. Returns a blob when
   stopped. Also drives the live waveform via Web Audio analyser.

   Mobile note: iOS Safari only supports MediaRecorder since
   iOS 14.3, and only with specific MIME types. We feature-detect
   the supported type rather than guessing.
   ──────────────────────────────────────────────────────────── */

function createMediaRecorder() {
    let _stream     = null;
    let _recorder   = null;
    let _chunks     = [];
    let _audioCtx   = null;
    let _analyser   = null;
    let _mode       = 'audio';
    let _startTime  = 0;
    let _pausedTime = 0;
    let _pauseStart = 0;
    let _state      = 'idle';  // 'idle' | 'recording' | 'paused' | 'stopped'
    let _waveCallback = null;
    let _waveRafId  = null;

    /* Pick the best MIME type the current browser actually supports.
       Order matters: try the most modern first, fall back gracefully. */
    function _pickMimeType(mode) {
        if (mode === 'video') {
            const candidates = [
                'video/webm;codecs=vp9,opus',
                'video/webm;codecs=vp8,opus',
                'video/webm',
                'video/mp4;codecs=h264,aac',
                'video/mp4'
            ];
            for (const t of candidates) {
                if (MediaRecorder.isTypeSupported(t)) return t;
            }
        } else {
            const candidates = [
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/mp4',
                'audio/mpeg',
                'audio/ogg'
            ];
            for (const t of candidates) {
                if (MediaRecorder.isTypeSupported(t)) return t;
            }
        }
        return '';
    }

    /* Drive the live waveform — sample audio amplitude and call back. */
    function _startWaveLoop() {
        if (!_analyser || !_waveCallback) return;
        const data = new Uint8Array(_analyser.frequencyBinCount);
        const tick = () => {
            if (_state !== 'recording') return;
            _analyser.getByteFrequencyData(data);
            // Average of low-mid frequencies for a usable amplitude
            let sum = 0;
            const len = Math.min(32, data.length);
            for (let i = 0; i < len; i++) sum += data[i];
            const avg = sum / len / 255;  // 0..1
            _waveCallback(avg);
            _waveRafId = requestAnimationFrame(tick);
        };
        tick();
    }

    return {
        /* Start recording. Returns a Promise that resolves when ready. */
        async start({ mode, videoEl, onWave }) {
            if (_state === 'recording') return;
            _mode = mode === 'video' ? 'video' : 'audio';
            _waveCallback = onWave || null;
            _chunks = [];

            // Get the user-media stream (mic only for audio, mic+cam for video)
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Recording not supported in this browser.');
            }
            const constraints = _mode === 'video'
                ? { audio: true, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } }
                : { audio: true, video: false };

            try {
                _stream = await navigator.mediaDevices.getUserMedia(constraints);
            } catch (err) {
                if (_mode === 'video' && err.name === 'OverconstrainedError') {
                    _stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                } else {
                    throw err;
                }
            }

            // Show video preview if applicable
            if (_mode === 'video' && videoEl) {
                videoEl.srcObject = _stream;
                try { await videoEl.play(); } catch {}
            }

            // Build MediaRecorder
            const mimeType = _pickMimeType(_mode);
            const opts = mimeType ? { mimeType } : {};
            try {
                _recorder = new MediaRecorder(_stream, opts);
            } catch (err) {
                _recorder = new MediaRecorder(_stream); // fallback to default
            }

            _recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) _chunks.push(e.data);
            };

            // Set up Web Audio analyser for the live waveform
            if (_waveCallback) {
                const Ctx = window.AudioContext || window.webkitAudioContext;
                if (Ctx) {
                    _audioCtx = new Ctx();
                    if (_audioCtx.state === 'suspended') {
                        try { await _audioCtx.resume(); } catch {}
                    }
                    const source = _audioCtx.createMediaStreamSource(_stream);
                    _analyser = _audioCtx.createAnalyser();
                    _analyser.fftSize = 256;
                    source.connect(_analyser);
                    // analyser is NOT connected to destination — no playback echo
                }
            }

            _recorder.start(250);  // emit chunks every 250ms
            _startTime = Date.now();
            _pausedTime = 0;
            _state = 'recording';
            _startWaveLoop();
        },

        /* Pause without releasing the stream — resume() picks up where stop'd. */
        pause() {
            if (_state !== 'recording' || !_recorder) return;
            try {
                _recorder.pause();
                _pauseStart = Date.now();
                _state = 'paused';
                if (_waveRafId) cancelAnimationFrame(_waveRafId);
            } catch (e) {
                /* Some browsers may not support pause() — fall through */
            }
        },

        resume() {
            if (_state !== 'paused' || !_recorder) return;
            try {
                _recorder.resume();
                _pausedTime += Date.now() - _pauseStart;
                _state = 'recording';
                _startWaveLoop();
            } catch (e) {
                /* fall through */
            }
        },

        /* Stop and return a Promise resolving to { blob, mimeType, durationMs }. */
        stop() {
            return new Promise((resolve, reject) => {
                if (_state !== 'recording' && _state !== 'paused') {
                    reject(new Error('Not currently recording'));
                    return;
                }
                _recorder.onstop = () => {
                    const mimeType = _recorder.mimeType || _pickMimeType(_mode) || 'audio/webm';
                    const blob = new Blob(_chunks, { type: mimeType });
                    const durationMs = Date.now() - _startTime - _pausedTime;
                    this._cleanup();
                    resolve({ blob, mimeType, durationMs });
                };
                _recorder.onerror = (err) => {
                    this._cleanup();
                    reject(err);
                };
                try {
                    _recorder.stop();
                    _state = 'stopped';
                } catch (err) {
                    this._cleanup();
                    reject(err);
                }
            });
        },

        /* Cancel without saving. Releases everything. */
        cancel() {
            try { if (_recorder && _recorder.state !== 'inactive') _recorder.stop(); } catch {}
            this._cleanup();
        },

        _cleanup() {
            if (_waveRafId) cancelAnimationFrame(_waveRafId);
            _waveRafId = null;
            if (_stream) {
                _stream.getTracks().forEach(t => t.stop());
                _stream = null;
            }
            if (_audioCtx && _audioCtx.state !== 'closed') {
                try { _audioCtx.close(); } catch {}
            }
            _audioCtx = null;
            _analyser = null;
            _recorder = null;
            _chunks = [];
            _state = 'idle';
            _waveCallback = null;
        },

        getState: () => _state,
        getElapsedMs: () => {
            if (_state === 'idle' || _state === 'stopped') return 0;
            const pauseAdjustment = _state === 'paused' ? Date.now() - _pauseStart : 0;
            return Date.now() - _startTime - _pausedTime - pauseAdjustment;
        }
    };
}


/* ─────────────────────────────────────────────────────────────
   TRANSCRIBER FACTORY — Web Speech API wrapper
   Live speech-to-text. Sends audio to Apple/Google for processing,
   returns text. Doesn't work in Firefox at all (no Web Speech API).
   ──────────────────────────────────────────────────────────── */

function createTranscriber() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    let _rec = null;
    let _interim = '';
    let _final = '';
    let _onUpdate = null;

    function isSupported() {
        return !!SR;
    }

    return {
        isSupported,
        start(onUpdate, lang) {
            if (!SR) throw new Error('Speech recognition not supported in this browser.');
            _final = '';
            _interim = '';
            _onUpdate = onUpdate || null;

            _rec = new SR();
            _rec.continuous = true;
            _rec.interimResults = true;
            _rec.lang = lang || navigator.language || 'en-US';

            _rec.onresult = (event) => {
                let interim = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        _final += transcript + ' ';
                    } else {
                        interim += transcript;
                    }
                }
                _interim = interim;
                if (_onUpdate) _onUpdate((_final + interim).trim());
            };

            _rec.onerror = (e) => {
                /* Common: 'no-speech', 'aborted', 'network' — non-fatal, just continue */
                console.warn('SpeechRecognition error:', e.error);
            };

            _rec.onend = () => {
                /* Some browsers stop after silence; restart if we're still recording */
                if (_rec) {
                    try { _rec.start(); } catch {}
                }
            };

            try {
                _rec.start();
            } catch (e) {
                // Already started? That's fine.
            }
        },
        stop() {
            const result = (_final + _interim).trim();
            if (_rec) {
                _rec.onend = null;  // prevent auto-restart
                try { _rec.stop(); } catch {}
                _rec = null;
            }
            _onUpdate = null;
            return result;
        },
        getCurrentText() {
            return (_final + _interim).trim();
        }
    };
}


/* ─────────────────────────────────────────────────────────────
   SEARCH INDEX FACTORY — simple substring matcher across
   recording title + person name + category name + transcript.
   ──────────────────────────────────────────────────────────── */

function createSearchIndex() {
    return {
        /* Filter recordings by query string + optional category id. */
        search(recordings, people, categories, query, categoryFilter) {
            const q = (query || '').trim().toLowerCase();
            const cat = categoryFilter && categoryFilter !== 'all' ? categoryFilter : null;

            return recordings.filter(rec => {
                if (cat && rec.categoryId !== cat) return false;
                if (!q) return true;

                const person = people.find(p => p.id === rec.personId);
                const category = categories.find(c => c.id === rec.categoryId);
                const haystack = [
                    rec.title || '',
                    rec.transcript || '',
                    person ? person.name : '',
                    person ? person.relation : '',
                    category ? category.name : ''
                ].join(' ').toLowerCase();

                return haystack.includes(q);
            });
        }
    };
}


/* ─────────────────────────────────────────────────────────────
   FORMAT HELPERS
   ──────────────────────────────────────────────────────────── */

function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.floor((ms || 0) / 1000));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDuration(ms) {
    const seconds = Math.floor((ms || 0) / 1000);
    if (seconds < 60) return `${seconds} sec`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
}

function formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatBytes(bytes) {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/* Get the first letter of a name for the avatar circle. */
function getInitial(name) {
    return (name || '?').trim().charAt(0).toUpperCase() || '?';
}

/* Compute black or white text based on background brightness. */
function isLightOnColor(hex) {
    const c = (hex || '#000').replace('#', '');
    if (c.length < 6) return true;
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    // Standard luminance formula
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum < 0.55;  // true → use light text
}


/* ─────────────────────────────────────────────────────────────
   TOAST
   ──────────────────────────────────────────────────────────── */

function showToast(message, ms = 2400) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast.hidden = true; }, 350);
    }, ms);
}


/* ─────────────────────────────────────────────────────────────
   INIT — wire all the factories to the DOM
   ──────────────────────────────────────────────────────────── */

function init() {
    const archive = createArchive();
    const store = createPersonStore();
    const recorder = createMediaRecorder();
    const transcriber = createTranscriber();
    const searchIndex = createSearchIndex();

    /* Refs */
    const $ = (id) => document.getElementById(id);

    const peopleRow      = $('peopleRow');
    const recordingsList = $('recordingsList');
    const recordingsCount= $('recordingsCount');
    const emptyState     = $('emptyState');
    const searchInput    = $('searchInput');
    const searchClear    = $('searchClear');

    const fabBtn         = $('fabBtn');

    /* Filter state */
    let _selectedCategoryFilter = 'all';
    let _selectedPersonFilter   = null;
    let _searchQuery            = '';

    /* Recording-flow state (held briefly while user sets up + records) */
    let _recPersonId   = null;
    let _recCategoryId = 'recipe';
    let _recMode       = 'audio';
    let _recTranscribeOn = true;
    let _recTimerHandle = null;
    let _recWaveBars   = null;
    let _recPhotoBlob  = null;   // captured/uploaded photo, saved with recording
    let _cameraStream  = null;   // active camera stream (so we can stop it on close)

    /* ===== Render functions ===== */

    /* Build a single person cell. */
    function buildPersonCell(person, isSelected) {
        const cell = document.createElement('div');
        cell.className = 'person-cell' + (isSelected ? ' is-selected' : '');
        cell.dataset.personId = person.id;

        const avatar = document.createElement('div');
        avatar.className = 'person-avatar';
        avatar.style.background = person.color;
        const useLight = isLightOnColor(person.color);
        if (useLight) avatar.classList.add('is-light');
        avatar.textContent = getInitial(person.name);
        cell.appendChild(avatar);

        // Edit pencil button — small, sits in the corner of the avatar
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'person-edit-btn';
        editBtn.setAttribute('aria-label', `Edit ${person.name}`);
        editBtn.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
        cell.appendChild(editBtn);

        const nameEl = document.createElement('div');
        nameEl.className = 'person-name';
        nameEl.textContent = person.name;  // textContent — XSS-safe
        cell.appendChild(nameEl);

        return cell;
    }

    /* Build the "+ Add" person cell. */
    function buildAddPersonCell() {
        const cell = document.createElement('div');
        cell.className = 'person-cell person-add';
        cell.dataset.action = 'add-person';

        const avatar = document.createElement('div');
        avatar.className = 'person-avatar';
        avatar.textContent = '+';
        cell.appendChild(avatar);

        const name = document.createElement('div');
        name.className = 'person-name';
        name.textContent = 'Add';
        cell.appendChild(name);

        return cell;
    }

    /* Render the people row on the home screen. */
    function renderPeople(people) {
        peopleRow.innerHTML = '';
        people.forEach(p => {
            peopleRow.appendChild(buildPersonCell(p, p.id === _selectedPersonFilter));
        });
        peopleRow.appendChild(buildAddPersonCell());
    }

    /* Build a single recording item card (LIST view). */
    function buildRecordingItem(rec, person, category) {
        const item = document.createElement('article');
        item.className = 'recording-item';
        item.dataset.recId = rec.id;
        // If the recording has a photo, add a class so CSS can show a thumbnail.
        if (rec.photoBlobId) item.classList.add('has-photo');

        // Avatar circle with the person's color and initial
        const avatar = document.createElement('div');
        avatar.className = 'recording-avatar';
        if (person) {
            avatar.style.background = person.color;
            if (isLightOnColor(person.color)) avatar.style.color = 'var(--c-paper)';
            avatar.textContent = getInitial(person.name);
        } else {
            avatar.style.background = 'var(--c-paper-2)';
            avatar.textContent = '?';
        }
        item.appendChild(avatar);

        // Photo thumbnail (only if recording has a photo) — between avatar and middle.
        // Lazy-loaded from IndexedDB so the home page doesn't block on photo decoding.
        if (rec.photoBlobId) {
            const thumb = document.createElement('div');
            thumb.className = 'recording-thumb';
            const thumbImg = document.createElement('img');
            thumbImg.alt = '';
            thumbImg.loading = 'lazy';
            thumb.appendChild(thumbImg);
            item.appendChild(thumb);
            // Load the photo asynchronously — don't block the UI
            archive.getBlob(rec.photoBlobId).then(record => {
                if (record && record.blob) {
                    thumbImg.src = URL.createObjectURL(record.blob);
                }
            }).catch(err => console.warn('Photo load failed:', err));
        }

        // Center column: title + meta
        const middle = document.createElement('div');

        if (category) {
            const pill = document.createElement('div');
            pill.className = 'recording-cat-pill';
            pill.style.background = category.color;
            if (isLightOnColor(category.color)) pill.style.color = 'var(--c-paper)';
            pill.textContent = category.name;
            middle.appendChild(pill);
        }

        const title = document.createElement('h3');
        title.className = 'recording-title';
        title.textContent = rec.title || '(untitled)';
        middle.appendChild(title);

        const meta = document.createElement('p');
        meta.className = 'recording-meta';
        const parts = [
            person ? `from ${person.name}` : null,
            formatDuration(rec.durationMs),
            rec.mode === 'video' ? 'audio + video' : 'audio',
            formatDate(rec.createdAt)
        ].filter(Boolean);
        meta.textContent = parts.join(' · ');
        middle.appendChild(meta);

        item.appendChild(middle);

        // Right arrow
        const arrow = document.createElement('div');
        arrow.className = 'recording-arrow';
        arrow.textContent = '▸';
        arrow.setAttribute('aria-hidden', 'true');
        item.appendChild(arrow);

        return item;
    }

    /* View mode for the recordings list — 'list' (default) or 'grid'.
       Persisted in localStorage so user preference sticks across sessions. */
    let _viewMode = window.localStorage.getItem('storypot-dark.viewMode.v1') || 'list';

    /* Build a single grid-view tile. Photo-first layout. If no photo,
       falls back to a colored tile with the title. */
    function buildRecordingTile(rec, person, category) {
        const tile = document.createElement('article');
        tile.className = 'recording-tile';
        tile.dataset.recId = rec.id;
        if (rec.photoBlobId) tile.classList.add('has-photo');

        // Photo (if any) — fills the tile background
        if (rec.photoBlobId) {
            const photoWrap = document.createElement('div');
            photoWrap.className = 'recording-tile-photo';
            const img = document.createElement('img');
            img.alt = '';
            img.loading = 'lazy';
            photoWrap.appendChild(img);
            tile.appendChild(photoWrap);
            archive.getBlob(rec.photoBlobId).then(record => {
                if (record && record.blob) {
                    img.src = URL.createObjectURL(record.blob);
                }
            }).catch(err => console.warn('Photo load failed:', err));
        } else {
            // No photo — colored placeholder using category color (soft)
            const placeholder = document.createElement('div');
            placeholder.className = 'recording-tile-placeholder';
            if (category) placeholder.style.background = category.color;
            placeholder.textContent = (category && category.name) ? category.name.charAt(0) : '·';
            tile.appendChild(placeholder);
        }

        // Caption with title + person
        const caption = document.createElement('div');
        caption.className = 'recording-tile-caption';
        const title = document.createElement('h3');
        title.className = 'recording-tile-title';
        title.textContent = rec.title || '(untitled)';
        caption.appendChild(title);
        if (person) {
            const sub = document.createElement('p');
            sub.className = 'recording-tile-sub';
            sub.textContent = person.name;
            caption.appendChild(sub);
        }
        tile.appendChild(caption);

        return tile;
    }

    /* Render the recordings list — applying current search/filter + view mode. */
    function renderRecordings(state) {
        const filtered = searchIndex.search(
            state.recordings,
            state.people,
            state.categories,
            _searchQuery,
            _selectedCategoryFilter
        );

        // Apply person filter
        const finalList = _selectedPersonFilter
            ? filtered.filter(r => r.personId === _selectedPersonFilter)
            : filtered;

        recordingsList.innerHTML = '';
        // Apply view-mode class to the container so CSS picks the right layout
        recordingsList.classList.toggle('view-grid', _viewMode === 'grid');
        recordingsList.classList.toggle('view-list', _viewMode !== 'grid');

        finalList.forEach(rec => {
            const person = state.people.find(p => p.id === rec.personId);
            const category = state.categories.find(c => c.id === rec.categoryId);
            const item = _viewMode === 'grid'
                ? buildRecordingTile(rec, person, category)
                : buildRecordingItem(rec, person, category);
            recordingsList.appendChild(item);
        });

        recordingsCount.textContent = finalList.length > 0 ? `${finalList.length} total` : '';
        emptyState.hidden = state.recordings.length > 0;
    }

    /* Render the category filter row (default + custom categories). */
    function renderCategoryFilters(categories) {
        const filterRow = document.querySelector('.filter-section .filter-row');
        if (!filterRow) return;

        // Remove ALL category buttons — we'll rebuild from current state
        Array.from(filterRow.querySelectorAll('.filter-btn[data-cat]')).forEach(btn => {
            if (btn.dataset.cat !== 'all') btn.remove();
        });

        // Add every category in current order (defaults first, customs after)
        // before the "+ NEW" link
        const newBtn = $('addCategoryBtn');
        categories.forEach(c => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'filter-btn';
            btn.dataset.cat = c.id;
            btn.textContent = c.name;
            if (_selectedCategoryFilter === c.id) {
                btn.classList.add('is-active');
                btn.style.background = c.color;
                btn.style.color = isLightOnColor(c.color) ? 'var(--c-paper)' : 'var(--c-ink)';
            }
            filterRow.insertBefore(btn, newBtn);
        });
    }

    /* Master render — called whenever state changes */
    function render(state) {
        renderPeople(state.people);
        renderCategoryFilters(state.categories);
        renderRecordings(state);
    }

    /* Storage meter update */
    async function updateStorageMeter() {
        const { usage, quota } = await archive.getStorageEstimate();
        const section = $('storageSection');
        if (!section) return;
        if (usage > 0) {
            section.hidden = false;
            $('storageValue').textContent = formatBytes(usage);
            const pct = quota > 0 ? Math.min(100, (usage / quota) * 100) : 0;
            $('storageFill').style.width = pct + '%';
        }
    }

    /* Subscribe to store changes */
    store.onChange(state => {
        render(state);
        updateStorageMeter();
    });

    /* ===== Search + filter handlers ===== */

    searchInput.addEventListener('input', (e) => {
        _searchQuery = e.target.value || '';
        searchClear.hidden = _searchQuery.length === 0;
        render({
            people: store.getPeople(),
            categories: store.getCategories(),
            recordings: store.getRecordings()
        });
    });

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        _searchQuery = '';
        searchClear.hidden = true;
        searchInput.focus();
        render({
            people: store.getPeople(),
            categories: store.getCategories(),
            recordings: store.getRecordings()
        });
    });

    /* View toggle: list / grid. Updates state, persists to localStorage,
       toggles aria-pressed, then re-renders the recordings. */
    function _setViewMode(mode) {
        _viewMode = (mode === 'grid') ? 'grid' : 'list';
        try { window.localStorage.setItem('storypot-dark.viewMode.v1', _viewMode); } catch {}
        const listBtn = $('viewListBtn');
        const gridBtn = $('viewGridBtn');
        if (listBtn) {
            listBtn.classList.toggle('is-active', _viewMode === 'list');
            listBtn.setAttribute('aria-pressed', _viewMode === 'list' ? 'true' : 'false');
        }
        if (gridBtn) {
            gridBtn.classList.toggle('is-active', _viewMode === 'grid');
            gridBtn.setAttribute('aria-pressed', _viewMode === 'grid' ? 'true' : 'false');
        }
        render({
            people: store.getPeople(),
            categories: store.getCategories(),
            recordings: store.getRecordings()
        });
    }

    if ($('viewListBtn')) $('viewListBtn').addEventListener('click', () => _setViewMode('list'));
    if ($('viewGridBtn')) $('viewGridBtn').addEventListener('click', () => _setViewMode('grid'));

    // Initialize view mode buttons to reflect persisted preference
    _setViewMode(_viewMode);

    /* Category filter clicks (event delegation) */
    document.querySelector('.filter-section').addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn[data-cat]');
        if (!btn) return;
        _selectedCategoryFilter = btn.dataset.cat;
        document.querySelectorAll('.filter-section .filter-btn').forEach(b => {
            b.classList.toggle('is-active', b === btn);
        });
        render({
            people: store.getPeople(),
            categories: store.getCategories(),
            recordings: store.getRecordings()
        });
    });

    /* People row clicks — toggle person filter or open add */
    peopleRow.addEventListener('click', (e) => {
        const addCell = e.target.closest('[data-action="add-person"]');
        if (addCell) {
            openPersonModal();
            return;
        }
        const cell = e.target.closest('.person-cell[data-person-id]');
        if (!cell) return;
        const pid = cell.dataset.personId;
        _selectedPersonFilter = (_selectedPersonFilter === pid) ? null : pid;
        render({
            people: store.getPeople(),
            categories: store.getCategories(),
            recordings: store.getRecordings()
        });
    });

    /* Recording item click → open detail modal */
    recordingsList.addEventListener('click', (e) => {
        const item = e.target.closest('.recording-item[data-rec-id]');
        if (!item) return;
        openDetailModal(item.dataset.recId);
    });

    /* ===== Add Person modal ===== */
    const personModal = $('personModal');
    const personForm  = $('personForm');
    const swatchRow   = $('swatchRow');
    const personNameHint = $('personNameHint');

    /* Track who/what was duplicate-detected so the "USE EXISTING" button works */
    let _duplicateContext = null; // { type: 'person' | 'category', existing: {...} }

    /* Case-insensitive duplicate check. Returns the matching item, or null. */
    function findDuplicate(name, items) {
        const needle = String(name || '').trim().toLowerCase();
        if (!needle) return null;
        return items.find(item => String(item.name || '').trim().toLowerCase() === needle) || null;
    }

    function openPersonModal() {
        personForm.reset();
        personNameHint.hidden = true;
        $('personName').focus();
        // Reset color selection
        Array.from(swatchRow.querySelectorAll('.swatch')).forEach((s, i) => {
            s.classList.toggle('is-active', i === 0);
        });
        personModal.hidden = false;
    }
    function closePersonModal() {
        personModal.hidden = true;
        personNameHint.hidden = true;
    }

    swatchRow.addEventListener('click', (e) => {
        const sw = e.target.closest('.swatch');
        if (!sw) return;
        Array.from(swatchRow.querySelectorAll('.swatch')).forEach(s => s.classList.remove('is-active'));
        sw.classList.add('is-active');
    });

    /* Live duplicate hint as user types the person name */
    $('personName').addEventListener('input', (e) => {
        const dup = findDuplicate(e.target.value, store.getPeople());
        personNameHint.hidden = !dup;
    });

    personForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('personName').value.trim();
        const relation = $('personRelation').value.trim();
        const colorBtn = swatchRow.querySelector('.swatch.is-active');
        const color = colorBtn ? colorBtn.dataset.color : '#FF4D14';
        if (!name) {
            $('personName').focus();
            return;
        }
        // Duplicate check — case-insensitive match against existing people
        const existing = findDuplicate(name, store.getPeople());
        if (existing) {
            _duplicateContext = { type: 'person', existing };
            showDuplicateModal(`"${name.toUpperCase()}" ALREADY EXISTS.`, 'USE THE ONE YOU ALREADY HAVE?');
            return;
        }
        store.addPerson({ name, relation, color });
        closePersonModal();
        showToast('Person added.');
    });

    $('personCloseBtn').addEventListener('click', closePersonModal);
    $('personCancelBtn').addEventListener('click', closePersonModal);

    /* ===== Add Category modal ===== */
    const categoryModal = $('categoryModal');
    const categoryForm  = $('categoryForm');
    const catSwatchRow  = $('catSwatchRow');
    const categoryNameHint = $('categoryNameHint');

    function openCategoryModal() {
        categoryForm.reset();
        categoryNameHint.hidden = true;
        $('categoryName').focus();
        Array.from(catSwatchRow.querySelectorAll('.swatch')).forEach((s, i) => {
            s.classList.toggle('is-active', i === 0);
        });
        categoryModal.hidden = false;
    }
    function closeCategoryModal() {
        categoryModal.hidden = true;
        categoryNameHint.hidden = true;
    }

    $('addCategoryBtn').addEventListener('click', openCategoryModal);
    $('categoryCloseBtn').addEventListener('click', closeCategoryModal);
    $('categoryCancelBtn').addEventListener('click', closeCategoryModal);

    catSwatchRow.addEventListener('click', (e) => {
        const sw = e.target.closest('.swatch');
        if (!sw) return;
        Array.from(catSwatchRow.querySelectorAll('.swatch')).forEach(s => s.classList.remove('is-active'));
        sw.classList.add('is-active');
    });

    /* Live duplicate hint as user types the category name */
    $('categoryName').addEventListener('input', (e) => {
        const dup = findDuplicate(e.target.value, store.getCategories());
        categoryNameHint.hidden = !dup;
    });

    categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('categoryName').value.trim();
        const colorBtn = catSwatchRow.querySelector('.swatch.is-active');
        const color = colorBtn ? colorBtn.dataset.color : '#7A1FBF';
        if (!name) return;
        // Duplicate check — case-insensitive match against existing categories
        const existing = findDuplicate(name, store.getCategories());
        if (existing) {
            _duplicateContext = { type: 'category', existing };
            showDuplicateModal(`"${name.toUpperCase()}" ALREADY EXISTS.`, 'USE THE ONE YOU ALREADY HAVE?');
            return;
        }
        store.addCategory({ name, color });
        closeCategoryModal();
        showToast('Category added.');
    });

    /* "+ ADD" person button in section header */
    $('addPersonBtn').addEventListener('click', openPersonModal);

    /* ===== Duplicate prevention modal =====
       Shown when user tries to add a person/category that already exists.
       Two outcomes: use the existing one, or cancel back to the form. */
    const duplicateModal = $('duplicateModal');
    const duplicateModalMessage = $('duplicateModalMessage');
    const duplicateModalSub = $('duplicateModalSub');

    function showDuplicateModal(message, sub) {
        duplicateModalMessage.textContent = message;
        duplicateModalSub.textContent = sub;
        duplicateModal.hidden = false;
    }
    function closeDuplicateModal() {
        duplicateModal.hidden = true;
        _duplicateContext = null;
    }

    $('duplicateCancelBtn').addEventListener('click', closeDuplicateModal);

    $('duplicateUseExistingBtn').addEventListener('click', () => {
        if (!_duplicateContext) {
            closeDuplicateModal();
            return;
        }
        const { type, existing } = _duplicateContext;

        if (type === 'category') {
            // Use the existing category as the active filter on the home screen
            _selectedCategoryFilter = existing.id;
            // Refresh filter UI so the existing pill becomes active
            document.querySelectorAll('.filter-section .filter-btn').forEach(b => {
                b.classList.toggle('is-active', b.dataset.cat === existing.id);
            });
            render({
                people: store.getPeople(),
                categories: store.getCategories(),
                recordings: store.getRecordings()
            });
            // Close both modals
            closeDuplicateModal();
            closeCategoryModal();
            showToast(`USING EXISTING "${existing.name}"`);
        } else if (type === 'person') {
            // If we're in the recording flow, select this person there.
            // Otherwise just close the add-person modal.
            const inRecordingFlow = !recModal.hidden && !recSetup.hidden;
            if (inRecordingFlow) {
                _recPersonId = existing.id;
                // Update the recording-flow people row selection state
                recPeopleRow.querySelectorAll('.person-cell').forEach(c => {
                    c.classList.toggle('is-selected', c.dataset.personId === existing.id);
                });
            } else {
                // Highlight on the home screen
                _selectedPersonFilter = existing.id;
                render({
                    people: store.getPeople(),
                    categories: store.getCategories(),
                    recordings: store.getRecordings()
                });
            }
            closeDuplicateModal();
            closePersonModal();
            showToast(`USING EXISTING "${existing.name.toUpperCase()}"`);
        }
    });

    /* Click backdrop to cancel */
    duplicateModal.addEventListener('click', (e) => {
        if (e.target === duplicateModal) closeDuplicateModal();
    });

    /* ===== FAB → open recording setup ===== */
    fabBtn.addEventListener('click', () => {
        openRecordingSetup();
    });

    /* ===== Recording flow ===== */
    const recModal      = $('recModal');
    const recSetup      = $('recSetup');
    const recActive     = $('recActive');
    const recPeopleRow  = $('recPeopleRow');
    const recCategoryRow= $('recCategoryRow');
    const recTitle      = $('recTitle');
    const recVideoWrap  = $('recVideoWrap');
    const recVideo      = $('recVideo');
    const recTimer      = $('recTimer');
    const recWave       = $('recWave');
    const recTranscriptWrap = $('recTranscriptWrap');
    const recTranscript = $('recTranscript');
    const transcribeToggle = $('transcribeToggle');

    function openRecordingSetup() {
        // Reset
        _recPersonId = null;
        _recCategoryId = 'recipe';
        _recMode = 'audio';
        _recTranscribeOn = transcriber.isSupported();
        _recPhotoBlob = null;
        recTitle.value = '';

        // Hide photo preview and clear any image src from a previous session
        const photoPreview = $('recPhotoPreview');
        const photoPreviewImg = $('recPhotoPreviewImg');
        if (photoPreview) photoPreview.hidden = true;
        if (photoPreviewImg) photoPreviewImg.src = '';
        const photoFile = $('recPhotoFile');
        if (photoFile) photoFile.value = '';

        // Populate the language dropdown each time setup opens.
        // Default to the user's browser language if it's in our list, else en-US.
        const langSelect = $('recLanguage');
        if (langSelect) {
            langSelect.innerHTML = '';
            const browserLang = (navigator.language || 'en-US').toLowerCase();
            let defaultCode = 'en-US';
            // Build optgroups + options; pick best match for default
            LANGUAGE_GROUPS.forEach(group => {
                const og = document.createElement('optgroup');
                og.label = group.group;
                group.items.forEach(lang => {
                    const opt = document.createElement('option');
                    opt.value = lang.code;
                    opt.textContent = lang.label;
                    og.appendChild(opt);
                    // Match user's browser language if possible
                    if (lang.code.toLowerCase() === browserLang) defaultCode = lang.code;
                    else if (defaultCode === 'en-US' && lang.code.toLowerCase().startsWith(browserLang.split('-')[0] + '-')) {
                        defaultCode = lang.code;
                    }
                });
                langSelect.appendChild(og);
            });
            langSelect.value = defaultCode;
        }

        // Hide active, show setup
        recSetup.hidden = false;
        recActive.hidden = true;

        // Render people picker (small)
        recPeopleRow.innerHTML = '';
        const people = store.getPeople();
        if (people.length === 0) {
            const hint = document.createElement('p');
            hint.className = 'modal-helper';
            hint.textContent = 'No people yet. Add one from the home screen first.';
            recPeopleRow.appendChild(hint);
        } else {
            people.forEach(p => {
                const cell = buildPersonCell(p, false);
                cell.addEventListener('click', () => {
                    _recPersonId = p.id;
                    recPeopleRow.querySelectorAll('.person-cell').forEach(c => c.classList.remove('is-selected'));
                    cell.classList.add('is-selected');
                });
                recPeopleRow.appendChild(cell);
            });
        }

        // Render category picker
        recCategoryRow.innerHTML = '';
        store.getCategories().forEach(cat => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'filter-btn' + (cat.id === _recCategoryId ? ' is-active' : '');
            btn.dataset.cat = cat.id;
            btn.textContent = cat.name;
            if (cat.id === _recCategoryId) {
                btn.style.background = cat.color;
                btn.style.color = isLightOnColor(cat.color) ? 'var(--c-paper)' : 'var(--c-ink)';
            }
            btn.addEventListener('click', () => {
                _recCategoryId = cat.id;
                recCategoryRow.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('is-active');
                    b.style.background = '';
                    b.style.color = '';
                });
                btn.classList.add('is-active');
                btn.style.background = cat.color;
                btn.style.color = isLightOnColor(cat.color) ? 'var(--c-paper)' : 'var(--c-ink)';
            });
            recCategoryRow.appendChild(btn);
        });

        // Mode buttons reset
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('is-active'));
        document.querySelector('.mode-btn[data-mode="audio"]').classList.add('is-active');

        // Transcribe toggle
        if (!transcriber.isSupported()) {
            transcribeToggle.classList.remove('is-active');
            transcribeToggle.setAttribute('aria-pressed', 'false');
            transcribeToggle.disabled = true;
            transcribeToggle.querySelector('.transcribe-label').textContent = 'Transcription not supported';
        } else {
            transcribeToggle.classList.add('is-active');
            transcribeToggle.setAttribute('aria-pressed', 'true');
            transcribeToggle.disabled = false;
            transcribeToggle.querySelector('.transcribe-label').textContent = 'Auto-transcribe to text';
        }

        recModal.hidden = false;
    }

    function closeRecordingFlow() {
        recorder.cancel();
        if (_recTimerHandle) {
            clearInterval(_recTimerHandle);
            _recTimerHandle = null;
        }
        recModal.hidden = true;
        recVideo.srcObject = null;
        recTranscript.textContent = '';
    }

    /* Mode picker clicks */
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            _recMode = btn.dataset.mode;
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
        });
    });

    /* Transcribe toggle */
    transcribeToggle.addEventListener('click', () => {
        if (transcribeToggle.disabled) return;
        const isOn = transcribeToggle.classList.toggle('is-active');
        transcribeToggle.setAttribute('aria-pressed', isOn ? 'true' : 'false');
        _recTranscribeOn = isOn;
    });

    $('recSetupCloseBtn').addEventListener('click', closeRecordingFlow);
    $('recSetupCancelBtn').addEventListener('click', closeRecordingFlow);

    /* ===== Photo capture / upload =====
       The user can attach an optional photo to a recording.
       Two paths: take a fresh photo with the camera, or upload from library.
       The photo blob is held in _recPhotoBlob until the recording is saved. */

    /* Compress and store a photo as a JPEG blob (~100-300 KB).
       Resizes to max 1200px on longest edge so storage stays reasonable. */
    async function _processPhotoFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Resize to max 1200px on longest edge
                    const MAX = 1200;
                    let w = img.width, h = img.height;
                    if (w > MAX || h > MAX) {
                        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                        else { w = Math.round(w * MAX / h); h = MAX; }
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error('Failed to encode photo'));
                    }, 'image/jpeg', 0.85);
                };
                img.onerror = () => reject(new Error('Could not load image'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Could not read file'));
            reader.readAsDataURL(file);
        });
    }

    /* Show the photo preview after a photo is captured or uploaded */
    function _showPhotoPreview(blob) {
        _recPhotoBlob = blob;
        const preview = $('recPhotoPreview');
        const img = $('recPhotoPreviewImg');
        if (img.src) URL.revokeObjectURL(img.src);
        img.src = URL.createObjectURL(blob);
        preview.hidden = false;
    }

    /* Remove pending photo */
    $('recPhotoClearBtn').addEventListener('click', () => {
        _recPhotoBlob = null;
        const img = $('recPhotoPreviewImg');
        if (img.src) URL.revokeObjectURL(img.src);
        img.src = '';
        $('recPhotoPreview').hidden = true;
        $('recPhotoFile').value = '';
    });

    /* Upload photo from library */
    $('recPhotoUploadBtn').addEventListener('click', () => {
        $('recPhotoFile').click();
    });

    $('recPhotoFile').addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
            const blob = await _processPhotoFile(file);
            _showPhotoPreview(blob);
        } catch (err) {
            console.error('Photo processing failed:', err);
            showToast('Could not load that photo.');
        }
    });

    /* Take photo with camera — opens camera modal */
    $('recPhotoTakeBtn').addEventListener('click', async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast('Camera not supported here.');
            return;
        }
        try {
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            const constraints = {
                video: isMobile
                    ? { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
                    : { width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false
            };
            _cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
            const video = $('cameraVideo');
            video.srcObject = _cameraStream;
            $('cameraModal').hidden = false;
        } catch (err) {
            console.error('Camera access failed:', err);
            const msg = err.name === 'NotAllowedError'
                ? 'Camera access denied.'
                : 'Could not open camera.';
            showToast(msg);
        }
    });

    /* Snap photo from camera stream */
    /* Snap photo from camera stream.

       This uses canvas.toDataURL → Blob conversion as the primary path,
       not canvas.toBlob. Reasoning:
       - toDataURL is synchronous and supported in every browser back to IE 9
       - toBlob is async and silently fails on some Safari versions when
         capturing from a getUserMedia stream
       - dataURL → Blob via atob+Uint8Array is reliable cross-browser

       Memory cost is slightly higher for dataURL (~30% larger than blob),
       but image is downsized to 1200px max so worst case is ~500KB string. */
    $('cameraSnapBtn').addEventListener('click', () => {
        console.log('[storypot] Snap button clicked');
        const video = $('cameraVideo');
        const canvas = $('cameraCanvas');

        // Wait for video to have actual dimensions
        if (!video.videoWidth || !video.videoHeight) {
            console.warn('[storypot] Snap: video not ready', {
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
                readyState: video.readyState
            });
            showToast('Camera not ready yet. Try again.');
            return;
        }
        console.log('[storypot] Snap: source video', video.videoWidth, 'x', video.videoHeight);

        // Resize to max 1200px on longest edge
        const MAX = 1200;
        let w = video.videoWidth, h = video.videoHeight;
        if (w > MAX || h > MAX) {
            if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
            else { w = Math.round(w * MAX / h); h = MAX; }
        }
        canvas.width = w;
        canvas.height = h;

        // Draw current video frame to canvas
        const ctx = canvas.getContext('2d');
        try {
            ctx.drawImage(video, 0, 0, w, h);
            console.log('[storypot] Snap: drew', w, 'x', h, 'to canvas');
        } catch (err) {
            console.error('[storypot] Snap: drawImage failed', err);
            showToast('Could not capture photo.');
            return;
        }

        // Convert canvas → dataURL → Blob (synchronous, reliable)
        let blob;
        try {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            console.log('[storypot] Snap: dataURL length', dataUrl.length);
            const commaIdx = dataUrl.indexOf(',');
            if (commaIdx < 0) throw new Error('Invalid dataURL format');
            const byteString = atob(dataUrl.substring(commaIdx + 1));
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            blob = new Blob([ab], { type: 'image/jpeg' });
            console.log('[storypot] Snap: blob created, size', blob.size);
        } catch (err) {
            console.error('[storypot] Snap: blob conversion failed', err);
            showToast('Could not save photo.');
            return;
        }

        if (!blob || blob.size === 0) {
            console.error('[storypot] Snap: blob is empty');
            showToast('Photo was empty.');
            return;
        }

        // Show preview, close modal, confirm to user
        _showPhotoPreview(blob);
        console.log('[storypot] Snap: preview shown, _recPhotoBlob size',
            _recPhotoBlob ? _recPhotoBlob.size : 'null');
        _closeCameraModal();
        showToast('Photo captured.');
    });

    function _closeCameraModal() {
        $('cameraModal').hidden = true;
        if (_cameraStream) {
            _cameraStream.getTracks().forEach(t => t.stop());
            _cameraStream = null;
        }
        $('cameraVideo').srcObject = null;
    }

    $('cameraCloseBtn').addEventListener('click', _closeCameraModal);
    $('cameraCancelBtn').addEventListener('click', _closeCameraModal);

    /* Start recording */
    $('recSetupGoBtn').addEventListener('click', async () => {
        console.log('[storypot] Start clicked');
        if (!_recPersonId) {
            console.log('[storypot] No person selected, blocking');
            showToast('Pick someone first.');
            return;
        }
        if (!recTitle.value.trim()) {
            console.log('[storypot] No title, blocking');
            showToast('Give it a title.');
            recTitle.focus();
            return;
        }
        console.log('[storypot] Validation passed, person:', _recPersonId, 'title:', recTitle.value);

        // Mark transcribe disclosure as seen automatically — we don't block
        // the recording flow with a disclosure modal in Folder 2.
        if (_recTranscribeOn && !store.getMeta().hasSeenTranscribeNote) {
            store.setMeta({ hasSeenTranscribeNote: true });
        }

        try {
            await beginActiveRecording();
            console.log('[storypot] beginActiveRecording completed');
        } catch (err) {
            console.error('[storypot] beginActiveRecording failed:', err);
            showToast('Could not start recording: ' + (err.message || 'unknown error'), 4000);
        }
    });

    async function beginActiveRecording() {
        // Switch to active phase UI
        recSetup.hidden = true;
        recActive.hidden = false;

        const person = store.getPersonById(_recPersonId);
        const category = store.getCategoryById(_recCategoryId);
        $('recActivePerson').textContent = person ? person.name : '?';
        $('recActiveTitle').textContent = recTitle.value.trim();

        // Show video preview if applicable
        if (_recMode === 'video') {
            recVideoWrap.hidden = false;
        } else {
            recVideoWrap.hidden = true;
        }

        // Set up the live waveform bars
        recWave.innerHTML = '';
        _recWaveBars = [];
        for (let i = 0; i < 28; i++) {
            const bar = document.createElement('div');
            bar.className = 'rec-wave-bar';
            bar.style.height = '4px';
            recWave.appendChild(bar);
            _recWaveBars.push(bar);
        }

        // Live transcription preview
        if (_recTranscribeOn && transcriber.isSupported()) {
            recTranscriptWrap.hidden = false;
            recTranscript.textContent = '';
        } else {
            recTranscriptWrap.hidden = true;
        }

        // Start recording
        try {
            await recorder.start({
                mode: _recMode,
                videoEl: _recMode === 'video' ? recVideo : null,
                onWave: (amplitude) => {
                    // Move bars based on amplitude — simulate scrolling waveform
                    for (let i = _recWaveBars.length - 1; i > 0; i--) {
                        _recWaveBars[i].style.height = _recWaveBars[i - 1].style.height;
                    }
                    const h = Math.max(4, Math.min(56, amplitude * 70 + Math.random() * 10));
                    _recWaveBars[0].style.height = h.toFixed(0) + 'px';
                }
            });

            // Start transcription if requested
            if (_recTranscribeOn && transcriber.isSupported()) {
                try {
                    const langSelectEl = $('recLanguage');
                    const chosenLang = langSelectEl ? langSelectEl.value : null;
                    transcriber.start((text) => {
                        recTranscript.textContent = text;
                        recTranscript.scrollTop = recTranscript.scrollHeight;
                    }, chosenLang);
                } catch (e) {
                    console.warn('Transcription start failed:', e);
                }
            }

            // Timer
            _recTimerHandle = setInterval(() => {
                recTimer.textContent = formatTime(recorder.getElapsedMs());
            }, 250);

        } catch (err) {
            console.error('Recording start failed:', err);
            let msg = 'COULD NOT START RECORDING';
            if (err.name === 'NotAllowedError') msg = 'PERMISSION DENIED. ALLOW MIC ACCESS.';
            else if (err.name === 'NotFoundError') msg = 'NO MICROPHONE FOUND';
            else if (err.message && err.message.toLowerCase().includes('not supported')) {
                msg = 'RECORDING NOT SUPPORTED IN THIS BROWSER';
            }
            showToast(msg, 4000);
            closeRecordingFlow();
        }
    }

    /* Stop & save */
    $('recStopBtn').addEventListener('click', async () => {
        if (recorder.getState() === 'idle') return;
        try {
            const transcript = _recTranscribeOn ? transcriber.stop() : '';
            const { blob, mimeType, durationMs } = await recorder.stop();
            if (_recTimerHandle) {
                clearInterval(_recTimerHandle);
                _recTimerHandle = null;
            }

            // Save blob to IndexedDB
            const blobId = await archive.saveBlob(blob, mimeType, durationMs);

            // If user attached a photo, save it as a separate blob and
            // store its id on the recording metadata so the card can show it.
            let photoBlobId = null;
            if (_recPhotoBlob) {
                console.log('[storypot] Saving photo blob, size:', _recPhotoBlob.size);
                try {
                    photoBlobId = await archive.saveBlob(_recPhotoBlob, 'image/jpeg', 0);
                    console.log('[storypot] Photo saved with id:', photoBlobId);
                } catch (photoErr) {
                    console.warn('[storypot] Photo save failed (continuing without photo):', photoErr);
                }
            } else {
                console.log('[storypot] No photo attached to this recording');
            }

            // Save metadata to localStorage via store
            store.addRecording({
                personId: _recPersonId,
                categoryId: _recCategoryId,
                title: recTitle.value.trim(),
                mode: _recMode,
                blobId,
                mimeType,
                durationMs,
                transcript,
                photoBlobId
            });

            console.log('[storypot] Recording saved with photoBlobId:', photoBlobId);

            recModal.hidden = true;
            recVideo.srcObject = null;
            recTranscript.textContent = '';
            showToast('Saved to the pot.');
        } catch (err) {
            console.error('Save failed:', err);
            showToast('Save failed.', 3000);
            closeRecordingFlow();
        }
    });

    /* Pause/resume */
    $('recPauseBtn').addEventListener('click', () => {
        const state = recorder.getState();
        if (state === 'recording') {
            recorder.pause();
            $('recPauseBtn').textContent = '▶';
            $('recPauseBtn').setAttribute('aria-label', 'Resume');
        } else if (state === 'paused') {
            recorder.resume();
            $('recPauseBtn').textContent = '⏸';
            $('recPauseBtn').setAttribute('aria-label', 'Pause');
        }
    });

    $('recActiveCancelBtn').addEventListener('click', () => {
        if (confirm('STOP WITHOUT SAVING?')) {
            closeRecordingFlow();
        }
    });

    /* Transcribe disclosure modal */
    const transcribeDisclosureModal = $('transcribeDisclosureModal');
    function showTranscribeDisclosure() {
        transcribeDisclosureModal.hidden = false;
    }
    $('transcribeDisclosureOkBtn').addEventListener('click', async () => {
        store.setMeta({ hasSeenTranscribeNote: true });
        transcribeDisclosureModal.hidden = true;
        await beginActiveRecording();
    });
    $('transcribeDisclosureSkipBtn').addEventListener('click', async () => {
        _recTranscribeOn = false;
        transcribeToggle.classList.remove('is-active');
        store.setMeta({ hasSeenTranscribeNote: true });
        transcribeDisclosureModal.hidden = true;
        await beginActiveRecording();
    });

    /* ===== Detail modal — single-page view ===== */
    const detailModal = $('detailModal');
    let _currentDetailRecId = null;
    let _currentBlobUrl = null;

    async function openDetailModal(recId) {
        const rec = store.getRecordingById(recId);
        if (!rec) return;
        _currentDetailRecId = recId;

        const person = store.getPersonById(rec.personId);
        const category = store.getCategoryById(rec.categoryId);

        // Front side
        const pill = $('flipCatPill');
        pill.textContent = category ? category.name : 'RECORDING';
        if (category) {
            pill.style.background = category.color;
            pill.style.color = isLightOnColor(category.color) ? 'var(--c-paper)' : 'var(--c-ink)';
        }
        $('flipTitle').textContent = rec.title || '(untitled)';
        $('flipAttribution').textContent = (person ? `from ${person.name}` : '') + (rec.createdAt ? ` · ${formatDate(rec.createdAt)}` : '');
        $('flipDuration').textContent = formatDuration(rec.durationMs);
        $('flipMode').textContent = rec.mode === 'video' ? 'audio + video' : 'audio';

        // Photo (if any) — load and show in the detail modal
        const detailPhoto = $('detailPhoto');
        if (detailPhoto) {
            if (rec.photoBlobId) {
                try {
                    const photoRecord = await archive.getBlob(rec.photoBlobId);
                    if (photoRecord && photoRecord.blob) {
                        if (detailPhoto.src) URL.revokeObjectURL(detailPhoto.src);
                        detailPhoto.src = URL.createObjectURL(photoRecord.blob);
                        detailPhoto.hidden = false;
                    } else {
                        detailPhoto.hidden = true;
                    }
                } catch {
                    detailPhoto.hidden = true;
                }
            } else {
                detailPhoto.hidden = true;
                detailPhoto.src = '';
            }
        }

        // Load blob from archive and create object URL
        try {
            if (_currentBlobUrl) {
                URL.revokeObjectURL(_currentBlobUrl);
                _currentBlobUrl = null;
            }
            const blobRecord = await archive.getBlob(rec.blobId);
            const audio = $('flipAudio');
            const video = $('flipVideo');
            audio.hidden = true;
            video.hidden = true;
            audio.src = '';
            video.src = '';
            if (blobRecord && blobRecord.blob) {
                _currentBlobUrl = URL.createObjectURL(blobRecord.blob);
                if (rec.mode === 'video') {
                    video.src = _currentBlobUrl;
                    video.hidden = false;
                } else {
                    audio.src = _currentBlobUrl;
                    audio.hidden = false;
                }
            }
        } catch (err) {
            console.warn('Failed to load blob:', err);
        }

        // Back side — transcript
        const transcript = rec.transcript || '(NO TRANSCRIPT YET. TAP EDIT TO ADD ONE.)';
        $('flipTranscript').textContent = transcript;

        detailModal.hidden = false;
    }

    function closeDetailModal() {
        detailModal.hidden = true;
        if (_currentBlobUrl) {
            URL.revokeObjectURL(_currentBlobUrl);
            _currentBlobUrl = null;
        }
        $('flipAudio').src = '';
        $('flipVideo').src = '';
        // Clean up photo URL too
        const detailPhoto = $('detailPhoto');
        if (detailPhoto && detailPhoto.src) {
            URL.revokeObjectURL(detailPhoto.src);
            detailPhoto.src = '';
            detailPhoto.hidden = true;
        }
        _currentDetailRecId = null;
    }

    $('detailCloseBtn').addEventListener('click', closeDetailModal);

    /* Delete button */
    $('detailDeleteBtn').addEventListener('click', async () => {
        if (!_currentDetailRecId) return;
        if (!confirm('Delete this recording? Can\'t undo.')) return;
        const rec = store.getRecordingById(_currentDetailRecId);
        if (rec && rec.blobId) {
            try { await archive.deleteBlob(rec.blobId); } catch {}
        }
        // Also delete the photo blob if the recording had one
        if (rec && rec.photoBlobId) {
            try { await archive.deleteBlob(rec.photoBlobId); } catch {}
        }
        store.removeRecording(_currentDetailRecId);
        closeDetailModal();
        showToast('Removed.');
    });

    /* Edit transcript */
    const editModal = $('editModal');
    const editTextarea = $('editTextarea');

    $('detailEditBtn').addEventListener('click', () => {
        if (!_currentDetailRecId) return;
        const rec = store.getRecordingById(_currentDetailRecId);
        if (!rec) return;
        editTextarea.value = rec.transcript || '';
        editModal.hidden = false;
        setTimeout(() => editTextarea.focus(), 50);
    });

    $('editCloseBtn').addEventListener('click', () => { editModal.hidden = true; });
    $('editCancelBtn').addEventListener('click', () => { editModal.hidden = true; });

    $('editSaveBtn').addEventListener('click', () => {
        if (!_currentDetailRecId) return;
        const transcript = editTextarea.value;
        store.updateRecording(_currentDetailRecId, { transcript });
        // Update visible transcript
        $('flipTranscript').textContent = transcript || '(NO TRANSCRIPT YET. TAP EDIT TO ADD ONE.)';
        editModal.hidden = true;
        showToast('Transcript saved.');
    });

    /* Modal backdrop click-to-close */
    [personModal, categoryModal, detailModal, editModal, transcribeDisclosureModal].forEach(m => {
        if (!m) return;
        m.addEventListener('click', (e) => {
            if (e.target === m) m.hidden = true;
            if (m === detailModal && e.target === m) closeDetailModal();
        });
    });

    /* Keyboard — Escape closes any open modal */
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        [personModal, categoryModal, editModal, transcribeDisclosureModal, duplicateModal].forEach(m => {
            if (m && !m.hidden) m.hidden = true;
        });
        if (detailModal && !detailModal.hidden) closeDetailModal();
        if (recModal && !recModal.hidden) {
            // Only close if in setup phase
            if (!recSetup.hidden) closeRecordingFlow();
        }
    });

    /* ══════════════════════════════════════════════════════════════════
       FEATURE BLOCK — added in v2: edit photo, download recording,
       native share, share as card, edit person.
       Each feature operates on the recording currently open in the
       detail modal (tracked via _currentDetailRecId), except edit-person
       which operates on the avatar the user tapped the pencil on.
       ══════════════════════════════════════════════════════════════════ */

    /* ─── Helper: turn a blob into a download-named file ─── */
    function _safeFilename(s) {
        return String(s || 'recording')
            .replace(/[^a-z0-9\-_]+/gi, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '')
            .slice(0, 50) || 'recording';
    }

    function _filenameForRec(rec, blobMimeType) {
        // Pick an extension from the MIME type, fallback to webm
        let ext = 'webm';
        if (blobMimeType) {
            if (blobMimeType.includes('mp4'))   ext = 'mp4';
            else if (blobMimeType.includes('mpeg')) ext = 'mp3';
            else if (blobMimeType.includes('wav'))  ext = 'wav';
            else if (blobMimeType.includes('ogg'))  ext = 'ogg';
            else if (blobMimeType.includes('webm')) ext = 'webm';
        }
        const titlePart = _safeFilename(rec.title || 'recording');
        return `storypot-${titlePart}.${ext}`;
    }

    /* ─── Download recording ─── */
    $('detailDownloadBtn').addEventListener('click', async () => {
        if (!_currentDetailRecId) return;
        const rec = store.getRecordingById(_currentDetailRecId);
        if (!rec) return;
        try {
            const blobRecord = await archive.getBlob(rec.blobId);
            if (!blobRecord || !blobRecord.blob) {
                showToast('Recording not found.');
                return;
            }
            const filename = _filenameForRec(rec, blobRecord.mimeType || blobRecord.blob.type);
            const url = URL.createObjectURL(blobRecord.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // Revoke shortly after to let the download start
            setTimeout(() => URL.revokeObjectURL(url), 4000);
            showToast('Downloading recording.');
        } catch (err) {
            console.warn('[storypot] Download failed:', err);
            showToast('Could not download recording.');
        }
    });

    /* ─── Capability detection for share button ───
       Show the Share button whenever navigator.share exists at all.
       The button's click handler has a fallback chain (file → url → clipboard)
       so it does something useful on every browser that supports any kind of share. */
    function _setupShareButton() {
        const shareBtn = $('detailShareBtn');
        if (!shareBtn) return;
        // Show if ANY form of share works — file, url, or clipboard
        if (navigator.share || (navigator.clipboard && navigator.clipboard.writeText)) {
            shareBtn.hidden = false;
        }
    }
    _setupShareButton();

    /* ─── Native share recording — with smart fallback chain ───
       Strategy:
       1. Try file share (audio/video attached). Works on iPhone Safari + Android Chrome.
       2. If file share fails with anything except user-cancel, fall back to URL+text share.
          This works on macOS Chrome where canShare({ files }) reports true but the
          actual share dialog refuses files.
       3. If URL share also fails, copy a share-text to clipboard.
       User never sees the fallback machinery — just gets something useful. */
    $('detailShareBtn').addEventListener('click', async () => {
        if (!_currentDetailRecId) return;
        const rec = store.getRecordingById(_currentDetailRecId);
        if (!rec) return;

        const person = store.getPersonById(rec.personId);
        const title = rec.title || 'Story Pot recording';
        const attribution = person ? `from ${person.name}` : 'from Story Pot';
        const pageUrl = window.location.href;

        // STAGE 1 — Try file share
        let blobRecord = null;
        try {
            blobRecord = await archive.getBlob(rec.blobId);
        } catch (err) {
            console.warn('[storypot] Share: blob load failed:', err);
        }

        if (blobRecord && blobRecord.blob && navigator.share && navigator.canShare) {
            try {
                const filename = _filenameForRec(rec, blobRecord.mimeType || blobRecord.blob.type);
                const file = new File([blobRecord.blob], filename, {
                    type: blobRecord.mimeType || blobRecord.blob.type || 'audio/webm'
                });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title,
                        text: attribution,
                        files: [file]
                    });
                    showToast('Shared.');
                    return;
                }
            } catch (err) {
                // User canceled — don't fall through, just stop
                if (err && err.name === 'AbortError') return;
                console.warn('[storypot] File share failed, trying URL share:', err);
                // fall through to URL share
            }
        }

        // STAGE 2 — Try URL + text share (no file)
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: `${title} — ${attribution}\nListen on Story Pot:`,
                    url: pageUrl
                });
                showToast('Shared.');
                return;
            } catch (err) {
                if (err && err.name === 'AbortError') return;
                console.warn('[storypot] URL share failed, trying clipboard:', err);
                // fall through to clipboard
            }
        }

        // STAGE 3 — Clipboard fallback
        const shareText = `${title} — ${attribution}\nListen on Story Pot: ${pageUrl}`;
        try {
            await navigator.clipboard.writeText(shareText);
            showToast('Link copied to clipboard.');
        } catch (err) {
            console.warn('[storypot] Clipboard fallback failed:', err);
            showToast('Could not share. Try downloading instead.');
        }
    });

    /* ─── Share as Card — opens a printable card view in a new tab ───
       The card view is a new page (card.html) that reads the recording
       data via localStorage handoff, renders a printable card, and lets
       the user print to PDF or use the native share. */
    $('detailShareCardBtn').addEventListener('click', async () => {
        if (!_currentDetailRecId) return;
        const rec = store.getRecordingById(_currentDetailRecId);
        if (!rec) return;
        const person = store.getPersonById(rec.personId);
        const category = store.getCategoryById(rec.categoryId);

        // Pack the card data into a temporary localStorage entry.
        // Photo and audio blobs are too big to pass via URL, so we encode
        // just the photo as a dataURL (audio isn't needed on the card).
        let photoDataUrl = null;
        if (rec.photoBlobId) {
            try {
                const photoRec = await archive.getBlob(rec.photoBlobId);
                if (photoRec && photoRec.blob) {
                    photoDataUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = () => reject(reader.error);
                        reader.readAsDataURL(photoRec.blob);
                    });
                }
            } catch (err) {
                console.warn('[storypot] Card photo load failed:', err);
            }
        }

        const cardData = {
            title: rec.title || '(untitled)',
            personName: person ? person.name : '',
            personColor: person ? person.color : '#7C8FFF',
            categoryName: category ? category.name : '',
            categoryColor: category ? category.color : '#7C8FFF',
            transcript: rec.transcript || '',
            createdAt: rec.createdAt || Date.now(),
            durationMs: rec.durationMs || 0,
            mode: rec.mode || 'audio',
            photoDataUrl
        };

        try {
            sessionStorage.setItem('storypot-dark.card-handoff', JSON.stringify(cardData));
        } catch (err) {
            console.warn('[storypot] Card handoff storage failed:', err);
            showToast('Card too large to share. Try without photo.');
            return;
        }

        // Open the card in a new tab so the user can save-as-PDF without
        // navigating away from the recorder.
        window.open('card.html', '_blank');
    });

    /* ─── Replace Photo modal — open from detail view ─── */
    const replacePhotoModal = $('replacePhotoModal');

    $('detailReplacePhotoBtn').addEventListener('click', () => {
        if (!_currentDetailRecId) return;
        replacePhotoModal.hidden = false;
    });

    function _closeReplacePhotoModal() {
        replacePhotoModal.hidden = true;
    }
    $('replacePhotoCloseBtn').addEventListener('click', _closeReplacePhotoModal);
    $('replacePhotoCancelBtn').addEventListener('click', _closeReplacePhotoModal);

    /* Helper: save a photo blob to the recording in the detail view */
    async function _saveReplacementPhoto(blob) {
        if (!_currentDetailRecId) return;
        const rec = store.getRecordingById(_currentDetailRecId);
        if (!rec) return;
        try {
            // Save the new photo blob
            const photoBlobId = await archive.saveBlob(blob, blob.type || 'image/jpeg', 0);
            // Delete old photo blob if there was one
            if (rec.photoBlobId) {
                try { await archive.deleteBlob(rec.photoBlobId); } catch {}
            }
            // Update the recording metadata
            store.updateRecording(rec.id, { photoBlobId });
            showToast('Photo updated.');
            _closeReplacePhotoModal();
            // Re-open the detail view so the new photo loads
            openDetailModal(rec.id);
        } catch (err) {
            console.warn('[storypot] Replace photo failed:', err);
            showToast('Could not update photo.');
        }
    }

    /* Replace photo — Take Photo path. Reuses the camera modal. */
    $('replacePhotoTakeBtn').addEventListener('click', async () => {
        // Open the camera, but route the snap output through the replacement flow
        _replaceModeActive = true;
        _closeReplacePhotoModal();
        try {
            _cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
            const video = $('cameraVideo');
            video.srcObject = _cameraStream;
            $('cameraModal').hidden = false;
        } catch (err) {
            console.error('Camera access failed:', err);
            const msg = err.name === 'NotAllowedError'
                ? 'Camera access denied.'
                : 'Could not open camera.';
            showToast(msg);
            _replaceModeActive = false;
        }
    });

    /* Replace photo — Upload path */
    let _replaceModeActive = false;
    $('replacePhotoUploadBtn').addEventListener('click', () => {
        $('replacePhotoUploadInput').click();
    });
    $('replacePhotoUploadInput').addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        e.target.value = ''; // reset for next time
        // Optionally resize via canvas for consistency with snap photo
        try {
            const resized = await _resizeImageBlob(file, 1200);
            _closeReplacePhotoModal();
            await _saveReplacementPhoto(resized);
        } catch (err) {
            console.warn('[storypot] Upload resize failed, using original:', err);
            _closeReplacePhotoModal();
            await _saveReplacementPhoto(file);
        }
    });

    /* Replace photo — Remove path */
    $('replacePhotoRemoveBtn').addEventListener('click', async () => {
        if (!_currentDetailRecId) return;
        const rec = store.getRecordingById(_currentDetailRecId);
        if (!rec) return;
        try {
            if (rec.photoBlobId) {
                try { await archive.deleteBlob(rec.photoBlobId); } catch {}
            }
            store.updateRecording(rec.id, { photoBlobId: null });
            showToast('Photo removed.');
            _closeReplacePhotoModal();
            openDetailModal(rec.id);
        } catch (err) {
            console.warn('[storypot] Remove photo failed:', err);
            showToast('Could not remove photo.');
        }
    });

    /* Helper to resize an image blob via canvas (also strips most metadata) */
    function _resizeImageBlob(blob, maxEdge) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                let w = img.naturalWidth, h = img.naturalHeight;
                if (w > maxEdge || h > maxEdge) {
                    if (w > h) { h = Math.round(h * maxEdge / w); w = maxEdge; }
                    else { w = Math.round(w * maxEdge / h); h = maxEdge; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                const byteString = atob(dataUrl.split(',')[1]);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                resolve(new Blob([ab], { type: 'image/jpeg' }));
                URL.revokeObjectURL(img.src);
            };
            img.onerror = () => reject(new Error('Image load failed'));
            img.src = URL.createObjectURL(blob);
        });
    }

    /* Hook into snap photo result — if replacement mode is active,
       route the snapped photo to the recording instead of the recording-setup. */
    const _origShowPhotoPreview = _showPhotoPreview;
    _showPhotoPreview = function(blob) {
        if (_replaceModeActive) {
            _replaceModeActive = false;
            _saveReplacementPhoto(blob);
            return;
        }
        _origShowPhotoPreview(blob);
    };

    /* ─── Edit Person — pencil icon on family avatars ───
       The existing personModal is reused with an "edit mode" flag.
       In edit mode: title becomes "Edit person", delete button appears,
       form is pre-filled, save updates instead of adds. */
    let _editingPersonId = null;

    function openEditPersonModal(personId) {
        const person = store.getPersonById(personId);
        if (!person) return;
        _editingPersonId = personId;
        const modal = $('personModal');
        $('personModalTitle').textContent = 'Edit person';
        $('personName').value = person.name || '';
        $('personRelation').value = person.relation || '';
        // Pre-select the matching color swatch
        Array.from(swatchRow.querySelectorAll('.swatch')).forEach(s => {
            s.classList.toggle('is-active', s.dataset.color === person.color);
        });
        // If no swatch matched (custom color), select the first one
        if (!swatchRow.querySelector('.swatch.is-active')) {
            swatchRow.querySelector('.swatch').classList.add('is-active');
        }
        $('personDeleteBtn').hidden = false;
        $('personNameHint').hidden = true;
        modal.hidden = false;
        $('personName').focus();
    }

    /* Wrap the existing close handler to also clear edit mode */
    const _origClosePerson = closePersonModal;
    closePersonModal = function() {
        _origClosePerson();
        _editingPersonId = null;
        $('personModalTitle').textContent = 'Add person';
        $('personDeleteBtn').hidden = true;
    };
    // Rebind the handlers that were attached to the old reference
    $('personCloseBtn').addEventListener('click', () => {
        _editingPersonId = null;
        $('personModalTitle').textContent = 'Add person';
        $('personDeleteBtn').hidden = true;
    });
    $('personCancelBtn').addEventListener('click', () => {
        _editingPersonId = null;
        $('personModalTitle').textContent = 'Add person';
        $('personDeleteBtn').hidden = true;
    });

    /* Listen on the family row for clicks on the edit pencil OR the avatar.
       The existing handler on peopleRow already filters; we add a sibling
       handler scoped to .person-edit-btn elements. */
    peopleRow.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.person-edit-btn');
        if (editBtn) {
            e.stopPropagation(); // don't trigger the parent cell click
            const cell = editBtn.closest('.person-cell');
            if (cell && cell.dataset.personId) {
                openEditPersonModal(cell.dataset.personId);
            }
        }
    });

    /* Patch the person form submit to support edit mode */
    const _origPersonForm = personForm;
    // We need to override the submit handler. The original handler is already
    // attached; we'll add a capture-phase listener that intercepts BEFORE the
    // original fires when in edit mode.
    personForm.addEventListener('submit', (e) => {
        if (!_editingPersonId) return; // let the original add-person handler run
        e.preventDefault();
        e.stopImmediatePropagation(); // prevent the add-person handler from also firing
        const name = $('personName').value.trim();
        const relation = $('personRelation').value.trim();
        const colorBtn = swatchRow.querySelector('.swatch.is-active');
        const color = colorBtn ? colorBtn.dataset.color : '#7C8FFF';
        if (!name) {
            $('personName').focus();
            return;
        }
        // Check for duplicate names against OTHER people (not self)
        const dup = store.getPeople().find(p =>
            p.id !== _editingPersonId &&
            String(p.name || '').trim().toLowerCase() === name.toLowerCase()
        );
        if (dup) {
            // Show the duplicate hint inline
            $('personNameHint').hidden = false;
            $('personName').focus();
            return;
        }
        store.updatePerson(_editingPersonId, { name, relation, color });
        _editingPersonId = null;
        $('personModalTitle').textContent = 'Add person';
        $('personDeleteBtn').hidden = true;
        personModal.hidden = true;
        showToast('Person updated.');
    }, true); // capture phase so this fires before the add-person handler

    /* Delete person from inside the edit modal */
    $('personDeleteBtn').addEventListener('click', () => {
        if (!_editingPersonId) return;
        const person = store.getPersonById(_editingPersonId);
        if (!person) return;
        const recCount = store.getRecordings().filter(r => r.personId === _editingPersonId).length;
        const msg = recCount > 0
            ? `Delete ${person.name}? Their ${recCount} recording${recCount === 1 ? '' : 's'} will stay but show as "unknown."`
            : `Delete ${person.name}?`;
        if (!confirm(msg)) return;
        store.removePerson(_editingPersonId);
        _editingPersonId = null;
        $('personModalTitle').textContent = 'Add person';
        $('personDeleteBtn').hidden = true;
        personModal.hidden = true;
        showToast('Person deleted.');
    });

    /* Service worker */
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.warn('Service worker registration failed.', err);
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
