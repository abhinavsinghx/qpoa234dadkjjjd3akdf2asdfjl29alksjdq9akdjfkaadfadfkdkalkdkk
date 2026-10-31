// Shows a small centered box listing a category's items.
// Resolves to the chosen item's id, or null if it was dismissed (Esc, Cancel,
// or a click outside). A "soon" item is shown dimmed and does nothing.
// It only chooses: whatever is chosen asks its own questions afterwards.
export default function showMenu({ title, items }) {
    return new Promise(resolve => {
        const overlay = document.createElement("div");
        overlay.className = "dialog-overlay";

        const box = document.createElement("div");
        box.className = "dialog-modal menu-modal";

        const heading = document.createElement("div");
        heading.className = "dialog-title";
        heading.textContent = title;
        box.appendChild(heading);

        const grid = document.createElement("div");
        grid.className = "menu-grid";
        items.forEach(item => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "menu-item" + (item.soon ? " soon" : "");
            button.textContent = item.label;
            if (item.soon) button.title = "Not set up yet";
            else button.onclick = () => close(item.id);
            grid.appendChild(button);
        });
        box.appendChild(grid);

        const actions = document.createElement("div");
        actions.className = "dialog-actions";
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.className = "dialog-cancel";
        cancel.textContent = "Cancel";
        cancel.onclick = () => close(null);
        actions.appendChild(cancel);
        box.appendChild(actions);
        overlay.appendChild(box);

        function close(result) {
            document.removeEventListener("keydown", onKey, true);
            overlay.remove();
            resolve(result);
        }

        // Capture phase so Esc doesn't also reach the settings shortcut.
        function onKey(e) {
            if (e.key === "Escape") {
                e.stopPropagation();
                close(null);
            }
        }

        overlay.addEventListener("mousedown", (e) => {
            if (e.target === overlay) close(null);
        });
        document.addEventListener("keydown", onKey, true);

        document.body.appendChild(overlay);
        const first = grid.querySelector(".menu-item:not(.soon)");
        if (first) first.focus();
    });
}
