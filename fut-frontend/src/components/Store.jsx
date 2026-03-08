import React, { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';

const preloadImage = (src) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
    });
};

function Store() {
    const [openedPlayers, setOpenedPlayers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [animatingPack, setAnimatingPack] = useState(null);
    const [shakeSpeed, setShakeSpeed] = useState(0.5);

    useEffect(() => {
        let interval;
        if (animatingPack) {
            setShakeSpeed(0.5);
            interval = setInterval(() => {
                setShakeSpeed((prev) => Math.max(0.1, prev - 0.1));
            }, 800);
        }
        return () => clearInterval(interval);
    }, [animatingPack]);

    const packs = [
        { id: 'bronze', name: 'Pack Bronze', price: 1000, img: '/images/packs/bronze_pack.png' },
        { id: 'silver', name: 'Pack Argent', price: 3000, img: '/images/packs/silver_pack.png' },
        { id: 'gold', name: 'Pack Or', price: 7500, img: '/images/packs/gold_pack.png' },
        { id: 'icon', name: 'Pack Icône', price: 20000, img: '/images/packs/icon_pack.png' }
    ];

    const handleOpenPack = async (pack) => {
        const storedUser = localStorage.getItem('user');

        if (!storedUser) {
            setError("Vous devez être connecté pour ouvrir un pack.");
            return;
        }

        const user = JSON.parse(storedUser);
        setLoading(true);
        setAnimatingPack(pack);
        setError('');
        setOpenedPlayers([]);

        try {
            const response = await fetch(`http://localhost:8080/api/packs/open?userId=${user.id}&packType=${pack.id}`, {
                method: 'POST'
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || "Erreur lors de l'ouverture du pack");
            }

            const data = await response.json();
            const imagePromises = [];

            data.players.forEach(player => {
                const playerImageName = encodeURIComponent(`${player.name} ${player.surname}`);
                imagePromises.push(preloadImage(`/images/fonds/${player.cardType}.png`));
                imagePromises.push(preloadImage(`/images/pays/${player.country}.png`));
                imagePromises.push(preloadImage(`/images/clubs/${player.club}.png`));
                imagePromises.push(preloadImage(`/images/joueurs/${playerImageName}.png`));
            });

            const minWaitPromise = new Promise(resolve => setTimeout(resolve, 3000));

            await Promise.all([...imagePromises, minWaitPromise]);

            setOpenedPlayers(data.players);

            user.coins = data.remainingCoins;
            localStorage.setItem('user', JSON.stringify(user));
            window.dispatchEvent(new Event('storage'));

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setAnimatingPack(null);
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
                        onClick={() => !loading && handleOpenPack(pack)}
                    >
                        <img src={pack.img} alt={pack.name} className="pack-image" />
                        <div className="pack-info">
                            <h3>{pack.name}</h3>
                            <p>{pack.price} crédits</p>
                        </div>
                    </div>
                ))}
            </div>

            {animatingPack && (
                <div className="pack-animation-overlay">
                    <img
                        src={animatingPack.img}
                        alt="Animation pack"
                        className="pack-animation-image"
                        style={{ animation: `pulse 0.8s infinite alternate, shake ${shakeSpeed}s infinite` }}
                    />
                    <div className="pack-animation-text">Ouverture du {animatingPack.name}...</div>
                </div>
            )}

            {openedPlayers.length > 0 && !animatingPack && (
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