import axios from "axios";
import { requests } from "../api_urls";
import { Token } from "../interfaces";

export interface getTokenProps {
    client_id?: string,
    refresh_token?: string,
    code?: string,
    code_verifier?: string,
    redirect_uri?: string,
    username?: string,
    password?: string,
    grant_type?: string // Check type
}

/**
 * 
 * @param params 
 * @returns An access token to be used in consequent API calls
 */
export async function getToken(params?: getTokenProps): Promise<Token | null> {
    try {
        const response = await axios.post(
            requests.getTokenUrl(),
            {
                client_id:      params?.client_id       ? params.client_id        : undefined,
                refresh_token:  params?.refresh_token   ? params.refresh_token    : undefined,
                code:           params?.code            ? params.code             : undefined,
                code_verifier:  params?.code_verifier   ? params.code_verifier    : undefined,
                redirect_uri:   params?.redirect_uri    ? params.redirect_uri     : undefined,
                username:       params?.username        ? params.username         : undefined,
                password:       params?.password        ? params.password         : undefined,
                grant_type:     params?.grant_type      ? params.grant_type       : undefined
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const access_token_data = response.data;
        return access_token_data;

    } catch (error) {
        console.error('Error fetching token:', error);
        return null;
    }
}