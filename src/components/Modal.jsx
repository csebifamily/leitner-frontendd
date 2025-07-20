export default function Modal({torlesVagyMegerosit = 'torles', onApproved, onClosed, children}) {
    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-4 text-center">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">{children}</h2>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            className="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 text-slate-800 font-semibold"
            onClick={onClosed}
          >
            Mégsem
          </button>
          <button
            className={`px-5 py-2 rounded-xl text-white font-semibold ${torlesVagyMegerosit === 'torles' ? 'bg-red-600 hover:bg-red-800' : 'bg-blue-600 hover:bg-blue-800'}`}
            onClick={onApproved}
          >
            {torlesVagyMegerosit === 'torles' ? 'Igen, törlöm' : 'Irány gyakorolni!'}
          </button>
        </div>
      </div>
    </div>
  );
}