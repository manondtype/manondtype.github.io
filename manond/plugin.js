import Panel from "fontra/editor/panel.js";
import { div } from "fontra/core/html-utils.js";

/**
 * ManondTouchPanel wraps the logic from your Touch Kit into a Fontra Sidebar Panel.2
 */
class ManondTouchPanel extends Panel {
  constructor(editorController) {
    super(editorController);
    this.title = "Manond Touch Kit";
    this.isEmulating = true;
    this.modifiers = { Shift: false, Control: false, Alt: false, Space: false };
    
    // Track initialization state
    this._hasInitted = false;
  }

  // The icon shown in the sidebar tab
  get icon() {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="4"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </svg>
    `;
  }

  render() {
    // Start touch kit logic if not already running
    if (!this._hasInitted) {
      this._hasInitted = true;
      setTimeout(() => this.initTouchKit(), 300);
    }

    return div({ 
        class: "manond-touch-container", 
        style: "padding: 15px; font-family: system-ui; font-size: 13px; color: #888;" 
    }, [
      div({ style: "font-weight: bold; color: var(--text-color, #ccc); margin-bottom: 5px;" }, ["TOUCH KIT ACTIVE"]),
      div({}, ["Touch controls are active at the bottom of your viewport."])
    ]);
  }

  initTouchKit() {
    // Cleanup any existing UI from previous sessions/reloads
    const existing = document.querySelector('.manond-ui');
    if (existing) existing.remove();

    const ICONS = {
      pointer: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2l13 12.5-5.5 1.5 4.5 7-3 2-4.5-7-3 3V2z"/></svg>`,
      pen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>`,
      plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
      move: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`
    };

    const style = document.createElement('style');
    style.className = 'manond-styles';
    style.textContent = `
        .manond-ui { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; z-index: 100000; padding: 12px; background: #111; border: 1px solid #333; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); pointer-events: auto; }
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
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(btn);
        });
        ui.appendChild(btn);
        return btn;
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

    // Touch logic bridge
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

export function start(editorController, pluginPath) {
  const tagName = "manond-touch-panel";
  
  // Set the icon path
  ManondTouchPanel.prototype.iconPath = `${pluginPath}/icon.svg`;

  if (!customElements.get(tagName)) {
    customElements.define(tagName, ManondTouchPanel);
  }
  
  editorController.addSidebarPanel(new ManondTouchPanel(editorController), "right");
}

