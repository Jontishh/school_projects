import axios from 'axios'
import { requests } from '../api_urls'
import { Study } from '../interfaces'

/**
 * 
 * @param access_token 
 * @returns Metadata of all studies from the server
 */
export async function getStudies(access_token: string): Promise<Study[] | null> {
    try {
        const response = await axios.get(
            requests.getStudiesUrl(),
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const list_of_studies: Study[] = response.data;

        return list_of_studies;
    } catch (error) {
        console.error('Error fetching studies:', error);
        return null;
    }
}