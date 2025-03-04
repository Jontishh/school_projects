import React from 'react'
import { useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'

import './Sidebar.css'
import '../Navbar/Navbar.css'

import HelpPopup from '../HelpPopup/HelpPopup'

import crossIcon from '../../assets/cross.svg'
import personIcon from '../../assets/person.svg'
import helpIcon from '../../assets/help.svg'
import siteIcon from '../../assets/site.svg'
import listIcon from '../../assets/list.svg'
import infoIcon from '../../assets/info.svg'
import logoutIcon from '../../assets/logout.png'

import { useAuth } from '../../contexts/auth-context'

interface SidebarProps {
    open : boolean;
    handleToggleMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({open, handleToggleMenu }) => {

    const location = useLocation()
    const {pathname} = location
    const [isOpen, setisOpen] = useState(false);
    const navigate = useNavigate()
    const pagesWithoutScansAndStudies = ["/Welcome", "/Connect", "/Studies"]
    const { studyId } = useParams();
    const {isLoggedIn, logout} = useAuth();

    const handleScansClick = () => {
        if (pagesWithoutScansAndStudies.includes(pathname)){
            handleToggleMenu();
        }
        else {
            navigate(`/Scans/${studyId}`);
            handleToggleMenu();
        }
    };

    
    const handleStudiesClick = () => {
        if (pagesWithoutScansAndStudies.includes(pathname)){
            handleToggleMenu();
        }
        else {
            navigate('/Studies')
            handleToggleMenu();
        }
        
    };
    
    const handleChangeSignatureClick = () => {
        // navigate('/Welcome')
        handleToggleMenu();
    }
    
    const handleLogout = () => {
        logout();
        navigate('/')
    }

    return (
        <>
        <div className={open ? 'sidebar open' : 'sidebar'}>
            <div className="close-icon">
                <img src={crossIcon} className="cross" alt="cross" onClick={handleToggleMenu} style={{width: '35px', height: '35px'}}/>
            </div>

            <div className="menu-items-container">
                <div className="menu-item">
                    <img src={siteIcon} className="menu-logo" alt="scan" onClick={handleScansClick} style={{width: '35px', 
                                                                                                            height: '35px',
                                                                                                            opacity: pagesWithoutScansAndStudies.includes(pathname) ? 0.25 : 1}}/>
                    <p className="menu-text" onClick={handleScansClick} style={{opacity: pagesWithoutScansAndStudies.includes(pathname) ? 0.25 : 1}}> Scan </p>
                </div>

                <div className="menu-item">
                    <img src={listIcon} className="menu-logo" alt="list" onClick={handleStudiesClick} style={{width: '35px', 
                                                                                                              height: '35px',
                                                                                                              opacity: pagesWithoutScansAndStudies.includes(pathname) ? 0.25 : 1}}/>
                    <p className="menu-text" onClick={handleStudiesClick} style={{opacity: pagesWithoutScansAndStudies.includes(pathname) ? 0.25 : 1}}> Studies </p>
                </div>

                <div className="menu-item">
                    <img src={personIcon} className="menu-logo" alt="person" onClick={handleChangeSignatureClick} style={{width: '35px', height: '35px'}}/>
                    <p className="menu-text" onClick={handleChangeSignatureClick}> Change signature </p>
                </div>

                <div className="menu-item">
                    <img src={helpIcon} className="menu-logo" alt="help" onClick={() => setisOpen(true)} style={{width: '35px', height: '35px'}}/>
                    <p className="menu-text" onClick={() => setisOpen(true)}> Help</p>
                </div>

                <div className="menu-item">
                    <img src={infoIcon} className="menu-logo" alt="about" onClick={handleToggleMenu} style={{width: '35px', height: '35px'}}/>
                    <p className="menu-text" onClick={handleToggleMenu}> About </p>
                </div>

                {isLoggedIn && 
                    <div className="menu-item">
                        <img src={logoutIcon} className="menu-logo" alt="logout" onClick={handleLogout} style={{width: '35px', height: '35px'}}/>
                        <p className="menu-text" onClick={handleLogout}> Log out </p>
                    </div>
                    
                }
            </div>

        </div>
        
        <HelpPopup isOpen={isOpen} setisOpen={setisOpen} />
 
        </>
    )
}

export default Sidebar;
