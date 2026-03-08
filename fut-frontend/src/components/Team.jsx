import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../config';
import PlayerCard from './PlayerCard';
import './Team.css';

function Team() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;

    const [team, setTeam] = useState(null);
    const [cards, setCards] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        if (!userId) return;

        const fetchAllData = async () => {
            try {
                const teamRes = await fetch(`${SERVER_URL}/api/team/${userId}`);
                if (teamRes.ok) {
                    const teamData = await teamRes.json();
                    setTeam(teamData);

                    const currentPositions = {};
                    if (teamData.players) {
                        teamData.players.forEach(userCard => {
                            const posKey = userCard.player.position || "GK";
                            currentPositions[posKey] = userCard.id;
                        });
                    }
                    setSelectedPositions(currentPositions);
                }

                const cardsRes = await fetch(`${SERVER_URL}/api/team/${userId}/cards`);
                if (cardsRes.ok) {
                    const cardsData = await cardsRes.json();
                    setCards(cardsData);
                }
            } catch (error) {
                console.error("Erreur chargement:", error);
            }
        };

        fetchAllData();
    }, [refreshTrigger, userId]);

    const handleSelectPlayer = (posKey, cardId) => {
        setSelectedPositions(prev => ({ ...prev, [posKey]: cardId }));
    };

    const saveTeam = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/api/team/${userId}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedPositions)
            });

            if (response.ok) {
                alert("Formation sauvegardée !");
                setRefreshTrigger(prev => prev + 1);
            } else {
                const errorMsg = await response.text();
                alert(errorMsg);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const formation433 = [
        { row: ['LW', 'ST', 'RW'] },
        { row: ['CM', 'CM', 'CM'] },
        { row: ['LB', 'CB', 'CB', 'RB'] },
        { row: ['GK'] }
    ];

    return (
        <div className="team-container">
            <h1 className="team-title">Gestion de mon Équipe</h1>

            <div className="pitch-wrapper">
                <div className="pitch-header">
                    <h2>Mon 11 de Départ (4-3-3)</h2>
                    <button onClick={saveTeam} className="save-btn">
                        Sauvegarder
                    </button>
                </div>

                <div className="football-pitch">
                    {formation433.map((line, rowIndex) => (
                        <div key={rowIndex} className="pitch-row">
                            {line.row.map((pos, colIndex) => {
                                const cardId = selectedPositions[pos];
                                const card = cards.find(c => c.id === cardId) || team?.players?.find(c => c.id === cardId);

                                return (
                                    <div key={`${pos}-${colIndex}`} className={`player-slot ${!card ? 'slot-empty' : ''}`}>
                                        <span className="pos-badge">{pos}</span>
                                        {card ? (
                                            <div className="card-scale-wrapper">
                                                <PlayerCard player={card.player} />
                                            </div>
                                        ) : (
                                            <span className="pos-placeholder">{pos}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div className="club-inventory">
                <h2>Mon Club</h2>
                <div className="club-grid">
                    {cards.map(userCard => {
                        const playerPosKey = userCard.player.position || "GK";
                        const isSelected = Object.values(selectedPositions).includes(userCard.id);

                        return (
                            <div key={userCard.id} className="club-card-item">
                                <div className="card-scale-wrapper">
                                    <PlayerCard player={userCard.player} />
                                </div>
                                <button
                                    onClick={() => handleSelectPlayer(playerPosKey, userCard.id)}
                                    className={`select-btn ${isSelected ? 'is-selected' : ''}`}
                                    style={{
                                        backgroundColor: isSelected ? '#ffc107' : '#007bff',
                                        color: isSelected ? 'black' : 'white'
                                    }}
                                >
                                    {isSelected ? "Sélectionné" : `Placer ${playerPosKey}`}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Team;