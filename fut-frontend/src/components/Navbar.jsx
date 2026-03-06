import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <NavLink to="/" className="nav-logo">FUT App</NavLink>
            <ul className="nav-menu">
                <li className="nav-item">
                    <NavLink to="/market" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>Marché</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/team" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>Mon Équipe</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/store" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>Boutique</NavLink>
                </li>
            </ul>
            <NavLink to="/login" className="nav-link-button">Connexion</NavLink>
        </nav>
    );
}

export default Navbar;