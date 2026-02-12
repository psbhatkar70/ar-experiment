import { useRef, useEffect, useState } from 'react';
import './App.css';
import '@google/model-viewer';

// --- TYPES ---
interface ModelViewerElement extends HTMLElement {
  orientation: string;
  cameraTarget: string;
  getCameraTarget(): { x: number; y: number; z: number };
}

const MODEL_SRC = "/models/cake.glb";

// Hotspot coordinates relative to the model center
const HOTSPOTS_CONFIG = [
  { id: 'name', x: 0, y: 0.6, z: -0.4 },
  { id: 'ingredients', x: 0.55, y: 0.5, z: 0 },
  { id: 'fact', x: -0.45, y: 0.5, z: 0 }
];

function App() {
  const modelRef = useRef<ModelViewerElement>(null);
  
  // Refs for DOM manipulation of hotspots
  const nameRef = useRef<HTMLButtonElement>(null);
  const ingRef = useRef<HTMLButtonElement>(null);
  const factRef = useRef<HTMLButtonElement>(null);

  // Animation State
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const requestRef = useRef<number | null>(null);

  // --- MODEL MOVEMENT (THE "JOYSTICK" LOGIC) ---
  const moveModel = (axis: 'x' | 'z', delta: number) => {
    const viewer = modelRef.current;
    if (!viewer) return;

    // Get current target and update it imperatively
    const target = viewer.getCameraTarget();
    
    // Changing Z pulls it toward/away from the camera
    // Changing X moves it left/right
    if (axis === 'x') target.x += delta;
    if (axis === 'z') target.z += delta;

    viewer.cameraTarget = `${target.x}m ${target.y}m ${target.z}m`;
  };

  // --- ROTATION LOGIC (EXISTING) ---
  const rotateCoordinate = (x: number, z: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: x * Math.cos(rad) - z * Math.sin(rad),
      z: x * Math.sin(rad) + z * Math.cos(rad)
    };
  };

  const updateScene = (angle: number) => {
    if (modelRef.current) {
      modelRef.current.orientation = `0deg 0deg ${angle}deg`;
    }

    const refs = [nameRef, ingRef, factRef];
    HOTSPOTS_CONFIG.forEach((config, index) => {
      const element = refs[index].current;
      if (!element) return;
      const { x: newX, z: newZ } = rotateCoordinate(config.x, config.z, -angle);
      element.setAttribute('data-position', `${newX}m ${config.y}m ${newZ}m`);
    });
  };

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

  useEffect(() => {
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, []);

  return (
    <div className="ar-container">
      {/* @ts-ignore */}
      <model-viewer
        ref={modelRef}
        src={MODEL_SRC}
        ar
        ar-modes="webxr" // Removed native modes to force WebXR control
        ar-scale="fixed"
        camera-controls
        touch-action="none"
        camera-orbit="0deg 75deg 0.5m"
        camera-target="0m 0m 0.5m" // Spawns the target closer to camera initially
        style={{ width: '100%', height: '100%' }}
      >
        {/* Hotspots */}
        <button ref={nameRef} slot="hotspot-name" className="hotspot-label" data-position="0m 0.6m -0.4m">
          <div className="label-text">Cheese Cake</div>
        </button>

        <button ref={ingRef} slot="hotspot-ingredients" className="hotspot-card" data-position="0.55m 0.5m 0m">
          <div className="card-header">Ingredients</div>
        </button>

        <button ref={factRef} slot="hotspot-fact" className="hotspot-card" data-position="-0.45m 0.5m 0m">
          <div className="card-header">Did you know?</div>
        </button>

        <button slot="ar-button" className="ar-button">Start AR</button>

        {/* UI CONTROLS */}
        <div className="ar-controls-overlay">
          <div className="control-group">
            <p>Rotation</p>
            <button className="control-btn" onClick={() => handleCakeRotate(-1)}>↺</button>
            <button className="control-btn" onClick={() => handleCakeRotate(1)}>↻</button>
          </div>

          <div className="control-group">
            <p>Position (Z-Axis)</p>
            <button className="control-btn" onClick={() => moveModel('z', -0.1)}>Push Away ↑</button>
            <button className="control-btn" onClick={() => moveModel('z', 0.1)}>Pull Near ↓</button>
          </div>
          
          <div className="control-group">
            <p>Position (X-Axis)</p>
            <button className="control-btn" onClick={() => moveModel('x', -0.1)}>← Left</button>
            <button className="control-btn" onClick={() => moveModel('x', 0.1)}>Right →</button>
          </div>
        </div>
        {/* @ts-ignore */}
      </model-viewer>
    </div>
  );
}

export default App;