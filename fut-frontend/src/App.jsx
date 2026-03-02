import './App.css'
import React, { useState, useEffect } from 'react';

const CARD_COLORS = {
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

function App() {
    return (
        <>
            <h1>Accueil</h1>
            <PlayerCatalog />
        </>
    )
}

function PlayerTemplate({ cardType, rating, position, country, club, player, name, pac, sho, pas, dri, def, phy, div, han, kic, ref, spe, pos }) {
    const isGK = div !== undefined;
    const textColor = CARD_COLORS[cardType];

    return (
        <div className="player" style={{color : textColor}}>
            <img className="card-bg" src={'/images/fonds/' + cardType + ".png"} alt="background" />

            <div className="player-master-info">
                <div className="rating">{rating}</div>
                <div className="position">{isGK ? "GK" : getShortPos(position)}</div>
                <div className="icons">
                    <img className="country" src={"/images/pays/" + country + ".png"} alt={country}/>
                    <img className="club" src={"/images/clubs/" + club + ".png"} alt={club}/>
                </div>
            </div>

            <div className="player-avatar">
                <img src={"/images/joueurs/" + player + ".png"} alt={name}/>
            </div>

            <div className="player-card-bottom">
                <div className="name"><span>{name}</span></div>
                <div className="attributs">
                    <div className="stat-col">
                        <span>{isGK ? div : pac} {isGK ? "DIV" : "PAC"}</span>
                        <span>{isGK ? han : sho} {isGK ? "HAN" : "SHO"}</span>
                        <span>{isGK ? kic : pas} {isGK ? "KIC" : "PAS"}</span>
                    </div>
                    <div className="stat-col">
                        <span>{isGK ? ref : dri} {isGK ? "REF" : "DRI"}</span>
                        <span>{isGK ? spe : def} {isGK ? "SPE" : "DEF"}</span>
                        <span>{isGK ? pos : phy} {isGK ? "POS" : "PHY"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlayerCatalog() {
    const [players, setPlayers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);

    const [nameFilter, setNameFilter] = useState('');
    const [clubFilter, setClubFilter] = useState('');
    const [nationFilter, setNationFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    useEffect(() => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: '24'
        });

        if (nameFilter) params.append('name', nameFilter);
        if (clubFilter) params.append('club', clubFilter);
        if (nationFilter) params.append('nation', nationFilter);
        if (typeFilter) params.append('cardType', typeFilter);

        fetch(`http://134.59.27.129:8080/api/players/search?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setPlayers(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(err => console.error("Erreur API:", err));
    }, [page, nameFilter, clubFilter, nationFilter, typeFilter]);

    const handleFilterChange = (setter, value) => {
        setter(value);
        setPage(0);
    };

    return (
        <div className="catalog-container">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Rechercher un joueur..."
                    value={nameFilter}
                    onChange={(e) => handleFilterChange(setNameFilter, e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Club..."
                    value={clubFilter}
                    onChange={(e) => handleFilterChange(setClubFilter, e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Nation..."
                    value={nationFilter}
                    onChange={(e) => handleFilterChange(setNationFilter, e.target.value)}
                />
                <select value={typeFilter} onChange={(e) => handleFilterChange(setTypeFilter, e.target.value)}>
                    <option value="">Tous les types</option>
                    <option value="goldrare">Or Rare</option>
                    <option value="toty">TOTY</option>
                    <option value="playermoments">Player Moments</option>
                    {/* Ajouter les autres types ici */}
                </select>
            </div>

            <div className="player-grid">
                {players.map(p => (
                    <PlayerTemplate
                        key={p.id}
                        {...p}
                        player={p.name+"%20"+p.surname}
                        name={p.surname}
                    />
                ))}
            </div>

            <div className="pagination">
                <button
                    disabled={page === 0}
                    onClick={() => { setPage(page - 1); window.scrollTo(0,0); }}>
                    Précédent
                </button>
                <span>Page {page + 1} sur {totalPages}</span>
                <button
                    disabled={page >= totalPages - 1}
                    onClick={() => { setPage(page + 1); window.scrollTo(0,0); }}>
                    Suivant
                </button>
            </div>
        </div>
    );
}

const positionMap = {
    "Central Attack Midfielder": "CAM", "Right Back": "RB", "Left Back": "LB",
    "Center Back": "CB", "Striker": "ST", "Center Forward": "CF",
    "Left Winger": "LW", "Right Winger": "RW", "Central Midfielder": "CM",
    "Central Defensive Midfielder": "CDM", "Right Midfielder": "RM",
    "Left Midfielder": "LM", "Goalkeeper": "GK"
};

const getShortPos = (longPos) => positionMap[longPos] || longPos;

export default App;