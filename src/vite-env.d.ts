// --- TYPE DEFINITIONS ---
// This interface defines the shape of the <model-viewer> DOM element
interface ModelViewerElement extends HTMLElement {
  getCameraOrbit(): { theta: number; phi: number; radius: number };
  cameraOrbit: string;
  fieldOfView: string;
  jumpCameraToGoal(): void;
}

// This tells React that <model-viewer> is a valid JSX tag
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'ar-placement'?: string;
          'camera-controls'?: boolean;
          'disable-pan'?: boolean;
          'disable-zoom'?: boolean;
          'interaction-prompt'?: string;
          'camera-orbit'?: string;
          'min-camera-orbit'?: string;
          'max-camera-orbit'?: string;
          'field-of-view'?: string;
          'interpolation-decay'?: string;
          ref?: React.RefObject<ModelViewerElement | null>; // Correct Ref Type
        },
        HTMLElement
      >;
    }
  }
}