import { useState, useEffect } from "react";

import { DateTime } from "luxon";

function Index(props = {}) {

    const { startDt: iStartDt, endDt: iEndDt } = props;

    const [startDt, setStartDt] = useState();
    const [endDt, setEndDt] = useState();

    useEffect(() => {
        setStartDt(iStartDt);
        setEndDt(iEndDt);
    }, []);

    const luxStartDt = DateTime.fromISO(startDt);
    const luxEndDt = DateTime.fromISO(endDt);

    const addDt = () => {
        const tStartDt = luxStartDt.plus({ days: 1 }).toFormat("yyyy-MM-dd");
        setStartDt(tStartDt);

        const tEndDt = luxEndDt.plus({ days: 1 }).toFormat("yyyy-MM-dd");
        setEndDt(tEndDt);
    }

    const minusDt = () => {
        const tStartDt = luxStartDt.plus({ days: -1 }).toFormat("yyyy-MM-dd");
        setStartDt(tStartDt);

        const tEndDt = luxEndDt.plus({ days: -1 }).toFormat("yyyy-MM-dd");
        setEndDt(tEndDt);
    }

    const stDiff = Math.abs(DateTime.now().diff(luxStartDt).as("days"));
    const endDiff = DateTime.now().diff(luxEndDt).as("days");

    return [startDt, setStartDt, endDt, setEndDt, addDt, minusDt, stDiff, endDiff];
}

export default Index;