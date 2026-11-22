// Procedural boss artwork. Positions and animation offsets are local to the canvas.
const bossModels = (() => {
    const tau = Math.PI * 2;
    const recoilTime = 0.24;
    const impactTime = 0.24;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const path = data => new Path2D(data);

    const overlord = {
        hull: path('M-62-10 -52-19 -33-20 -24-26H24L33-20 52-19 62-10 61 12 54 26 42 22 34 25 26 18 16 27H-16L-26 18-34 25-42 22-54 26-61 12Z'),
        spine: path('M-23-24H23L30-16 26 8 18 21 11 26H-11L-18 21-26 8-30-16Z'),
        spineBevel: path('M-23-24H23L30-16 23-17 17-20H-17L-23-17-30-16Z'),
        armorInset: path('M-22-13-17-16H17L22-13 18 2 19 12 12 17H-12L-19 12-18 2Z'),
        sponson: path('M24-13 37-19 51-17 61-8 60 9 54 23 46 20 40 22 28 13Z'),
        shoulder: path('M29-13 38-17 50-15 58-8 56-2 35 1 28-4Z'),
        bevel: path('M29-13 38-17 50-15 58-8 52-7 46-12 37-13 29-9Z'),
        ram: path('M46 2 58-1 58 9 53 25 44 19 42 11Z'),
        ramBevel: path('M58-1V9L53 25 50 17 53 5Z'),
        vent: path('M36-10 46-11 51-7 48-3 36-2 33-6Z'),
        gills: path('M36-8 46-9M37-6 48-7M37-4 47-5'),
        cable: path('M20-11 26-8 30 0 41 2 46 8 M21-7 25-4 28 3 39 6 43 11'),
        barrel: path('M-7-8H7L9-4 8 5 5 8H-5L-8 5-9-4Z'),
        gate: path('M-5-4H0V6H-4L-6 3Z'),
        aft: path('M-7 4 -5-3H5L7 4 4 8H-4Z'),
        cracks: path([
            'M-54-13 -51-7 -53-1 -47 3 -48 8 -42 12 M-53-1 -57 3 -56 9 M-47 3 -42 1 -38 4',
            'M-58 13 -53 12 -51 16 -53 23 M-51 16 -47 17 -45 20 M-32-19 -34-12 -30-7 -32-2 -26 3 -27 9 M-30-7 -25-8 -22-5',
            'M-12-24 -10-20 -5-18 -7-13 -2-10 M-5-18 2-20 6-17 M-24 7 -19 9 -17 14 -19 18 -13 22 M-17 14 -12 15 -10 18',
            'M13-24 15-20 21-19 19-15 25-11 23-6 M19-15 16-16 13-12 M21 10 17 13 18 16 14 21 15 25',
            'M37-18 39-13 45-10 43-6 48-3 47 2 M45-10 51-11 54-8 M59 2 55 6 57 11 54 15 55 21',
            'M38 5 42 9 39 12 45 16 44 20 M42 9 47 9 49 13'
        ].join(' ')),
        seam: path('M-49 4 -52 10 -49 15 -52 20 M-23-13 -25-4 -21 7 -24 13 M-18-17 -14-20H-7 M7-20H14L18-17')
    };

    const architect = {
        keel: path('M0-28C14-28 25-21 30-12L33 4 27 15 14 24 0 28-14 24-27 15-33 4-30-12C-25-21-14-28 0-28Z'),
        upper: path('M5-26Q17-25 26-17L31-5 23-3 17-13 7-19Z'),
        lower: path('M30-1 28 13 20 21 9 25 13 17 21 10 24 2Z'),
        ribs: path('M8-22Q18-20 24-13L27-7 M27 3 24 12 15 19'),
        joint: path('M-6-11Q8-14 26-8L30 0 22 13 6 16-6 7Z'),
        backPetal: path('M-4-7Q9-25 26-23L35-18Q29-8 20-5L7 0Z'),
        backBevel: path('M-1-9Q12-23 26-23L35-18 25-19Q11-18-1-9Z'),
        frontPetal: path('M1 2Q16-6 26-5L36-10Q39 5 31 14L20 22 13 17Q21 8 15 7L6 11Z'),
        frontBevel: path('M2 2Q15-6 26-5L36-10 34-4 26-1Q15-2 2 2Z'),
        tip: path('M32 8 30 16 20 22 13 17 20 17Z'),
        veins: path('M2-8Q14-19 25-18L30-17 M4 5Q13-1 24 0L33-4 M21 17 28 11 31 6'),
        cell: path('M-4 0 -2-3H2L4 0 2 3H-2Z'),
        port: path('M-7-4 -3-6H3L7-4V3L4 6H-4L-7 3Z'),
        drone: path('M-2 1 0-2 2 1 0 0Z'),
        door: path('M-6-4Q-2-6 0-4V5L-4 6-6 3Z'),
        nozzle: path('M-5 4 -4-3H4L5 4 2 7H-2Z'),
        cracks: path([
            'M-16-24 -13-19 -17-15 -15-10 -21-6 -20-2 M-17-15 -22-15 -25-11',
            'M-31 2 -26 5 -27 9 -21 12 -22 16 -17 21 M-27 9 -30 11 M-21 12 -17 10 -14 13',
            'M12-26 11-22 17-18 15-13 20-9 23-10 M17-18 22-20 26-16',
            'M17 15 22 13 23 8 27 6 26 1 M23 8 19 7 18 4 M30 12 26 14 26 17',
            'M-11 15 -8 19 -10 24 -5 26 M-8 19 -3 18 1 21 5 19 7 23'
        ].join(' ')),
        leftWingCracks: path([
            'M10-19 13-15 12-11 16-8 14-6 M12-11 8-10 7-7 M27-23 25-18 28-15 27-11 M25-18 21-16',
            'M32-9 29-2 31 2 28 6 32 10 M28 6 23 5 20 7 M13-2 16 2 15 6 M20 21 22 16 27 14 27 11'
        ].join(' ')),
        rightWingCracks: path([
            'M17-23 19-18 16-15 19-12 18-8 M19-18 24-18 26-15 M31-21 29-16 32-13',
            'M25-6 23 0 25 4 21 8 23 12 19 18 M25 4 30 3 31-1 M23 12 29 11 31 13 M10-2 12 2 10 5 11 8'
        ].join(' '))
    };
    const petalArmor = new Path2D(architect.backPetal);
    petalArmor.addPath(architect.frontPetal);

    const purple = { glow: '#a56dff', bright: '#efdaff', dark: '#402379', charge: '#d88dff' };
    const teal = { glow: '#40d8ca', bright: '#c9fff2', dark: '#1d5d60', charge: '#6dfce6' };

    function paint(ctx, shape, fill, stroke, width = 1) {
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill(shape);
        }
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = width;
            ctx.stroke(shape);
        }
    }

    function metal(ctx, y1, y2, light, middle, shadow) {
        const gradient = ctx.createLinearGradient(0, y1, 0, y2);
        gradient.addColorStop(0, light);
        gradient.addColorStop(0.42, middle);
        gradient.addColorStop(1, shadow);
        return gradient;
    }

    function disc(ctx, x, y, radius, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, tau);
        ctx.fill();
    }

    function glow(ctx, x, y, radius, color, alpha) {
        if (alpha <= 0) return;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '00');
        ctx.save();
        ctx.globalAlpha *= alpha;
        disc(ctx, x, y, radius, gradient);
        ctx.restore();
    }

    function motionState(boss, drive) {
        const recoil = (boss.volleyTimer || 0) / recoilTime;
        const next = boss.attackIndex % 3;
        const warning = drive && boss.laserPhase === 'warning';
        const beam = drive && boss.laserPhase === 'firing';
        const ready = Math.abs(boss.y - boss.targetY) < (drive ? 22 : 24);
        const laserOnDeck = drive && next === 1;
        const lead = laserOnDeck ? 0.45 : 0.74;
        const windup = ready ? 1 - boss.attackTimer / lead : 0;
        const progress = Math.max(0, Math.min(1, warning ? 1 - boss.laserTimer / 1.15 : windup));
        const easedCharge = progress * progress * (3 - 2 * progress);
        const charge = warning ? 0.28 + easedCharge * 0.72 : easedCharge * (laserOnDeck ? 0.28 : 1);
        const beamPower = beam ? Math.min(1, boss.laserTimer / 0.14) : 0;
        const hit = boss.impact ? Math.max(0, 1 - boss.impact.age / impactTime) : 0;
        const scale = reducedMotion.matches ? 0.2 : 1;
        return {
            t: boss.pulse,
            motion: boss.pulse * scale,
            scale,
            charge: recoil || beam ? 0 : charge,
            beamPower,
            mode: warning || beam ? 1 : recoil ? boss.volleyMode : next,
            open: Math.max(charge, beamPower, Math.min(1, recoil * 1.75)),
            recoil,
            hit
        };
    }

    function positionModel(ctx, boss, state) {
        const { t, motion, recoil, hit, scale } = state;
        const x = boss.x + Math.sin(t * 12) * hit * 1.4 * scale;
        const y = boss.y + (Math.sin(motion * 0.63) * 1.65 - 3.2 * recoil * recoil
            + Math.cos(t * 15) * hit * 0.75) * scale;
        ctx.translate(x, y);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    function exhaust(ctx, x, y, width, state, theme) {
        const length = 10 + 2.2 * Math.sin(state.motion * 2.6 + x) + 2 * state.recoil;
        const jet = ctx.createLinearGradient(0, y, 0, y - length);
        jet.addColorStop(0, theme.bright);
        jet.addColorStop(0.38, theme.glow);
        jet.addColorStop(1, theme.glow + '00');
        ctx.fillStyle = jet;
        ctx.beginPath();
        ctx.moveTo(x - width, y);
        ctx.quadraticCurveTo(x - width * 0.65, y - length * 0.48, x, y - length);
        ctx.quadraticCurveTo(x + width * 0.65, y - length * 0.48, x + width, y);
        ctx.closePath();
        ctx.fill();
    }

    function rotor(ctx, y, radius, state, theme, orbital) {
        const pulse = 0.5 + Math.sin(state.t * 0.94) * 0.17;
        const power = Math.max(state.charge, state.beamPower);
        disc(ctx, 0, y, radius + 3.6, '#0c0c19');
        disc(ctx, 0, y, radius + 2.4, orbital ? '#907345' : '#59546d');
        disc(ctx, 0, y, radius + 1.2, '#101521');
        disc(ctx, 0, y, radius - 1.5, theme.dark);
        glow(ctx, 0, y, radius + 3, theme.glow, 0.49 + power * 0.35);

        ctx.save();
        ctx.translate(0, y);
        const angle = state.motion * 0.52;
        ctx.strokeStyle = theme.glow;
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        for (let k = 0; k < 3; k++) {
            const start = angle + k * tau / 3;
            ctx.moveTo(Math.cos(start) * radius, Math.sin(start) * radius);
            ctx.arc(0, 0, radius, start, start + 1.12);
        }
        ctx.stroke();
        ctx.strokeStyle = theme.bright;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius - 1, radius * (orbital ? 0.44 : 0.73), -angle * 0.87, 0, tau);
        ctx.stroke();
        glow(ctx, 0, 0, radius * 0.78, theme.bright, pulse + power * 0.28);
        disc(ctx, 0, 0, radius * (0.23 + pulse * 0.12 + power * 0.17), theme.bright);
        ctx.restore();
    }

    function chargeParticles(ctx, x, y, open, state, theme) {
        if (open < 0.1) return;
        glow(ctx, x, y, 6 + open * 8, theme.charge, 0.72 * open);
        ctx.save();
        ctx.globalAlpha *= open;
        ctx.strokeStyle = theme.bright;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const phase = (state.motion * 0.82 + i * 0.28) % 1;
            const angle = Math.PI * (0.05 + i * 0.225);
            const dist = 3 + 9 * (1 - phase);
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            ctx.moveTo(x + dx * dist, y + dy * dist);
            ctx.lineTo(x + dx * (dist + 0.8 + open), y + dy * (dist + 0.8 + open));
        }
        ctx.stroke();
        ctx.restore();
    }

    function weaponPort(ctx, x, y, state, active, theme, isDrive) {
        ctx.save();
        const travel = active ? state.open * 4.4 : 0;
        ctx.translate(x, y - (active ? state.recoil * state.scale * 3 : 0));
        const shell = isDrive ? overlord.barrel : architect.port;
        const door = isDrive ? overlord.gate : architect.door;
        const body = isDrive ? '#373447' : '#775b3a';
        const edge = isDrive ? '#86718f' : '#d4a862';
        if (!isDrive) ctx.scale(0.86, 0.72);
        paint(ctx, shell, '#0d101c', edge, 1.1);
        if (active) {
            chargeParticles(ctx, 0, 1, state.charge, state, theme);
            if (state.recoil > 0.62) {
                glow(ctx, 0, 4, 10, theme.charge, state.recoil * 0.8);
                disc(ctx, 0, 3, state.recoil * 2.4, theme.bright);
            }
        }
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            ctx.translate(-travel, 0);
            paint(ctx, door, body, edge, 0.8);
            ctx.restore();
        }
        if (travel > 0.2) {
            ctx.strokeStyle = theme.bright;
            ctx.lineWidth = 0.65 + Math.max(state.charge, state.beamPower) * 1.65;
            ctx.beginPath();
            ctx.moveTo(-travel * 0.68, 1);
            ctx.lineTo(travel * 0.68, 1);
            ctx.stroke();
        }
        ctx.restore();
    }

    function damageSmoke(ctx, boss, state, x, y) {
        if (boss.hp >= boss.maxHp * 0.4) return;
        for (let i = 0; i < 4; i++) {
            const drift = (state.motion * 0.21 + i * 0.25) % 1;
            const dx = x + Math.sin(drift * 4) * 4;
            const dy = y - drift * 17;
            glow(ctx, dx, dy, 3 + drift * 8, '#221b2e', (1 - drift) * 0.76);
            glow(ctx, dx + 1, dy - 1, 2.5 + drift * 7, '#a69ab2', (1 - drift) * 0.42);
        }
    }

    function armorCracks(ctx, cracks, armor, edge) {
        ctx.save();
        ctx.clip(armor);
        paint(ctx, cracks, null, '#0b0b15', 2.25);
        paint(ctx, cracks, null, edge, 0.8);
        ctx.restore();
    }

    function shortCircuit(ctx, state, x, y) {
        const flash = Math.pow(Math.max(0, Math.sin(state.t * 2.6)), 12);
        ctx.save();
        ctx.globalAlpha *= flash;
        ctx.strokeStyle = '#ffe2a6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 2, y + 2);
        ctx.lineTo(x + 3, y - 3);
        ctx.lineTo(x + 1, y - 5);
        ctx.lineTo(x + 9, y - 8);
        ctx.stroke();
        ctx.restore();
    }

    function armorFlash(ctx, hit, x, y, ...plates) {
        const radius = 46 + (1 - hit) * 22;
        const tint = ctx.createRadialGradient(x, y, 0, x, y, radius);
        tint.addColorStop(0, '#ff2238c6');
        tint.addColorStop(0.42, '#ff16378c');
        tint.addColorStop(1, '#b6113345');
        ctx.save();
        ctx.globalAlpha *= Math.pow(hit, 1.35);
        ctx.fillStyle = tint;
        for (const plate of plates) ctx.fill(plate);
        ctx.restore();
    }

    function impactSparks(ctx, boss, state) {
        if (state.hit <= 0) return;
        const { x, y } = boss.impact;
        const age = 1 - state.hit;
        const flash = Math.min(1, boss.flashTimer * 17);
        glow(ctx, x, y, 7 + age * 4, '#ffad83', flash);
        ctx.save();
        ctx.globalAlpha *= state.hit;
        ctx.lineWidth = 1.15;
        for (let i = 0; i < 7; i++) {
            const theta = i * 2.4;
            const dx = Math.cos(theta);
            const dy = Math.sin(theta);
            const distance = 2 + age * (14 + i * 2) * state.scale;
            ctx.strokeStyle = i % 3 === 0 ? '#ffb16f' : '#ffedd0';
            ctx.beginPath();
            ctx.moveTo(x + dx * distance, y + dy * distance);
            ctx.lineTo(x + dx * (distance + 2 + i * 0.44), y + dy * (distance + 2 + i * 0.44));
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawOverlord(ctx, boss) {
        const state = motionState(boss, true);
        const damaged = boss.hp < boss.maxHp * 0.4;
        ctx.save();
        positionModel(ctx, boss, state);
        const steel = metal(ctx, -23, 22, '#77768e', '#3b394f', '#171524');
        const ram = metal(ctx, -3, 24, '#676781', '#383445', '#181724');
        const heat = 0.58 + 0.29 * Math.sin(state.t * 1.2);

        for (const x of [-40, -15, 15, 40]) exhaust(ctx, x, Math.abs(x) === 40 ? -20 : -24, 3.1, state, purple);
        damageSmoke(ctx, boss, state, 48, -16);
        paint(ctx, overlord.hull, '#141323', '#090814', 2.8);
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            ctx.save();
            ctx.translate(40, -20);
            paint(ctx, overlord.aft, '#383348', '#787087');
            ctx.restore();
            paint(ctx, overlord.sponson, '#242134', '#605471');
            paint(ctx, overlord.shoulder, steel, '#252139');
            paint(ctx, overlord.bevel, '#8e809a', null);
            paint(ctx, overlord.ram, ram, '#716079');
            paint(ctx, overlord.ramBevel, '#a18da6', null);
            paint(ctx, overlord.vent, '#120e20', '#85718e', 0.75);
            ctx.save();
            ctx.globalAlpha *= heat;
            paint(ctx, overlord.gills, null, '#ffac82', 0.95);
            ctx.restore();
            paint(ctx, overlord.cable, null, '#0f0d1d', 3.9);
            paint(ctx, overlord.cable, null, '#b147ed', 1.35);
            disc(ctx, 52, 2, 1.35, '#b9adbd');
            disc(ctx, 56, -8, 1.1, '#d2b7cd');
            ctx.restore();
        }
        paint(ctx, overlord.spine, steel, '#14101d', 2);
        paint(ctx, overlord.armorInset, metal(ctx, -16, 18, '#58536d', '#262435', '#11121f'), '#635871', 0.8);
        paint(ctx, overlord.spineBevel, '#9991a8', null);
        paint(ctx, overlord.seam, null, '#a295ac', 0.7);
        if (state.hit > 0) armorFlash(ctx, state.hit, boss.impact.x, boss.impact.y, overlord.hull);
        if (damaged) armorCracks(ctx, overlord.cracks, overlord.hull, '#ff9a76');
        rotor(ctx, -2, 11, state, purple, false);
        for (const x of [-33, -11, 11, 33]) {
            weaponPort(ctx, x, 17, state, state.mode === 0 || (state.mode === 2 && Math.abs(x) === 33), purple, true);
        }
        if (state.mode === 1 && state.open > 0.08) {
            ctx.save();
            ctx.translate(0, 15);
            ctx.scale(0.66, 0.58);
            weaponPort(ctx, 0, 0, state, true, purple, true);
            ctx.restore();
        }
        if (damaged) shortCircuit(ctx, state, 42, 9);
        impactSparks(ctx, boss, state);
        ctx.restore();
    }

    function drawArchitect(ctx, boss) {
        const state = motionState(boss, false);
        const damaged = boss.hp < boss.maxHp * 0.4;
        ctx.save();
        positionModel(ctx, boss, state);
        const crown = metal(ctx, -26, 23, '#ffe1a1', '#ac7c44', '#473021');
        const wing = metal(ctx, -20, 22, '#e9c488', '#b2864f', '#573823');
        const breath = Math.sin(state.motion * 0.68) * 0.095 * state.scale;
        const wingAngle = breath - state.open * 0.17;
        const wingSpread = state.open * 1.9;

        damageSmoke(ctx, boss, state, 51, -14);
        for (const side of [-1, 1]) {
            exhaust(ctx, side * 17, -23, 2.5, state, teal);
            exhaust(ctx, side * 30, -18, 2.1, state, teal);
            ctx.save();
            ctx.scale(side, 1);
            ctx.translate(30, 0);
            ctx.rotate(wingAngle);
            ctx.translate(wingSpread, 0);
            ctx.save();
            ctx.translate(0, -17);
            paint(ctx, architect.nozzle, '#5c502f', '#bf9d66');
            ctx.restore();
            paint(ctx, architect.joint, '#12272c', '#63968d', 0.9);
            paint(ctx, architect.backPetal, wing, '#211b26', 2.4);
            paint(ctx, architect.backBevel, '#f2d39a', null);
            paint(ctx, architect.frontPetal, wing, '#211b26', 2.4);
            paint(ctx, architect.frontBevel, '#e5ba79', null);
            paint(ctx, architect.tip, '#a67947', '#e7bb79', 0.8);
            if (state.hit > 0) {
                // Convert the impact into the mirrored wing's animated local space.
                const dx = side * boss.impact.x - 30;
                const dy = boss.impact.y;
                const x = dx * Math.cos(wingAngle) + dy * Math.sin(wingAngle) - wingSpread;
                const y = dy * Math.cos(wingAngle) - dx * Math.sin(wingAngle);
                armorFlash(ctx, state.hit, x, y, architect.backPetal, architect.frontPetal, architect.tip);
            }
            paint(ctx, architect.veins, null, '#245155', 2.7);
            paint(ctx, architect.veins, null, '#71e5d0', 0.8);
            if (damaged) {
                const cracks = side < 0 ? architect.leftWingCracks : architect.rightWingCracks;
                armorCracks(ctx, cracks, petalArmor, '#f9c17d');
            }
            for (const [i, x, y] of [[0, 12, -8], [1, 20, -10], [2, 27, -13]]) {
                ctx.save();
                ctx.translate(x, y);
                paint(ctx, architect.cell, '#111d27', '#a38c5f', 0.75);
                ctx.translate(0, Math.sin(state.motion * 1.4 + i * 2) * 0.55);
                paint(ctx, architect.drone, i === 1 ? '#d4ffee' : '#55b8aa', null);
                ctx.restore();
            }
            ctx.restore();
        }
        paint(ctx, architect.keel, '#183135', '#0c1420', 2);
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            paint(ctx, architect.upper, crown, '#ebc581', 0.65);
            paint(ctx, architect.lower, crown, '#cdab70', 0.8);
            paint(ctx, architect.ribs, null, '#89e7ce', 0.78);
            ctx.restore();
        }
        if (state.hit > 0) armorFlash(ctx, state.hit, boss.impact.x, boss.impact.y, architect.keel);
        if (damaged) armorCracks(ctx, architect.cracks, architect.keel, '#f9c17d');
        rotor(ctx, -2, 13, state, teal, true);
        for (const x of [-40, -20, 0, 20, 40]) {
            const inner = Math.abs(x) === 20;
            const outer = Math.abs(x) === 40;
            const active = state.mode === 0 || (state.mode === 1 && inner) || (state.mode === 2 && outer);
            const shift = active && state.mode !== 0 ? Math.sign(x) * (inner ? 6 : 2) * state.open : 0;
            weaponPort(ctx, x - shift, outer ? 18 : 22, state, active, teal, false);
        }
        if (damaged) shortCircuit(ctx, state, 23, 8);
        impactSparks(ctx, boss, state);
        ctx.restore();
    }

    return {
        drawOverlord,
        drawArchitect,
        fired(boss, mode) {
            boss.volleyMode = mode;
            boss.volleyTimer = recoilTime;
        },
        hit(boss, x, y, flashTime) {
            boss.flashTimer = flashTime;
            boss.impact = {
                x: Math.max(-boss.w * 0.4, Math.min(boss.w * 0.4, x - boss.x)),
                y: Math.max(-boss.h * 0.32, Math.min(boss.h * 0.36, y - boss.y)),
                age: 0
            };
        },
        update(boss, dt, attackDt) {
            if (boss.flashTimer > 0) boss.flashTimer = Math.max(0, boss.flashTimer - dt);
            if (boss.volleyTimer > 0) boss.volleyTimer = Math.max(0, boss.volleyTimer - attackDt);
            if (!boss.impact) return;
            boss.impact.age += dt;
            if (boss.impact.age >= impactTime) boss.impact = null;
        }
    };
})();
