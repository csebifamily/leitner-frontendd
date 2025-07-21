import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const ell = localStorage.getItem('isLoggedIn') === 'true';

    if(!ell) {
        return <Navigate to={'/bejelentkezes'} replace/>
    }

    return children;
}

export default PrivateRoute;