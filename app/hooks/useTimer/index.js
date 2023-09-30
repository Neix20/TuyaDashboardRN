import React, { useState, useEffect } from "react";

function Index(props) {

    const { duration = 15, onTimerEnd = () => { } } = props;

    const [timer, setTimer] = useState(duration);

    useEffect(() => {
        if (timer > 0) {
            setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);
        } else if (timer === 0) {
            onTimerEnd();
        }
    }, [timer]);
}

export default Index;