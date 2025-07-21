import { useState } from "react";
import Spinner from './Spinner.jsx';
import Toast from './Toast.jsx';
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {

  const [isPending, setPending] = useState(false);
  const [show, setShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setPending(true);

    const body = {
      email: e.target.elements.email.value
    };

    fetch(`${import.meta.env.VITE_API_URL}/api/forgot-password`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((res) => {
      if(res.error) {
        setShow(true);
        setToastMessage(res.error);
        setToastType('error');
      } else {
        navigate('/bejelentkezes', {
          replace: true,
          state: { toast: { message: res.message, type: 'success' } }
        })
      }
      
    })
    .finally(() => {
      setTimeout(() => setPending(false), 2000)
    })
  }

  if(isPending) {
    return (
    <>
      <Toast show={show} message={toastMessage} type={toastType} onClose={() => setShow(false)}/>
      <Spinner />
    </>
    );
  }
  return (
    <main className="login-container">
      <h1>Elfelejtett jelszó</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email-cím</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Add meg az email címed"
          required
        />

        <button type="submit" className="btn-login">
          Visszaállítás kérése
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