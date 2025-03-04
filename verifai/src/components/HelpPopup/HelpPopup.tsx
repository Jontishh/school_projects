import React from 'react';

import './HelpPopup.css';
import '../Sidebar/Sidebar.css';

import ImageSlider from '../ImageSlider/ImageSlider';

import crossIcon from '../../assets/cross.svg';
import helpGif from '../../assets/Wow-gif.gif';

interface HelpPopupProps {
    isOpen: boolean;
    setisOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HelpPopup: React.FC<HelpPopupProps> = ({ isOpen, setisOpen }) => {
    return isOpen ? (
        <div className='help-popup-container'>
            <div className='help-popup-inner'>
                <h1 style={{color: 'black'}}>Help</h1>
                <div className="help-gif-container">
                    <ImageSlider>
                        <img src={helpGif} alt="Help GIF" className="help-gif" />
                        <img src={helpGif} alt="Help" className="help-gif" />
                        <img src={helpGif} alt="Helphelp" className="help-gif" />
                    </ImageSlider>
                </div>
                <img src={crossIcon} className="popup-close-icon" alt="cross" onClick={() => setisOpen(false)}/>
            </div>
        </div>
    ) : null; 
};

export default HelpPopup;