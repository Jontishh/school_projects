import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import entireImage from '../samples/image.jpg';
import './Sample.css'
import { useState, useRef } from "react";
import magnifyingglassIcon from "../assets/magnifyingglass.svg";
import Highlighted from "../Highlighted/Highlighted";

export default function EntireImage() {
  const [highlightedAreas] = useState([
    { x: 100, y: 100, width: 100, height: 100 },
  ]);

  const squareRef = useRef<HTMLDivElement>(null);

  const centerSquare = () => {
    if (squareRef.current) {
      squareRef.current.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
    }
  };

  return (
    <>
      <div className="center-container-entireImage">
        <div className="entire-picture-container">
          <TransformWrapper
            centerOnInit={false}
            centerZoomedOut={false}
            initialScale={3}
            limitToBounds={false}
            pinch={{ step: 1000 }}
            alignmentAnimation={{ sizeX: 10000, sizeY: 100000, velocityAlignmentTime: 0 }}
          >
            <TransformComponent>
              <img src={entireImage} className="sample-entire-picture" alt="entire image" />
              {highlightedAreas.map((area) => (
                <Highlighted
                  key={`${area.x}-${area.y}`}
                  x={area.x}
                  y={area.y}
                  width={area.width}
                  height={area.height}
                  ref={squareRef}
                />
              ))}
            </TransformComponent>
          </TransformWrapper>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-icons-container">
          <img src={magnifyingglassIcon} className="footer-icon" alt="magnifyingglass" style={{ width: '30px', height: '30px' }} />
          <p className="footer-text">Focus</p>
        </div>
        <div className="footer-icons-container">
          <img src={magnifyingglassIcon} className="footer-icon" alt="magnifyingglass" style={{ width: '30px', height: '30px' }} />
          <p className="footer-text">Focus</p>
        </div>
        <div className="footer-icons-container">
          <img src={magnifyingglassIcon} className="footer-icon" alt="magnifyingglass" style={{ width: '30px', height: '30px' }} onClick={centerSquare} />
          <p className="footer-text" onClick={centerSquare}>Image recenter</p>
        </div>
      </footer>
    </>
  );
}

