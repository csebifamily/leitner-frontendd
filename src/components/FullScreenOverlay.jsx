import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FullScreenOverlay({ datum, isActive, error, setError, setActive }) {

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 shadow-xl text-center max-w-sm w-full">
        {!error ? (
          <>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-700 text-lg font-semibold">Feldolgozás folyamatban...</p>
          </>
        ) : (
          <>
            <div className="text-red-600 text-3xl mb-4"><i className="fa-solid fa-circle-exclamation"></i></div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{error}</h2>
            {datum && (<h3 className='text-l font-bold text-gray-600 mb-4'>Legközelebbi gyakorlás: {datum}</h3>)}
            <button
              onClick={() => {
                setActive(false)
                setError(null);
              }}
              className="bg-blue-600 text-white font-bold px-6 py-2 rounded-2xl hover:bg-blue-700 transition"
            >
              Bezárás
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default FullScreenOverlay;
