import axios from 'axios'
import { requests } from '../API/api_urls'
import { getImage } from '../API/api_calls/getImage';
import { getGroupedDetectedObjectCounts } from '../API/api_calls/getGroupedDetectedObjectCounts';
import { getDetectedObjects } from '../API/api_calls/getDetectedObjects';
import { createObjectVerifications } from '../API/api_calls/createObjectVerifications';
// import { FocusStackImage, ObjectCount, ObjectVerificationInput, Scan, Object } from './API/interfaces'
import { FocusStackImage, ObjectCount, ObjectVerificationInput, Object } from '../API/interfaces'
import { generateCodeVerifier, generateUniqueState, sha256 } from './crypto_utils';
import { getBaseURL } from '../API/api_config';


/**
 * 
 * @param access_token 
 * @param user_id
 * @param object The object to be verified
 * @param type_id Optional. If not provided, the AI-detected type will automatically be confirmed
 * @returns Boolean value indication success
 */
export async function submitObjectVerification(access_token: string, object: Object, user_id: number, type_id?: number) {
    const verification: ObjectVerificationInput = objectToObjectVerification(object, user_id);

    if (type_id) {
        verification.object_type_id = type_id;
        
    }

    const success: boolean = await createObjectVerifications(access_token, [verification])

    return success;
}


/**
 * @param access_token
 * @param focus_stack_id
 * @return A list containing all image ids for the images in the focus stack
 */
async function extractImageIdsFromFocusStack(access_token: string, focus_stack_id: number): Promise<number[] | null> {
    try {
        const response = await axios.get(
            requests.getImagesForFocusStackUrl(focus_stack_id),
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const focusStackImages: FocusStackImage[] = response.data;

        let image_ids: number[] = [];
        for (const image of focusStackImages) {
            image_ids.push(image.image_id);
        }

        return image_ids;
    } catch (error) {
        console.error('Error fetching focus stack image IDs:', error);
        return null;
    }
}

/**
 * @param access_token
 * @param image_ids A list of image ids
 * @return A list of image urls
 */
async function getImages(access_token: string, image_ids: number[]): Promise<string[] | null> {
    const image_urls: string[] = [];
    for (let id of image_ids) {
        let image: string | null = await getImage(access_token, id);

        if (image !== null) {
            image_urls.push(image);
        }
    }
    return Promise.all(image_urls);
}

/**
 * 
 * @param objects 
 * @returns A list of image IDs for all objects in objects
 */
function extractImageIDsFromObjects(objects: Object[]): number[] {
    const image_ids: number[] = [];
    for (const object of objects) {
        image_ids.push(object.image_id);
    }
    return image_ids;
}

/**
 * 
 * @param access_token 
 * @param objects 
 * @returns A list of images for the objects in a list of objects
 */
export async function getImageURLsForObjects(access_token: string, objects: Object[]): Promise<string[] | null> {
    const image_ids = extractImageIDsFromObjects(objects);

    const image_urls = await getImages(access_token, image_ids)

    return image_urls;
}

/**
 * 
 * @param access_token 
 * @param focus_stack_id 
 * @returns A list of URLs for the focus stack images
 */
export async function getFocusStackImages(access_token: string, focus_stack_id: number): Promise<string[] | null> {
    const image_ids = await extractImageIdsFromFocusStack(access_token, focus_stack_id);

    if (image_ids === null) { console.log("Error extracting image IDs"); return null }

    const images = await getImages(access_token, image_ids);

    if (images === null) { console.log("Error getting focus stack images"); return null }

    return images;
}

/**
 * Create a default ObjectVerificationInput object based on a AI-detected object
 * 
 * @param object DetectedObject
 * @param user_id 
 * @returns A default verification object based on `object`
 */
export function objectToObjectVerification(object: Object, user_id: number): ObjectVerificationInput {
    return {
        x_min: object.x_min, // minimum: 0
        y_min: object.y_min, // minimum: o
        x_max: object.x_max,
        y_max: object.y_max,
        object_id: object.object_id, // exclusiveMinimum: 0
        user_id: user_id,
        object_type_id: object.detected_object_type_id,
        is_conflict_resolution: false, // default: false
        verification_type: 1, // 1 - Human Verification
        // uuid?: string,
        // add_date?: string
    }
}


/**
 * 
 * @param object_list 
 * @param user_id 
 * @returns A list of ObjectVerificationInput objects corresponding to a nested list of Objects
 */
/* function scanObjectsToScanVerifications(object_list: Object[][], user_id: number) : ObjectVerificationInput[][] {

    const object_verifications_list: ObjectVerificationInput[][]= []

    for (const list of object_list) {
        const verification_list: ObjectVerificationInput[] = list.map(object => {
            return objectToObjectVerification(object, user_id)
        })
        object_verifications_list.push(verification_list);

    return object_verifications_list;
}

/**
 * For every scan in a list, get the GroupedDetectedObjectCounts for the scan
 * 
 * @param access_token 
 * @param scans 
 * @returns A list of GroupedDetectedObjectCounts
 */
/* async function getMultipleGroupedDetectedObjectCounts(access_token: string, scans: Scan[]): Promise<ObjectCount[] | null> {
    const object_type_counts: ObjectCount[] = []

    if (scans) {
        for (const scan of scans) {
            const object_count: ObjectCount | null = await getGroupedDetectedObjectCounts(access_token!, scan.scan_id)
            if (object_count) {
                object_type_counts.push(object_count);
            }
        }
    } else {
        console.log("No scans in study");
        return null;
    }

    return object_type_counts;
} */


/**
 * Given a scan, creates a list of Object-list - each containing only one type of objects
 * 
 * @param access_token 
 * @param scan_id 
 * @param scan_object_types 
 * @returns 
 */
/* async function divideScanObjectsAccordingToType(access_token: string, scan_id: number, scan_object_types: ObjectCount) {
    const scan_objects: Object[][] = [];
    const types = Object.keys(scan_object_types).map(Number);

    for (const type_id of types) {
        if (Object.prototype.hasOwnProperty.call(scan_object_types, type_id)) {

            const type_list: Object[] | null = await getDetectedObjects(
                {
                    access_token: access_token!,
                    scan_id: scan_id,
                    object_type_id: type_id,
                    include_verified: true,
                    grouped_detected_objects: true
                }
            );

            if (type_list && type_list.length > 0) {
                scan_objects.push(type_list)
            }
        } else {
            console.log("Error in divideScanObjectsAccordingToType");
        }
    }
    return scan_objects;
} */


/**
 * 
 * @param type_id Object type id
 * @returns Thresholds for infection levels of that object type
 */
function getThreshold(type_id: number) {
    const threshold: {[key: number]: {lm: number, mh: number}} = {
      21: {lm: 83, mh: 167},    // hookworm
      22: {lm: 208, mh: 2083},  // ascaris
      23: {lm: 4, mh: 17},      // schistosoma
      24: {lm: 42, mh: 417},    // trichuris
      /// Temp values
      18: {lm: 0, mh: 0},   // taenia
      19: {lm: 0, mh: 0},   // hymenolepis
      20: {lm: 0, mh: 0},   // fasciola
      32: {lm: 0, mh: 0},   // Not an egg
      33: {lm: 0, mh: 0},   // Not an egg
      35: {lm: 0, mh: 0}    // E. vermicularis
    }

    // Check if the typeId exists in the thresholds object
    if (type_id in threshold){
      return threshold[type_id];
    } else {
        console.error(`getThresholds: Thresholds for type ID ${type_id} not found.`);
        return  null;
    }
}

/**
 * 
 * @param listOfObjects A list of detected objects
 * @param groupedDetectedObjectCounts A list of unique object types and their respective occurences
 * @returns A list of objects, sorted by object types
 */
function splitObjectsByType(listOfObjects: Object[], groupedDetectedObjectCounts: ObjectCount): { [typeId: number]: Object[] } {
    const objectsByType: { [typeId: number]: Object[] } = {};

    // Iterate over the unique type IDs from groupedDetectedObjectCounts
    for (const typeIdStr in groupedDetectedObjectCounts) {
        const typeId = parseInt(typeIdStr);

        // Initialize an array for the type ID if it doesn't exist
        if (!(typeId in objectsByType)) {
            objectsByType[typeId] = [];
        }

        // Filter objects that match the current type ID
        const objectsOfType = listOfObjects.filter(obj => obj.detected_object_type_id === typeId);

        // Add filtered objects to the corresponding array
        objectsByType[typeId].push(...objectsOfType);
    }

    return objectsByType;
}

/**
 * Tes: När man nekar en verifiering så försvinner den från listan med metaclass_id: 1
 * 
 * Eventuell lösning: * Lagra listan lokalt och hämta därifrån om den är lagrad.
 *                    * Upplysa användaren om att en okomplett scan ej sparar "progress"
 * 
 * Problem: Hur kollar vi vilka färger (grön, röd, gul) som objekten har, hur lagras dom?
 * 
 * Side note: Service Workern borde lagra original listan med all objekt men utan någon verifikations id.
 *            
 * 
 * @param access_token 
 * @param scan_id The id of the scan to process
 * @returns A list of objects of interest to be displayed, sorted by type
 */
export async function processScan(access_token: string, scan_id: number): Promise<{ [typeId: number]: Object[] } | null> {
    const listOfInterestingObjects: { [typeId: number]: Object[] } = {};

    try {

        // Returns a list of all objects from a scan
        const listOfObjects: Object[] | null = await getDetectedObjects({
            access_token: access_token,
            scan_id: scan_id,
            // metaclass_id: 1,
            include_verified: true,
            grouped_detected_objects: true
        });

        // If there are no detected objects in the scan, return null.
        if (!listOfObjects) { throw new Error('Failed to fetch detected objects'); }
        
    //     let listOfObjects: Object[] = listOfObjects1.map(object => {
    //         return {...object, isLastOfType: false};   
    //    });

        // Returns a object count of each unique type id
        const groupedDetectedObjectCounts: ObjectCount | null = await getGroupedDetectedObjectCounts(access_token, scan_id);

        if (!groupedDetectedObjectCounts) { throw new Error('Failed to fetch object count'); }

        // Returns seperate lists of objects by type id
        const listOfObjectsByType = splitObjectsByType(listOfObjects, groupedDetectedObjectCounts);

        // For each unique type id
        for (const typeIdStr in listOfObjectsByType) {
            const typeId = parseInt(typeIdStr);

            // Objects of one object type
            const objectsOfType = listOfObjectsByType[typeId];
            // Count of one object type
            const countOfType = groupedDetectedObjectCounts[typeId];

            // Special case for type_id: 23 - Retrieve the first 27 images
            if (typeId === 23) {

                const startIndex = 0;
                const endIndex = Math.min(27, objectsOfType.length);
                listOfInterestingObjects[typeId] = objectsOfType.slice(startIndex, endIndex);

            } else {

                // Get thresholds for current object type
                const thresholds = getThreshold(typeId);

                if (!thresholds) { throw new Error('Failed to fetch thresholds'); }

                // Retrieve the intial 9 objects of interest
                var startIndex = 0;
                var endIndex = Math.min(objectsOfType.length, 9)
                const initialNineObjects: Object[] = objectsOfType.slice(startIndex, endIndex);
                listOfInterestingObjects[typeId] = initialNineObjects;

                if (countOfType >= thresholds.mh + 4) {

                    // Move pointer by -5 for edgecase
                    if (countOfType === thresholds.mh) {
                        thresholds.mh = thresholds.mh - 5;
                    }

                    startIndex = thresholds.mh - 4;
                    endIndex = thresholds.mh + 4;

                    const objectsAtHeavyThreshold: Object[] = objectsOfType.slice(startIndex, endIndex+1);
                    
                   
                    listOfInterestingObjects[typeId].push(...objectsAtHeavyThreshold);
                   
                

                }

                // // Check if the count of a type fulfills thresholds
                if (countOfType >= thresholds.lm + 4) {

                    // Move pointer by -5 for edgecase
                    if (countOfType === thresholds.lm) {
                        thresholds.lm = thresholds.lm - 5;
                    }

                    startIndex = thresholds.lm - 4;
                    endIndex = thresholds.lm + 4;

                    
                    const objectsAtModerateThreshold: Object[] = objectsOfType.slice(startIndex, endIndex+1);
                    listOfInterestingObjects[typeId].push(...objectsAtModerateThreshold);
                    
                    
                }
            }
      
        //     const listO: Object[] = objectsAtHeavyThreshold.map(object => {
        //         if(object.object_id === objectsAtHeavyThreshold[-1].object_id){
        //             return {...object, isLastOfType: true};
        //         }
        //         else{
        //             return{...object};
        //         }
        //    });        
           listOfInterestingObjects[typeId] =  listOfInterestingObjects[typeId].map((object, index )=>{
            if(index === listOfInterestingObjects[typeId].length -1){
                return{...object, isLastOfType:true}
            }else{
                return{...object, isLastOfType:false}
            }
           });
        //    console.log('LAST' +listOfInterestingObjects[typeId][1].isLastOfType)
        //    listOfInterestingObjects[typeId][-1].isLastOfType = true;

        }
      
        return listOfInterestingObjects;

    } catch (error) {
        console.log('Failed to process scan: ', error);

        return null;
    }
}


/**
 * Removes images from the cache
 * 
 * @param image_ids
 * @returns False if any operation fails, otherwise true
 */
export async function clearCacheImages(image_ids: number[]): Promise<boolean> {
    const cacheName: string = 'enaiblers-api-cache';

    try {
        // Get the cache instance
        const cache = await caches.open(cacheName);

        let allSuccessful = true;

        for (const image_id of image_ids) {
            // Delete the cache entry for the specified URL
            const success: boolean = await cache.delete(requests.getImageUrl(image_id));

            if (success) {
                console.log('Cache entry deleted:', `api/images/${image_id}`);
            } else {
                console.log("FAILED TO DELETE CACHE ENTRY! image id: ", image_id);
                allSuccessful = false;
            }
        }

        return allSuccessful;
        
    } catch (error) {
        console.error('Error deleting cache entry:', error);
        return false;
    }
}

/**
 * Removes images from the cache for a list of objects
 * 
 * @param objects 
 */
export async function clearCacheImagesByObjects(objects: Object[]): Promise<boolean> {
    const image_ids: number[] = extractImageIDsFromObjects(objects)

    const success: boolean = await clearCacheImages(image_ids)

    return success
}

/**
 * Delete the Enaiblers data cache
 */
export async function deleteCache(cacheName: string) {
    try {
        const success = await caches.delete(cacheName)

        if(success) {
            console.log("Deleted ", cacheName)
        } else {
            throw new Error(`Failed to delete ${cacheName}`)
        }
        
    } catch (error) {
        console.error('Error deleting cache entry: ', error);
    }
}

/**
 * Replace any characters that are not URL-safe
 * 
 * @param url 
 * @returns URL-safe encoding of url
 */
export const urlSafeEncoding = (url: string) => {
    return url.replace(/\+/g, '-')
              .replace(/\//g, '_')
              .replace(/=/g, '');
  }

/**
 * Generates a code verifier, code challenge and state string. Then stores the code verifier
 * and state in session storage to be accessed when requesting an access token using the 
 * authentication code returned after successfully completing the authentication stage of the PKCE flow.
 * 
 * Returns the URL, including all the parameters, of the the external authentication page
 * 
 * Will redirect back to the http://localhost:3000/Connect path
 * 
 * @sideeffects Stores the code verifier and state in session storage
 * @returns The URL, with parameters, for the external login page
 */
export const getExternalAuthenticationUrl = async () => {
  const code_verifier = await generateCodeVerifier()
  const code_challenge = await sha256(code_verifier);
  const state = generateUniqueState();

  sessionStorage.setItem('codeVerifier', code_verifier);
  sessionStorage.setItem('generatedState', state);

  let redirectUri = 'http%3A%2F%2Flocalhost%3A3000/Connect';
  const baseURL = getBaseURL();

  return `${baseURL}/auth/external?redirect_uri=${redirectUri}&state=${state}&code_challenge=${code_challenge}&code_challenge_method=S256&client_id=0&response_type=code`;
}