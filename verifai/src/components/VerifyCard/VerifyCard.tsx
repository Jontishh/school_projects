import { useState, useEffect, forwardRef, useRef } from 'react'

import '../components.css'
import '../Popup/Popup.css'

import { getImage } from '../../API/api_calls/getImage';
import { ObjectType } from '../../API/interfaces';

import Popup from '../Popup/Popup';
import ZoomPopup from '../ZoomPopup/ZoomPopup';

import editIcon from '../../assets/edit.svg'
import expandIcon from '../../assets/expand.svg'
import denyIcon from '../../assets/deny.svg'
import questionmarkIcon from '../../assets/questionmark.svg'
import scrollDown from '../../assets/scrollDown.svg';

interface verifyCardProps {
  inputRef?: any,
  cardId: number,
  keyProp?: number,
  handleCard: any,
  color: string,
  getMap: any,
  object: any,
  apiToken: string,
  last: string|null,
  objectTypes: ObjectType[]
}

export default forwardRef(
   function VerifyCard(props: verifyCardProps, ref: any){
    const {cardId, keyProp, handleCard, color, getMap, object, apiToken,last, objectTypes } = props;
    
    const [zoomIsOpen, setZoomIsOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const [selectedParasite, setSelectedParasite] = useState<string> ("");
    const [isOpen, setisOpen] = useState(false);
    const nextScanRef = useRef(null);


    /**
     * 
     * @param threshold how much of a sample should be visible for it to be classified as visible
     * @returns whether an object/sample is visible
     */
    const useIntersection = (threshold: number) => {
      const [isVisible, setIsVisible] = useState(false);
      
      if(cardId===0){ //first instance causes isVisible to get stuck in a update loop
          return isVisible
          }

      useEffect(() => {
      const map= getMap()
        const current = map.get(cardId)
        const observer = new IntersectionObserver(
          ([entry]) => {
            
            setIsVisible(entry.isIntersecting);
          },
          { threshold }
        );
        current && observer?.observe(current);
        return () => observer.disconnect();
      }, []); 

      return isVisible;
    };
    const isVisible = useIntersection(1.0);
    
   /**
    * @trigger whenever isVisibile changes.
    * @sideeffect Changes the previous card to green and marks card as verified if it has no other colors
    */
    useEffect(() => {
        async function startFetching() {
          if(apiToken === null){return};
          const result = await getImage(apiToken, object.image_id);

          if (result && !ignore) {
            setUrl(result);
          }
        }
        
        let ignore = false;
        startFetching();
        return () => {
          ignore = true;    
        }
      }, [apiToken]);
      
      useEffect(() => {
        if (isVisible) {
          handleCard(cardId-1, ' green');
          console.log('visible' + color);
        }
      }, [isVisible]);

    
   /**
    * 
    * @sideeffect Crops the image to the correct coordinates
    */
  useEffect(() => {
      const img = new Image();

      img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const x_min = object.x_min;
            const y_min = object.y_min;
            const x_max = object.x_max;
            const y_max = object.y_max;
            const crop_width = x_max - x_min;
            const crop_height = y_max - y_min;
            canvas.width = crop_width;
            canvas.height = crop_height;
            ctx.drawImage(img, x_min, y_min, crop_width, crop_height, 0, 0, crop_width, crop_height);
            const cropped_image_url = canvas.toDataURL();
            setCroppedImageUrl(cropped_image_url);
          }
      };

      img.src = url;
  }, [url, object.x_min, object.y_min, object.x_max, object.y_max]);


/**
     * Handles the selection of a parasite from the list.
     * Toggles the selected parasite if clicked again.
     * @param parasite The name of the parasite to select.
     */
  const handleSelectedParasite = (parasite : string) => {
    if (selectedParasite === parasite) {
      setSelectedParasite(""); 
    } else {
      setSelectedParasite(parasite); 
    }
  };

/**
     * Changes the parasite type for the object and updates the card's state to verified.
     * @param name The name of the parasite type to change to.
     */
  const changeParasiteType = (name : string) => {
    if (name != "") {
        object.detected_object_type_id = findParasiteIdByName(name);
        setisOpen(false);
        setTimeout(() => {
            handleCard(cardId, ' green');
        }, 100);
    }
    else {
        setisOpen(false)
    }

    
  };


  
/**
     * Finds the name of a parasite type given its ID.
     * @param id The ID of the parasite type.
     * @returns The name of the parasite type, capitalized.
     */
  const findParasiteTypeNameById = (id: number) => {
    const parasiteType = objectTypes.find(parasite => parasite.id === id); 
    if (parasiteType && parasiteType.name) {
        const name = parasiteType.name;
        const upper = name.charAt(0).toUpperCase() + name.slice(1);
      return upper
    }
    else {
      return ''
    }
  };


/**
     * Finds the ID of a parasite type given its name.
     * @param parasiteName The name of the parasite type.
     * @returns The ID of the parasite type.
     */  
  const findParasiteIdByName = (parasiteName : string) => {
    const parasiteId = objectTypes.find(parasite => parasite.name === parasiteName);
    if (parasiteId) {
      return parasiteId.id
    }
    else {
        return 0;
    }
  };

	return(
    <>
    <li className={'cardContainer' + color} key={keyProp} ref={ref}>
        <div className='cardContent'>
            <div className={'imageContainer' + color} >
                {croppedImageUrl && <img src={croppedImageUrl} className={'disease' + color} alt="disease" onClick={() => setZoomIsOpen(true)}/>}
            </div>

            <div style={{display: 'flex', alignItems: 'center'}}>
                    <p className='object-type' style={{ marginRight: '7px'}}>{findParasiteTypeNameById(object.detected_object_type_id)}</p>
                    <p className='verification-status'> {color === ' green'&& ' - verified'}{color === ' yellow' && ' - Not sure'}{color === ' red' && ' - Not an egg'}</p>
            </div>

            <div id='cardButtons'>
                <button className={'verifyBtn zoom'} onClick={() => setZoomIsOpen(true)}>
                    <img src={expandIcon} alt="expand" style={{width:'auto', height:'3vh'}}/>
                </button>
                <button className={'verifyBtn unsureButton' + color} onClick={() => { handleCard(cardId, ' yellow', nextScanRef) }}>
                    <img src={questionmarkIcon} alt="questionmark" style={{width:'auto', height:'3vh'}}/>
                </button>
                <button className={'verifyBtn xbutton' + color} onClick={() => { handleCard(cardId, ' red', nextScanRef) }}>
                    <img src={denyIcon} alt="deny" style={{width:'auto', height:'3vh'}}/>
                </button>
                <button className={'verifyBtn edit'} onClick={() => setisOpen(true)}>
                    <img src={editIcon} alt="Edit" style={{width: 'auto', height: '3.5vh'}} />
                </button>
            </div>
        </div>

        <Popup isOpen={isOpen} setisOpen={setisOpen}>
                    {croppedImageUrl && <img src={  croppedImageUrl} className='popup-picture' alt="small image"/>}
                    <ul className='parasite-list'>
                        <li>
                            {objectTypes.filter((objectType) => objectType.metaclass_id !== 3)
                            .map((objectType) => (
                            <div className="parasite-type">
                                <input
                                type="radio"
                                name={objectType.name || ""}
                                value={objectType.name || ""}
                                checked={selectedParasite === objectType.name}
                                onClick={() => handleSelectedParasite(objectType.name || "")}
                            />
                            <label className="radio-label" onClick={() => handleSelectedParasite(objectType.name || "")}> {objectType.name} </label>
                            </div>
                            
                            ))}
                        </li>
                    </ul>
  

                    <div className="confirm-button-container">
                        <button  className="button-change-parasite" onClick={() => changeParasiteType(selectedParasite)}>
                            <h2>Confirm</h2>
                        </button>
                    </div>
        </Popup>

        <ZoomPopup zoomIsOpen={zoomIsOpen} setZoomIsOpen={setZoomIsOpen} object={object} imageURL={url}>

        </ZoomPopup>
    </li>
    {last !== null &&     
        <li className='nextScanCard' key={object.object_id} ref= {nextScanRef} >
                <div id='nextScanText'>
                    <h3>Fetching next scan</h3>
                    <h3>{last}</h3>
                    <img id = 'scrollImage' src={scrollDown} style={{height:'10vh'}}></img>
                </div>
        </li>
    } 
    </>
    )
}
);
