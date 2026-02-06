import  { useRef, useEffect } from 'react';
import './App.css';
import '@google/model-viewer';

// --- 1. TYPE DEFINITIONS ---
// We explicitly tell TS that 'orientation' exists on this element
interface ModelViewerElement extends HTMLElement {
  orientation: string; 
  updateFraming(): void;
}

// --- 2. CONFIGURATION (Moved here so it is found) ---
// Initial coordinates for your hotspots.
// These act as the "Home" positions before any rotation.
const HOTSPOTS_CONFIG = [
  { id: 'name',        x: 0,     y: 0.6,  z: -0.4 }, // Cheese Cake
  { id: 'ingredients', x: 0.55,  y: 0.5,  z: 0    }, // Ingredients
  { id: 'fact',        x: -0.55, y: 0.5,  z: 0    }  // Fact
];

const MODEL_SRC = "/models/cake.glb";

function App() {
  const modelRef = useRef<ModelViewerElement>(null);
  
  // --- 1. REFS FOR BUTTONS ---
  // We need direct access to the buttons to update them fast
  const nameRef = useRef<HTMLButtonElement>(null);
  const ingRef = useRef<HTMLButtonElement>(null);
  const factRef = useRef<HTMLButtonElement>(null);

  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const requestRef = useRef<number | null>(null);

  // --- 2. THE MATH HELPER ---
  // Calculates where a point (x, z) should be after rotating by 'angleDeg'
  const rotateCoordinate = (x: number, z: number, angleDeg: number) => {
    // Convert degrees to radians
    const rad = (angleDeg * Math.PI) / 180;
    
    // Standard Rotation Matrix
    // We rotate around the origin (0,0)
    // Note: If they spin the wrong way, change '-' to '+' in the sin/cos terms
    const newX = x * Math.cos(rad) - z * Math.sin(rad);
    const newZ = x * Math.sin(rad) + z * Math.cos(rad);
    
    return { x: newX, z: newZ };
  };

  const animateRotation = () => {
    const diff = targetRotation.current - currentRotation.current;

    if (Math.abs(diff) < 0.1) {
      currentRotation.current = targetRotation.current;
      updateScene(currentRotation.current);
      requestRef.current = null;
      return; 
    }

    const ease = 0.1; 
    currentRotation.current += diff * ease;

    updateScene(currentRotation.current);
    requestRef.current = requestAnimationFrame(animateRotation);
  };

  // --- 3. THE SCENE UPDATER ---
  const updateScene = (angle: number) => {
    // A. Rotate the Cake Mesh (Z-Axis, as per your setup)
    if (modelRef.current) {
      modelRef.current.orientation = `0deg 0deg ${angle}deg`;
    }

    // B. Rotate the Hotspots (Orbit around Scene Y-Axis)
    const refs = [nameRef, ingRef, factRef];
    
    HOTSPOTS_CONFIG.forEach((config, index) => {
      const element = refs[index].current;
      if (!element) return;

      // Calculate new floor position (X and Z)
      // We pass the NEGATIVE angle if the directions are opposite. 
      // Try 'angle' first. If hotspots fly left while cake spins right, use '-angle'.
      const { x: newX, z: newZ } = rotateCoordinate(config.x, config.z, -angle);

      // Update the DOM. 
      // Format: "X Y Z" (Y is constant height)
      element.dataset.position = `${newX}m ${config.y}m ${newZ}m`;
    });
  };

  const handleCakeRotate = (direction: number) => {
    const step = 45; 
    targetRotation.current += (direction * step);

    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(animateRotation);
  };

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
        ar
        ar-modes="webxr scene-viewer quick-look" 
        ar-scale="fixed" 
        ar-placement="floor"
        camera-controls
        disable-zoom
        orientation="0deg 0deg 0deg"
        style={{ width: '100%', height: '100%' }} 
      >

        {/* --- CONNECT REFS TO BUTTONS --- */}
        <button 
          ref={nameRef}  // <--- ATTACH REF
          className="hotspot-label" 
          slot="hotspot-name" 
          data-position="0m 0.6m -0.4m" 
          data-normal="0m 0m 1m"
        >
          <div className="label-text">Cheese Cake</div>
        </button>

        <button 
          ref={ingRef} // <--- ATTACH REF
          className="hotspot-card" 
          slot="hotspot-ingredients" 
          data-position="0.55m 0.5m 0m" 
          data-normal="1m 0m 0m"
        >
          <div className="card-header">Ingredients</div>
          <ul className="card-list">
             <li>Dark Chocolate</li>
             <li>Heavy Cream</li>
          </ul>
        </button>

        <button 
          ref={factRef} // <--- ATTACH REF
          className="hotspot-card" 
          slot="hotspot-fact" 
          data-position="-0.55m 0.5m 0m" 
          data-normal="-1m 0m 0m"
        >
          <div className="card-header">Did you know?</div>
          <p className="card-text">Expensive cake.</p>
        </button>

        {/* ... Rest of your UI ... */}
        <button slot="ar-button" className="ar-button">View in your space</button>
        
        {/* Your Buttons */}
        <div className="ar-controls-overlay">
           <button className="control-btn" onClick={(e) => { e.stopPropagation(); handleCakeRotate(-1); }}>
             <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
           </button>
           <button className="control-btn" onClick={(e) => { e.stopPropagation(); handleCakeRotate(1); }}>
             <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
           </button>
        </div>

      {/* @ts-ignore */}
      </model-viewer>
    </div>
  );
}

export default App;