import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './AuthPage.jsx';
import HomePage from './homePage.jsx';
import GoalsPage from './goalsPage.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/goals" element={<GoalsPage />} />
            </Routes>
        </Router>
    </StrictMode>
);
