import { v4 as uuidv4 } from 'uuid';
import { urlSafeEncoding } from './utils';

export async function generateCodeVerifier() {
    // Generate a cryptographically random array of bytes
    const array = new Uint8Array(64);
    window.crypto.getRandomValues(array);
    
    // Convert Uint8Array to a regular array
    const byteArray = Array.from(array);
    
    // Encode the array as base64
    const base64String = btoa(String.fromCharCode.apply(null, byteArray));
    
    // Replace any characters that are not URL-safe
    const codeVerifier = urlSafeEncoding(base64String)
    
    return codeVerifier;
  }
  
  export async function sha256(message: string): Promise<string> {
    // Encode the message as UTF-8
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    // Generate the SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert the hash buffer to a base64-encoded string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(hashArray.map(byte => String.fromCharCode(byte)).join(''));

    // Replace any characters that are not URL-safe
    const urlSafeHashBase64 = urlSafeEncoding(hashBase64);
    
    return urlSafeHashBase64;
  }

  // Generate a unique generatedState ID using UUID
export function generateUniqueState() {
  return uuidv4();
}

