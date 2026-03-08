import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="landing-container">
            <div className="landing-content">
                <h1>Bienvenue sur Fifa Ultimate Team</h1>
                <p>Votre compagnon ultime pour gérer votre équipe, explorer le marché et dominer le jeu.</p>
                <div className="landing-buttons">
                    <Link to="/market" className="btn btn--primary">
                        Aller au Marché
                    </Link>
                    <Link to="/team" className="btn btn--outline">
                        Voir mon Équipe
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;