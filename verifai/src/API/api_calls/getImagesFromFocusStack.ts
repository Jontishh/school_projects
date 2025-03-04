import axios from 'axios'
import { requests } from '../api_urls'
import { FocusStackImage } from '../interfaces'

/**
 * 
 * @param access_token 
 * @param focus_stack_id 
 * @returns 
 */
export async function getImagesFromFocusStack(access_token: string, focus_stack_id: number) : Promise<{ best_image: FocusStackImage | null, rest_images: FocusStackImage[] } | null> {
    try {
        const response = await axios.get(
            requests.getImagesForFocusStackUrl(focus_stack_id),
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const focus_stack_images: FocusStackImage[] = response.data;

        // Find the image with the best(?) focus (largest focus_value)
        let best_image: FocusStackImage | null = null;
        let rest_images: FocusStackImage[] = [];

        if (focus_stack_images.length > 0) {
            best_image = focus_stack_images.reduce((prev, current) => {
                return (current.focus_value > prev.focus_value) ? current : prev;
            });

            rest_images = focus_stack_images.filter(image => image !== best_image);
        }

        return { best_image, rest_images };
    } catch (error) {
        console.error('Error fetching focus stack:', error);
        return null;
    }
}
