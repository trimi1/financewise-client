import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './page/authPage.jsx';
import HomePage from './page/homePage.jsx';
import GoalsPage from './page/goalsPage.jsx';
import DepensesPage from "./page/depensesPage.jsx";

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
