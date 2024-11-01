import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
    const token = localStorage.getItem('TOKEN');
    return token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;