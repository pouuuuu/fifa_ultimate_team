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

const SERVER_URL = "http://localhost:8080"; // A modifier si spring en local ou distant

function App() {
    return (
        <>
            <h1>Marché des Transferts</h1>
            <PlayerCatalog />
        </>
    )
}

function PlayerTemplate({ cardType, rating, position, country, club, player, name, pac, sho, pas, dri, def, phy, div, han, kic, ref, spe, pos }) {
    const isGK = div !== undefined;
    const textColor = CARD_COLORS[cardType];

    return (
        <div className="player" style={{color : textColor}}>
            <img
                className="card-bg"
                src={'/images/fonds/' + cardType + ".png"}
                alt="background"
                loading="lazy"
                decoding="async"
            />

            <div className="player-master-info">
                <div className="rating">{rating}</div>
                <div className="position">{isGK ? "GK" : getShortPos(position)}</div>
                <div className="icons">
                    <img className="country" src={"/images/pays/" + country + ".png"} alt={country} loading="lazy" />
                    <img className="club" src={"/images/clubs/" + club + ".png"} alt={club} loading="lazy" />
                </div>
            </div>

            <div className="player-avatar">
                <img
                    src={"/images/joueurs/" + player + ".png"}
                    alt={name}
                    loading="lazy"
                    decoding="async"
                />
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
    const [options, setOptions] = useState({ clubs: [], nations: [], cardTypes: [] });

    const [showClubs, setShowClubs] = useState(false);
    const [showNations, setShowNations] = useState(false);

    useEffect(() => {
        fetch(SERVER_URL + '/api/players/filters')
            .then(res => res.json())
            .then(data => setOptions(data));
    }, []);

    useEffect(() => {
        fetchPlayers();
    }, [page, nameFilter, clubFilter, nationFilter, typeFilter]);

    const fetchPlayers = async () => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: '12'
        });

        if (nameFilter) params.append('name', nameFilter);
        if (clubFilter) params.append('club', clubFilter);
        if (nationFilter) params.append('nation', nationFilter);
        if (typeFilter) params.append('cardType', typeFilter);

        try {
            const response = await fetch(SERVER_URL + `/api/players/search?${params.toString()}`);
            const data = await response.json();
            setPlayers(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Erreur de récupération:", error);
        }
    };

    const handleFilterChange = (setter, value) => {
        setter(value);
        setPage(0);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo(0, 0);
    };

    return (
        <div className="catalog-container">
            <div className="filters">
                <input
                    type="text"
                    placeholder="Nom du joueur..."
                    value={nameFilter}
                    onChange={(e) => handleFilterChange(setNameFilter, e.target.value)}
                />

                <div className="autocomplete">
                    <input
                        type="text"
                        placeholder="Chercher un club..."
                        value={clubFilter}
                        onFocus={() => setShowClubs(true)}
                        onChange={(e) => handleFilterChange(setClubFilter, e.target.value)}
                    />
                    {showClubs && clubFilter && (
                        <ul className="suggestions">
                            {options.clubs
                                .filter(c => c.toLowerCase().includes(clubFilter.toLowerCase()))
                                .slice(0, 10)
                                .map(c => (
                                    <li key={c} onClick={() => { setClubFilter(c); setShowClubs(false); setPage(0); }}>{c}</li>
                                ))}
                        </ul>
                    )}
                </div>

                <div className="autocomplete">
                    <input
                        type="text"
                        placeholder="Chercher un pays..."
                        value={nationFilter}
                        onFocus={() => setShowNations(true)}
                        onChange={(e) => handleFilterChange(setNationFilter, e.target.value)}
                    />
                    {showNations && nationFilter && (
                        <ul className="suggestions">
                            {options.nations
                                .filter(n => n.toLowerCase().includes(nationFilter.toLowerCase()))
                                .slice(0, 10)
                                .map(n => (
                                    <li key={n} onClick={() => { setNationFilter(n); setShowNations(false); setPage(0); }}>{n}</li>
                                ))}
                        </ul>
                    )}
                </div>

                <select value={typeFilter} onChange={(e) => handleFilterChange(setTypeFilter, e.target.value)}>
                    <option value="">Toutes les raretés</option>
                    {options.cardTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>

            <div className="player-grid" key={page}>
                {players.length > 0 ? (
                    players.map(p => (
                        <PlayerTemplate key={p.id} {...p} player={p.name+"%20"+p.surname} name={p.surname} />
                    ))
                ) : (
                    <p className="no-results">Aucun joueur trouvé.</p>
                )}
            </div>

            <div className="pagination">
                <button disabled={page === 0} onClick={() => handlePageChange(page - 1)}>Précédent</button>
                <span> Page {page + 1} sur {totalPages} </span>
                <button disabled={page >= totalPages - 1} onClick={() => handlePageChange(page + 1)}>Suivant</button>
            </div>
        </div>
    );
}

const positionMap = {
    "Central Attack Midfielder": "CAM", "Right Back": "RB", "Left Back": "LB",
    "Center Back": "CB", "Striker": "ST", "Center Forward": "CF",
    "Left Winger": "LW", "Right Winger": "RW", "Central Midfielder": "CM",
    "Central Defensive Midfielder": "CDM", "Right Midfielder": "RM",
    "Left Wing Back": "LWB","Right Wing Back": "RWB",
    "Left Forward": "LF", "Right Forward": "RF",
    "Left Midfielder": "LM", "Goalkeeper": "GK"
};

const getShortPos = (longPos) => positionMap[longPos] || longPos;

export default App;