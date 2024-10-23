import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './authPage.jsx';
import HomePage from './homePage.jsx';
import GoalsPage from './goalsPage.jsx';
import DepensesPage from "./depensesPage.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/depenses" element={<DepensesPage />} />
                <Route path="/goals" element={<GoalsPage />} />
            </Routes>
        </Router>
    </StrictMode>
);
