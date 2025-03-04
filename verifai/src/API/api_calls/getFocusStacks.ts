import axios from 'axios'
import { requests } from '../api_urls';
import { FocusStack } from '../interfaces';


export async function getFocusStacks(access_token: string): Promise<FocusStack[] | null> {
    try {
        const response = await axios.get(
            requests.getFocusStacksUrl(),
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const focus_stacks: FocusStack[] = response.data;
        return focus_stacks;
    } catch (error) {
        console.error('Error fetching focus stacks:', error);
        return null;
    }
}
