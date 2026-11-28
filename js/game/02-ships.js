        // Ship perks and ship rendering
        // Extracted from Xpace 1.9.5 Ascension.html; loaded as a classic script.
        const KITSUNE_HULL_PATHS = {
            spine: new Path2D('M0 -29 L3.2 -24.4 L5.6 -18.3 L7.2 -12 L8.1 -1.1 L6.3 9.6 L5.6 18.4 L0 20 L-5.6 18.4 L-6.3 9.6 L-8.1 -1.1 L-7.2 -12 L-5.6 -18.3 L-3.2 -24.4Z'),
            prow: new Path2D('M0 -26.9 L2.3 -23.1 L3.8 -16 L2.2 -13.1 L0 -15 L-2.2 -13.1 L-3.8 -16 L-2.3 -23.1Z'),
            cockpit: new Path2D('M0 -14.9 C3.9 -13.1 4.9 -8.4 4.1 -3.5 L2.4 1.4 L0 3.1 L-2.4 1.4 L-4.1 -3.5 C-4.9 -8.4 -3.9 -13.1 0 -14.9Z'),
            canopyGlint: new Path2D('M-.6 -12.7 Q-2.8 -11 -3 -7.5 L-2.4 -4.6 Q-2.6 -9.9 -.6 -12.7Z'),
            reactor: new Path2D('M0 6 L2.9 9 L1.5 13 L0 14 L-1.5 13 L-2.9 9Z'),
            spar: new Path2D('M5 -8 L13.8 -8.2 L23.5 -1.5 L18.7 7.5 L19.4 11.9 L15.6 15.2 L10.6 12.9 L6.3 16.6 L5 8Z'),
            wing: new Path2D('M8.1 -3.9 L15.4 -5.2 L22 -1.8 L17.7 5.2 L17.6 9.9 L14.8 12.9 L11.5 10.7 L8.2 11.9 L7.2 3.2Z'),
            earPlate: new Path2D('M5.4 -13.5 L10.3 -17.6 L16.9 -27.3 L18.1 -24.7 L17 -18.2 L14.7 -11.2 L18.8 -7.6 L15.1 -4.4 L7.7 -2.4 L6.2 -6.8Z'),
            earInlay: new Path2D('M11 -15.6 L16.8 -24.4 L15.9 -18.8 L13.7 -12.7 L9.9 -9.5Z'),
            vent: new Path2D('M8 -8.2 L16.4 -10 L14.7 -7.4 L8.8 -5.7Z'),
            lightChannels: new Path2D('M9 -7.3 L14.9 -8.8 M14.6 1.6 L18.6 -.3 M15.9 4.1 L17.6 3.2'),
            panelBevels: new Path2D('M7.4 -13.1 L10.6 -16.5 L15.6 -24 M12.9 -3.4 L19.7 -1.6 L17 2.2'),
            nacelle: new Path2D('M7.3 3.8 L11.8 5.5 L13.6 9.6 L12.9 16.8 L11.7 19 L7.8 19 L6.3 16.7 L6.1 9Z'),
            nozzle: new Path2D('M7.3 14.7 L11.9 14.7 L11.6 17.9 L8.2 17.9Z'),
            plume: new Path2D('M7.4 17.1 Q6.9 21.2 9.7 25.2 Q12.9 28.7 10.4 32.2 Q18.3 27.9 14.5 22.3 L11.8 17Z'),
            plumeCore: new Path2D('M8.9 17.5 Q8.1 21 11.7 25.5 Q13.7 27.9 12.9 29.2 Q16 26.1 13.2 22.1 L10.5 17.5Z')
        };

        defineNeonDriftGameMethods({

            getActiveThemeConfig() {
                return PROFILE_THEMES.find(th => th.id === this.pass.state.equippedTheme) || PROFILE_THEMES[0];
            },

            applyThemeClassToElement(el, baseClass, themeCfg) {
                if (!el) return;
                const theme = themeCfg || this.getActiveThemeConfig();
                const nextClass = theme.cssClass ? `${baseClass} ${theme.cssClass}` : baseClass;
                if (el.className === nextClass) return;
                /* v27: безопасная смена темы — без переходов/анимаций в момент свапа,
                   иначе WebView/Chrome может залить карточку белым слоем */
                el.classList.add('theme-swap-lock');
                el.className = `${nextClass} theme-swap-lock`;
                void el.offsetHeight;
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    el.classList.remove('theme-swap-lock');
                }));
            },

            getActiveShipConfig() {
                return SHIP_CATALOG.find(s => s.id === this.pass.state.equippedShip) || SHIP_CATALOG[0];
            },

            // След со скина считается купленным, если куплен сам скин (навсегда, доступен на любом корабле)
            isSkinTrailOwned(trailId) {
                const st = SKIN_TRAILS.find(x => x.id === trailId);
                if (!st) return false;
                return (this.pass.state.unlockedShips || []).includes(st.shipId);
            },

            hasValidEquippedTrail() {
                const t = this.pass.state.equippedTrail;
                return t === 'default'
                    || (this.pass.state.unlockedTrails || []).includes(t)
                    || this.isSkinTrailOwned(t);
            },

            // Выбранный след с учётом следов со скинов (для отрисовки и подсказок)
            resolveEffectiveTrailId(shipCfg) {
                if (shipCfg.id === 'crimson_requiem') return 'requiem_skulls';
                const { equippedTrail } = this.pass.state;
                return TRAIL_ART.has(equippedTrail) ? equippedTrail : (shipCfg.builtinTrail || 'cyan_plasma');
            },

            getActiveShipPerk() {
                const [first, second] = this.pass.state.equippedModules;
                const mode = this.gameMode;
                const flightStyle = this.flightMode();
                const cached = this.modulePerkCache;
                if (cached?.first === first && cached.second === second && cached.mode === mode && cached.flightStyle === flightStyle) return cached.perks;
                const perks = { score: 0, magnet: 0, combo: 0, laser: 0, overdrive: 1, shield: false, buffDuration: 1,
                    coinXp: 0, coinSparks: 0, blueMagnet: 0, grazeCombo: false, grazeSlowmo: false, pulseVolley: false,
                    extraRefit: false, blastRadius: 0, rescueBeacon: false, debuffFilter: false };
                for (const id of [first, second]) {
                    const item = MODULE_BY_ID.get(id);
                    if (!item || (item.mode && item.mode !== mode && item.mode !== flightStyle)) continue;
                    for (const [key, value] of Object.entries(item.perks)) {
                        if (typeof value === 'boolean') perks[key] = value;
                        else perks[key] += value;
                    }
                }
                this.modulePerkCache = { first, second, mode, flightStyle, perks };
                return perks;
            },

            // Million Club: cosmetic only. Hitboxes, damage and cooldowns are unchanged.
            drawRequiemSkull(c, r=6, color='#e63249') {
                c.save(); c.shadowColor='#b50b30'; c.shadowBlur=7;
                const g=c.createLinearGradient(0,-r,0,r);g.addColorStop(0,'#ff8a92');g.addColorStop(.4,color);g.addColorStop(1,'#6b1027');
                c.fillStyle=g;c.strokeStyle='#ff7183';c.lineWidth=.55;
                c.beginPath();c.moveTo(-r*.63,r*.15);c.bezierCurveTo(-r*1.35,-r*.95,r*1.35,-r*.95,r*.63,r*.15);c.lineTo(r*.45,r*.38);c.lineTo(r*.42,r*.82);c.lineTo(-r*.42,r*.82);c.lineTo(-r*.45,r*.38);c.closePath();c.fill();c.stroke();
                c.shadowBlur=0;c.fillStyle='#210811';
                for(const side of [-1,1]){c.beginPath();c.ellipse(side*r*.35,-r*.07,r*.21,r*.23,side*.3,0,Math.PI*2);c.fill();}
                c.beginPath();c.moveTo(0,r*.15);c.lineTo(-r*.13,r*.36);c.lineTo(r*.13,r*.36);c.fill();
                c.strokeStyle='#410c20';c.lineWidth=.65;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(i*r*.2,r*.52);c.lineTo(i*r*.2,r*.79);c.stroke();}c.restore();
            },
            drawRequiemBone(c, scale=1) {
                c.save();c.scale(scale,scale);c.shadowColor='#ff234b';c.shadowBlur=10;
                const g=c.createLinearGradient(-4,0,4,0);g.addColorStop(0,'#7c0f2b');g.addColorStop(.45,'#ffadb0');g.addColorStop(.7,'#eb3a54');g.addColorStop(1,'#9d1234');
                c.fillStyle=g;c.strokeStyle='#ff6c80';c.lineWidth=.7;
                c.beginPath();c.moveTo(-1.8,-6);c.bezierCurveTo(-7,-11,-1,-15,0,-10);c.bezierCurveTo(4,-15,8,-9,2,-6);c.lineTo(2,6);c.bezierCurveTo(8,9,4,15,0,10);c.bezierCurveTo(-4,15,-8,9,-2,6);c.closePath();c.fill();c.stroke();
                c.shadowBlur=0;c.strokeStyle='#ffb1b7';c.lineWidth=.8;c.beginPath();c.moveTo(-.6,-5);c.lineTo(-.6,5);c.stroke();c.restore();
            },
            drawRequiem(c, time=0, morph=0) {
                const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                const t=reduced?0:time;
                const p=Math.max(0,Math.min(1,morph));
                const ease=p*p*(3-2*p);
                const beat=Math.pow(Math.max(0,Math.sin(t*3.2)),12);
                const recoil=Math.max(0,1-(time-(this.lastPlayerShotAt??-100))*11);
                c.save();c.translate(0,Math.sin(t*2.3)*.85+recoil*.7);
                // Soft moving shroud behind the casket. All visuals are bounded and cosmetic.
                for(let side of [-1,1]){
                    c.save();c.scale(side,1);
                    const fire=c.createLinearGradient(0,8,0,61+ease*20);
                    fire.addColorStop(0,'rgba(234,22,65,'+(.25+ease*.28)+')');fire.addColorStop(.48,'rgba(136,8,48,.13)');fire.addColorStop(1,'rgba(136,8,48,0)');c.fillStyle=fire;
                    c.beginPath();c.moveTo(3,12);c.bezierCurveTo(18+ease*9,25,6,35,13+Math.sin(t*5+side)*5,62+ease*15);c.bezierCurveTo(-4,43,0,26,-5,16);c.closePath();c.fill();
                    c.restore();
                }
                // Ascended form: six articulated rib-blades and torn red spectral wings.
                if(ease>.005){
                    c.save();c.globalAlpha=ease;
                    for(let side of [-1,1]){c.save();c.scale(side,1);
                        const sweep=Math.sin(t*4)*2*ease;
                        const wing=c.createLinearGradient(10,0,57*ease,20);wing.addColorStop(0,'rgba(245,40,79,.5)');wing.addColorStop(.6,'rgba(150,15,48,.22)');wing.addColorStop(1,'rgba(60,4,26,0)');c.fillStyle=wing;
                        c.beginPath();c.moveTo(7,-15);c.quadraticCurveTo(34*ease,-30+sweep,57*ease,-13+sweep);c.lineTo(44*ease,0);c.lineTo(52*ease,12+sweep);c.lineTo(33*ease,10);c.lineTo(38*ease,30+sweep);c.quadraticCurveTo(20*ease,16,8,19);c.closePath();c.fill();
                        for(let i=0;i<3;i++){
                            const y=-14+i*12,tipX=35+ease*(18-i*5),tipY=y-9+Math.sin(t*3+i)*1.5;
                            c.strokeStyle='#3b0a20';c.lineWidth=5;c.beginPath();c.moveTo(7,y+5);c.quadraticCurveTo(24*ease,y-10,tipX*ease,tipY);c.stroke();
                            c.strokeStyle='#b73150';c.lineWidth=2;c.stroke();c.strokeStyle='#ff7a8d';c.lineWidth=.6;c.stroke();
                            c.fillStyle='#e65b73';c.beginPath();c.moveTo(tipX*ease,tipY);c.lineTo((tipX-6)*ease,tipY+4);c.lineTo((tipX-3)*ease,tipY-2);c.closePath();c.fill();
                        }c.restore();
                    }
                    // Rotating broken ritual halo, behind the opened shell.
                    c.save();c.translate(0,-2);c.rotate(t*.35);c.scale(1,.85);c.strokeStyle='#a62544';c.lineWidth=.65;
                    for(let i=0;i<8;i++){const a=i*Math.PI/4;c.beginPath();c.arc(0,0,37+ease*3,a+.08,a+.56);c.stroke();c.save();c.rotate(a+.32);c.fillStyle='#fc627e';c.fillRect(40,-1.2,3.2,2.4);c.restore();}c.restore();c.restore();
                }
                // Lid splits into two bevelled panels; the original silhouette returns smoothly.
                if(ease<.005){this.drawRequiemBody(c,t);}else{
                    for(let side of [-1,1]){
                        c.save();c.translate(side*ease*10,-ease*2);c.rotate(side*ease*.19);
                        c.beginPath();c.rect(side<0?-60:0,-60,60,130);c.clip();this.drawRequiemBody(c,t*(1+ease*.7));c.restore();
                    }
                }
                // Pulsating inlaid cracks, with a moving sheen across the lacquer.
                c.save();c.strokeStyle='rgba(255,74,109,'+(.18+beat*.5)+')';c.lineWidth=.65;
                for(let side of [-1,1]){c.beginPath();c.moveTo(side*(4+ease*11),-19);c.lineTo(side*(8+ease*11),-14);c.lineTo(side*(5+ease*11),-5);c.lineTo(side*(8+ease*11),2);c.stroke();}c.restore();
                if(ease>.01){
                    c.save();c.globalAlpha=ease;c.shadowColor='#ff214f';c.shadowBlur=9;
                    const core=c.createRadialGradient(0,-2,1,0,-2,17);core.addColorStop(0,'rgba(255,173,185,.6)');core.addColorStop(.5,'rgba(255,22,72,.35)');core.addColorStop(1,'rgba(180,0,48,0)');c.fillStyle=core;c.fillRect(-18,-21,36,40);
                    c.save();c.translate(0,-2+Math.sin(t*4));this.drawRequiemSkull(c,9.4,'#f34767');c.restore();
                    // Crown and spectral eye beams are unique to overdrive.
                    c.strokeStyle='#f66d85';c.lineWidth=1.3;c.beginPath();c.moveTo(-7,-13);c.lineTo(-9,-23);c.lineTo(-4,-19);c.lineTo(0,-29);c.lineTo(4,-19);c.lineTo(9,-23);c.lineTo(7,-13);c.stroke();
                    c.shadowBlur=4;c.fillStyle='#ffe3e6';c.fillRect(-4.8,-3.8,2.6,1.3);c.fillRect(2.2,-3.8,2.6,1.3);
                    c.restore();
                }
                // Orbiting wisps, detached skulls and rising cinders give the idle form life.
                for(let i=0;i<3;i++){
                    const a=t*(.8+ease*.65)+i*Math.PI*2/3;
                    const r=30+ease*13;
                    c.save();c.translate(Math.cos(a)*r,Math.sin(a)*r*.67);
                    c.globalAlpha=.35+.3*(.5+.5*Math.sin(a));c.rotate(Math.sin(a)*.3);
                    c.scale(.48+ease*.12,.48+ease*.12);this.drawRequiemSkull(c,4.5,'#ce2b4f');
                    c.fillStyle='rgba(239,33,84,.3)';c.beginPath();c.moveTo(-2,3);c.quadraticCurveTo(Math.sin(t*4+i)*7,9,1,15);c.quadraticCurveTo(4,7,2,3);c.fill();c.restore();
                }
                for(let i=0;i<10;i++){
                    const q=((t*(.18+ease*.2)+i*.127)%1+1)%1;
                    const x=Math.sin(i*2.4+t*.4)*(21+ease*19);
                    c.save();c.globalAlpha=Math.sin(q*Math.PI)*(.3+ease*.25);c.fillStyle=i%3?'#ed345a':'#ffb1ba';c.beginPath();c.arc(x,30-q*72,.45+(i%3)*.18,0,Math.PI*2);c.fill();c.restore();
                }
                c.restore();
            },

            drawRequiemBody(c, time=0) {
                const pulse=.5+.5*Math.sin(time*2.4);
                // Subdued aura, not a solid glow blob: preserves the lacquer silhouette.
                c.save();const aura=c.createRadialGradient(0,2,8,0,2,39);aura.addColorStop(0,'rgba(207,14,51,.24)');aura.addColorStop(.65,'rgba(124,0,30,.12)');aura.addColorStop(1,'rgba(124,0,30,0)');c.fillStyle=aura;c.fillRect(-40,-40,80,82);c.restore();
                const chain=(front)=>{
                    for(let orbit=0;orbit<2;orbit++){
                        const tilt=orbit===0?-.48:.65;
                        for(let i=0;i<26;i++){
                            const a=i/26*Math.PI*2+time*(orbit===0?.42:-.32),z=Math.sin(a);
                            if((z>=0)!==front)continue;
                            const x=Math.cos(a)*25,y=z*9;
                            const px=x*Math.cos(tilt)-y*Math.sin(tilt),py=x*Math.sin(tilt)+y*Math.cos(tilt)+Math.sin(a*3+time*2)*.9;
                            const dx=-25*Math.sin(a),dy=9*Math.cos(a);
                            c.save();c.translate(px,py);c.rotate(Math.atan2(dx*Math.sin(tilt)+dy*Math.cos(tilt),dx*Math.cos(tilt)-dy*Math.sin(tilt)));
                            c.lineWidth=1.65;c.strokeStyle=front?'#71172c':'#36101e';c.shadowColor='#d4163f';c.shadowBlur=front?2.5:0;
                            c.beginPath();c.ellipse(0,0,2.4,i%2?1.05:1.65,0,0,Math.PI*2);c.stroke();
                            c.shadowBlur=0;c.lineWidth=.55;c.strokeStyle=front?'#e25060':'#872638';c.beginPath();c.ellipse(-.2,-.25,2.05,i%2?.7:1.25,0,Math.PI,Math.PI*1.85);c.stroke();c.restore();
                        }
                    }
                };
                chain(false);
                const outline=(inset=0)=>{const k=1-inset;c.beginPath();c.moveTo(-8*k,-26*k);c.lineTo(8*k,-26*k);c.lineTo(15*k,-14*k);c.lineTo(10*k,24*k);c.lineTo(-10*k,24*k);c.lineTo(-15*k,-14*k);c.closePath();};
                // Extruded lower shell and bevelled lid.
                c.save();c.translate(1.2,3);outline();c.fillStyle='#160812';c.fill();c.lineWidth=1.4;c.strokeStyle='#5f172c';c.stroke();c.restore();
                const body=c.createLinearGradient(-16,-10,16,10);body.addColorStop(0,'#a83546');body.addColorStop(.12,'#541426');body.addColorStop(.45,'#3c101d');body.addColorStop(.7,'#260b17');body.addColorStop(.92,'#671729');body.addColorStop(1,'#b34651');
                outline();c.fillStyle=body;c.fill();c.strokeStyle='#ce5965';c.lineWidth=1;c.stroke();
                outline(.13);const lid=c.createLinearGradient(-10,-23,12,20);lid.addColorStop(0,'#7f1a30');lid.addColorStop(.4,'#4d1023');lid.addColorStop(1,'#200914');c.fillStyle=lid;c.fill();c.lineWidth=.65;c.strokeStyle='#bd4259';c.stroke();
                outline(.21);c.strokeStyle='#5a1b30';c.lineWidth=.5;c.stroke();
                // Engraved symmetrical thorn filigree.
                c.save();c.strokeStyle='#b04456';c.lineWidth=.5;
                for(const side of [-1,1]){c.save();c.scale(side,1);c.beginPath();c.moveTo(5,-19);c.bezierCurveTo(14,-7,4,-9,8,3);c.bezierCurveTo(12,13,4,10,5,20);c.stroke();for(let i=0;i<4;i++){const y=-12+i*8;c.beginPath();c.moveTo(7,y);c.lineTo(10,y-2);c.moveTo(7,y);c.lineTo(4.7,y-3);c.stroke();}c.restore();}
                c.restore();
                // Red-metal side handles, rivets and lacquer highlight.
                for(const side of [-1,1])for(const y of [-9,3,14]){const x=side*(y<0?13:11);c.strokeStyle='#3a0d20';c.lineWidth=2.8;c.beginPath();c.ellipse(x,y,1.5,2,0,0,Math.PI*2);c.stroke();c.strokeStyle='#c35161';c.lineWidth=.65;c.stroke();}
                for(const x of [-7,7])for(const y of [-23,21]){c.fillStyle='#e1858c';c.beginPath();c.arc(x,y,.65,0,Math.PI*2);c.fill();}
                c.strokeStyle='rgba(255,160,168,.32)';c.lineWidth=.65;c.beginPath();c.moveTo(-6.5,-24);c.lineTo(-12.5,-13);c.lineTo(-8.5,20);c.stroke();
                // Cathedral cross with a ruby core and tiny skull seal.
                c.save();c.shadowColor='#ff2349';c.shadowBlur=4+pulse*3;c.strokeStyle='#9d253d';c.lineWidth=3;c.beginPath();c.moveTo(0,-17);c.lineTo(0,3);c.moveTo(-5.5,-10);c.lineTo(5.5,-10);c.stroke();c.shadowBlur=0;c.strokeStyle='#ef9097';c.lineWidth=.7;c.beginPath();c.moveTo(-.6,-16);c.lineTo(-.6,1);c.moveTo(-5,-10.6);c.lineTo(4.8,-10.6);c.stroke();c.fillStyle='#ff5470';c.beginPath();c.moveTo(0,-14);c.lineTo(2.5,-10);c.lineTo(0,-6);c.lineTo(-2.5,-10);c.closePath();c.fill();c.restore();
                c.save();c.translate(0,11);this.drawRequiemSkull(c,4.7,'#b43149');c.restore();
                chain(true);
                // A few restrained embers beyond the body, no extra gameplay entities.
                c.save();for(let i=0;i<6;i++){const a=i*2.399+time*.22,r=29+Math.sin(i+time)*3;c.globalAlpha=.2+.25*Math.sin(time*1.4+i)**2;c.fillStyle='#ff4161';c.beginPath();c.arc(Math.cos(a)*r,Math.sin(a)*r,.45+(i%2)*.2,0,Math.PI*2);c.fill();}c.restore();
            },
            drawKitsune(ctx, primary, secondary, time) {
                const phase = detailedShipMotion.matches ? 0 : time;
                const pulse = .82 + Math.sin(phase * 6.3) * .18;
                const hull = KITSUNE_HULL_PATHS;

                ctx.save();
                ctx.translate(0, Math.sin(phase * 3.2) * .55);
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.shadowBlur = 0;

                // Each outboard engine leaves its own curved tail of plasma.
                for (const side of [-1, 1]) {
                    ctx.save();
                    ctx.scale(side, 1);
                    ctx.translate(9.5, 17.2);
                    ctx.rotate(Math.sin(phase * 4.7 + side) * .11);
                    ctx.translate(-9.5, -17.2);
                    const accent = side < 0 ? primary : secondary;
                    const exhaust = ctx.createLinearGradient(8.8, 16.6, 13.2, 32);
                    exhaust.addColorStop(0, '#f7fcff');
                    exhaust.addColorStop(.24, accent);
                    exhaust.addColorStop(.69, side < 0 ? '#e639a88f' : '#34c6e491');
                    exhaust.addColorStop(1, 'transparent');
                    ctx.fillStyle = exhaust;
                    ctx.shadowColor = accent;
                    ctx.shadowBlur = 7 * pulse;
                    ctx.fill(hull.plume);
                    ctx.shadowBlur = 0;
                    ctx.globalAlpha *= .7;
                    ctx.fill(hull.plumeCore);
                    ctx.restore();
                }

                // Forward canards form the ears. Separate swept wings and nacelles carry the stern.
                for (const side of [-1, 1]) {
                    ctx.save();
                    ctx.scale(side, 1);
                    ctx.fillStyle = '#25172f';
                    ctx.strokeStyle = '#1b1228';
                    ctx.lineWidth = 1.35;
                    ctx.fill(hull.spar);
                    ctx.stroke(hull.spar);

                    const wing = ctx.createLinearGradient(8, -4, 19, 12);
                    wing.addColorStop(0, '#f7889b');
                    wing.addColorStop(.31, '#a93a68');
                    wing.addColorStop(.68, '#65264f');
                    wing.addColorStop(1, '#38254b');
                    ctx.fillStyle = wing;
                    ctx.strokeStyle = '#a35d83';
                    ctx.lineWidth = .76;
                    ctx.fill(hull.wing);
                    ctx.stroke(hull.wing);

                    const ceramic = ctx.createLinearGradient(13, -27, 10, -2);
                    ceramic.addColorStop(0, '#fff0d4');
                    ceramic.addColorStop(.24, '#efb5a9');
                    ceramic.addColorStop(.52, '#a85a78');
                    ceramic.addColorStop(.68, '#fce0c8');
                    ceramic.addColorStop(1, '#60375d');
                    ctx.fillStyle = ceramic;
                    ctx.strokeStyle = '#291830';
                    ctx.lineWidth = 1.1;
                    ctx.fill(hull.earPlate);
                    ctx.stroke(hull.earPlate);

                    const inset = ctx.createLinearGradient(11, -21, 13, -9);
                    inset.addColorStop(0, primary);
                    inset.addColorStop(1, '#542446');
                    ctx.fillStyle = inset;
                    ctx.fill(hull.earInlay);
                    ctx.fillStyle = '#27152e';
                    ctx.fill(hull.vent);
                    ctx.strokeStyle = '#ffe3c6';
                    ctx.lineWidth = .62;
                    ctx.stroke(hull.panelBevels);

                    const engine = ctx.createLinearGradient(6, 0, 13, 17);
                    engine.addColorStop(0, '#e994a0');
                    engine.addColorStop(.29, '#692c54');
                    engine.addColorStop(.65, '#371c40');
                    engine.addColorStop(1, '#151328');
                    ctx.fillStyle = engine;
                    ctx.strokeStyle = '#b37296';
                    ctx.lineWidth = .73;
                    ctx.fill(hull.nacelle);
                    ctx.stroke(hull.nacelle);

                    ctx.fillStyle = side < 0 ? primary : secondary;
                    ctx.strokeStyle = ctx.fillStyle;
                    ctx.shadowColor = ctx.fillStyle;
                    ctx.shadowBlur = 4.5 * pulse;
                    ctx.fill(hull.nozzle);
                    ctx.lineWidth = .75;
                    ctx.stroke(hull.lightChannels);
                    ctx.restore();
                }

                const fuselage = ctx.createLinearGradient(-7, -18, 6, 18);
                fuselage.addColorStop(0, '#ffddba');
                fuselage.addColorStop(.28, '#bf7290');
                fuselage.addColorStop(.53, '#6e345b');
                fuselage.addColorStop(1, '#2c1b3c');
                ctx.fillStyle = fuselage;
                ctx.strokeStyle = '#301b3c';
                ctx.lineWidth = 1.25;
                ctx.fill(hull.spine);
                ctx.stroke(hull.spine);

                const nose = ctx.createLinearGradient(0, -26, 1, -12);
                nose.addColorStop(0, '#fff3d9');
                nose.addColorStop(.52, '#e96b8d');
                nose.addColorStop(1, '#963358');
                ctx.fillStyle = nose;
                ctx.fill(hull.prow);

                const glass = ctx.createLinearGradient(-4.3, -12, 3.7, 2);
                glass.addColorStop(0, '#aec7e3');
                glass.addColorStop(.25, '#5486a7');
                glass.addColorStop(.6, '#24244d');
                glass.addColorStop(1, '#141429');
                ctx.fillStyle = glass;
                ctx.strokeStyle = '#23152e';
                ctx.lineWidth = 1;
                ctx.fill(hull.cockpit);
                ctx.stroke(hull.cockpit);
                ctx.fillStyle = '#d8fbffac';
                ctx.fill(hull.canopyGlint);

                ctx.fillStyle = primary;
                ctx.shadowColor = primary;
                ctx.shadowBlur = 6 * pulse;
                ctx.fill(hull.reactor);
                ctx.shadowBlur = 0;

                for (const side of [-1, 1]) {
                    const twinkle = phase * 3 + side;
                    ctx.fillStyle = side < 0 ? primary : secondary;
                    ctx.shadowColor = ctx.fillStyle;
                    ctx.shadowBlur = 3;
                    ctx.beginPath();
                    ctx.ellipse(side * (13 + Math.sin(twinkle) * 2.6), 25 + Math.cos(twinkle) * 3,
                        .85, .65, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            },

            getShipSuperDeployment() {
                const reduced = detailedShipMotion.matches;
                const remaining = this.overdriveActive ? this.overdriveTimer : this.superEffectTimer;
                const duration = this.overdriveActive ? this.overdriveDuration : this.runSuper?.duration;
                let progress = 0;
                if (remaining > 0 && duration > 0) {
                    progress = reduced ? 1 : Math.max(0, Math.min(1, (duration - remaining) / 0.36, remaining / 0.24));
                }
                for (const wave of this.empWaves) {
                    if (!wave.fromSuper) continue;
                    const pulse = reduced ? 1 : Math.min(1, (1 - wave.alpha) / 0.27, wave.alpha / 0.35);
                    progress = Math.max(progress, pulse);
                }
                return progress * progress * (3 - 2 * progress);
            },

            // Уникальные корпуса кораблей — детализированные модели + парящая голова «42»
            drawShipShape(ctx, shipCfg, time = 0, scale = 1, steering = 0, overdrive = false, shotPulse = 0, superDeployment) {
                const primary = shipCfg.primary || '#00f3ff';
                const secondary = shipCfg.secondary || '#ffffff';
                const shape = shipCfg.shape || 'arrow';

                ctx.save();
                ctx.scale(scale, scale);

                const drawModel = detailedShipModels.get(shipCfg.id);
                if (drawModel) {
                    const motion = detailedShipMotion.matches ? 0.35 : 1;
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';
                    ctx.shadowBlur = 0;
                    // Deploy at ignition and retract just before the boost expires.
                    const progress = overdrive && motion === 1 && Number.isFinite(this.overdriveTimer) && Number.isFinite(this.overdriveDuration)
                        ? Math.max(0, Math.min(1, (this.overdriveDuration - this.overdriveTimer) / 0.36, this.overdriveTimer / 0.24))
                        : Number(overdrive);
                    const deployment = superDeployment ?? progress * progress * (3 - 2 * progress);
                    drawModel(ctx, time * motion, deployment, steering * motion, shotPulse);
                } else if (shape === 'requiem') {
                    this.drawRequiem(ctx, time, shipCfg.requiemMorph || 0);
                } else if (shape === 'astral') {
                    // Призрачный корабль «ASTRAL WRAITH» — эфирный корпус со звёздным ядром и орбитальным нимбом
                    const pulse = 0.78 + Math.sin(time * 3.8) * 0.22;
                    const halo = time * 1.1;

                    // Внешний орбитальный нимб
                    ctx.save();
                    ctx.translate(0, 2);
                    ctx.rotate(halo * 0.4);
                    ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
                    ctx.shadowColor = '#60a5fa';
                    ctx.shadowBlur = 14;
                    ctx.lineWidth = 1.4;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 22, 8, 0, 0, Math.PI * 2);
                    ctx.stroke();
                    // Орбитальные звёздочки
                    for (let i = 0; i < 4; i++) {
                        const a = halo + i * Math.PI / 2;
                        const ox = Math.cos(a) * 22, oy = Math.sin(a) * 8;
                        ctx.fillStyle = i % 2 ? '#c4b5fd' : '#bae6fd';
                        ctx.shadowColor = ctx.fillStyle;
                        ctx.shadowBlur = 8;
                        ctx.beginPath();
                        ctx.arc(ox, oy, 1.4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();

                    // Прозрачные эфирные крылья
                    for (let side = -1; side <= 1; side += 2) {
                        const wingGrad = ctx.createLinearGradient(side * 5, -6, side * 18, 10);
                        wingGrad.addColorStop(0, 'rgba(186, 230, 253, 0.75)');
                        wingGrad.addColorStop(0.6, 'rgba(196, 181, 253, 0.45)');
                        wingGrad.addColorStop(1, 'rgba(96, 165, 250, 0)');
                        ctx.fillStyle = wingGrad;
                        ctx.shadowColor = secondary;
                        ctx.shadowBlur = 10;
                        ctx.beginPath();
                        ctx.moveTo(side * 4, -6);
                        ctx.quadraticCurveTo(side * 14, -2 + Math.sin(time * 2.4) * 1.5, side * 18, 10);
                        ctx.lineTo(side * 8, 8);
                        ctx.lineTo(side * 5, 2);
                        ctx.closePath();
                        ctx.fill();
                        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }

                    // Полупрозрачный эфирный корпус
                    const hullGrad = ctx.createLinearGradient(0, -22, 0, 14);
                    hullGrad.addColorStop(0, 'rgba(186, 230, 253, 0.85)');
                    hullGrad.addColorStop(0.45, 'rgba(96, 165, 250, 0.55)');
                    hullGrad.addColorStop(0.8, 'rgba(124, 58, 237, 0.45)');
                    hullGrad.addColorStop(1, 'rgba(67, 56, 118, 0)');
                    ctx.fillStyle = hullGrad;
                    ctx.shadowColor = primary;
                    ctx.shadowBlur = 14;
                    ctx.beginPath();
                    ctx.moveTo(0, -22);
                    ctx.quadraticCurveTo(6.5, -10, 5.5, 8);
                    ctx.lineTo(0, 13);
                    ctx.lineTo(-5.5, 8);
                    ctx.quadraticCurveTo(-6.5, -10, 0, -22);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
                    ctx.lineWidth = 0.85;
                    ctx.stroke();

                    // Пульсирующее звёздное ядро
                    ctx.fillStyle = '#ffffff';
                    ctx.shadowColor = '#ffffff';
                    ctx.shadowBlur = 16 * pulse;
                    ctx.beginPath();
                    ctx.arc(0, -6, 2.4 * pulse, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = primary;
                    ctx.shadowColor = primary;
                    ctx.beginPath();
                    ctx.arc(0, -6, 1.2, 0, Math.PI * 2);
                    ctx.fill();

                    // Лёгкий звёздный след-сопло
                    const flameH = 5 + Math.sin(time * 22) * 1.4;
                    const fGrad = ctx.createLinearGradient(0, 13, 0, 13 + flameH);
                    fGrad.addColorStop(0, '#ffffff');
                    fGrad.addColorStop(0.5, secondary);
                    fGrad.addColorStop(1, 'rgba(196, 181, 253, 0)');
                    ctx.fillStyle = fGrad;
                    ctx.shadowColor = secondary;
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.moveTo(-2.2, 13);
                    ctx.lineTo(0, 13 + flameH);
                    ctx.lineTo(2.2, 13);
                    ctx.closePath();
                    ctx.fill();
                    ctx.shadowBlur = 0;
                } else if (shape === 'kitsune') {
                    this.drawKitsune(ctx, primary, secondary, time);
                } else if (shape === 'aurora') {
                    // Биоморфный AURORA WRAITH с текучими энергетическими лентами
                    const pulse = 0.72 + Math.sin(time * 4.5) * 0.22;
                    const wave = Math.sin(time * 5.2) * 2.2;
                    ctx.save();
                    ctx.globalAlpha = 0.55;
                    ctx.lineCap = 'round';
                    ctx.shadowBlur = 14;
                    [['#67e8f9', -1], ['#c084fc', 1]].forEach(([color, side]) => {
                        ctx.strokeStyle = color;
                        ctx.shadowColor = color;
                        ctx.lineWidth = 2.2;
                        ctx.beginPath();
                        ctx.moveTo(side * 8, 1);
                        ctx.bezierCurveTo(side * (20 + wave), 5, side * (24 - wave), 14, side * 13, 22);
                        ctx.stroke();
                    });
                    ctx.restore();

                    const body = ctx.createLinearGradient(-18, -18, 18, 15);
                    body.addColorStop(0, '#ecfeff');
                    body.addColorStop(0.24, primary);
                    body.addColorStop(0.62, secondary);
                    body.addColorStop(1, '#17143f');
                    ctx.shadowColor = primary;
                    ctx.shadowBlur = 18 * pulse;
                    ctx.fillStyle = body;
                    ctx.beginPath();
                    ctx.moveTo(0, -22);
                    ctx.bezierCurveTo(-5, -12, -8, -7, -22, 7);
                    ctx.quadraticCurveTo(-25, 11, -17, 10);
                    ctx.lineTo(-8, 6);
                    ctx.lineTo(-5, 15);
                    ctx.quadraticCurveTo(0, 11, 5, 15);
                    ctx.lineTo(8, 6);
                    ctx.lineTo(17, 10);
                    ctx.quadraticCurveTo(25, 11, 22, 7);
                    ctx.bezierCurveTo(8, -7, 5, -12, 0, -22);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(236, 254, 255, 0.9)';
                    ctx.lineWidth = 1.15;
                    ctx.stroke();

                    ctx.shadowBlur = 0;
                    ctx.fillStyle = '#07142b';
                    ctx.beginPath();
                    ctx.moveTo(0, -13);
                    ctx.quadraticCurveTo(-5, -3, -3, 5);
                    ctx.quadraticCurveTo(0, 9, 3, 5);
                    ctx.quadraticCurveTo(5, -3, 0, -13);
                    ctx.fill();
                    const core = ctx.createLinearGradient(0, -11, 0, 5);
                    core.addColorStop(0, '#ffffff');
                    core.addColorStop(0.45, primary);
                    core.addColorStop(1, secondary);
                    ctx.fillStyle = core;
                    ctx.beginPath();
                    ctx.moveTo(0, -10);
                    ctx.quadraticCurveTo(-2.5, -1, 0, 4);
                    ctx.quadraticCurveTo(2.5, -1, 0, -10);
                    ctx.fill();
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(-17, 6);
                    ctx.quadraticCurveTo(-9, 0, -5, -7);
                    ctx.moveTo(17, 6);
                    ctx.quadraticCurveTo(9, 0, 5, -7);
                    ctx.stroke();
                    ctx.fillStyle = '#ffffff';
                    [-13, 13].forEach(x => {
                        ctx.beginPath();
                        ctx.arc(x, 7, 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    });
                } else if (shape === 'lotus') {
                    // Кристаллический VOID LOTUS с раскрывающимися лепестками
                    const bloom = Math.sin(time * 3.8) * 1.6;
                    ctx.save();
                    ctx.shadowColor = secondary;
                    ctx.shadowBlur = 15;
                    for (let side = -1; side <= 1; side += 2) {
                        for (let i = 0; i < 3; i++) {
                            const petal = ctx.createLinearGradient(0, -14, side * 22, 15);
                            petal.addColorStop(0, i === 0 ? '#f5d0fe' : primary);
                            petal.addColorStop(1, i === 2 ? '#3b0764' : secondary);
                            ctx.fillStyle = petal;
                            ctx.globalAlpha = 0.82 + i * 0.06;
                            ctx.beginPath();
                            ctx.moveTo(side * 2, 9);
                            ctx.quadraticCurveTo(side * (9 + i * 5), -3 - i * 5 - bloom, side * (12 + i * 4), -12 + i * 7);
                            ctx.quadraticCurveTo(side * (24 + i * 2), 2 + i * 3, side * (8 + i * 2), 14 - i * 2);
                            ctx.closePath();
                            ctx.fill();
                            ctx.strokeStyle = 'rgba(245, 208, 254, 0.62)';
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }
                    }
                    ctx.restore();

                    ctx.save();
                    ctx.strokeStyle = 'rgba(103, 232, 249, 0.6)';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 4]);
                    ctx.beginPath();
                    ctx.ellipse(0, 2, 23, 8, time * 0.35, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();

                    const crystal = ctx.createLinearGradient(-7, -20, 8, 16);
                    crystal.addColorStop(0, '#ffffff');
                    crystal.addColorStop(0.28, '#f0abfc');
                    crystal.addColorStop(0.62, primary);
                    crystal.addColorStop(1, '#581c87');
                    ctx.shadowColor = primary;
                    ctx.shadowBlur = 20;
                    ctx.fillStyle = crystal;
                    ctx.beginPath();
                    ctx.moveTo(0, -23);
                    ctx.lineTo(7, -6);
                    ctx.lineTo(5, 11);
                    ctx.lineTo(0, 18);
                    ctx.lineTo(-5, 11);
                    ctx.lineTo(-7, -6);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = '#fdf4ff';
                    ctx.lineWidth = 1.1;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                    ctx.beginPath();
                    ctx.moveTo(0, -20);
                    ctx.lineTo(0, 12);
                    ctx.lineTo(-4, 8);
                    ctx.lineTo(-5, -5);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.shadowColor = '#ffffff';
                    ctx.shadowBlur = 12;
                    ctx.beginPath();
                    ctx.arc(0, 0, 3.2 + Math.sin(time * 5) * 0.45, 0, Math.PI * 2);
                    ctx.fill();
                } else if (shape === 'prism') {
                    // Голографический PRISMATIC SERAPH из разноцветных кристаллических граней
                    const shimmer = Math.sin(time * 4) * 0.5 + 0.5;
                    ctx.save();
                    ctx.globalAlpha = 0.42;
                    ctx.strokeStyle = secondary;
                    ctx.shadowColor = primary;
                    ctx.shadowBlur = 18;
                    ctx.lineWidth = 1.3;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 25, 10, time * 0.5, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();

                    const facets = [
                        ['#67e8f9', [0, -23, -7, -5, -24, 4, -8, 5]],
                        ['#f0abfc', [0, -23, 7, -5, 24, 4, 8, 5]],
                        ['#818cf8', [-24, 4, -17, 14, -6, 8, -8, 5]],
                        ['#fb7185', [24, 4, 17, 14, 6, 8, 8, 5]],
                        ['#fef08a', [-8, 5, -6, 17, 0, 11, 0, -23]],
                        ['#c084fc', [8, 5, 6, 17, 0, 11, 0, -23]]
                    ];
                    ctx.shadowColor = primary;
                    ctx.shadowBlur = 15;
                    facets.forEach(([color, pts], i) => {
                        ctx.fillStyle = color;
                        ctx.globalAlpha = 0.78 + ((i + Math.floor(shimmer * 2)) % 3) * 0.07;
                        ctx.beginPath();
                        ctx.moveTo(pts[0], pts[1]);
                        for (let p = 2; p < pts.length; p += 2) ctx.lineTo(pts[p], pts[p + 1]);
                        ctx.closePath();
                        ctx.fill();
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    });
                    ctx.globalAlpha = 1;
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = '#ffffff';
                    ctx.shadowColor = '#ffffff';
                    ctx.shadowBlur = 16;
                    ctx.beginPath();
                    ctx.moveTo(0, -14);
                    ctx.lineTo(3.5, -1);
                    ctx.lineTo(0, 8);
                    ctx.lineTo(-3.5, -1);
                    ctx.closePath();
                    ctx.fill();
                    for (let i = 0; i < 4; i++) {
                        const a = time * 1.8 + i * Math.PI / 2;
                        const x = Math.cos(a) * 25;
                        const y = Math.sin(a) * 11;
                        ctx.save();
                        ctx.translate(x, y);
                        ctx.rotate(a);
                        ctx.fillStyle = i % 2 ? secondary : primary;
                        ctx.fillRect(-1.4, -1.4, 2.8, 2.8);
                        ctx.restore();
                    }
                } else if (shape === 'saucer') {
                    // Детализированное НЛО «Зета-9» с двойным ободом, пилотом и грави-лучом
                    const glow = 0.55 + Math.sin(time * 5) * 0.35;

                    // Гравитационный луч снизу
                    const beamGrad = ctx.createLinearGradient(0, 6, 0, 22);
                    beamGrad.addColorStop(0, `rgba(74, 222, 128, ${0.34 + glow * 0.16})`);
                    beamGrad.addColorStop(1, 'rgba(0, 245, 212, 0)');
                    ctx.fillStyle = beamGrad;
                    ctx.beginPath();
                    ctx.moveTo(-7, 6);
                    ctx.lineTo(7, 6);
                    ctx.lineTo(12, 22);
                    ctx.lineTo(-12, 22);
                    ctx.closePath();
                    ctx.fill();

                    // Нижний энергетический реактор
                    ctx.fillStyle = '#00f5d4';
                    ctx.beginPath();
                    ctx.ellipse(0, 7.5, 7, 3, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Основной металлический диск
                    const discGrad = ctx.createLinearGradient(-20, -2, 20, 8);
                    discGrad.addColorStop(0, '#1e293b');
                    discGrad.addColorStop(0.5, '#4ade80');
                    discGrad.addColorStop(1, '#064e3b');

                    ctx.shadowColor = primary;
                    ctx.shadowBlur = 18;
                    ctx.fillStyle = discGrad;
                    ctx.beginPath();
                    ctx.ellipse(0, 2, 20, 7.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#a7f3d0';
                    ctx.lineWidth = 1.6;
                    ctx.stroke();

                    // Внутреннее кольцо палубы
                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = 'rgba(9, 1, 20, 0.65)';
                    ctx.lineWidth = 1.4;
                    ctx.beginPath();
                    ctx.ellipse(0, 1, 14.5, 4.8, 0, 0, Math.PI * 2);
                    ctx.stroke();

                    // Стеклянный купол кабины с бликом
                    const domeGrad = ctx.createRadialGradient(-2.5, -7, 1, 0, -4, 10);
                    domeGrad.addColorStop(0, '#ffffff');
                    domeGrad.addColorStop(0.4, '#a7f3d0');
                    domeGrad.addColorStop(1, 'rgba(16, 185, 129, 0.72)');
                    ctx.fillStyle = domeGrad;
                    ctx.beginPath();
                    ctx.ellipse(0, -3.5, 9.5, 8, 0, Math.PI, 0);
                    ctx.quadraticCurveTo(9.5, -1, 0, -1);
                    ctx.quadraticCurveTo(-9.5, -1, -9.5, -3.5);
                    ctx.fill();

                    // Силуэт пришельца в кабине
                    ctx.fillStyle = '#064e3b';
                    ctx.beginPath();
                    ctx.arc(0, -5.5, 2.4, 0, Math.PI * 2);
                    ctx.fill();

                    // 6 орбитальных неоновых огней по ободу
                    const lights = ['#ff2a85', '#ffd60a', '#00f5d4', '#ff2a85', '#ffd60a', '#00f5d4'];
                    for (let i = 0; i < 6; i++) {
                        const a = time * 3.2 + (i * Math.PI) / 3;
                        const lx = Math.cos(a) * 16.5;
                        const ly = 2.2 + Math.sin(a) * 5.2;
                        ctx.fillStyle = lights[i];
                        ctx.beginPath();
                        ctx.arc(lx, ly, 2.0, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } else if (shape === 'ghost') {
                    // Детализированный призрак «Фантом 404» со спектральным градиентом и нимбом
                    const wave = Math.sin(time * 7) * 1.8;
                    const flicker = 0.88 + Math.sin(time * 8) * 0.08;
                    ctx.globalAlpha = flicker;

                    // Голографический сбойный нимб над головой
                    ctx.strokeStyle = '#ff0a78';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.ellipse(0, -20.5, 8.5, 2.4, 0, 0, Math.PI * 2);
                    ctx.stroke();

                    // Спектральный градиент тела
                    const ghostGrad = ctx.createLinearGradient(0, -18, 0, 16);
                    ghostGrad.addColorStop(0, '#ecfeff');
                    ghostGrad.addColorStop(0.45, '#67e8f9');
                    ghostGrad.addColorStop(1, 'rgba(56, 189, 248, 0.25)');

                    ctx.shadowColor = '#00f5d4';
                    ctx.shadowBlur = 20;
                    ctx.fillStyle = ghostGrad;
                    ctx.beginPath();
                    ctx.moveTo(0, -17);
                    ctx.quadraticCurveTo(15, -12, 14, 3);
                    ctx.lineTo(14.5, 13 + wave * 0.4);
                    ctx.quadraticCurveTo(10, 8, 7, 14 - wave * 0.5);
                    ctx.quadraticCurveTo(3.5, 8.5, 0, 14.5 + wave * 0.5);
                    ctx.quadraticCurveTo(-3.5, 8.5, -7, 14 - wave * 0.5);
                    ctx.quadraticCurveTo(-10, 8, -14.5, 13 + wave * 0.4);
                    ctx.lineTo(-14, 3);
                    ctx.quadraticCurveTo(-15, -12, 0, -17);
                    ctx.closePath();
                    ctx.fill();

                    // Призрачные ручки-плавники
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = 'rgba(103, 232, 249, 0.65)';
                    ctx.beginPath();
                    ctx.ellipse(-14.5, 1 + wave * 0.4, 3.5, 2, -0.4, 0, Math.PI * 2);
                    ctx.ellipse(14.5, 1 - wave * 0.4, 3.5, 2, 0.4, 0, Math.PI * 2);
                    ctx.fill();

                    // Выразительные глаза с неоновыми зрачками
                    ctx.fillStyle = '#06121a';
                    ctx.beginPath();
                    ctx.ellipse(-4.8, -4.5, 2.9, 4.0, -0.08, 0, Math.PI * 2);
                    ctx.ellipse(4.8, -4.5, 2.9, 4.0, 0.08, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#00f5d4';
                    ctx.beginPath();
                    ctx.arc(-4.5, -5.2, 1.2, 0, Math.PI * 2);
                    ctx.arc(5.1, -5.2, 1.2, 0, Math.PI * 2);
                    ctx.fill();

                    // Удивлённый призрачный ротик
                    ctx.fillStyle = '#06121a';
                    ctx.beginPath();
                    ctx.ellipse(0, 1.8, 2.0, 2.6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                } else if (shape === 'cassette') {
                    // Детализированная ретро-кассета 1989 с прозрачным окном ленты и бобинами
                    ctx.shadowColor = '#ff0a78';
                    ctx.shadowBlur = 16;

                    // Корпус кассеты
                    const caseGrad = ctx.createLinearGradient(-16, -12, 16, 13);
                    caseGrad.addColorStop(0, '#2e1065');
                    caseGrad.addColorStop(1, '#090114');
                    ctx.fillStyle = caseGrad;
                    drawRoundRect(ctx, -16, -12, 32, 24, 3.5);
                    ctx.fill();
                    ctx.strokeStyle = '#ff0a78';
                    ctx.lineWidth = 1.8;
                    ctx.stroke();

                    ctx.shadowBlur = 0;
                    // Угловые винтики
                    ctx.fillStyle = '#94a3b8';
                    [[-13.2, -9.2], [13.2, -9.2], [-13.2, 9.2], [13.2, 9.2]].forEach(([sx, sy]) => {
                        ctx.beginPath();
                        ctx.arc(sx, sy, 1.0, 0, Math.PI * 2);
                        ctx.fill();
                    });

                    // Яркая наклейка синтвейв
                    const labelGrad = ctx.createLinearGradient(-13, -9, 13, 0);
                    labelGrad.addColorStop(0, '#ff0a78');
                    labelGrad.addColorStop(0.55, '#ffd60a');
                    labelGrad.addColorStop(1, '#00f5d4');
                    ctx.fillStyle = labelGrad;
                    drawRoundRect(ctx, -13, -9.5, 26, 16.5, 2);
                    ctx.fill();

                    // Верхняя белая полоска для подписи
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(-11.5, -8, 23, 3.2);
                    ctx.fillStyle = '#ff0a78';
                    ctx.fillRect(-10, -7, 11, 1.2);

                    // Тёмное центральное окно с видимой магнитной лентой
                    ctx.fillStyle = '#090114';
                    drawRoundRect(ctx, -10.5, -3.2, 21, 8.8, 2.5);
                    ctx.fill();

                    // Коричневая магнитная лента внутри окна
                    ctx.fillStyle = '#78350f';
                    ctx.fillRect(-5, -1.5, 10, 5.5);

                    // Две вращающиеся зубчатые катушки
                    const spin = time * 3.5;
                    [-5.6, 5.6].forEach((cx, i) => {
                        ctx.fillStyle = '#f8fafc';
                        ctx.beginPath();
                        ctx.arc(cx, 1.2, 3.4, 0, Math.PI * 2);
                        ctx.fill();

                        ctx.fillStyle = '#090114';
                        ctx.beginPath();
                        ctx.arc(cx, 1.2, 1.5, 0, Math.PI * 2);
                        ctx.fill();

                        ctx.strokeStyle = '#00f5d4';
                        ctx.lineWidth = 1.1;
                        for (let sp = 0; sp < 3; sp++) {
                            const ang = spin + i * 1.4 + (sp * Math.PI * 2) / 3;
                            ctx.beginPath();
                            ctx.moveTo(cx + Math.cos(ang) * 1.4, 1.2 + Math.sin(ang) * 1.4);
                            ctx.lineTo(cx + Math.cos(ang) * 3.1, 1.2 + Math.sin(ang) * 3.1);
                            ctx.stroke();
                        }
                    });

                    // Нижняя трапеция считывающей головки
                    ctx.fillStyle = '#1e1b4b';
                    ctx.beginPath();
                    ctx.moveTo(-10, 12);
                    ctx.lineTo(-8, 7.5);
                    ctx.lineTo(8, 7.5);
                    ctx.lineTo(10, 12);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = '#00f5d4';
                    ctx.lineWidth = 1.1;
                    ctx.stroke();
                } else if (shape === 'skin42') {
                    // Шуточный скин «42»: просто парящая вырезанная голова Пятёрки (PNG без корабля и рамок)
                    const bob = Math.sin(time * 5) * 1.2;
                    ctx.shadowColor = 'rgba(255, 214, 10, 0.55)';
                    ctx.shadowBlur = 12;
                    if (SKIN42_PORTRAIT_IMG && SKIN42_PORTRAIT_IMG.complete && SKIN42_PORTRAIT_IMG.naturalWidth > 0) {
                        const aspect = SKIN42_PORTRAIT_IMG.naturalWidth / Math.max(1, SKIN42_PORTRAIT_IMG.naturalHeight);
                        const drawH = 44;
                        const drawW = drawH * aspect;
                        ctx.drawImage(SKIN42_PORTRAIT_IMG, -drawW / 2, -drawH / 2 + bob, drawW, drawH);
                    } else {
                        ctx.fillStyle = '#ffd60a';
                        ctx.font = '900 18px "Exo 2", sans-serif';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText('42', 0, bob);
                    }
                } else {
                    ctx.shadowColor = primary;
                    ctx.shadowBlur = 16;
                    ctx.fillStyle = primary;
                    ctx.beginPath();
                    ctx.moveTo(0, -20);
                    ctx.lineTo(16, 14);
                    ctx.lineTo(0, 8);
                    ctx.lineTo(-16, 14);
                    ctx.closePath();
                    ctx.fill();

                    ctx.fillStyle = secondary;
                    ctx.beginPath();
                    ctx.moveTo(0, -9);
                    ctx.lineTo(5, 4);
                    ctx.lineTo(-5, 4);
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.restore();
            }
        });
