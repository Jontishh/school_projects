import axios from 'axios'
import { requests } from '../api_urls'
import { User } from '../interfaces'

/**
 * 
 * @params
 * @returns A list of users registered on the server
 */

export async function getUsers(
    params: {
        access_token: string,
        role_id: number,
        is_active: boolean
        email_hash?: boolean,
    }
): Promise<User[] | null> {
    try {
        const response = await axios.get(
            requests.getUsersUrl(),
            {
                headers: {
                    Authorization: `Bearer ${params.access_token}`,
                },
                params: {
                    role_id:    params.role_id    ? params.role_id    : 3,
                    email_hash: params.email_hash ? params.email_hash : undefined,
                    is_active:  params.is_active  ? params.is_active  : true,
                },
                responseType: 'json'
            }
        );

        const list_of_users: User[] = response.data;

        return list_of_users;

    } catch (error) {
        console.error('Error fetching studies:', error);
        return null;
    }
}
