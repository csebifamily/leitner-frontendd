import { useState, useEffect } from "react";
import Spinner from './Spinner.jsx'
import { useNavigate, useParams } from "react-router-dom";

export default function ForgotPasswordSet() {

  const [isPending, setPending] = useState(false);
  const [engedely, setEngedely] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  //Automatikusan ellenőrzi, hogy valid-e a jelszó megújító token vagy nem járt-e le?
  useEffect(() => {
    setPending(true);

    const body = { token };

    fetch(`${import.meta.env.VITE_API_URL}/api/forgot-password-ellenorzes`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'content-type': 'application/json'
        }
    })
        .then((res) => res.json())
        .then((res) => {
            if(!res.error) {
                console.log(res.message);
            } else {
                navigate('/bejelentkezes', { 
                    replace: true,
                    state: { toast: { message: res.error, type: 'error' } }
                })
            }
        })
        .finally(() => {
            setPending(false);
            setEngedely(true);
        })
  }, [])

  function handleSubmit(e) {
    e.preventDefault();
    setPending(true);

    const body = { 
        password: e.target.elements.password.value,
        token
     }

    fetch(`${import.meta.env.VITE_API_URL}/api/new-password`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((res) => res.json())
    .then((res) => {
        navigate('/bejelentkezes', {
            replace: true,
            state: { toast: { message: 'Sikeres jelszómódosítás!', type: 'success' } }
        })
        setPending(false)
    })
    .catch(() => {
        navigate('/bejelentkezes', {
            replace: true,
            state: { toast: { message: 'Sikertelen jelszómódosítás!', type: 'error' } }
        })
        setPending(false)
    })
  }

  if(!engedely) return <Spinner />
  if(isPending) return <Spinner />
  return (
    <main className="login-container">
      <h1>Elfelejtett jelszó</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Új jelszó beállítása</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Add meg az új jelszavad"
          required
        />

        <button type="submit" className="btn-login">
          Új jelszó beállítása
        </button>
      </form>

      <p className="text-sm mt-4">
        Emlékszel a jelszóra?{' '}
        <a href="/bejelentkezes" className="text-blue-600 hover:underline">
          Jelentkezz be itt
        </a>
      </p>
    </main>
  );    
}