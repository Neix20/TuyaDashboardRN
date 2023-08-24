import React, { useState, useEffect } from "react";
import { Text } from "react-native";

function Index(props) {
    const { duration = 15, onTimerEnd = () => { } } = props;

    const { hide = false } = props;

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

    return (timer <= 0 || hide) ? (
        <></>
    ) : (
        <Text {...props}>
            {timer}
        </Text>
    );
}

export default Index;