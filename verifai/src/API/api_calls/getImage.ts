import axios from 'axios'
import { requests } from '../api_urls'

/**
 * 
 * @param access_token 
 * @param image_id 
 * @returns 
 */
export async function getImage(access_token: string, image_id: number): Promise<string | null> {
    try {
        const response = await axios.get(
            requests.getImageUrl(image_id),
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                responseType: 'blob', // Response type blob handles binary data (like images)
            }
        );
        
        // Convert the blob response to a data URL
        const blob = new Blob([response.data], {type: 'image/jpeg'});

        const image_url = URL.createObjectURL(blob);

        return image_url;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

/*
function ImageComponent() {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleButtonClick = async () => {
        const accessToken = await getToken();
        if (accessToken) {
            const imageId = 9492070; // TODO: Replace with the desired image ID
            const fetchedImageUrl = await getImage(accessToken, imageId);
            if (fetchedImageUrl) {
                setImageUrl(fetchedImageUrl);
            } else {
                console.log('Failed to get image URL');
            }
        } else {
            console.log('Failed to get access token');
        }
    };

    return (
        <div>
            <button onClick={handleButtonClick}>Fetch Image</button>
            {imageUrl && <img src={imageUrl} alt="Fetched Image" />}
        </div>
    );
}
*/
