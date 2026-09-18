import './App.css'
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Market from './components/Market';
import Team from './components/Team';
import Store from './components/Store';
import Login from './components/Login';
import Inventory from './components/Inventory';

function App() {
    return (
        <>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/market" element={<Market />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/inventory" element={<Inventory />} />
                </Routes>
            </main>
        </>
    );
}

export default App;