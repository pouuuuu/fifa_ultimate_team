import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../config';
import PlayerCard from './PlayerCard';

function Inventory() {
    const [userCards, setUserCards] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const itemsPerPage = 12;

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

    const totalPages = Math.ceil(userCards.length / itemsPerPage);
    const displayedCards = userCards.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="catalog-container">
            <h1>Mon Inventaire</h1>

            {loading ? (
                <div className="loading-indicator">Chargement...</div>
            ) : (
                <>
                    <div className="player-grid inventory-grid">
                        {displayedCards.length > 0 ? (
                            displayedCards.map(uc => (
                                <div key={uc.id} className="inventory-card-wrapper">
                                    <PlayerCard player={uc.player} />
                                    <div className="inventory-actions">
                                        <button className="sell-btn">Vendre</button>
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