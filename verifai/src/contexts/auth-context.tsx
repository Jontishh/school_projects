import { createContext, useContext, useEffect, useState } from 'react';
import { UserInDb, Token } from '../API/interfaces';
import { getToken, getTokenProps } from '../API/api_calls/getToken';
import { getHost } from '../API/api_config';
import { deleteCache } from '../utils/utils';
import { LOCAL_USERNAME, LOCAL_PASSWORD, CACHE_NAME } from '../config';

let intervalId: NodeJS.Timeout;

interface AuthContextType {
    isLoggedIn: boolean;
    user: UserInDb | null;
    accessToken: Token | null;
    login: (userData: UserInDb, accessToken: Token) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    user: null,
    accessToken: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => sessionStorage.getItem('isLoggedIn') === 'true'
  );
  const [user, setUser] = useState<UserInDb | null>(
    () => JSON.parse(sessionStorage.getItem('user') || 'null')
  );
  const [accessToken, setAccessToken] = useState<Token | null>(
    () => JSON.parse(sessionStorage.getItem('accessToken') || 'null')
  );

  const login = (userData: UserInDb, token: Token) => {
    if(token) {
        setUser(userData);
        setIsLoggedIn(true);
        setAccessToken(token);
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('accessToken', JSON.stringify(token));
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setAccessToken(null)
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('tempToken');
    deleteCache(CACHE_NAME);
  };

  const authContextValue = {
    isLoggedIn,
    user,
    accessToken,
    login,
    logout,
  };

  // This hook will run every time the accessToken is updated
  // and sets a timer for refreshing the access token
  useEffect(() => {
    const refreshToken = () => {
      if (accessToken) {
        let refresh_params: getTokenProps;

        if(accessToken.refresh_token && getHost() === 'cloud') {
          console.log("GET HOST === CLOUD")
          refresh_params = {
            client_id: '0',
            refresh_token: accessToken.refresh_token,
            grant_type: 'refresh_token'
          }
        } else if (getHost() === 'local') {
          console.log("GET HOST === LOCAL")
          refresh_params = {
            username: LOCAL_USERNAME,
            password: LOCAL_PASSWORD
          }
        } else {
          throw new Error("Access token type incompatible with network setting")
        }

        console.log("FETCHING NEW TOKEN")
        getToken(refresh_params)
          .then((newToken) => {
            setAccessToken(newToken);
            sessionStorage.setItem('accessToken', JSON.stringify(newToken));
          })
          .catch((error) => {
            console.error('Error refreshing token:', error);
            // Handle error, possibly logout user
            logout();
          });
      }
    };

    clearInterval(intervalId);
    if(isLoggedIn) {
      // intervalId = setTimeout(refreshToken, 10 * 1000); // 10 seconds for testing
      intervalId = setTimeout(refreshToken, 15 * 60 * 1000); // 15 min for production
    };
  }, [accessToken]);


  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext
export const useAuth = () => useContext(AuthContext);
