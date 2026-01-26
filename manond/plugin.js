/**
 * Manond Touch Kit - fontra-pak Optimized Version
 * We avoid 'import' from internal paths to prevent "Module not found" errors in production.
 */

class ManondTouchPanel extends HTMLElement {
  constructor() {
    super();
    // Fontra passes editorController to the element when it instantiates it
    this.editorController = null;
    this.title = "Manond Touch Kit";
    this._hasInitted = false;
    this.modifiers = { Shift: false, Control: false, Alt: false, Space: false };
  }

  // This runs when Fontra adds the panel to the sidebar
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div style="padding: 16px; font-family: system-ui, sans-serif; display: flex; flex-direction: column; gap: 12px;">
        <div style="font-weight: bold; color: #007aff; font-size: 11px; letter-spacing: 1px;">MANOND TOUCH KIT</div>
        <p style="margin: 0; font-size: 12px; color: #888; line-height: 1.4;">
          If the touch overlay at the bottom is missing, click the button below to force start it.
        </p>
        <button id="force-start-touch" style="
          padding: 8px 12px; 
          background: #333; 
          color: white; 
          border: 1px solid #444; 
          border-radius: 6px; 
          cursor: pointer;
          font-size: 12px;
        ">Force Start Overlay</button>
      </div>
    `;

    this.querySelector('#force-start-touch').onclick = () => this.initTouchKit();

    // Automatic attempt
    if (!this._hasInitted) {
      this._hasInitted = true;
      setTimeout(() => this.initTouchKit(), 500);
    }
  }

  initTouchKit() {
    if (document.querySelector('.manond-ui')) return;

    const ICONS = {
      pointer: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2l13 12.5-5.5 1.5 4.5 7-3 2-4.5-7-3 3V2z"/></svg>`,
      pen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>`,
      plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
    };

    const style = document.createElement('style');
    style.textContent = `
        .manond-ui { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; z-index: 999999; padding: 12px; background: #111; border: 1px solid #333; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
        .manond-btn { width: 50px; height: 50px; border-radius: 12px; border: none; background: #222; color: #888; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .manond-btn.active { background: #007aff; color: white; }
        .manond-btn svg { width: 24px; height: 24px; pointer-events: none; }
    `;
    document.head.appendChild(style);

    const ui = document.createElement('div');
    ui.className = 'manond-ui';
    
    const createBtn = (id, icon, onClick) => {
        const btn = document.createElement('button');
        btn.className = 'manond-btn';
        btn.innerHTML = icon;
        btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); onClick(btn); };
        ui.appendChild(btn);
    };

    const triggerKey = (key, code) => {
        const t = document.querySelector('canvas') || document.body;
        t.dispatchEvent(new KeyboardEvent('keydown', { key, code, bubbles: true }));
        setTimeout(() => t.dispatchEvent(new KeyboardEvent('keyup', { key, code, bubbles: true })), 50);
    };

    createBtn('v', ICONS.pointer, () => triggerKey('v', 'KeyV'));
    createBtn('p', ICONS.pen, () => triggerKey('p', 'KeyP'));
    createBtn('shift', ICONS.plus, (btn) => {
        this.modifiers.Shift = !this.modifiers.Shift;
        btn.classList.toggle('active', this.modifiers.Shift);
    });

    document.body.appendChild(ui);

    const bridge = (type, e) => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;
        canvas.dispatchEvent(new MouseEvent(type, {
            clientX: e.clientX, clientY: e.clientY, bubbles: true,
            shiftKey: this.modifiers.Shift,
            buttons: type === 'mouseup' ? 0 : 1
        }));
    };

    window.addEventListener('pointerdown', e => {
        if (e.target.tagName === 'CANVAS') {
            e.stopPropagation();
            bridge('mousedown', e);
        }
    }, true);
    window.addEventListener('pointermove', e => {
        if (e.target.tagName === 'CANVAS') bridge('mousemove', e);
    }, true);
    window.addEventListener('pointerup', e => {
        if (e.target.tagName === 'CANVAS') bridge('mouseup', e);
    }, true);
  }
}

/**
 * Global Start Function
 */
export function start(editorController, pluginPath) {
  const tagName = "manond-touch-panel";

  if (!customElements.get(tagName)) {
    customElements.define(tagName, ManondTouchPanel);
  }
  
  // Create instance and manually set the icon for Fontra's sidebar
  const panel = document.createElement(tagName);
  panel.editorController = editorController;
  
  // We use a property that Fontra looks for to find the icon
  panel.iconPath = `${pluginPath}/icon.svg`;

  // Add the panel to the sidebar
  editorController.addSidebarPanel(panel, "right");
}
