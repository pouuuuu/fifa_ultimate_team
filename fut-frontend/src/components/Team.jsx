import React, { useState, useEffect } from 'react';

function Team() {
    const userId = 1;

    const [team, setTeam] = useState(null);
    const [cards, setCards] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const teamRes = await fetch(`http://localhost:8080/api/team/${userId}`);
                let teamData = null;

                if (teamRes.ok) {
                    teamData = await teamRes.json();
                    setTeam(teamData);

                    const currentPositions = {};
                    if (teamData.players) {
                        teamData.players.forEach(userCard => {
                            if (userCard.player.position) {
                                currentPositions[userCard.player.position] = userCard.id;
                            }
                        });
                    }
                    setSelectedPositions(currentPositions);
                }

                const cardsRes = await fetch(`http://localhost:8080/api/team/${userId}/cards`);
                if (cardsRes.ok) {
                    const cardsData = await cardsRes.json();
                    setCards(cardsData);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllData();
    }, [refreshTrigger]);

    const handleSelectPlayer = (position, cardId) => {
        setSelectedPositions(prev => ({
            ...prev,
            [position]: cardId
        }));
    };

    const saveTeam = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/team/${userId}/update`, {
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

    const formationRows = [
        ['LW', 'ST', 'RW'],
        ['LM', 'CM', 'RM'],
        ['LWB', 'LB', 'RB', 'RWB'],
        ['CB']
    ];

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <h1 style={{ textAlign: 'center' }}>Gestion de mon Équipe</h1>

            <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>Mon 11 de Départ</h2>
                    <button
                        onClick={saveTeam}
                        style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Sauvegarder la formation
                    </button>
                </div>

                <div style={{
                    backgroundColor: '#2e7d32',
                    border: '2px solid white',
                    borderRadius: '10px',
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '40px',
                    minHeight: '600px',
                    justifyContent: 'space-around'
                }}>
                    {formationRows.map((row, rowIndex) => (
                        <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
                            {row.map(pos => {
                                const cardId = selectedPositions[pos];
                                const card = cards.find(c => c.id === cardId) || team?.players?.find(c => c.id === cardId);

                                return (
                                    <div key={pos} style={{
                                        width: '120px',
                                        height: '160px',
                                        backgroundColor: card ? '#111' : 'rgba(0,0,0,0.3)',
                                        border: card ? '2px solid gold' : '2px dashed rgba(255,255,255,0.5)',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        padding: '5px'
                                    }}>
                                        <p style={{ margin: '0 0 5px 0', color: card ? 'gold' : '#ccc', fontWeight: 'bold' }}>{pos}</p>
                                        {card ? (
                                            <>
                                                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>{card.player.name}</strong></p>
                                                <p style={{ margin: '5px 0', fontSize: '12px' }}>Note: {card.player.rating}</p>
                                            </>
                                        ) : (
                                            <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>Vide</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '10px' }}>
                <h2>Mon Club (Cartes Disponibles)</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '20px' }}>
                    {cards.length > 0 ? (
                        cards.map(userCard => {
                            const isSelected = selectedPositions[userCard.player.position] === userCard.id;

                            return (
                                <div key={userCard.id} style={{ border: '1px solid #888', padding: '10px', borderRadius: '8px', width: '150px', backgroundColor: '#222', textAlign: 'center' }}>
                                    <p style={{ margin: '5px 0', color: '#888' }}>{userCard.player.position}</p>
                                    <p style={{ margin: '5px 0' }}><strong>{userCard.player.name}</strong></p>
                                    <p style={{ margin: '5px 0' }}>Note: {userCard.player.rating}</p>

                                    <button
                                        onClick={() => handleSelectPlayer(userCard.player.position, userCard.id)}
                                        style={{
                                            marginTop: '10px', padding: '5px', width: '100%', cursor: 'pointer', border: 'none', borderRadius: '3px',
                                            backgroundColor: isSelected ? '#ffc107' : '#007bff',
                                            color: isSelected ? 'black' : 'white'
                                        }}
                                    >
                                        {isSelected ? "Sélectionné" : `Placer`}
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <p style={{ color: '#aaa' }}>Vous n'avez aucune carte dans votre club.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Team;