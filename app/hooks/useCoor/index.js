import React, { useState, useEffect } from "react";

function Index(ind = 0, coor_state = [{ start: 0, end: 100, pos: 0 }]) {

    if (ind >= coor_state.length) {
        ind = 0;
    }

    const [coor, setCoor] = useState(coor_state[ind]);

    const updateCoor = () => {
        const { pos } = coor;

        let next_state;

        if ((pos + 1) < coor_state.length) {
            next_state = coor_state[pos + 1];
        } else {
            next_state = coor_state[0];
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

    return [coor, updateCoor, updateCoorByData];
}

export default Index;