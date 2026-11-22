        // Collectible and power-up rendering
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        const driveWakeSprites = new Map();
        let driveWakeBackdrop;

        defineNeonDriftGameMethods({

            drawDriveEnergyWake(ctx, color, radius, length, angle = 0) {
                let sprite = driveWakeSprites.get(color);
                if (!sprite) {
                    sprite = document.createElement('canvas');
                    sprite.width = 20;
                    sprite.height = 48;
                    const paint = sprite.getContext('2d');
                    const fade = paint.createLinearGradient(0, 0, 0, 48);
                    fade.addColorStop(0, color + '00');
                    fade.addColorStop(0.65, color + '26');
                    fade.addColorStop(1, color + 'a0');
                    paint.fillStyle = fade;
                    paint.beginPath();
                    paint.moveTo(10, 0);
                    paint.quadraticCurveTo(12, 34, 18, 48);
                    paint.lineTo(2, 48);
                    paint.quadraticCurveTo(8, 34, 10, 0);
                    paint.fill();
                    driveWakeSprites.set(color, sprite);
                }
                ctx.save();
                ctx.rotate(angle);
                ctx.drawImage(sprite, -radius * 0.64, -length, radius * 1.28, length);
                ctx.restore();
                if (!driveWakeBackdrop) {
                    driveWakeBackdrop = document.createElement('canvas');
                    driveWakeBackdrop.width = driveWakeBackdrop.height = 48;
                    const paint = driveWakeBackdrop.getContext('2d');
                    const shade = paint.createRadialGradient(24, 24, 0, 24, 24, 24);
                    shade.addColorStop(0, 'rgba(7, 6, 22, 0.91)');
                    shade.addColorStop(0.63, 'rgba(7, 6, 22, 0.79)');
                    shade.addColorStop(1, 'rgba(7, 6, 22, 0)');
                    paint.fillStyle = shade;
                    paint.fillRect(0, 0, 48, 48);
                }
                const spread = radius * 1.22;
                ctx.drawImage(driveWakeBackdrop, -spread, -spread, spread * 2, spread * 2);
            },

            drawDriveProjectile(shot, radius, color, core, direction) {
                const ctx = this.ctx;
                const pulse = 0.52 + Math.sin(this.runTime * 13 + shot.x * 0.044) * 0.13;
                ctx.save();
                ctx.translate(shot.x, shot.y);
                this.drawDriveEnergyWake(ctx, color, radius + 2.1, 17 + radius * 2, direction);
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = core;
                ctx.beginPath();
                ctx.arc(0, 0, radius * pulse, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            },

            drawBlueSpark(bs, driveScenery = false) {
                const ctx = this.ctx;
                const scale = 1 + Math.sin(bs.pulse) * 0.14;
                ctx.save();
                ctx.translate(bs.x, bs.y);
                ctx.scale(scale, scale);
                if (driveScenery) this.drawDriveEnergyWake(ctx, '#00f3ff', 11.5, 28);

                ctx.shadowColor = '#00f3ff';
                ctx.shadowBlur = driveScenery ? 7 : 12;

                ctx.fillStyle = '#00f3ff';
                ctx.beginPath();
                ctx.moveTo(0, -11);
                ctx.lineTo(8, 0);
                ctx.lineTo(0, 11);
                ctx.lineTo(-8, 0);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.moveTo(0, -5);
                ctx.lineTo(3.5, 0);
                ctx.lineTo(0, 5);
                ctx.lineTo(-3.5, 0);
                ctx.closePath();
                ctx.fill();

                ctx.restore();
            },

            drawPixelCoin(c) {
                const ctx = this.ctx;
                const scaleX = Math.max(0.24, Math.abs(Math.cos(c.phase)));
                const pixelSize = 3.5;
                const totalW = 8 * pixelSize * scaleX;
                const totalH = 8 * pixelSize;

                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.shadowColor = '#ffd60a';
                ctx.shadowBlur = 14;

                const startX = -totalW / 2;
                const startY = -totalH / 2;
                const pw = pixelSize * scaleX;

                for (let row = 0; row < 8; row++) {
                    for (let col = 0; col < 8; col++) {
                        const cell = this.coinMatrix[row][col];
                        if (cell === 0) continue;

                        if (cell === 1) ctx.fillStyle = '#784800';
                        else if (cell === 2) ctx.fillStyle = '#ffd60a';
                        else ctx.fillStyle = '#fff9c4';

                        ctx.fillRect(
                            Math.round(startX + col * pw),
                            Math.round(startY + row * pixelSize),
                            Math.ceil(pw),
                            Math.ceil(pixelSize)
                        );
                    }
                }

                ctx.restore();
            },

            drawPowerup(p, driveScenery = false) {
                const ctx = this.ctx;
                ctx.save();
                ctx.translate(p.x, p.y);
                const pulseR = p.r + Math.sin(p.pulse) * 2.5;

                let strokeCol = '#60a5fa';
                let fillBg = 'rgba(59, 130, 246, 0.26)';

                if (p.kind === 'magnet') {
                    strokeCol = '#c084fc';
                    fillBg = 'rgba(192, 132, 252, 0.26)';
                } else if (p.kind === 'slowmo') {
                    strokeCol = '#4ade80';
                    fillBg = 'rgba(74, 222, 128, 0.26)';
                } else if (p.kind === 'emp_bomb') {
                    strokeCol = '#ff9f1c';
                    fillBg = 'rgba(255, 159, 28, 0.30)';
                } else if (p.kind === 'double') {
                    strokeCol = '#ffd60a';
                    fillBg = 'rgba(255, 214, 10, 0.28)';
                }

                if (driveScenery) this.drawDriveEnergyWake(ctx, strokeCol, pulseR + 2, 26);

                // Внешний неоновый контур предмета
                ctx.strokeStyle = strokeCol;
                ctx.lineWidth = 2.4;
                ctx.shadowColor = strokeCol;
                ctx.shadowBlur = driveScenery ? 8 : 14;
                ctx.beginPath();
                ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
                ctx.fillStyle = fillBg;
                ctx.fill();
                ctx.stroke();

                if (driveScenery) {
                    ctx.fillStyle = strokeCol;
                    ctx.globalAlpha = 0.18 + 0.09 * Math.sin(p.pulse);
                    ctx.beginPath();
                    ctx.arc(0, 0, pulseR * 0.62, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }

                // Векторная стилизованная иконка внутри сферы (без эмодзи!)
                ctx.strokeStyle = '#ffffff';
                ctx.fillStyle = '#ffffff';
                ctx.lineWidth = 2;

                if (p.kind === 'shield') {
                    // Векторный кибер-щит
                    ctx.beginPath();
                    ctx.moveTo(0, -8);
                    ctx.lineTo(7, -4.5);
                    ctx.lineTo(5.5, 4);
                    ctx.lineTo(0, 8.5);
                    ctx.lineTo(-5.5, 4);
                    ctx.lineTo(-7, -4.5);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fillStyle = strokeCol;
                    ctx.fillRect(-1, -4, 2, 8);
                } else if (p.kind === 'magnet') {
                    // Векторный U-образный неоновый магнит
                    ctx.beginPath();
                    ctx.arc(0, 1, 5.5, 0, Math.PI, false);
                    ctx.moveTo(-5.5, 1);
                    ctx.lineTo(-5.5, -6);
                    ctx.moveTo(5.5, 1);
                    ctx.lineTo(5.5, -6);
                    ctx.stroke();
                    ctx.fillStyle = '#ff0a78';
                    ctx.fillRect(-7, -7, 3, 3);
                    ctx.fillRect(4, -7, 3, 3);
                } else if (p.kind === 'slowmo') {
                    // Векторные песочные часы Хроно-сдвига
                    ctx.beginPath();
                    ctx.moveTo(-5.5, -7);
                    ctx.lineTo(5.5, -7);
                    ctx.lineTo(-5.5, 7);
                    ctx.lineTo(5.5, 7);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fillStyle = strokeCol;
                    ctx.beginPath();
                    ctx.arc(0, 0, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.kind === 'emp_bomb') {
                    // Векторная звезда ЭМИ-ядра
                    ctx.beginPath();
                    for (let i = 0; i < 8; i++) {
                        const a = (i * Math.PI) / 4 + p.pulse * 0.3;
                        const rad = i % 2 === 0 ? 8.5 : 3.5;
                        if (i === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
                        else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
                    }
                    ctx.closePath();
                    ctx.fill();
                } else if (p.kind === 'double') {
                    // Векторный знак x2
                    ctx.beginPath();
                    ctx.moveTo(-7, -6);
                    ctx.lineTo(-2, 0);
                    ctx.lineTo(-7, 6);
                    ctx.moveTo(-1, -6);
                    ctx.lineTo(4, 0);
                    ctx.lineTo(-1, 6);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(6, -6);
                    ctx.lineTo(9, -6);
                    ctx.lineTo(7, 6);
                    ctx.stroke();
                }

                ctx.restore();
            }
        });
