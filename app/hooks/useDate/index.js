import { useState, useEffect } from "react";

import { DateTime } from "luxon";

function Index(props = {}) {

    const { startDt: iStartDt, endDt: iEndDt } = props;

    const [startDt, setStartDt] = useState();
    const [endDt, setEndDt] = useState();

    useEffect(() => {
        setStartDt(iStartDt);
        setEndDt(iEndDt);
    }, [])

    const addDt = () => {
        const tStartDt = DateTime.fromISO(startDt).plus({ days: 1 }).toFormat("yyyy-MM-dd");
        setStartDt(tStartDt);

        const tEndDt = DateTime.fromISO(endDt).plus({ days: 1 }).toFormat("yyyy-MM-dd");
        setEndDt(tEndDt);
    }

    const minusDt = () => {
        const tStartDt = DateTime.fromISO(startDt).plus({ days: -1 }).toFormat("yyyy-MM-dd");
        setStartDt(tStartDt);

        const tEndDt = DateTime.fromISO(endDt).plus({ days: -1 }).toFormat("yyyy-MM-dd");
        setEndDt(tEndDt);
    }

    return [startDt, setStartDt, endDt, setEndDt, addDt, minusDt];
}

export default Index;