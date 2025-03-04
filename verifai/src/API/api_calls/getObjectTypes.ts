import axios from 'axios'
import { requests } from '../api_urls'
import { ObjectType } from '../interfaces'

/**
 * 
 * @param access_token 
 * @returns Metadata of all object types that have been registered
 */
async function getObjectTypes(access_token: string): Promise<ObjectType[] | null> {
    try {
        const response = await axios.get(
            requests.getObjectTypesUrl(),
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const list_of_object_types: ObjectType[] = response.data;

        return list_of_object_types;
    } catch (error) {
        console.error('Error fetching object types:', error);
        return null;
    }
}

export default getObjectTypes;
