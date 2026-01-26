/**
 * Manond Touch Kit - Zero-Dependency Version
 * Optimized for fontra-pak + GitHub Hosting.
 * This version uses NO imports to avoid "Module not found" errors.
 */

class ManondTouchPanel extends HTMLElement {
  constructor() {
    super();
    this.editorController = null;
    this.title = "Manond Touch Kit";
    this._hasInitted = false;
    this.modifiers = { Shift: false, Control: false, Alt: false, Space: false };
  }

  // Runs when the panel is added to the sidebar
  connectedCallback() {
    this.render();
  }

  render() {
    // We use standard HTML strings to avoid importing Fontra's 'div' utilities
    this.innerHTML = `
      <div style="padding: 16px; font-family: system-ui, -apple-system, sans-serif; color: #ccc;">
        <div style="font-weight: bold; color: #007aff; font-size: 10px; letter-spacing: 1px; margin-bottom: 8px;">
          MANOND TOUCH KIT v1.2
        </div>
        <div style="font-size: 12px; line-height: 1.5; color: #888; margin-bottom: 12px;">
          Plugin loaded from GitHub. Touch overlay should appear automatically.
        </div>
        <button id="manond-reinit" style="
          width: 100%;
          padding: 8px;
          background: #222;
          color: #eee;
          border: 1px solid #444;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
        ">Reset Overlay</button>
      </div>
    `;

    this.querySelector('#manond-reinit').onclick = () => {
      const existing = document.querySelector('.manond-ui');
      if (existing) existing.remove();
      this.initTouchKit();
    };

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

    const handlePointer = e => {
        if (e.target.tagName === 'CANVAS') {
            if (e.type === 'pointerdown') e.stopPropagation();
            const mouseType = e.type.replace('pointer', 'mouse');
            bridge(mouseType, e);
        }
    };

    window.addEventListener('pointerdown', handlePointer, true);
    window.addEventListener('pointermove', handlePointer, true);
    window.addEventListener('pointerup', handlePointer, true);
  }
}

/**
 * The 'start' function called by Fontra.
 * We export it so Fontra can find it.
 */
export function start(editorController, pluginPath) {
  const tagName = "manond-touch-panel";

  // Register the web component if it hasn't been already
  if (!customElements.get(tagName)) {
    customElements.define(tagName, ManondTouchPanel);
  }
  
  // Create the panel instance
  const panel = document.createElement(tagName);
  panel.editorController = editorController;
  
  // Set the icon path for the sidebar tab
  panel.iconPath = `${pluginPath}/icon.svg`;

  // Add the panel to the right sidebar
  editorController.addSidebarPanel(panel, "right");
}
