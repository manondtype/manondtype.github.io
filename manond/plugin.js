export function start(editorController, pluginPath) {
  const tagName = "manond-touch-panel";
  
  if (!customElements.get(tagName)) {
    customElements.define(tagName, class extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `
          <div style="padding: 15px; font-family: system-ui, sans-serif; font-size: 12px; color: #888; border-left: 3px solid #007aff;">
            <b style="color: #eee; display: block; margin-bottom: 4px;">TOUCH KIT ACTIVE</b>
            <span style="opacity: 0.7;">Loading tk.js...</span>
          </div>
        `;
      }
    });
  }

  const panel = document.createElement(tagName);
  panel.title = "Manond Touch Kit";
  panel.iconPath = pluginPath + "/icon.svg";
  
  editorController.addSidebarPanel(panel, "right");

  const scriptId = "manond-touch-kit-script";
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = pluginPath + "/tk.js";
    script.async = true;
    document.head.appendChild(script);
  }
}
