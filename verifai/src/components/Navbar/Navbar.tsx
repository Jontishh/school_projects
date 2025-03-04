import { Outlet, useNavigate, useLocation} from "react-router-dom";
import { useState } from "react";
import arrowBackIcon from '../../assets/arrowback.svg'
import enaiblersIcon from '../../assets/enaiblers.svg'
import menuIcon from '../../assets/menu.svg'
import './Navbar.css'
import Sidebar from "../Sidebar/Sidebar";

export default function Navbar(){
    const [open, setOpen] = useState(false);

    const handleToggleMenu = () => {
        setOpen(!open);
    };
    const navigate = useNavigate()
	const goToPrevPage =()=>{
        if(pathname === '/Connect') {
            navigate('/') // This avoids going back to an external authentication web site
        } else {
            navigate(-1);
        }
    }
    const location = useLocation()
    const {pathname} = location
    //TODO: kom på en smartare lösning än case
    let headerText
    switch (pathname) {
        case "/Welcome" :
            headerText = 'Get started'
            break;
        case "/Connect":
            headerText = 'Connect'
            break;
        case "/Verify":
            headerText = 'Verify'
            break;
        case "/SiteSelection":
            headerText = 'Find Site'
            break;
        case "/Studies":
            headerText = 'Studies'
            break;
        default: 
            headerText = 'Verify'
            break;
    }

    return(
        
        <>
            <nav className='Navbar'>
                    <img src={arrowBackIcon} className="back" alt="arrow back" onClick={open ? handleToggleMenu : goToPrevPage} />
                    <div className='NavbarHeader'>
                            <img src={enaiblersIcon} className= 'NavbarHeaderItem logo'  alt="Enaiblers Icon" />
                            <p className="NavbarHeaderItem text">{headerText}</p>
                    </div>
                    <img src={menuIcon} className="menu" alt="menu Icon" onClick={handleToggleMenu} />
            </nav>
            <Sidebar open = {open} handleToggleMenu = {handleToggleMenu}/>
            {open && <div className="overlay" onClick={handleToggleMenu}></div>}


            <Outlet />
        </>
    )
}