export function MobileWarning() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800/80 backdrop-blur-md rounded-lg p-6 max-w-md space-y-4 border border-gray-700/50">
        <div className="text-4xl text-center mb-2">💻</div>
        <h1 className="text-xl font-bold text-center">Desktop View Recommended</h1>
        <p className="text-gray-300 text-center">
          This project is designed to simulate a desktop operating system experience. 
          For the best experience, please view it on a computer.
        </p>
        <p className="text-gray-400 text-sm text-center">
          You can continue on mobile, but some features may not work as intended.
        </p>
        <div className="flex justify-center pt-2">
          <button 
            onClick={() => localStorage.setItem('ignoreMobileWarning', 'true')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
} 