/**
 * Manond Touch Kit
 * 
 */

export function start(editorController, pluginPath) {
  // 1. Define the UI element so Fontra doesn't crash
  const tagName = "manond-touch-panel";
  if (!customElements.get(tagName)) {
    customElements.define(tagName, class extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `
          <div style="padding: 15px; font-family: sans-serif; font-size: 12px; color: #888;">
            <b style="color: #007aff;">TOUCH KIT ACTIVE</b><br>
            Running your tk.js directly.
          </div>
        `;
      }
    });
  }

  // 2. Add the panel to the sidebar
  const panel = document.createElement(tagName);
  panel.title = "Manond Touch Kit";
  panel.iconPath = `${pluginPath}/icon.svg`;
  editorController.addSidebarPanel(panel, "right");

  // 3. THE "BYPASS": Inject tk.js file directly into the page
  console.log("Manond: Bypassing modules and injecting tk.js...");
  
  const script = document.createElement('script');
  // This points to the tk.js file in the same folder
  script.src = `${pluginPath}/tk.js`;
  script.type = 'text/javascript'; // Force it to run as a standard script, not a module
  
  document.head.appendChild(script);
}
