// The event buttons, grouped. The main screen shows one button per category;
// pressing it opens a small box listing that category's items, and choosing
// one runs it (see handleItem in script.js, which works from the item's id).
//
// soon: true marks a placeholder that isn't set up yet.
//
// Still handled in script.js but not listed here, so they stay hidden:
// terminalClean, trash, linen.
export default [
    { id: "security", label: "Security", items: [
        { id: "morgue", label: "10-12" },
        { id: "doorAccess", label: "Door" },
        { id: "lockerCut", label: "Locker Cut" },
    ] },
    { id: "codes", label: "Codes", items: [
        { id: "nc", label: "NC" },
        { id: "codeLine", label: "CL" },
        { id: "panic", label: "Panic" },
    ] },
    { id: "external", label: "External", items: [
        { id: "biomed", label: "Biomed" },
        { id: "humberIt", label: "HRH IT" },
        { id: "ge", label: "GE" },
        { id: "supportServices", label: "Support Services", soon: true },
    ] },
    { id: "engineer", label: "Engineer", items: [
        { id: "tooHot", label: "Too Hot" },
        { id: "tooCold", label: "Too Cold" },
        { id: "aprActivate", label: "APR Activate" },
        { id: "aprDeactivate", label: "APR Deactivate" },
        { id: "alarmFormatter", label: "Format Alarm" },
    ] },
    { id: "plumbing", label: "Plumbing", items: [
        { id: "toiletClogged", label: "Toilet" },
        { id: "sinkClogged", label: "Sink Clogged" },
    ] },
    { id: "electrical", label: "Electrical", items: [
        { id: "lightsDark", label: "Lights - Dark" },
        { id: "lights", label: "Lights" },
    ] },
    { id: "fm", label: "FM", items: [
        { id: "agv", label: "AGV" },
    ] },
];
