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

    const volcanic = {
        bridge: path('M6-10 17-6 20 5 11 11 5 7Z'),
        pod: path('M12-19H20L24-14V8L20 13 20 18H11V13L9 9V-13Z'),
        rail: path('M20-18 24-14V8L20 12V8L21 5V-11L18-15Z'),
        podCap: path('M12-17H19L21-13 19-9H11V-12Z'),
        shield: path('M12-7H19L20-4V5L17 8H11V-4Z'),
        shieldRim: path('M12-7H19L20-4 M11 5V-4L12-6'),
        shutters: path('M12 7H19L18 13H11Z'),
        fins: path('M12 8.5H18.5 M11.7 10.4H18.1 M11.4 12.3H17.7'),
        nozzle: path('M11 13H20V17.5H11Z'),
        throat: path('M12.3 14.5H18.7L18 17H13Z'),
        hull: path('M-5-24H5L10-17 11-8 8-2 9 10 5 16H-5L-9 10-8-2-11-8-10-17Z'),
        tiles: path('M-4.5-22.5H4.5L7-19H-7Z M-9-16H-6L-7-5-9-7Z M6-16H9L9-7 7-5Z'),
        roof: path('M-6.5-4H6.5L7.5 8 4.5 13H-4.5L-7.5 8Z'),
        roofRim: path('M-6-3H6 M-6 7-4.2 11H4.2L6 7'),
        cockpit: path('M-5.8-17H5.8L7.3-11 5.6-6H-5.6L-7.3-11Z'),
        glass: path('M-4.6-15.6H4.6L5.8-11 4.7-7.5H-4.7L-5.8-11Z'),
        glassGlint: path('M-4.5-15.3H2.8L-2.7-11H-5.7Z'),
        glassFrame: path('M0-15.8V-7.2 M-5.9-10.8H5.9'),
        stencil: path('M-4.5-1-2.8 4.5-1-1 M0.9-1H4.8L2.2 4.5'),
        stripes: path('M12.8-5.8H15L19 0.1V3.4Z M11.8-3.7 18 5.2 16.2 6.9 11.8 0.5Z')
    };

    const volcanicBoost = {
        mount: path('M16-9 29-4 28 9 21 16 14 11Z'),
        radiator: path('M23-9 29-15 33-12 32 5 27 14 22 11 24 4Z'),
        radiatorFace: path('M27.2-10 30-12.2 31.4-10.7 30.3 3.8 27.1 10.7 24.5 9.3 26.3 3Z'),
        radiatorSlots: path('M27.4-7H30 M27-4H29.8 M26.6-1H29.5 M26 2H29.2 M25.3 5H28'),
        rail: path('M11-17 14-23H19L22-17 21-13H12Z'),
        shield: path('M11-7 14-10H20L21-5 19 3 16 7H11Z'),
        shieldRim: path('M11-6.5 14-9H19 M12 5.8H15.5L18.8 2.1'),
        prow: path('M-4-30H4L8-26 9-20 13-15 10-7 8-12 6-22H-6L-8-12-10-7-13-15-9-20-8-26Z'),
        prowEdges: path('M-7.2-25.5-3.5-29H3.5L7.2-25.5 M-10.9-14.5-8.3-19 M10.9-14.5 8.3-19'),
        spine: path('M-7-5-4-3 0-4 4-3 7-5 7.6 8 4.5 14H-4.5L-7.6 8Z')
    };

    const boostDetails = {
        swallowFeathers: path('M13 7 20 4 18 13 12 20 13 13 9 16Z'),
        swallowVanes: path('M13 12 17 8 M12 16 15 13'),
        atlasTrackRim: path('M19-16 21-13V14L18 18'),
        mantaFinTip: path('M0 0Q5-8 15-5L13 1Q8 5 0 6Z'),
        mantaFinSpine: path('M1 4Q7 0 12-2'),
        jackalBarrel: path('M15-29H18.5L20-25V-17H14V-25Z'),
        jackalSleeve: path('M15-21H19 M15-24H19 M16.7-28V-25'),
        cometRudder: path('M1 4 6 6 9 14 7 23 3 20 4 13Z'),
        cometRudderEdge: path('M6 8 8 14 6 20')
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

    function drawSwallow(ctx, time, deployment) {
        const pulse = Math.sin(time * 13);
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            ctx.translate(deployment * 3.7, -deployment * 0.7);
            ctx.rotate(-deployment * (0.18 + 0.04 * Math.sin(time * 7)));
            paint(ctx, swallow.tail, alloy(ctx, 6, 9, 12, 22, '#5282ad', '#183351', '#090e21'), frame, 1.4);
            paint(ctx, swallow.tailEdge, '#65d3ff');
            jet(ctx, 5.6, 13, 2.1 + deployment * 0.6, 9 + pulse * 1.5 + deployment * 10, '#32a8ff', '#e0fbff');
            paint(ctx, swallow.wing, '#0c172c', frame, 1.5);
            paint(ctx, swallow.plating, alloy(ctx, 16, -12, 7, 8, '#527ca5', '#2d4e7c', '#101b34'), '#5686ac', 0.65);
            paint(ctx, swallow.edge, alloy(ctx, 22, -19, 14, 3, '#9cddff', '#356a9b', '#111e3a'));
            ctx.save();
            ctx.translate(15, 2);
            ctx.rotate(Math.sin(time * 5) * 0.105);
            ctx.translate(-15, -2);
            paint(ctx, swallow.feather, alloy(ctx, 13, 9, 22, -3, '#123b66', '#3296d7', '#d0f7ff'), '#74d9ff', 0.72);
            if (deployment > 0) {
                ctx.translate(14, 8);
                ctx.rotate(-deployment * 0.24);
                ctx.translate(-14, -8);
                ctx.globalAlpha *= deployment;
                paint(ctx, boostDetails.swallowFeathers, '#325e88', '#83d8f7', 0.95);
                paint(ctx, boostDetails.swallowVanes, null, '#c0f4ff', 0.7);
            }
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

    function drawAtlas(ctx, time, deployment) {
        const pulse = 0.55 + Math.sin(time * 5.2) * 0.36;
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            ctx.translate(deployment * 4.7, deployment * 1.25);
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
            if (deployment > 0) {
                ctx.globalAlpha *= deployment * (0.78 + pulse * 0.22);
                paint(ctx, boostDetails.atlasTrackRim, null, '#dbe992', 1.1);
            }
            ctx.restore();
        }
        jet(ctx, 0, 18, 3 + deployment, 5 + pulse * 2.2 + deployment * 14, '#c4e155', '#fff5b4');
        paint(ctx, atlas.hull, alloy(ctx, -7, -20, 7, 20, '#7e9292', '#384a48', '#172025'), frame, 1.75);
        paint(ctx, atlas.deck, alloy(ctx, 0, -21, 0, 21, '#bec9b7', '#6c8078', '#394943'), '#a6bfa0', 0.7);
        paint(ctx, atlas.ribs, null, '#23352c', 1.2);
        paint(ctx, atlas.socket, '#111d1a', '#89a878', 1.15);
        ctx.save();
        ctx.clip(atlas.socket);
        bloom(ctx, 0, 2, 15.3, '#f4d063');
        core(ctx, 0, 0, 6.6 + deployment * 2.4, pulse, '#adf331', '#f5ffb4');
        ctx.rotate(time * 1.75);
        for (let blade = 0; blade < 5; blade++) {
            ctx.save();
            ctx.translate(0, -deployment * 4.2);
            paint(ctx, atlas.shutter, '#4d5a48', '#d1c78c', 0.83);
            ctx.restore();
            ctx.rotate(tau / 5);
        }
        ctx.restore();
    }

    function gyroscopeHalf(ctx, time, front, radiusX, radiusY, tilt) {
        const start = front ? 0 : Math.PI;
        ctx.save();
        ctx.translate(0, 1.5);
        ctx.rotate(tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, 0, start, start + Math.PI);
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
        ctx.ellipse(0, 0, radiusX + 0.4, radiusY + 0.32, 0, start, start + Math.PI);
        ctx.stroke();
        for (const offset of [0, Math.PI]) {
            const phase = (time * 2.4 + 0.65 + offset) % tau;
            const from = Math.max(start, phase - 0.22);
            const to = Math.min(start + Math.PI, phase + 0.14);
            if (from >= to) continue;
            ctx.strokeStyle = '#fff4c4';
            ctx.lineWidth = 1.7;
            ctx.beginPath();
            ctx.ellipse(0, 0, radiusX + 0.15, radiusY, 0, from, to);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawNeedle(ctx, time, deployment) {
        const tilt = Math.sin(time * 1.7) * 0.28 - 0.21 + deployment * (0.22 + Math.sin(time * 3.2) * 0.23);
        const radiusX = 20 + deployment * 7;
        const radiusY = 6.4 + Math.sin(time * 2.4) * 1.85 + deployment * (5 + 2 * Math.cos(time * 3.2));
        gyroscopeHalf(ctx, time, false, radiusX, radiusY, tilt);
        jet(ctx, 0, 20, 1.6 + deployment * 0.8, 5.1 + Math.sin(time * 11) + deployment * 12, '#ffbe49', '#fff7ca');
        paint(ctx, needle.struts, alloy(ctx, -11, 1, 12, 9, '#fff0a4', '#a8702b', '#56382d'), frame, 1.4);
        paint(ctx, needle.hull, alloy(ctx, -4, -20, 7, 15, '#fff4b6', '#ce922d', '#4a3230'), frame, 1.55);
        paint(ctx, needle.facets, alloy(ctx, -3, -24, 2, 22, '#fff7bf', '#d4a54f', '#986321'), '#edd699', 0.6);
        paint(ctx, needle.obsidian, '#141523', '#6e512e', 0.7);
        paint(ctx, needle.highlights, null, '#fff5cc', 0.85);
        paint(ctx, needle.cradle, '#191726', '#f4cd75', 0.85);
        core(ctx, 0, -1.3, 4.75, 0.6 + Math.sin(time * 6) * 0.34, '#ffb746', '#fff4b9');
        gyroscopeHalf(ctx, time, true, radiusX, radiusY, tilt);
        if (deployment > 0) {
            ctx.save();
            ctx.translate(0, 1.5);
            ctx.rotate(tilt);
            ctx.globalAlpha *= deployment;
            for (const offset of [0, Math.PI]) {
                const angle = time * 7 + offset;
                disc(ctx, Math.cos(angle) * radiusX, Math.sin(angle) * radiusY, 1.25, '#fff5bd');
            }
            ctx.restore();
        }
    }

    function drawManta(ctx, time, deployment) {
        const pulse = 0.5 + Math.sin(time * 4.9) * 0.42;
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            ctx.translate(5 + deployment * 2.6, 0);
            ctx.rotate(Math.sin(time * 4.6) * (0.14 + deployment * 0.16) - deployment * 0.12);
            ctx.save();
            ctx.translate(12, -4);
            ctx.rotate(Math.sin(time * 4.6 - 0.9) * 0.21);
            if (deployment > 0) {
                ctx.save();
                ctx.rotate(-deployment * (0.24 + Math.sin(time * 4.6 - 1.6) * 0.15));
                ctx.globalAlpha *= deployment * 0.85;
                paint(ctx, boostDetails.mantaFinTip, '#195b6b', '#61dfd4', 0.95);
                paint(ctx, boostDetails.mantaFinSpine, null, '#c4fff0', 0.85);
                ctx.restore();
            }
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
        jet(ctx, 0, 18, 1.7 + deployment * 0.7, 7 + pulse + deployment * 12, '#1cf6b8', '#caffeb');
        paint(ctx, manta.body, alloy(ctx, -5, -19, 9, 15, '#7cbfca', '#185b6c', '#0b192b'), frame, 1.4);
        bloom(ctx, 0, -4, 10.4, '#1cbfc8');
        paint(ctx, manta.ionSpine, null, '#8dffe2', 1.15);
        paint(ctx, manta.shell, alloy(ctx, -5, -18, 6, 10, '#d2fff087', '#338caa37', '#00294495'), '#72e8d7', 0.83);
        core(ctx, 0, -3.7, 4.7, pulse, '#2cf5c6', '#d0fff4');
        paint(ctx, manta.crescent, null, '#a3f8f4', 0.72);
    }

    function drawJackal(ctx, time, deployment) {
        const pulse = Math.sin(time * 15);
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            jet(ctx, 14.7, 15.5, 3.5 + deployment * 0.8, 9 + pulse * 1.65 + deployment * 12, '#ff7d2a', '#fff3bf');
            paint(ctx, jackal.skeleton, '#181820', frame, 1.8);
            paint(ctx, jackal.nacelle, alloy(ctx, 14, -15, 22, 9, '#f9bd90', '#ae5b36', '#462525'), '#78442e', 1.1);
            paint(ctx, jackal.bevel, alloy(ctx, 16, -18, 18, 11, '#ffe0b2', '#bb7047', '#6e372d'), '#e3a774', 0.57);
            paint(ctx, jackal.rails, alloy(ctx, 12, -10, 19, 8, '#3c3f4b', '#24242e', '#131521'), '#a3654b', 0.73);
            paint(ctx, jackal.weapon, '#282530', '#a38b79', 0.85);
            paint(ctx, jackal.barrel, null, '#ffc477', 0.95);
            if (deployment > 0) {
                ctx.save();
                const ventCycle = 0.5 + 0.5 * Math.sin(time * 9 + (side < 0 ? 0 : Math.PI));
                ctx.translate(0, (1 - deployment) * 8 + ventCycle * deployment * 1.25);
                ctx.globalAlpha *= deployment;
                paint(ctx, boostDetails.jackalBarrel, '#522f2c', '#da925f', 1);
                ctx.globalAlpha *= 0.5 + ventCycle * 0.5;
                paint(ctx, boostDetails.jackalSleeve, null, '#ffd19a', 0.85);
                ctx.restore();
            }
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

    function drawComet(ctx, time, deployment, steering) {
        const pulse = 0.5 + Math.sin(time * 5.3) * 0.42;
        ctx.save();
        ctx.translate(0, 7);
        ctx.rotate(Math.max(-0.52, Math.min(0.52, steering * 1.22)) + Math.sin(time * 3) * 0.06);
        if (deployment > 0) {
            for (const side of [-1, 1]) {
                ctx.save();
                ctx.scale(side, 1);
                ctx.rotate(-deployment * (0.22 + Math.sin(time * 5) * 0.055 * side));
                ctx.globalAlpha *= deployment;
                paint(ctx, boostDetails.cometRudder, '#594185', '#aa81d8', 0.85);
                paint(ctx, boostDetails.cometRudderEdge, null, '#e6ccff', 0.9);
                ctx.restore();
            }
        }
        jet(ctx, 2, 11, 2 + deployment * 0.7, 5 + pulse * 2 + deployment * 12, '#9b62fb', '#ebc6ff');
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

    const volcanicHulls = [];
    const volcanicPlumes = [];

    function makeVolcanicHull(overdrive, radius) {
        const surface = document.createElement('canvas');
        const resolution = 3;
        surface.width = surface.height = radius * 2 * resolution;
        const ctx = surface.getContext('2d');
        ctx.scale(resolution, resolution);
        ctx.translate(radius, radius);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            paint(ctx, volcanic.bridge, '#52555a', '#14161a', 1.5);
            paint(ctx, volcanic.pod, '#333438', '#121316', 1.6);
            paint(ctx, volcanic.rail, '#787671', '#24272b', 0.7);
            if (overdrive) {
                paint(ctx, volcanicBoost.rail, '#6b3028', '#25171b', 0.9);
                paint(ctx, volcanicBoost.shield, '#bf5437', '#5b2a24', 0.8);
                paint(ctx, volcanicBoost.shieldRim, null, '#efa474', 0.8);
            } else {
                paint(ctx, volcanic.podCap, '#a94630', '#482923', 0.7);
                paint(ctx, volcanic.shield, alloy(ctx, 12, -7, 19, 8, '#e2d9c1', '#bbb099', '#887d70'), '#514a41', 0.65);
                if (side < 0) paint(ctx, volcanic.stripes, '#3f3a34');
                paint(ctx, volcanic.shieldRim, null, '#f6e5c6', 0.65);
            }
            paint(ctx, volcanic.shutters, '#281d1c', '#594139', 0.7);
            paint(ctx, volcanic.nozzle, '#52413d', '#17161a', 0.9);
            paint(ctx, volcanic.throat, '#210f0d');
            disc(ctx, 13.6, -13.3, 0.85, '#ece4ce');
            disc(ctx, 18.4, -13.3, 0.85, '#ece4ce');
            disc(ctx, 13.1, 4.8, 0.58, '#524943');
            disc(ctx, 18.1, -4.6, 0.58, '#524943');
            ctx.restore();
        }
        paint(ctx, volcanic.hull, alloy(ctx, -9, -22, 9, 13, '#686a68', '#45484b', '#242428'), '#121316', 1.6);
        if (overdrive) {
            paint(ctx, volcanicBoost.prow, alloy(ctx, -5, -29, 5, -8, '#eb9e6b', '#b14a32', '#6f332a'), '#201619', 1.6);
            paint(ctx, volcanicBoost.prowEdges, null, '#f6bb88', 0.8);
        } else {
            paint(ctx, volcanic.tiles, '#9f4d33', '#5c3328', 0.65);
        }
        paint(ctx, overdrive ? volcanicBoost.spine : volcanic.roof,
            alloy(ctx, -6, -4, 6, 12, '#f3e8cd', '#d1c5ac', '#8d8374'), '#5e564a', 0.75);
        paint(ctx, volcanic.roofRim, null, '#e5d7bb', 0.62);
        paint(ctx, volcanic.stencil, null, '#5b3931', 1.4);
        paint(ctx, volcanic.cockpit, '#1c2428', '#777c75', 0.8);
        paint(ctx, volcanic.glass, alloy(ctx, -3, -16, 3, -7, '#8cabb2', '#496269', '#252f3a'));
        paint(ctx, volcanic.glassGlint, '#b2c1be88');
        paint(ctx, volcanic.glassFrame, null, '#26323a', 0.8);
        return surface;
    }

    function makeVolcanicPlume(overdrive) {
        const surface = document.createElement('canvas');
        surface.width = 36;
        surface.height = 72;
        const ctx = surface.getContext('2d');
        ctx.translate(18, 4);

        const exhaust = ctx.createLinearGradient(0, 0, 0, 64);
        exhaust.addColorStop(0, overdrive ? '#fff4d5' : '#ffd59b');
        exhaust.addColorStop(0.29, overdrive ? '#ffb14c' : '#dc7c42');
        exhaust.addColorStop(0.66, '#a94628a0');
        exhaust.addColorStop(1, '#6a3f3100');
        paint(ctx, path('M-10 0H10L8 10 11 20 6 33 6 43 0 64-6 45-5 34-10 20-8 10Z'), exhaust);

        // Alternating compression bands inside the twin exhausts.
        const core = ctx.createLinearGradient(0, 0, 0, 42);
        core.addColorStop(0, '#fff4da');
        core.addColorStop(0.52, '#ffd18d');
        core.addColorStop(1, '#fd883c00');
        paint(ctx, path('M-6 1H6L4 8 0 14-4 8Z M0 14 5 19 0 27-5 19Z M0 27 3 32 0 41-3 32Z'), core);
        return surface;
    }

    function drawVolcanic(ctx, time, deployment, steering) {
        const overdrive = deployment > 0;
        const variant = Number(overdrive);
        const plume = volcanicPlumes[variant] ||= makeVolcanicPlume(overdrive);
        const alpha = ctx.globalAlpha;
        for (const side of [-1, 1]) {
            const phase = time * 16 + side * 1.6;
            const length = 12 + deployment * 12 + Math.sin(phase) * 1.5;
            const plumeWidth = 12 + deployment * 4;
            ctx.save();
            ctx.translate(side * 15.5, 16);
            ctx.rotate(steering * 0.55 + side * 0.07);
            ctx.drawImage(plume, -plumeWidth / 2, -1, plumeWidth, length);

            for (let i = 0; i < (overdrive ? 3 : 2); i++) {
                const age = (time * (overdrive ? 3.8 : 2.7) + i * 0.37 + (side + 1) * 0.12) % 1;
                const spread = side * age * (5 + i * 2);
                ctx.globalAlpha = alpha * (1 - age);
                ctx.fillStyle = i === 0 ? '#ffe5b5' : '#d97543';
                ctx.fillRect(spread - 0.6, 4 + age * (length + 5), 1.2 - age * 0.6, 2.1 - age);
            }
            ctx.restore();

            if (overdrive) {
                ctx.save();
                ctx.scale(side, 1);
                ctx.translate(22, 8);
                ctx.rotate((deployment - 1) * 0.72);
                ctx.translate(-22, -8);
                ctx.globalAlpha *= Math.min(1, deployment * 2.25);
                paint(ctx, volcanicBoost.mount, '#53545a', '#18161a', 1.3);
                paint(ctx, volcanicBoost.radiator, '#813629', '#151319', 1.55);
                paint(ctx, volcanicBoost.radiatorFace, '#372623', '#c7764e', 0.65);
                ctx.globalAlpha *= 0.82 + Math.sin(phase * 0.54) * 0.18;
                paint(ctx, volcanicBoost.radiatorSlots, null, '#ffb36c', 1.05);
                ctx.restore();
            }
        }

        const armorBlend = Math.min(1, deployment * 1.6);
        if (armorBlend < 1) {
            const hull = volcanicHulls[0] ||= makeVolcanicHull(false, 27);
            ctx.drawImage(hull, -27, -27, 54, 54);
        }
        if (armorBlend > 0) {
            const hull = volcanicHulls[1] ||= makeVolcanicHull(true, 35);
            ctx.globalAlpha = alpha * armorBlend;
            ctx.drawImage(hull, -35, -35, 70, 70);
        }
        ctx.globalAlpha = alpha * (0.84 + Math.sin(time * 8) * 0.16);
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            paint(ctx, volcanic.fins, null, overdrive ? '#e88d53' : '#835544', 0.85);
            paint(ctx, volcanic.throat, overdrive ? '#ffcb84' : '#ed8c52');
            ctx.restore();
        }
        ctx.globalAlpha = alpha;
    }

    const aurum = {
        mount: path('M5 3 C11 6 15 9 23 3 L24 11 Q15 20 6 13Z'),
        cathedral: path('M17 13 C17 7 21 2 21-6 C21-13 19-16 17-19 C23-17 28-10 28-3 C28 6 33 14 29 22 Q26 27 21 24 Q16 21 17 13Z'),
        nacelle: path('M23-13 C28-7 25 0 28 9 Q31 17 26 22 Q25 15 22 11 C24 2 25-6 23-13Z'),
        grille: path('M20 13 Q23 15 28 13 M20 16 Q23 18 28 16 M20 19 Q22 21 27 19'),
        nozzle: path('M20 21 Q24 24 28 21 L27 25 Q24 28 21 25Z'),
        crownBlade: path('M7 3 C14 2 16-5 14-14 C20-11 22-4 18 3 Q15 10 8 14 L5 9Z'),
        bladeEtching: path('M10 8 C17 4 19-3 16-9 M12 5 Q17 1 15-3'),
        fuselage: path('M0-33 C3-25 8-23 7-14 Q6-8 11-5 Q14 3 9 10 C6 15 9 20 6 24 Q0 28-6 24 C-9 20-6 15-9 10 Q-14 3-11-5 Q-6-8-7-14 C-8-23-3-25 0-33Z'),
        prow: path('M0-31 C2-24 6-22 5-16 Q3-9 0-8 Q-3-9-5-16 C-6-22-2-24 0-31Z'),
        prowSpine: path('M0-27 Q-1-21 0-13 M-6 13 Q-3 13 0 17 Q3 13 6 13 M-5 20 Q0 24 5 20'),
        fluting: path('M-8-5 Q-11 0-8 6 M8-5 Q11 0 8 6 M-6 8 Q-5 10-3 11 M6 8 Q5 10 3 11'),
        setting: path('M0-9 C3-5 7-4 7 1 Q7 6 0 11 Q-7 6-7 1 C-7-4-3-5 0-9Z'),
        ruby: path('M0-6 Q5-2 5 1 Q5 4 0 8 Q-5 4-5 1 Q-5-2 0-6Z'),
        facet: path('M0-5 Q-4-2-3.4 1 Q-3 2.5-1.8 3 Q-2 0 0-2Z'),
        gyroscope: path('M-7 1 C-7 6 7 6 7 1 C7-4-7-4-7 1Z'),
        rotorLight: path('M-5.8-0.7 Q0-3.4 5.8-0.7')
    };

    function drawAurum(ctx, time, deployment, steering) {
        const reduced = detailedShipMotion.matches;
        const pulse = reduced ? 0.5 : 0.5 + Math.sin(time * 3.2) * 0.5;
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            ctx.translate(8, 7);
            ctx.rotate(deployment * 0.12 + side * steering * 0.075 + (reduced ? 0 : Math.sin(time * 2.6) * 0.036));
            ctx.translate(-8, -7);
            jet(ctx, 24, 24, 3 + deployment, 7 + pulse * 1.4 + deployment * 12, '#c46b23', '#fff1ab');
            paint(ctx, aurum.mount, alloy(ctx, 10, 6, 22, 13, '#95704d', '#573747', '#281b31'), frame, 1.5);
            paint(ctx, aurum.cathedral, alloy(ctx, 19, -14, 28, 19, '#f6ce77', '#9e6330', '#3c2530'), frame, 1.5);
            paint(ctx, aurum.nacelle, alloy(ctx, 24, -10, 26, 23, '#fff1bd', '#d79c46', '#866037'), '#573b3a', 0.65);
            paint(ctx, aurum.grille, null, '#382234', 1.15);
            paint(ctx, aurum.nozzle, alloy(ctx, 23, 22, 25, 27, '#fff4b0', '#e8a344', '#78322c'), '#3d2533', 0.82);
            ctx.restore();

            ctx.save();
            ctx.scale(side, 1);
            ctx.translate(8, 6);
            ctx.rotate(deployment * 0.24 + (reduced ? 0 : Math.sin(time * 2.6 - 0.7) * 0.061));
            ctx.translate(-8, -6);
            paint(ctx, aurum.crownBlade, alloy(ctx, 16, -12, 9, 15, '#fff4bb', '#d29839', '#61322e'), '#512c2c', 1.2);
            paint(ctx, aurum.bladeEtching, null, '#ffdb80', 0.92);
            ctx.restore();
        }
        paint(ctx, aurum.fuselage, alloy(ctx, -9, -16, 9, 17, '#fff0b4', '#d4a24c', '#5a3035'), frame, 1.55);
        paint(ctx, aurum.prow, alloy(ctx, -4, -25, 5, -11, '#fff8da', '#f7c970', '#8f542d'), '#794b36', 0.7);
        paint(ctx, aurum.prowSpine, null, '#ffe6a6', 0.85);
        paint(ctx, aurum.fluting, null, '#763b34', 0.85);
        paint(ctx, aurum.setting, '#441a2c', '#ffe3a0', 0.88);
        ctx.save();
        ctx.clip(aurum.ruby);
        paint(ctx, aurum.ruby, alloy(ctx, -4, -7, 5, 8, '#fd7182', '#ab224d', '#320e2d'));
        bloom(ctx, -1, -2, 5 + pulse * 1.8 + deployment, '#ff4d6a');
        paint(ctx, aurum.facet, '#ffe0d9');
        ctx.restore();

        ctx.save();
        ctx.rotate(reduced ? -0.38 : time * 1.6 + deployment * 0.55);
        paint(ctx, aurum.gyroscope, null, '#512237', 1.8);
        paint(ctx, aurum.rotorLight, null, '#fff0a8', 1);
        ctx.restore();
    }

    const valkyrie = {
        root: path('M4-13 Q13-13 16-2 Q15 8 7 13 L3 8Z'),
        feathers: [
            {
                shell: path('M5 3 C12 9 20 9 25 5 C21 15 16 20 10 19 Q6 17 5 11Z'),
                quill: path('M10 13 Q16 15 22 9'),
                light: '#fff198', metal: '#dda62e', shade: '#65452b', edge: '#fff2ad', tipY: 6
            },
            {
                shell: path('M7-2 C15 0 23-2 29-9 C27 1 20 8 13 10 Q8 10 6 6Z'),
                quill: path('M11 5 Q20 4 26-4'),
                light: '#b8dfff', metal: '#3278e6', shade: '#172d64', edge: '#aecdff', tipY: -7
            },
            {
                shell: path('M6-7 C12-16 23-11 29-25 C29-15 25-6 18-1 C12 3 8 2 6 1Z'),
                quill: path('M9-5 C14-11 22-10 27-19'),
                light: '#ffc2a1', metal: '#ee4739', shade: '#7a2334', edge: '#ffc4a6', tipY: -23
            }
        ],
        hull: path('M0-24 C6-20 9-12 8-5 C7 4 9 12 13 21 Q6 20 0 15 Q-6 20-13 21 C-9 12-7 4-8-5 C-9-12-6-20 0-24Z'),
        keel: path('M0-21 Q2-19 3-16 Q1-16 0-13 Q-1-16-3-16Z M-5 7 Q0 11 5 7 Q4 13 0 15 Q-4 13-5 7Z'),
        diadem: path('M-7-14 Q0-22 7-14 Q4-15 0-12 Q-4-15-7-14Z'),
        lens: path('M0-12 C5-10 5.8-3 3 3 Q0 6-3 3 C-5.8-3-5-10 0-12Z'),
        lensShine: path('M0-10 Q-3.8-7-3-3'),
        vents: path('M-6 10 Q-5 13-7.5 16 M6 10 Q5 13 7.5 16')
    };

    function drawValkyrie(ctx, time, deployment, steering) {
        const reduced = detailedShipMotion.matches;
        const wingBeat = 0.5 + (reduced ? 0 : Math.sin(time * 3.8) * 0.5);
        jet(ctx, 0, 16, 3 + deployment, 9 + wingBeat * 2 + deployment * 12, '#e24534', '#ffea8f');
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            paint(ctx, valkyrie.root, '#34334c', frame, 1.4);
            for (const [tier, feather] of valkyrie.feathers.entries()) {
                ctx.save();
                ctx.translate(5, -3);
                const flex = reduced ? 0 : Math.sin(time * 3.8 - (2 - tier) * 0.52) * 0.088;
                ctx.rotate(flex + side * steering * 0.10 - deployment * (0.06 + tier * 0.057));
                ctx.translate(-5, 3);
                paint(ctx, feather.shell, alloy(ctx, 26, feather.tipY, 8, 12, feather.light, feather.metal, feather.shade), frame, 1.35);
                paint(ctx, feather.quill, null, feather.edge, 0.78 + deployment * 0.28);
                ctx.restore();
            }
            ctx.restore();
        }
        paint(ctx, valkyrie.hull, alloy(ctx, -5, -18, 8, 17, '#e3e5e9', '#647496', '#212e4e'), frame, 1.45);
        paint(ctx, valkyrie.keel, '#402638');
        paint(ctx, valkyrie.diadem, alloy(ctx, 0, -19, 0, -12, '#fff4b5', '#ffcd47', '#b37a2e'), '#6c4f38', 0.8);
        paint(ctx, valkyrie.lens, alloy(ctx, -2, -10, 3, 4, '#b2e7ff', '#4d9bfa', '#1c3e82'), '#20223c', 0.9);
        paint(ctx, valkyrie.lensShine, null, '#e5f3ff', 0.95);
        paint(ctx, valkyrie.vents, null, '#fa725b', 1.1);
    }

    const ronin = {
        blade: path('M12 16 Q18 3 17-8 C16-14 18-23 25-28 C21-16 25-8 23 0 C22 8 19 13 15 18Z'),
        bladeEdge: path('M24-26 Q20-17 21-10 C23 0 20 10 15 15'),
        sheath: path('M-10-8 C-18-3-20 9-27 19 Q-25 25-19 22 C-12 20-9 13-7 6Z'),
        sheathLip: path('M-24 21 Q-16 19-13 9 M-21 15 L-17 16 M-19 11 L-15 12'),
        shoulders: path('M-5-10 C-13-10-18-4-17 7 Q-16 13-11 17 L-5 12Z M5-10 C13-10 17-5 17 6 Q17 11 11 17 L5 12Z'),
        shoulderLames: path('M-17 1 Q-12 5-7 4 M-16 7 Q-12 11-7 9 M-13 13 L-8 13 M17 1 Q12 5 7 4 M16 7 Q12 11 7 9 M13 13 L8 13'),
        helmet: path('M0-22 C8-22 12-15 11-8 Q13-1 11 7 C9 14 6 18 0 21 C-6 18-9 14-11 7 Q-13-1-11-8 C-12-15-8-22 0-22Z'),
        lacquer: path('M0-20 C7-20 10-14 9-9 Q0-5-9-9 C-10-14-7-20 0-20Z'),
        crest: path('M-15-19 C-10-14-6-16 0-21 C6-16 10-14 15-19 C12-11 6-10 0-14 C-6-10-12-11-15-19Z'),
        visor: path('M-9-6 Q-5-3 0-5 Q5-3 9-6 L7-1 Q4 2 0 0 Q-4 2-7-1Z'),
        mask: path('M-7 3 Q0 6 7 3 Q6 13 0 17 Q-6 13-7 3Z'),
        maskRibs: path('M-4 6 L-2 12 M0 7 V13 M4 6 L2 12')
    };

    function drawRonin(ctx, time, deployment, steering) {
        const reduced = detailedShipMotion.matches;
        const charge = 0.55 + (reduced ? 0 : Math.sin(time * 4.2) * 0.25) + deployment * 0.2;
        jet(ctx, 0, 19, 3.2, 6 + charge * 2.7 + deployment * 12, '#d42e46', '#ffa991');
        paint(ctx, ronin.sheath, alloy(ctx, -20, -2, -14, 23, '#8f4653', '#60293b', '#25182e'), frame, 1.55);
        paint(ctx, ronin.sheathLip, null, '#e67570', 0.95);
        ctx.save();
        ctx.translate(10, 12);
        ctx.rotate(deployment * 0.19 + steering * 0.07 + (reduced ? 0 : Math.sin(time * 3.3) * 0.045));
        ctx.translate(-10, -12);
        paint(ctx, ronin.blade, alloy(ctx, 23, -18, 17, 13, '#c4ffed', '#549d9d', '#29384d'), frame, 1.6);
        paint(ctx, ronin.bladeEdge, null, deployment > 0.5 ? '#e4fff4' : '#66edda', 1.05);
        if (!reduced) {
            ctx.setLineDash([5.5, 49]);
            ctx.lineDashOffset = -((time * 32 + 8) % 54.5);
            paint(ctx, ronin.bladeEdge, null, '#eefff9', 1.65);
        }
        ctx.restore();
        paint(ctx, ronin.shoulders, alloy(ctx, 0, -9, 13, 16, '#e47771', '#ad3f4b', '#3f223a'), frame, 1.35);
        paint(ctx, ronin.shoulderLames, null, '#492037', 1.2);
        paint(ctx, ronin.helmet, alloy(ctx, -9, -16, 9, 16, '#ae6a70', '#6c394e', '#241a30'), frame, 1.5);
        paint(ctx, ronin.lacquer, alloy(ctx, -5, -20, 4, -9, '#f18777', '#d45254', '#872d42'));
        paint(ctx, ronin.crest, alloy(ctx, -12, -20, 6, -9, '#ffd0a9', '#e96b5f', '#9b3d4e'), '#57263b', 0.8);
        paint(ctx, ronin.mask, '#311b30', '#b6555b', 0.85);
        paint(ctx, ronin.maskRibs, null, '#c97269', 0.85);
        bloom(ctx, 0, -3, 6 + charge * 3, '#12e5c6');
        paint(ctx, ronin.visor, alloy(ctx, 0, -6, 0, 2, '#e4fff5', '#4dffdc', '#159d9c'), '#163337', 0.8);
    }

    const dragon = {
        wing: path('M4 6 C9 2 7-6 14-10 Q22-14 26-18 C21-7 22-2 28 5 C17 2 16 9 17 15 C11 11 8 13 6 17 Q3 12 4 6Z'),
        sail: path('M7 8 Q12 2 11-3 C14-8 20-9 24-15 Q18-3 25 3 C18 1 14 6 15 12 Q10 9 7 13Z'),
        spars: path('M6 10 C13 3 9-2 15-7 Q21-10 26-18 M10 7 Q15 0 24 3 M8 10 Q13 9 16 13'),
        horn: path('M5-13 Q10-18 7-27 Q16-22 12-15 Q10-11 7-8Z'),
        cheek: path('M7-12 C11-13 14-11 15-7 Q13-8 11-6 Q14-4 13 0 Q10-2 7 2 L5-3Z'),
        body: path('M0-6 C8-7 11 1 8 6 Q6 10 5 16 Q0 19-5 16 Q-6 10-8 6 C-11 1-8-7 0-6Z'),
        breast: path('M0-1 Q8 1 6 6 Q4 11 4 15 Q0 18-4 15 Q-4 11-6 6 Q-8 1 0-1Z'),
        scales: path('M-6 3 Q-4 7 0 5 Q4 7 6 3 M-5 8 Q-3 12 0 9 Q3 12 5 8 M-4 12 Q0 16 4 12'),
        head: path('M0-23 C3-22 4-20 5-18 Q10-16 9-10 Q12-6 8-2 Q5 0 0-3 Q-5 0-8-2 Q-12-6-9-10 Q-10-16-5-18 C-4-20-3-22 0-23Z'),
        muzzle: path('M0-21 Q4-19 4-15 Q3-12 5-8 Q3-6 0-8 Q-3-6-5-8 Q-3-12-4-15 Q-4-19 0-21Z'),
        eyes: path('M-8-12 Q-5-12-3-8 Q-7-7-8-12Z M8-12 Q5-12 3-8 Q7-7 8-12Z'),
        link: path('M-4 0 Q0-3 4 0 Q4 5 1 8 Q-1 9-3 6 Q-4 4-4 0Z'),
        linkRim: path('M-3 4 Q0 7 3 4'),
        tailFin: path('M0-2 Q5 0 7 6 Q4 5 3 6 Q2 10-2 11 Q-1 7-5 6 Q-3 2 0-2Z')
    };

    function drawNeoDragon(ctx, time, deployment, steering) {
        const motion = detailedShipMotion.matches ? 0 : 1;
        const beat = Math.sin(time * 4.7) * motion;
        ctx.save();
        ctx.translate(0, 14);
        for (let joint = 0; joint < 3; joint++) {
            ctx.rotate(Math.sin(time * 4.7 - joint * 0.85) * motion * (0.23 + deployment * 0.07));
            paint(ctx, dragon.link, '#8c3034', '#37212c', 1);
            paint(ctx, dragon.linkRim, null, '#df915a', 0.85);
            ctx.translate(0, 5.1);
            ctx.scale(0.84, 0.84);
        }
        paint(ctx, dragon.tailFin, alloy(ctx, -3, 0, 3, 10, '#fcb36d', '#b64c3e', '#670f27'), '#48242c', 1.1);
        ctx.restore();

        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            ctx.translate(5, 4);
            ctx.scale(0.82 + beat * 0.07 + deployment * 0.21, 1);
            ctx.rotate(beat * (0.15 + deployment * 0.05) + side * steering * 0.08 - deployment * 0.17);
            ctx.translate(-5, -4);
            paint(ctx, dragon.wing, '#722d32', '#291c2b', 1.45);
            paint(ctx, dragon.sail, alloy(ctx, 18, -13, 10, 14, '#f3b271', '#c96149', '#6d2b3d'));
            paint(ctx, dragon.spars, null, deployment > 0.5 ? '#ffe0a2' : '#e19768', 0.9);
            ctx.restore();
            jet(ctx, side * 6, 10, 1.45 + deployment * 0.65, 10 + beat * 1.4 + deployment * 9, '#e46832', '#fff1aa');
        }
        paint(ctx, dragon.body, alloy(ctx, -7, -4, 5, 16, '#be5543', '#8b3337', '#50253a'), '#321e2b', 1.4);
        paint(ctx, dragon.breast, alloy(ctx, -4, 1, 5, 14, '#f6bb78', '#c36a46', '#6c2d34'));
        paint(ctx, dragon.scales, null, '#6b3037', 0.95);
        ctx.save();
        ctx.rotate((Math.sin(time * 4.7 - 0.48) * 0.06 + steering * 0.045) * motion);
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            paint(ctx, dragon.horn, alloy(ctx, 9, -25, 8, -11, '#fff0bd', '#d18b59', '#743941'), '#4c2d3b', 0.95);
            paint(ctx, dragon.cheek, alloy(ctx, 13, -10, 7, 1, '#f19464', '#ad473d', '#58253a'), '#452631', 0.95);
            ctx.restore();
        }
        paint(ctx, dragon.head, alloy(ctx, -6, -19, 7, 0, '#ed925b', '#b5433e', '#552139'), '#381e29', 1.4);
        paint(ctx, dragon.muzzle, alloy(ctx, -3, -20, 4, -9, '#ffca8a', '#da774d', '#87393a'), '#6b3236', 0.72);
        disc(ctx, -1.9, -17.5, 0.62, '#673239');
        disc(ctx, 1.9, -17.5, 0.62, '#673239');
        const blink = Math.max(0, 1 - Math.abs(time % 3.7 - 2.85) / 0.13) * motion;
        ctx.translate(0, -9.5);
        ctx.scale(1, 1 - blink * 0.87);
        ctx.translate(0, 9.5);
        paint(ctx, dragon.eyes, deployment > 0.5 ? '#ecffd7' : '#a5f5ba', '#371e2d', 0.9);
        ctx.restore();
    }

    const neko = {
        tail: path('M5 13Q8 25 16 24Q21 23 21 18Q20 14 17 17'),
        pack: path('M-9 1H9L12 7 9 17 5 21H-5L-9 17-12 7Z'),
        helmet: path('M-15-6-16-20Q-16-24-12-21L-5-15Q0-17 5-15L12-21Q16-24 16-20L15-6Q19 0 15 7Q11 14 0 14Q-11 14-15 7Q-19 0-15-6Z'),
        ear: path('M8-14 13-19 13-10Z'),
        patch: path('M-15-8-16-20Q-16-23-13-21L-5-15Q-3-10-6-7Z'),
        visor: path('M-12-8Q0-17 12-8Q17-3 13 4Q9 10 0 10Q-9 10-13 4Q-17-3-12-8Z'),
        glint: path('M-11-6Q-6-10-1-10 M8 6 11 3'),
        eyes: path('M-8-1Q-6-5-4-1 M4-1Q6-5 8-1'),
        face: path('M0 2V4Q-2 6-4 3 M0 4Q2 6 4 3 M-9 2-12 1 M-9 4-12 5 M9 2 12 1 M9 4 12 5'),
        paw: path('M-3-5Q0-7 3-5L4 2Q2 6-2 5L-4 1Z')
    };

    function drawNekoCapsule(ctx, time, deployment) {
        ctx.save();
        ctx.translate(5, 13);
        ctx.rotate(Math.sin(time * 4) * (0.16 + deployment * 0.11) - deployment * 0.45);
        ctx.translate(-5, -13);
        paint(ctx, neko.tail, null, '#29283a', 6);
        paint(ctx, neko.tail, null, '#d78457', 3.4);
        ctx.restore();
        jet(ctx, 0, 18, 3 + deployment, 7 + deployment * 12, '#73c8dc', '#e9fffb');
        paint(ctx, neko.pack, '#445369', '#202237', 1.4);
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.translate(side * (12 + deployment * 6), 8 - deployment * 6);
            ctx.rotate(side * (-0.35 - deployment * 0.66) + Math.sin(time * 5 + side) * 0.11);
            paint(ctx, neko.paw, '#e5d7bb', '#353043', 1.2);
            disc(ctx, 0, 0.7, 1.8, '#ce8871');
            ctx.restore();
        }
        paint(ctx, neko.helmet, alloy(ctx, -12, -18, 12, 12, '#fff3d5', '#e7dbc5', '#a4a2a1'), '#2d293a', 1.55);
        paint(ctx, neko.patch, '#c8754c', '#713b3e', 0.6);
        paint(ctx, neko.ear, '#d89882');
        ctx.save();
        ctx.scale(-1, 1);
        paint(ctx, neko.ear, '#624455');
        ctx.restore();
        paint(ctx, neko.visor, alloy(ctx, -10, -10, 10, 9, '#41586f', '#25394f', '#172438'), '#807a83', 0.85);
        paint(ctx, neko.glint, null, '#accbce', 0.8);
        paint(ctx, neko.eyes, null, '#fff0aa', 1.65);
        paint(ctx, neko.face, null, '#edb7ab', 0.85);
        disc(ctx, 0, 1.8, 0.88, '#efae9c');
    }

    const toaster = {
        body: path('M-12-14H12Q19-14 20-7L22 10Q22 16 16 18H-16Q-22 16-22 10L-20-7Q-19-14-12-14Z'),
        top: path('M-13-13H13Q17-13 19-7H-19Q-17-13-13-13Z'),
        slots: path('M-13-12H-2L-1-8H-15Z M2-12H13L15-8H1Z'),
        fascia: path('M-20 6H20L20 11Q20 14 16 15H-16Q-20 14-20 11Z'),
        vents: path('M-16-3V2 M-13-3V2 M-10-3V2 M10-3V2 M13-3V2 M16-3V2'),
        lever: path('M19-5H23L25-2 23 1H20Z'),
        bread: path('M-5 2V-8Q-7-10-5-13Q0-17 5-13Q7-10 5-8V2Z'),
        butter: path('M-2-10-0.4-11.6 2.2-10 0.5-8Z'),
        dial: path('M0-4V-1')
    };

    function drawApocalypseToaster(ctx, time, deployment) {
        const cycle = 0.5 + 0.5 * Math.sin(time * 9);
        for (const side of [-1, 1]) {
            jet(ctx, side * 11.5, 16, 3 + deployment, 8 + deployment * 12, '#e4814f', '#ffe6a1');
        }
        paint(ctx, toaster.body, alloy(ctx, -16, -10, 16, 16, '#d8ead5', '#81b5a3', '#37636b'), '#21343b', 1.55);
        paint(ctx, toaster.top, '#e1e3cc', '#4e7069', 0.85);
        paint(ctx, toaster.slots, '#27343c', '#6d7b72', 0.65);
        for (const side of [-1, 1]) {
            const lift = 0.5 + 0.5 * Math.sin(time * 7 + side * 1.5);
            ctx.save();
            ctx.translate(side * 7.25, -10 - deployment * (4.1 + lift * 3.8) - lift * 1.3);
            ctx.rotate(side * (0.05 + deployment * 0.19));
            paint(ctx, toaster.bread, alloy(ctx, -4, -13, 4, 2, '#ffe3a2', '#d79753', '#91543b'), '#603d36', 0.8);
            paint(ctx, toaster.butter, '#fff0af');
            ctx.restore();
        }
        paint(ctx, toaster.fascia, '#ddd9bc', '#54756f', 0.78);
        paint(ctx, toaster.vents, null, '#47766e', 0.98);
        ctx.save();
        ctx.translate(0, deployment * 5.5);
        paint(ctx, toaster.lever, '#b95847', '#613c3c', 0.85);
        ctx.restore();
        disc(ctx, 0, 9.5, 4.5, '#35444c');
        disc(ctx, 0, 9.5, 3.1, '#ae5744');
        ctx.save();
        ctx.translate(0, 9.5);
        ctx.rotate(-0.64 + deployment * 1.9);
        paint(ctx, toaster.dial, null, '#ffdfa2', 0.85);
        ctx.restore();
        disc(ctx, -9, 9.4, 1.05, '#546757');
        disc(ctx, 9, 9.4, 1.05 + deployment * cycle * 0.35, deployment > 0.1 ? '#ff9a62' : '#ab6e45');
    }

    const liman = {
        strut: path('M11-8 Q18-10 22-5 L21-1 Q16-4 12-3Z M12 6 Q18 7 21 4 L22 8 Q19 13 10 12Z'),
        float: path('M21-13 C25-13 27-8 27 0 C27 10 25 15 21 15 C17 15 16 9 16 0 C16-8 17-13 21-13Z'),
        bands: path('M17-6 Q21-3 26-6 M16.7 6 Q21.5 8 26.4 6'),
        floatGlint: path('M21-11 Q18-9 18-4 M18 1 V4'),
        chassis: path('M-12-10 Q-18-7-17 4 C-16 15-9 22-5 23 H5 C9 22 16 15 17 4 Q18-7 12-10Z'),
        hull: path('M0-24 C12-24 16-15 16-5 C16 6 10 12 4 13 H-4 C-10 12-16 6-16-5 C-16-15-12-24 0-24Z'),
        hullSeam: path('M-12-14 Q0-24 12-14 M-13 4 Q-10 10-5 11 M13 4 Q10 10 5 11'),
        hatch: path('M-7 12 Q0 15 7 12 L5 20 Q0 22-5 20Z'),
        vents: path('M-3 16 H3 M-2.4 18.4 H2.4'),
        glassGlint: path('M-6.5-8 Q-4.5-13 1-12.4 Q-1-10.7-3.4-10 Q-4.6-9.4-6.5-8Z'),
        glassRim: path('M2 2.4 Q5.4 1.8 6.7-1.3'),
        arm: path('M12 10 Q16 7 16 2 L14-1 Q13-4 15-6'),
        claw: path('M15-6 Q14-8 13-8 M15-6 Q16-8 18-7.5'),
        sonar: path('M-12-20 Q0-32 12-20')
    };

    function drawLiman(ctx, time, deployment, steering) {
        const reduced = detailedShipMotion.matches;
        const ballast = reduced ? 0 : Math.sin(time * 2.1);
        jet(ctx, 0, 22, 4 + deployment * 0.7, 5 + ballast * 0.8 + deployment * 11, '#348aa5', '#e1fff5');
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            ctx.scale(1 + deployment * 0.14, 1);
            ctx.translate(0, ballast * 0.9 + side * steering * 1.35);
            paint(ctx, liman.strut, '#63888a', '#253647', 1.1);
            paint(ctx, liman.float, alloy(ctx, 17, -7, 27, 7, '#ecce87', '#a6824f', '#343546'), frame, 1.35);
            paint(ctx, liman.bands, null, '#554c48', 1.35);
            paint(ctx, liman.floatGlint, null, '#f2d69a', 0.85);
            disc(ctx, 22, 0.5, 1.1, '#a8f5d6');
            ctx.restore();
        }
        paint(ctx, liman.chassis, alloy(ctx, -12, 0, 8, 23, '#759797', '#3a5760', '#1c2537'), frame, 1.4);
        paint(ctx, liman.hull, alloy(ctx, -10, -20, 14, 9, '#ffdea0', '#b7894c', '#514a48'), '#2b2937', 1.45);
        paint(ctx, liman.hullSeam, null, '#edd09a', 0.78);
        paint(ctx, liman.hatch, alloy(ctx, -5, 12, 6, 21, '#c5ad78', '#8c744f', '#464548'), '#203743', 0.95);
        paint(ctx, liman.vents, null, '#242f39', 1.3);
        disc(ctx, 0, -5, 11.7, '#263340');
        disc(ctx, 0, -5, 10.8, alloy(ctx, -6, -14, 7, 4, '#f1dba7', '#997647', '#4e4541'));
        disc(ctx, 0, -5, 8.65, '#182e3e');
        const glass = ctx.createRadialGradient(-3, -9, 0.5, 0, -5, 8);
        glass.addColorStop(0, '#c4ffe9');
        glass.addColorStop(0.41, '#4eaeb3');
        glass.addColorStop(0.76, '#286076');
        glass.addColorStop(1, '#1c3249');
        disc(ctx, 0, -5, 7.95, glass);
        for (let i = 0; i < 8; i++) {
            const tick = i * tau / 8;
            disc(ctx, Math.cos(tick) * 9.8, -5 + Math.sin(tick) * 9.8, 0.58, '#4b413e');
        }
        paint(ctx, liman.glassGlint, '#d1f9e8');
        paint(ctx, liman.glassRim, null, '#71ccc4', 0.7);
        ctx.save();
        ctx.translate(14.3, 8.1);
        ctx.rotate(-deployment * 0.27 + (reduced ? 0 : Math.sin(time * 2.1 - 0.7) * 0.17));
        ctx.translate(-14.3, -8.1);
        paint(ctx, liman.arm, null, '#1b2838', 2.8);
        paint(ctx, liman.arm, null, '#d6b474', 1.3);
        paint(ctx, liman.claw, null, '#efcf92', 0.92);
        disc(ctx, 14.3, 8.1, 1.25, '#748e87');
        ctx.restore();
        if (deployment > 0) {
            ctx.save();
            const wave = (time * 1.65) % 1;
            const travel = reduced ? 0.35 : wave;
            ctx.translate(0, -3 - deployment * travel * 7);
            ctx.scale(1 + deployment * travel * 0.3, 1);
            ctx.globalAlpha *= deployment * (1 - wave) * 0.7;
            paint(ctx, liman.sonar, null, '#a7efdb', 0.9);
            ctx.restore();
        }
    }

    const origami = {
        wing: path('M2-5 25-17 24-9 18-1 27 3 13 9 7 7 2 12Z'),
        fold: path('M3-4 25-17 18-1 27 3 13 9 13 4Z'),
        backing: path('M3-5 16-3 22-8 18-1 27 3 22 5 13 4Z'),
        print: path('M17-10 21-12 17-5 M18 2 23 3 19 5'),
        body: path('M0-18 5-12 6-1 4 8 10 21 0 16-10 21-4 8-6-1-5-12Z'),
        crease: path('M0-15V15 M-6-1 0 3 6-1 M-4 8 0 12 4 8'),
        crown: path('M-4-14 0-23 6-22 11-17 4-18 0-14Z'),
        innerWing: path('M7 4 19 7 15 16 7 12Z')
    };

    function drawOrigami(ctx, time, deployment) {
        jet(ctx, 0, 17, 1.6 + deployment * 0.7, 8 + deployment * 11, '#8081bd', '#f7ece1');
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            ctx.translate(deployment * 2.7, 0);
            ctx.rotate(Math.sin(time * 4.2) * 0.08 - deployment * 0.25);
            if (deployment > 0) {
                ctx.save();
                ctx.translate(0, deployment * 2.8);
                ctx.rotate(deployment * 0.19);
                ctx.globalAlpha *= deployment;
                paint(ctx, origami.innerWing, '#d67c72', '#714b60', 0.8);
                ctx.restore();
            }
            paint(ctx, origami.wing, '#eadcc7', '#4e485a', 1.2);
            paint(ctx, origami.fold, alloy(ctx, 5, -9, 20, 7, '#fff0d8', '#d4cad0', '#9185a1'));
            paint(ctx, origami.backing, '#54547d', '#6f6386', 0.55);
            paint(ctx, origami.print, null, '#fae4cb', 0.82);
            ctx.restore();
        }
        paint(ctx, origami.body, alloy(ctx, -4, -14, 6, 17, '#fff3d9', '#e4d6c5', '#a691a9'), '#5c4b64', 1.05);
        paint(ctx, origami.crease, null, '#a18da7', 0.92);
        paint(ctx, origami.crown, '#b45155', '#6c3d50', 0.85);
    }

    return new Map([
        ['night_swallow', drawSwallow],
        ['iron_atlas', drawAtlas],
        ['sun_needle', drawNeedle],
        ['ion_manta', drawManta],
        ['copper_jackal', drawJackal],
        ['violet_comet', drawComet],
        ['volcanic', drawVolcanic],
        ['aurum', drawAurum],
        ['valkyrie_x', drawValkyrie],
        ['ronin', drawRonin],
        ['dragon', drawNeoDragon],
        ['neko', drawNekoCapsule],
        ['toaster', drawApocalypseToaster],
        ['bathyscaphe_liman', drawLiman],
        ['origami_crane', drawOrigami]
    ]);
})();

const drawVolcanicShot = (() => {
    const casing = new Path2D('M0-10 3.5-5 3.6 4 1.8 7H-1.8L-3.6 4-3.5-5Z');
    const fins = new Path2D('M-2.5-3-5 1-5 6-2.5 4Z M2.5-3 5 1 5 6 2.5 4Z');
    const insert = new Path2D('M0-8 2-4 1.5 3 0 4.5-1.5 3-2-4Z');
    const wake = new Path2D('M-2.4 5H2.4L0 12Z');
    return (ctx, shot) => {
        const scale = shot.r / 4;
        ctx.save();
        ctx.translate(shot.x, shot.y);
        ctx.rotate(Math.atan2(shot.vx, -shot.vy));
        ctx.scale(scale, scale);

        ctx.fillStyle = shot.ascended ? '#f48b4abc' : '#ad4c2dce';
        ctx.fill(wake);
        ctx.fillStyle = '#272329';
        ctx.fill(casing);
        ctx.strokeStyle = shot.plasma ? '#ffcf66' : shot.ascended ? '#ffb47a' : '#d5764c';
        ctx.lineWidth = 1;
        ctx.stroke(casing);
        if (shot.ascended) {
            ctx.fillStyle = '#d86b41';
            ctx.fill(fins);
        }
        ctx.fillStyle = shot.plasma ? '#fff4ae' : shot.ascended ? '#fff3da' : '#ffc08b';
        ctx.fill(insert);
        ctx.restore();
    };
})();

const drawMagmaTrailParticle = (() => {
    let sprite;
    return (ctx, particle, lifeRatio, seq) => {
        if (seq % 2 !== 0 || lifeRatio <= 0) return;
        if (!sprite) {
            sprite = document.createElement('canvas');
            sprite.width = 44;
            sprite.height = 60;
            const art = sprite.getContext('2d');
            art.translate(22, 32);
            const smoke = art.createRadialGradient(0, 8, 1, 0, 8, 19);
            smoke.addColorStop(0, '#9c695da0');
            smoke.addColorStop(0.55, '#685c6280');
            smoke.addColorStop(1, '#4b414d00');
            art.fillStyle = smoke;
            art.fillRect(-22, -11, 44, 38);

            const streak = art.createLinearGradient(0, -26, 0, 7);
            streak.addColorStop(0, '#a34e2d00');
            streak.addColorStop(1, '#d57a48dd');
            art.fillStyle = streak;
            art.fill(new Path2D('M0-26 4 3 0 7-2-1Z M-7-17-4 10-6 13-9 9Z'));

            art.fillStyle = '#51413c';
            art.fill(new Path2D('M-5 0 3-5 9 1 6 9-2 13-7 7Z'));
            art.fillStyle = '#c86f40';
            art.fill(new Path2D('M-5 0 3-5 4 1-1 3-2 8-4 4Z M9 1 6 9-2 13 1 8 5 6Z'));
            art.fillStyle = '#ffe2ac';
            art.fill(new Path2D('M-4 0 2-3 2 0-2 2Z M-10 7-7 8-9 12-11 10Z M13 3 17 5 14 8Z'));
        }
        const life = Math.min(1, lifeRatio);
        const age = 1 - life;
        const side = seq % 4 === 0 ? -1 : 1;
        const variation = 0.78 + (seq % 7) * 0.06;
        const scale = (0.13 + life * 0.24) * variation;
        ctx.save();
        ctx.translate(particle.x + side * (12 + 5 * age) + Math.sin(seq) * age * 4,
            particle.y + age * 11);
        ctx.rotate(side * (0.17 + age * 0.46) + Math.sin(seq * 0.7) * 0.19);
        ctx.globalAlpha *= life * life * 0.86;
        ctx.drawImage(sprite, -22 * scale, -32 * scale, 44 * scale, 60 * scale);
        ctx.restore();
    };
})();
