import axios from 'axios'
import { requests } from '../api_urls'
import { UserInDb } from '../interfaces'

/**
 * 
 * @param access_token 
 * @returns User info
 */

export async function readUsersMe(access_token: string): Promise<UserInDb | null> {
    try {
        const response = await axios.get(
            requests.readUsersMeUrl(),
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                responseType: 'json'
            }
        );

        const user: UserInDb = response.data;

        return user;

    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}