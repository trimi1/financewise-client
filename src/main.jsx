import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './AuthPage.jsx';
import Home from './Home.jsx';
import DepensesList from "./DepensesList.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <main className="container">
                <Routes>
                    <Route path="/" element={<AuthPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/depenses" element={<DepensesList />} />
                </Routes>
            </main>
        </Router>
    </StrictMode>
);
