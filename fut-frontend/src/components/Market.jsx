import { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';
import { SERVER_URL } from '../config';

function Market() {
    const [players, setPlayers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);

    const [nameFilter, setNameFilter] = useState('');
    const [clubFilter, setClubFilter] = useState('');
    const [nationFilter, setNationFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [options, setOptions] = useState({ clubs: [], nations: [], cardTypes: [] });

    const [showClubs, setShowClubs] = useState(false);
    const [showNations, setShowNations] = useState(false);

    // Fetch filter options on component mount
    useEffect(() => {
        fetch(`${SERVER_URL}/api/players/filters`)
            .then(res => res.json())
            .then(data => setOptions(data))
            .catch(error => console.error("Erreur de récupération des filtres:", error));
    }, []);

    // Fetch players when page or filters change
    useEffect(() => {
        const fetchPlayers = async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                size: '12'
            });

            if (nameFilter) params.append('name', nameFilter);
            if (clubFilter) params.append('club', clubFilter);
            if (nationFilter) params.append('nation', nationFilter);
            if (typeFilter) params.append('cardType', typeFilter);

            try {
                const response = await fetch(`${SERVER_URL}/api/players/search?${params.toString()}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPlayers(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Erreur de récupération des joueurs:", error);
                setPlayers([]); // Clear players on error
            }
        };

        fetchPlayers();
    }, [page, nameFilter, clubFilter, nationFilter, typeFilter]);

    const handleFilterChange = (setter, value) => {
        setter(value);
        setPage(0); // Reset to first page on any filter change
    };

    const handleAutocompleteSelect = (setter, hideSuggestions, value) => {
        handleFilterChange(setter, value);
        hideSuggestions(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            window.scrollTo(0, 0);
        }
    };

    const filteredClubs = clubFilter
        ? options.clubs
            .filter(c => c.toLowerCase().includes(clubFilter.toLowerCase()))
            .slice(0, 10)
        : [];

    const filteredNations = nationFilter
        ? options.nations
            .filter(n => n.toLowerCase().includes(nationFilter.toLowerCase()))
            .slice(0, 10)
        : [];

    return (
        <div className="catalog-container">
            <h1>Marché des Transferts</h1>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Nom du joueur..."
                    value={nameFilter}
                    onChange={(e) => handleFilterChange(setNameFilter, e.target.value)}
                />

                <div className="autocomplete">
                    <input
                        type="text"
                        placeholder="Chercher un club..."
                        value={clubFilter}
                        onFocus={() => setShowClubs(true)}
                        onBlur={() => setTimeout(() => setShowClubs(false), 200)}
                        onChange={(e) => handleFilterChange(setClubFilter, e.target.value)}
                    />
                    {showClubs && filteredClubs.length > 0 && (
                        <ul className="suggestions">
                            {filteredClubs.map(c => (
                                <li key={c} onMouseDown={() => handleAutocompleteSelect(setClubFilter, setShowClubs, c)}>
                                    {c}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="autocomplete">
                    <input
                        type="text"
                        placeholder="Chercher un pays..."
                        value={nationFilter}
                        onFocus={() => setShowNations(true)}
                        onBlur={() => setTimeout(() => setShowNations(false), 200)}
                        onChange={(e) => handleFilterChange(setNationFilter, e.target.value)}
                    />
                    {showNations && filteredNations.length > 0 && (
                        <ul className="suggestions">
                            {filteredNations.map(n => (
                                <li key={n} onMouseDown={() => handleAutocompleteSelect(setNationFilter, setShowNations, n)}>
                                    {n}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <select value={typeFilter} onChange={(e) => handleFilterChange(setTypeFilter, e.target.value)}>
                    <option value="">Toutes les raretés</option>
                    {options.cardTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>

            <div className="player-grid">
                {players.length > 0 ? (
                    players.map(p => (
                        <PlayerCard key={p.id} player={p} />
                    ))
                ) : (
                    <p className="no-results">Aucun joueur trouvé.</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button disabled={page === 0} onClick={() => handlePageChange(page - 1)}>Précédent</button>
                    <span> Page {page + 1} sur {totalPages} </span>
                    <button disabled={page >= totalPages - 1} onClick={() => handlePageChange(page + 1)}>Suivant</button>
                </div>
            )}
        </div>
    );
}

export default Market;