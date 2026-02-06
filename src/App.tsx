import  { useEffect, useRef } from 'react';
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
  
  // 1. Target Rotation: Where we WANT to go
  const targetRotation = useRef(0);
  
  // 2. Current Rotation: Where we ARE right now
  const currentRotation = useRef(0);
  
  // 3. Animation Frame ID: To cancel loop if needed
  const requestRef = useRef<number | null>(null);

  // --- THE SMOOTHING ENGINE ---
  const animateRotation = () => {
    // A. Calculate the distance to the target
    const diff = targetRotation.current - currentRotation.current;

    // B. If we are close enough, stop (save battery)
    if (Math.abs(diff) < 0.1) {
      currentRotation.current = targetRotation.current;
      updateOrientation(currentRotation.current);
      return; 
    }

    // C. Move 10% of the way there (Easing Factor)
    // Changing 0.1 to 0.05 makes it slower/smoother. 0.2 makes it snappier.
    const ease = 0.1; 
    currentRotation.current += diff * ease;

    // D. Apply the update
    updateOrientation(currentRotation.current);

    // E. Loop
    requestRef.current = requestAnimationFrame(animateRotation);
  };

  // Helper function to keep the string formatting clean
  const updateOrientation = (angle: number) => {
    if (modelRef.current) {
      // Rotating Z-axis as per your previous success
      modelRef.current.orientation = `0deg 0deg ${angle}deg`;
    }
  };

  const handleCakeRotate = (direction: number) => {
    const step = 45; // 45 degrees step
    
    // 1. Update the TARGET, not the current value
    targetRotation.current += (direction * step);

    // 2. Start the animation loop if it's not running
    // (cancel previous to avoid double-speed bugs)
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(animateRotation);
  };

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);
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