import React from 'react'
import { useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Outlet } from 'react-router-dom';

import './ZoomPopup.css';
import '../Navbar/Navbar.css'

import Highlighted from '../Highlighted/Highlighted';
import Sidebar from "../Sidebar/Sidebar";

import arrowBackIcon from '../../assets/arrowback.svg'
import enaiblersIcon from '../../assets/enaiblers.svg'
import menuIcon from '../../assets/menu.svg'
import target from '../../assets/target.svg'

interface ZoomPopupProps {
    zoomIsOpen: boolean;
    setZoomIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    object: any;
    imageURL: any;
}

type ControlsProps = {
    handleZoomToHighlightedArea: () => void;
  };
  
const Controls: React.FC<ControlsProps> = ({ handleZoomToHighlightedArea }) => {
return (
  <>
    <div className="footer-icons-container">
      <img src={target} className="footer-icon" alt="magnifyingglass" style={{ width: '32px', height: '32px' }} onClick={handleZoomToHighlightedArea} />
      <p className="footer-text" onClick={handleZoomToHighlightedArea}>Recenter Image</p>
    </div>
    </>
);
};
  
const ZoomPopup: React.FC<ZoomPopupProps> = ({ zoomIsOpen, setZoomIsOpen, object, imageURL }) => {

  const [highlightedAreas] = useState([
    { x: object.x_min, y: object.y_min, width: (object.x_max - object.x_min), height: (object.y_max - object.y_min) }, // Calculate the object size
  ]);

  const squareRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<any>(null);

  const handleZoomToHighlightedArea  = () => {
    if (squareRef.current && transformRef.current) {
      transformRef.current.zoomToElement(squareRef.current);
    }
  };

  setTimeout(() => {  //Timeout to allow for the highlighted area to be rendered
    handleZoomToHighlightedArea();  
  }, 100);
  
  const [open, setOpen] = useState(false);

  const handleToggleMenu = () => {
      setOpen(!open);
  };

  return zoomIsOpen ? (
  
      <div className="zoom-popup-container">
          <nav className='Navbar'>
                  <img src={arrowBackIcon} className="back" alt="arrow back" onClick={() => {setZoomIsOpen(false)}} />
                  <div className='NavbarHeader'>
                          <img src={enaiblersIcon} className= 'NavbarHeaderItem logo'  alt="Enaiblers Icon" />
                          <p className="NavbarHeaderItem text">Verify</p>
                  </div>
                  <img src={menuIcon} className="menu" alt="menu Icon" onClick={handleToggleMenu} />
          </nav>
          <Sidebar open = {open} handleToggleMenu = {handleToggleMenu}/>
          {open && <div className="overlay" onClick={handleToggleMenu}></div>}

          <Outlet />
          
          <div className='zoom-popup-inner'>
              
              <div className='zoom-popup-image'>
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
                              src={imageURL}
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
              </div>
              
              <footer className="zoom-popup-footer">
                  <Controls handleZoomToHighlightedArea={handleZoomToHighlightedArea} />
              </footer>
          </div>
      </div>
  
  ) : null;
};

export default ZoomPopup;