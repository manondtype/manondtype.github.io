import Panel from "fontra/editor/panel.js";
import {
  createDomElement,
  div
} from "fontra/core/html-utils.js";

/**
 * ManondTouchPanel wraps the logic from your Touch Kit into a Fontra Sidebar Panel.
 */
class ManondTouchPanel extends Panel {
  constructor(editorController) {
    super(editorController);
    this.title = "Manond Touch Kit";
    this.isEmulating = true;
    this.modifiers = { Shift: false, Control: false, Alt: false, Space: false };
    
    // Check if the UI is already injected to prevent duplicates on hot-reload
    this.uiInjected = false;
  }

  // Fontra uses iconPath or icon. Using iconPath is more reliable if pointing to an SVG.
  // For now, we'll keep the getter icon but ensure it's a valid SVG string.
  get icon() {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;
  }

  render() {
    // We create a mount point. The actual heavy UI is appended to body 
    // to maintain the "fixed" positioning from your original script.
    const container = div({ 
      class: "manond-touch-panel-container",
      style: "padding: 16px; display: flex; flex-direction: column; gap: 10px;"
    }, [
      div({ style: "font-weight: bold; opacity: 0.7; font-size: 11px; letter-spacing: 0.05em;" }, ["TOUCH KIT ACTIVE"]),
      div({ id: "manond-status-text", style: "font-size: 13px;" }, ["Emulation is running in the background."])
    ]);

    // Initialize the touch kit logic
    if (!this.uiInjected) {
      this.initTouchKit();
      this.uiInjected = true;
    }

    return container;
  }

  initTouchKit() {
    const ICONS = {
      pointer: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2l13 12.5-5.5 1.5 4.5 7-3 2-4.5-7-3 3V2z"/></svg>`,
      pen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>`,
      plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
      move: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`
    };

    // Remove old instances if they exist (clean up for Fontra plugin reloading)
    const existingUI = document.querySelector('.manond-ui');
    if (existingUI) existingUI.remove();

    const styleId = 'manond-touch-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .manond-ui { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 99999; padding: 10px; background: #1a1a1a; border: 1px solid #333; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); touch-action: none; }
            .manond-btn { width: 44px; height: 44px; border-radius: 10px; border: none; background: #2a2a2a; color: #888; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
            .manond-btn svg { width: 20px; height: 20px; }
            .manond-btn.active { background: #007aff; color: white; }
            .manond-btn:active { transform: scale(0.92); }
            .manond-btn[data-mod]::after { content: attr(data-mod); position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); font-size: 8px; color: #666; font-weight: bold; opacity: 0; }
            .manond-btn.active[data-mod]::after { opacity: 1; color: #007aff; }
        `;
        document.head.appendChild(style);
    }

    const ui = document.createElement('div');
    ui.className = 'manond-ui';
    
    const createBtn = (id, icon, onClick, modLabel = "") => {
        const btn = document.createElement('button');
        btn.className = 'manond-btn';
        btn.id = `manond-${id}`;
        btn.innerHTML = icon;
        if (modLabel) btn.setAttribute('data-mod', modLabel);
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(btn);
        });
        ui.appendChild(btn);
        return btn;
    };

    const triggerKey = (key, code, ctrl = false, shift = false) => {
        const t = document.querySelector('canvas') || document.body;
        t.dispatchEvent(new KeyboardEvent('keydown', { key, code, ctrlKey: ctrl, shiftKey: shift, bubbles: true }));
        setTimeout(() => t.dispatchEvent(new KeyboardEvent('keyup', { key, code, bubbles: true })), 30);
    };

    const bridge = (type, e) => {
        const canvas = document.querySelector('canvas'); 
        if (!canvas) return;
        canvas.dispatchEvent(new MouseEvent(type, { 
            clientX: e.clientX, 
            clientY: e.clientY, 
            bubbles: true, 
            view: window, 
            buttons: (type === 'mouseup') ? 0 : 1, 
            shiftKey: this.modifiers.Shift, 
            ctrlKey: this.modifiers.Control, 
            altKey: this.modifiers.Alt 
        }));
    };

    // Tools
    createBtn('pointer', ICONS.pointer, () => triggerKey('v', 'KeyV'));
    createBtn('pen', ICONS.pen, () => triggerKey('p', 'KeyP'));
    
    createBtn('shift', ICONS.plus, (btn) => {
        this.modifiers.Shift = !this.modifiers.Shift;
        btn.classList.toggle('active', this.modifiers.Shift);
    }, 'SHIFT');

    createBtn('alt', ICONS.move, (btn) => {
        this.modifiers.Alt = !this.modifiers.Alt;
        btn.classList.toggle('active', this.modifiers.Alt);
    }, 'ALT');

    document.body.appendChild(ui);

    // Pointer Event Interception
    const isCanvas = (el) => el && el.tagName.toLowerCase() === 'canvas' && !el.closest('.manond-ui');
    
    const handlePointer = (e) => {
        if (this.isEmulating && isCanvas(e.target)) {
            if (e.type === 'pointerdown') {
                e.stopPropagation();
                bridge('mousemove', e);
                bridge('mousedown', e);
            } else if (e.type === 'pointermove') {
                bridge('mousemove', e);
            } else if (e.type === 'pointerup') {
                bridge('mouseup', e);
            }
        }
    };

    window.addEventListener('pointerdown', handlePointer, true);
    window.addEventListener('pointermove', handlePointer, true);
    window.addEventListener('pointerup', handlePointer, true);
  }
}

export function start(editorController, pluginPath) {
  // Ensure the custom element isn't already defined (standard Web Component check)
  if (!customElements.get("manond-touch-panel")) {
    customElements.define("manond-touch-panel", ManondTouchPanel);
  }
  
  // Add to the right sidebar
  editorController.addSidebarPanel(new ManondTouchPanel(editorController), "right");
}