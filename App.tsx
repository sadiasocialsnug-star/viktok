
import React, { useState, useEffect, useRef } from 'react';
import { VideoData } from './types';
import VideoCard from './components/VideoCard';
import { generateAICaption } from './services/gemini';

const INITIAL_VIDEOS: VideoData[] = [
  {
    id: '1',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-lighting-in-the-city-at-night-21243-large.mp4',
    author: 'neon_vibes',
    description: 'Exploring the neon streets of Tokyo',
    likes: 12400,
    comments: 432,
    shares: 89,
    avatar: 'https://picsum.photos/seed/user1/100/100'
  },
  {
    id: '2',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-near-the-shore-4151-large.mp4',
    author: 'ocean_drifter',
    description: 'Morning surf session was therapeutic',
    likes: 8900,
    comments: 124,
    shares: 45,
    avatar: 'https://picsum.photos/seed/user2/100/100'
  },
  {
    id: '3',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    author: 'nature_lover',
    description: 'Found this hidden gem in the mountains',
    likes: 45600,
    comments: 1205,
    shares: 412,
    avatar: 'https://picsum.photos/seed/user3/100/100'
  },
  {
    id: '4',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-out-in-the-gym-23253-large.mp4',
    author: 'gym_freak_99',
    description: 'Pushing limits every single day',
    likes: 23100,
    comments: 67,
    shares: 12,
    avatar: 'https://picsum.photos/seed/user4/100/100'
  }
];

const App: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>(INITIAL_VIDEOS);
  const [activeVideoId, setActiveVideoId] = useState<string>(INITIAL_VIDEOS[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect active video
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveVideoId(entry.target.getAttribute('data-id') || '');
          }
        });
      },
      { threshold: 0.6 }
    );

    const items = document.querySelectorAll('.snap-item');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [videos]);

  // Enhancing captions with AI on load
  useEffect(() => {
    const enhanceCaptions = async () => {
      const enhanced = await Promise.all(
        videos.map(async (v) => {
          if (v.aiCaption) return v;
          const caption = await generateAICaption(v.description);
          return { ...v, aiCaption: caption };
        })
      );
      setVideos(enhanced);
    };
    enhanceCaptions();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden font-sans">
      {/* Top Navigation Overlay */}
      <div className="fixed top-0 left-0 w-full z-20 flex justify-center items-center py-4 px-6 pointer-events-none">
        <div className="flex space-x-4 pointer-events-auto">
          <button className="text-white font-semibold text-lg opacity-70 hover:opacity-100 transition">Following</button>
          <button className="text-white font-bold text-lg border-b-2 border-white pb-1">For You</button>
        </div>
        <div className="absolute right-6 pointer-events-auto text-white text-xl">
          <i className="fas fa-search"></i>
        </div>
      </div>

      {/* Main Feed */}
      <div ref={containerRef} className="snap-container flex-grow">
        {videos.map((video) => (
          <div key={video.id} className="snap-item" data-id={video.id}>
            <VideoCard 
              video={video} 
              isActive={activeVideoId === video.id} 
            />
          </div>
        ))}
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-black/90 border-t border-gray-800 z-20 flex justify-around items-center py-2 pb-6">
        <button className="flex flex-col items-center text-white">
          <i className="fas fa-home text-xl"></i>
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <i className="fas fa-user-friends text-xl"></i>
          <span className="text-[10px] mt-1">Friends</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="relative w-12 h-8 bg-gradient-to-r from-cyan-400 via-white to-pink-500 rounded-md flex items-center justify-center">
            <div className="w-[85%] h-[85%] bg-white rounded-sm flex items-center justify-center">
               <i className="fas fa-plus text-black text-sm"></i>
            </div>
          </div>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <i className="fas fa-comment-dots text-xl"></i>
          <span className="text-[10px] mt-1">Inbox</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <i className="fas fa-user text-xl"></i>
          <span className="text-[10px] mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default App;
