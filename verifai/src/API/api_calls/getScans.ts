import axios from "axios";
import { requests } from "../api_urls";
import { Scan } from "../interfaces";

/**
 * 
 * @param param 
 * @returns Metadata for scans of a study
 */
export async function getScans(
    param: {
        access_token: string,
        study_id?: number,
        include?: 'ground_truth_object_count' | 'validated_object_count' | 'total_object_count',
        object_type_id?: number[],
        metaclass_id?: number[],
        pipeline_id?: number[],
        verification_user_id?: number[],
        only_with_objects?: boolean,
        group_objects?: boolean
    }
): Promise<Scan[] | null> {
    try {
        const response = await axios.get(
            requests.getScansUrl(),
            {
                headers: {
                    Authorization: `Bearer ${param.access_token}`,
                },
                params: {
                    study_id:               param.study_id ?                param.study_id : undefined,
                    include:                param.include ?                 param.include : undefined,
                    object_type_id:         param.object_type_id ?          param.object_type_id : undefined,
                    metaclass_id:           param.metaclass_id ?            param.metaclass_id : undefined,
                    pipeline_id:            param.pipeline_id ?             param.pipeline_id : undefined,
                    verification_user_id:   param.verification_user_id ?    param.verification_user_id : undefined,
                    only_with_objects:      param.only_with_objects ?       param.only_with_objects : false,
                    group_objects:          param.group_objects ?           param.group_objects : false
                },
                responseType: 'json'
            }
        );

        const scans: Scan[] = response.data;
        return scans;
    } catch (error) {
        console.error('Error fetching scans:', error);
        return null;
    }
}


/**
 * @param scans A list of scan objects
 * @returns A list of scan IDs
 */
export function extractScanIds(scans: Scan[] | null) : number[] | null {
    let scanIDs: number[] = [];
    if (scans) {
        scans.forEach((scan) => {
            scanIDs.push(scan.scan_id);
        })
        return scanIDs;
    }
    else {
        console.log("Empty list")
        return null;
    }
}