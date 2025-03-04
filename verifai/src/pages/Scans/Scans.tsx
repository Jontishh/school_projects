import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// CSS
import './Scans.css';

// API
import { getScans } from '../../API/api_calls/getScans';
import { Scan } from '../../API/interfaces';

// Components
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';

// Context
import { useAuth } from '../../contexts/auth-context';

const Studies = () => {
    const [scans, setScans] = useState<Scan[]>([]);
    const [loading, setLoading] = useState(true);
    const { studyId } = useParams();
    const { accessToken } = useAuth();

    useEffect(() => {
        const fetchScans = async () => {
            try {
                if (!accessToken) {
                    throw new Error('Scans: Invalid token');
                }

                if (!studyId) {
                    throw new Error('Scans: Invalid study id')
                }

                const studyIdNum = parseInt(studyId);

                const scansData = await getScans({
                    access_token: accessToken.access_token,
                    study_id: studyIdNum
                });

                if (scansData) {
                    setScans(scansData.filter(scan => scan.slide_code !== null && scan.scan_date !== null));
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching scans:', error);
            }
        };
        fetchScans();
    }, [studyId, accessToken]);

    return (
        <div className="main-container">
            <p className='title'>Scans from study {studyId}</p>
            <div className="scan-row header-row">
                <div className="scan-info">
                    <div className="scan-info-header">Slide Code</div>
                    <div className="status-header">Status</div>
                    <div className="scan-info-header">Scan Date</div>
                </div>
            </div>
            {loading ? (<LoadingScreen />) : (
                scans.map((scan) => (
                    <div key={scan.scan_id} className="scan-row">
                        <div className="scan-info">
                            <div className="scan-name">{scan.slide_code || 'null'}</div>
                            <div
                                className="status-circle"
                                style={{ backgroundColor: scan.scan_complete ? 'green' : 'red' }}
                            ></div>
                            <div className="scan-date">{scan.scan_date || 'null'}</div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Studies;
