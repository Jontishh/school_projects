import { useState, useEffect } from 'react';

import '../components.css';

import ListButton from '../ListButton/ListButton.tsx';
import LoadingScreen from '../LoadingScreen/LoadingScreen.tsx';

import { Study } from '../../API/interfaces.ts';
import { getStudies } from '../../API/api_calls/getStudies.ts';

import { useAuth } from '../../contexts/auth-context.tsx';

interface Props {
  onSelectStudy: (studyId: number) => void;
  searchQuery: string;
}

function ListOfListButtons({ onSelectStudy, searchQuery }: Props) {
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null);
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();

  const filteredStudies = studies.filter(study =>
    study.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  useEffect(() => {
    async function fetchStudies() {
      try {
        if (!accessToken) {
          throw new Error('ListOfListButtons: Invalid token');
        }
        const studiesData = await getStudies(accessToken.access_token);

        if (studiesData) {
          setStudies(studiesData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching studies:', error);
      }
    }
    fetchStudies();
  }, [accessToken]);

  const handleSelectedStudy = (studyId: number, studyName: string) => {
    setSelectedStudy(studyName);
    onSelectStudy(studyId);
  };

  return (
    <>
      {loading ? ( <LoadingScreen />) : (
        <div className='scroll-view'>
          <div className='list-container'>
            {filteredStudies.map((study) => (
              <ListButton
                key={study.id.toString()}
                study_name={study.name}
                id={study.id}
                onClick={() => handleSelectedStudy(study.id, study.name)}
                isSelected={selectedStudy === study.name}
              />
            ))}
          </div>
        </div>
      )}
      
    </>
  );
}

export default ListOfListButtons;