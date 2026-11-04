// Copies text exactly as given (no timestamp).
export function copyPlain(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const t = document.createElement("textarea");
    t.value = text;
    t.style.position = "fixed";
    t.style.left = "-9999px";
    document.body.appendChild(t);
    t.focus();
    t.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(t);
  });
}

// The caller's name goes on the clipboard 5 seconds after the script was
// copied, so the script is there to paste first and the name comes next.
export function copyNameLater(name) {
  const clean = String(name || "").trim();
  if (!clean) return;
  setTimeout(() => copyPlain(clean), 5000);
}

export default function copyingText(message) {
  const now = new Date();
  const formatted = now.toLocaleString("en-GB", {
    timeZone: "America/Toronto",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
  const offsetStr = new Intl.DateTimeFormat('en', {
    timeZone: 'America/Toronto',
    timeZoneName: 'shortOffset'
  }).formatToParts(now).find(p => p.type === 'timeZoneName').value;

  const timestamp = `${formatted} ${offsetStr} Abhinav Singh:`;
  const textToCopy = `${timestamp} ${message}`;

  // Try modern clipboard API first
  navigator.clipboard.writeText(textToCopy)
    .then(() => console.log("Copied to clipboard!"))
    .catch(err => {
      console.warn("Navigator clipboard failed, falling back to execCommand.", err);

      // Fallback using hidden textarea
      const tempTextArea = document.createElement("textarea");
      tempTextArea.value = textToCopy;
      tempTextArea.style.position = "fixed"; // Avoid scrolling issues
      tempTextArea.style.left = "-9999px";
      document.body.appendChild(tempTextArea);
      tempTextArea.focus();
      tempTextArea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) console.log("Copied via fallback!");
        else console.error("Fallback copy failed.");
      } catch (e) {
        console.error("Fallback copy failed:", e);
      }

      document.body.removeChild(tempTextArea);
    });
}