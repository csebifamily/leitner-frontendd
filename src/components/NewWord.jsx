import React, { useEffect, useState } from 'react';
import './login.css'; // CSS fájl importálása
import Spinner from './Spinner.jsx'
import { login, sajatFetch } from '../auth/authService.js';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Toast from './Toast.jsx';

export default function NewWord() {

    const [isPending, setPending] = useState(false);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const navigate = useNavigate();

    const location = useLocation();
    const toastNewWord = location.state?.toast;

    useEffect(() => {
      if(toastNewWord) {
        setShow(true);
        setMessage(toastNewWord.message);
        setType(toastNewWord.type);
      }
    }, [toastNewWord])

    function handleSubmit(e) {
      e.preventDefault();
      setPending(true);

      const body = {
        word: e.target.elements.word.value,
        translation: e.target.elements.translation.value
      }

      sajatFetch
        .post(`${import.meta.env.VITE_API_URL}/api/new-word`, body, { withCredentials: true })
          .then((res) => {
            //res.data.message
            setShow(true);
            setMessage(res.data.message);
            setType('success');
            setPending(false);
          })
          .catch((err) => {
            if(err.status===409) {
              setShow(true);
              setMessage('Ez a szó már szerepel a szótáradban!');
              setType('error');
              setPending(false);
            }
          })

    }

    if(isPending) {
        return (
        <>
          <Spinner />
        </>
        )
    }

  return (
    <main className="login-container">
      <Toast show={show} message={message} type={type} onClose={() => setShow(false)} />
      <NavLink to="/" className="flex justify-between items-center mb-8 text-[#1e40af] text-2xl">
        <i className="fa-solid fa-house"></i>
      </NavLink>
      <h1>Új szó felvétel</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Magyar: </label>
        <input
          type="text"
          id="word"
          name="word"
          placeholder="Magyarul..."
          required
        />

        <label htmlFor="translation">Angol: </label>
        <input
          type="text"
          id="translation"
          name="translation"
          placeholder="Angolul..."
          required
        />

        <button type="submit" className="btn-login">
          Felvétel
        </button>
      </form>
    </main>
  );
}

function BackIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}