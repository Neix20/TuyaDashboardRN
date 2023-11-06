import React, { useState, useEffect } from "react";

function Index() {

    const coor_state = [
        { start: 75, end: 100, pos: 0 },
        { start: 50, end: 100, pos: 1, },
        { start: 25, end: 100, pos: 2 },
        { start: 0, end: 100, pos: 3 },
    ];

    const [coor, setCoor] = useState(coor_state[0]);

    const [flag, setFlag] = useState(false);
    const toggleFlag = () => setFlag(val => !val);

    useEffect(() => {
        const { start, end } = coor;

        let next_state = {};

        if (flag) {
            const diff = end - start;

            next_state = {
                ...coor,
                start: 0,
                end: diff,
            }
        } else {
            const diff = 100 - end;

            next_state = {
                ...coor,
                start: diff,
                end: 100,
            }
        }

        setCoor(_ => next_state);

    }, [flag]);

    const updateCoor = () => {
        const { pos } = coor;

        let next_state = {};

        if ((pos + 1) < coor_state.length) {
            next_state = coor_state[pos + 1];
        } else {
            next_state = coor_state[0];
        }

        if (flag) {
            const { start, end } = next_state;
            const diff = end - start;

            next_state = {
                ...next_state,
                start: 0,
                end: diff,
            }
        }

        setCoor(_ => next_state);
    }

    const updateCoorByInd = (pos) => {
        if (pos >= 0 && pos < coor_state.length) {
            const next_state = coor_state[pos];
            setCoor(_ => next_state);
        }
    }

    const updateCoorByData = (data) => {
        setCoor(_ => data);
    }

    return [coor, updateCoor, updateCoorByData, flag, toggleFlag];
}

export default Index;