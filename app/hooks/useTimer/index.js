import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function Index(duration = 15, onTimerEnd = () => { }) {

    const [timer, setTimer] = useState(duration);
    const [totalDuration, setTotalDuration] = useState(duration);

    const dispatch = useDispatch();

    // const timer = useSelector(Selectors.linkTimerSelect);
    // const setTimer = (val) => dispatch(Actions.onChangeLinkTimer(val));

    // const totalDuration = useSelector(Selectors.linkTotalDurationSelect);
    // const setTotalDuration = (val) => dispatch(Actions.onChangeLinkTotalDuration(val));

    const progress = (totalDuration - timer) / totalDuration * 100;

    useEffect(() => {
        dispatch(Actions.onChangeLinkTotalDuration(totalDuration));
    }, [totalDuration])

    useEffect(() => {
        if (timer === 0) {
            onTimerEnd();
            dispatch(Actions.onChangeLinkTimer(-1));
        } else {
            const timeout = setTimeout(() => {
                setTimer((timer) => timer - 1);
                dispatch(Actions.onChangeLinkTimer(timer - 1));
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [timer]);

    return [timer, setTimer, totalDuration, setTotalDuration, progress];
}

export default Index;