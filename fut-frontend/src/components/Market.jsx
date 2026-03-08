import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../config';
import PlayerCard from './PlayerCard';
import './Market.css';

function Market() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = () => {
        setLoading(true);
        fetch(`${SERVER_URL}/api/market/listings`)
            .then(res => res.json())
            .then(data => {
                setListings(data);
                setLoading(false);
            });
    };

    const handleBuy = async (listingId) => {
        const res = await fetch(`${SERVER_URL}/api/market/buy?buyerId=${user.id}&listingId=${listingId}`, { method: 'POST' });
        if (res.ok) { alert("Achat reussi !"); fetchListings(); }
        else { const err = await res.text(); alert(err); }
    };

    const handleCancel = async (listingId) => {
        const res = await fetch(`${SERVER_URL}/api/market/cancel?listingId=${listingId}`, { method: 'POST' });
        if (res.ok) fetchListings();
    };

    const handleUpdatePrice = async (listingId) => {
        const newPrice = prompt("Nouveau prix :");
        if (!newPrice) return;
        const res = await fetch(`${SERVER_URL}/api/market/update-price?listingId=${listingId}&newPrice=${newPrice}`, { method: 'POST' });
        if (res.ok) fetchListings();
    };

    const mySales = listings.filter(l => l.sellerUsername === user?.username);
    const globalMarket = listings.filter(l => l.sellerUsername !== user?.username);

    if (loading) return <div className="loading">Chargement du marché...</div>;

    return (
        <div className="catalog-container">
            <section>
                <h2>Mes Ventes</h2>
                <div className="player-grid">
                    {mySales.map(l => (
                        <div key={l.listingId} className="inventory-card-wrapper">
                            <PlayerCard player={l.player} />
                            <div className="market-info">
                                <p>Prix : <span>{l.price}</span> coins</p>
                                <button className="modify-btn" onClick={() => handleUpdatePrice(l.listingId)}>Modifier</button>
                                <button className="cancel-btn" onClick={() => handleCancel(l.listingId)}>Retirer</button>
                            </div>
                        </div>
                    ))}
                    {mySales.length === 0 && <p>Aucune vente en cours.</p>}
                </div>
            </section>

            <section>
                <h2>Marché Global</h2>
                <div className="player-grid">
                    {globalMarket.map(l => (
                        <div key={l.listingId} className="inventory-card-wrapper">
                            <PlayerCard player={l.player} />
                            <div className="market-info">
                                <p>Prix : <span>{l.price}</span> coins</p>
                                <p>Vendeur : {l.sellerUsername}</p>
                                <button className="buy-btn" onClick={() => handleBuy(l.listingId)}>Acheter</button>
                            </div>
                        </div>
                    ))}
                    {globalMarket.length === 0 && <p>Le marché est vide.</p>}
                </div>
            </section>
        </div>
    );
}

export default Market;