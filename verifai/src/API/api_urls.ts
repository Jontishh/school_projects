import { getBaseURL } from './api_config'

export var requests = {
    // Default
    readRootUrl: () => getBaseURL(),

    // Authentication
    externalLoginUrl: () => `${getBaseURL()}/auth/external`,
    getTokenUrl: () => `${getBaseURL()}/tokens`,

    // Detected Objects
    getObjectVerificationsUrl: () => `${getBaseURL()}/objects/verifications`,
    getDetectedObjectsUrl: () => `${getBaseURL()}/objects`,
    getObjectsWithConflictsUrl: () => `${getBaseURL()}/objects/conflicting-verifications`,
    createObjectVerificationsUrl: () => `${getBaseURL()}/objects/verifications`,
    
    // Devices
    getDevicesUrl: () => `${getBaseURL()}/devices`,

    // Focus Stacks
    getFocusStacksUrl: () => `${getBaseURL()}/focus-stacks`,
    getFocusStacksVerificationStatusUrl: () => `${getBaseURL()}/focus-stacks/verification-status`,
    getImagesForFocusStackUrl: (focus_stack_id: number) => `${getBaseURL()}/focus-stacks/${focus_stack_id}/images`,

    // Ground Truth
    getTrainingDateUrl: () => `${getBaseURL()}/ground-truth/training-data`,

    // Images
    getImageUrl: (imageId: number) => `${getBaseURL()}/images/${imageId}`,

    // Object Types
    getObjectTypesUrl: () => `${getBaseURL()}/object-types`,
    getMetaclassesUrl: () => `${getBaseURL()}/object-types/metaclasses`,

    // Pipelines
    getPipelinesUrl: () => `${getBaseURL()}/pipelines`,
    getPipelineModelsUrl: () => `${getBaseURL()}/pipelines/models`,

    // Scans
    getSlideImageUrl: (scanID: number) => `${getBaseURL()}/scans/${scanID}/slide-image`,
    getScansUrl: () => `${getBaseURL()}/studies/scans`,
    getScanImageHashUrl: (scanID: number) => `${getBaseURL()}/scans/${scanID}/images/hash`,
    getScanImageUuidsUrl: (scanID: number) => `${getBaseURL()}/scans/${scanID}/images/uuids`,
    getScanDetectedObjectHashUrl: (scanID: number) => `${getBaseURL()}/scans/${scanID}/detected-objects/hash`,
    getDetectedObjectUidsUrl: (scanID: number) => `${getBaseURL()}/scans/${scanID}/detected-objects/uuids`,
    getScanObjectVerificationsHashUrl: (scanID: number) => `${getBaseURL()}/scans/${scanID}/object-verification/hash`,
    getObjectVerificationUuidsUrl: (scanID: number) => `${getBaseURL()}/scans/${scanID}/object-verification/uuids`,
    getScanFocusStackVerificationsHashUrl: (scanID: number) => `${getBaseURL()}/scans/${scanID}/focus-stack-verification/hash`,
    getFocusStackVerificationUuidsUrl: (scanID: number) => `${getBaseURL()}/scans/${scanID}/focus-stack-verification/uuids`,
    getGroupedDetectedObjectCountsUrl: (scanID: number) => `${getBaseURL()}/scans/${scanID}/grouped-detect-object-counts`,
    getInfectionLevelUrl: (scanID: number) => `${getBaseURL()}/scans/${scanID}/infection_level`,
    getStudyInfectionLevelsUrl: (studyID: number) => `${getBaseURL()}/scans/${studyID}/infection_level`,

    setInfectionLevelForScanUrl: () => `${getBaseURL()}/scans/infection_level`,


    // Slides
    getSlidesUrl: (study_id: number) => `${getBaseURL()}/${study_id}`,
    
    // Studies
    getStudiesUrl: () => `${getBaseURL()}/studies`,
    getSummaryOfVerifiedObjectsUrl: (studyID: number) => `${getBaseURL()}/studies/${studyID}/summary`,
    getSummaryOfDetectedObjectsUrl: (studyID: number) => `${getBaseURL()}/studies/${studyID}/detected-objects-summary`,
    getVerifiedObjectGroupingStatusUrl: (studyID: number) => `${getBaseURL()}/studies/${studyID}/group-verified-objects/status`,
    GetDetectedObjectGroupingStatusUrl: (studyID: number) => `${getBaseURL()}/studies/${studyID}/group-detected-objects/status`,

    // Users
    readUsersMeUrl: () => `${getBaseURL()}/users/me`,
    getUsersUrl: () => `${getBaseURL()}/users`,
    getUserUrl: (userID: number) => `${getBaseURL()}/users/${userID}`,
    getRolesUrl: () => `${getBaseURL()}/roles`,
}