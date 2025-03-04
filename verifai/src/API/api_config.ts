import { CLOUD_BASE_URL, LOCAL_BASE_URL } from '../config'

const HOSTNAME_STORAGE_KEY = 'selected_hostname';

let isConnectedToLocalNetwork = false;
let currentHostname: string = localStorage.getItem(HOSTNAME_STORAGE_KEY) || 'cloud';

/**
 * Set the base URL for Enaiblers API calls
 * 
 * @param hostname 
 */
export function setHost(hostname: 'local' | 'cloud') {
    if (hostname === 'local') {
        isConnectedToLocalNetwork = true;
        currentHostname = 'local';
    } else {
        isConnectedToLocalNetwork = false;
        currentHostname = 'cloud';
    }

    localStorage.setItem(HOSTNAME_STORAGE_KEY, currentHostname);
}

/**
 * Set the base URL for Enaiblers API calls
 * 
 * @param hostname 
 */
export function getHost() {
    return localStorage.getItem(HOSTNAME_STORAGE_KEY);
}

/**
 * @returns The currently selected API base URL
 */
export function getBaseURL() {
    if (isConnectedToLocalNetwork === true) {
        console.log('Device is connected to the local network.');
        return LOCAL_BASE_URL;
    } else {
        console.log('Device is not connected to the local network.');
        return CLOUD_BASE_URL;
    }
}

export function getCurrentHostname() {
    return currentHostname;
}