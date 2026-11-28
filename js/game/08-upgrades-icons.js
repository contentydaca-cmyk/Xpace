// Modules read as physical hardware. Each has its own chassis, bevel profile and power traces.
const GARAGE_MODULE_ART = {
    rescue_beacon: {
        colors: ['#fff4ad', '#ffb954', '#5069b8'],
        hull: 'M25 14h30l11 13v27L53 68H27L14 54V27Z',
        bevel: 'm19 31 8-11h26l8 11-6 6-7-8H32l-7 8Zm1 19 8-4 7 10h10l7-10 8 4-9 12H29Z',
        inset: 'M26 41l14-9 14 9-4 11-10 9-10-9Z',
        signal: 'M40 38v14m-5-7h10M27 20q13-9 26 0m-21 4q8-6 16 0',
        light: 'm21 29 8-9m23 43 7-7'
    },
    debuff_filter: {
        colors: ['#c1fff1', '#52e3ac', '#7754a8'],
        hull: 'M17 21 29 12h22l12 9 7 15v17L58 66H22L10 53V36Z',
        bevel: 'm15 35 7-12 9-6 5 7-9 8-5 11Zm50 0-7-12-9-6-5 7 9 8 5 11ZM16 50l8-4 7 10h18l7-10 8 4-8 11H24Z',
        inset: 'M26 31h28v19l-8 8H34l-8-8Z',
        signal: 'M20 41h9l4-6 5 13 4-7h3m3 6 4 4 8-11',
        light: 'm17 31 7-11 7-4m25 43 7-10'
    },
    edge_thrusters: {
        colors: ['#ffe9a1', '#ff8c57', '#a43263'],
        hull: 'm29 11 22 1 9 11 5 28-15 17H28L15 53l4-29Z',
        bevel: 'm29 15 9 1-9 17-2 20-8-4 4-24Zm22 1 6 9 4 25-10 12-5-5 6-10-1-17-6-13Z',
        inset: 'M39 24 49 37v13l-9 9-10-9V37Z',
        signal: 'M39 31 36 44l4 6 4-6-2-10M24 28l-3 13m34-13 3 13',
        light: 'm25 23 5-7 6 1m17 40 5-7'
    },
    capacitor_bank: {
        colors: ['#b9ebff', '#4baaff', '#4b43a6'],
        hull: 'M32 10h16l4 7 12 7 7 3v19l-6 4-9 12-4 8H30l-4-8-11-9-6-6V31l7-5 10-9Z',
        bevel: 'M32 15h15l5 8 10 6 4 3v8l-9-2-6-9-10-5-10 4-8 9-10 4v-7l7-5 9-6Zm-10 39 6-4 12 7 13-7 5 4-10 11H33Z',
        inset: 'M25 35 36 26l14 3 8 12-7 13-12 4-13-8Z',
        signal: 'M41 33c-8-3-12 8-4 11m8-6c4 8-6 12-9 7M33 22l8-2 8 2',
        light: 'M16 35l10-9 7-9m19 44 4-5'
    },
    stasis_core: {
        colors: ['#ffeabb', '#f0a965', '#935cbd'],
        hull: 'M25 11h30l7 10-3 13-6 6 6 7 3 12-7 10H25l-7-10 3-12 6-7-6-6-3-13Z',
        bevel: 'm25 15 8 2-5 9 6 8-3 5-6-7-3-10Zm29 0 4 7-3 10-6 7-3-5 6-8-5-9ZM23 56l9-8 3 6-6 9h-4Zm34 0-9-8-3 6 6 9h4Z',
        inset: 'M33 22h14l-3 11-5 6 5 8 3 10H33l4-10 4-8-5-6Z',
        signal: 'M38 29h5l-3 5Zm-1 24 3-6 3 6Z',
        light: 'M25 16h26M27 65h23'
    },
    phase_damper: {
        colors: ['#f0c8ff', '#b970ff', '#5b4ec3'],
        hull: 'M40 9 63 24l7 26-30 21L10 50l7-26Z',
        bevel: 'm40 14 19 13 5 18-12 2-5-16-7-9Zm0 0-7 8-7 9-5 16-7-2 5-18Zm-24 39 13-1 11 13 11-13 12 1-23 13Z',
        inset: 'M40 22 53 48l-13 11-13-11Z',
        signal: 'M40 29v19l8 3m-8-3-8 3',
        light: 'M41 15 57 26M17 46l4-16'
    },
    shrapnel_forge: {
        colors: ['#ffd0b3', '#ff5a79', '#8a3a82'],
        hull: 'm15 30 11-8 9-12h10l9 12 11 8 5 25-17 12H27L10 55Z',
        bevel: 'm16 47 6-14 8-6 4 13-8 13-8 4Zm48 0-6-14-8-6-4 13 8 13 8 4ZM33 20l7-7 7 7-7 9Z',
        inset: 'M33 36l7-11 7 11v17l-7 7-7-7Z',
        signal: 'M40 34v16M21 46l4-7m34 7-4-7',
        light: 'm18 34 10-8m23-1 11 8'
    },
    flux_collector: {
        colors: ['#bdffe0', '#28d7bb', '#3362ac'],
        hull: 'M29 14h22l9 12 8 7v14l-8 6-9 13H29l-9-13-8-6V33l8-7Z',
        bevel: 'm30 19 7 5-11 13-9 3v-5l7-7Zm20 0 6 9 7 7v5l-9-3-11-13ZM19 46l8 2 5 10 8 2 8-2 5-10 8-2-11 15H30Z',
        inset: 'M29 34l11-8 11 8v12l-11 8-11-8Z',
        signal: 'M22 45c10 5 24 0 37-11m-19 0 5 5-5 6-5-6Z',
        light: 'M31 18h15m4 43 6-7'
    },
    ablative_shell: {
        colors: ['#c1fbff', '#6ebdf4', '#6359bb'],
        hull: 'M40 10 65 20l5 13-7 22-23 16-23-16-7-22 5-13Z',
        bevel: 'm15 29 5-7 16-6 1 8-12 8-4 14-5-6Zm50 0-5-7-16-6-1 8 12 8 4 14 5-6ZM22 51l9 1 9 11 9-11 9-1-18 14Z',
        inset: 'm40 25 15 9-4 15-11 10-11-10-4-15Z',
        signal: 'm34 35 6 4 6-4m-6 4v12',
        light: 'm20 23 15-6m17 44 9-7'
    },
    thermal_sink: {
        colors: ['#b7efff', '#55c3f5', '#9b5bcc'],
        hull: 'M12 16h13l15 13 15-13h13l4 10-19 23-6 16-7 6-7-6-6-16L8 26Z',
        bevel: 'M15 20h9l10 10-2 6-9-2-11-10Zm50 0h-9L46 30l2 6 9-2 11-10ZM29 47l6-4 5 9 5-9 6 4-8 17h-6Z',
        inset: 'm25 33 15 5 15-5-6 11-9 15-9-15Z',
        signal: 'M19 24l21 19 21-19m-21 19v11',
        light: 'M14 20h9m34 0h9'
    },
    salvage_refiner: {
        colors: ['#fff2a8', '#f1b450', '#a45157'],
        hull: 'M24 12h32l12 12v30L56 67H24L12 54V24Z',
        bevel: 'm17 27 10-10h26l10 10-7 3-6-6H30l-6 6Zm0 24 8-4 6 10h18l6-10 8 4-10 11H27Z',
        inset: 'M26 35l8-9h12l8 9v16l-8 8H34l-8-8Z',
        signal: 'M30 48V37l10 7 10-7v11',
        light: 'm19 25 9-8h23m4 46 6-7'
    },
    auxiliary_bus: {
        colors: ['#ffc0fa', '#e169d5', '#6454c4'],
        hull: 'M16 20h48l9 11v19l-10 9H49v9H31v-9H17L7 50V31Z',
        bevel: 'm12 33 7-9h42l7 9-8 3-5-6H25l-5 6Zm0 14 7-2 6 8h30l6-8 7 2-7 8H19Z',
        inset: 'M22 32h36v16H22Z',
        signal: 'M25 40h9l2-4 4 9 4-11 3 6h8M35 62h10',
        light: 'M22 24h35m4 30 6-5'
    }
};

function garageModuleEmblem(module, instance) {
    const [light, energy, shadow] = module.colors;
    const prefix = `garage-module-${instance}`;
    return `<svg class="garage-emblem garage-module-emblem" viewBox="0 0 80 80" aria-hidden="true" focusable="false">
        <defs>
            <linearGradient id="${prefix}-alloy" x2="1" y2="1">
                <stop stop-color="${shadow}"/><stop offset=".3" stop-color="#33416a"/><stop offset=".7" stop-color="#16162e"/><stop offset="1" stop-color="#090a1c"/>
            </linearGradient>
            <linearGradient id="${prefix}-bevel" x2=".68" y2="1">
                <stop stop-color="${light}"/><stop offset=".25" stop-color="${shadow}"/><stop offset=".54" stop-color="#262540"/><stop offset="1" stop-color="${shadow}"/>
            </linearGradient>
            <radialGradient id="${prefix}-lens" cx=".36" cy=".3" r=".74">
                <stop stop-color="${shadow}"/><stop offset=".63" stop-color="#15152f"/><stop offset="1" stop-color="#070713"/>
            </radialGradient>
            <linearGradient id="${prefix}-energy" x1="19" y1="18" x2="60" y2="65" gradientUnits="userSpaceOnUse">
                <stop stop-color="${light}"/><stop offset=".6" stop-color="${energy}"/><stop offset="1" stop-color="${shadow}"/>
            </linearGradient>
        </defs>
        <path d="${module.hull}" transform="translate(1 3)" fill="#060610" stroke="#070717" stroke-width="4"/>
        <path d="${module.hull}" fill="url(#${prefix}-alloy)" stroke="${shadow}" stroke-width="1.65" stroke-linejoin="round"/>
        <path d="${module.bevel}" fill="url(#${prefix}-bevel)" stroke="#0b0d1e" stroke-width="1.15" stroke-linejoin="round"/>
        <path d="${module.inset}" fill="url(#${prefix}-lens)" stroke="#08091a" stroke-width="2.3" stroke-linejoin="round"/>
        <path d="${module.light}" fill="none" stroke="${light}" stroke-width="1.2" stroke-opacity=".68" stroke-linecap="round"/>
        ${module.orbit ? `<path class="emblem-spin" d="${module.orbit}" fill="none" stroke="url(#${prefix}-energy)" stroke-width="2.7" stroke-linecap="round"/>` : ''}
        <path d="${module.signal}" fill="none" stroke="url(#${prefix}-energy)" stroke-width="5" stroke-opacity=".34" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${module.signal}" fill="none" stroke="${light}" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
}

const GARAGE_EMBLEMS = {
    drive: ['#fff5af', '#ff5a60', `
        <path d="m39 13-20 31h17l-2 23 28-36H46l8-18z"/>
        <path d="m43 20-15 21h13l-1 13 16-20H42l7-14z" fill="#fff2ae" stroke="none"/>`],
    emp: ['#ffadee', '#7469fd', `
        <circle cx="40" cy="40" r="26" fill="#302057" stroke-width="4"/>
        <path d="M18 42h11l7-15 8 21 6-10h12" fill="none" stroke-width="5"/>
        <path d="M18 42h11l7-15 8 21 6-10h12" fill="none" stroke="#fee8ff" stroke-width="2"/>`],
    chrono: ['#affff2', '#4f8ce5', `
        <path d="m40 12 24 11-4 22c-2 10-10 18-20 23-10-5-18-13-20-23l-4-22z"/>
        <path d="m40 19 17 8-4 18c-2 7-7 13-13 16-6-3-11-9-13-16l-4-18z" fill="#17374e" stroke="none"/>
        <path d="M31 29h18l-2 6-5 5 5 5 2 6H31l2-6 5-5-5-5z" fill="#bdfff4" stroke="none"/>`],
    score_rush: ['#fff0a3', '#ed6856', `
        <path d="M40 9l8 10 15-1 1 15 8 7-8 8-1 15-15-1-8 10-8-10-15 1-1-15-8-8 8-7 1-15 15 1z"/>
        <path d="m40 18 17 8 5 14-5 14-17 8-17-8-5-14 5-14z" fill="#3c1d36"/>
        <path d="M32 29h18v5H37l-1 4h9l5 4v7l-5 5H31v-5h12l2-2v-3l-2-2H30z" fill="#fff1ae" stroke="none"/>`],
    drift_resonance: ['#ffd0f1', '#bf56ef', `
        <path d="m49 57 8-10h12l7 8v13l-7 7H55l-6-7z" fill="#331e51"/>
        <path d="m54 59 6-7h8l4 5m-18 8h14" fill="none" stroke="#a87bc0" stroke-width="1.6"/>
        <path d="M7 69c19-4 31-12 28-27-2-14 11-24 31-29" fill="none" stroke="#ed7af6" stroke-opacity=".24" stroke-width="11"/>
        <path d="M7 69c19-4 31-12 28-27-2-14 11-24 31-29" fill="none" stroke="#ffe0fb" stroke-width="3"/>
        <path d="m29 44-9-4 13-19 19-8-7 18-11 12-1-8z" stroke="#fff1fc"/>
        <path d="M46 38q10 1 16 7m-12-15q15 1 22 11" fill="none" stroke="#ff93e7" stroke-width="2.5"/>`],
    ion_fan: ['#b4feff', '#4269fa', `
        <path d="M28 55 7 23m27 30L22 14m18 37V8m6 45 12-39m-6 41 21-32" fill="none" stroke="#5899ff" stroke-opacity=".33" stroke-width="8"/>
        <path d="M28 55 7 23m27 30L22 14m18 37V8m6 45 12-39m-6 41 21-32" fill="none" stroke="#bafaff" stroke-width="3"/>
        <path d="m21 60 8-10h22l8 10-6 11H27z"/>
        <path d="m29 61 5-6h12l5 6-5 5H34z" fill="#18245a"/>
        <path d="M35 60h10" fill="none" stroke="#c6ffff" stroke-width="2"/>`],
    locked: ['#d4d8ff', '#8068cb', `
        <path d="M28 37V30a12 12 0 0 1 24 0v7" fill="none" stroke-width="4.5"/>
        <path d="m23 37 4-4h26l4 4v17l-5 5H28l-5-5z"/>
        <path d="M37 45a3 3 0 1 1 5 2v5h-4v-5z" fill="#f1eaff" stroke="none"/>`],
    empty: ['#98fff0', '#5a64b5', `
        <path d="M36 22h8v14h14v8H44v14h-8V44H22v-8h14z"/>`]
};

function garageEmblem(id, instance) {
    const module = GARAGE_MODULE_ART[id];
    if (module) return garageModuleEmblem(module, instance);
    const [light, accent, art] = GARAGE_EMBLEMS[id] || GARAGE_EMBLEMS.empty;
    const prefix = `garage-emblem-${instance}`;
    return `<svg class="garage-emblem" viewBox="0 0 80 80" aria-hidden="true" focusable="false">
        <defs>
            <linearGradient id="${prefix}-plate" x1="0" y1="0" x2=".52" y2="1">
                <stop stop-color="${light}"/><stop offset=".48" stop-color="${accent}"/>
                <stop offset="1" stop-color="#251747"/>
            </linearGradient>
            <linearGradient id="${prefix}-edge" x1="0" y1="0" x2="0" y2="1">
                <stop stop-color="${light}"/><stop offset="1" stop-color="${accent}"/>
            </linearGradient>
            <radialGradient id="${prefix}-halo">
                <stop stop-color="${accent}" stop-opacity=".4"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <circle cx="40" cy="40" r="38" fill="url(#${prefix}-halo)"/>
        <g fill="url(#${prefix}-plate)" stroke="url(#${prefix}-edge)" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round">${art}</g>
    </svg>`;
}
