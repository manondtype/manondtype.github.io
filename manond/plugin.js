(function() {
  window.start = function(editorController, pluginPath) {
    const tagName = "manond-touch-panel";
    
    if (!customElements.get(tagName)) {
      customElements.define(tagName, class extends HTMLElement {
        connectedCallback() {
          this.style.display = "block";
          this.innerHTML = `
            <div style="padding: 15px; font-family: system-ui, sans-serif; font-size: 12px; color: #888; border-left: 3px solid #007aff;">
              <b style="color: #eee; display: block; margin-bottom: 4px;">TOUCH KIT ACTIVE</b>
              <span style="opacity: 0.7;">Logic integrated in plugin.js</span>
            </div>
          `;
        }
      });
    }

    const panel = document.createElement(tagName);
    panel.title = "Manond Touch Kit";
    if (pluginPath) panel.iconPath = pluginPath + "/icon.svg";
    editorController.addSidebarPanel(panel, "right");

    // --- INTEGRATED TK.JS LOGIC ---
    let modifiers = { Shift: false, Control: false, Alt: false, Space: false };

    const ICONS = {
        pointer: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2l13 12.5-5.5 1.5 4.5 7-3 2-4.5-7-3 3V2z"/></svg>`,
        pen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/></svg>`,
        plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
    };

    const style = document.createElement('style');
    style.textContent = `
        .manond-ui { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 100000; padding: 10px; background: rgba(15,15,15,0.9); border: 1px solid #333; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.6); backdrop-filter: blur(10px); pointer-events: auto; }
        .manond-btn { width: 48px; height: 48px; border-radius: 12px; border: none; background: #222; color: #888; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); }
        .manond-btn svg { width: 22px; height: 22px; pointer-events: none; }
        .manond-btn.active { background: #007aff; color: white; box-shadow: 0 0 15px rgba(0,122,255,0.4); }
        .manond-sep { width: 1px; height: 30px; background: #333; align-self: center; margin: 0 4px; }
    `;
    document.head.appendChild(style);

    const ui = document.createElement('div');
    ui.className = 'manond-ui';

    const createBtn = (id, icon, onClick) => {
        const btn = document.createElement('button');
        btn.className = 'manond-btn';
        btn.innerHTML = icon;
        btn.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            onClick(btn);
        };
        ui.appendChild(btn);
    };

    const triggerTool = (key, code) => {
        const t = document.querySelector('canvas') || document.body;
        t.dispatchEvent(new KeyboardEvent('keydown', { key, code, bubbles: true }));
    };

    const bridge = (type, e) => {
        const canvas = document.querySelector('canvas'); 
        if (!canvas) return;
        canvas.dispatchEvent(new MouseEvent(type, { 
            clientX: e.clientX, clientY: e.clientY, bubbles: true, view: window, 
            buttons: (type === 'mouseup') ? 0 : 1, 
            shiftKey: modifiers.Shift
        }));
    };

    createBtn('v', ICONS.pointer, () => triggerTool('v', 'KeyV'));
    createBtn('p', ICONS.pen, () => triggerTool('p', 'KeyP'));
    
    const sep = document.createElement('div');
    sep.className = 'manond-sep';
    ui.appendChild(sep);

    createBtn('shift', ICONS.plus, (btn) => {
        modifiers.Shift = !modifiers.Shift;
        btn.classList.toggle('active', modifiers.Shift);
    });

    document.body.appendChild(ui);

    window.addEventListener('pointerdown', e => { 
        if (e.target.tagName === 'CANVAS' && !e.target.closest('.manond-ui')) { 
            e.stopPropagation(); e.preventDefault(); 
            bridge('mousemove', e); bridge('mousedown', e); 
        } 
    }, true);

    window.addEventListener('pointermove', e => { 
        if (e.target.tagName === 'CANVAS' && !e.target.closest('.manond-ui')) bridge('mousemove', e); 
    }, true);

    window.addEventListener('pointerup', e => { 
        if (e.target.tagName === 'CANVAS' && !e.target.closest('.manond-ui')) bridge('mouseup', e); 
    }, true);
  };
})();
