// Procedural hulls shared by the flight renderer and inventory previews.
const detailedShipMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const detailedShipModels = (() => {
    const tau = Math.PI * 2;
    const frame = '#070915';
    const path = data => new Path2D(data);

    const swallow = {
        wing: path('M3-10 12-8 23-20 22-8 19 2 14 9 7 13 4 9Z'),
        plating: path('M6-6 12-5 21-16 20-6 16 3 11 7 7 7Z'),
        edge: path('M12-8 23-20 22-8 19 2 17 0 20-9 12-4Z'),
        feather: path('M15 2 21-3 17 8 12 13 12 8Z M12 9 15 9 11 15 8 17Z'),
        tail: path('M5 7 11 10 13 23 8 20 4 13Z'),
        tailEdge: path('M10 12 12 21 9 18 7 13Z'),
        veins: path('M8-2 13-1 19-8 M8 5 12 5 16 1 M12 11 15 8'),
        hull: path('M0-23 5-15 8-5 7 7 5 13 0 17-5 13-7 7-8-5-5-15Z'),
        chin: path('M0-21 4-14 5-8 3-11 0-16-3-11-5-8-4-14Z M-7 1-4 5-3 12 0 15 3 12 4 5 7 1 6 10 0 16-6 10Z'),
        visor: path('M0-13 4-7 4-1 0 3-4-1-4-7Z'),
        glass: path('M0-11 2.5-6 2-3-1-1-2.5-5Z'),
        outlets: path('M-8 10H-3L-4 15-7 15Z M3 10H8L7 15H4Z')
    };

    const atlas = {
        tread: path('M11-15 17-19 22-15 23-9V14L20 20 14 20 10 15Z'),
        treadBed: path('M16-16 20-16 22-12V15L19 18H15L14 14V-12Z'),
        shoulder: path('M9-14 15-17 19-12 17-4 13 0 9-3Z M11 4 16 2 19 8 18 15 14 18 10 14Z'),
        cuts: path('M12-12 15-14 17-12 M12 12 15 10 17 12'),
        hull: path('M-8-22H8L12-17 15-8V11L9 21H-9L-15 11V-8L-12-17Z'),
        deck: path('M-8-21H8L11-17 7-12H-7L-11-17Z M-14 8-10 6-8 13-4 16H4L8 13 10 6 14 8 12 14 8 19H-8L-12 14Z'),
        ribs: path('M-11-12-13-8V0 M11-12 13-8V0 M-5 17H5 M-7 19H7'),
        socket: path('M-7-11H7L11-6V6L7 12H-7L-11 6V-6Z'),
        shutter: path('M-2-9 3-9 6-6 2-5 0-4-2-5Z')
    };

    const needle = {
        hull: path('M0-25 5-13 7-2 5 11 2 23H-2L-5 11-7-2-5-13Z'),
        struts: path('M-5-4-12 1-15 5-12 9-7 7-4 10H4L7 7 12 9 15 5 12 1 5-4Z'),
        facets: path('M0-24 4-13 2-7H-2L-4-13Z M-6 0-3-3-3 11 0 17-2 21-5 11Z M6 0 3-3 3 11 0 17 2 21 5 11Z'),
        obsidian: path('M-4-10-1-7-2-2-6 0Z M4-10 1-7 2-2 6 0Z M-3 10H3L0 19Z'),
        highlights: path('M0-23V-13 M-5 5-4 10 M5 5 4 10'),
        cradle: path('M-2-6 2-6 4.5-2 3 4 0 7-3 4-4.5-2Z')
    };

    const manta = {
        fin: path('M-2-6Q4-13 15-11L20-5 18 1Q11 9 0 12L-4 6Z'),
        finInset: path('M-1-5Q7-12 15-9L17-5 15 0Q9 5 1 8Z'),
        finVeins: path('M-1 1Q5-4 14-5 M3 4Q8 3 15 0 M6-2 8 2 8 5'),
        finRim: path('M1-8Q8-13 15-11L20-5 18 1Q11 9 4 10'),
        tip: path('M-3-6Q3-5 9-2L12 2Q6 1 3 5L-2 6Z'),
        tipVein: path('M-2-4Q2-4 9 0 M-1 4 3 2'),
        body: path('M0-21C7-17 10-9 9 0Q8 8 3 12L2 21 0 23-3 21-3 13Q-8 9-9 0C-10-9-7-17 0-21Z'),
        shell: path('M0-19Q8-13 7-3 6 5 0 10-6 5-7-3-8-13 0-19Z'),
        ionSpine: path('M0-16V8 M0-9-5-4-5 2 M0-9 5-4 5 2 M0 2-3 6-2 12 M0 2 3 6 2 12'),
        crescent: path('M-4-10Q0-17 4-10 M-5 3Q-3 8 0 9 3 8 5 3')
    };

    const jackal = {
        skeleton: path('M4-11 12-10 17-16 21-11 21 10 16 17 9 14 5 10Z'),
        nacelle: path('M12-16 17-20 21-15 22-3 20 7 16 12 10 7 9-5Z'),
        bevel: path('M12-16 17-20 21-15 19-12 17-16 13-12 11-6 9-5Z M20 0 21-6 22-3 20 7 16 12 13 10 17 7Z'),
        rails: path('M14-12H19V4L17 8H14L12 5V-7Z'),
        weapon: path('M15-22 16-25H18L19-22V-5H15Z'),
        barrel: path('M16.5-22V-12 M18-21V-16'),
        seams: path('M10 3 13 5 M13 9 16 9 M19-9V-5'),
        hull: path('M0-22 6-17 8-9 8 6 5 14 0 17-5 14-8 6-8-9-6-17Z'),
        chest: path('M0-21 5-16 6-9 3-6H-3L-6-9-5-16Z M-7 0-3 2H3L7 0 6 9 3 13H-3L-6 9Z'),
        visor: path('M-4-12-1-14H1L4-12 3-8 0-7-3-8Z'),
        exhaust: path('M11 8 16 9 19 8 18 15 16 18H13L11 15Z')
    };

    const comet = {
        tail: path('M-3-2 4 0 8 6 7 13 1 19-5 18-2 12-5 5Z'),
        tailFoil: path('M-1 0 4 2 6 6 5 12 0 16-3 17 1 10-3 4Z'),
        tailSeam: path('M1 1 3 6 2 12-1 15 M2 12 5 9'),
        hull: path('M-14 9Q-24 0-17-12-11-23 2-22 12-24 17-15 23-5 14 5 5 16-6 15Z'),
        rim: path('M-17-12Q-11-23 2-22 12-24 17-15L16-10Q13-18 6-18-9-20-15-9Z M-18 4Q-8 16 6 10L11 6Q4 17-6 15-15 14-18 4Z'),
        deck: path('M-14-11Q-9-19 2-17 12-19 14-11 17-4 10 4 3 11-8 9-17 6-17-1Z'),
        insert: path('M5-15 11-15Q16-9 13-3L10 0 9-5Z M-16-6-12-3-10 5-13 5Q-17 2-16-6Z'),
        well: path('M-10-10Q-5-16 3-13 10-10 8-3 6 4-2 5-10 5-12-2-13-6-10-10Z'),
        seams: path('M-12 7-7 10-2 10 M7 9 13 4 16-1 M-14-13-11-16-6-18')
    };

    function paint(ctx, shape, fill, edge, width = 0.8) {
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill(shape);
        }
        if (edge) {
            ctx.lineWidth = width;
            ctx.strokeStyle = edge;
            ctx.stroke(shape);
        }
    }

    function alloy(ctx, x1, y1, x2, y2, from, bevel, shade) {
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, from);
        grad.addColorStop(0.35, bevel);
        grad.addColorStop(1, shade);
        return grad;
    }

    function disc(ctx, x, y, radius, fill) {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, tau);
        ctx.fill();
    }

    function bloom(ctx, x, y, radius, color) {
        const halo = ctx.createRadialGradient(x, y, 0, x, y, radius);
        halo.addColorStop(0, color + 'a0');
        halo.addColorStop(1, color + '00');
        disc(ctx, x, y, radius, halo);
    }

    function core(ctx, x, y, radius, pulse, color, white) {
        bloom(ctx, x, y, radius * (1.6 + pulse * 0.45), color);
        const field = ctx.createRadialGradient(x - radius * 0.22, y - radius * 0.25, 0, x, y, radius);
        field.addColorStop(0, '#ffffff');
        field.addColorStop(0.22 + 0.16 * pulse, white);
        field.addColorStop(0.62, color);
        field.addColorStop(1, color + '00');
        disc(ctx, x, y, radius, field);
    }

    function jet(ctx, x, y, width, length, shade, light) {
        const flame = ctx.createLinearGradient(0, y, 0, y + length);
        flame.addColorStop(0, light);
        flame.addColorStop(0.38, shade);
        flame.addColorStop(1, shade + '00');
        ctx.fillStyle = flame;
        ctx.beginPath();
        ctx.moveTo(x - width, y);
        ctx.quadraticCurveTo(x - width * 0.78, y + length * 0.52, x, y + length);
        ctx.quadraticCurveTo(x + width * 0.85, y + length * 0.48, x + width, y);
        ctx.closePath();
        ctx.fill();
    }

    function drawSwallow(ctx, time) {
        const pulse = Math.sin(time * 13);
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            paint(ctx, swallow.tail, alloy(ctx, 6, 9, 12, 22, '#5282ad', '#183351', '#090e21'), frame, 1.4);
            paint(ctx, swallow.tailEdge, '#65d3ff');
            jet(ctx, 5.6, 13, 2.1, 9 + pulse * 1.5, '#32a8ff', '#e0fbff');
            paint(ctx, swallow.wing, '#0c172c', frame, 1.5);
            paint(ctx, swallow.plating, alloy(ctx, 16, -12, 7, 8, '#527ca5', '#2d4e7c', '#101b34'), '#5686ac', 0.65);
            paint(ctx, swallow.edge, alloy(ctx, 22, -19, 14, 3, '#9cddff', '#356a9b', '#111e3a'));
            ctx.save();
            ctx.translate(15, 2);
            ctx.rotate(Math.sin(time * 5) * 0.105);
            ctx.translate(-15, -2);
            paint(ctx, swallow.feather, alloy(ctx, 13, 9, 22, -3, '#123b66', '#3296d7', '#d0f7ff'), '#74d9ff', 0.72);
            ctx.restore();
            paint(ctx, swallow.veins, null, '#73d8ff', 0.75);
            ctx.restore();
        }
        paint(ctx, swallow.hull, alloy(ctx, -5, -21, 7, 13, '#527ca5', '#193960', '#080e24'), frame, 1.65);
        paint(ctx, swallow.chin, '#567fc1', '#89c2e5', 0.5);
        paint(ctx, swallow.outlets, '#111e32', '#79aacb');
        for (const x of [-5.6, 5.6]) {
            bloom(ctx, x, 14.6, 3.65 + pulse * 0.4, '#32baff');
            disc(ctx, x, 14.6, 1.12, '#bff7ff');
        }
        paint(ctx, swallow.visor, alloy(ctx, 0, -12, 0, 3, '#102844', '#157abc', '#102044'), '#60cbfc');
        bloom(ctx, 0, -5, 6.5 + pulse * 0.45, '#3bbaff');
        paint(ctx, swallow.glass, '#d1f8ff');
    }

    function drawAtlas(ctx, time) {
        const pulse = 0.55 + Math.sin(time * 5.2) * 0.36;
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            paint(ctx, atlas.tread, alloy(ctx, 12, -13, 23, 14, '#68777a', '#303c44', '#101822'), frame, 1.6);
            paint(ctx, atlas.treadBed, '#10151b', '#7c8b80', 0.7);
            ctx.save();
            ctx.clip(atlas.treadBed);
            const track = alloy(ctx, 15, 0, 22, 0, '#7d8f83', '#46564f', '#171f24');
            const travel = (time * 13) % 4.8;
            for (let y = -23 + travel; y < 20; y += 4.8) {
                ctx.fillStyle = track;
                ctx.fillRect(15, y, 7, 3.05);
                ctx.fillStyle = '#b8c2ad';
                ctx.fillRect(18, y, 3.6, 0.7);
            }
            ctx.restore();
            paint(ctx, atlas.shoulder, alloy(ctx, 11, -15, 19, 14, '#abb7ad', '#525e60', '#263234'), '#788c78', 0.8);
            paint(ctx, atlas.cuts, null, '#1a2426', 1.3);
            disc(ctx, 15.4, -12.5, 0.84, '#ecead3');
            disc(ctx, 15.4, 13.2, 0.84, '#c8d5ab');
            ctx.restore();
        }
        jet(ctx, 0, 18, 3, 5 + pulse * 2.2, '#c4e155', '#fff5b4');
        paint(ctx, atlas.hull, alloy(ctx, -7, -20, 7, 20, '#7e9292', '#384a48', '#172025'), frame, 1.75);
        paint(ctx, atlas.deck, alloy(ctx, 0, -21, 0, 21, '#bec9b7', '#6c8078', '#394943'), '#a6bfa0', 0.7);
        paint(ctx, atlas.ribs, null, '#23352c', 1.2);
        paint(ctx, atlas.socket, '#111d1a', '#89a878', 1.15);
        ctx.save();
        ctx.clip(atlas.socket);
        bloom(ctx, 0, 2, 15.3, '#f4d063');
        core(ctx, 0, 0, 6.6, pulse, '#adf331', '#f5ffb4');
        ctx.rotate(time * 1.75);
        for (let blade = 0; blade < 5; blade++) {
            paint(ctx, atlas.shutter, '#4d5a48', '#d1c78c', 0.83);
            ctx.rotate(tau / 5);
        }
        ctx.restore();
    }

    function gyroscopeHalf(ctx, time, front, radiusY, tilt) {
        const start = front ? 0 : Math.PI;
        ctx.save();
        ctx.translate(0, 1.5);
        ctx.rotate(tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, 20, radiusY, 0, start, start + Math.PI);
        ctx.lineWidth = 4.6;
        ctx.strokeStyle = frame;
        ctx.stroke();
        ctx.lineWidth = 2.8;
        ctx.strokeStyle = front
            ? alloy(ctx, -19, 0, 17, 9, '#fff2ab', '#b77923', '#f4b948')
            : alloy(ctx, -20, 0, 17, -9, '#725024', '#e0aa43', '#845215');
        ctx.stroke();
        ctx.lineWidth = 0.75;
        ctx.strokeStyle = front ? '#fff3bc' : '#efb850';
        ctx.beginPath();
        ctx.ellipse(0, 0, 20.4, radiusY + 0.32, 0, start, start + Math.PI);
        ctx.stroke();
        for (const offset of [0, Math.PI]) {
            const phase = (time * 2.4 + 0.65 + offset) % tau;
            const from = Math.max(start, phase - 0.22);
            const to = Math.min(start + Math.PI, phase + 0.14);
            if (from >= to) continue;
            ctx.strokeStyle = '#fff4c4';
            ctx.lineWidth = 1.7;
            ctx.beginPath();
            ctx.ellipse(0, 0, 20.15, radiusY, 0, from, to);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawNeedle(ctx, time) {
        const tilt = Math.sin(time * 1.7) * 0.28 - 0.21;
        const radiusY = 6.4 + Math.sin(time * 2.4) * 1.85;
        gyroscopeHalf(ctx, time, false, radiusY, tilt);
        jet(ctx, 0, 20, 1.6, 5.1 + Math.sin(time * 11), '#ffbe49', '#fff7ca');
        paint(ctx, needle.struts, alloy(ctx, -11, 1, 12, 9, '#fff0a4', '#a8702b', '#56382d'), frame, 1.4);
        paint(ctx, needle.hull, alloy(ctx, -4, -20, 7, 15, '#fff4b6', '#ce922d', '#4a3230'), frame, 1.55);
        paint(ctx, needle.facets, alloy(ctx, -3, -24, 2, 22, '#fff7bf', '#d4a54f', '#986321'), '#edd699', 0.6);
        paint(ctx, needle.obsidian, '#141523', '#6e512e', 0.7);
        paint(ctx, needle.highlights, null, '#fff5cc', 0.85);
        paint(ctx, needle.cradle, '#191726', '#f4cd75', 0.85);
        core(ctx, 0, -1.3, 4.75, 0.6 + Math.sin(time * 6) * 0.34, '#ffb746', '#fff4b9');
        gyroscopeHalf(ctx, time, true, radiusY, tilt);
    }

    function drawManta(ctx, time) {
        const pulse = 0.5 + Math.sin(time * 4.9) * 0.42;
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            ctx.translate(5, 0);
            ctx.rotate(Math.sin(time * 4.6) * 0.14);
            ctx.save();
            ctx.translate(12, -4);
            ctx.rotate(Math.sin(time * 4.6 - 0.9) * 0.21);
            paint(ctx, manta.tip, alloy(ctx, -3, -4, 11, 3, '#165359', '#147a79', '#77ffd1'), frame, 1.2);
            paint(ctx, manta.tipVein, null, '#76ffe4', 0.82);
            ctx.restore();
            paint(ctx, manta.fin, alloy(ctx, 16, -12, 1, 12, '#367f92', '#115b65', '#071c31'), frame, 1.35);
            bloom(ctx, 6, -2, 8.2 + pulse, '#17f4ad');
            paint(ctx, manta.finVeins, null, '#55ffcb', 1.35);
            paint(ctx, manta.finInset, alloy(ctx, 13, -10, 4, 8, '#affbe166', '#3ea6a843', '#061f38a9'), '#84e4dc7a', 0.7);
            paint(ctx, manta.finRim, null, '#54f6da', 1.15);
            ctx.restore();
        }
        jet(ctx, 0, 18, 1.7, 7 + pulse, '#1cf6b8', '#caffeb');
        paint(ctx, manta.body, alloy(ctx, -5, -19, 9, 15, '#7cbfca', '#185b6c', '#0b192b'), frame, 1.4);
        bloom(ctx, 0, -4, 10.4, '#1cbfc8');
        paint(ctx, manta.ionSpine, null, '#8dffe2', 1.15);
        paint(ctx, manta.shell, alloy(ctx, -5, -18, 6, 10, '#d2fff087', '#338caa37', '#00294495'), '#72e8d7', 0.83);
        core(ctx, 0, -3.7, 4.7, pulse, '#2cf5c6', '#d0fff4');
        paint(ctx, manta.crescent, null, '#a3f8f4', 0.72);
    }

    function drawJackal(ctx, time) {
        const pulse = Math.sin(time * 15);
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            jet(ctx, 14.7, 15.5, 3.5, 9 + pulse * 1.65, '#ff7d2a', '#fff3bf');
            paint(ctx, jackal.skeleton, '#181820', frame, 1.8);
            paint(ctx, jackal.nacelle, alloy(ctx, 14, -15, 22, 9, '#f9bd90', '#ae5b36', '#462525'), '#78442e', 1.1);
            paint(ctx, jackal.bevel, alloy(ctx, 16, -18, 18, 11, '#ffe0b2', '#bb7047', '#6e372d'), '#e3a774', 0.57);
            paint(ctx, jackal.rails, alloy(ctx, 12, -10, 19, 8, '#3c3f4b', '#24242e', '#131521'), '#a3654b', 0.73);
            paint(ctx, jackal.weapon, '#282530', '#a38b79', 0.85);
            paint(ctx, jackal.barrel, null, '#ffc477', 0.95);
            paint(ctx, jackal.seams, null, '#f4bf8f', 0.65);
            paint(ctx, jackal.exhaust, alloy(ctx, 11, 8, 18, 18, '#a87655', '#482b2d', '#171620'), '#ac704d');
            bloom(ctx, 14.5, 16.4, 4.6 + 0.45 * pulse, '#ff882f');
            disc(ctx, 14.5, 16.4, 1.25, '#ffce87');
            ctx.restore();
        }
        paint(ctx, jackal.hull, alloy(ctx, -6, -17, 8, 16, '#ebb083', '#7f4a3d', '#25212c'), frame, 1.55);
        paint(ctx, jackal.chest, alloy(ctx, -7, -19, 7, 10, '#ffd5a8', '#b57153', '#703b34'), '#f2b783', 0.72);
        paint(ctx, jackal.visor, alloy(ctx, -2, -13, 3, -7, '#fcbe7f', '#62506b', '#20192c'), '#271c25', 1.1);
        disc(ctx, 0, 7, 2.9, '#37232a');
        core(ctx, 0, 7, 2.65, 0.55 + pulse * 0.28, '#fa893f', '#ffdf9c');
    }

    function drawComet(ctx, time, steering) {
        const pulse = 0.5 + Math.sin(time * 5.3) * 0.42;
        ctx.save();
        ctx.translate(0, 7);
        ctx.rotate(Math.max(-0.52, Math.min(0.52, steering * 1.22)) + Math.sin(time * 3) * 0.06);
        jet(ctx, 2, 11, 2, 5 + pulse * 2, '#9b62fb', '#ebc6ff');
        paint(ctx, comet.tail, alloy(ctx, -3, 0, 8, 15, '#765ba5', '#332355', '#11132b'), frame, 1.45);
        paint(ctx, comet.tailFoil, alloy(ctx, 2, 0, -3, 17, '#d5adf8', '#604291', '#261747'), '#b17ff4', 0.69);
        paint(ctx, comet.tailSeam, null, '#b870ff', 0.9);
        ctx.restore();

        paint(ctx, comet.hull, alloy(ctx, -11, -20, 12, 14, '#7e60a2', '#3d2a62', '#171127'), frame, 1.65);
        paint(ctx, comet.deck, alloy(ctx, -10, -19, 7, 10, '#986eb6', '#4c356d', '#201334'), '#8061a6', 0.77);
        paint(ctx, comet.rim, alloy(ctx, -12, -21, 9, 13, '#e1b2ed', '#7760af', '#352450'), '#9770c7', 0.58);
        paint(ctx, comet.insert, '#18152b', '#6f579b', 0.72);
        paint(ctx, comet.seams, null, '#b58add', 0.72);
        paint(ctx, comet.well, '#211633', '#c293f5', 1);
        ctx.save();
        ctx.clip(comet.well);
        core(ctx, -2.2, -4.6, 7.65, pulse, '#b15dff', '#f8cbff');
        ctx.translate(-2.2, -4.6);
        ctx.rotate(-time * 1.5);
        ctx.strokeStyle = '#eed1ff';
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.ellipse(0, 0, 7.3, 3.35, 0, 0.14, Math.PI * 1.78);
        ctx.stroke();
        ctx.restore();
    }

    return new Map([
        ['night_swallow', drawSwallow],
        ['iron_atlas', drawAtlas],
        ['sun_needle', drawNeedle],
        ['ion_manta', drawManta],
        ['copper_jackal', drawJackal],
        ['violet_comet', drawComet]
    ]);
})();
