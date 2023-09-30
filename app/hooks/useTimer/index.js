import React, { useState, useEffect } from "react";

function Index(duration = 15, onTimerEnd = () => { }) {

    const [timer, setTimer] = useState(duration);

    useEffect(() => {
        if (timer === 0) {
            onTimerEnd();
        }
        else {
            const timeout = setTimeout(() => {
                setTimer((timer) => timer - 1);
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [timer]);

    return [timer, setTimer];
}

export default Index;