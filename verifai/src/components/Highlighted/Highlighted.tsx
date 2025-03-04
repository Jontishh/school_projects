import React from 'react';

  interface renderHighlightedAreasProps {
    x: number;
    y: number;
    width: number;
    height: number;
  }

const Highlighted = React.forwardRef<HTMLDivElement, renderHighlightedAreasProps>(({ x, y, width, height }, ref) => {
  
    return (
      <div
        ref={ref}
        style={{
          position: 'absolute',
          top: y,
          left: x,
          width: width,
          height: height,
          zIndex: '3',
          border: '2px dashed red',
          pointerEvents: 'none',
        }}
      />
    );
  });
  
  export default Highlighted;