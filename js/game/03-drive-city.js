// Outrun background for the Drive playfield. Cache the art and animate the
// parallax layers, waterfront and lighting.
(() => {
    const TAU = Math.PI * 2;
    const MARGIN = 32;
    const GRID_ROWS = 19;
    const CAMERA_RESPONSE = 10;
    const ROAD_EDGE_COLORS = ['#ffc47d', '#f279b9'];

    function smoothstep(value) {
        const t = Math.max(0, Math.min(1, value));
        return t * t * (3 - 2 * t);
    }

    function canvas(width, height) {
        const surface = document.createElement('canvas');
        surface.width = Math.ceil(width);
        surface.height = Math.ceil(height);
        return surface;
    }

    function randomSequence(seed) {
        return () => {
            seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
            return seed / 4294967296;
        };
    }

    function gradient(ctx, x, y, toX, toY, colors) {
        const result = ctx.createLinearGradient(x, y, toX, toY);
        for (let index = 0; index < colors.length; index++) {
            result.addColorStop(index / (colors.length - 1), colors[index]);
        }
        return result;
    }

    function fillPolygon(ctx, points, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
        ctx.closePath();
        ctx.fill();
    }

    function paintSky(ctx, width, height, horizon) {
        const sky = ctx.createLinearGradient(0, 0, 0, horizon);
        sky.addColorStop(0, '#0d0628');
        sky.addColorStop(0.38, '#23105a');
        sky.addColorStop(0.72, '#62266f');
        sky.addColorStop(1, '#a52d73');
        ctx.fillStyle = sky;
        ctx.fillRect(-MARGIN, -MARGIN, width + 2 * MARGIN, horizon + MARGIN);

        ctx.save();
        ctx.translate(width / 2, horizon);
        ctx.scale(width * 0.64, horizon * 0.76);
        const dusk = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        dusk.addColorStop(0, 'rgba(255, 167, 87, 0.84)');
        dusk.addColorStop(0.41, 'rgba(255, 94, 109, 0.56)');
        dusk.addColorStop(0.72, 'rgba(255, 46, 147, 0.25)');
        dusk.addColorStop(1, 'rgba(255, 46, 147, 0)');
        ctx.fillStyle = dusk;
        ctx.fillRect(-1, -1, 2, 1);
        ctx.restore();

        const random = randomSequence(84513);
        for (let i = 0; i < 143; i++) {
            const x = random() * width;
            const y = random() * horizon * 0.66;
            const brightness = random();
            ctx.fillStyle = brightness > 0.96 ? '#8c769c' : brightness > 0.65 ? '#554362' : '#332441';
            const size = brightness > 0.96 ? 1.6 : 1;
            ctx.fillRect(x, y, size, size);
        }

        for (const [x, y, spread, thickness, opacity] of [
            [0.12, 0.59, 0.36, 0.047, 0.23], [0.39, 0.72, 0.5, 0.036, 0.27],
            [0.84, 0.51, 0.38, 0.043, 0.22], [0.82, 0.78, 0.47, 0.051, 0.29],
            [0.11, 0.81, 0.42, 0.043, 0.24], [0.54, 0.41, 0.34, 0.039, 0.15]
        ]) {
            ctx.save();
            ctx.translate(width * x, horizon * y);
            ctx.scale(width * spread, horizon * thickness);
            const cloud = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
            cloud.addColorStop(0, `rgba(255, 132, 151, ${opacity})`);
            cloud.addColorStop(0.48, `rgba(255, 132, 151, ${opacity * 0.55})`);
            cloud.addColorStop(1, 'rgba(255, 132, 151, 0)');
            ctx.fillStyle = cloud;
            ctx.fillRect(-1, -1, 2, 2);
            ctx.restore();
        }
    }

    function paintGarageMoon(ctx, width, height) {
        const radius = Math.min(width * 0.068, height * 0.14);
        const haloRadius = radius * 2.6;
        ctx.save();
        ctx.translate(width * 0.65, height * 0.29);

        const halo = ctx.createRadialGradient(radius * 0.22, -radius * 0.16, 0, 0, 0, haloRadius);
        halo.addColorStop(0, '#76c6ff52');
        halo.addColorStop(0.46, '#a377ff36');
        halo.addColorStop(1, '#ad5fff00');
        ctx.fillStyle = halo;
        ctx.fillRect(-haloRadius, -haloRadius, haloRadius * 2, haloRadius * 2);

        ctx.fillStyle = gradient(ctx, -radius, radius, radius, -radius, ['#20123c', '#433766', '#7f83b7']);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = '#a99ae382';
        ctx.lineWidth = 0.75;
        ctx.stroke();

        for (const [offsetX, offsetY, scale] of [[-0.33, -0.29, 0.19], [0.12, -0.1, 0.12],
            [-0.36, 0.31, 0.12], [0.18, 0.38, 0.2], [-0.04, 0.59, 0.09]]) {
            const x = radius * offsetX, y = radius * offsetY, craterRadius = radius * scale;
            const shadow = ctx.createRadialGradient(x - craterRadius * 0.18, y, 0, x, y, craterRadius);
            shadow.addColorStop(0, '#17153d80');
            shadow.addColorStop(0.68, '#29234477');
            shadow.addColorStop(0.86, '#a4a3cc45');
            shadow.addColorStop(1, '#a4a3cc00');
            ctx.fillStyle = shadow;
            ctx.fillRect(x - craterRadius, y - craterRadius, craterRadius * 2, craterRadius * 2);
        }

        const start = -2.22, end = 1.19;
        ctx.fillStyle = gradient(ctx, 0, -radius, 0, radius, ['#f4e0ff', '#9cf5ff', '#827cff']);
        ctx.beginPath();
        ctx.arc(0, 0, radius, start, end);
        ctx.bezierCurveTo(radius * 0.96, radius * 0.36, radius * 0.5, -radius * 0.66,
            Math.cos(start) * radius, Math.sin(start) * radius);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function shoreOffset(width, progress) {
        return width * (0.259 + Math.sqrt(progress) * 0.245);
    }

    function highwayOffset(width, progress) {
        return width * (0.038 + (0.21 - 0.038) * progress);
    }

    function paintWater(ctx, width, height, horizon, radius) {
        const floor = height + MARGIN;
        const span = height - horizon;
        ctx.fillStyle = gradient(ctx, 0, horizon, 0, height, ['#302043', '#150e2b', '#090b1f']);
        ctx.fillRect(-MARGIN, horizon, width + 2 * MARGIN, floor - horizon);

        ctx.save();
        ctx.beginPath();
        ctx.rect(-MARGIN, horizon, width + 2 * MARGIN, floor - horizon);
        ctx.clip();
        ctx.translate(width / 2, horizon + span * 0.26);
        ctx.scale(Math.min(width * 0.32, radius * 1.26), span * 0.61);
        const mirror = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        mirror.addColorStop(0, 'rgba(222, 88, 122, 0.31)');
        mirror.addColorStop(0.46, 'rgba(172, 50, 128, 0.19)');
        mirror.addColorStop(1, 'rgba(147, 34, 118, 0)');
        ctx.fillStyle = mirror;
        ctx.fillRect(-1, -1, 2, 2);
        ctx.restore();

        // Bake the receding rails. The crossbars move separately in world depth.
        const rays = [new Path2D(), new Path2D()];
        for (let i = -17; i <= 17; i++) {
            const offset = (i + 0.5) * Math.max(width * 0.067, 34);
            const group = rays[Math.abs(i) % 2];
            group.moveTo(width / 2 + offset * 0.024, horizon);
            group.lineTo(width / 2 + offset * 1.12, floor);
        }
        ctx.lineWidth = 0.85;
        ctx.strokeStyle = gradient(ctx, 0, horizon, 0, floor, ['#594255', '#593260', '#33254b']);
        ctx.stroke(rays[0]);
        ctx.strokeStyle = gradient(ctx, 0, horizon, 0, floor, ['#4f385c', '#315365', '#203448']);
        ctx.stroke(rays[1]);

        const center = width / 2;
        const throat = highwayOffset(width, 0);
        const edgeWidth = highwayOffset(width, 1);
        fillPolygon(ctx, [[center - throat, horizon], [center + throat, horizon],
            [center + edgeWidth, floor], [center - edgeWidth, floor]],
            gradient(ctx, 0, horizon, 0, floor, ['#552743a0', '#25152a92', '#150c238a']));
        for (const side of [-1, 1]) {
            const color = ROAD_EDGE_COLORS[side === -1 ? 0 : 1];
            const rim = [[center + side * throat, horizon], [center + side * edgeWidth, floor]];
            ctx.globalAlpha = 0.09;
            trace(ctx, rim, color, 7);
            ctx.globalAlpha = 0.46;
            trace(ctx, rim, color, 2.3);
            ctx.globalAlpha = 0.18;
            trace(ctx, [[center + side * throat * 0.81, horizon], [center + side * edgeWidth * 0.81, floor]], color, 0.8);
        }
        ctx.globalAlpha = 1;

        // The waterfront narrows toward the horizon, with room for the flyway in the middle.
        for (const side of [-1, 1]) {
            const edge = side < 0 ? -MARGIN : width + MARGIN;
            const boundary = [0, 0.04, 0.12, 0.28, 0.49, 0.72, 1].map(progress => [
                width / 2 + side * shoreOffset(width, progress),
                horizon + (floor - horizon) * progress
            ]);
            fillPolygon(ctx, [[edge, horizon], ...boundary, [edge, floor]],
                gradient(ctx, 0, horizon, 0, floor, ['#21142e', '#100e24', '#0b0c21']));
            ctx.beginPath();
            ctx.moveTo(...boundary[0]);
            for (const point of boundary.slice(1)) ctx.lineTo(...point);
            const curb = side === -1 ? '#32baa9' : '#d95aa4';
            for (const [lineWidth, opacity] of [[9, 0.08], [4, 0.16], [1.4, 0.47]]) {
                ctx.lineWidth = lineWidth;
                ctx.globalAlpha = opacity;
                ctx.strokeStyle = curb;
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }
    }

    function makeSun(radius) {
        const glowRadius = radius * 1.47;
        const halo = canvas(glowRadius * 2, glowRadius * 2);
        const glow = halo.getContext('2d');
        const center = halo.width / 2;
        const light = glow.createRadialGradient(center, center, 0, center, center, glowRadius);
        light.addColorStop(0, 'rgba(255, 128, 90, 0.32)');
        light.addColorStop(0.67, 'rgba(251, 71, 128, 0.32)');
        light.addColorStop(0.8, 'rgba(209, 38, 141, 0.15)');
        light.addColorStop(1, 'rgba(209, 38, 141, 0)');
        glow.fillStyle = light;
        glow.fillRect(0, 0, halo.width, halo.height);

        const disc = canvas(radius * 2 + 2, radius * 2 + 2);
        const ctx = disc.getContext('2d');
        const middle = disc.width / 2;
        ctx.translate(middle, middle);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, TAU);
        ctx.clip();
        ctx.fillStyle = gradient(ctx, 0, -radius, 0, radius, ['#ff5c93', '#ffc17c', '#ffde97', '#ff5e9e']);
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
        ctx.fillStyle = gradient(ctx, 0, -radius, 0, radius, ['rgba(40, 12, 54, 0.14)', 'rgba(52, 11, 61, 0.26)']);
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
        return { halo, disc };
    }

    function drawSun(ctx, scene, shift, time) {
        const { width, horizon, radius, sunDim, sun } = scene;
        const { halo, disc } = sun;
        const x = width / 2 + shift;
        const y = horizon - radius * 0.79 + Math.sin(time * 0.71) * radius * 0.026;
        const brightness = 1 - sunDim;
        const pulse = 0.5 + 0.5 * Math.sin(time * 1.25);
        const haloSize = halo.width * (1 + pulse * 0.058);
        ctx.globalAlpha = brightness * (0.65 + pulse * 0.35);
        ctx.drawImage(halo, x - haloSize / 2, y - haloSize / 2, haloSize, haloSize);

        // Slide the cutouts across the cached disc instead of repainting its gradients.
        const discTop = y - disc.height / 2;
        const discLeft = x - disc.width / 2;
        const shiftBands = radius * 0.052 * Math.sin(time * 1.05);
        const cap = disc.height / 2 + radius * 0.10 + shiftBands;
        ctx.globalAlpha = brightness * (0.96 + pulse * 0.04);
        ctx.drawImage(disc, 0, 0, disc.width, cap, discLeft, discTop, disc.width, cap);
        for (let stripe = 0; stripe < 7; stripe++) {
            const top = disc.height / 2 + radius * (0.13 + stripe * 0.129) + shiftBands;
            const band = Math.min(radius * (0.112 - stripe * 0.009), disc.height - top);
            if (band > 0) {
                ctx.drawImage(disc, 0, top, disc.width, band, discLeft, discTop + top, disc.width, band);
            }
        }
    }

    const REAR_RIDGE = [
        [-0.16, 0.47], [-0.035, 0.74], [0.04, 0.49], [0.10, 0.88],
        [0.18, 0.43], [0.23, 0.57], [0.31, 0.30], [0.37, 0.39], [0.47, 0]
    ];
    const FRONT_RIDGE = [
        [-0.16, 0.38], [-0.035, 0.69], [0.025, 0.33], [0.095, 1],
        [0.16, 0.38], [0.205, 0.54], [0.26, 0.22], [0.302, 0.29], [0.393, 0]
    ];

    function makeMountains(width, ridgeHeight, nearer) {
        const surface = canvas(width + 2 * MARGIN, ridgeHeight + 4);
        const ctx = surface.getContext('2d');
        const base = surface.height - 1;
        const profile = nearer ? FRONT_RIDGE : REAR_RIDGE;
        for (const side of [0, 1]) {
            const points = profile.map(([x, altitude], i) => [
                MARGIN + width * (side ? 1 - x * 0.86 : x),
                base - ridgeHeight * altitude * (side ? 0.81 + (i % 3) * 0.065 : 1)
            ]);
            const first = points[0][0];
            const last = points[points.length - 1][0];
            fillPolygon(ctx, [...points, [last, base], [first, base]], nearer ? '#100b24' : '#231337');
            ctx.lineWidth = nearer ? 1.05 : 0.8;
            ctx.strokeStyle = side ? (nearer ? '#447483' : '#394569') : (nearer ? '#994874' : '#643d71');
            ctx.beginPath();
            ctx.moveTo(...points[0]);
            for (let i = 1; i < points.length; i++) ctx.lineTo(...points[i]);
            ctx.stroke();

            for (let i = 1; i < points.length - 1; i += 2) {
                const [x, y] = points[i];
                const [nextX, nextY] = points[i + 1];
                const footX = x + (nextX - x) * 0.39;
                fillPolygon(ctx, [[x, y], [nextX, nextY], [nextX, base], [footX, base]], nearer ? '#21112e' : '#321942');
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(footX, base);
                ctx.strokeStyle = side ? '#365967' : '#633451';
                ctx.stroke();
            }
        }
        return surface;
    }

    function makeSkyline(width, height, mobile) {
        const random = randomSequence(991079);
        const colors = ['#ffc98b', '#f89ccc', '#84c9ef'];
        const layers = [true, false].map(distant => {
            const surface = canvas(width + MARGIN * 2, height);
            const ctx = surface.getContext('2d');
            const base = surface.height;
            const lights = [];
            const beacons = [];
            const baseline = base - (distant ? Math.round(height * 0.07) : 0);
            const tint = distant ? ['#673757', '#8f4f6b'] : ['#22152f', '#32233f'];
            const facade = gradient(ctx, 0, 0, 0, base, tint);
            for (let x = 0; x < surface.width;) {
                const w = 7 + random() * (distant ? 23 : 29);
                const spire = random() < (distant ? 0.32 : 0.18);
                const h = height * (0.11 + random() ** 1.72 * (distant ? 0.83 : 0.41));
                const y = baseline - h;
                const roof = Math.max(3, w * 0.17);
                ctx.fillStyle = facade;
                ctx.fillRect(x, y + roof, w, h - roof + 1);
                ctx.fillRect(x + roof, y, Math.max(2, w - roof * 2), roof + 1);
                ctx.fillStyle = distant ? '#e5a08569' : '#f6b59188';
                ctx.fillRect(x + roof, y, Math.max(2, w - roof * 2), 0.8);
                ctx.fillRect(x, y + roof, roof, 0.65);
                if (spire) {
                    const mastX = x + w * 0.52;
                    const mastY = y - 4 - w * 0.37;
                    ctx.fillStyle = distant ? '#945175' : '#744d72';
                    ctx.fillRect(mastX, mastY, 1, y - mastY + 1);
                    if (mobile) {
                        ctx.fillStyle = '#ff657e';
                        ctx.fillRect(mastX - 0.3, mastY - 1.1, 1.6, 1.3);
                    } else {
                        beacons.push({ x: mastX + 0.5, y: mastY, phase: x * 0.12 });
                    }
                }
                ctx.fillStyle = distant ? '#94618b' : '#49305c';
                ctx.globalAlpha = 0.45;
                ctx.fillRect(x + w - 1, y + roof, 1, h - roof);

                const pitch = distant ? 3.8 : 4.6;
                for (let row = y + roof + 2.5; row < baseline - 1; row += pitch) {
                    for (let col = x + 2.3; col < x + w - 2; col += pitch) {
                        const light = random();
                        if (light < 0.52) continue;
                        ctx.fillStyle = colors[Math.floor(random() * colors.length)];
                        const blinking = !mobile && light > 0.94;
                        ctx.globalAlpha = blinking ? 0.08 : (light - 0.46) * (distant ? 0.87 : 1.17);
                        const windowWidth = distant ? 1.25 : 1.75;
                        ctx.fillRect(col, row, windowWidth, 0.95);
                        if (blinking) {
                            lights.push({ x: col, y: row, width: windowWidth, color: ctx.fillStyle,
                                phase: (col + row) * 0.082, rate: 0.16 + (light - 0.94) * 2.2 });
                        }
                    }
                }
                ctx.globalAlpha = 1;
                x += w + 1 + random() * (distant ? 6 : 12);
            }
            const sampleStride = Math.max(1, Math.ceil(lights.length / 42));
            return { surface, beacons, lights: lights.filter((_, i) => i % sampleStride === 0) };
        });

        const atmosphere = canvas(1, height);
        const ctx = atmosphere.getContext('2d');
        const base = atmosphere.height;
        const haze = ctx.createLinearGradient(0, base * 0.46, 0, base);
        haze.addColorStop(0, 'rgba(190, 80, 146, 0)');
        haze.addColorStop(0.67, 'rgba(173, 69, 151, 0.19)');
        haze.addColorStop(0.93, 'rgba(215, 113, 170, 0.33)');
        haze.addColorStop(1, 'rgba(220, 130, 185, 0.48)');
        ctx.fillStyle = haze;
        ctx.fillRect(0, base * 0.46, 1, base * 0.54);
        return { layers, atmosphere };
    }

    function trace(ctx, points, color, width = 1) {
        ctx.beginPath();
        ctx.moveTo(...points[0]);
        for (let i = 1; i < points.length; i++) ctx.lineTo(...points[i]);
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    function makeBuilding(variant, distant, side, mobile) {
        const random = randomSequence(4801 + variant * 811);
        const width = [93, 138, 106, 152][variant];
        const height = [243, 176, 268, 153][variant];
        // Wide hotels can grow to several times their design size near the camera.
        const resolution = mobile ? 1 : (distant ? 2 : Math.max(3, Math.ceil(570 / height)));
        const surface = canvas(width * resolution, height * resolution);
        const ctx = surface.getContext('2d');
        ctx.scale(resolution, resolution);
        // The left and right banks face the same light source.
        if (side === 1) {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
        }
        const hotel = variant % 2 === 1;
        const top = hotel ? 27 : 40;
        const x = hotel ? 9 : 18;
        const face = Math.round(width * (hotel ? 0.76 : 0.72));
        const bevel = width - face - 5;
        const ledge = hotel ? 11 : 21;
        const base = height;
        const accent = ['#5de6e2', '#f985c7', '#f4ae79', '#8cacee'][variant];
        const main = gradient(ctx, 0, top, face, base, distant
            ? ['#51325e', '#302044', '#271936']
            : ['#523258', '#25223e', '#13162d']);
        const flank = gradient(ctx, face, top, width, base, distant
            ? ['#824365', '#4d2a53', '#312340']
            : ['#8b485f', '#4b305b', '#222447']);
        const outline = [[x, base], [x, top + ledge],
            [x + 7, top + ledge], [x + 7, top + 8], [x + 15, top + 8], [x + 15, top],
            [face - 9, top], [face, top + 8], [face, base]];
        fillPolygon(ctx, outline, main);
        fillPolygon(ctx, [[face, top + 8], [face + bevel, top + 21], [face + bevel, base], [face, base]], flank);

        const roof = outline.slice(1, -1);
        trace(ctx, roof, distant ? '#8d537d' : '#b75a95', 4);
        trace(ctx, roof, accent, 1.15);
        trace(ctx, [[face, top + 9], [face + bevel, top + 21], [face + bevel, base - 16]], '#efa791', 1);
        trace(ctx, [[face, top + 11], [face, base - 4]], '#755d91', 1);

        if (!hotel) {
            const mast = x + 0.65 * (face - x);
            fillPolygon(ctx, [[mast - 9, top + 1], [mast - 4, top - 10], [mast + 4, top - 10], [mast + 9, top + 1]], '#75537d');
            trace(ctx, [[mast, top - 10], [mast, 4]], '#ffaac2', 1.1);
            ctx.fillStyle = '#ffd2a0';
            ctx.fillRect(mast - 1.5, 4, 3, 2);
        }

        for (let y = top + 24; y < base - 9; y += hotel ? 11 : 8) {
            ctx.fillStyle = hotel ? '#493559' : '#302641';
            ctx.fillRect(x + 1, y - 1, face - x - 2, 0.9);
            for (let col = x + 5; col < face - 7; col += hotel ? 10 : 8) {
                if (random() < 0.36) continue;
                const hue = random();
                ctx.fillStyle = hue < 0.33 ? '#f6bc80' : hue < 0.64 ? '#e780b3' : '#77bcc9';
                ctx.globalAlpha = 0.49 + random() * 0.45;
                ctx.fillRect(col, y, hotel ? 5 : 3.3, hotel ? 2.7 : 2.2);
            }
            ctx.globalAlpha = 0.65;
            ctx.fillStyle = y % 3 === 0 ? '#ed9f8b' : '#a674a6';
            ctx.fillRect(face + bevel * 0.47, y + 4, 2.4, 2.1);
            ctx.globalAlpha = 1;
        }

        if (hotel) {
            for (const y of [top + 26, top + 44, base - 19]) {
                trace(ctx, [[x, y], [face, y], [face + bevel, y + 6]], distant ? '#b56d9f' : accent, 1.4);
            }
            const signX = side === -1 ? face - 8 : width - face + 8;
            const signY = top + 28;
            const text = variant === 1 ? 'OASIS' : 'PALMS';
            ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
            ctx.fillStyle = '#321a3d';
            ctx.fillRect(signX - 6, signY, 12, 58);
            ctx.strokeStyle = accent;
            ctx.strokeRect(signX - 6, signY, 12, 58);
            ctx.fillStyle = '#ffd0e2';
            ctx.textAlign = 'center';
            ctx.font = 'bold 8px sans-serif';
            for (let i = 0; i < text.length; i++) ctx.fillText(text[i], signX, signY + 10 + i * 10);
        }
        return surface;
    }

    const PALM_FRONDS = [
        [-1.15, 57, 24], [-0.66, 68, 23], [-0.13, 76, 28],
        [0.36, 78, 32], [0.89, 68, 25], [1.47, 52, 23],
        [2.39, 58, 29], [2.83, 69, 28], [3.23, 73, 25], [3.68, 66, 21]
    ];

    function makePalm(variant, distant, side, mobile) {
        const width = 162;
        const height = 199;
        // Supersample the leaflets and bark before projecting the palm into the scene.
        const resolution = mobile ? 1 : (distant ? 2 : 3);
        const surface = canvas(width * resolution, height * resolution);
        const ctx = surface.getContext('2d');
        ctx.scale(resolution, resolution);
        if (side === 1) {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
        }

        const trunk = new Path2D('M83 199C93 152 71 103 72 61L79 59C79 103 104 150 96 199Z');
        ctx.fillStyle = gradient(ctx, 52, 101, 100, 145, ['#422149', '#693b62', '#21586a', '#192d47']);
        ctx.fill(trunk);
        ctx.save();
        ctx.clip(trunk);
        for (let y = 76; y < height; y += 8) {
            trace(ctx, [[68, y - 2], [102, y + 3]], '#261d3d', 1.35);
            trace(ctx, [[80, y], [106, y + 4]], '#8b527d', 0.65);
        }
        ctx.restore();
        ctx.beginPath();
        ctx.moveTo(79, 59);
        ctx.bezierCurveTo(79, 103, 104, 150, 96, 199);
        ctx.strokeStyle = distant ? '#996782' : '#e69a8d';
        ctx.lineWidth = 1.15;
        ctx.stroke();

        for (const [angle, length, bow] of PALM_FRONDS) {
            ctx.save();
            ctx.translate(76, 63);
            ctx.rotate(angle + variant * 0.14);
            ctx.fillStyle = gradient(ctx, 0, -bow, 0, 15, ['#a15d89', '#4c3f68', '#254f64', '#21334f']);
            const frond = new Path2D();
            frond.moveTo(-3, 4);
            frond.quadraticCurveTo(length * 0.53, -bow, length, 3);
            frond.quadraticCurveTo(length * 0.52, -bow * 0.46, 0, 8);
            ctx.fill(frond);

            for (let leaf = 1; leaf <= 9; leaf++) {
                const t = leaf / 10;
                const px = length * t;
                const py = -2 * bow * t * (1 - t);
                const blade = (Math.sin(t * Math.PI) * 14 + 4) * (1 - t * 0.26);
                fillPolygon(ctx, [[px - 2, py], [px + blade * 0.72, py - blade], [px + 3, py + 2]], '#535179');
                fillPolygon(ctx, [[px - 1, py + 1], [px + blade, py + blade], [px + 3, py + 3]], '#347181');
            }
            ctx.beginPath();
            ctx.moveTo(2, 3);
            ctx.quadraticCurveTo(length * 0.53, -bow * 0.9, length, 3);
            ctx.strokeStyle = distant ? '#a86997' : '#efa081';
            ctx.lineWidth = 0.92;
            ctx.stroke();
            ctx.restore();
        }
        return surface;
    }

    function makeBanks(mobile) {
        const random = randomSequence(7028991);
        const sceneryPeriod = mobile ? 6 : 9;
        return [true, false].map(distant => {
            const objects = [];
            for (const side of [-1, 1]) {
                const sprites = [0, 1, 2, 3].map(i => makeBuilding(i, distant, side, mobile));
                sprites.push(makePalm(0, distant, side, mobile), makePalm(1, distant, side, mobile));
                for (let i = 0; i < sceneryPeriod; i++) {
                    const offset = (i + random() * 0.56) / sceneryPeriod;
                    const palm = i % 3 === (side === 1 ? 0 : 1);
                    const pick = palm ? 4 + (i % 2) : (i + (side === 1 ? 1 : 0)) % 4;
                    objects.push({ side, offset, palm, sprite: sprites[pick], size: 0.91 + random() * 0.29, inset: random() * 0.023 });
                }
            }
            // In cyclic phase order, the first visible object is always the farthest.
            objects.sort((a, b) => a.offset - b.offset);
            return { distant, objects };
        });
    }

    function makeScene(width, height, banks, mobile) {
        const portrait = width < height;
        const horizon = Math.round(height * (portrait ? 0.415 : 0.45));
        const radius = Math.min(width * 0.337, height * 0.218);
        const base = canvas(width + 2 * MARGIN, height + 2 * MARGIN);
        const ctx = base.getContext('2d', { alpha: false });
        ctx.translate(MARGIN, MARGIN);
        paintSky(ctx, width, height, horizon);
        paintWater(ctx, width, height, horizon, radius);

        const ridgeHeight = Math.min(height * 0.16, width * 0.21);
        const reflection = randomSequence(51336);
        const reflectionBands = mobile ? 12 : 32;
        const ripples = Array.from({ length: reflectionBands }, (_, i) => ({
            phase: (i + reflection() * 0.8) / reflectionBands,
            offset: reflection() - 0.5,
            length: 0.26 + reflection() * 0.66
        }));
        const twinkle = randomSequence(39223);
        const stars = Array.from({ length: 22 }, () => ({
            x: twinkle() * width,
            y: twinkle() * horizon * 0.59,
            phase: twinkle() * TAU,
            size: 0.65 + twinkle() * 1.15
        }));
        if (mobile) drawStars(ctx, stars, 0);
        return {
            width, height, horizon, radius, base, ripples, stars, banks, mobile, sunDim: 0, motion: null,
            sun: makeSun(radius),
            skyline: makeSkyline(width, Math.min(horizon * 0.59, width * 0.41), mobile),
            rear: makeMountains(width, ridgeHeight * 0.75, false),
            front: makeMountains(width, ridgeHeight, true)
        };
    }

    function drawWater(ctx, scene, distance, skyShift) {
        const { width, height, horizon, radius, ripples, mobile } = scene;
        const span = height + MARGIN - horizon;
        const rows = distance / 70;
        const rowPhase = rows - Math.floor(rows);
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        for (let i = 0; i < (mobile ? 12 : GRID_ROWS); i++) {
            const depth = 1 + (i + 1 - rowPhase) * 0.94;
            const progress = 1 / (depth * depth * 0.65 + 0.35);
            const y = horizon + span * progress;
            const bank = shoreOffset(width, progress) - 2;
            ctx.moveTo(width / 2 - bank, y);
            ctx.lineTo(width / 2 + bank, y);
        }
        ctx.strokeStyle = '#775382';
        ctx.globalAlpha *= 0.35;
        ctx.stroke();

        const phase = distance / 980;
        for (let i = 0; i < ripples.length; i++) {
            const ripple = ripples[i];
            const t = ripple.phase + phase * (i % 2 ? 1 : 2);
            const depth = t - Math.floor(t);
            const progress = depth * depth;
            const y = horizon + span * progress;
            const spread = radius * (0.56 + progress * 1.25);
            const x = width / 2 + skyShift * (1 + progress) + ripple.offset * spread;
            const len = spread * ripple.length * (0.35 + progress * 0.53);
            ctx.globalAlpha = Math.min(depth * 6, (1 - depth) * 7, 1) * (0.25 - 0.17 * progress);
            ctx.fillStyle = i % 4 === 0 ? '#ffb77b' : '#d25fa6';
            const thickness = 0.6 + progress * 1.65;
            ctx.fillRect(x - len / 2, y, len * 0.59, thickness);
            ctx.fillRect(x + len * 0.2, y, len * 0.3, thickness);
        }
    }

    function drawTraffic(ctx, scene, distance) {
        const { width, height, horizon, mobile } = scene;
        const span = height + MARGIN - horizon;
        ctx.lineCap = 'round';
        for (const side of [-1, 1]) {
            ctx.beginPath();
            for (let i = 0; i < (mobile ? 8 : 16); i++) {
                const flow = i % 2 ? -1 : 1;
                const t = i * 0.618 + distance * flow / (530 + (i % 4) * 62);
                const depth = t - Math.floor(t);
                if (depth < 0.065 || depth > 0.975) continue;
                const length = 0.013 + depth * 0.062;
                const tail = Math.max(0, Math.min(1, depth - length * flow));
                const inset = 0.95 - (i % 2) * 0.037;
                const x = width / 2 + side * shoreOffset(width, depth * depth) * inset;
                const tailX = width / 2 + side * shoreOffset(width, tail * tail) * inset;
                ctx.moveTo(x, horizon + span * depth * depth);
                ctx.lineTo(tailX, horizon + span * tail * tail);
            }
            ctx.globalAlpha = 0.16;
            ctx.strokeStyle = side === -1 ? '#58e8d4' : '#ee82c6';
            ctx.lineWidth = 4.2;
            ctx.stroke();
            ctx.globalAlpha = 0.58;
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    function drawHighwayMotion(ctx, scene, motion) {
        const { width, height, horizon, mobile } = scene;
        const span = height + MARGIN - horizon;
        const center = width / 2;
        const phase = motion.distance / 66;
        const offset = phase - Math.floor(phase);
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.34;
        for (const side of [-1, 1]) {
            ctx.strokeStyle = ROAD_EDGE_COLORS[side === -1 ? 0 : 1];
            ctx.beginPath();
            for (let i = 0; i < (mobile ? 8 : 14); i++) {
                const z = i + 1 - offset;
                const start = 1 / (1 + (z + 0.36) ** 2 * 0.39);
                const end = 1 / (1 + z ** 2 * 0.39);
                ctx.moveTo(center + side * highwayOffset(width, start) * 0.43, horizon + span * start);
                ctx.lineTo(center + side * highwayOffset(width, end) * 0.43, horizon + span * end);
            }
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        if (mobile && motion.wind < 0.5) return;

        // Streaks stay over the shoulders. Foreshortening and the fade keep the center clear.
        for (let i = 0; i < (mobile ? 8 : 18); i++) {
            const side = i % 2 === 0 ? -1 : 1;
            const t = i * 0.618 + motion.distance / (405 + (i % 4) * 53);
            const depth = t - Math.floor(t);
            const progress = depth * depth;
            const delta = (0.024 + 0.045 * motion.wind) * (0.66 + depth * 0.34);
            const tail = Math.max(0, depth - delta);
            const spread = 0.75 + (i % 5) * 0.055;
            const x = center + side * shoreOffset(width, progress) * spread;
            const tailX = center + side * shoreOffset(width, tail * tail) * spread;
            ctx.globalAlpha = smoothstep(depth / 0.2) * smoothstep((1 - depth) / 0.19)
                * (0.12 + 0.32 * motion.wind);
            ctx.strokeStyle = side === -1 ? '#74cfd8' : '#ee8dbf';
            ctx.lineWidth = 0.65 + progress * 0.85;
            ctx.beginPath();
            ctx.moveTo(tailX, horizon + span * tail * tail);
            ctx.lineTo(x, horizon + span * progress);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    function shipReflection(color) {
        const surface = canvas(160, 54);
        const ctx = surface.getContext('2d');
        ctx.translate(80, 27);
        ctx.scale(1, 0.33);
        const glow = ctx.createRadialGradient(0, -7, 2, 0, 0, 76);
        glow.addColorStop(0, color + '8c');
        glow.addColorStop(0.24, color + '46');
        glow.addColorStop(0.68, color + '14');
        glow.addColorStop(1, color + '00');
        ctx.fillStyle = glow;
        ctx.fillRect(-80, -81, 160, 162);
        const shadow = ctx.createRadialGradient(2, -25, 3, 2, -20, 33);
        shadow.addColorStop(0, '#070616ec');
        shadow.addColorStop(1, '#07061600');
        ctx.fillStyle = shadow;
        ctx.fillRect(-34, -58, 72, 76);
        return { color, surface };
    }

    function drawShipReflection(ctx, scene, player, color, time, overdrive) {
        if (scene.reflection?.color !== color) scene.reflection = shipReflection(color);
        const pulse = 0.5 + Math.sin(time * 11) * 0.5;
        const width = 143 + pulse * 10 + (overdrive ? 24 : 0);
        ctx.globalAlpha = 0.75 + pulse * 0.17;
        ctx.drawImage(scene.reflection.surface, player.x - width / 2 - scene.motion.bank * 11,
            player.y + 20 - 27, width, 54);
        ctx.globalAlpha = 1;
    }

    function drawStars(ctx, stars, time) {
        ctx.fillStyle = '#ddc6ff';
        for (const star of stars) {
            ctx.globalAlpha = 0.19 + 0.47 * (0.5 + 0.5 * Math.sin(time * 1.85 + star.phase));
            ctx.fillRect(star.x, star.y, star.size, star.size);
        }
        ctx.globalAlpha = 1;
    }

    function drawSkyline(ctx, scene, steer, distance, time) {
        const { width, horizon, skyline } = scene;
        const sway = Math.sin(distance / 880);
        for (let i = 0; i < skyline.layers.length; i++) {
            const { surface, lights, beacons } = skyline.layers[i];
            const x = -MARGIN - steer * (7 + i * 6) + sway * (2 + i * 3);
            const y = horizon - surface.height + 2;
            ctx.save();
            ctx.translate(x, y);
            ctx.drawImage(surface, 0, 0);
            for (const light of lights) {
                const cycle = time * light.rate + light.phase;
                const beat = cycle - Math.floor(cycle);
                const on = smoothstep((beat - 0.12) / 0.11) * smoothstep((0.79 - beat) / 0.18);
                if (on <= 0) continue;
                ctx.fillStyle = light.color;
                ctx.globalAlpha = on * 0.18;
                ctx.fillRect(light.x - 0.7, light.y - 0.65, light.width + 1.4, 2.55);
                ctx.globalAlpha = on * 0.91;
                ctx.fillRect(light.x, light.y, light.width + 0.45, 1.35);
            }
            ctx.fillStyle = '#ff657e';
            for (const beacon of beacons) {
                const pulse = 0.5 + 0.5 * Math.sin(time * 2.1 + beacon.phase);
                ctx.globalAlpha = 0.22 + 0.65 * pulse * pulse;
                ctx.fillRect(beacon.x - 0.8, beacon.y - 1.1, 1.6, 1.3);
            }
            ctx.restore();
        }
        const haze = skyline.atmosphere;
        ctx.drawImage(haze, -MARGIN, horizon - haze.height + 2, width + MARGIN * 2, haze.height);
    }

    function drawBank(ctx, scene, bank, distance, steer) {
        const { width, height, horizon } = scene;
        const { distant, objects } = bank;
        const span = height - horizon;
        const travel = distance / (distant ? 3100 : 1810);
        const phase = travel - Math.floor(travel);
        const wrapped = objects.findIndex(object => object.offset + phase >= 1);
        const first = wrapped === -1 ? 0 : wrapped;
        const scaleLimit = Math.min(height * 0.65, width * 0.59, 490);
        for (let i = 0; i < objects.length; i++) {
            const { side, offset, palm, sprite, size, inset } = objects[(first + i) % objects.length];
            const t = offset + phase;
            const depth = t - Math.floor(t);
            const perspective = depth * depth * (2 - depth);
            const y = horizon + span * perspective * (distant ? 0.64 : 1.18);
            const spriteHeight = scaleLimit * size * (distant ? 0.1 + perspective * 0.62 : 0.15 + perspective * 1.06);
            const spriteWidth = sprite.width * spriteHeight / sprite.height;
            const edge = width / 2 + side * width * (0.274 + inset + depth * (distant ? 0.16 : 0.20));
            const anchor = palm ? (side < 0 ? 0.71 : 0.29) : (side < 0 ? 0.89 : 0.11);
            const x = edge - spriteWidth * anchor - steer * (distant ? 8 : 16);
            const fade = smoothstep(depth / 0.17) * smoothstep((1 - depth) / 0.2);
            if (x > width + MARGIN || x + spriteWidth < -MARGIN || y - spriteHeight > height + MARGIN) continue;
            ctx.globalAlpha = fade * (distant ? 0.74 : 0.96);
            ctx.drawImage(sprite, x, y - spriteHeight, spriteWidth, spriteHeight);
        }
    }

    defineNeonDriftGameMethods({
        paintDriveDistantCity(ctx, width, height) {
            const horizon = height - 2;
            const skyline = makeSkyline(width, Math.max(1, Math.round(height * 0.38)), true);
            paintSky(ctx, width, height, height);
            paintGarageMoon(ctx, width, height);
            drawSkyline(ctx, { width, horizon, skyline }, 0, 0, 0);
        },

        drawDriveOutrunBackground(ctx) {
            const { width, height } = this;
            if (width <= 0 || height <= 0) return;
            const mobile = this.isMobileDevice();
            let scene = this.driveOutrunScene;
            if (!scene || scene.width !== width || scene.height !== height || scene.mobile !== mobile) {
                const banks = scene?.mobile === mobile ? scene.banks : makeBanks(mobile);
                scene = this.driveOutrunScene = makeScene(width, height, banks, mobile);
            }
            const runTime = this.runTime || 0;
            const targetDistance = this.driveSceneryDistance || 0;
            const targetSteer = Math.max(-1, Math.min(1, (this.player.x / width - 0.5) * 2));
            const targetWind = this.overdriveActive ? 1 : this.slowmoTimer > 0
                ? 0.1 : Math.min(0.73, 0.32 + Math.max(0, (this.difficulty || 1) - 1) * 0.09);
            if (!scene.motion || runTime < scene.motion.time || targetDistance < scene.motion.distance) {
                scene.motion = { time: runTime, distance: targetDistance, steer: targetSteer, bank: 0, wind: targetWind };
            }
            const motion = scene.motion;
            const elapsed = Math.max(0, Math.min(0.1, runTime - motion.time));
            motion.time = runTime;
            const follow = 1 - Math.exp(-elapsed * CAMERA_RESPONSE);
            motion.steer += (targetSteer - motion.steer) * follow;
            motion.distance += (targetDistance - motion.distance) * follow;
            motion.bank += ((this.player.tilt || 0) * 0.8 - motion.bank) * follow;
            motion.wind += (targetWind - motion.wind) * follow;
            const { distance, steer } = motion;
            const skyShift = -steer * Math.min(12, width * 0.019);
            const { horizon, base, rear, front, stars, banks } = scene;
            // Lower the disc's contrast during a boss fight so its HUD and laser remain distinct.
            const targetDim = this.driveBoss ? 0.56 : 0.06;
            scene.sunDim += (targetDim - scene.sunDim) * (1 - Math.exp(-elapsed * 8));

            ctx.save();
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = mobile ? 'low' : 'medium';
            ctx.drawImage(base, -MARGIN, -MARGIN);
            if (!mobile) drawStars(ctx, stars, runTime);
            drawWater(ctx, scene, distance, skyShift);
            drawTraffic(ctx, scene, distance);
            drawHighwayMotion(ctx, scene, motion);

            ctx.save();
            ctx.beginPath();
            ctx.rect(-MARGIN, -MARGIN, width + 2 * MARGIN, horizon + MARGIN);
            ctx.clip();
            drawSun(ctx, scene, skyShift, runTime);
            ctx.restore();

            ctx.drawImage(rear, -MARGIN - steer * 12, horizon - rear.height + 1);
            ctx.drawImage(front, -MARGIN - steer * 23, horizon - front.height + 1);
            drawSkyline(ctx, scene, steer, distance, runTime);
            if (this.state !== 'GAMEOVER') {
                const ship = this.getActiveShipConfig();
                const superForm = ship.superFormColor && (this.overdriveActive || this.getShipSuperDeployment() > 0);
                const color = superForm ? ship.superFormColor : this.overdriveActive ? '#a786ff' : ship.primary || '#00f3ff';
                drawShipReflection(ctx, scene, this.player, color, runTime, this.overdriveActive || superForm);
            }
            drawBank(ctx, scene, banks[0], distance, steer);
            drawBank(ctx, scene, banks[1], distance, steer);
            ctx.restore();
        }
    });
})();
