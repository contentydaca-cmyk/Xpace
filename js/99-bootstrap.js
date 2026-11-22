
        function xpPriceHTML(cost, sparks) {
            const icon = '<svg class="xp-price-icon" viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true">'
                + '<rect x="3" y="0" width="2" height="2" fill="#ffd60a"/>'
                + '<rect x="2" y="2" width="4" height="1" fill="#fff3b0"/>'
                + '<rect x="0" y="3" width="8" height="2" fill="#ffd60a"/>'
                + '<rect x="3" y="3" width="2" height="2" fill="#ffffff"/>'
                + '<rect x="2" y="5" width="4" height="1" fill="#ff9f1c"/>'
                + '<rect x="3" y="6" width="2" height="2" fill="#ffd60a"/>'
                + '</svg>';
            const n = Number(cost) || 0;
            return `${icon}<span class="xp-price-num">${n.toLocaleString('ru-RU').replace(/\u00a0/g, ' ')}</span>`;
        }

        /* XPACE v1.7: стартовая заставка, не вмешивается в игровой цикл */
        (function initXpaceIntro() {
            const intro = document.getElementById('xpaceIntro');
            if (!intro) return;

            const fill = document.getElementById('xpaceIntroFill');
            const progress = document.getElementById('xpaceIntroProgress');
            const percent = document.getElementById('xpaceIntroPercent');
            const status = document.getElementById('xpaceIntroStatus');
            const skip = document.getElementById('xpaceIntroSkip');
            const reducedMotion = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
            const duration = reducedMotion ? 1100 : 4000;
            const startedAt = performance.now();
            const messages = [
                { at: 0, text: 'СИНХРОНИЗАЦИЯ НЕОНОВОЙ СЕТИ' },
                { at: 0.26, text: 'КАЛИБРОВКА ДВИГАТЕЛЕЙ' },
                { at: 0.54, text: 'ПОСТРОЕНИЕ НЕОНОВОЙ ТРАССЫ' },
                { at: 0.82, text: 'СИСТЕМА ГОТОВА · ПРИЯТНОГО ПОЛЁТА' }
            ];
            let animationFrame = 0;
            let lastPercent = -1;
            let currentMessage = messages[0].text;
            let leaving = false;

            function removeIntro() {
                intro.remove();
            }

            function finishIntro() {
                if (leaving) return;
                leaving = true;
                cancelAnimationFrame(animationFrame);
                window.removeEventListener('keydown', handleIntroKey, true);
                fill.style.transform = 'scaleX(1)';
                progress.setAttribute('aria-valuenow', '100');
                percent.textContent = '100%';
                status.textContent = 'КАНАЛ ОТКРЫТ · ДОБРО ПОЖАЛОВАТЬ, ПИЛОТ';
                intro.setAttribute('aria-busy', 'false');
                intro.classList.add('is-complete');
                requestAnimationFrame(() => intro.classList.add('is-leaving'));
                window.setTimeout(removeIntro, reducedMotion ? 180 : 720);
            }

            function handleIntroKey(event) {
                if (leaving || !['Escape', 'Enter', 'Space'].includes(event.code)) return;
                event.preventDefault();
                event.stopImmediatePropagation();
                finishIntro();
            }

            function updateIntro(now) {
                if (leaving) return;
                const timeProgress = Math.min(1, Math.max(0, (now - startedAt) / duration));
                const loadProgress = 1 - Math.pow(1 - timeProgress, 2.15);
                const value = Math.min(100, Math.floor(loadProgress * 100));

                fill.style.transform = `scaleX(${loadProgress})`;
                if (value !== lastPercent) {
                    lastPercent = value;
                    percent.textContent = String(value).padStart(2, '0') + '%';
                    progress.setAttribute('aria-valuenow', String(value));
                }

                let nextMessage = messages[0].text;
                for (const message of messages) {
                    if (timeProgress >= message.at) nextMessage = message.text;
                }
                if (nextMessage !== currentMessage) {
                    currentMessage = nextMessage;
                    status.textContent = nextMessage;
                }

                if (timeProgress < 1) {
                    animationFrame = requestAnimationFrame(updateIntro);
                } else {
                    window.setTimeout(finishIntro, reducedMotion ? 60 : 240);
                }
            }

            skip.addEventListener('click', finishIntro);
            window.addEventListener('keydown', handleIntroKey, true);
            animationFrame = requestAnimationFrame(updateIntro);
        })();

        function bootXpaceGame() {
            if (window.__xpace) return;
            const game = new NeonDriftGame();
            game.startLoop();
            // Cached background signs may have been painted during the font swap.
            document.fonts?.ready.then(() => {
                game._vhsCache = null;
                game._clearanceBgCache = null;
            });
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bootXpaceGame);
        } else {
            bootXpaceGame();
        }
