import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './AuthPage.jsx';
import Home from './Home.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <main className="container">
                <Routes>
                    <Route path="/" element={<AuthPage />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </main>
        </Router>
    </StrictMode>
);
