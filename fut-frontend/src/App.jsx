import './App.css'
import {useEffect, useState} from 'react';

function App() {
    const [players, setPlayers] = useState([])

    useEffect(() => {
        fetch('http://localhost:8080/api/players')
            .then(response => response.json())
            .then(data => {
                setPlayers(data)
            })
            .catch(error => {
                console.error("Erreur Spring:", error)
            })
    }, [])

    return (
        <>
            <h1>Accueil</h1>
            <div className="search-main">
                <input type="text" name="titre" placeholder="Rechercher un joueur..."/>
                <button type="submit">Rechercher</button>
            </div>
            <details class="search-filters">
                <summary>Filtres avancés</summary>
                <div class="filters-content">
                    <div class="filter-group">
                        <label>Statistiques</label>
                        <select name="type">
                            <option>Pipi</option>
                            <option>Caca</option>
                            <option>Prout</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>Pays</label>
                        <select name="type">
                            <option>Les Pays</option>
                            <option>Sénécale</option>
                            <option>Le Italie</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>Rôle</label>
                        <select name="type">
                            <option>Goal</option>
                            <option>Demandeur</option>
                            <option>Défendeur</option>
                        </select>
                    </div>
                </div>
            </details>


            <div className="player-list">
                <h2>Liste des joueurs</h2>
                <ul>
                    <li>
                        <div>
                            <PlayerTemplate></PlayerTemplate>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    )
}


function PlayerTemplate() {
    return (
        <div className="player">
            <img
                className="card-bg"
                src={'../public/images/fonds/shapeshifters.png'}
                alt={'card background'}
            />

            <div className="player-master-info">
                <div className="rating">99</div>
                <div className="position">CF</div>
                <div className="icons">
                    <img className="country" src={"../public/images/pays/Argentina.png"} alt="Argentina"/>
                    <img className="club" src={"../public/images/clubs/Paris%20Saint-Germain.png"} alt="PSG"/>
                </div>
            </div>

            <div className="player-avatar">
                <img src={"../public/images/joueurs/Lionel%20Messi.png"} alt="Messi"/>
            </div>

            <div className="player-card-bottom">
                <div className="name">
                    <span>MESSI</span>
                </div>
                <div className="attributs">
                    <div className="stat-col">
                        <span>95 PAC</span>
                        <span>98 SHO</span>
                        <span>99 PAS</span>
                    </div>
                    <div className="stat-col">
                        <span>99 DRI</span>
                        <span>42 DEF</span>
                        <span>78 PHY</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App
