import './App.css';
// We import the component to register the web component in the window registry
import '@google/model-viewer';

function App() {
  return (
    <div className="ar-container">
      {/* Architectural Note: 
        We are using the Web Component directly. 
        'ar-placement="floor"' ensures it snaps to surfaces.
        'ar-scale="fixed"' satisfies your constraint: NO resizing allowed.
      */}
      {/* @ts-ignore: Custom Web Component types are conflicting with React 19 types */}
      <model-viewer 
      src="/models/cake.glb"
        alt="A 3D model of a cake"
        ar
        // Priority: WebXR (seamless) -> SceneViewer (Android Native) -> QuickLook (iOS Native)
        ar-modes="webxr scene-viewer quick-look" 
        ar-scale="fixed"
        camera-controls={false} // Disables rotation/zoom in the 2D preview
        disable-zoom // Explicitly disables zooming
        interaction-prompt="none" // Hides the "move phone" helper UI
        shadow-intensity="1"
        style={{ width: '100%', height: '100vh', backgroundColor: '#111' }}
      >
        {/* Custom Button Slot to override default UI */}
        <button slot="ar-button" className="ar-button">
          See in AR
        </button>
        {/* @ts-ignore: Custom Web Component types are conflicting with React 19 types */}
      </model-viewer>
    </div>
  );
}

export default App;