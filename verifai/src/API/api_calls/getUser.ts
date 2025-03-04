import axios from 'axios'
import { requests } from '../api_urls'
import { UserInDb } from '../interfaces'

/**
 * 
 * @param access_token 
 * @returns A list of users registered on the server
 */

export async function getUser(access_token: string, user_id: number): Promise<UserInDb | null> {
    try {
        const response = await axios.get(
            requests.getUserUrl(user_id),
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
