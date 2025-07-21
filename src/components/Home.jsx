import { useEffect, useState } from "react";
import { logout, sajatFetch } from "../auth/authService.js";
import { NavLink, useNavigate } from "react-router-dom";
import Spinner from "./Spinner.jsx";
import Kijelentkezes from "./Kijelentkezes.jsx";
import FullScreenOverlay from "./FullScreenOverlay.jsx";
import Modal from "./Modal.jsx";


export default function Home() {

  const [wordStat, setWordStat] = useState({});
  const [isPending, setPending] = useState(false);
  const [engedely, setEngedely] = useState(false);
  const navigate = useNavigate();
  const [overlayActive, setOverlayActive] = useState(false);
  const [error, setError] = useState(null);
  const [megerosit, setMegerosit] = useState(false);
  const [megerositAdatok, setMegerositAdatok] = useState({});

  function handleSubmit(szint) {
    // Kattintásra indul az animáció
    setOverlayActive(true);
    const body = { szint };

    sajatFetch.post(`${import.meta.env.VITE_API_URL}/api/jatek-szint-szavak`, body, { withCredentials:true })
      .then((res) => {
        setMegerositAdatok((prev) => ({...prev, level: res.data.szint}));
        setMegerositAdatok((prev) => ({...prev, quantity: res.data.szavak.length}))
        setMegerosit(true);
        setTimeout(() => setOverlayActive(false), 3000)
      })
      .catch((err) => {
        if(err.status === 404) {
          setTimeout(() => {
            setError(err.response.data.error);
          }, 3000)
        } 
      })

  }



  useEffect(() => {
    setPending(true);
    sajatFetch
      .get(`${import.meta.env.VITE_API_URL}/api/words`)
        .then((res) => {
          setWordStat(res.data)
        })
        .finally(() => {
          setEngedely(true);
          setPending(false);
        })
  }, [])

  const handleClose = () => {
    setShowOverlay(false);
    setError(null);
  };

  if(!engedely) return <Spinner />
  if(isPending) return <Spinner />

  return (
      <main className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10 flex flex-col gap-10">
      {megerosit && (
        <Modal torlesVagyMegerosit="megerosit"
          onApproved={() => navigate('/jatek', {
            replace: true,
            state: { level: megerositAdatok.level }
          })}
          onClosed={() => setMegerosit(false)}
        >LEVEL {megerositAdatok.level}: Jelenleg {megerositAdatok.quantity} db szó vár gyakorlásra a mai nap!</Modal>
      )}
      <FullScreenOverlay
        isActive={overlayActive}
        error={error}
        setError={setError}
        setActive={setOverlayActive}
      />
       <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Üdv, {wordStat.nickname}. </h1>
          <Kijelentkezes />    
        </div>

        <section>
          <h2 className="text-xl font-bold text-blue-900 border-b-4 border-blue-600 pb-2 mb-4">Áttekintés</h2>
          <ul className="text-lg text-slate-700 list-none space-y-3">
            <li><strong>Szóállomány:</strong> {wordStat.totalWords} szó </li>
          </ul>
        </section>

        <section className="flex flex-wrap justify-center gap-5">
          <NavLink to="/uj-szo" className="px-6 py-4 text-lg font-semibold rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-900 active:scale-95 transition max-w-[220px] flex-1">Új szó felvétele</NavLink>
          <NavLink to="/osszes-szo" className="px-6 py-4 text-lg font-semibold rounded-xl bg-indigo-100 text-blue-900 shadow-md hover:bg-indigo-200 active:scale-95 transition max-w-[220px] flex-1">Szavak kezelése</NavLink>
          <NavLink to="/gyakorlas" className="px-6 py-4 text-lg font-semibold rounded-xl bg-blue-400 text-white shadow-md hover:bg-blue-600 active:scale-95 transition max-w-[220px] flex- text-center">1. szint gyakorlása</NavLink>
        </section>

        <section>
          <h2 className="text-xl font-bold text-blue-900 border-b-4 border-blue-600 pb-2 mb-4">Leitner szintek és ismétlések</h2>
          <div className="flex flex-wrap justify-center gap-5">

            { Object.entries(wordStat.levels || {}).map(([ level, count ]) => {
            {return count > 0 ? (
              <NavLink onClick={() => {
                handleSubmit(level)
              }} key={level} className={`w-40 rounded-xl p-6 text-center shadow-md ${!count ? 'bg-blue-300' : 'bg-blue-600'} ${!count ? 'text-blue-600' : 'text-white'}`}>
                <h3 className="font-bold text-lg mb-2">{level}. szint</h3>
                <p><strong>Szavak száma:</strong> {count}</p>      
              </NavLink>
            ) : (
              <div key={level} className={`w-40 rounded-xl p-6 text-center shadow-md ${!count ? 'bg-blue-300' : 'bg-blue-600'} ${!count ? 'text-blue-600' : 'text-white'}`}>
                <h3 className="font-bold text-lg mb-2">{level}. szint</h3>
                <p><strong>Szavak száma:</strong> {count}</p>      
              </div>
            )}
            }
            )}
          </div>
        </section>
      </main>
  );
}
