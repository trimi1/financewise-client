import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './utils/protectedRoutes.jsx';
import { AuthPage } from './page/authPage.jsx';
import { HomePage } from './page/homePage.jsx';
import { GoalsPage } from './page/goalsPage.jsx';
import { DepensesPage } from "./page/depensesPage.jsx";
import { CategoriesPage } from "./page/categoriesPage.jsx";
import { InvestmentsPage } from "./page/investmentsPage.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route element={<ProtectedRoutes />} >
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/depenses" element={<DepensesPage />} />
                    <Route path="/category" element={<CategoriesPage />} />
                    <Route path="/goals" element={<GoalsPage />} />
                    <Route path="/chatbot" />
                    <Route path="/investments" element={<InvestmentsPage />} />
                    <Route path="/quizz" />
                    <Route path="/information" />
                </Route>
            </Routes>
        </Router>
    </StrictMode>
);
