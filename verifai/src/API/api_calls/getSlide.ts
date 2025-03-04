import axios from 'axios'
import { requests } from '../api_urls'
import { Slide } from '../interfaces'

/**
 * 
 * @param access_token 
 * @param study_id The id of a scan to retrieve slides from
 * @returns Metadata of all scans from a study
 */
async function getSlides(access_token: string, study_id: number): Promise<Slide[] | null> {
    try {
        const response = await axios.get(
            requests.getSlidesUrl(study_id),
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const list_of_slides: Slide[] = response.data;

        return list_of_slides;
    } catch (error) {
        console.error('Error fetching slides:', error);
        return null;
    }
}

export default getSlides;
