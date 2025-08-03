import { useEffect } from "react";
import { useState } from "react";
import { sajatFetch } from '../auth/authService.js';
import Spinner from "./Spinner.jsx";
import { useRef } from "react";
import success from '../sounds/success.wav';
import error from '../sounds/error.wav';
import end from '../sounds/end.wav';
import { useNavigate } from 'react-router-dom'; 

function Gyakorlas() {

    const [words, setWords] = useState([]);
    const [wordsLength, setWordsLength] = useState(0);
    const [isPending, setPending] = useState(false);
    const [kezdetiSzamlalo, setKezdetiSzamlalo] = useState(1);
    const [sorsoltSzo, setSorsoltSzo] = useState({});
    const [showFeedback, setShowFeedback] = useState(false);
    const [theEnd, setTheEnd] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [jo, setJo] = useState(0);
    const [rossz, setRossz] = useState(0);
    const [index, setIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    function successSound() {
        const audio = new Audio(success);
        audio.play();
    }
    function errorSound() {
        const audio = new Audio(error);
        audio.play();
    }
    function endSound() {
        const audio = new Audio(end);
        audio.play();
    }

    function jatekCiklus(currentWords = words) {

        const word = currentWords[index];

        setSorsoltSzo(word);
        setPending(false);

    }
    
    const hasStarted = useRef(false);
    useEffect(() => {
    if (words.length > 0 && !hasStarted.current) {
        setPending(true);
        hasStarted.current = true;
        setWordsLength(words.length);
        setSorsoltSzo({});
        jatekCiklus(words); // csak akkor hívjuk, ha már van szó
    }
    }, [words]);

    useEffect(() => {
        if (words.length > 0 && index < words.length) {
            jatekCiklus(words);
        } else if (words.length > 0 && index === words.length) {
            setTheEnd(true);
            endSound();
        }
    }, [index, words]);

    useEffect(() => {
        setPending(true);
        // Állapotok alaphelyzetbe hozása, amikor új gyakorlás kezdődik
        setWords([]);
        setIndex(0);
        setSorsoltSzo({});
        setKezdetiSzamlalo(1);
        setJo(0);
        setRossz(0);
        setShowFeedback(false);
        setTheEnd(false);
        setIsCorrect(null);
        setInputValue("");
        hasStarted.current = false;

        sajatFetch.get(`${import.meta.env.VITE_API_URL}/api/elso-szint-gyakorlas`, { withCredentials: true })
            .then((res) => {
                if(res.data.words.length === 0) {
                    alert('Jelenleg 0 szó van az első szinten!');
                    navigate('/');
                    return;
                }
                setWords(res.data.words);
                setPending(false);
            })
    }, [])

    function gameSubmit(e) {
        e.preventDefault();
        setSubmitting(true);

        const body = {
            _id: sorsoltSzo._id,
            translation: inputValue
        }

        sajatFetch.post(`${import.meta.env.VITE_API_URL}/api/game-result-gyakorlas`, body, { withCredentials: true })
            .then((res) => {
                setShowFeedback(true);
                setIsCorrect(res.data.success);

                if(!res.data.success) {
                    errorSound();
                    setRossz(prev => prev + 1);
                } else {
                    successSound();
                    setJo(prev => prev + 1);
                }
            }).finally(() => setSubmitting(false))
    }


    if(isPending) return <Spinner />

  return (
    <>
      <header className="text-center py-10 border-b border-gray-300 sticky top-0 bg-gray-50 z-10 w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">1. szint gyakorlása</h1>
        <div className="text-gray-500 font-semibold text-base">Szintlépés nélküli gyakorlás!</div>
        <div className="text-gray-500 font-semibold text-base">
          Szó <span id="current-index">{kezdetiSzamlalo}</span> / <span id="total-words">{wordsLength}</span>
        </div>
      </header>

      <main className="flex flex-grow justify-center items-start mt-10 px-5">
        <section className="bg-white rounded-2xl p-10 max-w-md w-full shadow-xl text-center">
          <div className="text-gray-500 font-semibold text-lg mb-3">Fordítsd le ezt a szót:</div>
          <div
            id="word"
            className="text-gray-900 font-extrabold text-xl mb-8 tracking-wider"
          >
            {sorsoltSzo?.word || 'betöltés...'}
          </div>
          <form
            id="answer-form"
            autoComplete="off"
            className="flex gap-3 justify-center flex-wrap"
            onSubmit={gameSubmit}
          >
            <input
              type="text"
              id="answer-input"
              name="translation"
              placeholder="Írd be a magyar jelentést"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
              spellCheck="false"
              autoFocus
              className="flex-grow px-4 py-3 text-lg rounded-2xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={showFeedback || theEnd || submitting ? true : false}
              className="bg-blue-600 text-white font-bold text-lg rounded-2xl px-8 py-3 shadow-md hover:bg-blue-700 transition"
            >
              Ellenőrzés
            </button>
          </form>
        </section>
      </main>
        {showFeedback && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm w-full relative">
            <h2 className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? 'Helyes válasz!' : 'Helytelen válasz!'}
            </h2>

            <div className="mb-4">
                <p className="text-gray-700 font-semibold">A te válaszod:</p>
                <p className="text-gray-900 text-lg mb-2">{document.getElementById('answer-input')?.value || '-'}</p>
                {!isCorrect && (
                <>
                    <p className="text-gray-700 font-semibold">A helyes megoldás:</p>
                    <p className="text-gray-900 text-lg mb-2">{sorsoltSzo.translation}</p>
                </>
                )}
            </div>

            {/* Szó felolvasása */}
            <button
                onClick={() => {
                    speechSynthesis.cancel();
                    let utterance = null;
                    if(isCorrect) {
                        utterance = new SpeechSynthesisUtterance(inputValue);
                    } else {
                        utterance = new SpeechSynthesisUtterance(sorsoltSzo.translation);
                    }
                    utterance.lang = 'en-US';

                    const voices = speechSynthesis.getVoices();
                    const voice = voices.find(v => v.lang === 'en-US' && v.name.includes('Samantha')); // vagy más angol hang iOS-en
                    if (voice) utterance.voice = voice;

                    speechSynthesis.speak(utterance);

                }}
                className="absolute top-4 right-4 text-gray-600 hover:text-blue-600 transition"
                title="Hallgasd meg angolul"
            >
                🔊
            </button>

            <button
                type="submit"
                onClick={() => {
                    setShowFeedback(false);
                    setKezdetiSzamlalo(prev => prev + 1);
                    setInputValue("");

                    // Itt döntjük el, hogy jöhet-e új szó, vagy vége van
                    if (index + 1 === words.length) {
                    setTheEnd(true);
                    endSound();
                    } else {
                    setIndex(prev => prev + 1);
                    }
                }}
                className="bg-blue-600 text-white font-bold px-6 py-2 rounded-2xl hover:bg-blue-700 transition"
            >
                OK
            </button>
            </div>
        </div>
        )}

        {theEnd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm w-full relative">
            <h2 className={`text-2xl font-bold mb-4 text-gray-700`}>
                A gyakorlás véget ért!
            </h2>

            <div className="mb-4">
                <p className="text-green-600 font-semibold">Helyes válaszok:</p>
                <p className="text-green-600 text-lg mb-2">{jo}</p>
                <p className="text-red-600 font-semibold">Helytelen válaszok:</p>
                <p className="text-red-600 text-lg mb-2">{rossz}</p>
            </div>
            <button
                type="submit"
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white font-bold px-6 py-2 rounded-2xl hover:bg-blue-700 transition"
            >
                Vissza a főoldalra
            </button>
            </div>
        </div>
        )}

    </>
  );
}

export default Gyakorlas;
