import React, { useEffect, useState } from 'react';
import './login.css'; // CSS fájl importálása
import Spinner from './Spinner.jsx'
import { sajatFetch } from '../auth/authService.js';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

export default function EditWord() {

    const [isPending, setPending] = useState(false);
    const [word, setWord] = useState("");
    const [translation, setTranslation] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        setPending(true);
        sajatFetch.get(`${import.meta.env.VITE_API_URL}/api/word/${id}`)
            .then((res) => {
                setWord(res.data.word.word);
                setTranslation(res.data.word.translation);
                setPending(false);
            })
            .catch((err) => {
                navigate('/osszes-szo');
            })
    }, [])

    function handleSubmit(e) {
        e.preventDefault();

        const body = {
            _id: id,
            word: e.target.elements.word.value,
            translation: e.target.elements.translation.value
        };

        sajatFetch.put(`${import.meta.env.VITE_API_URL}/api/edit-word`, body, { withCredentials: true })
            .then((res) => navigate('/osszes-szo', {
                replace: true,
                state: { toast: { message: res.data.message, type: 'success' } }
            }))
            .catch((err) => console.log(err))
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
      <NavLink to="/" className="flex justify-between items-center mb-8 text-[#1e40af] text-2xl">
        <i className="fa-solid fa-house"></i>
      </NavLink>
      <h1>Szerkesztés: </h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Magyar: </label>
        <input
          defaultValue={word}
          type="text"
          id="word"
          name="word"
          placeholder="Magyarul..."
          required
        />

        <label htmlFor="translation">Angol: </label>
        <input
          defaultValue={translation}
          type="text"
          id="translation"
          name="translation"
          placeholder="Angolul..."
          required
        />

        <button type="submit" className="btn-login">
          Szerkesztés
        </button>
      </form>
    </main>
  );
}