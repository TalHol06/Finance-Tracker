import '@picocss/pico/css/pico.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faRightFromBracket, faMoon, faSun, faGear, faUser, faHouse } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/header.css';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Header() {
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(true);
    const [active, setActive] = useState(false);
    const [loggedIn, setLoggedIn] = useState(null);

    // Checks if the user is logged in
    const token = Cookies.get("token");
    useEffect(() => {
        if (!token){
            setLoggedIn(false);
        } else{
            setLoggedIn(true);
        }
    }, [token, loggedIn]);

    // Switches the theme between light and dark mode
    function switchMode(e) {
        e.stopPropagation(); // Prevents the arrow from switching if a child button is clicked
        setDarkMode((prev) => !prev);

        if (document.getElementById('html').getAttribute('data-theme') === 'dark') {
            document.getElementById('html').setAttribute('data-theme', 'light');
        } else {
            document.getElementById('html').setAttribute('data-theme', 'dark');
        }
    }

    async function logout(){
        axios.post('/api/user/logout')
        .then((response) => {
            console.log(response);
            navigate('/');
        })
        .catch((err) => {
            console.error(err);
        })
    }

    return (
        <header className='container-fluid' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ margin: '15px'}}>Budget Flow</h2>
            <div style={{ display: 'flex', justifyContent: 'left', width: '50%' }}>
                <FontAwesomeIcon icon={faUser} />
                <details className="dropdown" onClick={() => setActive((prev) => !prev)}>
                    <summary role="button" className="secondary">
                        {!active ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
                    </summary>
                    <ul style={{ alignItems: 'center' }}>
                        <li data-tooltip="Go to Home" data-placement="left" className="contrast" role="button" style={{ width: '90%' }} onClick={(e) => {e.stopPropagation(); navigate('/home')}}>
                        <FontAwesomeIcon icon={faHouse} /> Home
                        </li>
                        <li data-tooltip="Go to Settings" data-placement="left" className="contrast" role="button" style={{ width: '90%' }} onClick={(e) => {e.stopPropagation(); navigate('/settings')}}>
                            <FontAwesomeIcon icon={faGear} /> Settings
                        </li>
                        <li data-tooltip="Switch Theme" data-placement="left" className="contrast" role="button" style={{ width: '90%' }} onClick={switchMode}>
                            {darkMode ? (
                                <>
                                    <FontAwesomeIcon icon={faMoon} style={{ marginRight: '6px'}}/>
                                    Dark Mode
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faSun} style={{ marginRight: '10px'}}/>
                                    Light Mode
                                </>
                            )}
                        </li>
                        {loggedIn ?
                            <li data-tooltip="Log Out" data-placement="left" className="contrast" role='button' style={{ width: '90%' }} onClick={logout}>
                                <FontAwesomeIcon icon={faRightFromBracket} style={{ rotate: "180deg", marginRight: '5px', }} /> Log Out
                            </li>
                        :
                            <li data-tooltip="Log Out" data-placement="left" className="contrast" role='button' style={{ width: '90%' }} onClick={logout}>
                                <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '5px', }} /> Log In
                            </li>
                        }
                    </ul>
                </details>
            </div>
        </header>
    );
}
