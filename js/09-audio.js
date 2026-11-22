        /**
         * Многоканальный ретро-синтвейв движок:
         * - Саундтрек во время игры (бас-линия, арпеджио-мелодия и синтезаторные ударные)
         * - Ретро-звуки нажатия кнопок, бонусов, предупреждений и взрывов
         */
        class SoundEngine {
            constructor() {
                this.ctx = null;
                this.muted = false;
                this.bgmTimer = null;
                this.bgmMode = 'NONE'; // NONE | GAME
                this.step = 0;
                this.noiseBuffer = null;

                // MP3-треки для главного меню и магазина
                this.menuAudio = null;
                this.shopAudio = null;
                this._pendingMp3Mode = null; // 'MENU' | 'SHOP' | null — отложенный режим для retry
                this._mp3RetryHandler = null; // одноразовый listener для повторной попытки
                this._initMp3Tracks();

                // Прогрессия аккордов Am -> F -> C -> G (64 шага = 4 такта по 16 шестнадцатых)
                this.bassSequence = [
                    // Am (шаги 0..15)
                    55, 110, 55, 110, 55, 110, 55, 110, 55, 110, 55, 110, 55, 110, 65.41, 73.42,
                    // F (шаги 16..31)
                    43.65, 87.31, 43.65, 87.31, 43.65, 87.31, 43.65, 87.31, 43.65, 87.31, 43.65, 87.31, 43.65, 87.31, 49.0, 55.0,
                    // C (шаги 32..47)
                    65.41, 130.81, 65.41, 130.81, 65.41, 130.81, 65.41, 130.81, 65.41, 130.81, 65.41, 130.81, 65.41, 130.81, 73.42, 82.41,
                    // G (шаги 48..63)
                    49.0, 98.0, 49.0, 98.0, 49.0, 98.0, 49.0, 98.0, 49.0, 98.0, 49.0, 98.0, 49.0, 98.0, 55.0, 65.41
                ];

                this.leadArpSequence = [
                    // Am
                    220, 261.63, 329.63, 440, 329.63, 261.63, 329.63, 440,
                    523.25, 440, 329.63, 261.63, 329.63, 392.0, 440, 329.63,
                    // F
                    174.61, 220, 261.63, 349.23, 261.63, 220, 261.63, 349.23,
                    440, 349.23, 261.63, 220, 261.63, 329.63, 349.23, 261.63,
                    // C
                    261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 392.0, 523.25,
                    659.25, 523.25, 392.0, 329.63, 392.0, 493.88, 523.25, 392.0,
                    // G
                    196.0, 246.94, 293.66, 392.0, 293.66, 246.94, 293.66, 392.0,
                    493.88, 392.0, 293.66, 246.94, 293.66, 329.63, 392.0, 293.66
                ];
            }

            _initMp3Tracks() {
                try {
                    this.menuAudio = new Audio('midnight_boulevard.mp3');
                    this.menuAudio.loop = true;
                    this.menuAudio.volume = 0.45;
                    this.menuAudio.preload = 'auto';

                    this.shopAudio = new Audio('tuesday_at_the_kiosk.mp3');
                    this.shopAudio.loop = true;
                    this.shopAudio.volume = 0.45;
                    this.shopAudio.preload = 'auto';
                } catch (e) {}
            }

            _stopMp3Tracks() {
                try {
                    if (this.menuAudio) { this.menuAudio.pause(); this.menuAudio.currentTime = 0; }
                    if (this.shopAudio) { this.shopAudio.pause(); this.shopAudio.currentTime = 0; }
                } catch (e) {}
                // Снимаем отложенную попытку воспроизведения
                this._clearMp3Retry();
            }

            _clearMp3Retry() {
                if (this._mp3RetryHandler) {
                    document.removeEventListener('pointerdown', this._mp3RetryHandler, true);
                    document.removeEventListener('keydown', this._mp3RetryHandler, true);
                    document.removeEventListener('touchstart', this._mp3RetryHandler, true);
                    this._mp3RetryHandler = null;
                }
            }

            _scheduleMp3Retry(mode) {
                // Сохраняем отложенный режим
                this._pendingMp3Mode = mode;
                // Убираем старый listener если был
                this._clearMp3Retry();
                // Создаём одноразовый handler на первое пользовательское взаимодействие
                this._mp3RetryHandler = () => {
                    if (this.muted) return;
                    // Проверяем, что текущий режим всё ещё тот, что мы ждали
                    if (mode === 'MENU' && this.bgmMode === 'MENU') {
                        this.menuAudio.currentTime = 0;
                        this.menuAudio.play().catch(() => {});
                    } else if (mode === 'SHOP' && this.bgmMode === 'SHOP') {
                        this.shopAudio.currentTime = 0;
                        this.shopAudio.play().catch(() => {});
                    }
                    this._pendingMp3Mode = null;
                    this._clearMp3Retry();
                };
                // Ловим первое взаимодействие на capture-фазе
                document.addEventListener('pointerdown', this._mp3RetryHandler, { once: true, capture: true });
                document.addEventListener('keydown', this._mp3RetryHandler, { once: true, capture: true });
                document.addEventListener('touchstart', this._mp3RetryHandler, { once: true, capture: true });
            }

            init() {
                try {
                    if (!this.ctx) {
                        const AudioCtx = window.AudioContext || window.webkitAudioContext;
                        if (AudioCtx) {
                            this.ctx = new AudioCtx();
                            this.createNoiseBuffer();
                        }
                    }
                    if (this.ctx && this.ctx.state === 'suspended') {
                        this.ctx.resume().catch(() => {});
                    }
                } catch (e) {}
            }

            createNoiseBuffer() {
                if (!this.ctx) return;
                const sampleRate = this.ctx.sampleRate;
                const length = Math.floor(sampleRate * 0.25);
                const buffer = this.ctx.createBuffer(1, length, sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < length; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                this.noiseBuffer = buffer;
            }

            toggleMute() {
                this.muted = !this.muted;
                if (this.muted) {
                    // Сохраняем текущий режим MP3 перед остановкой, чтобы восстановить при unmute
                    const savedMode = (this.bgmMode === 'MENU' || this.bgmMode === 'SHOP') ? this.bgmMode : null;
                    this.stopBgm();
                    this._pendingMp3Mode = savedMode;
                } else {
                    this.init();
                    // При включении звука возвращаем музыку, если были в Меню или Магазине
                    if (this._pendingMp3Mode === 'MENU' || this._pendingMp3Mode === 'SHOP') {
                        this.startBgm(this._pendingMp3Mode);
                    }
                }
                return this.muted;
            }

            startBgm(mode = 'DRIVE', isOverdrive = false) {
                if (this.muted) return;
                this.init();
                this.stopBgm();
                this.bgmMode = mode || 'DRIVE';
                this.isOverdriveBgm = Boolean(isOverdrive);

                // MP3-треки для Меню и Магазина
                if (this.bgmMode === 'MENU' && this.menuAudio) {
                    this._stopMp3Tracks();
                    this.menuAudio.currentTime = 0;
                    this.menuAudio.play().catch(() => {
                        // Браузер заблокировал autoplay — запланируем retry на следующее касание
                        this._scheduleMp3Retry('MENU');
                    });
                    return;
                }
                if (this.bgmMode === 'SHOP' && this.shopAudio) {
                    this._stopMp3Tracks();
                    this.shopAudio.currentTime = 0;
                    this.shopAudio.play().catch(() => {
                        this._scheduleMp3Retry('SHOP');
                    });
                    return;
                }

                // Базовый темп: 98 мс в Драйве, 114 мс в Зачистке; при Форсаже ускоряется до 82 мс!
                const stepMs = this.isOverdriveBgm ? 82 : (this.bgmMode === 'DRIVE' ? 98 : 114);
                this.bgmTimer = setInterval(() => {
                    if (this.muted || !this.ctx || this.ctx.state !== 'running') return;
                    if (this.isOverdriveBgm) {
                        this.playOverdriveSequencerStep(this.step);
                    } else if (this.bgmMode === 'DRIVE') {
                        this.playDriveSequencerStep(this.step);
                    } else {
                        this.playSequencerStep(this.step);
                    }
                    this.step = (this.step + 1) % 64;
                }, stepMs);
            }

            stopBgm() {
                this.bgmMode = 'NONE';
                this._pendingMp3Mode = null;
                if (this.bgmTimer) {
                    clearInterval(this.bgmTimer);
                    this.bgmTimer = null;
                }
                this._stopMp3Tracks();
            }

            // Сверхскоростной гипер-синтвейв саундтрек во время активного Форсажа
            playOverdriveSequencerStep(s) {
                if (!this.ctx) return;
                const now = this.ctx.currentTime;
                const odBass = [
                    65.41, 130.81, 65.41, 130.81, 73.42, 146.83, 73.42, 146.83,
                    82.41, 164.81, 82.41, 164.81, 98.0, 196.0, 82.41, 73.42
                ];
                this.playFilteredNote(odBass[s % 16], 'sawtooth', 0.08, 0.06, 680);

                const odArp = [
                    523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 783.99, 1046.5,
                    587.33, 739.99, 880.0, 1174.66, 880.0, 739.99, 880.0, 1174.66
                ];
                this.playFilteredNote(odArp[s % 16], 'square', 0.08, 0.03, 3400);

                const beatPos = s % 8;
                if (beatPos % 2 === 0) this.playKick(now);
                if (beatPos === 2 || beatPos === 6) this.playSnare(now);
                this.playHiHat(now);
            }

            // Динамичный, драйвовый скоростной саундтрек для режима «ДРАЙВ»
            playDriveSequencerStep(s) {
                if (!this.ctx) return;
                const now = this.ctx.currentTime;

                // Энергичный октавный синт-бас (Am -> G -> F -> E)
                const driveBass = [
                    55, 110, 55, 110, 55, 110, 65.41, 110, 55, 110, 55, 110, 73.42, 110, 65.41, 55,
                    49, 98, 49, 98, 49, 98, 55, 98, 49, 98, 49, 98, 65.41, 98, 55, 49,
                    43.65, 87.31, 43.65, 87.31, 43.65, 87.31, 49, 87.31, 43.65, 87.31, 43.65, 87.31, 55, 87.31, 49, 43.65,
                    41.20, 82.41, 41.20, 82.41, 49, 98, 49, 98, 55, 110, 55, 110, 65.41, 73.42, 82.41, 98
                ];
                this.playFilteredNote(driveBass[s % 64], 'sawtooth', 0.09, 0.056, 520);

                // Скоростной лид-синтезатор
                const driveLead = [
                    440, 0, 523.25, 440, 659.25, 0, 587.33, 523.25, 440, 0, 392, 440, 523.25, 659.25, 783.99, 659.25,
                    392, 0, 493.88, 392, 587.33, 0, 523.25, 493.88, 392, 0, 349.23, 392, 493.88, 587.33, 659.25, 587.33,
                    349.23, 0, 440, 349.23, 523.25, 0, 493.88, 440, 349.23, 0, 329.63, 349.23, 440, 523.25, 587.33, 523.25,
                    329.63, 415.30, 493.88, 659.25, 587.33, 493.88, 415.30, 329.63, 440, 523.25, 659.25, 880, 783.99, 659.25, 587.33, 523.25
                ];
                const leadNote = driveLead[s % 64];
                if (leadNote > 0) {
                    this.playFilteredNote(leadNote, 'square', 0.095, 0.026, 2800);
                }

                // Плотный клубный бит (бочка на каждую четверть + сбивки)
                const beatPos = s % 16;
                if (beatPos % 4 === 0 || beatPos === 14) {
                    this.playKick(now);
                }
                if (beatPos === 4 || beatPos === 12) {
                    this.playSnare(now);
                }
                if (beatPos % 2 === 1) {
                    this.playHiHat(now);
                }
            }

            playSequencerStep(s) {
                if (!this.ctx) return;
                const now = this.ctx.currentTime;

                // 1. Синтвейв бас с тёплым фильтром
                const bassFreq = this.bassSequence[s % this.bassSequence.length];
                this.playFilteredNote(bassFreq, 'sawtooth', 0.11, 0.048, 340);

                // 2. Мелодическое ретро-арпеджио (на каждой шестнадцатой с разной динамикой)
                const arpFreq = this.leadArpSequence[s % this.leadArpSequence.length];
                const arpGain = (s % 4 === 0) ? 0.032 : 0.02;
                this.playFilteredNote(arpFreq, 'triangle', 0.105, arpGain, 2200);

                // 3. Электронные ретро-ударные
                const beatPos = s % 16;
                // Бочка (Kick) на 0, 4, 8, 12
                if (beatPos % 4 === 0) {
                    this.playKick(now);
                }
                // Рабочий (Snare) на 4 и 12
                if (beatPos === 4 || beatPos === 12) {
                    this.playSnare(now);
                }
                // Хэт (Hi-Hat) на слабых долях 2, 6, 10, 14
                if (beatPos % 4 === 2) {
                    this.playHiHat(now);
                }
            }

            // Новый неон-сити-поп луп для Магазина Xpace (Cm -> Ab -> Eb -> Bb):
            // мягкая подушка, фанк-бас синкопами, светящаяся мелодия и мягкий бит
            playShopSequencerStep(s) {
                if (!this.ctx) return;
                const now = this.ctx.currentTime;
                const bar = s % 16;
                const chordIdx = Math.floor((s % 64) / 16);
                const shopChords = [
                    [261.63, 311.13, 392.0],   // Cm
                    [207.65, 261.63, 311.13],  // Ab
                    [311.13, 392.0, 466.16],   // Eb
                    [233.08, 293.66, 349.23]  // Bb
                ];
                const shopBassRoots = [130.81, 103.83, 155.56, 116.54];

                // 1. Мягкая аккордовая «подушка» в начале такта + короткий стаб на бэкбите
                if (bar === 0) {
                    shopChords[chordIdx].forEach(freq => {
                        this.playFilteredNote(freq, 'sine', 1.55, 0.015, 1200);
                        this.playFilteredNote(freq * 2, 'triangle', 1.45, 0.006, 2400);
                    });
                }
                if (bar === 4 || bar === 12) {
                    shopChords[chordIdx].forEach(freq => {
                        this.playFilteredNote(freq * 2, 'square', 0.16, 0.007, 2600);
                    });
                }

                // 2. Прыгающий фанк-бас (синкопы: корень, квинта, октава, нона)
                const bassPattern = [1, 0, 1, 1.5, 0, 2, 0, 1.5, 1, 0, 1.5, 0, 2, 0, 2.25, 0];
                const bassMult = bassPattern[bar];
                if (bassMult > 0) {
                    this.playFilteredNote(shopBassRoots[chordIdx] * bassMult, 'sine', 0.42, 0.036, 360);
                }

                // 3. Светящаяся неоновая мелодия (64 шага — по 16 на аккорд)
                const shopLead = [
                    523.25, 0, 622.25, 0, 783.99, 0, 932.33, 0, 783.99, 830.61, 0, 783.99, 622.25, 0, 523.25, 0,
                    830.61, 0, 523.25, 622.25, 0, 523.25, 0, 415.30, 466.16, 0, 523.25, 0, 622.25, 0, 0, 0,
                    622.25, 0, 783.99, 0, 932.33, 0, 1046.5, 932.33, 0, 783.99, 0, 698.46, 783.99, 0, 622.25, 0,
                    698.46, 0, 587.33, 0, 466.16, 0, 587.33, 698.46, 0, 783.99, 0, 932.33, 783.99, 0, 587.33, 0
                ];
                const leadNote = shopLead[s % 64];
                if (leadNote > 0) {
                    this.playFilteredNote(leadNote, 'triangle', 0.26, 0.02, 3200);
                }

                // 4. Мягкий город-бит: бочка на четвертях, снейр на бэкбите, хэты между
                if (bar % 4 === 0) this.playKick(now);
                if (bar === 4 || bar === 12) this.playSnare(now);
                if (bar % 2 === 1) this.playHiHat(now);

                // 5. Редкие «звёздные» искры-колокольчики
                if (s % 32 === 14 || s % 32 === 30) {
                    this.playFilteredNote(1760.0, 'sine', 0.55, 0.008, 4400);
                }
            }

            // Эпичный синтвейв-гимн главного меню (F#m -> D -> A -> E): парящие подушки,
            // пульсирующий бас, героическая мелодия и мерцающие неоновые искры
            playMenuSequencerStep(s) {
                if (!this.ctx) return;
                const now = this.ctx.currentTime;
                const bar = s % 16;
                const chordIdx = Math.floor((s % 64) / 16);
                const menuChords = [
                    [369.99, 440.0, 554.37],   // F#m
                    [293.66, 369.99, 440.0],   // D
                    [220.0, 277.18, 329.63],   // A
                    [329.63, 415.30, 493.88]   // E
                ];
                const menuBassRoots = [92.5, 73.42, 110.0, 82.41];

                // 1. Парящая аккордовая «подушка» в начале такта
                if (bar === 0) {
                    menuChords[chordIdx].forEach(freq => {
                        this.playFilteredNote(freq, 'sine', 1.7, 0.015, 1100);
                        this.playFilteredNote(freq * 2, 'triangle', 1.6, 0.006, 2200);
                    });
                }

                // 2. Пульсирующий бас (корень и октава на четвертях)
                if (bar % 4 === 0) {
                    this.playFilteredNote(menuBassRoots[chordIdx], 'sawtooth', 0.5, 0.03, 300);
                } else if (bar % 4 === 2) {
                    this.playFilteredNote(menuBassRoots[chordIdx] * 2, 'sawtooth', 0.3, 0.018, 340);
                }

                // 3. Героическая мелодия (64 шага — по 16 на аккорд)
                const menuLead = [
                    554.37, 0, 0, 493.88, 0, 440.0, 0, 0, 493.88, 0, 554.37, 0, 659.26, 0, 0, 0,
                    587.33, 0, 0, 554.37, 0, 493.88, 0, 0, 440.0, 0, 493.88, 0, 554.37, 0, 0, 0,
                    554.37, 0, 659.26, 0, 739.99, 0, 659.26, 0, 554.37, 0, 493.88, 0, 440.0, 0, 0, 0,
                    493.88, 0, 415.30, 0, 493.88, 0, 554.37, 0, 659.26, 0, 739.99, 0, 830.61, 0, 0, 0
                ];
                const leadNote = menuLead[s % 64];
                if (leadNote > 0) {
                    this.playFilteredNote(leadNote, 'square', 0.3, 0.02, 2600);
                }

                // 4. Торжественный бит: бочка на четвертях, снейр на бэкбите, хэты между
                if (bar % 4 === 0) this.playKick(now);
                if (bar === 4 || bar === 12) this.playSnare(now);
                if (bar % 2 === 1) this.playHiHat(now);

                // 5. Мерцающие «неоновые» искры
                if (s % 16 === 14) {
                    this.playFilteredNote(1661.22, 'sine', 0.5, 0.007, 4200);
                }
            }

            playFilteredNote(freq, type, duration, gainVal, filterCutoff) {
                try {
                    const now = this.ctx.currentTime;
                    const osc = this.ctx.createOscillator();
                    const filter = this.ctx.createBiquadFilter();
                    const gain = this.ctx.createGain();

                    osc.type = type;
                    osc.frequency.setValueAtTime(freq, now);

                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(filterCutoff, now);

                    gain.gain.setValueAtTime(gainVal, now);
                    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now);
                    osc.stop(now + duration);
                } catch (e) {}
            }

            playKick(now) {
                try {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(135, now);
                    osc.frequency.exponentialRampToValueAtTime(36, now + 0.11);

                    gain.gain.setValueAtTime(0.11, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.12);
                } catch (e) {}
            }

            playSnare(now) {
                if (!this.noiseBuffer) return;
                try {
                    const noise = this.ctx.createBufferSource();
                    noise.buffer = this.noiseBuffer;

                    const filter = this.ctx.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.setValueAtTime(1200, now);

                    const gain = this.ctx.createGain();
                    gain.gain.setValueAtTime(0.055, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

                    noise.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.ctx.destination);
                    noise.start(now);
                    noise.stop(now + 0.11);
                } catch (e) {}
            }

            playHiHat(now) {
                if (!this.noiseBuffer) return;
                try {
                    const noise = this.ctx.createBufferSource();
                    noise.buffer = this.noiseBuffer;

                    const filter = this.ctx.createBiquadFilter();
                    filter.type = 'highpass';
                    filter.frequency.setValueAtTime(6500, now);

                    const gain = this.ctx.createGain();
                    gain.gain.setValueAtTime(0.022, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

                    noise.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.ctx.destination);
                    noise.start(now);
                    noise.stop(now + 0.045);
                } catch (e) {}
            }

            playTone(freq, type, duration, gainVal, endFreq = null) {
                if (this.muted) return;
                this.init();
                if (!this.ctx) return;
                try {
                    const now = this.ctx.currentTime;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();

                    osc.type = type;
                    osc.frequency.setValueAtTime(freq, now);
                    if (endFreq) {
                        osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
                    }

                    gain.gain.setValueAtTime(gainVal, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now);
                    osc.stop(now + duration);
                } catch (e) {}
            }

            // Ретро-звуки нажатия кнопок интерфейса
            playUiClick() {
                this.playTone(620, 'square', 0.055, 0.055, 930);
            }

            playUiBack() {
                this.playTone(460, 'square', 0.065, 0.05, 290);
            }

            playStartGameJingle() {
                const notes = [440, 554.37, 659.25, 880];
                notes.forEach((n, idx) => {
                    setTimeout(() => this.playTone(n, 'square', 0.09, 0.07), idx * 45);
                });
            }

            playBlueSpark(combo = 1) {
                const pitch = 520 + Math.min(10, combo) * 32;
                this.playTone(pitch, 'sine', 0.11, 0.07, pitch * 1.35);
            }

            playNearMiss() {
                this.playTone(620, 'triangle', 0.09, 0.075, 940);
            }

            playOverdriveStart() {
                const notes = [330, 440, 659.25, 880, 1318.5];
                notes.forEach((n, idx) => {
                    setTimeout(() => this.playTone(n, 'sawtooth', 0.16, 0.09, n * 1.05), idx * 55);
                });
            }

            playRareCoin(combo = 1) {
                const pitchBoost = Math.min(10, combo) * 30;
                this.playTone(784 + pitchBoost, 'square', 0.09, 0.09);
                setTimeout(() => {
                    this.playTone(1174 + pitchBoost, 'square', 0.16, 0.09);
                }, 60);
            }

            playShield() {
                this.playTone(320, 'sine', 0.16, 0.1, 640);
                setTimeout(() => this.playTone(640, 'triangle', 0.22, 0.09, 960), 90);
            }

            playMagnet() {
                this.playTone(380, 'triangle', 0.12, 0.09, 760);
                setTimeout(() => this.playTone(580, 'sine', 0.18, 0.09, 1080), 70);
            }

            playSlowMo() {
                this.playTone(880, 'sine', 0.28, 0.09, 260);
            }

            playEmpBlast() {
                this.playTone(220, 'sawtooth', 0.35, 0.13, 45);
                this.playTone(660, 'square', 0.22, 0.09, 1320);
            }

            playLaserWarning() {
                this.playTone(980, 'square', 0.05, 0.035, 740);
            }

            playShieldBreak() {
                this.playTone(420, 'sawtooth', 0.25, 0.12, 110);
            }

            playQuestComplete() {
                const notes = [523.25, 659.25, 783.99, 1046.5];
                notes.forEach((n, idx) => {
                    setTimeout(() => this.playTone(n, 'square', 0.14, 0.085), idx * 75);
                });
            }

            playLevelUp() {
                const notes = [440, 554.37, 659.25, 880, 1108.73];
                notes.forEach((n, idx) => {
                    setTimeout(() => this.playTone(n, 'square', 0.18, 0.095), idx * 80);
                });
            }

            playLaserShot() {
                this.playTone(920, 'square', 0.04, 0.024, 340);
            }

            playRockHit() {
                this.playTone(280, 'triangle', 0.035, 0.03, 160);
            }

            playRockDestroy() {
                this.playTone(190, 'sawtooth', 0.14, 0.075, 55);
            }

            playDebuff() {
                this.playTone(340, 'sawtooth', 0.12, 0.08, 170);
                setTimeout(() => this.playTone(220, 'sawtooth', 0.18, 0.08, 110), 80);
            }

            playUfoSpawn() {
                this.playTone(320, 'sine', 0.16, 0.06, 640);
                setTimeout(() => this.playTone(640, 'triangle', 0.18, 0.055, 420), 90);
            }

            playUfoShot() {
                this.playTone(540, 'sawtooth', 0.11, 0.045, 190);
            }

            playExplosion() {
                this.playTone(150, 'sawtooth', 0.45, 0.16, 28);
                this.playTone(95, 'square', 0.4, 0.14, 24);
            }
        }

