import '../../App.css';
import { useNavigate } from 'react-router-dom';

interface PrimaryButtonProps {
    text: string;
    path?: string;
    onClick?: () => any;
    disabled?: boolean;
}

export default function PrimaryButton({ text, path, onClick, disabled }: PrimaryButtonProps) {
    const navigate = useNavigate();

    const goToNewPage = () => {
        if(path) {
            navigate(path);
        }
    };

    const handleClick = async () => {
        if (onClick) {
            await onClick(); // Call the onClick function if provided
        }
        goToNewPage(); // Navigate to the specified path
    };

    return (
        <button className='Button primary' onClick={handleClick} disabled={disabled}>
            <h2>{text}</h2>
        </button>
    );
}
