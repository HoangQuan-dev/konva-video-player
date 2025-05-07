import './App.css';
import VideoPlayer from './components/video-player';

function App() {
  return (
    <div className="App">
      <VideoPlayer videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
    </div>
  );
}

// Example video URLs:
// https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/Physicsworks.ogv/Physicsworks.ogv.240p.vp9.webm
// https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
export default App;
