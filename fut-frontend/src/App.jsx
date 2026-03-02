import './App.css'
import React, { useState, useEffect } from 'react';

function App() {
    return (
        <>
            <h1>Accueil</h1>
            <div className="search-main">
                <input type="text" name="titre" placeholder="Rechercher un joueur..."/>
                <button type="submit">Rechercher</button>
            </div>
            <PlayerCatalog />
        </>
    )
}

function PlayerTemplate({ cardType, rating, position, country, club, player, name, pac, sho, pas, dri, def, phy, div, han, kic, ref, spe, pos }) {
    const isGK = div !== undefined;

    return (
        <div className="player">
            <img className="card-bg" src={'../public/images/fonds/' + cardType + ".png"} alt="card background" />

            <div className="player-master-info">
                <div className="rating">{rating}</div>
                <div className="position">{isGK ? "GK" : position}</div>
                <div className="icons">
                    <img className="country" src={"../public/images/pays/" + country + ".png"} alt={country}/>
                    <img className="club" src={"../public/images/clubs/" + club + ".png"} alt={club}/>
                </div>
            </div>

            <div className="player-avatar">
                {console.log(player)}
                <img src={"../public/images/joueurs/" + player + ".png"} alt={name}/>
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
    const [currentPage, setCurrentPage] = useState(1);
    const playersPerPage = 8;

    useEffect(() => {
        fetch('http://134.59.27.129:8080/api/players')
            .then(res => res.json())
            .then(data => {
                console.log("Joueurs reçus :", data);
                setPlayers(data);
            })
            .catch(err => console.error("Erreur API:", err));
    }, []);

    const lastIndex = currentPage * playersPerPage;
    const firstIndex = lastIndex - playersPerPage;
    const currentPlayers = players.slice(firstIndex, lastIndex);

    return (
        <div className="catalog-container">
            <div className="player-grid">
                {currentPlayers.length > 0 ? (
                    currentPlayers.map(p => (
                        <PlayerTemplate key={p.id} {...p} player={p.name+"%20"+p.surname} name={p.surname} />
                    ))
                ) : (
                    <p style={{color: 'white'}}>Chargement des joueurs ou liste vide...</p>
                )}
            </div>

            <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Précédent
                </button>
                <span>Page {currentPage}</span>
                <button disabled={lastIndex >= players.length} onClick={() => setCurrentPage(currentPage + 1)}>
                    Suivant
                </button>
            </div>
        </div>
    );
}

export default App;