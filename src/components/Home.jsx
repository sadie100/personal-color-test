export const Home = ({ onStart }) => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-md">
        <h1 className="text-5xl font-bold mb-4">Personal Color Test</h1>
        <p className="text-xl mb-4">Discover your seasonal color palette</p>

        <div className="bg-white/20 rounded-lg p-6 mb-8 backdrop-blur-md">
          <p className="text-sm mb-4">
            Test your preferences across a range of colors and discover your personal color type among the 12 seasons.
          </p>
          <ul className="text-sm text-left space-y-2 mb-4">
            <li>✓ View full-screen colors</li>
            <li>✓ Like or dislike colors with simple buttons</li>
            <li>✓ Get personalized color recommendations</li>
            <li>✓ Learn about your seasonal color type</li>
          </ul>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-white opacity-90">
            💡 Tip: Hold your screen up to your face while testing to see how colors complement your skin tone.
          </p>
        </div>

        <button
          onClick={onStart}
          className="bg-white hover:bg-gray-100 text-purple-600 font-bold text-lg py-4 px-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          Start Color Test
        </button>
      </div>
    </div>
  );
};
