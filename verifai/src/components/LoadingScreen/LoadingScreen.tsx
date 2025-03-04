import './LoadingScreen.css';

import loadingWheel from '../../assets/loading_wheel.png'

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <img src={loadingWheel} alt="Loading" className='rotate' />
    </div>
  );
};

export default LoadingScreen;
