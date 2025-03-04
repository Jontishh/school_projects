import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Welcome.css';

import { getUsers } from '../../API/api_calls/getUsers';
import { Token, User } from '../../API/interfaces';
import { getUser } from '../../API/api_calls/getUser';

import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import DropdownMenu from '../../components/DropdownMenu/DropdownMenu';

import { useAuth } from '../../contexts/auth-context';

const Welcome: React.FC = () => {
    const [users, setUsers] = useState<User[] | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { login } = useAuth();
    const tempToken: Token = JSON.parse(sessionStorage.getItem('tempToken') || 'null');
    const navigate = useNavigate();

    useEffect(() => {
        if (!tempToken) {
            throw new Error('Welcome: Invalid accessToken')
        }

        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getUsers({
                    access_token: tempToken.access_token,
                    role_id: 3,
                    is_active: true
                });
                setUsers(fetchedUsers);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Render loading state
    }

    if (!users) {
        throw new Error('Welcome: Invalid list of users')
    }

    const handleConfirm = () => {
        if(tempToken && userId) {
            getUser(tempToken.access_token, userId)
                .then((user) => {
                    if(user) {
                        login(user, tempToken);
                        navigate('/Studies')
                    } else {
                        console.log("Welcome: Failed to replace user")
                    }
                })
        }
    }

    return (
        <div className="welcomeWrapper">
            <div className="welcomeText">
                <h1>Welcome!</h1>
                <h3>
                    The computer has now done its job! Now it's time for you to step in and show how it's done. Time to verify
                    some samples!
                </h3>
            </div>
            <div>
                <h3 className="welcomeText" style={{ fontWeight: 500, fontSize: 19 }}>
                    Who are you?
                </h3>
                    <div id="dropDown">
                        <DropdownMenu users={users} setSelectedId={setUserId}/>
                    </div>
            </div>
        
            <div className="bottomDiv">
                {userId ? 
                <PrimaryButton text="Select Study" onClick={handleConfirm}/>
                : <PrimaryButton text="Select Study" onClick={handleConfirm} disabled={true} />}
                <a>Admin login</a>
            </div>
        </div>
    );
};

export default Welcome;
