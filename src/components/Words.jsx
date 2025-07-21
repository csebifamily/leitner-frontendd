import React from "react";
import { useState, useEffect } from "react";
import { sajatFetch } from '../auth/authService.js';
import Spinner from '../components/Spinner.jsx';
import Modal from "./Modal.jsx";
import { NavLink, useLocation } from "react-router-dom";
import Toast from "./Toast.jsx";

export default function Words() {


  const [words, setWords] = useState([]);
  const [deletedId, setDeletedId] = useState("");
  const [isPending, setPending] = useState(false);
  const [keresettTermek, setKeresettTermek] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');

  const location = useLocation();
  const toastFromEdited = location.state?.toast;

  useEffect(() => {
    if(toastFromEdited) {
      setShow(true);
      setMessage(toastFromEdited.message);
      setType(toastFromEdited.type);
    }
  }, [toastFromEdited])

  useEffect(() => {
    setPending(true);
    sajatFetch
    .get(`${import.meta.env.VITE_API_URL}/api/wordsById`, { withCredentials: true })
      .then((res) => {
        setWords(res.data.words);
      })
      .finally(() => setPending(false))
  }, [refresh])

  const filteredWords = words.filter(({ word, translation }) => {
    return word.toLowerCase().includes(keresettTermek.toLowerCase()) ||
          translation.toLowerCase().includes(keresettTermek.toLowerCase());
  });
  
  if(isPending) return <Spinner />

  return (
  <>
    <div className="min-h-screen bg-blue-50 text-slate-900 font-sans p-5 flex flex-col">
      <Toast show={show} message={message} type={type} onClose={() => setShow(false)} />
      <NavLink to="/" className="flex justify-between items-center mb-8 text-[#1e40af] text-2xl">
        <i className="fa-solid fa-house"></i>
      </NavLink>
      {deletedId !== "" ? (
        <Modal 
          onClosed={() => setDeletedId("")}
          onApproved={async () => {
            sajatFetch.delete(`${import.meta.env.VITE_API_URL}/api/word/${deletedId}`)
              .then((res) => {
                setDeletedId("");
                setRefresh(prev => prev + 1);
                setKeresettTermek("");
                setShow(true);
                setMessage(res.data.message);
                setType('success');
              })
          }}
        >
          Biztosan törlöd: "{words.find(word => word._id === deletedId)?.word}"?
        </Modal>
      ) : ( "" )}
      {/* Main content */}
      <main className="flex-grow max-w-3xl mx-auto mt-10 w-full">
        <section className="bg-white rounded-2xl p-8 shadow-lg shadow-blue-300/30">
          <h2 className="text-center text-blue-600 font-extrabold text-2xl mb-6">
            Szótár kezelése 
          </h2>
          <h2 className="text-center text-blue-600 font-extrabold text-2xl mb-6">
            ({words.length}) szó
          </h2>
          

          <input
            type="text"
            id="search-input"
            placeholder="Keresés angol vagy magyar szó vagy mondatrész szerint..."
            autoComplete="off"
            aria-label="Szavak keresése"
            className="w-full mb-6 px-4 py-3 text-lg border-2 border-blue-300 rounded-xl
                       focus:outline-none focus:border-blue-900 focus:shadow-[0_0_8px_rgba(37,99,235,0.6)]"
            onChange={(e) => setKeresettTermek(e.target.value)}
          />

          <ul id="words-list" className="list-none p-0 m-0">
            
            {filteredWords.map((word) => (
            <li
              className="flex flex-col sm:flex-row justify-between items-start
                         bg-blue-50 rounded-2xl border-2 border-blue-300 p-5 mb-5
                         hover:bg-blue-100 break-words"
              key={word._id}
            >
              <div className="max-w-full sm:max-w-[75%]">
                <p className="text-blue-600 font-bold text-lg mb-1 mr-5">{word.word}</p>
                <p className="text-slate-600 italic text-base">{word.translation}</p>
              </div>
              <div
                className="flex flex-col gap-2 min-w-[110px] sm:min-w-auto sm:flex-row sm:justify-start
                           mt-4 sm:mt-0"
              >
                <NavLink
                  to={`/szerkesztes/${word._id}`}
                  className="bg-blue-600 text-white py-2 px-4 rounded-xl font-semibold text-sm
                             hover:bg-blue-900 transition-colors w-full sm:w-auto"
                  type="button"
                >
                  Szerkesztés
                </NavLink>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-xl font-semibold text-sm
                             hover:bg-red-800 transition-colors w-full sm:w-auto"
                  type="button"
                  onClick={() => setDeletedId(word._id)}
                >
                  Törlés
                </button>
              </div>
            </li>
            ))}

          </ul>
        </section>
      </main>
    </div>
  </>
  );
}
