import { useState } from 'react';
import './Login.css';

function Login() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isLoginMode ? '/api/users/login' : '/api/users/register';

        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const userData = await response.json();
            localStorage.setItem('user', JSON.stringify(userData));
            window.location.href = '/';

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <h2>{isLoginMode ? 'Connexion' : 'Inscription'}</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom d'utilisateur :</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">
                    {isLoginMode ? 'Se connecter' : "S'inscrire"}
                </button>
            </form>

            <p className="toggle-mode"
               onClick={() => setIsLoginMode(!isLoginMode)}>
                {isLoginMode ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </p>
        </div>
    );
}

export default Login;
