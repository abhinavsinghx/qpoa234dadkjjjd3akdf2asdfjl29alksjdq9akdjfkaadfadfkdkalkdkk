const allScripts = {
	morgue: "Security assistance is required for 10-12 external. Please attend and thank you.",
	panic: "Panic Alarm\n",
	doorAccess: "Security assistance is required for door access at the given location. Please attend and thank you.\n- Ext. CONTACT",
	codeLine: "CDS has received a code on the Code Line. Details are as below:\n- Code Type: Code CDTYP\n- Ext. CONTACT\n- Announcement: CDANN",
	nc: "CDS has received a code on the nurse console. Details are as below:\n- Code Type: CDTYP\n- Code Nomenclature: CDNOM\n- Announcement: CDANN",
	lights: "Caller has reported lights not working at the given location. Alternate lights are present, so, the room is not completely dark. Please attend and thank you.\n- Please call CONTACT if required.",
	lightsDark: "Caller has reported lights not working at the given location. The room is completely dark. Please attend and thank you.\n- Please call CONTACT if required.",
	terminalClean: "Please attend and complete the follwing cleaning request. The details are mentioned below:\nCleaning Type: CT\nDate Requested: DR\nTime Requested: TR\nType of work completed: TW\nExtension/Contact: EC",
	tooCold: "Caller reported that it is too cold at the given location. Please attend and thank you.\n- Ext: CONTACT",
	tooHot: "Caller reported that it is too hot at the given location. Please attend and thank you.\n- Ext. CONTACT",
	aprDeactivate: "Caller requested to deactivate negative pressure room at the given location. This request has been approved by IPAC. Please attend and thank you.\n- Ext. CONTACT",
	aprActivate: "Caller requested to activate negative pressure room at the given location. Please attend and thank you.\n- Ext. CONTACT",
	trash: "CDS TransVac monitor is showing trash risers WHICH disabled with low air velocity. Please attend and restore operation to risers WHICH. Thank you. ",
	linen: "CDS TransVac monitor is showing linen risers WHICH disabled with low air velocity. Please attend and restore operation to risers WHICH. Thank you.",
	agv: "The following AGV is in alarm. Details are below. Please attend and thank you.\n> AGV: NUMBER\n> Location: LOC\n> Error Message(s): ERR.",
	toiletClogged: "Caller has reported a clogged toilet at the given location. Please attend and thank you.\n- Please call CONTACT if required.",
	
	// External Scripts (HRH Departments)
	biomed: "Caller is requesting Biomed to inspect/provide the following equipment/items. Please attend and thank you\n\nEquipment/Item Type: EQUIP\nType of request: TOR\nExtension/Contact: CONTACT",
	humberIt: "Caller is requesting Humber IT to inspect/fix the following equipment(s) at the given location. Please attend and thank you.\n\nEquipment Name: EQUIP\nEquipment ID (If Applicable): EQID\nProblem/Issue: TOR\nExtension/Contact: CONTACT",
	ge: "Caller is requesting service for the GE equipment(s) at the given location. Details are as below:\nEquipment Type: EQUIP\nEquipment ID: EQID\nProblem/Issue: TOR\nMachine Status: STAT\nContact: CONTACT",

	// Remarks
	remarksClearCode: "Received call from Ext. CONTACT. Staff requested to cancel the code. Announced, 'Cancel - CDANN' twice overhead.",
	remarksCode: "Code was announced overhead twice as, 'CDANN'.",
	remarksSupportServices: "Notified Support Services.",
	remarksSecurity: "Event assigned to Security Department.",
	remarksHrhIt: "Event assigned to HRH IT.",
	remarksBiomed: "Event assigned to Biomed.",
	remarksAssignedJciGen: "Assigned to PERSON.\nRoom(s) affected: \nIs the room still in use? \nWork performed: \nRoot cause: \nSerial/Make/Model (if applicable): ",
	remarksNotifiedJciGen: "Notified PERSON.\nRoom(s) affected: \nIs the room still in use? \nWork performed: \nRoot cause: \nSerial/Make/Model (if applicable): ",
	remarksJciIt: "Assigned to JCI IT.\nRoom(s) affected: \nIs the room still in use? \nWork performed: \nRoot cause: \nSerial/Make/Model (if applicable): ",
	remarksTemp: "Assigned to PERSON.\nRDS Range: RGE\nCurrent Room Setpoint: \nCurrent Room Temperature: \nAdjustment(s) Made: \nAdditional Comments: ",
	remarksGe: "Called GE. Reference number is: RN.",
}

export default allScripts;