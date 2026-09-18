import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../config';
import PlayerCard from './PlayerCard';
import './Market.css';
import { POSITION_FILTERS, getShortPos } from '../utils';

function Market() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const [positionFilter, setPositionFilter] = useState([]);

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

    const handlePositionFilterChange = (e) => {
        const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setPositionFilter(selected);
    };

    const matchesPositionFilter = (player) => {
        if (!positionFilter || positionFilter.length === 0) return true;
        const isGK = player.div !== undefined;
        const shortPos = isGK ? 'GK' : getShortPos(player.position);
        return positionFilter.includes(shortPos);
    };

    const handleBuy = async (listingId) => {
        const res = await fetch(`${SERVER_URL}/api/market/buy?buyerId=${user.id}&listingId=${listingId}`, { method: 'POST' });
        if (res.ok) {
            const listing = listings.find(l => l.listingId === listingId);
            if (listing) {
                user.coins -= listing.price;
                localStorage.setItem('user', JSON.stringify(user));
                window.dispatchEvent(new Event('storage'));
            }

            alert("Achat reussi !");
            fetchListings();
        }
        else {
            const err = await res.text();
            alert(err);
        }
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

    const filteredListings = listings.filter(l => matchesPositionFilter(l.player));
    const mySales = filteredListings.filter(l => l.sellerUsername === user?.username);
    const globalMarket = filteredListings.filter(l => l.sellerUsername !== user?.username);

    if (loading) return <div className="loading">Chargement du marché...</div>;

    return (
        <div className="catalog-container">
            <div className="filters-bar">
                <label>Position(s)</label>
                <select
                    multiple
                    size={5}
                    value={positionFilter}
                    onChange={handlePositionFilterChange}
                >
                    {POSITION_FILTERS.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                    ))}
                </select>
            </div>
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