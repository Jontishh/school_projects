import { useState } from 'react';

import './Studies.css';
import searchicon from '../../assets/searchicon.svg';

import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import ListOfListButtons from '../../components/ListOfListButtons/ListOfListButtons';
import NetworkStatusWarning from '../../components/NetworkStatusWarning/NetworkStatusWarning';

import { useAuth } from '../../contexts/auth-context';

export default function Studies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudyId, setSelectedStudyId] = useState<number | null>(null);
  const { user } = useAuth();

  const handleSearchInputChange = (e: { target: { value: string; }; }) => {
    if (!e.target) {
      throw new Error('Invalid event')
    }
    setSearchQuery(e.target.value);
  };

  const handleSelectStudy = (studyId: number) => {
    setSelectedStudyId(studyId);
  };

  return (
    <div className='main-container'>
      <div className='title-search'>
        { user && <p className='title'>Hello {user?.name}</p> }
        {/* { !window.navigator.onLine && <p className='warning'>The application is offline. Only scans stored on your device will be available</p> } */}
        <NetworkStatusWarning warningText='The app is offline. Only scans stored on your device will be available' />
        <div className='search-container'>
          <input
            type='text'
            placeholder='Search'
            onChange={handleSearchInputChange}
            className='search-input'
          ></input>
          <img src={searchicon} alt='search Icon' className='search-icon' />
        </div>
        
        <div className='content-div'>
            <ListOfListButtons onSelectStudy={handleSelectStudy} searchQuery={searchQuery} />
        </div>
        
        <div className='bottom-div'>
          <PrimaryButton text='Confirm' 
          path={`/verify/${selectedStudyId}`} 
          disabled={selectedStudyId === null} 
          />
        </div>
      </div>
    </div>
  );
}