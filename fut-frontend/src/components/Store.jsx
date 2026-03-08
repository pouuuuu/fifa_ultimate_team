import React, { useState } from 'react';
// Assurez-vous d'importer votre composant d'affichage de carte s'il gère les props correctement
import PlayerCard from './PlayerCard';

function Store() {
    const [openedPlayers, setOpenedPlayers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOpenGoldPack = async () => {
        const storedUser = localStorage.getItem('user');

        if (!storedUser) {
            setError("Vous devez être connecté pour ouvrir un pack.");
            return;
        }

        const user = JSON.parse(storedUser);
        setLoading(true);
        setError('');
        setOpenedPlayers([]); // Réinitialise l'affichage au cas où on ouvre plusieurs packs

        try {
            // Appel à l'endpoint Spring Boot existant
            const response = await fetch(`http://localhost:8080/api/packs/open/gold?userId=${user.id}`, {
                method: 'POST'
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || "Erreur lors de l'ouverture du pack");
            }

            const data = await response.json();

            // data correspond à votre PackResponseDTO (players, cost, remainingCoins)
            setOpenedPlayers(data.players);

            // Mise à jour du solde de l'utilisateur dans la session locale
            user.coins = data.remainingCoins;
            localStorage.setItem('user', JSON.stringify(user));

            // Permet de forcer la Navbar à mettre à jour l'affichage des crédits
            window.dispatchEvent(new Event('storage'));

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center', color: 'white' }}>
            <h1>Boutique des Packs</h1>

            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

            <div className="pack-container" style={{ margin: '30px 0' }}>
                <div style={{
                    border: '2px solid gold',
                    padding: '30px',
                    display: 'inline-block',
                    borderRadius: '10px',
                    backgroundColor: '#222'
                }}>
                    <h2 style={{ color: 'gold' }}>Pack Or</h2>
                    <p>Contient 12 joueurs (Au moins 1 Or Rare)</p>
                    <p>Prix : 7 500 🪙</p>

                    <button
                        onClick={handleOpenGoldPack}
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            backgroundColor: 'gold',
                            color: 'black',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '5px',
                            marginTop: '15px'
                        }}
                    >
                        {loading ? 'Ouverture...' : 'Acheter le pack'}
                    </button>
                </div>
            </div>

            {/* Affichage des cartes obtenues */}
            {openedPlayers.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                    <h3>Nouveaux Joueurs Obtenus !</h3>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '15px',
                        marginTop: '20px'
                    }}>
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