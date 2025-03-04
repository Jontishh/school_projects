export interface Device {
    serial: string;
    hardware_version_id: number;
    software_version_id: number | null;
    manufacturing_date: string | null;
    next_service: string | null;
    id: number;
}

export interface FocusStack {
    id: number;
    grid_x: number;
    grid_y: number;
    pos_x: number;
    pos_y: number;
    scan_id: number;
    slide_code: string | null;
    is_verified: boolean;
    is_verified_by_user: boolean | null;
    total_object_count: number | null;
    ground_truth_object_count: number | null;
    image_count: number | null;
}

export interface FocusStackImage {
    image_id: number,
    focus_value: number,
    focus_height: number
}

export interface User {
    id: number,
    name: string
}

export interface UserInDb {
    id: number;
    name: string;
    email: string | null;
    score: number;
    is_active: boolean;
    is_superuser: boolean;
    role_id: number[];
}

export interface Scan {
    scan_id: number,
    uuid: string,
    slide_code: string,
    notes: string | null,
    scan_date: string,
    verified_object_count: number | null,
    total_object_count: number | null,
    ground_truth_object_count: number | null,
    scan_complete: boolean | null,
    inference_complete: boolean | null,
    grouping_complete: boolean | null,
    detection_grouping_complete: boolean | null
}

export interface Study {
    id: number,
    name: string,
    uuid: string
}

export interface Slide {
    code: string,
    slide_suffix: string | null,
    study_id: number,
    notes: string | null,
    id: number
}

export interface ObjectType {
    id: number,
    metaclass_id: number,
    name: string | null,
    description: string | null
}

export interface Object {
    x_min: number,
    y_min: number,
    x_max: number,
    y_max: number,
    object_id: number,
    confidence: number,
    focus_stack_id: number,
    image_id: number,
    detected_object_type_id: number,
    verified_object_type_id: number | null,
    verification_id: number | null,
    isLastOfType?: boolean
}

export interface ExtendedObject{
    x_min: number,
    y_min: number,
    x_max: number,
    y_max: number,
    object_id: number,
    confidence: number,
    focus_stack_id: number,
    image_id: number,
    detected_object_type_id: number,
    verified_object_type_id: number | null,
    verification_id: number | null,
    isLastOfType?: boolean,
    id: number, 
    color: string,
    last: string | null


}


export interface ObjectCount {
    [id: number]: number;
}

export interface Token {
    access_token: string;
    token_type: string;
    expires_in?: number;
    scope?: string;
    refresh_token?: string;
    refresh_token_expires_in?: number;
}

// INPUT INTERFACES

export interface DetectedObjectInput {
    x_min: number,
    y_min: number,
    x_max: number,
    y_max: number,
    object_type_id: number,
    confidence: number,
    focus_stack_id: number,
    image_id: number | string,
    scan_id: number,
    labler_id: number | null,
    pipeline_id: number | null,
    uuid: string | null
}

export interface FocusStackVerificationExplicitInput {
    user_id: number, // exclusive minimum: 0
    uuid: string | null,
    scan_id: number, // exclusiveMinimum: 0
    grid_x: number, // minimum: 0
    grid_y: number, // minimum: 0
}

export interface FocusStackVerificationInput {
    focus_stack_id: number | null, // exclusive minimum: 0
    user_id: number, // exclusive minimum: 0
}

export interface InfectionLevelInput {
    scan_id: number,
    infection_level: number,
    object_type_id: number,
    estimation_type_id: number
}

export interface ObjectVerificationInput {
    x_min: number, // minimum: 0
    y_min: number, // minimum: o
    x_max: number,
    y_max: number,
    object_id: string | number // exclusiveMinimum: 0
    user_id: number | null,
    object_type_id: number,
    is_conflict_resolution:	boolean, // default: false
    verification_type: number, // Default: 1
    uuid?: string,
    add_date?: string // date-time
    
}

// INPUT INTERFACES

export interface DetectedObjectInput {
    x_min: number,
    y_min: number,
    x_max: number,
    y_max: number,
    object_type_id: number,
    confidence: number,
    focus_stack_id: number,
    image_id: number | string,
    scan_id: number,
    labler_id: number | null,
    pipeline_id: number | null,
    uuid: string | null
}

export interface FocusStackVerificationExplicitInput {
    user_id: number, // exclusive minimum: 0
    uuid: string | null,
    scan_id: number, // exclusiveMinimum: 0
    grid_x: number, // minimum: 0
    grid_y: number, // minimum: 0
}

export interface FocusStackVerificationInput {
    focus_stack_id: number | null, // exclusive minimum: 0
    user_id: number, // exclusive minimum: 0
}

export interface InfectionLevelInput {
    scan_id: number,
    infection_level: number,
    object_type_id: number,
    estimation_type_id: number
}

export interface ObjectVerificationInput {
    x_min: number, // minimum: 0
    y_min: number, // minimum: o
    x_max: number,
    y_max: number,
    object_id: string | number // exclusiveMinimum: 0
    user_id: number | null,
    object_type_id: number,
    is_conflict_resolution:	boolean, // default: false
    verification_type: number, // Default: 1
    uuid?: string, // Can be null
    //uuid: string | null, // Can be null
    add_date?: string // date-time
}

export interface InfectionLevel {
    scan_id: number,
    add_date: string,
    infection_level: number,
    estimation_type_id: number,
    change_date: string,
    id: number,
    object_type_id: number
}
