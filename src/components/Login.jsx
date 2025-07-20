import React, { useEffect, useState } from 'react';
import './login.css'; // CSS fájl importálása
import Spinner from './Spinner.jsx'
import { login } from '../auth/authService.js';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Toast from './Toast.jsx';

export default function Login() {

    const [isPending, setPending] = useState(false);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const navigate = useNavigate();

    const location = useLocation();
    const toastFromRegister = location.state?.toast;

    useEffect(() => {
      if(toastFromRegister) {
        setShow(true);
        setMessage(toastFromRegister.message);
        setType(toastFromRegister.type);
      }
    }, [toastFromRegister])

    function loginFormSubmit(e) {
        setPending(true);
        e.preventDefault();
        login(e.target.elements.username.value, e.target.elements.password.value)
            .then((res) => {
                    setShow(true);
                    setMessage('Sikeres bejelentkezés!');
                    setType('success')
                setTimeout(() => {
                    setPending(false);
                    navigate('/');
                }, 2000)
            })
            .catch((err) => {
                setShow(true);
                setMessage('Helytelen felhasználónév vagy jelszó!');
                setType('error')
                setTimeout(() => setPending(false), 1500)
            })
    }

    if(isPending) {
        return (
        <>
          <Spinner />
          <Toast show={show} message={message} type={type} onClose={() => setShow(false)} />
        </>
        )
    }

  return (
    <main className="login-container">
      <Toast show={show} message={message} type={type} onClose={() => setShow(false)} />
      <h1>Bejelentkezés</h1>
      <form className="login-form" onSubmit={loginFormSubmit}>
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
          Belépés
        </button>
      </form>
    <p className="text-sm mt-4">
      Még nincs fiókod?{' '}
      <NavLink to="/regisztracio" className="text-blue-600 hover:underline">
        Regisztrálj itt
      </NavLink>
    </p>
    <p className="text-sm mt-4">
      <NavLink to="/elfelejtett-jelszo" className="text-blue-600 hover:underline">
        Elfelejtettem a jelszavam!
      </NavLink>
    </p>
    </main>
  );
}
