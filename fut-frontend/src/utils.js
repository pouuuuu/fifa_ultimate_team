export const CARD_COLORS = {
    bronze: "#000000",
    bronzerare: "#000000",
    silver: "#000000",
    silverrare: "#000000",
    gold: "#000000",
    goldrare: "#000000",
    iconswaps1: "#000000",
    iconswaps2: "#000000",
    goldif: "#f9e99e",
    toty: "#f9e99e",
    tots: "#f9e99e",
    goldblue: "#f9e99e",
    wildcard: "#f9e99e",
    wildcardtoken: "#f9e99e",
    icons: "#73663b",
    legend: "#73663b",
    onestowatch: "#c6f553",
    halloween: "#c6f553",
    showdownwinner: "#c6f553",
    premiumsbc: "#ff98fc",
    clfinal: "#a8fcff",
    versusfire: "#a8fcff",
    laligapotm: "#a8fcff",
    nextgen: "#a8fcff",
    fantasyblue: "#a8fcff",
    futurestars: "#fdfb4b",
    playermoments: "#fdfb4b",
    season1: "#fdfb4b",
    objective: "#fdfb4b",
    futurestarstoken: "#fdfb4b",
    fantasypurple: "#fdfb4b",
    futcaptainheroes: "#fdfb4b",
    l1potm: "#b7ca24",
    mlsobjective: "#aebebb"
};

export const POSITION_FILTERS = [
    "GK",
    "CB", "RB", "LB", "RWB", "LWB",
    "CDM", "CM", "CAM",
    "RM", "LM",
    "RW", "LW",
    "CF", "ST",
    "LF", "RF"
];

const positionMap = {
    "Central Attack Midfielder": "CAM", "Right Back": "RB", "Left Back": "LB",
    "Center Back": "CB", "Striker": "ST", "Center Forward": "CF",
    "Left Winger": "LW", "Right Winger": "RW", "Central Midfielder": "CM",
    "Central Defensive Midfielder": "CDM", "Right Midfielder": "RM",
    "Left Wing Back": "LWB","Right Wing Back": "RWB",
    "Left Forward": "LF", "Right Forward": "RF",
    "Left Midfielder": "LM", "Goalkeeper": "GK"
};

export const getShortPos = (longPos) => positionMap[longPos] || longPos;