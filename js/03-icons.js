        // Кастомная система кибер-иконок XPACE (DOM + Canvas)
        const XP_ICON_PATHS = {
            snowflake: { fill: false, d: ['M12 2v20M3.34 7l17.32 10M3.34 17L20.66 7', 'M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4M20 14l-4 1 1 4M4 14l4 1-1 4M20 10l-4-1 1-4'] },
            magnet: { fill: false, d: ['M4 4h5v9a3 3 0 0 0 6 0V4h5v9a8 8 0 0 1-16 0V4z', 'M4 8h5m6 0h5'] },
            hourglass: { fill: false, d: ['M5 3h14M5 21h14M7 3v4l5 5-5 5v4m10-18v4l-5 5 5 5v4', 'M9 18l3-3 3 3'] },
            multiplier: { fill: false, d: ['M3 10l6 8m0-8-6 8M13 9a4 4 0 0 1 8 0c0 3-6 4-8 8h8'] },
            bolt: { fill: true, d: ['M13 2L4 14h7l-1 8 10-12h-7l0-8z'] },
            settings: { fill: true, d: ['M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7z', 'M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1z'] },
            tools: { fill: false, d: ['M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6z', 'M18 14l3 3-2 2-3-3'] },
            spark: { fill: true, d: ['M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z', 'M19 3v3M17.5 4.5h3M5 17v3M3.5 18.5h3'] },
            star: { fill: true, d: ['M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5z'] },
            star4: { fill: true, d: ['M12 1.8l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.6 5.8 20.8 7 14 2 9.1l6.9-1L12 1.8z', 'M12 6v12M6 12h12'] },
            user: { fill: true, d: ['M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M4 20.5c1.6-4.2 14.4-4.2 16 0'] },
            close: { fill: false, d: ['M6 6l12 12M18 6L6 18'] },
            target: { fill: false, d: ['M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0z', 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z', 'M12 2v3M12 19v3M2 12h3M19 12h3'] },
            crown: { fill: true, d: ['M3 18h18l-2-11-4.5 4L12 5 9.5 11 5 7 3 18z', 'M3 21h18'] },
            palette: { fill: true, d: ['M12 3a9 9 0 0 0 0 18h1.8a2.2 2.2 0 0 0 1.6-3.7c-.5-.6-.3-1.6.5-1.6H18a3 3 0 0 0 3-3c0-5.4-4-9.7-9-9.7z', 'M7.5 10.5h.1M10.5 7.5h.1M14.5 7.5h.1M7.5 14.5h.1'] },
            scroll: { fill: true, d: ['M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M8 8h7M8 12h7M8 16h4'] },
            volume: { fill: true, d: ['M11 5L6 9H3v6h3l5 4V5z', 'M15.5 8.5a5 5 0 0 1 0 7', 'M18.5 6a8.5 8.5 0 0 1 0 12'] },
            mute: { fill: true, d: ['M11 5L6 9H3v6h3l5 4V5z', 'M16 9l5 6M21 9l-5 6'] },
            vibration: { fill: true, d: ['M8 4h8a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z', 'M4 8l-2 2 2 2-2 2 2 2', 'M20 8l2 2-2 2 2 2-2 2'] },
            fullscreen: { fill: false, d: ['M4 9V4h5', 'M20 9V4h-5', 'M4 15v5h5', 'M20 15v5h-5'] },
            eye: { fill: true, d: ['M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z', 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'] },
            'eye-off': { fill: false, d: ['M3 3l18 18', 'M10.6 6.2A9.7 9.7 0 0 1 12 6c6.2 0 10 6 10 6a16.8 16.8 0 0 1-4.1 4.6', 'M6.5 6.8C3.8 8.6 2 12 2 12s3.8 6.5 10 6.5c1.8 0 3.4-.5 4.8-1.2'] },
            globe: { fill: false, d: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', 'M3.5 9h17M3.5 15h17', 'M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18'] },
            'id-card': { fill: true, d: ['M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'M8.5 11.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M5.5 15.5c.8-2 5.2-2 6 0', 'M14 9.5h4.5M14 13.5h3.5'] },
            gift: { fill: true, d: ['M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z', 'M3 7h18v4H3V7z', 'M12 7v14', 'M12 7H8.5a2.2 2.2 0 1 1 0-4.4C11 2.6 12 7 12 7z', 'M12 7h3.5a2.2 2.2 0 1 0 0-4.4C13 2.6 12 7 12 7z'] },
            warning: { fill: true, d: ['M12 3L2 20h20L12 3z', 'M12 9v5', 'M12 17.2h.1'] },
            fire: { fill: true, d: ['M12.5 2.5c.4 3.4-2.2 5.2-1.4 8 1.2-1.1 2.2-2.7 2.4-4.3 3.2 2.2 5 5.4 5 8.5a6.5 6.5 0 0 1-13 0c0-3.3 2-6.1 4.2-8.2.9 1.3 1.7 2 2.8 1-.3-1.8 0-3.5 0-5z'] },
            wink: { fill: true, d: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z', 'M8 10h2.5', 'M15 9.8v.4', 'M8.5 14.5c1.5 1.8 5.5 1.8 7 0'] },
            shield: { fill: true, d: ['M12 2.5L4 6v5.8c0 5.1 3.4 9.3 8 10.7 4.6-1.4 8-5.6 8-10.7V6l-8-3.5z', 'M12 7v10'] },
            rocket: { fill: true, d: ['M14.5 4.5c3-.8 5.5-.5 5.5-.5s.3 2.5-.5 5.5c-.9 3.2-3.8 6.2-6.8 8.2L8.3 13.3c2-3 5-5.9 6.2-8.8z', 'M8.3 13.3L5 14l-1 4 4-1 .7-3.7', 'M14.5 9.5h.1'] },
            trash: { fill: true, d: ['M4 7h16', 'M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13', 'M9 7V4h6v3', 'M10 11v6M14 11v6'] },
            blaster: { fill: true, d: ['M3 9h13l3 2.5-3 2.5H9l-1.5 5H4l1.5-5H3V9z', 'M19 11.5h3', 'M8 9V6.5h4V9'] },
            slots: { fill: true, d: ['M3 6h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z', 'M9 6v14M15 6v14', 'M6 12h.1M12 12h.1M18 12h.1'] },
            calendar: { fill: true, d: ['M4 6h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z', 'M3 10h18', 'M8 3v4M16 3v4', 'M8 14h3M13 14h3'] },
            broom: { fill: true, d: ['M19 3l-7 7', 'M10 8l6 6-4.5 6.5a2 2 0 0 1-2.8.2L4.3 16.3a2 2 0 0 1 .2-2.8L10 8z', 'M6.5 18.5l2.5-2.5'] },
            flag: { fill: true, d: ['M5 21V4', 'M5 4h13l-2.5 4.5L18 13H5'] },
            check: { fill: false, d: ['M4.5 12.5l5 5 10-11'] },
            lock: { fill: true, d: ['M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z', 'M8 11V7a4 4 0 0 1 8 0v4', 'M12 15v2'] },
            party: { fill: true, d: ['M4 20l4.5-12 7.5 7.5L4 20z', 'M14 5l2-2M18 9l3-1M15 10l2 1M10 4l-1 2'] },
            sparkle: { fill: true, d: ['M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7z'] },
            comet: { fill: true, d: ['M14.5 9.5a5 5 0 1 1-7 7 5 5 0 0 1 7-7z', 'M13 6l8-3-3 8', 'M9 5l6-2M19 15l-2 6'] },
            skull: { fill: true, d: ['M12 3a8 8 0 0 0-8 8c0 3 1.5 5.4 4 6.6V21h8v-3.4c2.5-1.2 4-3.6 4-6.6a8 8 0 0 0-8-8z', 'M9 12a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z', 'M15 12a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6z', 'M10 18v3M14 18v3'] },
            trophy: { fill: true, d: ['M7 4h10v5a5 5 0 0 1-10 0V4z', 'M7 6H4v2a3 3 0 0 0 3 3', 'M17 6h3v2a3 3 0 0 1-3 3', 'M12 14v5', 'M8 19h8'] },
            ufo: { fill: true, d: ['M7 11a5 4 0 0 1 10 0', 'M2 12.5c0-1.7 4.5-3 10-3s10 1.3 10 3-4.5 3-10 3-10-1.3-10-3z', 'M7 17l-1.5 2.5M12 17.5v3M17 17l1.5 2.5'] },
            burst: { fill: true, d: ['M12 2l2.6 5.2L20 5l-2.2 5.4L22 14l-5.6 1.2L17 21l-5-3.4L7 21l.6-5.8L2 14l4.2-3.6L4 5l5.4 2.2L12 2z'] }
        };

        const XP_TOKEN_REGEX = /\[\[xp:([a-z0-9-]+)\]\]/g;

        function createXpaceIconNode(name) {
            const spec = XP_ICON_PATHS[name] || XP_ICON_PATHS.spark;
            const ns = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(ns, 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('class', 'xp-icon xp-icon-' + name);
            spec.d.forEach((d, idx) => {
                const p = document.createElementNS(ns, 'path');
                p.setAttribute('d', d);
                if (spec.fill && idx === 0) p.setAttribute('class', 'xp-fill');
                svg.appendChild(p);
            });
            return svg;
        }

        function iconizeTextNode(textNode) {
            const val = textNode.nodeValue;
            if (!val || val.indexOf('[[xp:') === -1) return;
            const parent = textNode.parentNode;
            if (!parent || parent.nodeName === 'SCRIPT' || parent.nodeName === 'STYLE') return;
            XP_TOKEN_REGEX.lastIndex = 0;
            const frag = document.createDocumentFragment();
            let lastIdx = 0;
            let match;
            while ((match = XP_TOKEN_REGEX.exec(val)) !== null) {
                if (match.index > lastIdx) {
                    frag.appendChild(document.createTextNode(val.slice(lastIdx, match.index)));
                }
                frag.appendChild(createXpaceIconNode(match[1]));
                lastIdx = XP_TOKEN_REGEX.lastIndex;
            }
            if (lastIdx === 0) return;
            if (lastIdx < val.length) {
                frag.appendChild(document.createTextNode(val.slice(lastIdx)));
            }
            parent.replaceChild(frag, textNode);
        }

        function iconizeSubtree(root) {
            if (!root) return;
            if (root.nodeType === 3) {
                iconizeTextNode(root);
                return;
            }
            if (root.nodeType !== 1 && root.nodeType !== 11) return;
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
            const nodes = [];
            let n;
            while ((n = walker.nextNode())) {
                if (n.nodeValue && n.nodeValue.indexOf('[[xp:') !== -1) nodes.push(n);
            }
            nodes.forEach(iconizeTextNode);
        }

        function drawXpaceCanvasIcon(ctx, name, cx, cy, size) {
            const spec = XP_ICON_PATHS[name] || XP_ICON_PATHS.spark;
            ctx.save();
            const scale = size / 24;
            ctx.translate(cx - size / 2, cy - size / 2);
            ctx.scale(scale, scale);
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 2.3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            spec.d.forEach((d, idx) => {
                const path2d = new Path2D(d);
                if (spec.fill && idx === 0) {
                    ctx.save();
                    ctx.globalAlpha *= 0.24;
                    ctx.fill(path2d);
                    ctx.restore();
                }
                ctx.stroke(path2d);
            });
            ctx.restore();
        }

        function drawXpaceText(ctx, text, x, y) {
            const str = String(text ?? '');
            if (str.indexOf('[[xp:') === -1) {
                ctx.fillText(str, x, y);
                return;
            }
            const fontMatch = /(\d+(?:\.\d+)?)px/.exec(ctx.font || '');
            const fontSize = fontMatch ? parseFloat(fontMatch[1]) : 12;
            const iconSize = fontSize * 1.15;
            const parts = [];
            XP_TOKEN_REGEX.lastIndex = 0;
            let lastIdx = 0;
            let match;
            while ((match = XP_TOKEN_REGEX.exec(str)) !== null) {
                if (match.index > lastIdx) {
                    const seg = str.slice(lastIdx, match.index);
                    parts.push({ type: 'text', value: seg, width: ctx.measureText(seg).width });
                }
                parts.push({ type: 'icon', value: match[1], width: iconSize });
                lastIdx = XP_TOKEN_REGEX.lastIndex;
            }
            if (lastIdx < str.length) {
                const seg = str.slice(lastIdx);
                parts.push({ type: 'text', value: seg, width: ctx.measureText(seg).width });
            }
            const totalW = parts.reduce((acc, p) => acc + p.width, 0);
            let curX = x;
            if (ctx.textAlign === 'center') curX = x - totalW / 2;
            else if (ctx.textAlign === 'right' || ctx.textAlign === 'end') curX = x - totalW;

            ctx.save();
            ctx.textAlign = 'left';
            const iconCenterY = y - fontSize * 0.34;
            parts.forEach(p => {
                if (p.type === 'text') {
                    ctx.fillText(p.value, curX, y);
                } else {
                    drawXpaceCanvasIcon(ctx, p.value, curX + p.width / 2, iconCenterY, iconSize);
                }
                curX += p.width;
            });
            ctx.restore();
        }

        (function initXpaceIcons() {
            const start = () => {
                iconizeSubtree(document.body);
                const obs = new MutationObserver((mutations) => {
                    for (let i = 0; i < mutations.length; i++) {
                        const m = mutations[i];
                        if (m.type === 'characterData') {
                            iconizeTextNode(m.target);
                        } else if (m.addedNodes && m.addedNodes.length) {
                            for (let j = 0; j < m.addedNodes.length; j++) {
                                iconizeSubtree(m.addedNodes[j]);
                            }
                        }
                    }
                });
                obs.observe(document.body, { childList: true, subtree: true, characterData: true });
            };
            if (document.body) start();
            else document.addEventListener('DOMContentLoaded', start);
        })();

        // Безопасная отрисовка скруглённого прямоугольника для любых браузеров
        function drawRoundRect(ctx, x, y, w, h, r) {
            const radius = Math.min(r, w / 2, h / 2);
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + w - radius, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
            ctx.lineTo(x + w, y + h - radius);
            ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
            ctx.lineTo(x + radius, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }

