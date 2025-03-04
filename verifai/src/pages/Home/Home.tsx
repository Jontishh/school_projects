import './Home.css';
import enaiblersText from '../../assets/enaiblers_text.svg';
import squirlyArrow from '../../assets/squirlyArrow.svg';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';

export default function Home() {
    
    return (
        <div className='HomeContainer'>
            <div>
                <div id='openMessage'>
                    <span id='open'>Open</span>
                    <img src={enaiblersText} id='enaiblersText' alt='ENAIBLERS' />
                    <h1>app to continue</h1>
                </div>
                <img src={squirlyArrow} id='squirlyArrow' alt='arrow' />
            </div>

            <PrimaryButton text='Open App' path='/Connect' />
        </div>
    );
}

