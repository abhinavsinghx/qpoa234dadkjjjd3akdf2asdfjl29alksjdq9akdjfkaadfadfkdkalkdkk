export const AGV_STORAGE_KEY = 'qfm_agv_codes';

const defaultAgvCodes = {
    "0":    "RF Communication Error",
    "1272": "Nav - Large position uncertainty",
    "1394": "XML Message IDs are not synchronized; Check out of service and back into service",
    "1847": "Safe Bumper Override Timeout",
    "1881": "Override Request Error",
    "1884": "No Auto-Mode Guidesafe",
    "2019": "Load Detect Fault",
    "2050": "Cart not in position to raise lift",
    "2314": "Front Bumper",
    "2368": "Rear Bumper",
    "4024": "Navigation module: Reporting Errors",
    "4028": "Navigation Module: Movement too far",
    "5499": "Safety system modules not okay",
    "5502": "EFI 2 Fault",
    "5509": "Encoder crosscheck failure",
    "5510": "Speed outside safety tolerance",
};

export function getAgvCodes() {
    const stored = localStorage.getItem(AGV_STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(AGV_STORAGE_KEY, JSON.stringify(defaultAgvCodes));
        return { ...defaultAgvCodes };
    }
    return JSON.parse(stored);
}

function saveAgvCodes(codes) {
    localStorage.setItem(AGV_STORAGE_KEY, JSON.stringify(codes));
}

function renderAgvTable() {
    const tbody = document.getElementById('agv-tbody');
    const codes = getAgvCodes();
    tbody.innerHTML = '';

    const sorted = Object.entries(codes).sort((a, b) =>
        Number(a[0]) - Number(b[0])
    );

    sorted.forEach(([code, desc]) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="agv-code-cell">${code}</td>
            <td class="agv-desc-cell">${desc}</td>
            <td class="agv-actions-cell">
                <button class="agv-btn agv-edit-btn" title="Edit">✏️</button>
                <button class="agv-btn agv-delete-btn" title="Delete">🗑️</button>
            </td>
        `;

        tr.querySelector('.agv-edit-btn').onclick = () => startEdit(tr, code, desc);
        tr.querySelector('.agv-delete-btn').onclick = () => {
            if (!confirm(`Delete code ${code}?`)) return;
            const all = getAgvCodes();
            delete all[code];
            saveAgvCodes(all);
            renderAgvTable();
        };

        tbody.appendChild(tr);
    });
}

function startEdit(tr, oldCode, oldDesc) {
    tr.innerHTML = `
        <td><input class="agv-inline-input" id="edit-code" value="${oldCode}" style="width:60px" /></td>
        <td><input class="agv-inline-input" id="edit-desc" value="${oldDesc}" style="width:100%" /></td>
        <td class="agv-actions-cell">
            <button class="agv-btn agv-confirm-btn" title="Save">✓</button>
            <button class="agv-btn agv-cancel-btn" title="Cancel">✕</button>
        </td>
    `;

    tr.querySelector('#edit-desc').focus();

    tr.querySelector('.agv-confirm-btn').onclick = () => {
        const editCodeInput = tr.querySelector('#edit-code');
        const editDescInput = tr.querySelector('#edit-desc');
        const newCode = editCodeInput.value.trim();
        const newDesc = editDescInput.value.trim();
        if (!newCode || !newDesc) return;

        const all = getAgvCodes();
        if (newCode !== oldCode && all[newCode] !== undefined) {
            editCodeInput.style.borderColor = '#f87171';
            editCodeInput.title = `Code ${newCode} already exists: "${all[newCode]}"`;
            editCodeInput.focus();
            setTimeout(() => { editCodeInput.style.borderColor = ''; editCodeInput.title = ''; }, 3000);
            return;
        }

        if (newCode !== oldCode) delete all[oldCode];
        all[newCode] = newDesc;
        saveAgvCodes(all);
        renderAgvTable();
    };

    tr.querySelector('.agv-cancel-btn').onclick = () => renderAgvTable();
}

export function initSettings() {
    const overlay = document.createElement('div');
    overlay.id = 'settings-overlay';
    overlay.innerHTML = `
        <div id="settings-modal">
            <div id="settings-sidebar">
                <div id="settings-sidebar-title">Settings</div>
                <ul id="settings-nav">
                    <li class="settings-nav-item active" data-section="agv">🤖 AGV Codes</li>
                </ul>
            </div>
            <div id="settings-content">
                <div id="settings-section-agv" class="settings-section">
                    <div class="settings-section-header">
                        <span class="settings-section-title">AGV Error Codes</span>
                        <button id="agv-add-btn">+ Add Code</button>
                    </div>
                    <div id="agv-add-form" class="agv-add-form hidden">
                        <input id="agv-new-code" type="text" placeholder="Code (e.g. 1234)" />
                        <input id="agv-new-desc" type="text" placeholder="Description" />
                        <button id="agv-save-new">Save</button>
                        <button id="agv-cancel-new">Cancel</button>
                    </div>
                    <div id="agv-table-wrap">
                        <table id="agv-table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Description</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="agv-tbody"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <button id="settings-close" title="Close (Esc)">✕</button>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeSettings();
    });

    document.getElementById('settings-close').onclick = closeSettings;

    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.onclick = () => {
            document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            document.querySelectorAll('.settings-section').forEach(s => s.classList.add('hidden'));
            document.getElementById('settings-section-' + item.dataset.section).classList.remove('hidden');
        };
    });

    document.getElementById('agv-add-btn').onclick = () => {
        document.getElementById('agv-add-form').classList.toggle('hidden');
        if (!document.getElementById('agv-add-form').classList.contains('hidden')) {
            document.getElementById('agv-new-code').focus();
        }
    };

    document.getElementById('agv-save-new').onclick = saveNewCode;
    document.getElementById('agv-new-desc').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveNewCode();
    });

    document.getElementById('agv-cancel-new').onclick = () => {
        document.getElementById('agv-add-form').classList.add('hidden');
        document.getElementById('agv-new-code').value = '';
        document.getElementById('agv-new-desc').value = '';
    };

    renderAgvTable();
}

function saveNewCode() {
    const codeInput = document.getElementById('agv-new-code');
    const descInput = document.getElementById('agv-new-desc');
    const code = codeInput.value.trim();
    const desc = descInput.value.trim();
    if (!code || !desc) return;

    const all = getAgvCodes();
    if (all[code] !== undefined) {
        codeInput.style.borderColor = '#f87171';
        codeInput.title = `Code ${code} already exists: "${all[code]}"`;
        codeInput.focus();
        setTimeout(() => { codeInput.style.borderColor = ''; codeInput.title = ''; }, 3000);
        return;
    }

    all[code] = desc;
    saveAgvCodes(all);
    codeInput.value = '';
    descInput.value = '';
    document.getElementById('agv-add-form').classList.add('hidden');
    renderAgvTable();
}

export function openSettings() {
    document.getElementById('settings-overlay').classList.add('open');
    renderAgvTable();
}

export function closeSettings() {
    document.getElementById('settings-overlay').classList.remove('open');
}
