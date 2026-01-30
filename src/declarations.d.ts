// src/declarations.d.ts
import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'ar-placement'?: string;
        'camera-controls'?: boolean;
        'disable-zoom'?: boolean;
        'disable-pan'?: boolean;
        'interaction-prompt'?: string;
        'shadow-intensity'?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        reveal?: 'auto' | 'interaction' | 'manual';
        // Add any other attributes you need here
      }, HTMLElement>;
    }
  }
}