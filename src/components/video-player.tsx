import { Stage, Layer, Image, Text } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import { Play, CircleStop, Volume2, VolumeX } from 'lucide-react';
import Konva from 'konva';
import './video-player.css';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  const [dimensions,] = useState({
    width: 640,
    height: 360,
  });
  const [videoElement] = useState(() => {
    const element = document.createElement('video');
    element.src = videoUrl;
    return element;
  });
  const [, setVideoSize] = useState({ width: 0, height: 0 });
  const [status, setStatus] = useState('Loading video...');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const animationRef = useRef<Konva.Animation | null>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleMetadata = () => {
      setStatus('');
      setVideoSize({
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      });
      setDuration(videoElement.duration);
    };

    const handleTimeUpdate = () => {
      setProgress((videoElement.currentTime / videoElement.duration) * 100);
      setCurrentTime(videoElement.currentTime);
    };

    videoElement.addEventListener('loadedmetadata', handleMetadata);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleMetadata);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoElement]);

  const handlePlay = () => {
    setStatus('');
    setIsPlaying(true);
    videoElement.play();
    if (layerRef.current) {
      const anim = new Konva.Animation(() => {}, layerRef.current);
      animationRef.current = anim;
      anim.start();
    }
    
    // Auto-hide controls after a delay
    resetControlsTimeout();
  };

  const handlePause = () => {
    setIsPlaying(false);
    videoElement.pause();
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    // Show controls when paused
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 5000);
  };

  const handleMouseMove = () => {
    resetControlsTimeout();
  };

  const handleStageClick = (e: any) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const controlsHeight = 60;
    
    if (pointerPosition && pointerPosition.y < dimensions.height - controlsHeight) {
      if (isPlaying) {
        handlePause();
      } else {
        handlePlay();
      }
    }
  };
  
  // Volume control functions
  const handleVolumeChange = (x: number, width: number) => {
    const newVolume = Math.max(0, Math.min(1, x / width));
    setVolume(newVolume);
    videoElement.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      videoElement.volume = volume;
      setIsMuted(false);
    } else {
      videoElement.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="video-container" 
      onMouseMove={handleMouseMove}
      style={{ height: dimensions.height }}
    >
      <Stage 
        width={dimensions.width} 
        height={dimensions.height}
        onClick={handleStageClick}
        ref={stageRef}
      >
        <Layer ref={layerRef}>
          <Image
            image={videoElement}
            x={0}
            y={0}
            width={dimensions.width}
            height={dimensions.height}
          />
          {status && (
            <Text
              text={status}
              width={dimensions.width}
              height={dimensions.height}
              align="center"
              verticalAlign="middle"
              fill="white"
              fontSize={20}
            />
          )}
        </Layer>
      </Stage>

      {showControls && (
        <>
          <div 
            className="seekbar"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const seekPosition = (x / rect.width) * videoElement.duration;
              videoElement.currentTime = seekPosition;
              setProgress((seekPosition / videoElement.duration) * 100);
            }}
          >
            <div className="seekbar-background"></div>
            <div 
              className="seekbar-progress" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="controls">
            <div className="controls-left">
              <button onClick={isPlaying ? handlePause : handlePlay} className="control-button">
                {isPlaying ? <CircleStop /> : <Play />}
              </button>
              <div className="volume-control">
                <button onClick={toggleMute} className="control-button">
                  {isMuted ? <VolumeX /> : <Volume2 />}
                </button>
                <div 
                  className="volume-slider" 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    handleVolumeChange(x, rect.width);
                  }}
                >
                  <div 
                    className="volume-progress" 
                    style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                  />
                </div>
              </div>
              <div className="time-display" style={{marginLeft: 16}}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
