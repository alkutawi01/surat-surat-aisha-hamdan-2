import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Music, Sparkles } from "lucide-react";

interface AmbientAudioPlayerProps {
  audioUrl?: string;
  audioTitle?: string;
  audioEnabled?: boolean;
  accentColor?: string;
  bodyFont?: string;
}

export default function AmbientAudioPlayer({
  audioUrl = "",
  audioTitle = "Latar Suasana (Ambient Audio)",
  audioEnabled = false,
  accentColor = "#d7b9b9",
  bodyFont = "Inter"
}: AmbientAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Synchronize audio element source and autoplay attempts
  useEffect(() => {
    if (!audioUrl) {
      if (isPlaying) {
        setIsPlaying(false);
      }
      return;
    }

    setError(null);
    
    // Create audio instance or update source
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
    } else {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      if (wasPlaying && audioEnabled) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }

    // Set volume and mute status
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;

    // Error handler
    const handleError = () => {
      setError("Ralat memainkan audio. Sila pastikan pautan audio adalah sah.");
      setIsPlaying(false);
    };

    audioRef.current.addEventListener("error", handleError);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("error", handleError);
      }
    };
  }, [audioUrl]);

  // Synchronize play state
  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay blocked or playback error:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioUrl]);

  // Synchronize volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Synchronize mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!audioUrl) return null;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div 
      className="fixed bottom-4 left-4 z-40 bg-[#1f0200]/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-2xl transition-all duration-300 hover:border-white/20 hover:scale-[1.02]"
      style={{ fontFamily: bodyFont }}
      id="ambient-audio-widget"
    >
      {/* Wave Visualizer Animation */}
      <div className="flex items-end gap-0.5 h-3.5 w-4 overflow-hidden" id="audio-wave-bars">
        <span 
          className={`w-0.5 bg-current rounded-full transition-all ${isPlaying ? 'animate-[bounce_0.8s_infinite_ease-in-out]' : 'h-1'}`}
          style={{ 
            color: accentColor, 
            height: isPlaying ? undefined : "4px",
            animationDelay: "0.1s" 
          }} 
        />
        <span 
          className={`w-0.5 bg-current rounded-full transition-all ${isPlaying ? 'animate-[bounce_0.5s_infinite_ease-in-out]' : 'h-2'}`}
          style={{ 
            color: accentColor, 
            height: isPlaying ? undefined : "8px",
            animationDelay: "0.3s" 
          }} 
        />
        <span 
          className={`w-0.5 bg-current rounded-full transition-all ${isPlaying ? 'animate-[bounce_0.7s_infinite_ease-in-out]' : 'h-1.5'}`}
          style={{ 
            color: accentColor, 
            height: isPlaying ? undefined : "6px",
            animationDelay: "0s" 
          }} 
        />
        <span 
          className={`w-0.5 bg-current rounded-full transition-all ${isPlaying ? 'animate-[bounce_0.6s_infinite_ease-in-out]' : 'h-1'}`}
          style={{ 
            color: accentColor, 
            height: isPlaying ? undefined : "3px",
            animationDelay: "0.2s" 
          }} 
        />
      </div>

      <div className="flex flex-col select-none max-w-[110px] sm:max-w-[140px] leading-tight">
        <span className="text-[10px] text-[#d7b9b9]/60 uppercase tracking-widest font-semibold flex items-center gap-1 font-mono">
          <Music size={8} /> Suasana
        </span>
        <span className="text-[11px] text-white/95 truncate font-medium font-serif" title={audioTitle}>
          {audioTitle || "Muzik Latar"}
        </span>
      </div>

      <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="p-1.5 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-all cursor-pointer"
          style={{ color: isPlaying ? accentColor : undefined }}
          id="audio-play-pause-btn"
          title={isPlaying ? "Jeda" : "Main"}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
        </button>

        {/* Mute Button */}
        <button
          type="button"
          onClick={toggleMute}
          className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
          id="audio-mute-btn"
          title={isMuted ? "Buka Suara" : "Senyap"}
        >
          {isMuted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>

        {/* Volume Slider */}
        <input 
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-12 h-0.5 rounded-lg bg-white/20 accent-[#d7b9b9] cursor-pointer"
          id="audio-volume-slider"
          title={`Suhu Suara: ${Math.round(volume * 100)}%`}
        />
      </div>

      {error && (
        <div className="absolute bottom-full left-0 mb-2 bg-red-950/95 border border-red-500/30 text-[10px] text-red-300 px-2 py-1 rounded shadow-lg max-w-[200px] leading-snug">
          {error}
        </div>
      )}
    </div>
  );
}
