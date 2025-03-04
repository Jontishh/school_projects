import axios from "axios";
import { requests } from "../api_urls";
import { Device } from "../interfaces";

/**
 * 
 * @param access_token 
 * @returns Metadata about devices registered on the local- / cloud server
 */
export async function getDevices(access_token: string): Promise<Device[] | null> {
    try {
        const response = await axios.get(
            requests.getDevicesUrl(),
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        const devices: Device[] = response.data;
        return devices;
    } catch (error) {
        console.error('Error fetching devices:', error);
        return null;
    }
}