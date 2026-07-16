import copyingText from "./copyingText.js";
import allScripts from "./allScripts.js";
import { getAgvCodes } from "./settings.js";

let globalCodeCall = false;
let globalCodeAnnoucement = "";
let globalCodeClearBackup = "";

export function extensionOnly(script) {
    const extension = prompt("Extension: ");
    let newScript = script.replace('CONTACT', extension);
    copyingText(newScript);
}

export function nameOnly(script, id) {
    const name = prompt("Person Attending: ");
    let newScript = script.replace('PERSON', name);
    let range = null
    if (id == "remarksTemp") { console.log(id); range = prompt("Enter Range: "); }
    newScript = newScript.replace('RGE', range);
    copyingText(newScript);
}

export function referenceNumber(script, id) {
    const referenceNumber = prompt("Reference Number: ");
    let newScript = script.replace('RN', referenceNumber);
    copyingText(newScript);
}

export function terminalClean(script) {
    const cleaningType = prompt("Cleaning Type: ", "Terminal Clean");
    const dateRequested = prompt("Date Requested: ");
    const timeRequested = prompt("Time Requested: ");
    const typeOfWork = prompt("Type of Work: ");
    const contact = prompt("Contact: ", 50000);

    let newScript = script.replace('CT', cleaningType);
    newScript = newScript.replace('DR', dateRequested);
    newScript = newScript.replace('TR', timeRequested);
    newScript = newScript.replace('TW', typeOfWork);
    newScript = newScript.replace('EC', contact);

    copyingText(newScript);
}

export function trashLinen(script) {
    const which = prompt("Which ones has issues (One/Two/One & Two): ");
    let newScript = script.replace("WHICH", which);
    newScript = newScript.replace("WHICH", which); //Two times

    if (which.toLowerCase() == "one" || which.toUpperCase() == "two") {
        newScript = newScript.replace("risers", "riser");
        newScript = newScript.replace("risers", "riser");
    }
    copyingText(newScript);
}

export function agv(script) {
    const number = prompt("AGV Number:");
    const location = prompt("Location:");
    const errorInput = prompt("Error Message(s) (space-separated codes):");

    const errorCodeMap = getAgvCodes();

    // Convert input safely
    const errorCodes = errorInput
        ? [...new Set(errorInput.trim().split(/\s+/))] // removes duplicates
        : [];

    const formattedErrors = errorCodes
    .map(code => {
        const cleanCode = code.replace(/[\[\]]/g, '').trim(); // remove [ ]
        const description = errorCodeMap[cleanCode] || "Unknown Error";
        return `${cleanCode} - ${description}`;
    })
    .join(" ||  ");

    let newScript = script.replace("NUMBER", number);
    newScript = newScript.replace("LOC", location);
    newScript = newScript.replace("ERR", formattedErrors);

    copyingText(newScript);
}

export function externalDepartments(script, id) {
    const equipmentType = prompt("Equipment Type: ");
    const typeOfRequest = prompt("Type of Request: ");
    
    let newScript = script.replace("EQUIP", equipmentType);
    newScript = newScript.replace("TOR", typeOfRequest);
    if (id == "humberIt" || id == "ge") {
        const equipmentId = prompt("Equipment ID: ", "NA");
        newScript = newScript.replace("EQID", equipmentId);
    }

    if (id == "ge") {
        const machineStatus = prompt("Machine Status: ", "Urgent | ");
        newScript = newScript.replace("STAT", machineStatus);
    }

    extensionOnly(newScript);
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

export function codes(script, id) {
    globalCodeCall = true;

    const codeType = prompt("Code Type: Code ");
    const codeAnn = prompt("Annoucement: ");

    let newScript = script.replace("CDTYP", codeType);
    newScript = newScript.replace("CDANN", codeAnn);

    if (id == "nc") {
        const codeNom = prompt("Code Nomenclature: ");
        newScript = newScript.replace("CDNOM", codeNom);
        copyingText(newScript);
    }

    else if (id == "codeLine") {
        extensionOnly(newScript);
    }

    globalCodeAnnoucement = codeAnn;
    globalCodeClearBackup = codeAnn;
}

export function codeRemarks(script) {
    if (!globalCodeCall) {
        globalCodeAnnoucement = prompt("Announcement: ")
    }
    let newScript = script.replace("CDANN", globalCodeAnnoucement);
    copyingText(newScript);

    globalCodeCall = false;
    globalCodeClearBackup = globalCodeAnnoucement;
    globalCodeAnnoucement = "";
}

export function clearCodeRemarks(script) {
    let extension = prompt("Ext: ");

    let newScript = script.replace("CONTACT", extension);
    newScript = newScript.replace("CDANN", globalCodeClearBackup);

    copyingText(newScript);
    globalCodeClearBackup = "";
}

export function geRemarks(script) {
    const referenceNumber = prompt("Enter Reference number: ");
    let newScript = script.replace("RN", referenceNumber);
    copyingText(newScript);
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

export function asPerRemarks() {
    const asPerWho = prompt("As per Who: ");
    navigator.clipboard.readText().then(text => {
        const script = "As per " + asPerWho + ': "'+ text + '."';
        copyingText(script);
    })
}