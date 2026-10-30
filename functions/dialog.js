// Shows a centered dialog with all fields at once.
// Resolves to { [field.name]: value } on submit, or null if cancelled.
// field: { name, label, value?, placeholder?, options? (renders a select) }
export default function showDialog({ title, fields, submitLabel = "Copy" }) {
    return new Promise(resolve => {
        const overlay = document.createElement("div");
        overlay.className = "dialog-overlay";

        const fieldsHtml = fields.map(f => {
            const value = String(f.value ?? "").replace(/"/g, "&quot;");
            const control = f.options
                ? `<select name="${f.name}">${f.options
                    .map(o => `<option${o === f.value ? " selected" : ""}>${o}</option>`)
                    .join("")}</select>`
                : `<input name="${f.name}" type="text" autocomplete="off" value="${value}" placeholder="${f.placeholder ?? ""}" />`;
            return `<label class="dialog-field"><span>${f.label}</span>${control}</label>`;
        }).join("");

        overlay.innerHTML = `
            <form class="dialog-modal" novalidate>
                <div class="dialog-title">${title}</div>
                <div class="dialog-fields">${fieldsHtml}</div>
                <div class="dialog-actions">
                    <button type="button" class="dialog-cancel">Cancel</button>
                    <button type="submit" class="dialog-submit">${submitLabel}</button>
                </div>
            </form>
        `;

        const form = overlay.querySelector("form");

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

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const result = {};
            fields.forEach(f => { result[f.name] = form.elements[f.name].value; });
            close(result);
        });

        overlay.querySelector(".dialog-cancel").onclick = () => close(null);
        overlay.addEventListener("mousedown", (e) => {
            if (e.target === overlay) close(null);
        });
        document.addEventListener("keydown", onKey, true);

        document.body.appendChild(overlay);
        const first = form.elements[fields[0].name];
        first.focus();
        if (first.select) first.select();
    });
}
