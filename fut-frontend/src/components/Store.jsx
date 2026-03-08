import React, { useState } from 'react';
import PlayerCard from './PlayerCard';

function Store() {
    const [openedPlayers, setOpenedPlayers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const packs = [
        { id: 'bronze', name: 'Pack Bronze', price: 1000, img: '/images/packs/bronze_pack.png' },
        { id: 'silver', name: 'Pack Argent', price: 3000, img: '/images/packs/silver_pack.png' },
        { id: 'gold', name: 'Pack Or', price: 7500, img: '/images/packs/gold_pack.png' },
        { id: 'icon', name: 'Pack Icône', price: 20000, img: '/images/packs/icon_pack.png' }
    ];

    const handleOpenPack = async (packType) => {
        const storedUser = localStorage.getItem('user');

        if (!storedUser) {
            setError("Vous devez être connecté pour ouvrir un pack.");
            return;
        }

        const user = JSON.parse(storedUser);
        setLoading(true);
        setError('');
        setOpenedPlayers([]);

        try {
            const response = await fetch(`http://localhost:8080/api/packs/open?userId=${user.id}&packType=${packType}`, {
                method: 'POST'
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || "Erreur lors de l'ouverture du pack");
            }

            const data = await response.json();
            setOpenedPlayers(data.players);

            user.coins = data.remainingCoins;
            localStorage.setItem('user', JSON.stringify(user));
            window.dispatchEvent(new Event('storage'));

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="store-container">
            <h1>Boutique des Packs</h1>

            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

            <div className="packs-grid">
                {packs.map((pack) => (
                    <div
                        key={pack.id}
                        className={`pack-card ${loading ? 'disabled' : ''}`}
                        onClick={() => !loading && handleOpenPack(pack.id)}
                    >
                        <img src={pack.img} alt={pack.name} className="pack-image" />
                        <div className="pack-info">
                            <h3>{pack.name}</h3>
                            <p>{pack.price} crédits</p>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <p>Ouverture en cours...</p>}

            {openedPlayers.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                    <h3>Nouveaux Joueurs Obtenus</h3>
                    <div className="players-grid">
                        {openedPlayers.map((player, index) => (
                            <PlayerCard key={`${player.id}-${index}`} player={player} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Store;