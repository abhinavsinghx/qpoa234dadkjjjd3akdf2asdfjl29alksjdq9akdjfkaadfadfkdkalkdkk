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