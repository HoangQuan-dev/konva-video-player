import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image, Group, Rect } from 'react-konva';
import { Image as KonvaImage } from 'konva/lib/shapes/Image';
import { Play, CircleStop } from 'lucide-react';
import './App.css';

function App() {
  const [video] = useState(() => {
    const video = document.createElement('video');
    video.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    // video.crossOrigin = 'anonymous';
    return video;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSize, setVideoSize] = useState({ width: 640, height: 360 });
  const [progress, setProgress] = useState(0);
  const imageRef = useRef<KonvaImage>(null);
  const stageRef = useRef(null);

  useEffect(() => {
    video.addEventListener('loadedmetadata', () => {
      setVideoSize({
        width: video.videoWidth,
        height: video.videoHeight,
      });
    });

    video.addEventListener('timeupdate', () => {
      setProgress((video.currentTime / video.duration) * 100);
    });
  }, [video]);

  useEffect(() => {
    let animationFrameId: number;
    const updateFrame = () => {
      const layer = imageRef.current?.getLayer();
      if (layer) {
        layer.batchDraw();
      }
      animationFrameId = requestAnimationFrame(updateFrame);
    };

    if (isPlaying) {
      video.play();
      updateFrame();
    } else {
      video.pause();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, video]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStageClick = (e: any) => {
    // Only toggle if clicking on the video area (not controls)
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const controlsHeight = 60; // Approximate height of controls area
    
    if (pointerPosition.y < videoSize.height - controlsHeight) {
      togglePlay();
    }
  };

  const handleSeek = (e: any) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const seekBarWidth = videoSize.width;
    const seekPosition = (pointerPosition.x / seekBarWidth) * video.duration;
    
    video.currentTime = seekPosition;
    setProgress((seekPosition / video.duration) * 100);
  };

  return (
    <div className="App">
      <div className="video-container">
        <Stage 
          width={videoSize.width} 
          height={videoSize.height + 20} // Extra height for seekbar
          onClick={handleStageClick}
          ref={stageRef}
        >
          <Layer>
            <Group>
              <Image
                ref={imageRef}
                image={video}
                width={videoSize.width}
                height={videoSize.height}
              />
            </Group>
          </Layer>
          <Layer>
            <Group y={videoSize.height}>
              <Rect
                x={0}
                y={0}
                width={videoSize.width}
                height={4}
                fill="#4a4a4a"
              />
              <Rect
                x={0}
                y={0}
                width={(videoSize.width * progress) / 100}
                height={4}
                fill="#ff0000"
                onClick={handleSeek}
                onTap={handleSeek}
              />
            </Group>
          </Layer>
        </Stage>
        <div className="controls">
          <button onClick={togglePlay} className="control-button">
            {isPlaying && <CircleStop />}
            {!isPlaying && <Play />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
