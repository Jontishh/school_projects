import React from 'react';

import './Popup.css';
import '../Sidebar/Sidebar.css';

import crossIcon from '../../assets/cross.svg';

interface PopupProps {
    isOpen: boolean;
    setisOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, setisOpen, children }) => {
    return isOpen ? (
        <div className='popup-container'>

            <div className='popup-inner'>
                
                <div className="radio-buttons-container">
                    <div className='popup-header'>
                        <p>Select parasite</p>
                        <img src={crossIcon} className="popup-close-icon" alt="cross" onClick={() => setisOpen(false)}/>
                    </div>
                    
                    {children}
                </div>
                
            </div>
        </div>
    ) : null; 
};

export default Popup;