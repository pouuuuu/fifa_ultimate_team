import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../config';
import PlayerCard from './PlayerCard';

function Inventory() {
    const [userCards, setUserCards] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const [filters, setFilters] = useState({ name: '', club: '', nation: '', cardType: '' });
    const [options, setOptions] = useState({ clubs: [], nations: [], cardTypes: [] });
    const itemsPerPage = 12;

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const res = await fetch(`${SERVER_URL}/api/players/filters`);
                const data = await res.json();
                setOptions(data);
            } catch (e) {
                console.error("Erreur options filtres:", e);
            }
        };
        fetchFilterOptions();
    }, []);

    useEffect(() => {
        const fetchInventory = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const response = await fetch(`${SERVER_URL}/api/users/${user.id}/cards`);
                const data = await response.json();
                setUserCards(data);
            } catch (error) {
                console.error("Erreur inventaire:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const handleSell = async (userCardId) => {
        const price = prompt("Entrez le prix de vente (coins) :");
        if (!price || isNaN(price)) return;

        try {
            const response = await fetch(`${SERVER_URL}/api/market/sell?sellerId=${user.id}&userCardId=${userCardId}&price=${price}`, {
                method: 'POST'
            });

            if (response.ok) {
                alert("Carte mise en vente");
                setUserCards(userCards.filter(uc => uc.id !== userCardId));
            }
        } catch (error) {
            console.error("Erreur lors de la vente", error);
        }
    };

    const filteredCards = userCards.filter(uc => {
        const p = uc.player;
        const matchName =
            !filters.name ||
            (p.name && p.name.toLowerCase().includes(filters.name.toLowerCase())) ||
            (p.surname && p.surname.toLowerCase().includes(filters.name.toLowerCase()));
        const matchClub = !filters.club || p.club === filters.club;
        const matchNation = !filters.nation || p.country === filters.nation;
        const matchType = !filters.cardType || p.cardType === filters.cardType;

        return matchName && matchClub && matchNation && matchType;
    });

    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
    const displayedCards = filteredCards.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handleFilterChange = (e, field) => {
        setFilters(prev => ({ ...prev, [field]: e.target.value }));
        setPage(0);
    };



    return (
        <div className="catalog-container">
            <h1>Mon Inventaire</h1>

            {loading ? (
                <div className="loading-indicator">Chargement...</div>
            ) : (
                <>
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
                    </div>
                    <div className="player-grid">
                        {displayedCards.length > 0 ? (
                            displayedCards.map(uc => (
                                <div key={uc.id} className="inventory-card-wrapper">
                                    <PlayerCard player={uc.player} />
                                    <div className="inventory-actions">
                                        <button className="sell-btn" onClick={() => handleSell(uc.id)}>Vendre</button>
                                        <button className="squad-btn">Equipe</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-results">Votre club est vide.</p>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button disabled={page === 0} onClick={() => handlePageChange(page - 1)}>Precedent</button>
                            <span> Page {page + 1} sur {totalPages} </span>
                            <button disabled={page >= totalPages - 1} onClick={() => handlePageChange(page + 1)}>Suivant</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Inventory;