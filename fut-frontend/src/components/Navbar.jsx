import React, { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h1><a href="/">TD FUT</a></h1>
            </div>

            <div className="navbar-links">
                <a href="/">Accueil</a>
                <a href="/inventory">Mon Inventaire</a>
                <a href="/market">Marché</a>
                <a href="/store">Boutique</a>
                <a href="/team">Mon Equipe</a>
            </div>

            <div className="navbar-user-info">
                {user ? (
                    <>
                        <div className="user-details">
                            <span>👤 {user.username}</span>
                            <span>🪙 {user.coins !== undefined ? user.coins : 'N/A'}</span>
                        </div>
                        <button onClick={handleLogout} className="logout-button">Déconnexion</button>
                    </>
                ) : (
                    <a href="/login"><button className="login-button">Se connecter</button></a>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
