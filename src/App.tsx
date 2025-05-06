import './App.css';
import VideoPlayer from './components/video-player';

function App() {
  return (
    <div className="App">
      <VideoPlayer videoUrl="https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/Physicsworks.ogv/Physicsworks.ogv.240p.vp9.webm" />
    </div>
  );
}

export default App;
