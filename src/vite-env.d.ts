/// <reference types="vite/client" />
/// <reference types="react" />

// We use a namespace declaration here, which patches the global scope directly.
// This avoids the "module" isolation issue you faced earlier.
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        // Core Attributes
        src: string;
        alt: string;
        poster?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        reveal?: 'auto' | 'interaction' | 'manual';

        // AR Attributes (The critical ones for your use case)
        ar?: boolean;
        'ar-modes'?: string; // 'webxr', 'scene-viewer', 'quick-look'
        'ar-scale'?: 'auto' | 'fixed'; // Enforce 'fixed' for 1:1 scale
        'ar-placement'?: 'floor' | 'wall';
        
        // UI & Camera Controls
        'camera-controls'?: boolean;
        'disable-zoom'?: boolean; // Critical for "no resizing"
        'interaction-prompt'?: 'auto' | 'none' | 'when-focused';
        'shadow-intensity'?: string | number;
        'environment-image'?: string;
        exposure?: string | number;

        // Slot for custom buttons
        slot?: string; 
      },
      HTMLElement
    >;
  }
}