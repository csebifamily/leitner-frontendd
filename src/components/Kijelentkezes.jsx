import { useNavigate } from "react-router-dom";
import { logout } from "../auth/authService";

const Kijelentkezes = () => {

    const navigate = useNavigate();

    return (
    <>
        <button className="ml-2 inline-block text-sm bg-red-950 text-white font-bold px-3 py-1 rounded-full align-middle hidden sm:inline" 
        onClick={() => {
            logout().finally(() => {
              navigate('/bejelentkezes', { replace: true });
            })
        }}>
            Kijelentkezés
        </button>
        <i className="fa-solid fa-right-from-bracket inline sm:hidden bg-red-600 text-white ml-2 px-3 py-3 rounded-md"
            onClick={() => {
                logout().finally(() => {
                    navigate('/bejelentkezes', { replace: true });
                })
            }}
        ></i>
    </>
    );
}

export default Kijelentkezes;