import { useRef, useEffect } from 'react';
import './App.css';
import '@google/model-viewer';

// --- TYPES ---
interface ModelViewerElement extends HTMLElement {
  orientation: string;
  cameraTarget: string;
  getCameraTarget(): { x: number; y: number; z: number };
}

// --- CONFIGURATION ---
const HOTSPOTS_CONFIG = [
  { id: 'name',        x: 0,     y: 0.6,  z: -0.4 }, 
  { id: 'ingredients', x: 0.55,  y: 0.5,  z: 0    }, 
  { id: 'fact',        x: -0.45, y: 0.5,  z: 0    }  
];

const MODEL_SRC = "/models/cake.glb";

function App() {
  const modelRef = useRef<ModelViewerElement>(null);
  
  const nameRef = useRef<HTMLButtonElement>(null);
  const ingRef = useRef<HTMLButtonElement>(null);
  const factRef = useRef<HTMLButtonElement>(null);

  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  // Track the World Position of the cake
  const worldPos = useRef({ x: 0, z: 0.3 }); 
  const requestRef = useRef<number | null>(null);

  // --- MATH HELPERS ---
  const rotateCoordinate = (x: number, z: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: x * Math.cos(rad) - z * Math.sin(rad),
      z: x * Math.sin(rad) + z * Math.cos(rad)
    };
  };

  const updateScene = (angle: number) => {
    if (modelRef.current) {
      // 1. Update the Cake's local rotation
      modelRef.current.orientation = `0deg 0deg ${angle}deg`;
      
      // 2. Update the Cake's world position (Moves the pivot point)
      // This forces the AR anchor to shift
      modelRef.current.cameraTarget = `${worldPos.current.x}m 0.1m ${worldPos.current.z}m`;
    }

    // 3. Update Hotspots (Rotation + World Translation)
    const refs = [nameRef, ingRef, factRef];
    HOTSPOTS_CONFIG.forEach((config, index) => {
      const element = refs[index].current;
      if (!element) return; 

      // First: Calculate where the hotspot is relative to the cake (Rotation)
      const { x: rotX, z: rotZ } = rotateCoordinate(config.x, config.z, -angle);

      // Second: Offset that by the cake's position in the room (Translation)
      const finalX = rotX + worldPos.current.x;
      const finalZ = rotZ + worldPos.current.z;

      // Force AR sync via attribute
      element.setAttribute('data-position', `${finalX}m ${config.y}m ${finalZ}m`);
    });
  };

  // --- HANDLERS ---
  const animateRotation = () => {
    const diff = targetRotation.current - currentRotation.current;
    if (Math.abs(diff) < 0.1) {
      currentRotation.current = targetRotation.current;
      updateScene(currentRotation.current);
      requestRef.current = null;
      return; 
    }
    currentRotation.current += diff * 0.1;
    updateScene(currentRotation.current);
    requestRef.current = requestAnimationFrame(animateRotation);
  };

  const handleCakeRotate = (direction: number) => {
    targetRotation.current += (direction * 25);
    if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(animateRotation);
  };

  const handleMove = (axis: 'x' | 'z', step: number) => {
    if (axis === 'x') worldPos.current.x += step;
    if (axis === 'z') worldPos.current.z += step;
    
    // Trigger update immediately so it works even if not rotating
    updateScene(currentRotation.current);
  };

  useEffect(() => {
    // Initial placement sync
    updateScene(0);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, []);

  return (
    <div className="ar-container">
      {/* @ts-ignore */}
      <model-viewer 
        ref={modelRef}
        src={MODEL_SRC}
        ar
        ar-modes="webxr" 
        ar-scale="fixed" 
        camera-controls
        touch-action="none"
        disable-zoom
        style={{ width: '100%', height: '100%' }} 
      >

        <button ref={nameRef} className="hotspot-label" slot="hotspot-name">
          <div className="label-text">Cheese Cake</div>
        </button>

        <button ref={ingRef} className="hotspot-card" slot="hotspot-ingredients">
          <div className="card-header">Ingredients</div>
        </button>

        <button ref={factRef} className="hotspot-card" slot="hotspot-fact">
          <div className="card-header">Did you know?</div>
        </button>

        <button slot="ar-button" className="ar-button">View in AR</button>

        <div className="ar-controls-overlay">
          {/* Rotation Controls */}
          <div className="control-row">
            <button className="control-btn" onClick={() => handleCakeRotate(-1)}>↺ Left</button>
            <button className="control-btn" onClick={() => handleCakeRotate(1)}>↻ Right</button>
          </div>

          {/* Movement Controls (The Joystick) */}
          <div className="control-row">
            <button className="control-btn" onClick={() => handleMove('z', -0.1)}>↑ Away</button>
          </div>
          <div className="control-row">
            <button className="control-btn" onClick={() => handleMove('x', -0.1)}>← Left</button>
            <button className="control-btn" onClick={() => handleMove('z', 0.1)}>↓ Near</button>
            <button className="control-btn" onClick={() => handleMove('x', 0.1)}>Right →</button>
          </div>
        </div>

      {/* @ts-ignore */}
      </model-viewer>
    </div>
  );
}

export default App;