import { useState, useEffect } from 'react';

import './NetworkStatusWarning.css'

interface NetworkStatusWarningProps {
  warningText: string;
}

const NetworkStatusWarning: React.FC<NetworkStatusWarningProps> = ({ warningText }) => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      { !isOnline && <p className='warning'>{warningText}</p> }
    </>
  );
};

export default NetworkStatusWarning;
