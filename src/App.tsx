import './App.css';
import '@google/model-viewer';

function App() {
  return (
    <div className="ar-container">
      {/* @ts-ignore: Custom Web Component types are conflicting with React 19 types */}
      <model-viewer 
        src="/models/cake.glb"
        alt="A 3D model of a cake"
        ar
        ar-modes="webxr scene-viewer quick-look" 
        ar-scale="fixed"
        
        // --- VISUAL FIXES FOR 2D PREVIEW ---
        // 1. Pull the camera back: '45deg' (azimuth), '55deg' (elevation), '2m' (radius/distance)
        // Adjust '2m' to '3m' or '1.5m' depending on how big your cake actually is.
        camera-orbit="45deg 55deg 2.5m" 
        
        // 2. Widen the lens slightly (default is often too narrow)
        field-of-view="30deg"
        
        // 3. Prevent user from messing up the preview
        camera-controls={false} 
        disable-zoom 
        interaction-prompt="none"
        
        // Style: Ensure the component itself fits the container
        style={{ width: '100%', height: '100%' }} 
      >
        <button slot="ar-button" className="ar-button">
          See in AR
        </button>
      {/* @ts-ignore */}
      </model-viewer>
    </div>
  );
}

export default App;