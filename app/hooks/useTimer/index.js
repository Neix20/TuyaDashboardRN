import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { activateKeepAwake, deactivateKeepAwake} from "@sayem314/react-native-keep-awake";

// [ ] Can Be Improved
function Index(duration = 180, onTimerEnd = () => { }) {

    // Store Current Epoch Timestamp When Initialize

    const [epoch, setEpoch] = useState(0); // 1706865057
    const [timer, setTimer] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0); // 180

    const dispatch = useDispatch();
    const progress = (totalDuration - timer) / totalDuration * 100;

    const genEpoch = () => {        
        //  1706865087
        return Math.floor(new Date().getTime() / 1000);;
    }

    const updateDuration = (val = 0) => {
        setTotalDuration(_ => val);

        const ts = genEpoch();
        setEpoch(_ => ts);

        dispatch(Actions.onChangeLinkTotalDuration(totalDuration));
    }

    const updateTimer = (val = 0) => {
        updateDuration(val);
        setTimer(_ => val);
    }

    useEffect(() => {
        updateTimer(duration);
    }, []);

    useEffect(() => {
        // ! setTimer Fires Earlier than Duration
        // timer => 120, Duration => 0
        if (timer <= 0) {
            deactivateKeepAwake();
            onTimerEnd();
            // dispatch(Actions.onChangeLinkTimer(-1));
        } else {
            activateKeepAwake();
            const timeout = setTimeout(() => {

                const ts = genEpoch();

                // 180 - (1706865058 - 1706865057) = 179
                // 180 - (1706865087 - 1706865057) = 150
                let diff = totalDuration - (ts - epoch);

                if (diff <= 0) {
                    diff = 0;
                }
                
                setTimer(_ => diff);
                // dispatch(Actions.onChangeLinkTimer(timer - 1));
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [timer]);

    return [timer, updateTimer, totalDuration, updateDuration, progress];
}

export default Index;