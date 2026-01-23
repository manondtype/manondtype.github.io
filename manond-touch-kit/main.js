export default {
    init(api) {
        this.injectUI(api);
        console.log("Manond Touch Kit v1.0 - Stable for 2026.1.2");
    },
    injectUI(api) {
        const panel = document.createElement('div');
        panel.id = "manond-touch-panel";
        
        // Restore collapse state
        const isCollapsed = localStorage.getItem('manond_collapsed') === 'true';
        if (isCollapsed) panel.classList.add('collapsed');

        panel.innerHTML = `
            <div class="m-header">
                <span>MANOND v1.0</span>
                <button id="m-toggle">〓</button>
            </div>
            <div class="m-body">
                <button class="m-btn" id="m-shift">SHIFT</button>
                <button class="m-btn" id="m-ctrl">CTRL</button>
                <button class="m-btn" id="m-alt">ALT</button>
            </div>`;
        document.body.appendChild(panel);

        // Toggle Event
        panel.querySelector('#m-toggle').onclick = () => {
            panel.classList.toggle('collapsed');
            localStorage.setItem('manond_collapsed', panel.classList.contains('collapsed'));
        };

        // Modifier Logic (Stable Alt+Tap)
        ['shift', 'ctrl', 'alt'].forEach(key => {
            const btn = panel.querySelector(`#m-${key}`);
            btn.onclick = () => {
                const active = btn.classList.toggle('active');
                // Use v2026 Virtual Modifier API
                api.input.setVirtualModifier(key, active);
            };
        });

        this.applyStyles();
    },
    applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #manond-touch-panel { 
                position: fixed; right: 20px; top: 100px; 
                width: 150px; background: #111; border: 1px solid #333; 
                z-index: 9999; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            }
            .m-header { display: flex; justify-content: space-between; padding: 10px; font-size: 10px; color: #666; font-weight: bold; border-bottom: 1px solid #222; }
            #m-toggle { background: none; border: none; color: white; cursor: pointer; }
            .m-body { display: flex; flex-direction: column; padding: 10px; gap: 8px; }
            
            /* Finger-Tap Optimized (v8.4 / v1.0 Spec) */
            .m-btn { 
                height: 50px; background: #222; color: white; border: 1px solid #444; 
                border-radius: 6px; font-weight: bold; font-size: 14px; cursor: pointer;
            }
            .m-btn.active { background: #d4ff00; color: black; border-color: #d4ff00; }
            .collapsed .m-body { display: none; }
            
            /* Tab Renaming: View -> HOME */
            [data-tab-id="view"] .tab-label { visibility: hidden; }
            [data-tab-id="view"] .tab-label::before { 
                content: "HOME"; visibility: visible; position: absolute; left: 0; right: 0; text-align: center;
            }
        `;
        document.head.appendChild(style);
    }
}