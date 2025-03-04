import axios from 'axios'
import { requests } from '../api_urls'
import { ObjectCount } from '../interfaces'

/**
 * 
 * @param access_token 
 * @param scan_id 
 * @returns 
 */
export async function getGroupedDetectedObjectCounts(access_token: string, scan_id: number): Promise<ObjectCount | null> {
    try {
        const response = await axios.get(requests.getGroupedDetectedObjectCountsUrl(scan_id),
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        const detected_object_count = response.data as ObjectCount;

        // Remove IDs with 0 occurrences
        const filtered_detected_object_count: ObjectCount = {};
        for (const id in detected_object_count) {
            if (detected_object_count[id] !== 0) {
                filtered_detected_object_count[id] = detected_object_count[id];
            }
        }

        return filtered_detected_object_count;
        
    } catch (error) {
        console.error('Error fetching detected object count:', error);
        return null;
    }
}

