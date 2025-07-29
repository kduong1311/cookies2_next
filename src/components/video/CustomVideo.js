import { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";

export default function CustomVideo({ src, isActive }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = muted;

    if (isActive) {
      video.play().then(() => {
        setPlaying(true);
      }).catch((err) => {
        console.error("Autoplay failed:", err);
      });
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [isActive, muted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

  const handleProgressClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
      <video
        src={src}
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover cursor-pointer"
        onClick={togglePlay}
        muted={muted}
        autoPlay
        loop
        playsInline
      />

      <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-10">
        <button onClick={toggleMute}>
          {muted ? (
            <VolumeX className="text-white" />
          ) : (
            <Volume2 className="text-white" />
          )}
        </button>
      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-2 bg-gray-700 cursor-pointer z-10"
        onClick={handleProgressClick}
      >
        <div className="h-full bg-orange-500" style={{ width: `${progress}%` }}></div>
      </div>

      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          aria-hidden="true"
        >
          <Play className="text-white w-20 h-20 bg-black/60 rounded-full p-4" />
        </div>
      )}
    </div>
  );
}
