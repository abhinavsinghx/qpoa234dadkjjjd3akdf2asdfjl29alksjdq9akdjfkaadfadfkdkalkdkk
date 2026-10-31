import copyingText from "./copyingText.js";
import allScripts from "./allScripts.js";
import showDialog from "./dialog.js";
import { getAgvCodes } from "./settings.js";

let globalCodeCall = false;
let globalCodeAnnoucement = "";
let globalCodeClearBackup = "";

const EXT = { name: "extension", label: "Extension" };

export async function extensionOnly(script) {
    const v = await showDialog({ title: "Contact", fields: [EXT] });
    if (!v) return;
    copyingText(script.replace('CONTACT', v.extension));
}

export async function lockerCut(script) {
    const v = await showDialog({
        title: "Locker Cut",
        fields: [{ name: "locker", label: "Locker Number" }, EXT],
    });
    if (!v) return;
    let newScript = script.replace("LOCKER", v.locker);
    newScript = newScript.replace("CONTACT", v.extension);
    copyingText(newScript);
}

export async function nameOnly(script, id) {
    const fields = [{ name: "name", label: "Person Attending" }];
    if (id == "remarksTemp") fields.push({ name: "range", label: "RDS Range" });

    const v = await showDialog({ title: "Assigned To", fields });
    if (!v) return;

    let newScript = script.replace('PERSON', v.name);
    newScript = newScript.replace('RGE', v.range ?? "");
    copyingText(newScript);
}

export async function referenceNumber(script, id) {
    const v = await showDialog({ title: "Reference", fields: [{ name: "rn", label: "Reference Number" }] });
    if (!v) return;
    copyingText(script.replace('RN', v.rn));
}

export async function terminalClean(script) {
    const v = await showDialog({
        title: "Terminal Clean",
        fields: [
            { name: "type", label: "Cleaning Type", value: "Terminal Clean" },
            { name: "date", label: "Date Requested" },
            { name: "time", label: "Time Requested" },
            { name: "work", label: "Type of Work" },
            { name: "contact", label: "Contact", value: "50000" },
        ],
    });
    if (!v) return;

    let newScript = script.replace('CT', v.type);
    newScript = newScript.replace('DR', v.date);
    newScript = newScript.replace('TR', v.time);
    newScript = newScript.replace('TW', v.work);
    newScript = newScript.replace('EC', v.contact);
    copyingText(newScript);
}

export async function trashLinen(script) {
    const v = await showDialog({
        title: "TransVac Risers",
        fields: [{ name: "which", label: "Which ones have issues", options: ["One", "Two", "One & Two"] }],
    });
    if (!v) return;

    let newScript = script.replace("WHICH", v.which);
    newScript = newScript.replace("WHICH", v.which); //Two times

    if (v.which != "One & Two") {
        newScript = newScript.replace("risers", "riser");
        newScript = newScript.replace("risers", "riser");
    }
    copyingText(newScript);
}

export async function agv(script) {
    const v = await showDialog({
        title: "AGV Alarm",
        fields: [
            { name: "number", label: "AGV Number" },
            { name: "location", label: "Location" },
            { name: "errors", label: "Error Message(s) (space-separated codes)" },
        ],
    });
    if (!v) return;

    const errorCodeMap = getAgvCodes();

    // Convert input safely
    const errorCodes = v.errors
        ? [...new Set(v.errors.trim().split(/\s+/))] // removes duplicates
        : [];

    const formattedErrors = errorCodes
    .map(code => {
        const cleanCode = code.replace(/[\[\]]/g, '').trim(); // remove [ ]
        const description = errorCodeMap[cleanCode] || "Unknown Error";
        return `${cleanCode} - ${description}`;
    })
    .join(" ||  ");

    let newScript = script.replace("NUMBER", v.number);
    newScript = newScript.replace("LOC", v.location);
    newScript = newScript.replace("ERR", formattedErrors);

    copyingText(newScript);
}

export async function externalDepartments(script, id) {
    const fields = [
        { name: "equipment", label: "Equipment Type" },
        { name: "request", label: "Type of Request" },
    ];
    if (id == "humberIt" || id == "ge") fields.push({ name: "equipmentId", label: "Equipment ID", value: "NA" });
    if (id == "ge") fields.push({ name: "status", label: "Machine Status", value: "Urgent | " });
    fields.push(EXT);

    const v = await showDialog({ title: "Equipment Request", fields });
    if (!v) return;

    let newScript = script.replace("EQUIP", v.equipment);
    newScript = newScript.replace("TOR", v.request);
    if (v.equipmentId !== undefined) newScript = newScript.replace("EQID", v.equipmentId);
    if (v.status !== undefined) newScript = newScript.replace("STAT", v.status);
    newScript = newScript.replace("CONTACT", v.extension);

    copyingText(newScript);
}

export function alarmFormatter() {
    // console.log("I am calling, my name is Alarm Formatter")
    navigator.clipboard.readText().then(text => {
        let textList = text.split('\n');

        for (let i = textList.length - 1; i >= 0; i--) {
            if (textList[i].trim() === "") textList.splice(i, 1);
        }

        let result = [];
        for (let i = 0; i < textList.length; i++) {
            let item = textList[i].trim();
            let next = (textList[i + 1] || "").trim();

            if (/Alarm$/i.test(item) && i + 1 < textList.length) {
                if (/^\d+$/.test(next) || !next.endsWith(":")) {
                    result.push(`${item} ${next}`);
                    i++;
                } else {
                    result.push(item);
                }
            } else if (item.endsWith(":") && i + 1 < textList.length) {
                result.push(`${item} ${next}`);
                i++;
            } else {
                result.push(item);
            }
        }

        let newScript = result.join('\n');

        if (newScript.includes("Refrigeration")) {
            newScript = "Fridge Alarm\n" + newScript;
        }
        else if (newScript.includes("Humidity")) {
            newScript = "Humidity Alarm\n" + newScript;
        }

        copyingText(newScript);
    });
}

export async function codes(script, id) {
    const fields = [
        { name: "type", label: "Code Type: Code" },
        { name: "announcement", label: "Announcement" },
    ];
    if (id == "nc") fields.push({ name: "nomenclature", label: "Code Nomenclature" });
    else if (id == "codeLine") fields.push(EXT);

    const v = await showDialog({ title: "Code", fields });
    if (!v) return;

    globalCodeCall = true;

    let newScript = script.replace("CDTYP", v.type);
    newScript = newScript.replace("CDANN", v.announcement);

    if (id == "nc") {
        newScript = newScript.replace("CDNOM", v.nomenclature);
        copyingText(newScript);
    }
    else if (id == "codeLine") {
        newScript = newScript.replace("CONTACT", v.extension);
        copyingText(newScript);
    }

    globalCodeAnnoucement = v.announcement;
    globalCodeClearBackup = v.announcement;
}

export async function codeRemarks(script) {
    if (!globalCodeCall) {
        const v = await showDialog({ title: "Code Announced", fields: [{ name: "announcement", label: "Announcement" }] });
        if (!v) return;
        globalCodeAnnoucement = v.announcement;
    }
    let newScript = script.replace("CDANN", globalCodeAnnoucement);
    copyingText(newScript);

    globalCodeCall = false;
    globalCodeClearBackup = globalCodeAnnoucement;
    globalCodeAnnoucement = "";
}

export async function clearCodeRemarks(script) {
    const v = await showDialog({
        title: "Cancel Code",
        fields: [
            { name: "extension", label: "Ext" },
            { name: "announcement", label: "Announcement", value: globalCodeClearBackup },
        ],
    });
    if (!v) return;

    let newScript = script.replace("CONTACT", v.extension);
    newScript = newScript.replace("CDANN", v.announcement);

    copyingText(newScript);
    globalCodeClearBackup = "";
}

export async function geRemarks(script) {
    const v = await showDialog({ title: "GE Called", fields: [{ name: "rn", label: "Reference Number" }] });
    if (!v) return;
    copyingText(script.replace("RN", v.rn));
}

export function hrhItRemarks(script) {
    navigator.clipboard.readText().then(text => {
        const hasTicket = text.split(' ').some(word => word.toLowerCase() === "ticket");
        if (hasTicket) {
            copyingText("HRH IT: " + text);
        } else {
            copyingText(script);
        }
    });
}

export async function asPerRemarks() {
    const v = await showDialog({ title: "As Per", fields: [{ name: "who", label: "As per Who" }] });
    if (!v) return;
    navigator.clipboard.readText().then(text => {
        const script = "As per " + v.who + ': "'+ text + '."';
        copyingText(script);
    })
}
