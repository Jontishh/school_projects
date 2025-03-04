import PrimaryButton from "../PrimaryButton/PrimaryButton"
import './ErrorDisplay.css'

interface errorDisplayProps {
    title: string | null;
    msg: string | null;
    unset: (error: boolean) => any;
}

export default function ErrorDisplay(props: errorDisplayProps) {
    const handleUnset = () => {
        props.unset(false)
    }
    
    return (
        <div className='errorWrapper'>

            <div className='errorMessage'>
                {props.title ? <h1>{props.title}</h1> : <h1>Error</h1>}
                {props.msg && <h3>{props.msg}</h3>}
            </div>

            <div className='bottomDiv'>
                <PrimaryButton
                    text="Go Back"
                    onClick={handleUnset}
                    disabled={false}
                />
            </div>
            
        </div>
    )
}