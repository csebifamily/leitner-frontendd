import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const ell = localStorage.getItem('isLoggedIn') === 'true';

    if(ell) {
        return <Navigate to={'/'} replace/>
    }

    return children;
}

export default PublicRoute;