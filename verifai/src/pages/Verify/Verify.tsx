import { flushSync } from 'react-dom';
import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom';

// CSS
import './Verify.css'
import '../../components/components.css'

// API
import type { ObjectType, Scan, Object, InfectionLevelInput, ExtendedObject } from '../../API/interfaces';
import { getScans } from '../../API/api_calls/getScans';
import getObjectTypes from "../../API/api_calls/getObjectTypes";
import { getInfectionLevel } from '../../API/api_calls/getInfectionLevel';
import { setInfectionLevel } from '../../API/api_calls/setInfectionLevelForScan';

// Components
import VerifyCard from '../../components/VerifyCard/VerifyCard'
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';

import { processScan, submitObjectVerification } from '../../utils/utils';

import { useAuth } from '../../contexts/auth-context';

export default function Verify() {
    // Context
    const { accessToken, user } = useAuth();
    const { studyId } = useParams();

    // Internal state
    const [objects, setObjects] = useState<ExtendedObject[]>([]);
    const [loading, setLoading] = useState(true);
    const [scans, setScans] = useState<Scan[]>([]);
    const [scanID, setScanID] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sortedObjects, setSortedObjects] = useState<{ [typeId: number]: Object[] }>([]); // temporary, need to find other way
    const [objectTypes, setObjectTypes] = useState<ObjectType[]>([]);
    const loaderRef = useRef(null);

    const ref = useRef<Map<any, any> | null>(null);
    const containerRef = useRef(null);


    if (!accessToken) {
        throw new Error('Verify: Invalid token')
    }


    /**
 * @trigger on page load
 * @sideeffect Fetches the first scan and inserts into list of objects
 */
    useEffect(() => {

        async function startFetching() {
            setIsLoading(true);
            if (!accessToken) {
                throw new Error('Verify: Invalid Token');
            }
            if (!studyId) {
                throw new Error('Verify: Invalid study Id');
            }

            const study_id_num = parseInt(studyId)

            const scans = await getScans({
                access_token: accessToken.access_token,
                study_id: study_id_num,
                include: 'validated_object_count',
                only_with_objects: true,
            });


            if (!scans) {
                throw new Error('Verify: Invalid scan')
            }
            setScans(scans);
            
            let scan_id = 0;
            let new_objects = await processScan(accessToken.access_token, scans[scan_id].scan_id)
            // fetch new scan if empty or completed
            while ((new_objects === null && scan_id < scans.length) || scans[scan_id].scan_complete === true) {
                scan_id += 1
                new_objects = await processScan(accessToken.access_token, scans[scan_id].scan_id);
            }
            setScanID(scan_id);
            


            const result = await getObjectTypes(accessToken.access_token);
            if (result && !ignore) {
                setObjectTypes(result)
            }


            let new_object_list: ExtendedObject[] = []
            if (accessToken && !ignore && new_objects) {
                const new_object_values = Object.values(new_objects).flat(1)
                setSortedObjects(new_objects);

                for (let i = 0; i < new_object_values.length; i++) {
                    const color = getColor(new_object_values[i])

                    if (i === new_object_values.length - 1) {

                        new_object_list[i] = ({ ...new_object_values[i], id: i, color: color, last: `${scanID + 1}/${scans.length}` })
                    }
                    else {

                        new_object_list[i] = ({ ...new_object_values[i], id: i, color: color, last: null })
                    }

                }

                setObjects(new_object_list)
                setLoading(false)
            }
            setIsLoading(false);
            const id = scrollToNextUnverified(new_object_list);
            /*TODO to enaiblers: uncomment scrollToID and the feed will jump to the first card that hasn't been looked at. However this happens after images has been loaded
            which is confusing. Needs tp be fixed, images are loaded in VerifyCard.tsx*/
            console.log(id)
            // scrollToId(id);

        }

        let ignore = false;
        startFetching();
        
    }, []);



/**
 * @trigger When either the scan_id changes and the app goes from loading/ not loading
 * @sideeffect fetches next scan and updates the object list with new objects from next scan.
 */
    const fetchData = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);
        let scan_id = scanID
        let new_objects = await processScan(accessToken.access_token, scans[scan_id].scan_id);
        while ((new_objects === null && scanID < scans.length) || scans[scan_id].scan_complete === true) {
            scan_id += 1
            new_objects = await processScan(accessToken.access_token, scans[scan_id].scan_id);
        }
        setScanID(scan_id)

        console.log('FETCHING NEW SCAN')
        let new_object_list: ExtendedObject[] = []
        if (accessToken && new_objects) {
            let new_object_values = Object.values(new_objects).flat(1)
            setSortedObjects(new_objects)// only keep track of amount of each type in new scan.
            for (let i = 0; i < new_object_values.length; i++) {
                const color = getColor(new_object_values[i])
                if (i === new_object_values.length - 1) {
                    new_object_list[i] = ({ ...new_object_values[i], id: objects.length + i, color: color, last: `${scanID + 1}/${scans.length}` })
                }
                else {
                    new_object_list[i] = ({ ...new_object_values[i], id: objects.length + i, color: color, last: null })
                }
            }
            setObjects((prevObjects) => [...prevObjects, ...new_object_list])
            setScanID((prevIndex) => prevIndex + 1);
        }

        setIsLoading(false);
       
    }, [scanID, isLoading])







/**
 * 
 * @returns custom made mapping function, used for produing references for every sample
 */
    function getMap() {
        if (!ref.current) {
            ref.current = new Map();
        }
        return ref.current;
    }

   /**
     * @param itemId the id of the object to scroll to
     * @sideeffect scrolls to object
     */
    function scrollToId(itemId: any) {
        const map = getMap();
        const node = map.get(itemId);
        if (node == null) {
            return;
        }
        node.scrollIntoView({
            behaviour: 'smooth',
            block: 'nearest',
            inline: 'center',
        })

    }


    /**
     * 
     * @param itemId the id of the object to be updated
     * @param newColor the new color corresponding to the verification made
     * @returns scroll: a boolean telling wether the card should automatically be scrolled or not
     */
    async function updateVerification(itemId: any, newColor: any) {
        let scroll = true;
        let discard = false;
        let object_type_id = null;

        const nextList: ExtendedObject[] = objects.map(card => {
            if (card.id == itemId) {


                // Prohibit change of color on scroll when card already has color
                if (card.color !== ' default' && newColor === ' green') {
                    discard = true;
                    scroll = false;
                    return card;
                }
                // Change state to default if you press an already pressed button.
                else if (card.color === newColor) {
                    scroll = false;
                    return { ...card, color: ' default' }

                }
                // Change state to either true positive, false positive or questioned'
                if (!accessToken) {
                    throw new Error("no token")
                }
                else {
                    if (newColor === ' green') {
                        object_type_id = null
                    } else if (newColor === ' red') {
                        object_type_id = 32
                    } else {
                        object_type_id = 33
                    }
                    return { ...card, color: newColor };
                }


            } else {
                // No changes
                return card;
            }
        })

        // Submit object verification to database
        if (!discard) {
            setObjects(nextList);

            let success = false;
            if (accessToken && user && objects[itemId]) {
                success = await submitObjectVerification(accessToken.access_token, objects[itemId], user.id, object_type_id ? object_type_id : undefined);
            } else {
                throw new Error("Invalid arguments to submitObjectVerification")
            }
            if (!success) {
                throw new Error("Failed to submit object verification");
            }
            console.log('New object type ID: ' + object_type_id);
        };
        return scroll
    }

    /**
     * 
     * @param color_list list containing objects and whether they have been verified or not
     * @returns The number of TP in color_list
     */
    function getCount(color_list: ExtendedObject[]) {
        const count = { count: 0, tp_count: 0 };
        color_list.map(object => {
            count.count += 1;
            if (object.color === ' green') {
                count.tp_count += 1;
            }
        })
        return count;
    }

    /**
     * 
     * @param itemId The itemId of the last object of an objecttype
     * @returns The calculated infection level, 0=negative, 1=low, 2=moderate, 3=high
     * Assumes that the objects are ordered low, high, med
     */
    function calculateInfectionLevel(itemId: number) {
        const object_type = objects[itemId].detected_object_type_id
        const start = itemId - sortedObjects[object_type].length + 1
        console.log(objects);
        const object_counts = objects.slice(start, itemId + 1);
        console.log(object_counts);
        console.log(itemId);

        //initial 9
        var start_index = 0;
        var end_index = Math.min(object_counts.length, 9)
        const initial_9_counts = getCount(object_counts.slice(start_index, end_index))
        console.log('initial 9 ' + initial_9_counts.tp_count)

        if (initial_9_counts.tp_count === 0) {

            console.log('INFECTION LEVEL NEGATIVE')
            return 0;
            /// update in database to infectionlevel NEGATIVE
        } else {
            if (sortedObjects[object_type].length > 18) { //if mh threshold exist
                start_index = 9;
                end_index = Math.min(object_counts.length, 18)
                var next_9 = getCount(objects.slice(start_index, end_index))

                if (next_9.tp_count >= 5) {

                    console.log('INFECTION LEVEL HEAVY')
                    return 3;
                    //updata in database to HEAVY
                }
                else { //look at threashold L/M
                    start_index = 18;
                    end_index = Math.min(object_counts.length, 27)
                    next_9 = getCount(objects.slice(start_index, end_index))

                    if (next_9.tp_count >= 5) { //more than half true pos


                        // console.log('INFECTION LEVEL MODERATE')
                        return 2;
                        //update in database to MODERATE
                    }
                    else {

                        // console.log('INFECTION LEVEL LOW')
                        return 1;
                        //update in database to LOW
                    }
                }
            }
            if (sortedObjects[object_type].length > 9) { //if lm threshold exist
                start_index = 9;
                end_index = Math.min(object_counts.length, 18)
                next_9 = getCount(objects.slice(start_index, end_index))

                if (next_9.tp_count >= 5) { //more than half true pos


                    // console.log('INFECTION LEVEL MODERATE')
                    return 2;
                    //update in database to MODERATE
                }
                else {

                    // console.log('INFECTION LEVEL LOW')
                    return 1;
                    //update in database to LOW
                }
            }
            else {
                // console.log('INFECTION LEVEL LOW')
                return 1
            }

        }
    }





    async function getObjectInfectionLevel(objectType: number) {
        if (!accessToken) {
            throw new Error('invalid Token')
        }
        const infection_levels = await getInfectionLevel(accessToken.access_token, scanID);
        var new_level = null;
        infection_levels?.map(level => {
            if (level.object_type_id === objectType) {
                new_level = level.infection_level
                return level.infection_level
            }
        })
        return new_level
    }


    /**
     * 
     * @param item_id id of object to be updated
     * @param new_color what color the object has been updated to
     * @sideeffect updates color of object and posts what it has been verified as to the database
     */
    async function updateCard(item_id: number, new_color: string, nextScanRef:any) {

        // update color of card and post to db
        const scroll = await updateVerification(item_id, new_color)
        const detected_object_type_id = objects[item_id].detected_object_type_id

        if (objects[item_id].isLastOfType) {
            const prev_infection_level = await getObjectInfectionLevel(detected_object_type_id);
            const calculated_infection_level = calculateInfectionLevel(item_id);
            //check if infectionLevel matches infectionLevel in database
            console.log('Prev:' + prev_infection_level);
            if (calculated_infection_level !== prev_infection_level) {
                const infection_level_input: InfectionLevelInput = {
                    scan_id: scanID,
                    infection_level: calculated_infection_level!,
                    object_type_id: detected_object_type_id,
                    estimation_type_id: 1,
                }

                // Update infection level in database
                if (accessToken) {
                    setInfectionLevel(accessToken.access_token, infection_level_input);
                } else {
                    throw new Error('invalid token')
                }
            }

        }

        flushSync(() => {

            if (scroll) {
                if(objects[item_id].last && nextScanRef !== null){
                    nextScanRef?.current.scrollIntoView({
                    behaviour: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                    })
                }
                else{
                    scrollToId(item_id + 1);
                }
            }
        });

    }
    /**
     * @param object object that are going to be shown
     * @returns the color that has been saved to the object earlier.
     */
    function getColor(object: Object) {
        if (object.verified_object_type_id === 32) {
            return ' red'
        }
        else if (object.verified_object_type_id === 33) {
            return ' yellow'
        }
        else if (object.detected_object_type_id === object.verified_object_type_id) {
            return ' green'
        }
        else { return ' default' }
    }


    /**
     * 
     * @param new_object_list list of objects currently displayed in main feed
     * @returns the first id of a card that hasn't been looked at
     */
    function scrollToNextUnverified(new_object_list: ExtendedObject[]) {
        const unverified_objects = new_object_list.filter(object => object.color === ' default')
        if (unverified_objects.length != 0) {
            const id = unverified_objects[0].id
            console.log('ID' + id);
            return id;
        }
        return null
    }


    /**
     * @sideeffect checks when the loader component is in view, if it is it calls for fetchdata and generates next scan
     */
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                fetchData();
            }
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }
        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    },);



    const verifyList = objects.map((item, index) =>
        <VerifyCard
            key={index}
            cardId={index}
            color={item.color}
            handleCard={updateCard}
            ref={(node: any) => {
                const map = getMap();
                if (node) {
                    map.set(index, node);
                } else {
                    map.delete(index);
                }
            }}
            getMap={getMap}
            apiToken={accessToken.access_token!}
            object={item}
            last={item.last}
            objectTypes={objectTypes}
        />
    )
    return (
        <>
            {loading ? (<LoadingScreen />) : (

                <ul className='container' ref={containerRef} /*onScroll={handleScroll}*/ >
                    <div id='progressBarContainer'>
                        <div id='progressBar'>
                            <div id='progress' />
                        </div>
                    </div>
                    {verifyList}
                    <div className='nextScan' ref={loaderRef}>

                    </div>


                </ul>

            )}
        </>
    )
}