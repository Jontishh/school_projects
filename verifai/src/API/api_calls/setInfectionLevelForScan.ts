import axios from "axios";
import { requests } from "../api_urls";
import { InfectionLevelInput } from "../interfaces";

export async function setInfectionLevel(access_token: string, params: InfectionLevelInput) : Promise<boolean> {
    try {
        const response = await axios.post(
            requests.setInfectionLevelForScanUrl(),
            {
                scan_id:            params.scan_id,
                infection_level:    params.infection_level,
                object_type_id:     params.object_type_id,
                estimation_type_id: params.estimation_type_id
            },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(response);
        return true
    } catch (error) {
        console.error('Error setting infection level:', error);
        return false;
    }
}