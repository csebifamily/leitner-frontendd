
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


const Header = () => {

  const [isPending, setPending] = useState(true);
  const [initDone, setInitDone] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    if(location.pathname === '/bejelentkezes') {
      setPending(false);
    } else {
      setPending(true);
    }
    
    setInitDone(true);
  }, [])

  if(!initDone) return null;

  if(isPending) {
    return (
      <header className="w-full max-w-4xl bg-blue-600 text-white rounded-xl px-6 py-3 shadow-lg flex justify-end items-center mb-8">
        <div className="flex items-center gap-3 cursor-pointer" title="Profil">
          <div className="w-9 h-9 bg-blue-900 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
            <i className="fa-regular fa-user"></i>
          </div>
          <span className="font-semibold text-base hidden sm:inline">János</span>
        </div>
      </header>
    );
  }

}

export default Header