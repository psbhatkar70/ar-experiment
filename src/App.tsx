import React from 'react';
// @ts-ignore
import '@google/model-viewer';

// --- THE BYPASS FIX ---
// We treat the tag string as a generic component. 
// TypeScript will now ignore strict type checking for this specific tag.
const ModelViewer = 'model-viewer' as any;

const App: React.FC = () => {
  const MODEL_URL = "/models/cake.glb";

  return (
    <div style={styles.container}>
      <ModelViewer
        src={MODEL_URL}
        alt="A 3D Cake"
        
        // --- AR Configuration ---
        ar={true}
        ar-modes="webxr scene-viewer quick-look"
        
        // --- YOUR CONSTRAINTS ---
        ar-scale="fixed"
        ar-placement="floor"
        disable-zoom={true}
        disable-pan={true}
        interaction-prompt="none"
        
        // --- Visuals ---
        shadow-intensity="1"
        camera-controls={false}
        
        style={styles.viewer}
      >
        <button slot="ar-button" style={styles.arButton}>
          View Cake in AR
        </button>
      </ModelViewer>
    </div>
  );
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewer: {
    width: '100%',
    height: '100%',
  },
  arButton: {
    backgroundColor: '#000000',
    color: 'white',
    borderRadius: '30px',
    border: 'none',
    position: 'absolute',
    bottom: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 24px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    zIndex: 10,
  }
};

export default App;