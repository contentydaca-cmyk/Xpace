// Shared silhouettes and palettes for the in-flight effects and shop icons.
const trailCenter = () => 0;
const trailWave = (amplitude, cycles, phaseOffset = 0) => (age, phase) =>
    Math.sin(phase + age * cycles + phaseOffset) * amplitude * (0.2 + age * 0.8);
const trailFan = (start, end) => age => start + (end - start) * age;
const trailArc = (amplitude, bias = 0) => age => bias * age + Math.sin(age * Math.PI) * amplitude;
const trailStairs = (amplitude, step) => (age, phase, seq) =>
    (Math.floor(seq / step) % 3 - 1) * amplitude * (0.45 + age * 0.55);
const trailLane = (color, width, flow = trailCenter, period = 0) => ({ color, width, flow, period });
const trailGlyph = (body, detail, color) => ({ body, detail, color });
const rainbowRiftFlow = (age, phase) => Math.asin(Math.sin(phase * 0.8 - age * 3.2)) * (1.8 + 7.5 * age);

const trailGlint = (ctx, x, y, size) => {
    ctx.moveTo(x, y - size * 1.9);
    ctx.lineTo(x + size * 0.6, y - size * 0.38);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size * 0.45, y + size * 0.36);
    ctx.lineTo(x, y + size * 1.35);
    ctx.lineTo(x - size * 0.5, y + size * 0.35);
    ctx.lineTo(x - size, y);
    ctx.lineTo(x - size * 0.5, y - size * 0.4);
    ctx.closePath();
};
const trailEmber = (ctx, x, y, size) => {
    ctx.moveTo(x + size * 0.8, y - size * 2);
    ctx.lineTo(x + size * 0.7, y + size * 0.45);
    ctx.lineTo(x - size, y + size);
    ctx.closePath();
};
const trailBubble = (ctx, x, y, size) => {
    ctx.moveTo(x + size, y);
    ctx.ellipse(x, y, size, size * 0.85, 0, 0, Math.PI * 2);
    ctx.moveTo(x + size * 0.53, y);
    ctx.ellipse(x, y, size * 0.53, size * 0.48, 0, 0, Math.PI * 2, true);
};

const TRAIL_ART = new Map(Object.entries({
    cyan_plasma: {
        ink: ['#164a9c', '#16c9ff', '#ddffff'], span: 44,
        lanes: [trailLane('#1664ff', 9), trailLane('#38f6ff', 2.6, trailWave(3.5, 7))],
        marks: [trailGlyph('M0-10 3-2 6 1 2 3 0 9-2 3-6 1-3-2Z', 'M0-5V4 M-3 1H3')],
        stride: 17, size: 0.62, growth: -0.36, spin: 0.35
    },
    vhs_sunset: {
        ink: ['#511d89', '#ff52ad', '#fff1be'], span: 67,
        lanes: [trailLane('#00ead8', 4.4, trailWave(9, 7)), trailLane('#ff297c', 5.4, trailWave(9, 7, Math.PI))],
        marks: [trailGlyph('M-9 1A9 9 0 0 1 9 1Z M-8 3H8L6 5H-6Z M-5 7H5L2 9H-2Z', 'M-6-2Q0-8 6-2')],
        stride: 24, size: 0.85, drift: trailWave(6, 6), spin: 0.22
    },
    acid_lime: {
        ink: ['#467812', '#a8ef20', '#efff9c'], span: 53,
        lanes: [trailLane('#578911', 12, trailWave(4, 14)), trailLane('#bfff30', 2.3, trailWave(3, 19), 7)],
        flecks: { step: 5, spread: 17, shape: trailBubble, color: '#cafa55' },
        marks: [trailGlyph('M-9 1-3-4 1-9 2-3 8-5 5 1 10 3 4 5 0 9-3 5Z', 'M-5 1-1 1 2-4 M-2 5 2 2 5 2')],
        stride: 13, size: 0.82, growth: 0.35, drift: trailStairs(10, 7), spin: 1.2
    },
    blood_dragon: {
        ink: ['#730d41', '#ff356e', '#ffe1ad'], span: 37,
        lanes: [trailLane('#a41447', 12, trailWave(6, 7), 17), trailLane('#ff4769', 4, trailWave(2, 6), 17)],
        marks: [trailGlyph('M-11-2H-5L-2-10 1 0 4-5 6-2H11L6 3H4L0 10-3 0-5 3H-9Z', 'M-9 0H-4L-2-5 0 5 4-2H8')],
        stride: 22, size: 1.08, growth: 0.42
    },
    rainbow: {
        ink: ['#3d186d', '#ff75c8', '#fdfff5'], span: 75,
        icon: `<svg width="26" height="26" viewBox="-14 -14 28 28" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M-10 9-2 2-6-2 5-11 3-4 8-2 0 5 3 7-5 12Z" fill="#3d186d" stroke="#7966e9" stroke-width="1.3"/><path d="M-10 9-4 4-6-2 1-8" stroke="#ff549f" stroke-width="1.8"/><path d="M1-8 5-11 3-4 8-2" stroke="#ffcb60" stroke-width="1.8"/><path d="M8-2 0 5 3 7-5 12" stroke="#76e7cf" stroke-width="1.8"/><path d="M6-7-1-1 2 1-5 7" stroke="#fcffff" stroke-width="1.2"/></svg>`,
        lanes: [
            trailLane(['#fa3698', '#ff9c4b', '#ffe670', '#80f1ac', '#9677ff'], 5.8,
                (age, phase) => rainbowRiftFlow(age, phase) - 2.5 - 7 * age),
            trailLane(['#75deff', '#6963ed', '#d178fb', '#ff539c', '#ff964c'], 5.2,
                (age, phase) => rainbowRiftFlow(age, phase) + 2.5 + 7 * age),
            trailLane('#edfcff', 1.7, rainbowRiftFlow, 13)
        ],
        marks: [
            trailGlyph('M-10 5-4-1-6-4 5-11 2-4 7-3 1 2 4 4-6 11-4 5Z M8 5 12 2 11 7Z',
                'M-9 5-1 1-3-3 5-11 M1 2-1 5-6 11', '#ff91bc'),
            trailGlyph('M-8-8-2-5 2-7 7-2 2 2 5 4-3 11-1 4-5 1-2-2Z M-9 1-6 3-10 6Z',
                'M-8-8-3-3 2-4 5-1 M2 1 0 5-3 10', '#82e9ff')
        ],
        flecks: { step: 6, spread: 19, shape: trailGlint, color: '#d6c0ff' },
        stride: 17, size: 0.9, growth: -0.18, drift: rainbowRiftFlow, spin: 0.38
    },
    glitch: {
        ink: ['#252752', '#45ffe3', '#f7fbff'], span: 38,
        lanes: [trailLane('#3ee6ff', 3, trailStairs(10, 5), 8), trailLane('#ff377e', 2.8, trailStairs(-13, 7), 11)],
        marks: [trailGlyph('M-11-6H5V-3H-11Z M-3-1H12V2H-3Z M-9 4H5V7H-9Z', 'M-8-4H1 M1 1H8 M-6 6H0'),
            trailGlyph('M-8-7H3V-4H-8Z M-12-2H9V1H-12Z M2 3H10V7H2Z', 'M-4-6H1 M-8 0H2 M5 5H8', '#ff487c')],
        stride: 12, size: 0.88, drift: trailStairs(9, 3)
    },
    pixel_tail: {
        ink: ['#303e99', '#7dd2ff', '#eaff94'], span: 51,
        lanes: [trailLane('#5c94ff', 3, trailStairs(6, 12), 6)],
        marks: [trailGlyph('M-8-4H-4V-8H0V-4H5V1H2V6H-3V3H-8Z M6 3H10V7H6Z M-10 7H-7V10H-10Z', 'M-6-2H-3V-4H1 M-6 1H-4 M7 4H9'),
            trailGlyph('M-6-7H1V-4H5V4H1V7H-5V3H-8V-3H-6Z M7-7H10V-4H7Z', 'M-4-3H1V2H-4Z M-2 5H0', '#acfb53')],
        stride: 14, size: 0.84, drift: trailStairs(11, 14), growth: -0.38
    },
    neon_heart: {
        ink: ['#801974', '#ff55b4', '#fff0f9'], span: 63,
        lanes: [trailLane('#f6339f', 2.8, trailWave(11, 8)), trailLane('#754eff', 2.1, trailWave(7, 8, Math.PI))],
        marks: [trailGlyph('M0 8C-4 4-11 0-10-5-9-11-3-11 0-6 3-11 9-11 10-5 11 0 4 4 0 8Z', 'M-7-4Q-6-8-3-6 M1 4Q7 0 7-4')],
        stride: 19, size: 0.95, growth: 0.22, drift: trailWave(13, 5), spin: 0.55
    },
    void: {
        ink: ['#060412', '#7339d3', '#e6bdff'], span: 47,
        lanes: [trailLane('#6d42e3', 6.3, trailArc(-14, -7)), trailLane('#a336d2', 2.6, trailArc(16, 8))],
        marks: [trailGlyph('M-7 0a7 7 0 1 1 14 0A7 7 0 1 1-7 0Z', 'M10-3C14 0 7 5 0 5-8 5-13 3-10 0 M-9-3Q-4-8 3-6 M6 7 9 6')],
        stride: 25, size: 1.12, growth: 0.78, spin: 0.65, solid: true
    },
    cleopatra_42: {
        icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="18" rx="4" fill="#d97706" stroke="#fde047" stroke-width="1.8"/><circle cx="6.5" cy="7" r="1.4" fill="#291506"/><circle cx="17.5" cy="7.5" r="1.5" fill="#291506"/><circle cx="6" cy="17" r="1.3" fill="#291506"/><circle cx="18" cy="16.5" r="1.4" fill="#291506"/><text x="12" y="15.5" text-anchor="middle" font-family="Exo 2, sans-serif" font-weight="900" font-size="10.5" fill="#fef08a" stroke="#291506" stroke-width="0.9">42</text></svg>`
    },
    neon_binary: {
        ink: ['#13534d', '#3ce8b6', '#d1ffaf'], span: 59,
        lanes: [trailLane('#12bc96', 1.7, trailFan(-5, -9), 11), trailLane('#aceb51', 1.55, trailFan(4, 11), 7)],
        marks: [trailGlyph('M-8-7H8V6L5 9H-8Z', 'M-5-4H-1V3H-5Z M2-2 4-4V3 M2 3H6 M-6 6H-2 M0 6H5'),
            trailGlyph('M-8-7H8V6L5 9H-8Z', 'M-6-2-4-4V3 M-6 3H-2 M1-4H5V3H1Z M-6 6H2', '#a3e546')],
        stride: 13, size: 0.81, drift: trailStairs(7, 13)
    },
    cryo_frost: {
        ink: ['#2f4fb4', '#77e8ff', '#f0fbff'], span: 64,
        lanes: [trailLane('#3c79cc', 7, trailWave(5, 3)), trailLane('#a0f3ff', 1.9, trailFan(-4, -13), 9)],
        flecks: { step: 4, spread: 23, shape: trailGlint, color: '#adf7ff' },
        marks: [trailGlyph('M0-11 2-6 7-8 6-3 11 0 6 2 8 7 3 6 0 11-2 6-7 8-6 3-11 0-6-2-8-7-3-6Z', 'M0-8V8 M-7-4 7 4 M-7 4 7-4 M0-3 3 0 0 3-3 0Z')],
        stride: 19, size: 0.92, drift: trailWave(14, 8), spin: 1.4
    },
    requiem_skulls: {
        icon: `<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M6 15C-2-2 28-2 20 15L18 17V23H8V17Z" fill="#aa2440" stroke="#ff798d"/><path d="M10 19V23M13 19V23M16 19V23" stroke="#2b0916"/><ellipse cx="9" cy="11" rx="3" ry="3.5" fill="#260914"/><ellipse cx="17" cy="11" rx="3" ry="3.5" fill="#260914"/><path d="M13 14L11 17H15Z" fill="#260914"/></svg>`
    },
    text42: {
        icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="4" fill="rgba(255,214,10,0.12)" stroke="#ffd60a" stroke-width="1.5"/><text x="12" y="15.6" text-anchor="middle" font-family="Exo 2, sans-serif" font-weight="900" font-size="10" fill="#ff0a78">42</text><text x="10.6" y="14.2" text-anchor="middle" font-family="Exo 2, sans-serif" font-weight="900" font-size="10" fill="#00f5d4" opacity="0.8">42</text></svg>`
    },
    // These six keys are stored verbatim in older local and cloud saves.
    'rgba(45, 212, 191, ': {
        ink: ['#0d576a', '#41e1c5', '#dfffee'], span: 71,
        lanes: [trailLane('#28a098', 2.8, trailFan(-4, -13)), trailLane('#53ffdc', 2.8, trailFan(4, 13))],
        marks: [trailGlyph('M-11-1a11 5 0 1 0 22 0a11 5 0 1 0-22 0Z M-7-1a7 2.4 0 1 0 14 0a7 2.4 0 1 0-14 0Z', 'M-8-3Q0-7 8-3 M-6 5Q0 9 6 5')],
        stride: 17, size: 0.83, growth: 0.68, spin: 0.32
    },
    'rgba(251, 146, 60, ': {
        ink: ['#8b361d', '#f69c51', '#fff0bb'], span: 43,
        lanes: [trailLane('#a35029', 5.6, trailFan(-5, -11), 9), trailLane('#fbb36c', 3.9, trailFan(5, 9), 9)],
        marks: [trailGlyph('M-5-10-12 1-7 0-10 9-2-3-7-2Z M4-10-3 2 3 0 0 10 11-4 5-1Z', 'M-6-5-9-1 M3-3 1 0 M4 3 8-2')],
        stride: 15, size: 0.93, drift: trailStairs(5, 15), spin: 0.42
    },
    'rgba(167, 139, 250, ': {
        ink: ['#49228a', '#ac87ff', '#f8e7ff'], span: 77,
        lanes: [trailLane('#7e46ff', 6.8, trailWave(12, 11)), trailLane('#d3b0ff', 1.6, trailWave(10, 11, Math.PI))],
        marks: [trailGlyph('M9-5Q10 4 1 7-4 9-11 6-2 4-3 0-7-4-3-8 4-12 9-5Z', 'M4-6A3 3 0 1 0 0-1 M2 4Q-1 7-7 7')],
        stride: 19, size: 0.93, growth: -0.23, drift: trailArc(9, -12), spin: 2
    },
    'rgba(56, 189, 248, ': {
        ink: ['#164b80', '#57c5f5', '#ddf9ff'], span: 61,
        lanes: [trailLane('#2b8dc8', 2.5, trailArc(-10, -9)), trailLane('#79ddff', 1.8, trailArc(10, 9))],
        marks: [trailGlyph('M-8 9Q-6-7 8-10Q10-2 4 1L0 1 3 3Q-1 8-8 9Z', 'M-8 10 5-7 M-4 5-3-1 M0 2 4-3')],
        stride: 13, size: 0.93, drift: trailFan(5, 15), spin: 0.65, alternate: true
    },
    'rgba(163, 230, 53, ': {
        ink: ['#3c4522', '#9bbf46', '#f5ffbd'], span: 34,
        lanes: [trailLane('#71872a', 5.8, trailFan(-6, -7), 10), trailLane('#b4e14a', 2.8, trailFan(6, 7), 10)],
        marks: [trailGlyph('M-10-4-5-9H5L10-4V4L5 9H-5L-10 4Z M-4-3H4V3H-4Z', 'M-7-4-4-7H4L7-4 M-7 4-4 7H4L7 4 M0-2V2')],
        stride: 16, size: 0.9, growth: -0.24
    },
    'rgba(250, 204, 21, ': {
        ink: ['#9f5312', '#ffca3d', '#fff5bc'], span: 57,
        lanes: [trailLane('#eba627', 1.8), trailLane('#fc7b28', 2.8, trailArc(12), 9)],
        marks: [trailGlyph('M-12 2Q-3-10 12-5 5-5-2 1-8 8-12 2Z M-8 9Q1 9 7 2 7 10-1 11Z', 'M-10 2Q-3-6 8-5 M-3 8Q2 6 5 3')],
        stride: 16, size: 1.03, growth: 0.66, spin: 0.9
    },
    crimson_slash: {
        ink: ['#75185f', '#ff428c', '#ffe4ed'], span: 57,
        lanes: [trailLane('#b92766', 5.8, trailArc(-7, -7), 10), trailLane('#f52e76', 2.6, trailArc(7, 7), 10)],
        marks: [trailGlyph('M-10 6 0-10 8-3 0 7Z M4 10 10 1 12 4 8 10Z', 'M-7 4 0-8 3-2 0 5 M1-1 7-3')],
        stride: 17, size: 0.91, drift: trailStairs(8, 17), spin: 0.7
    },
    solar_gold: {
        ink: ['#a45412', '#ffc321', '#fff7b9'], span: 69,
        lanes: [trailLane('#ec9022', 7.7, trailWave(3, 5)), trailLane('#ffe27a', 1.7, trailWave(5, 11), 8)],
        marks: [trailGlyph('M0-11 2-4 8-7 5-2 11 0 5 2 8 7 2 5 0 11-2 5-8 7-5 2-11 0-5-2-8-7-2-4Z', 'M0-5 2-2 5 0 2 2 0 5-2 2-5 0-2-2Z M-9-8-7-6 M7 6 9 8')],
        stride: 19, size: 0.96, growth: 0.1, spin: 1.7
    },
    matrix_code: {
        ink: ['#0d4e2d', '#55ed7b', '#dbffbe'], span: 90,
        lanes: [trailLane('#27c769', 1.25, trailFan(-5, -12), 13), trailLane('#3ed886', 1.15, trailFan(5, 12), 6), trailLane('#145e37', 4.2)],
        marks: [trailGlyph('M-7-10H7V-8H-7Z M-7 7H7V9H-7Z', 'M-5-6H-2V0H-5Z M1-4 3-6V0 M-4 2-2 1V6 M1 1H4V6H1Z'),
            trailGlyph('M-7-10H7V-8H-7Z M-7 7H7V9H-7Z', 'M-4-4-2-6V0 M1-6H4V0H1Z M-5 1H-2V6H-5Z M1 2 3 1V6', '#2cdfba')],
        stride: 14, size: 0.89, drift: trailStairs(8, 14), growth: -0.26
    },
    imperial_crown: {
        ink: ['#634091', '#ffcf5e', '#fff5d1'], span: 58,
        lanes: [trailLane('#9d52df', 8, trailWave(5, 3)), trailLane('#f0b956', 1.8, trailFan(-2, -12)), trailLane('#f0b956', 1.8, trailFan(2, 12))],
        marks: [trailGlyph('M-11-6-5-2 0-10 5-2 11-6 8 4H-8Z M-8 6H8L6 9H-6Z', 'M0-5 2-2 0 1-2-2Z M-7 2H7 M-10-9H-8 M8-9H10')],
        stride: 25, size: 1.02, growth: 0.18, spin: 0.34
    },
    toast_crumbs: {
        ink: ['#9d4721', '#ea9c4b', '#fff0b7'], span: 55,
        lanes: [trailLane('#c46c28', 2.4, trailStairs(7, 5), 5)],
        marks: [trailGlyph('M-7 8V-2Q-11-4-8-7-3-12 5-8 11-5 7-2V8Z M9 4 12 5 11 8 8 7Z M-12 1-9 2-10 5-13 4Z', 'M-5 5V-2Q-8-5-4-7 1-9 5-5L5 5Z M-2 0H1 M1 3H3')],
        stride: 17, size: 0.9, growth: -0.52, drift: trailFan(2, 13), spin: 1.25, alternate: true
    },
    ufo_beam: {
        ink: ['#19575c', '#79f59b', '#deffcb'], span: 79,
        lanes: [trailLane('#40b783', 8.8), trailLane('#40f692', 2.2, trailFan(-4, -18)), trailLane('#42d4a7', 2.2, trailFan(4, 18))],
        flecks: { step: 6, spread: 15, shape: trailBubble, color: '#9feda8' },
        marks: [trailGlyph('M-10 0a10 3.5 0 1 0 20 0a10 3.5 0 1 0-20 0Z M-7 0a7 1.4 0 1 0 14 0a7 1.4 0 1 0-14 0Z', 'M-7 4Q0 8 7 4 M-4 7Q0 10 4 7 M0-9V-5')],
        stride: 16, size: 0.78, growth: 1.25
    },
    neko_paws: {
        ink: ['#a55645', '#ffac7a', '#fff0d9'], span: 70,
        lanes: [trailLane('#d58576', 2.6, trailWave(7, 9), 8)],
        marks: [trailGlyph('M-7 4Q-7 2-4 1-2-4 0-3 2-4 4 1 8 2 7 5 7 8 3 8L0 7-3 8Q-7 8-7 4Z M-10-4a2.3 3 0 1 0 4.6 0a2.3 3 0 1 0-4.6 0Z M-5-8a2 3 0 1 0 4 0a2 3 0 1 0-4 0Z M1-8a2 3 0 1 0 4 0a2 3 0 1 0-4 0Z M5.4-4a2.3 3 0 1 0 4.6 0a2.3 3 0 1 0-4.6 0Z', 'M-4 5Q0 1 4 5')],
        stride: 16, size: 0.84, growth: -0.12, drift: trailFan(6, 11), spin: 0.42, alternate: true
    },
    ghost_ectoplasm: {
        ink: ['#1e4492', '#77bfff', '#eaffff'], span: 71,
        lanes: [trailLane('#5e63dc', 12, trailWave(7, 6)), trailLane('#75d9ec', 4, trailWave(13, 8, Math.PI))],
        marks: [trailGlyph('M-9 7C-4 5-10-1-6-7 0-15 12-8 9 0 7 3 6 6 9 9 3 11 2 5-1 7-3 11-6 10-9 7Z M-4-2a1.5 2 0 1 0 3 0a1.5 2 0 1 0-3 0Z M2-3a1.5 2 0 1 0 3 0a1.5 2 0 1 0-3 0Z', 'M-5-5Q0-10 5-7 M-4 5Q-1 3 1 4')],
        stride: 27, size: 0.94, growth: 0.45, drift: trailWave(16, 5), spin: 0.56
    },
    vhs_tape: {
        ink: ['#382353', '#eb4ba9', '#d9ffff'], span: 69,
        lanes: [trailLane('#b42785', 9.5, trailWave(10, 8)), trailLane('#ff5cb4', 1.4, trailWave(10, 8, 0.4)), trailLane('#2ed6ce', 1.5, trailWave(10, 8, -0.46))],
        marks: [trailGlyph('M-10-6H10V6H-10Z M-7-3a3 3 0 1 0 6 0a3 3 0 1 0-6 0Z M1-3a3 3 0 1 0 6 0a3 3 0 1 0-6 0Z', 'M-8 4H8 M-4-1H4 M-5 8H5')],
        stride: 25, size: 0.81, drift: trailWave(8, 4), spin: 0.6
    },
    dragon_fire: {
        ink: ['#af271d', '#ff8c38', '#fff7c3'], span: 77,
        lanes: [trailLane('#f3411f', 13, trailWave(6, 12)), trailLane('#ffb23b', 5.2, trailWave(7, 15, 1.2)), trailLane('#d95925', 1.8, trailWave(14, 16), 6)],
        flecks: { step: 4, spread: 19, shape: trailEmber, color: '#ffc15d' },
        marks: [trailGlyph('M-11 8C-5 0-10-4 1-11-2-3 3-3 5-7 6-1 11 0 9 6 6 11-3 11-11 8Z', 'M-5 6Q-3 1 1-3 M0 7Q5 4 6 0 M-8 2-7-1')],
        stride: 12, size: 0.92, growth: 0.45, drift: trailWave(10, 11), spin: 0.76
    },
    aurora_ribbon: {
        ink: ['#285bb9', '#54fed0', '#ecdbff'], span: 88,
        lanes: [trailLane('#4ee8bb', 6.4, trailWave(13, 5)), trailLane('#9463f6', 8.8, trailWave(11, 5, Math.PI)), trailLane('#8cedfa', 1.1, trailWave(16, 5))],
        marks: [trailGlyph('M-11 7Q-4 9 0 1T11-7Q5-12 1-5-5 5-11 7Z M-9 10Q2 11 7 1Q0 8-9 10Z', 'M-8 7Q-3 5 2-3 5-7 9-7')],
        stride: 20, size: 0.86, growth: 0.54, drift: trailWave(9, 5), spin: 1.1
    },
    lotus_petals: {
        ink: ['#56218b', '#f36ccb', '#ffdcff'], span: 61,
        lanes: [trailLane('#a45aea', 3.8, trailArc(-12, -12)), trailLane('#e34aa6', 3.9, trailArc(12, 12))],
        marks: [trailGlyph('M0-10Q8-3 0 4-8-3 0-10Z M-11-3Q-3-3-2 7-11 6-11-3Z M11-3Q3-3 2 7 11 6 11-3Z', 'M0-7V1 M-8-1-4 4 M8-1 4 4 M-3 9Q0 11 3 9')],
        stride: 22, size: 0.93, growth: 0.63, drift: trailWave(5, 6), spin: 0.58
    },
    ronin_slash: {
        ink: ['#971f3b', '#f25962', '#defff4'], span: 62,
        lanes: [trailLane('#cb384d', 5.2, trailStairs(12, 8), 12), trailLane('#53dac2', 1.4, trailArc(-8), 12)],
        marks: [trailGlyph('M-12 7Q0 6 12-8C9 3-1 8-12 7Z M-7 10Q3 8 10 3 5 10-7 10Z', 'M-10 6Q1 4 11-7 M3 7 7 5')],
        stride: 16, size: 1.05, drift: trailFan(2, 10), spin: 0.72, alternate: true
    },
    prism_shards: {
        ink: ['#5644ba', '#d98eff', '#efffff'], span: 76,
        lanes: [trailLane('#887aff', 4.6, trailArc(10, 10)), trailLane('#e56ad7', 3.1, trailArc(-8, -15)), trailLane('#60e8ff', 1.75, trailFan(2, 6), 7)],
        marks: [trailGlyph('M-2-11 7-3 4 7-4 10-8 0Z M8 2 12 7 7 9Z', 'M-2-10 0-1 7-3 M0-1-4 10 M-7 0H0L4 7'),
            trailGlyph('M-9-2-2-10 7-4 8 4 0 9Z M-10 5-7 9-11 10Z', 'M-2-9-3-1 7-4 M-3-1 0 9 M-3-1 8 4', '#62ebff')],
        stride: 15, size: 0.89, growth: -0.28, drift: trailWave(16, 9), spin: 2
    },
    aurum_dust: {
        ink: ['#a9612b', '#ffcc68', '#fff0bd'], span: 94,
        lanes: [trailLane('#d29244', 2.6, trailWave(11, 10)), trailLane('#ffdc86', 1.5, trailWave(11, 10, Math.PI))],
        flecks: { step: 3, spread: 23, shape: trailGlint, color: '#ffe49a' },
        marks: [trailGlyph('M-3-6-1-1 3 1-1 3-3 8-4 3-8 1-4-1Z M7-8 8-5 11-4 8-3 7 0 6-3 3-4 6-5Z M6 4 8 6 6 8 4 6Z M-9-7-7-8-6-6-8-5Z', 'M-3-2V4 M7-6V-2')],
        stride: 11, size: 0.71, growth: 0.4, drift: trailWave(16, 11), spin: 1.28
    },
    valkyrie_wings: {
        ink: ['#973b4b', '#ff794f', '#ffe5aa'], span: 72,
        lanes: [trailLane('#dc5346', 5.5, trailArc(-16, -9)), trailLane('#dc5346', 5.5, trailArc(16, 9)), trailLane('#6699ef', 2.7, trailWave(5, 7))],
        marks: [trailGlyph('M-1 4Q-8 5-12-8-6-3-4-3-1-1-1 4Z M1 4Q8 5 12-8 6-3 4-3 1-1 1 4Z M0 3 3 7 0 11-3 7Z', 'M-2 4-9-4 M2 4 9-4 M-7 4-5 6 M7 4 5 6')],
        stride: 24, size: 1.05, growth: 0.83, spin: 0.28
    },
    kitsune_foxfire: {
        ink: ['#5a2594', '#ff79bc', '#fff3e8'], span: 85,
        lanes: [trailLane('#ff67b4', 5.2, trailWave(10, 8)), trailLane('#62d8f8', 4.4, trailWave(12, 8, Math.PI))],
        marks: [trailGlyph('M-7 8C-14 3-5-4-7-10 0-7 2 0-2 5-3 7-5 8-7 8Z M4 8C-1 3 8-2 6-7 12-4 13 5 7 8Z', 'M-8 5Q-9 2-5-3 M4 6Q3 4 8 0'),
            trailGlyph('M-7 8C-14 3-5-4-7-10 0-7 2 0-2 5-3 7-5 8-7 8Z M4 8C-1 3 8-2 6-7 12-4 13 5 7 8Z', 'M-8 5Q-9 2-5-3 M4 6Q3 4 8 0', '#75dbfa')],
        stride: 18, size: 0.88, growth: 0.32, drift: trailWave(10, 8), spin: 1.1, alternate: true
    },
    lunar_arcs: {
        ink: ['#473997', '#a698fb', '#e8fdff'], span: 90,
        lanes: [trailLane('#7ba8ec', 3.7, trailWave(13, 7)), trailLane('#9776ed', 3.1, trailWave(13, 7, Math.PI))],
        flecks: { step: 6, spread: 23, shape: trailGlint, color: '#d4caff' },
        marks: [trailGlyph('M3-11C-14-9-14 12 5 11C-5 5-6-4 3-11Z M7-4 9-1 12 0 9 1 7 4 6 1 3 0 6-1Z', 'M0-9Q-13 0 1 10 M7-2V2')],
        stride: 18, size: 0.9, growth: 0.3, drift: trailWave(12, 6), spin: 0.64, alternate: true
    },
    astral_stars: {
        ink: ['#344bb3', '#87adff', '#f3f4ff'], span: 93,
        lanes: [trailLane('#5141ac', 8.5, trailWave(5, 5)), trailLane('#a495ff', 1.4, trailWave(11, 7), 7)],
        flecks: { step: 6, spread: 25, shape: trailGlint, color: '#c3cfff' },
        marks: [trailGlyph('M0-10 2-3 9 0 2 2 0 9-2 2-9 0-2-3Z M8 5 10 8 8 11 6 8Z M-9-8-7-6-9-4-11-6Z', 'M0-5V5 M-4 0H4 M-9-6-4-3 M3 3 8 8')],
        stride: 18, size: 1.03, growth: -0.19, drift: trailWave(13, 3), spin: 0.59
    },
    magma_drips: {
        ink: ['#3e2733', '#e57841', '#ffeab0'], span: 70,
        lanes: [trailLane('#5d3d50', 11, trailWave(5, 7)), trailLane('#cb552c', 5.3, trailFan(-6, -12), 8), trailLane('#fa8e4a', 3.6, trailFan(6, 12), 8)],
        flecks: { step: 4, spread: 20, shape: trailEmber, color: '#ffb55d' },
        marks: [trailGlyph('M-9 2-7-4-1-7 7-4 9 1 5 8-2 10Z M-10 6-7 7-8 10-11 9Z M10 6 13 8 11 10 8 8Z', 'M-4-9-4-4-7-2 M-5 3-1 0 4 2 3 6 M0 1 0-4 4-2 M6-10 5-7')],
        stride: 12, size: 0.84, growth: -0.58, drift: trailFan(8, 17), spin: 1.24, alternate: true, solid: true
    },
    liman_sonar: {
        ink: ['#245459', '#80d9bc', '#fff1bd'], span: 87,
        lanes: [trailLane('#50af9f', 3.2, trailFan(-4, -12), 9), trailLane('#447f82', 3.2, trailFan(4, 12), 9)],
        flecks: { step: 8, spread: 17, shape: trailBubble, color: '#b6f2d4' },
        marks: [trailGlyph('M-12 2Q0-13 12 2L10 4Q0-8-10 4Z M-8 6Q0-1 8 6L6 8Q0 3-6 8Z M-2 9 0 7 2 9 0 11Z', 'M-9 1Q0-8 9 1 M0-10V-6 M-4 5-2 4 M3 4 5 5')],
        stride: 19, size: 0.8, growth: 0.86
    },
    crane_folds: {
        ink: ['#74618d', '#ebb9d0', '#fff3dc'], span: 81,
        lanes: [trailLane('#d9a0ba', 2.8, trailStairs(10, 9), 13), trailLane('#9f89c2', 2.7, trailArc(-11, 6))],
        marks: [trailGlyph('M-12-6-3-1 1-7 3-6 3 0 12-7 8 4 0 9-7 4Z', 'M-12-6-3-1 0 9 3 0 12-7 M-7 4-3-1 M8 4 3 0 M-3-1 3 0')],
        stride: 19, size: 1.0, growth: -0.23, drift: trailWave(13, 6), spin: 1.08, alternate: true
    },
    cryoray_wake: {
        ink: ['#183878', '#60dfff', '#ebffff'], span: 77,
        lanes: [trailLane('#244e94', 8), trailLane('#56cffa', 3.6, trailArc(-9, -7)), trailLane('#81f9f1', 3.6, trailArc(9, 7))],
        flecks: { step: 7, spread: 21, shape: trailGlint, color: '#dcfffc' },
        marks: [trailGlyph('M-11-7-3-5 0 0 3-5 11-7 6 3 0 9-6 3Z', 'M-10-6-6 1 0 4 6 1 10-6 M0 0V8')],
        stride: 17, size: 0.85, growth: -0.16, drift: trailWave(6, 6), spin: 0.24
    },
    black_sun_corona: {
        ink: ['#61274f', '#ffa457', '#fff3bf'], span: 88,
        lanes: [trailLane('#792e6b', 10, trailWave(4, 6)), trailLane('#f16d77', 3.2, trailWave(11, 8, Math.PI)), trailLane('#ffc77c', 2.8, trailWave(11, 8))],
        flecks: { step: 6, spread: 24, shape: trailEmber, color: '#ffbf73' },
        marks: [trailGlyph('M0-11A11 11 0 1 1 0 11A11 11 0 1 1 0-11Z M0-6A6 6 0 1 0 0 6A6 6 0 1 0 0-6Z', 'M-10-2Q-8-8-3-9 M4 9 7 7 M0-12V-8 M0 8V12')],
        stride: 19, size: 0.88, growth: 0.3, drift: trailWave(9, 5), spin: 0.56, solid: true
    }
}));

function getTrailArt(id) {
    return TRAIL_ART.get(id) || TRAIL_ART.get('cyan_plasma');
}

function trailIconSvg(id) {
    const { icon, ink, marks, solid } = getTrailArt(id);
    if (icon) return icon;
    const { body, detail, color = ink[1] } = marks[0];
    return `<svg width="26" height="26" viewBox="-14 -14 28 28" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${body}" fill="${color}" fill-opacity="${solid ? 0.16 : 0.47}" fill-rule="evenodd" stroke="${ink[0]}" stroke-width="3.2"/><path d="${body}" stroke="${color}" stroke-width="1.2"/><path d="${detail}" stroke="${ink[2]}" stroke-width="1.06"/></svg>`;
}
