import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../config';
import PlayerCard from './PlayerCard';
import './Team.css';
import { POSITION_FILTERS, getShortPos } from '../utils';

function Team() {
    const [squad, setSquad] = useState({
        LW: null, ST: null, RW: null,
        CM1: null, CM2: null, CM3: null,
        LB: null, CB1: null, CB2: null, RB: null,
        GK: null
    });

    const [players, setPlayers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({
        name: '',
        club: '',
        nation: '',
        cardType: '',
        positions: []
    });
    const [options, setOptions] = useState({ clubs: [], nations: [], cardTypes: [] });

    const user = JSON.parse(localStorage.getItem('user'));
    const [inventoryCards, setInventoryCards] = useState([]); // liste de UserCard (id + player)

    useEffect(() => {
        if (!user) return;

        const fetchInventoryForTeam = async () => {
            try {
                const res = await fetch(`${SERVER_URL}/api/team/${user.id}/cards`);
                const data = await res.json(); // List<UserCard>
                setInventoryCards(data);
            } catch (e) {
                console.error("Erreur chargement cartes équipe:", e);
            }
        };

        const fetchActiveTeam = async () => {
            try {
                const res = await fetch(`${SERVER_URL}/api/team/${user.id}`);
                if (!res.ok) {
                    return; // aucun 11 enregistré pour cet utilisateur
                }
                const team = await res.json();

                const toSlot = (card) =>
                    card ? { userCardId: card.id, player: card.player } : null;

                setSquad({
                    LW: toSlot(team.lw),
                    ST: toSlot(team.st),
                    RW: toSlot(team.rw),
                    CM1: toSlot(team.cm1),
                    CM2: toSlot(team.cm2),
                    CM3: toSlot(team.cm3),
                    LB: toSlot(team.lb),
                    CB1: toSlot(team.cb1),
                    CB2: toSlot(team.cb2),
                    RB: toSlot(team.rb),
                    GK: toSlot(team.gk)
                });
            } catch (e) {
                console.error("Erreur chargement équipe active:", e);
            }
        };

        fetchInventoryForTeam();
        fetchActiveTeam();
    }, []);

    useEffect(() => {
        fetch(`${SERVER_URL}/api/players/filters`)
            .then(res => res.json())
            .then(data => setOptions(data))
            .catch(err => console.error("Erreur filtres:", err));
    }, []);

    const filteredInventory = inventoryCards.filter(uc => {
        const p = uc.player;
        const matchName =
            !filters.name ||
            (p.name && p.name.toLowerCase().includes(filters.name.toLowerCase())) ||
            (p.surname && p.surname.toLowerCase().includes(filters.name.toLowerCase()));
        const matchClub = !filters.club || p.club === filters.club;
        const matchNation = !filters.nation || p.country === filters.nation;
        const matchType = !filters.cardType || p.cardType === filters.cardType;

        const hasPositionFilter = filters.positions && filters.positions.length > 0;
        let matchPosition = true;
        if (hasPositionFilter) {
            const isGK = p.div !== undefined;
            const shortPos = isGK ? 'GK' : getShortPos(p.position);
            matchPosition = filters.positions.includes(shortPos);
        }

        return matchName && matchClub && matchNation && matchType && matchPosition;
    });


    const handleFilterChange = (e, field) => {
        setFilters(prev => ({ ...prev, [field]: e.target.value }));
        setPage(0);
    };

    const handlePositionsChange = (e) => {
        const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setFilters(prev => ({ ...prev, positions: selected }));
        setPage(0);
    };

    const handleDragStart = (e, userCard) => {
        const payload = {
            userCardId: userCard.id,
            player: userCard.player
        };
        e.dataTransfer.setData('card', JSON.stringify(payload));
    };

    const handleDrop = (e, targetPosition) => {
        e.preventDefault();
        const cardData = e.dataTransfer.getData('card');
        if (!cardData) return;

        const { userCardId, player } = JSON.parse(cardData);

        const isTargetGK = targetPosition === 'GK';
        const isPlayerGK = player.div !== undefined;

        if (isTargetGK && !isPlayerGK) {
            alert("Vous ne pouvez placer qu'un gardien de but à ce poste.");
            return;
        }
        if (!isTargetGK && isPlayerGK) {
            alert("Un gardien ne peut pas être placé sur le champ.");
            return;
        }

        // Empêcher la même carte d'être placée deux fois
        const alreadyUsed = Object.entries(squad)
            .filter(([pos]) => pos !== targetPosition)
            .some(([, slot]) => slot && slot.userCardId === userCardId);
        if (alreadyUsed) {
            alert("Ce joueur est déjà dans l'équipe.");
            return;
        }

        setSquad(prev => ({
            ...prev,
            [targetPosition]: { userCardId, player }
        }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removePlayer = (position) => {
        setSquad(prev => ({ ...prev, [position]: null }));
    };

    const handleSaveTeam = async () => {
        if (!user) {
            alert("Vous devez être connecté pour sauvegarder votre équipe.");
            return;
        }

        const playerPositions = {};

        Object.entries(squad).forEach(([position, slot]) => {
            if (slot && slot.userCardId) {
                playerPositions[position] = slot.userCardId;
            }
        });

        try {
            const res = await fetch(`${SERVER_URL}/api/team/${user.id}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(playerPositions)
            });

            if (!res.ok) {
                const msg = await res.text();
                alert(msg || "Erreur lors de la sauvegarde de l'équipe");
            } else {
                alert("Équipe sauvegardée !");
            }
        } catch (e) {
            console.error("Erreur sauvegarde équipe:", e);
            alert("Erreur réseau lors de la sauvegarde.");
        }
    };

    const pitchPositions = [
        { id: 'LW', label: 'AG', top: '15%', left: '20%' },
        { id: 'ST', label: 'BU', top: '10%', left: '50%' },
        { id: 'RW', label: 'AD', top: '15%', left: '80%' },
        { id: 'CM1', label: 'MC', top: '40%', left: '30%' },
        { id: 'CM2', label: 'MC', top: '45%', left: '50%' },
        { id: 'CM3', label: 'MC', top: '40%', left: '70%' },
        { id: 'LB', label: 'DG', top: '70%', left: '15%' },
        { id: 'CB1', label: 'DC', top: '75%', left: '35%' },
        { id: 'CB2', label: 'DC', top: '75%', left: '65%' },
        { id: 'RB', label: 'DD', top: '70%', left: '85%' },
        { id: 'GK', label: 'G', top: '88%', left: '50%' }
    ];

    return (
        <div className="team-builder-container">
            <div className="team-layout">
                <div className="pitch-container">
                    <h1>Création d'équipe</h1>
                    <div className="pitch">
                        {pitchPositions.map(pos => (
                            <div
                                key={pos.id}
                                className="pitch-slot"
                                style={{ top: pos.top, left: pos.left }}
                                onDrop={(e) => handleDrop(e, pos.id)}
                                onDragOver={handleDragOver}
                                onClick={() => squad[pos.id] && removePlayer(pos.id)}
                            >
                                {squad[pos.id] ? (
                                    <div className="placed-player-card">
                                        <PlayerCard player={squad[pos.id].player} />
                                    </div>
                                ) : (
                                    <div className="empty-slot">{pos.label}</div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button className="save-team-btn" onClick={handleSaveTeam}>
                        Sauvegarder l'équipe
                    </button>
                </div>

                <div className="inventory-section">
                    <h2 className="inventory-section-title">Rechercher des joueurs</h2>
                    <div className="filters-bar">
                        <input
                            type="text"
                            placeholder="Nom du joueur..."
                            value={filters.name}
                            onChange={(e) => handleFilterChange(e, 'name')}
                        />
                        <select value={filters.club} onChange={(e) => handleFilterChange(e, 'club')}>
                            <option value="">Tous les clubs</option>
                            {options.clubs?.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={filters.nation} onChange={(e) => handleFilterChange(e, 'nation')}>
                            <option value="">Tous les pays</option>
                            {options.nations?.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <select value={filters.cardType} onChange={(e) => handleFilterChange(e, 'cardType')}>
                            <option value="">Toutes les raretés</option>
                            {options.cardTypes?.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                        </select>
                        <select
                            multiple
                            size={5}
                            value={filters.positions}
                            onChange={handlePositionsChange}
                        >
                            {POSITION_FILTERS.map(pos => (
                                <option key={pos} value={pos}>{pos}</option>
                            ))}
                        </select>
                    </div>

                    <div className="players-list">
                        {filteredInventory.length > 0 ? (
                            filteredInventory.map(uc => (
                                <div
                                    key={uc.id}
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, uc)}
                                    className="draggable-player"
                                >
                                    <PlayerCard player={uc.player} />
                                </div>
                            ))
                        ) : (
                            <p>Aucune carte trouvée dans votre club.</p>
                        )}
                    </div>

                    <div className="pagination">
                        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Précédent</button>
                        <span>Page {page + 1} sur {totalPages || 1}</span>
                        <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Suivant</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Team;
