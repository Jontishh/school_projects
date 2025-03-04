import axios from "axios";
import { requests } from "../api_urls";
import { ObjectVerificationInput } from "../interfaces";

export async function createObjectVerifications(
    access_token: string, 
    body: ObjectVerificationInput[]
) : Promise<boolean> {
    try {
        const response = await axios.post(
            requests.createObjectVerificationsUrl(),
            body,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    
                },
            }
        )
        console.log("RESPONSE IN CREATE OBJECT VERIFICATIONS", response)
        return true;
    } catch (error) {
        console.error('Error creating object verifications:', error);
        return false;
    }
}