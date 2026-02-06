import  { useRef } from 'react';
import './App.css';
import '@google/model-viewer';

// --- TYPES ---
interface ModelViewerElement extends HTMLElement {
  orientation: string; 
  updateFraming(): void;
}

const MODEL_SRC = "/models/cake.glb";

function App() {
  const modelRef = useRef<ModelViewerElement>(null);
  
  // Track rotation angle (Y-axis)
  const currentYRotation = useRef(0);

  // useEffect(() => {
  //   const viewer = modelRef.current;
  //   if (!viewer) return;

    // EVENT LISTENER: Detect when user enters/exits AR
    // const handleARStatus = (event: any) => {
    //   // 'session-started' means we are in the Camera View (WebXR)
    //   if (event.detail.status === 'session-started') {
    //     setIsARMode(true);
    //   } else {
    //     setIsARMode(false);
    //   }
    // };

    // viewer.addEventListener('ar-status', handleARStatus);

    // Cleanup listener on unmount
  //   return () => {
  //     viewer.removeEventListener('ar-status', handleARStatus);
  //   };
  // }, []);

  const handleCakeRotate = (direction: number) => {
    const viewer = modelRef.current;
    if (!viewer) return;

    // Rotate 45 degrees per click
    const step = 45; 
    currentYRotation.current += (direction * step);

    // Apply rotation to Y-AXIS (Middle value)
    // "Roll(X) Pitch(Y) Yaw(Z)" -> We want Y for "Spinning on table"
    viewer.orientation = `0deg ${currentYRotation.current}deg 0deg`;
  };

  return (
    <div className="ar-container">
      {/* @ts-ignore */}
      <model-viewer 
        ref={modelRef}
        src={MODEL_SRC}
        alt="A 3D model of a cake"
        
        // AR CONFIGURATION
        ar
        // 'webxr' must be first for DOM Overlay support on Android
        ar-modes="webxr scene-viewer quick-look" 
        ar-scale="fixed" 
        ar-placement="floor"
        
        // INTERACTION
        camera-controls
        disable-zoom
        
        // Initial Orientation
        orientation="0deg 0deg 0deg"

        style={{ width: '100%', height: '100%' }} 
      >

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

        
        {/* Standard "See in AR" Button (Visible in Preview) */}
        <button slot="ar-button" className="ar-button">
          View in your space
        </button>

        {/* --- AR-ONLY CONTROLS --- */}
        {/* logic: Only render this div if isARMode is TRUE */}
        
          <div className="ar-controls-overlay">
            <button 
              className="control-btn" 
              onClick={(e) => {
                e.stopPropagation(); // Prevent clicks from hitting the AR scene
                handleCakeRotate(-1);
              }} 
            >
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>
            
            <div className="control-label">ROTATE CAKE</div>

            <button 
              className="control-btn" 
              onClick={(e) => {
                e.stopPropagation();
                handleCakeRotate(1);
              }}
            >
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
            </button>
          </div>
      

      {/* @ts-ignore */}
      </model-viewer>
    </div>
  );
}

export default App;