import { useState, useRef } from 'react';
import './video-list.css';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: number;
}

interface VideoListProps {
  videos: Video[];
  onSelectVideo: (video: Video) => void;
  activeVideoId?: string;
}

const VideoList = ({ videos, onSelectVideo, activeVideoId }: VideoListProps) => {
  const [draggingItem, setDraggingItem] = useState<Video | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, video: Video) => {
    setDraggingItem(video);
    
    // Create a ghost image for dragging
    const ghostElement = document.createElement('div');
    ghostElement.classList.add('video-drag-ghost');
    
    const img = document.createElement('img');
    img.src = video.thumbnail;
    img.style.width = '120px';
    img.style.height = '68px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '4px';
    
    ghostElement.appendChild(img);
    
    document.body.appendChild(ghostElement);
    e.dataTransfer.setDragImage(ghostElement, 60, 34);
    
    // Set data for drop target - use plain text format for compatibility
    e.dataTransfer.setData('text/plain', video.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Clean up ghost element after drag operation ends
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Clean up any visual cues
    setDraggingItem(null);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-list-container" ref={listRef}>
      <div className="video-list-header">
        <h3>Videos</h3>
      </div>
      <div className="video-list">
        {videos.map((video) => (
          <div
            key={video.id}
            className={`video-item ${activeVideoId === video.id ? 'active' : ''} ${draggingItem?.id === video.id ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, video)}
            onDragEnd={handleDragEnd}
            onClick={() => onSelectVideo(video)}
          >
            <div className="video-thumbnail">
              <img src={video.thumbnail} alt={video.title} />
              <div className="video-duration">{formatDuration(video.duration)}</div>
            </div>
            <div className="video-info">
              <div className="video-title">{video.title}</div>
              <div className="drag-hint">Drag to player</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
