import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getDetectedObjects }from '../src/API/api_calls/getDetectedObjects';
import { Object } from '../src/API/interfaces'

// Create a new instance of MockAdapter
const mock = new MockAdapter(axios);

// Mock the API endpoint used in the function
mock.onGet('https://app-ai4ntd-dev-gerwestcentral.azurewebsites.net/api/objects?focus_stack_id=1891622').reply(200, [
    {
        x_min: 20,
        y_min: 20,
        x_max: 40,
        y_max: 40,
        object_id: 563825,
        confidence: 1.0,
        focus_stack_id: 1891622,
        image_id: 9489074,
        detected_object_type_id: 22,
        verified_object_type_id: 22,
        verification_id: 348869
    },
    {
        x_min: 327,
        y_min: 456,
        x_max: 455,
        y_max: 528,
        object_id: 563824,
        confidence: 1.0,
        focus_stack_id: 1891622,
        image_id: 9489074,
        detected_object_type_id: 33,
        verified_object_type_id: 33,
        verification_id: 348829
    }
]);

// Write your test
test('getDetectedObjects prints the result', async () => {
    // Call the function with mock access token
    
    const result: Object[] | null = await getDetectedObjects(
        {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3R5cGUiOiJwYXNzd29yZCIsInN1YiI6InJlYWRAdXNlci5jb20iLCJleHAiOjE3MTI2MDYyNzcsImlhdCI6MTcxMjYwNDQ3N30.Qr5f7SnAApWb3gP_tSpVMzNKs2u3Cx36s4C3lObubkM',
            focus_stack_id: 1891622
        }
        );

    // Log the result to the console
    console.log('Detected objects:', result);
});
