
import React, { useState, useRef, useEffect } from 'react';
import { VideoData } from '../types';

interface VideoCardProps {
  video: VideoData;
  isActive: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isActive }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => {
        // Handle potential autoplay restrictions
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDoubleClick = () => {
    setIsLiked(true);
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
        onClick={togglePlay}
        onDoubleClick={handleDoubleClick}
      />

      {/* Play/Pause Indicator (Overlay) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <i className="fas fa-play text-white text-6xl opacity-50"></i>
        </div>
      )}

      {/* Side Action Bar */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-6 z-10">
        <div className="flex flex-col items-center group">
          <div className="relative">
            <img src={video.avatar} alt={video.author} className="w-12 h-12 rounded-full border-2 border-white object-cover" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white">
              <i className="fas fa-plus text-[8px] text-white"></i>
            </div>
          </div>
        </div>

        <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center">
          <i className={`fas fa-heart text-3xl transition-colors duration-200 ${isLiked ? 'text-pink-500' : 'text-white'}`}></i>
          <span className="text-white text-xs font-semibold mt-1">{(video.likes / 1000).toFixed(1)}K</span>
        </button>

        <button className="flex flex-col items-center">
          <i className="fas fa-comment-dots text-3xl text-white"></i>
          <span className="text-white text-xs font-semibold mt-1">{video.comments}</span>
        </button>

        <button className="flex flex-col items-center">
          <i className="fas fa-bookmark text-3xl text-white"></i>
          <span className="text-white text-xs font-semibold mt-1">Save</span>
        </button>

        <button className="flex flex-col items-center">
          <i className="fas fa-share text-3xl text-white"></i>
          <span className="text-white text-xs font-semibold mt-1">{video.shares}</span>
        </button>

        {/* Mute Toggle */}
        <button onClick={() => setIsMuted(!isMuted)} className="flex flex-col items-center">
          <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-2xl text-white opacity-70`}></i>
        </button>
      </div>

      {/* Bottom Info Overlay */}
      <div className="absolute bottom-20 left-0 w-full p-4 pr-16 text-white z-10 pointer-events-none">
        <div className="flex items-center space-x-2 mb-2 pointer-events-auto">
          <h3 className="font-bold text-lg">@{video.author}</h3>
          <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-sm">Ad</span>
        </div>
        
        {/* Gemini Enhanced Caption Area */}
        <div className="mb-2 pointer-events-auto">
          {video.aiCaption ? (
             <p className="text-sm font-medium leading-snug drop-shadow-lg">
               <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">AI: </span>
               {video.aiCaption}
             </p>
          ) : (
            <p className="text-sm leading-snug opacity-90">{video.description}</p>
          )}
        </div>

        <div className="flex items-center space-x-2 mt-2 pointer-events-auto">
          <i className="fas fa-music text-xs"></i>
          <div className="overflow-hidden whitespace-nowrap w-40">
            <p className="animate-marquee inline-block text-xs">Original Sound - {video.author}</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default VideoCard;
