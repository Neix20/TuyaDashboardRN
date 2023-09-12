import React, { useState, useEffect } from "react";

function Index(props) {
    // #region Props
    const { duration = 15, onTimerEnd = () => { } } = props;
    // #endregion

    // #region UseState
    const [timer, setTimer] = useState(duration);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (timer > 0) {
            setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);
        } else if (timer === 0) {
            onTimerEnd();
        }
    }, [timer]);
    // #endregion
}

export default Index;