import axios from 'axios';
import { requests } from '../api_urls';

/**
 * 
 * @returns
 */
export async function externalLogin(
    param: {
        redirect_uri: string,
        state: string,
        code_challenge: string,
        code_challenge_method: string,
        client_id?: string,
        response_type: string
    }
    ): Promise<any | null> {
        try {
            const response = await axios.get(
                requests.externalLoginUrl(),
                {
                    params: {
                        redirect_uri:           param.redirect_uri          ? param.redirect_uri          : undefined,
                        state:                  param.state                 ? param.state                 : undefined,
                        code_challenge:         param.code_challenge        ? param.code_challenge        : undefined,
                        code_challenge_method:  param.code_challenge_method ? param.code_challenge_method : undefined,
                        client_id:              param.client_id             ? param.client_id             : undefined,
                        response_type:          param.response_type         ? param.response_type         : undefined,
                    },
                }
            )

            console.log("externalLogin : response : ", response);
            return response.data;

        } catch (error) {
            console.error('Error with external login:', error);
            return null;
        }
}