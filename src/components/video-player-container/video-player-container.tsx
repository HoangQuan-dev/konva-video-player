import { useState, useRef, useEffect } from 'react';
import VideoPlayer from '../video-player/video-player';
import VideoList, { Video } from '../video-list/video-list';
import './video-player-container.css';

// Mock video data
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Big Buck Bunny',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 596
  },
  {
    id: '2',
    title: 'Elephant Dream',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 653
  },
  {
    id: '3',
    title: 'For Bigger Blazes',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 15
  },
  {
    id: '4',
    title: 'For Bigger Escapes',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: 15
  },
  {
    id: '5',
    title: 'For Bigger Fun',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: 60
  },
  {
    id: '6',
    title: 'For Bigger Joyrides',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    duration: 15
  },
  {
    id: '7',
    title: 'For Bigger Meltdowns',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    duration: 15
  },
  {
    id: '8',
    title: 'Sintel',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: 888
  },
  {
    id: '9',
    title: 'Subaru Outback On Street And Dirt',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    duration: 596
  },
  {
    id: '10',
    title: 'Tears of Steel',
    thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 734
  }
];

const VideoPlayerContainer = () => {  const [activeVideo, setActiveVideo] = useState<Video>(mockVideos[0]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  
  // Reset autoPlay flag once video has started playing
  useEffect(() => {
    if (shouldAutoPlay) {
      // Give enough time for the video to start playing
      const timer = setTimeout(() => {
        setShouldAutoPlay(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [shouldAutoPlay, activeVideo]);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set dragging to false if we're leaving the player wrapper entirely
    // Check if the related target is outside the player wrapper
    if (playerWrapperRef.current && !playerWrapperRef.current.contains(e.relatedTarget as Node)) {
      setIsDraggingOver(false);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleSelectVideo = (video: Video) => {
    setActiveVideo(video);
    setShouldAutoPlay(true);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const videoId = e.dataTransfer.getData('text/plain');
    console.log('Dropped video ID:', videoId);
    
    if (videoId) {
      const video = mockVideos.find(v => v.id === videoId);
      if (video) {
        setActiveVideo(video);
        setShouldAutoPlay(true);
      }
    }
    
    setIsDraggingOver(false);
  };

  return (
    <div className="player-container">
      <div 
        className="player-wrapper" 
        ref={playerWrapperRef}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >        <VideoPlayer 
          videoUrl={activeVideo.url} 
          autoPlay={shouldAutoPlay}
          onDragOver={() => {}}
          onDragLeave={() => {}}
          onDrop={() => {}}
        />
        
        {isDraggingOver && (
          <div className="drop-zone active">
            <div className="drop-zone-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div className="drop-zone-text">
              Drop video here to play
            </div>
          </div>
        )}
      </div>
      
      <VideoList 
        videos={mockVideos} 
        onSelectVideo={handleSelectVideo} 
        activeVideoId={activeVideo.id}
      />
    </div>
  );
};

export default VideoPlayerContainer;
