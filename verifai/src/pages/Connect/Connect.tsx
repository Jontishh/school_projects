import { useState } from "react"
import { useNavigate } from 'react-router-dom';

import './Connect.css'

import { LOCAL_USERNAME, LOCAL_PASSWORD } from "../../config";

// API
import { setHost } from "../../API/api_config"
import { getBaseURL } from "../../API/api_config"
import { Token, UserInDb } from "../../API/interfaces"
import { readUsersMe } from "../../API/api_calls/readUsersMe"
import { getToken } from "../../API/api_calls/getToken"

// Components
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton"
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen"
import SecondaryButton from "../../components/SecondaryButton/SecondaryButton"

// Utils
import ErrorDisplay from "../../components/ErrorDisplay/ErrorDisplay";

// Context
import { useAuth } from "../../contexts/auth-context"
import { getExternalAuthenticationUrl } from "../../utils/utils";


// We return from Auth0 login page with parameters `code` and `state`
const url_params = new URLSearchParams(window.location.search)
let authentication_code = url_params.get('code')
let returned_state = url_params.get('state')


export default function Connect() {
    const [loading, setLoading] = useState(false);
    const [_, setSelectedButton] = useState<string | null>(null); // TODO: Replace _ with selectedButton

    const [errorTitle, setErrorTitle] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [error, setError] = useState<boolean>(false)

    let code_verifier: string | null = null;
    let generated_state: string | null = null;

    const navigate = useNavigate();

    const { login, isLoggedIn, accessToken } = useAuth();


    // Will run if we return from third party authorization
    const handleReturn = async () => {

        if (authentication_code && code_verifier && generated_state) {
            // Received state should match our generated state 
            if(generated_state === returned_state) {

                const token_params = {
                    client_id: '0',
                    code: authentication_code,
                    code_verifier: code_verifier,
                    redirect_uri: 'http://localhost:3000/Connect',
                    grant_type: 'authorization_code'
                }

                const new_token: Token | null = await getToken(token_params);

                if (new_token) {
                    const new_user: UserInDb | null = await readUsersMe(new_token.access_token);
                    if(new_user) {
                        login(new_user, new_token);
                    } else {
                        console.log("No such user found in database");
                    }
                } else {
                    throw new Error("Connect.tsx:handleReturn --- Failed to fetch new token")
                }
            } else {
                console.log("States don't match!")
            }
        }
        // Clear stored values from sessionStorage
        sessionStorage.removeItem('codeVerifier');
        sessionStorage.removeItem('generatedState');

        authentication_code = null;
        returned_state = null;

        navigate('/Studies')
    }

    // Are we directed to Connection page from Auth0?
    if(authentication_code && returned_state) {
        code_verifier = sessionStorage.getItem('codeVerifier')
        generated_state = sessionStorage.getItem('generatedState')
        // Use authorization code to get access token
        handleReturn();
    }
    
    const handleCloud = async () => {
        if(isLoggedIn && accessToken?.refresh_token) { // If there is a refresh token the user is logged in to the cloud server
            navigate('/Studies')
        } else {
            if(window.navigator.onLine) {
                setSelectedButton('cloud');
                setLoading(true);
                setHost('cloud');
                console.log("BASE URL: ", getBaseURL()); // For testing
    
                const path = await getExternalAuthenticationUrl();
    
                setLoading(false);
                
                window.location.replace(path)
            } else {
                setErrorTitle('Offline');
                setErrorMsg('Could not find a network connection')
                setError(true);
            }
        }
    };
    
    const handleLocal = async () => {
        setLoading(true);
        
        // Production
        setSelectedButton('local');
        setHost('local');

        // Testing - Uncomment the following two lines to connect to cloud server instead of a local device
        // setSelectedButton('cloud');
        // setHost('cloud');

        console.log("BASE URL: ", getBaseURL()); // For testing

        // Get a temporary token for accessing the users on a local device
        const new_token = await getToken({username: LOCAL_USERNAME, password: LOCAL_PASSWORD});

        if(new_token) {
            // Store the token so it can be access on the Welcome page
            sessionStorage.setItem('tempToken', JSON.stringify(new_token))
            navigate('/Welcome')
        } else {
            setErrorTitle('Error');
            setErrorMsg('Could not connect to local device');
            setError(true);
        }

        setLoading(false);
    };

    return (
        <>
            {loading ? (<LoadingScreen />) : (
                error ? <ErrorDisplay title={errorTitle} msg={errorMsg} unset={setError} /> :
                <div className='welcomeWrapper'>
                    <div className='welcomeText'>
                        <h1>Get connected</h1>
                        <h3>To proceed to the verification, you need to connect to the microscope through wifi where the samples will be found.</h3>
                    </div>

                    <div className='bottomDiv'>

                        <PrimaryButton
                            text="Connect to server"
                            onClick={() => handleCloud()}
                            disabled={false}

                        />

                        <SecondaryButton
                            text="Connect to local device"
                            onClick={() => handleLocal()}
                            disabled={false}
                        />

                        <a>Admin login</a>
                    </div>
                </div>
            )}
        </>
    )
}