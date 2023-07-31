import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Dimensions } from "react-native";
import { View, VStack, HStack } from "native-base";


import { Utility } from "@utility";

function Index(props) {
    const { date = "2000-08-18", onTimerEnd = () => { } } = props;

    const duration = Utility.getDiffSecond(date);

    const { hide = false } = props;

    const { width = 100, borderRadius = 0, opacity = 0.5 } = props;

    const [timer, setTimer] = useState(duration);

    useEffect(() => {
        if (timer > 0) {
            const timerId = setInterval(() => {
                setTimer(timer => timer - 1);
            }, 1000);
            return () => {
                clearInterval(timerId);
            }
        } else {
            onTimerEnd();
        }
    }, [timer]);

    const style = StyleSheet.create({
        txtTitle: {
            fontFamily: "Roboto-Bold",
            fontSize: 16,
            color: "#fff"
        },
        txtTimer: {
            fontFamily: "Roboto-Bold",
            fontSize: 16,
            color: "#fff"
        },
    })

    return (hide || timer <= 0 || width <= 100) ? (
        <></>
    ) : (
        <>
            <View
                alignItems={"center"}
                justifyContent={"center"}
                style={{
                    position: "absolute",
                    zIndex: 2,
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}>
                <View
                    borderRadius={borderRadius}
                    backgroundColor={"#000"}
                    opacity={opacity}
                    style={{
                        position: "absolute",
                        zIndex: 3,
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }} />
                <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{
                        position: "absolute",
                        zIndex: 4,
                        width: width - 40,
                    }}>
                    <VStack alignItems={"center"}>
                        <Text style={style.txtTimer}>{Utility.convertSecondsToDays(timer)}</Text>
                        <Text style={style.txtTitle}>Days</Text>
                    </VStack>
                    <VStack alignItems={"center"}>
                        <Text style={style.txtTimer}>{Utility.convertSecondsToHours(timer)}</Text>
                        <Text style={style.txtTitle}>Hours</Text>
                    </VStack>
                    <VStack alignItems={"center"}>
                        <Text style={style.txtTimer}>{Utility.convertSecondsToMinutes(timer)}</Text>
                        <Text style={style.txtTitle}>Minutes</Text>
                    </VStack>
                    <VStack alignItems={"center"}>
                        <Text style={style.txtTimer}>{Utility.convertSecondsToSeconds(timer)}</Text>
                        <Text style={style.txtTitle}>Seconds</Text>
                    </VStack>
                </HStack>
            </View>
        </>
    )
}

export default Index;