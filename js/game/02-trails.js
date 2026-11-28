// Player exhaust is sampled at a fixed cadence and painted behind the ship.
const TRAIL_STEP = 1 / 60;
const TRAIL_LIFE = 1.85;
const TRAIL_SCROLL = 32;
const trailSprites = new WeakMap();
const trailSpriteRadius = 18;

function getTrailSprites(art) {
    let sprites = trailSprites.get(art);
    if (sprites) return sprites;

    const [shadow, main, highlight] = art.ink;
    sprites = art.marks.map(({ body, detail, color = main }) => {
        const sprite = document.createElement('canvas');
        sprite.width = sprite.height = trailSpriteRadius * 4;
        const ctx = sprite.getContext('2d');
        ctx.setTransform(2, 0, 0, 2, trailSpriteRadius * 2, trailSpriteRadius * 2);
        ctx.lineCap = ctx.lineJoin = 'round';

        const outline = new Path2D(body);
        const etching = new Path2D(detail);
        const fill = ctx.createLinearGradient(0, -11, 4, 11);
        fill.addColorStop(0, art.solid ? shadow : color);
        fill.addColorStop(0.48, art.solid ? shadow : `${color}ad`);
        fill.addColorStop(1, shadow);
        ctx.strokeStyle = `${color}19`;
        ctx.lineWidth = 5.5;
        ctx.stroke(outline);
        ctx.strokeStyle = `${color}3b`;
        ctx.lineWidth = 3;
        ctx.stroke(outline);
        ctx.fillStyle = fill;
        ctx.fill(outline, 'evenodd');
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke(outline);
        ctx.strokeStyle = `${highlight}d9`;
        ctx.lineWidth = 1.05;
        ctx.stroke(etching);

        return sprite;
    });
    trailSprites.set(art, sprites);
    return sprites;
}

function traceTrailStrip(ctx, vertices, start, end, widthScale) {
    if (end - start < 8) return;
    ctx.moveTo(vertices[start] + vertices[start + 2] * widthScale,
        vertices[start + 1] + vertices[start + 3] * widthScale);
    for (let i = start + 4; i < end; i += 4) {
        ctx.lineTo(vertices[i] + vertices[i + 2] * widthScale, vertices[i + 1] + vertices[i + 3] * widthScale);
    }
    for (let i = end - 4; i >= start; i -= 4) {
        ctx.lineTo(vertices[i] - vertices[i + 2] * widthScale, vertices[i + 1] - vertices[i + 3] * widthScale);
    }
    ctx.closePath();
}

function drawTrailRibbons(ctx, points, art, opacity) {
    if (points.length < 2) return;
    const headY = points[points.length - 1].y;
    const length = TRAIL_LIFE * TRAIL_SCROLL + art.span;
    const vertices = [];
    const stripEnds = [];

    for (const lane of art.lanes) {
        vertices.length = stripEnds.length = 0;
        let last = null;
        for (let i = points.length - 1; i >= 0; i -= 2) {
            const point = points[i];
            const seq = point.seq;
            if (lane.period && seq % lane.period >= lane.period * 0.65) {
                if (last) stripEnds.push(vertices.length);
                last = null;
                continue;
            }
            if (last && Math.hypot(point.x - last.x, point.y - last.y) > 38) {
                stripEnds.push(vertices.length);
            }

            const age = 1 - point.life / TRAIL_LIFE;
            const previous = points[Math.max(0, i - 1)];
            const next = points[Math.min(points.length - 1, i + 1)];
            const dx = previous.x - next.x;
            const dy = Math.max(1.2, Math.abs(previous.y - next.y) + (next.life - previous.life) * art.span / TRAIL_LIFE);
            const width = lane.width * Math.min(1, 0.48 + age * 13) * (1 - age) ** 1.2 / (2 * Math.hypot(dx, dy));
            vertices.push(point.x + lane.flow(age, seq * 0.16, seq), point.y + age * art.span, dy * width, -dx * width);
            last = point;
        }
        if (last) stripEnds.push(vertices.length);
        if (!stripEnds.length) continue;

        const tint = ctx.createLinearGradient(0, headY - 16, 0, headY + length);
        if (Array.isArray(lane.color)) {
            lane.color.forEach((color, index) => {
                const position = index / (lane.color.length - 1);
                const alpha = Math.round(235 * (1 - position) ** 0.85).toString(16).padStart(2, '0');
                tint.addColorStop(position, `${color}${alpha}`);
            });
        } else {
            tint.addColorStop(0, `${lane.color}d9`);
            tint.addColorStop(0.33, `${lane.color}b8`);
            tint.addColorStop(0.69, `${lane.color}65`);
            tint.addColorStop(1, `${lane.color}00`);
        }
        ctx.fillStyle = tint;

        for (const widthScale of [2.6, 1]) {
            ctx.beginPath();
            let start = 0;
            for (const end of stripEnds) {
                traceTrailStrip(ctx, vertices, start, end, widthScale);
                start = end;
            }
            ctx.globalAlpha = opacity * (widthScale === 1 ? 0.74 : 0.2);
            ctx.fill();
        }
    }
}

function drawTrailFlecks(ctx, points, span, flecks, opacity) {
    const { color, shape, spread, step } = flecks;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity * 0.55;
    ctx.beginPath();
    for (const { life, seq, x, y } of points) {
        if (seq % step !== 0) continue;
        const age = 1 - life / TRAIL_LIFE;
        const scatter = (seq * 29 % 97) / 96 * 2 - 1;
        const radius = (0.55 + (seq % 7) * 0.14) * (1 - age);
        shape(ctx, x + scatter * spread * (0.25 + 0.75 * age), y + span * age + (seq % 5) * 2, radius);
    }
    ctx.fill();
}

function drawPlayerTrail(ctx, points, art) {
    if (!points.length) return;
    ctx.save();
    const opacity = ctx.globalAlpha;
    drawTrailRibbons(ctx, points, art, opacity);
    if (art.flecks) drawTrailFlecks(ctx, points, art.span, art.flecks, opacity);

    const { stride, size, drift = trailCenter, spin = 0, growth = 0, alternate } = art;
    const sprites = getTrailSprites(art);
    for (const point of points) {
        const { seq } = point;
        if (seq % stride !== 0) continue;

        const index = seq / stride;
        const side = index % 2 === 0 ? 1 : -1;
        const life = point.life / TRAIL_LIFE;
        const age = 1 - life;
        const radius = trailSpriteRadius * size * (1 + growth * age);
        const offset = drift(age, seq * 0.16, seq) * (alternate ? side : 1);
        ctx.save();
        ctx.globalAlpha = opacity * Math.min(1, age * 15) * life ** 1.35 * 0.92;
        ctx.translate(point.x + offset, point.y + age * art.span);
        ctx.rotate(spin * (side * age + Math.sin(seq * 0.61) * 0.22));
        if (alternate) ctx.scale(side, 1);
        ctx.drawImage(sprites[index % sprites.length], -radius, -radius, radius * 2, radius * 2);
        ctx.restore();
    }

    ctx.restore();
}

function drawClassicNumberTrail(ctx, point, lifeRatio, seq) {
    // Эксклюзивный след «42»: медленный и чёткий шлейф
    if (seq % 12 !== 0) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, lifeRatio * 1.65);
    const scale = 0.92 + lifeRatio * 0.35;
    ctx.translate(point.x, point.y + 4);
    ctx.scale(scale, scale);
    ctx.font = '900 13px "Exo 2", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ff0a78';
    ctx.fillText('42', -2, 2);
    ctx.shadowColor = '#ffd60a';
    ctx.shadowBlur = 10;
    ctx.fillStyle = (seq % 24 === 0) ? '#ffd60a' : '#00f5d4';
    ctx.fillText('42', 0, 0);
    ctx.restore();
}

function drawClassicLeopardTrail(ctx, point, lifeRatio, seq, previous) {
    // След «ЛЕОПАРД 42»: плавная леопардовая лента + мягко плывущие числа «42» в леопардовой расцветке
    const age = 1 - lifeRatio;
    const fadeIn = Math.min(1, age * 6);
    const smoothEase = lifeRatio * lifeRatio * (3 - 2 * lifeRatio) * fadeIn;
    const wavePhase = this.runTime * 2.6 - age * 4.2;
    const swayX = Math.sin(wavePhase) * 4.5 * age;
    const px = point.x + swayX;
    const py = point.y + 4;

    if (!this._leopardTrailPattern) {
        const pCan = document.createElement('canvas');
        pCan.width = 20;
        pCan.height = 20;
        const pCtx = pCan.getContext('2d');
        const grad = pCtx.createLinearGradient(0, 0, 20, 20);
        grad.addColorStop(0, '#fde047');
        grad.addColorStop(0.5, '#f59e0b');
        grad.addColorStop(1, '#b45309');
        pCtx.fillStyle = grad;
        pCtx.fillRect(0, 0, 20, 20);
        const spots = [
            { x: 4.5, y: 4.5, r: 2.8 },
            { x: 14.5, y: 5.5, r: 2.5 },
            { x: 8.5, y: 14.5, r: 3.0 },
            { x: 16.5, y: 15.5, r: 2.2 }
        ];
        spots.forEach(sp => {
            pCtx.fillStyle = '#291506';
            pCtx.beginPath();
            pCtx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
            pCtx.fill();
            pCtx.fillStyle = '#d97706';
            pCtx.beginPath();
            pCtx.arc(sp.x, sp.y, sp.r * 0.52, 0, Math.PI * 2);
            pCtx.fill();
        });
        this._leopardTrailPattern = ctx.createPattern(pCan, 'repeat');
    }

    // 1) Непрерывный плавный леопардовый шлейф между точками
    if (previous) {
        const prevRatio = Math.max(0, previous.life / TRAIL_LIFE);
        const prevAge = 1 - prevRatio;
        const prevPhase = this.runTime * 2.6 - prevAge * 4.2;
        const prevX = previous.x + Math.sin(prevPhase) * 4.5 * prevAge;
        const prevY = previous.y + 4;

        ctx.save();
        ctx.lineCap = 'round';
        // Мягкое золотисто-янтарное внешнее свечение
        ctx.globalAlpha = smoothEase * 0.34;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 15 * smoothEase + 3;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Леопардовая текстурная сердцевина ленты
        ctx.globalAlpha = smoothEase * 0.85;
        ctx.strokeStyle = this._leopardTrailPattern || '#f59e0b';
        ctx.lineWidth = 7 * smoothEase + 1.5;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.restore();
    }

    // 2) Плавные леопардовые числа «42»
    if (seq % 7 !== 0) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, smoothEase * 1.35);
    const pulse = 1 + Math.sin(this.runTime * 4 + seq * 0.2) * 0.04;
    const scale = (0.78 + smoothEase * 0.42) * pulse;
    ctx.translate(px, py);
    ctx.scale(scale, scale);

    // Кэшированный мягкий радиальный ореол свечения
    if (!this._leopardGlowSprite) {
        const gCan = document.createElement('canvas');
        gCan.width = 48;
        gCan.height = 48;
        const gCtx = gCan.getContext('2d');
        const rGrad = gCtx.createRadialGradient(24, 24, 2, 24, 24, 22);
        rGrad.addColorStop(0, 'rgba(253, 224, 71, 0.78)');
        rGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.38)');
        rGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');
        gCtx.fillStyle = rGrad;
        gCtx.fillRect(0, 0, 48, 48);
        this._leopardGlowSprite = gCan;
    }
    ctx.drawImage(this._leopardGlowSprite, -22, -22, 44, 44);

    ctx.font = '900 13px "Exo 2", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Тёмно-коричневая леопардовая обводка + леопардовая текстура внутри «42»
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = '#291506';
    ctx.strokeText('42', 0, 0);

    ctx.fillStyle = this._leopardTrailPattern || '#f59e0b';
    ctx.fillText('42', 0, 0);

    // Тонкий золотистый контур по краю цифр
    ctx.lineWidth = 0.75;
    ctx.strokeStyle = '#fde047';
    ctx.strokeText('42', 0, 0);
    ctx.restore();
}

function drawClassicRequiemTrail(ctx, point, lifeRatio, seq) {
    if (seq % 5 !== 0) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, lifeRatio * 1.3);
    ctx.translate(point.x + Math.sin(seq * 1.7 + this.runTime * 2) * (1 - lifeRatio) * 9, point.y);
    ctx.rotate(Math.sin(seq * 0.7) * 0.32);
    ctx.scale(0.65 + lifeRatio * 0.4, 0.65 + lifeRatio * 0.4);
    if (this.overdriveActive) {
        ctx.shadowColor = '#ff244e';
        ctx.shadowBlur = 8;
    }
    this.drawRequiemSkull(ctx, this.overdriveActive ? 7 : 5.5, '#dd2641');
    ctx.restore();
}

const CLASSIC_TRAIL_PARTICLES = new Map([
    ['text42', drawClassicNumberTrail],
    ['cleopatra_42', drawClassicLeopardTrail],
    ['requiem_skulls', drawClassicRequiemTrail]
]);

defineNeonDriftGameMethods({
    drawEquippedPlayerTrail(ctx, trailId, points = this.player.trail) {
        const drawParticle = CLASSIC_TRAIL_PARTICLES.get(trailId);
        if (!drawParticle) {
            drawPlayerTrail(ctx, points, getTrailArt(trailId));
            return;
        }

        points.forEach((point, index) => {
            drawParticle.call(this, ctx, point, Math.max(0, point.life / TRAIL_LIFE), point.seq, points[index - 1]);
        });
    },

    updatePlayerTrail(dt, startX, startY) {
        const { x, y, trail } = this.player;
        const trailId = this.resolveEffectiveTrailId(this.getActiveShipConfig());
        const classic = CLASSIC_TRAIL_PARTICLES.has(trailId);
        let timeToSample = TRAIL_STEP - (this._trailAcc || 0);

        for (const point of trail) {
            point.y += TRAIL_SCROLL * dt;
            point.life -= dt;
        }
        while (trail.length && trail[0].life <= 0) trail.shift();

        while (timeToSample <= dt + 1e-9) {
            // The original effects emit all samples at the ship's position at the end of the frame.
            const progress = classic ? 1 : Math.min(1, timeToSample / dt);
            const elapsed = classic ? dt : Math.max(0, dt - timeToSample);
            this.trailSeq = (this.trailSeq || 0) + 1;
            trail.push({
                x: startX + (x - startX) * progress,
                y: startY + (y - startY) * progress + 18 + elapsed * TRAIL_SCROLL,
                life: TRAIL_LIFE - elapsed,
                seq: this.trailSeq
            });
            timeToSample += TRAIL_STEP;
        }
        this._trailAcc = Math.max(0, TRAIL_STEP + dt - timeToSample);
    }
});
