declare module 'react-plotly.js' {
    import * as React from 'react';
  
    interface PlotParams {
      data: any[];
      layout: any;
      config?: any;
      style?: React.CSSProperties;
      className?: string;
      useResizeHandler?: boolean;
      debug?: boolean;
      onInitialized?: (figure: any, graphDiv: HTMLElement) => void;
      onUpdate?: (figure: any, graphDiv: HTMLElement) => void;
      onPurge?: (graphDiv: HTMLElement) => void;
      onError?: (err: any) => void;
      divId?: string;
    }
  
    const Plot: React.FC<PlotParams>;
    export default Plot;
  }
  