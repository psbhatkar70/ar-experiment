import './App.css';
import '@google/model-viewer';

// --- CONSTANTS ---
const MODEL_SRC = "/models/cake.glb";
const ALT_TEXT = "A 3D model of a cake";

// Initial Camera Position:
// 45deg (Horizontal angle), 55deg (Vertical angle), 2.5m (Distance)
const INITIAL_ORBIT = "45deg 55deg 2.5m";

// Field of View: Wider lens to see the whole item comfortably
const FIELD_OF_VIEW = "30deg";

function App() {
  return (
    <div className="ar-container">
      {/* @ts-ignore: Custom Web Component types logic */}
      <model-viewer 
        src={MODEL_SRC}
        alt={ALT_TEXT}
        
        // --- AR SETUP ---
        ar
        ar-modes="webxr scene-viewer quick-look" 
        ar-scale="fixed"      // Enforces "Actual Size" (1:1 with real world)
        ar-placement="floor"  // Sticks to the table
        
        // --- INTERACTION SETTINGS (Turntable Mode) ---
        camera-controls       // ENABLED: Allows user to touch and interact
        disable-pan           // ENABLED: Prevents sliding/moving the object
        disable-zoom          // ENABLED: Prevents changing the size
        interaction-prompt="auto" // Shows the "Hand" hint so they know they can swipe
        
        // --- CAMERA CONSTRAINTS ---
        // Sets the starting angle
        camera-orbit={INITIAL_ORBIT}
        field-of-view={FIELD_OF_VIEW}
        
        // Prevents the user from looking "under" the table.
        // Format: [min-theta] [min-phi] [min-radius]
        // Phi 0deg = Top down. Phi 90deg = Horizon.
        min-camera-orbit="auto 0deg auto"
        max-camera-orbit="auto 85deg auto"

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