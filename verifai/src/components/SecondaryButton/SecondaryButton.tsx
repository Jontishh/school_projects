import '../../App.css'
import { useNavigate } from 'react-router-dom';

interface PriamryButtonProps {
    text: string;
    path?: string;
    onClick?: () => Promise<void>;
    disabled?: boolean;
}

export default function SecondaryButton({ text, path, onClick, disabled }: PriamryButtonProps) {
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
        <button
        className='Button secondary' onClick={handleClick} disabled={disabled}
        >
            <h2>{text}</h2>
        </button>)
}