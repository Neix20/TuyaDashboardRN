
import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";

function Index(init = DateTime.now().toFormat("yyyy-MM-dd")) {

    // yyyy-MM-dd: 2023-10-01
    const [dt, setDt] = useState(init);

    const [luxonDt, setLuxonDt] = useState(DateTime.now());

    useEffect(() => {
        if (dt.length > 0) {
            const t_dt = DateTime.fromFormat(dt, "yyyy-MM-dd");
            setLuxonDt(t_dt);
        }
    }, [dt]);

    const addDay = (duration = 1, delimiter = "days") => {

        const next_state = {};
        next_state[delimiter] = duration;

        const t_dt = luxonDt.plus(next_state);
        setLuxonDt(_ => t_dt);

        const t_dt_str = t_dt.toFormat("yyyy-MM-dd");
        setDt(_ => t_dt_str);
    }

    const minusDay = (duration = 1, delimiter = "days") => {
        const next_state = {};
        next_state[delimiter] = duration;

        const t_dt = luxonDt.plus(next_state);
        setLuxonDt(_ => t_dt);
        
        const t_dt_str = t_dt.toFormat("yyyy-MM-dd");
        setDt(_ => t_dt_str);
    }

    const setDay = (duration = 1, delimiter = "days") => {
        const next_state = {};
        next_state[delimiter] = duration;

        const t_dt = luxonDt.set(next_state);
        setLuxonDt(_ => t_dt);
        
        const t_dt_str = t_dt.toFormat("yyyy-MM-dd");
        setDt(_ => t_dt_str);
    }

    const updateCalendarDay = (day) => {
        const { dateString } = day;
        setDt(dateString);
    }

    return [dt, luxonDt, addDay, minusDay, setDay, updateCalendarDay];
}

export default Index;