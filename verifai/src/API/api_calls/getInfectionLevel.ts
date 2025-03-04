import axios from "axios";
import { requests } from "../api_urls";
import { InfectionLevel } from "../interfaces";

/**
 * 
 * @param param 
 * @returns Metadata for infection levels of a scan
 */
export async function getInfectionLevel( access_token: string, scan_id: number): Promise<InfectionLevel[] | null> {
    try {
        const response = await axios.get(
            requests.getStudyInfectionLevelsUrl(scan_id),
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                responseType: 'json'
            }
        );
        const infection_levels: InfectionLevel[] = response.data;
        return infection_levels;

    } catch (error) {
        console.error('Error fetching infection levels:', error);
        return null;
    }
}