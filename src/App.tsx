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
  
  // Refs for the Hotspot Buttons (for direct DOM manipulation)
  const nameRef = useRef<HTMLButtonElement>(null);
  const ingRef = useRef<HTMLButtonElement>(null);
  const factRef = useRef<HTMLButtonElement>(null);

  // Rotation State
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const requestRef = useRef<number | null>(null);

  // --- MATH HELPER ---
  // Rotates a point (x, y) around center (0,0)
  const rotateCoordinate = (x: number, y: number, angleDeg: number) => {
    // Convert to Radians
    const rad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // 2D Rotation Matrix logic
    // Since we are rotating the Z-axis, the "floor" is the X/Y plane.
    const newX = x * cos - y * sin;
    const newY = x * sin + y * cos;
    
    return { x: newX, y: newY };
  };

  // --- ANIMATION LOOP ---
  const animateRotation = () => {
    const diff = targetRotation.current - currentRotation.current;

    // Stop if the movement is tiny (save battery)
    if (Math.abs(diff) < 0.1) {
      currentRotation.current = targetRotation.current;
      updateScene(currentRotation.current);
      requestRef.current = null;
      return; 
    }

    // Easing factor (0.1 = smooth, 1.0 = instant)
    const ease = 0.1; 
    currentRotation.current += diff * ease;

    updateScene(currentRotation.current);
    requestRef.current = requestAnimationFrame(animateRotation);
  };

  // --- SCENE UPDATER ---
  const updateScene = (angle: number) => {
    // 1. Rotate the Cake (Z-Axis based on your finding)
    if (modelRef.current) {
      modelRef.current.orientation = `0deg 0deg ${angle}deg`;
    }

    // 2. Rotate the Hotspots
    const refs = [nameRef, ingRef, factRef];
    
    // Iterate through config to calculate new positions
    HOTSPOTS_CONFIG.forEach((config, index) => {
      const element = refs[index].current;
      if (!element) return;

      // Calculate new X and Y based on the rotation angle
      // We assume Z (height) stays constant
      const { x: newX, y: newY } = rotateCoordinate(config.x, config.y, angle);

      // Apply to the DOM element
      // Note: We used X and Y for the rotation plane. 
      // If the hotspots move "up and down" instead of "around", 
      // swap ${newY} with ${config.z} in the string below.
      element.dataset.position = `${newX}m ${newY}m ${config.z}m`;
    });
  };

  const handleCakeRotate = (direction: number) => {
    const step = 45; 
    targetRotation.current += (direction * step);

    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(animateRotation);
  };

  // Cleanup
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
        
        {/* BUTTONS WITH REFS */}
        <button 
          ref={nameRef}
          className="hotspot-label" 
          slot="hotspot-name" 
          data-position="0m 0.6m -0.4m" 
          data-normal="0m 0m 1m"
        >
          <div className="label-text">Cheese Cake</div>
        </button>

        <button 
          ref={ingRef}
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
          ref={factRef}
          className="hotspot-card" 
          slot="hotspot-fact" 
          data-position="-0.55m 0.5m 0m" 
          data-normal="-1m 0m 0m"
        >
          <div className="card-header">Did you know?</div>
          <p className="card-text">Expensive diamonds.</p>
        </button>

        <button slot="ar-button" className="ar-button">View in your space</button>

        <div className="ar-controls-overlay">
          <button 
            className="control-btn" 
            onClick={(e) => { e.stopPropagation(); handleCakeRotate(-1); }} 
          >
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          
          <div className="control-label">ROTATE CAKE</div>

          <button 
            className="control-btn" 
            onClick={(e) => { e.stopPropagation(); handleCakeRotate(1); }}
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