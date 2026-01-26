(function() {
    'use strict';

    // Core State
    let isEmulating = true;
    let nudge10x = false;
    let isDarkMode = localStorage.getItem('manond_theme') !== 'light';
    let modifiers = { Shift: false, Control: false, Alt: false, Space: false };

    // --- NEW ICON SET (Geometric & Sharp) ---
    const ICONS = {
        pointer: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2l13 12.5-5.5 1.5 4.5 7-3 2-4.5-7-3 3V2z"/></svg>`,
        pen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/></svg>`,
        knife: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 4.5L17 8 4 21 2 22l1-2L16 7l3.5-3.5a1 1 0 0 1 1.414 1.414z"/></svg>`,
        rect: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
        sidebearing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="2" x2="4" y2="22"/><line x1="20" y1="2" x2="20" y2="22"/><path d="M9 12h6m-1-3 4 3-4 3m-4-6-4 3 4 3"/></svg>`,
        ruler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 7h20v10H2z"/><path d="M6 7v4m4-4v4m4-4v4m4-4v4"/></svg>`,
        hand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8v-4"/></svg>`,
        zoomIn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
        zoomOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
        fit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
        undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 8h12a7 7 0 0 1 0 14H9"/><path d="M8 3 3 8l5 5"/></svg>`,
        redo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 8H9a7 7 0 0 0 0 14h6"/><path d="M16 3l5 5-5 5"/></svg>`,
        decompose: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/><path d="M11 11l2 2"/></svg>`,
        all: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm6 9l2 2 4-4"/></svg>`,
        none: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
        cut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
        copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
        paste: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
        delete: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
        up: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 15V9m-3 3 3-3 3 3"/></svg>`,
        down: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 9v6m-3-3 3 3 3-3"/></svg>`,
        left: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M15 12H9m3-3-3 3 3 3"/></svg>`,
        right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 12h6m-3-3 3 3-3 3"/></svg>`,
        sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
        moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
    };

    const styleCSS = `
        :root { --m-bg: rgba(22, 22, 24, 0.95); --m-text: #fff; --m-border: rgba(255, 255, 255, 0.15); --m-btn: rgba(255, 255, 255, 0.08); --m-btn-hover: rgba(255, 255, 255, 0.15); --m-sub: #888; --m-accent: #3498db; }
        .light-mode { --m-bg: rgba(248, 249, 250, 0.95); --m-text: #1a1a1a; --m-border: rgba(0, 0, 0, 0.12); --m-btn: rgba(0, 0, 0, 0.05); --m-btn-hover: rgba(0, 0, 0, 0.08); --m-sub: #555; --m-accent: #2980b9; }
        .manond-ui { position: fixed; background: var(--m-bg); color: var(--m-text); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--m-border); border-radius: 12px; width: 195px; z-index: 2147483647; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; box-shadow: 0 10px 40px rgba(0,0,0,0.4); touch-action: none; overflow: hidden; display: flex; flex-direction: column; }
        .manond-title-bar { background: rgba(125,125,125,0.05); padding: 6px 10px; cursor: move; font-size: 9px; font-weight: 800; color: var(--m-sub); border-bottom: 1px solid var(--m-border); display: flex; justify-content: space-between; align-items: center; letter-spacing: 0.5px; }
        .title-controls { display: flex; gap: 5px; }
        #mToggle, #themeToggle { height: 24px; border-radius: 4px; cursor: pointer; border: none; font-weight: 800; font-size: 8px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        #mToggle { width: 40px; }
        #themeToggle { width: 30px; background: var(--m-btn); color: var(--m-text); }
        .undo-redo-section { padding: 8px 10px; border-bottom: 1px solid var(--m-border); }
        .section-content { padding: 8px 10px; }
        .tab-group-label { background: rgba(125,125,125,0.02); padding: 8px 10px; font-size: 9px; font-weight: 700; color: var(--m-accent); border-bottom: 1px solid var(--m-border); cursor: pointer; display: flex; justify-content: space-between; text-transform: uppercase; }
        .manond-ui button { width: 100%; margin-top: 5px; padding: 0; border: none; border-radius: 6px; background: var(--m-btn); color: var(--m-text); cursor: pointer; font-size: 10px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; height: 32px; transition: all 0.1s; }
        .manond-ui button:active { transform: scale(0.97); }
        .manond-ui button:hover { background: var(--m-btn-hover); }
        .manond-ui svg { width: 14px; height: 14px; }
        .nudge-btns svg { width: 22px; height: 22px; }
        .manond-ui .btn-row { display: flex; gap: 5px; margin-top: 5px; }
        .manond-ui .btn-row button { width: 100%; margin-top: 0; }
        .btn-xl { height: 38px !important; font-size: 11px !important; }
        .btn-micro { height: 26px !important; font-size: 9px !important; font-weight: 700; text-transform: uppercase; }
        .btn-delete { background: #e74c3c !important; color: #fff !important; font-weight: 800; margin-top: 10px; height: 36px !important; }
        .btn-delete:active { background: #c0392b !important; }
        .section-label { font-size: 8px; color: var(--m-sub); margin: 8px 0 4px 0; text-transform: uppercase; cursor: pointer; font-weight: 800; display: flex; justify-content: space-between; background: rgba(125,125,125,0.08); padding: 4px 8px; border-radius: 4px; }
        .toggle-on { background: #27ae60 !important; color: #fff; }
        .toggle-off { background: #c0392b !important; color: #fff; }
        .mod-active { background: #2980b9 !important; color: #fff; }
        .nudge-active { background: #e67e22 !important; color: #fff; }
        .collapsed { display: none !important; }
    `;

    function buildUI() {
        if (document.getElementById('manond-panel')) return;
        const style = document.createElement('style'); style.innerHTML = styleCSS; document.head.appendChild(style);
        const panel = document.createElement('div');
        panel.id = 'manond-panel';
        panel.className = `manond-ui ${isDarkMode ? '' : 'light-mode'}`;

        // Initial Clamping for Loader
        let savedX = parseInt(localStorage.getItem('manond_x')) || 20;
        let savedY = parseInt(localStorage.getItem('manond_y')) || 60;
        savedX = Math.max(0, Math.min(savedX, window.innerWidth - 195));
        savedY = Math.max(0, Math.min(savedY, window.innerHeight - 100));
        panel.style.left = savedX + 'px';
        panel.style.top = savedY + 'px';

        const getS = (id) => localStorage.getItem('manond_col_' + id) === 'true';

        panel.innerHTML = `
            <div class="manond-title-bar" id="dragHandle">
                <span>Manond Touch Kit</span>
                <div class="title-controls">
                    <button id="themeToggle">${isDarkMode ? ICONS.sun : ICONS.moon}</button>
                    <button id="mToggle" class="toggle-on">PEN</button>
                </div>
            </div>
            <div class="undo-redo-section">
                <div class="btn-row" style="margin-top:0;">
                    <button style="background: rgba(52, 73, 94, 0.8); color: #fff;" onclick="window.manondTool('z', 'KeyZ', true)">${ICONS.undo} UNDO</button>
                    <button style="background: rgba(52, 73, 94, 0.8); color: #fff;" onclick="window.manondTool('z', 'KeyZ', true, true)">${ICONS.redo} REDO</button>
                </div>
            </div>
            <div class="tab-group-label" data-target="homeContent">Home <span class="arr">${getS('homeContent')?'▶':'▼'}</span></div>
            <div id="homeContent" class="${getS('homeContent')?'collapsed':''} section-content">
                <div class="section-label" data-target="toolSect">Tools <span class="arr">${getS('toolSect')?'▶':'▼'}</span></div>
                <div id="toolSect" class="${getS('toolSect')?'collapsed':''}">
                    <div class="btn-row">
                        <button onclick="window.manondTool('1', 'Digit1')">${ICONS.pointer}</button>
                        <button onclick="window.manondTool('2', 'Digit2')">${ICONS.pen}</button>
                        <button onclick="window.manondTool('3', 'Digit3')">${ICONS.knife}</button>
                        <button onclick="window.manondTool('4', 'Digit4')">${ICONS.rect}</button>
                    </div>
                    <div class="btn-row">
                        <button onclick="window.manondTool('5', 'Digit5')">${ICONS.sidebearing}</button>
                        <button onclick="window.manondTool('6', 'Digit6')">${ICONS.ruler}</button>
                        <button onclick="window.manondTool('7', 'Digit7')">${ICONS.hand}</button>
                    </div>
                    <div class="btn-row" style="margin-top:8px;">
                        <button class="btn-micro" onclick="window.manondTool('-', 'Minus', true)">${ICONS.zoomOut}</button>
                        <button class="btn-micro" onclick="window.manondTool('=', 'Equal', true)">${ICONS.zoomIn}</button>
                        <button class="btn-micro" onclick="window.manondTool('0', 'Digit0', true)">${ICONS.fit}</button>
                    </div>
                </div>
                <div class="section-label" data-target="modSect">Modifiers <span class="arr">${getS('modSect')?'▶':'▼'}</span></div>
                <div id="modSect" class="${getS('modSect')?'collapsed':''}">
                    <div class="btn-row">
                        <button id="modShift">SHFT</button>
                        <button id="modCtrl">CTRL</button>
                        <button id="modAlt">ALT</button>
                    </div>
                    <button id="modSpace" class="btn-micro" style="height:28px!important;">${ICONS.hand} PAN</button>
                    <button id="modRelease" class="btn-micro" style="background:#e67e22; color:#fff;">Release All</button>
                </div>
            </div>
            <div class="tab-group-label" data-target="editContent">Edit <span class="arr">${getS('editContent')?'▶':'▼'}</span></div>
            <div id="editContent" class="${getS('editContent')?'collapsed':''} section-content">
                <button id="btnDecompose" class="btn-micro" style="background: rgba(142, 68, 173, 0.6); color: #fff;" onclick="window.manondTool('d', 'KeyD', true, true)">${ICONS.decompose} Decompose</button>
                <div class="btn-row">
                    <button class="btn-xl" onclick="window.manondTool('a', 'KeyA', true)">${ICONS.all} All</button>
                    <button class="btn-xl" onclick="window.manondTool('a', 'KeyA', true, true)">${ICONS.none} None</button>
                </div>
                <div class="btn-row">
                    <button class="btn-xl" onclick="window.manondTool('x', 'KeyX', true)">${ICONS.cut}</button>
                    <button class="btn-xl" onclick="window.manondTool('c', 'KeyC', true)">${ICONS.copy}</button>
                    <button class="btn-xl" onclick="window.manondTool('v', 'KeyV', true)">${ICONS.paste}</button>
                </div>
                <button class="btn-delete" onclick="window.manondTool('Backspace', 'Backspace')">${ICONS.delete} DELETE</button>
                <div class="section-label" data-target="nudgeSect">Nudge <span class="arr">${getS('nudgeSect')?'▶':'▼'}</span></div>
                <div id="nudgeSect" class="${getS('nudgeSect')?'collapsed':''}">
                    <button id="btnNudge10" class="btn-micro">Multiplier: 1X</button>
                    <div class="nudge-btns">
                        <button onclick="window.manondKey('ArrowUp', 'ArrowUp')">${ICONS.up}</button>
                        <div class="btn-row">
                            <button onclick="window.manondKey('ArrowLeft', 'ArrowLeft')">${ICONS.left}</button>
                            <button onclick="window.manondKey('ArrowDown', 'ArrowDown')">${ICONS.down}</button>
                            <button onclick="window.manondKey('ArrowRight', 'ArrowRight')">${ICONS.right}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        initLogic(panel);
    }

    function initLogic(panel) {
        panel.querySelector('#themeToggle').onclick = () => {
            isDarkMode = !isDarkMode; panel.classList.toggle('light-mode', !isDarkMode);
            panel.querySelector('#themeToggle').innerHTML = isDarkMode ? ICONS.sun : ICONS.moon;
            localStorage.setItem('manond_theme', isDarkMode ? 'dark' : 'light');
        };
        const nudgeBtn = panel.querySelector('#btnNudge10');
        nudgeBtn.onclick = () => { nudge10x = !nudge10x; nudgeBtn.innerText = `Multiplier: ${nudge10x ? '10X' : '1X'}`; nudgeBtn.classList.toggle('nudge-active', nudge10x); };
        panel.querySelectorAll('[data-target]').forEach(label => {
            label.onclick = () => {
                const targetId = label.getAttribute('data-target');
                const targetEl = document.getElementById(targetId);
                const isNowCollapsed = targetEl.classList.toggle('collapsed');
                label.querySelector('.arr').innerText = isNowCollapsed ? '▶' : '▼';
                localStorage.setItem('manond_col_' + targetId, isNowCollapsed);
            };
        });
        const setupMod = (id, sKey, keyVal, codeVal) => {
            const mB = panel.querySelector(id);
            mB.onclick = () => {
                modifiers[sKey] = !modifiers[sKey]; mB.classList.toggle('mod-active', modifiers[sKey]);
                window.dispatchEvent(new KeyboardEvent(modifiers[sKey] ? 'keydown' : 'keyup', { key: keyVal, code: codeVal, bubbles: true }));
            };
        };
        setupMod('#modShift', 'Shift', 'Shift', 'ShiftLeft'); setupMod('#modCtrl', 'Control', 'Control', 'ControlLeft'); setupMod('#modAlt', 'Alt', 'Alt', 'AltLeft'); setupMod('#modSpace', 'Space', ' ', 'Space');
        panel.querySelector('#modRelease').onclick = () => {
            Object.keys(modifiers).forEach(k => { if(modifiers[k]) window.dispatchEvent(new KeyboardEvent('keyup', { key: k==='Space'?' ':k, bubbles: true })); modifiers[k] = false; });
            nudge10x = false; nudgeBtn.innerText = 'Multiplier: 1X'; nudgeBtn.classList.remove('nudge-active');
            panel.querySelectorAll('.mod-active').forEach(b => b.classList.remove('mod-active'));
        };
        panel.querySelector('#mToggle').onclick = function() { isEmulating = !isEmulating; this.innerText = isEmulating ? 'PEN' : 'OFF'; this.className = isEmulating ? 'toggle-on' : 'toggle-off'; };

        // DRAG LOGIC WITH SCREEN CLAMPING
        let drag = false, sx, sy;
        const dh = panel.querySelector('#dragHandle');
        dh.onpointerdown = (e) => { drag = true; sx = e.clientX - panel.offsetLeft; sy = e.clientY - panel.offsetTop; panel.setPointerCapture(e.pointerId); };
        panel.onpointermove = (e) => {
            if (drag) {
                let x = e.clientX - sx;
                let y = e.clientY - sy;
                x = Math.max(0, Math.min(x, window.innerWidth - panel.offsetWidth));
                y = Math.max(0, Math.min(y, window.innerHeight - panel.offsetHeight));
                panel.style.left = x + 'px';
                panel.style.top = y + 'px';
            }
        };
        panel.onpointerup = () => { drag = false; localStorage.setItem('manond_x', panel.style.left); localStorage.setItem('manond_y', panel.style.top); };
    }

    window.manondKey = (key, code) => {
        const t = document.querySelector('canvas') || document.body;
        t.dispatchEvent(new KeyboardEvent('keydown', { key, code, bubbles: true, shiftKey: nudge10x || modifiers.Shift, ctrlKey: modifiers.Control, altKey: modifiers.Alt }));
        setTimeout(() => t.dispatchEvent(new KeyboardEvent('keyup', { key, code, bubbles: true })), 50);
    };
    window.manondTool = (key, code, ctrl = false, shift = false) => {
        const t = document.querySelector('canvas') || document.body;
        t.dispatchEvent(new KeyboardEvent('keydown', { key, code, ctrlKey: ctrl, shiftKey: shift, bubbles: true }));
    };
    const bridge = (type, e) => {
        const canvas = document.querySelector('canvas'); if (!canvas) return;
        canvas.dispatchEvent(new MouseEvent(type, { clientX: e.clientX, clientY: e.clientY, bubbles: true, view: window, buttons: (type === 'mouseup') ? 0 : 1, shiftKey: modifiers.Shift, ctrlKey: modifiers.Control, altKey: modifiers.Alt }));
    };
    const isCanvas = (el) => { return el && el.tagName.toLowerCase() === 'canvas' && !el.closest('.manond-ui'); };
    window.addEventListener('pointerdown', e => { if (isEmulating && isCanvas(e.target)) { e.stopPropagation(); e.preventDefault(); bridge('mousemove', e); bridge('mousedown', e); } }, true);
    window.addEventListener('pointermove', e => { if (isEmulating && isCanvas(e.target)) bridge('mousemove', e); }, true);
    window.addEventListener('pointerup', e => { if (isEmulating && isCanvas(e.target)) { bridge('mouseup', e); if (modifiers.Alt) setTimeout(() => window.manondKey('Escape', 'Escape'), 20); } }, true);

    const checkInterval = setInterval(() => { if (document.body) { buildUI(); clearInterval(checkInterval); } }, 100);
})();
