import './Sample.css';
import magnifyingglassIcon from "../assets/magnifyingglass.svg";
import { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Highlighted from '../Highlighted/Highlighted';
import { useLocation } from 'react-router-dom';
import React from 'react'

function EntireImage() {

    const location = useLocation();

    const props = location.state;

  const [highlightedAreas] = useState([
    { x: props.object.x_min, y: props.object.y_min, width: (props.object.x_max - props.object.x_min), height: (props.object.y_max - props.object.y_min) },
  ]);

  const squareRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<any>(null);

  const handleZoomToHighlightedArea  = () => {
    if (squareRef.current && transformRef.current) {
      transformRef.current.zoomToElement(squareRef.current);
    }
  };

  useEffect(() => {
    setTimeout(() => {  //Timeout to allow for the highlighted area to be rendered
      handleZoomToHighlightedArea();  
    }, 100);
    
  }, []); 

  return (
    <>
      <TransformWrapper
          initialScale = {2}
          panning={{disabled: false}}
          ref={transformRef}
      >
        <TransformComponent
          wrapperStyle={{height: '100%', width:'100%'}}
        >
          <div>
            <img
                src={props.imageURL}
                alt="test"
                object-fit='contain'
                height='auto'
                width='auto'
            />
            {highlightedAreas.map((area, index) => (
              <Highlighted
                key={index}
                x={area.x}
                y={area.y}
                width={area.width}
                height={area.height}
                ref={squareRef}
              />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>

      <footer className="footer">
        <div className="footer-icons-container">
          <img src={magnifyingglassIcon} className="footer-icon" alt="magnifyingglass" style={{ width: '30px', height: '30px' }} />
            <p className="footer-text">Focus</p>
        </div>

        <div className="footer-icons-container">
          <img src={magnifyingglassIcon} className="footer-icon" alt="magnifyingglass" style={{ width: '30px', height: '30px' }} />
          <p className="footer-text">Focus</p>
        </div>
        <Controls handleZoomToHighlightedArea={handleZoomToHighlightedArea} />
      </footer>
    </>
  );
}

type ControlsProps = {
  handleZoomToHighlightedArea: () => void;
};

const Controls: React.FC<ControlsProps> = ({ handleZoomToHighlightedArea }) => {
  return (
    <>
      <div className="footer-icons-container">
        <img src={magnifyingglassIcon} className="footer-icon" alt="magnifyingglass" style={{ width: '30px', height: '30px' }} onClick={handleZoomToHighlightedArea} />
        <p className="footer-text" onClick={handleZoomToHighlightedArea}>Image recenter</p>
      </div>
    </>
  );
};

export default EntireImage;