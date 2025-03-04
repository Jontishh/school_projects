import axios from 'axios';
import { requests } from '../api_urls';
import { Object } from '../interfaces';

/**
 * @param param 
 * @returns Metadata of AI detected objects off a scan or focus stack
 */
export async function getDetectedObjects(
    param: {
        access_token: string,
        scan_id?: number,
        focus_stack_id?: number,
        object_type_id?: number,
        metaclass_id?: number,
        pipeline_id?: number,
        user_id?: number,
        include_verified?: boolean,
        grouped_verified_objects?: boolean,
        grouped_detected_objects?: boolean,
        ground_truth?: boolean,
    }
): Promise<Object[] | null> {
    try {
        const response = await axios.get(
            requests.getDetectedObjectsUrl(),
            {
                headers: {
                    Authorization: `Bearer ${param.access_token}`
                },
                params: {
                    scan_id:                    param.scan_id                   ? param.scan_id                   : undefined,
                    focus_stack_id:             param.focus_stack_id            ? param.focus_stack_id            : undefined,
                    object_type_id:             param.object_type_id            ? param.object_type_id            : undefined,
                    metaclass_id:               param.metaclass_id              ? param.metaclass_id              : undefined,
                    pipeline_id:                param.pipeline_id               ? param.pipeline_id               : undefined,
                    user_id:                    param.user_id                   ? param.user_id                   : undefined,
                    include_verified:           param.include_verified          ? param.include_verified          : true,
                    grouped_verified_objects:   param.grouped_verified_objects  ? param.grouped_verified_objects  : false,
                    grouped_detected_objects:   param.grouped_detected_objects  ? param.grouped_detected_objects  : false,
                    ground_truth:               param.ground_truth              ? param.ground_truth              : false
                },
                responseType: 'json'
            }
        )
        const detectedObjects: Object[] = response.data;
        return detectedObjects;
    } catch (error) {
        console.error('Error fetching objects:', error);
        return null;
    }
}

// Function to get only the coordinates of detected objects
export function getDetectedObjectCoordinates(objects: Object[]): { minX: number, minY: number, maxX: number, maxY: number }[] {
    // Extract coordinates from the objects
    return objects.map(obj => ({
        minX: obj.x_min,
        minY: obj.y_min,
        maxX: obj.x_max,
        maxY: obj.y_max
    }));
}

