import { ChevronUp, ChevronDown } from 'lucide-react';

export default function NavigationControls({ currentVideo, totalVideos, onPrev, onNext }) {
  return (
    <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-6">
      <button 
        onClick={onPrev}
        disabled={currentVideo === 0}
        className={`p-2 rounded-full bg-gray-800 ${currentVideo === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>
      
      <div className="text-center">
        <span className="font-bold">{currentVideo + 1}</span>
        <span className="text-gray-400">/{totalVideos}</span>
      </div>
      
      <button 
        onClick={onNext}
        disabled={currentVideo === totalVideos - 1}
        className={`p-2 rounded-full bg-gray-800 ${currentVideo === totalVideos - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </div>
  );
}