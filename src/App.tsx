import './App.css';
import '@google/model-viewer';

// --- CONSTANTS ---
const MODEL_SRC = "/models/cake.glb";
const ALT_TEXT = "A 3D model of a cake";
const INITIAL_ORBIT = "45deg 55deg 2.5m";
const FIELD_OF_VIEW = "30deg";

function App() {
  return (
    <div className="ar-container">
      {/* @ts-ignore */}
      <model-viewer 
        src={MODEL_SRC}
        alt={ALT_TEXT}
        
        // --- AR SETUP ---
        ar
        ar-modes="webxr scene-viewer quick-look" 
        ar-scale="fixed"
        ar-placement="floor"
        
        // --- INTERACTION ---
        camera-controls
        disable-pan
        disable-zoom
        interaction-prompt="auto"
        
        // --- CAMERA ---
        camera-orbit={INITIAL_ORBIT}
        field-of-view={FIELD_OF_VIEW}
        min-camera-orbit="auto 0deg auto"
        max-camera-orbit="auto 85deg auto"

        style={{ width: '100%', height: '100%' }} 
      >
        {/* --- HOTSPOT 1: NAME (BEHIND & ELEVATED) --- */}
        {/* X=0 (Center), Y=0.45m (High Up), Z=-0.4m (Behind the cake) */}
        <button 
          className="hotspot-label" 
          slot="hotspot-name" 
          data-position="0m 0.45m -0.4m" 
          data-normal="0m 0m 1m" 
        >
          <div className="label-text">Hello Deveksh is Gagan</div>
          <div className="line-anchor"></div>
        </button>

        {/* --- HOTSPOT 2: INGREDIENTS (RIGHT SIDE) --- */}
        {/* X=0.5m (Right), Y=0.2m (Low), Z=0m (Center depth) */}
        <button 
          className="hotspot-card" 
          slot="hotspot-ingredients" 
          data-position="0.5m 0.2m 0m" 
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

        {/* --- HOTSPOT 3: FACT (LEFT SIDE) --- */}
        {/* X=-0.5m (Left), Y=0.2m (Low), Z=0m (Center depth) */}
        <button 
          className="hotspot-card" 
          slot="hotspot-fact" 
          data-position="-0.5m 0.2m 0m" 
          data-normal="-1m 0m 0m"
        >
          <div className="card-header">Did you know?</div>
          <p className="card-text">
            The world's most expensive cake cost $75 million and was loaded with 4,000 diamonds.
          </p>
        </button>

        {/* AR Button */}
        <button slot="ar-button" className="ar-button">
          See in AR
        </button>
      {/* @ts-ignore */}
      </model-viewer>
    </div>
  );
}

export default App;
