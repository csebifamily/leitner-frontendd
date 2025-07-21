import { NavLink, useNavigate } from "react-router-dom";
import Spinner from './Spinner.jsx';
import { useState } from "react";
import Toast from "./Toast.jsx";

export default function Register() {

    const [isPending, setPending] = useState(false);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const navigate = useNavigate();

    function registerSubmit(e) {
      setPending(true);
        e.preventDefault();

        const body = {
            nickname: e.target.elements.nickname.value,
            email: e.target.elements.email.value,
            username: e.target.elements.username.value,
            password: e.target.elements.password.value
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then((res) => {
              return res.json().then((data) => ({
                status: res.status,
                szoveg: data
              }))
            })
            .then(({ status, szoveg }) => {
              if(status !== 200){
                setShow(true);
                setType('error');
                setMessage(szoveg.error);
                setPending(false);
                return;
              }
              navigate('/bejelentkezes', {
                replace: true,
                state: { toast: { message: szoveg.message, type: 'success' } }
              });
              setPending(false);
            })
    }

    if(isPending) return <Spinner />

  return (
    <main className="login-container">
      <Toast show={show} message={message} type={type} onClose={() => setShow(false)} />
      <h1>Regisztráció</h1>
      <form className="login-form" onSubmit={registerSubmit}>
        <label htmlFor="username">Becenév</label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          placeholder="Írd be a beceneved"
          required
        />
        <label htmlFor="username">E-mail cím</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Írd be az e-mail címed"
          required
        />
        <label htmlFor="username">Felhasználónév</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Írd be a felhasználóneved"
          required
        />

        <label htmlFor="password">Jelszó</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Írd be a jelszavad"
          required
        />

        <button type="submit" className="btn-login">
          Regisztráció
        </button>
      </form>
    <p className="text-sm mt-4">
      Már van fiókod?{' '}
      <NavLink to="/bejelentkezes" className="text-blue-600 hover:underline">
        Lépj be
      </NavLink>
    </p>
    </main>
  )

}