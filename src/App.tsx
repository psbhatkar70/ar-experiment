import  { useRef } from 'react';
import './App.css';
import '@google/model-viewer';

// --- CONSTANTS ---
const MODEL_SRC = "/models/cake.glb";
const ALT_TEXT = "A 3D model of a cake";

// Initial View: 45deg (Horizontal), 55deg (Vertical), 2.5m (Zoom)
// 55deg is a nice "standing at the table" viewing angle.
const INITIAL_ORBIT = "45deg 55deg 2.5m"; 
const FIELD_OF_VIEW = "30deg";

function App() {
  // 1. Explicitly type the Ref so TS knows it's not 'never'
  const modelRef = useRef<ModelViewerElement>(null);

  // 2. Explicitly type the 'direction' parameter
  const handleTurntableRotate = (direction: number) => {
    const viewer = modelRef.current;
    if (!viewer) return;

    const orbit = viewer.getCameraOrbit();
    // 30 degrees step for a noticeable spin
    const step = (30 * Math.PI) / 180; 
    const newTheta = orbit.theta + (direction * step);

    viewer.cameraOrbit = `${newTheta}rad ${orbit.phi}rad ${orbit.radius}m`;
  };

  return (
    <div className="ar-container">
      {/* @ts-ignore */}
      <model-viewer 
        ref={modelRef}
        src={MODEL_SRC}
        alt={ALT_TEXT}
        ar
        ar-modes="webxr scene-viewer quick-look" 
        ar-scale="fixed"
        ar-placement="floor"
        
        // --- INTERACTION RESTRICTIONS ---
        camera-controls
        disable-pan     // Prevents sliding the cake off-screen
        disable-zoom    // Keeps the scale consistent
        interaction-prompt="none" // Hides the "hand" animation
        
        // --- CAMERA LOCKING (THE KEY FIX) ---
        camera-orbit={INITIAL_ORBIT}
        field-of-view={FIELD_OF_VIEW}
        
        // STRICTLY LOCK VERTICAL MOVEMENT
        // By setting min and max Phi to the same value (e.g., 55deg),
        // we physically prevent the user (and the code) from tilting the camera up/down.
        // It forces the camera to stay on the "ring" around the cake.
        min-camera-orbit="-Infinity 55deg auto"
        max-camera-orbit="Infinity 55deg auto"

        // Smooths out the button clicks
        interpolation-decay="200"

        style={{ width: '100%', height: '100%' }} 
      >
        {/* ... hotspots remain the same ... */}
        {/* Hotspot 1: Name */}
        <button className="hotspot-label" slot="hotspot-name" data-position="0m 0.6m -0.4m" data-normal="0m 0m 1m">
          <div className="label-text">Cheese Cake</div>
        </button>

        {/* ... other hotspots ... */}
        <button 
          className="hotspot-card" 
          slot="hotspot-ingredients" 
          data-position="0.55m 0.5m 0m" 
          data-normal="1m 0m 0m"
        >
          <div className="card-header">Ingredients</div>
          <ul className="card-list">
            <li>Dark Chocolate</li>
            <li>Heavy Cream</li>
            <li>Vanilla Bean</li>
            <li>Sea Salt</li>
          </ul>
        </button>

        {/* --- HOTSPOT 3: FACT (Left & Elevated) --- */}
        {/* Y increased to 0.5m (was 0.2m) */}
        <button 
          className="hotspot-card" 
          slot="hotspot-fact" 
          data-position="-0.55m 0.5m 0m" 
          data-normal="-1m 0m 0m"
        >
          <div className="card-header">Did you know?</div>
          <p className="card-text">
            The world's most expensive cake cost $75 million and was loaded with 4,000 diamonds.
          </p>
        </button>


        {/* --- TURNTABLE CONTROLS --- */}
        <div className="turntable-controls">
            <button 
              className="control-btn" 
              onClick={() => handleTurntableRotate(-1)} 
              aria-label="Rotate Left"
            >
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>

            <button 
              className="control-btn" 
              onClick={() => handleTurntableRotate(1)}
              aria-label="Rotate Right"
            >
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
            </button>
        </div>

        <button slot="ar-button" className="ar-button">
          See in AR
        </button>
      {/* @ts-ignore */}
      </model-viewer>
    </div>
  );
}

export default App;