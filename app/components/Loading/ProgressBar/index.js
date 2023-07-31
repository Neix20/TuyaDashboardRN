import React, { useState, useEffect } from 'react';
import { Text, Image, ImageBackground, Dimensions } from "react-native";
import { View, VStack, HStack, Spinner } from 'native-base';

import { Images, GlobalStyles, GlobalColors } from "@config";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Utility } from "@utility";

import { useDispatch, useSelector } from 'react-redux';
import {Actions, Selectors} from "@redux";


function Loading(props) {
    const { progress = 0, width = 300 } = props;

    const progressVal = 300 * progress / 100;

    return (
        <VStack space={3} style={{ width: width }}>


            {/* Background */}
            <View>

                <View style={{
                    position: "absolute",
                    zIndex: 2,
                    backgroundColor: "#fff",
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    top: -6,
                    left: progressVal - 12,
                }} />

                <View style={{
                    position: "absolute",
                    zIndex: 2,
                    backgroundColor: "#fff",
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    top: -6,
                    left: progressVal - 12,
                }} />

                <View style={{
                    position: "absolute",
                    zIndex: 2,
                    backgroundColor: "#fff",
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    top: -6,
                    left: progressVal - 12,
                }} />

                <View style={{
                    borderTopRightRadius: 30,
                    borderBottomRightRadius: 30,
                    position: "absolute",
                    zIndex: 1,
                    backgroundColor: "#fff",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: progressVal
                }} />

                <View style={{
                    borderTopRightRadius: 30,
                    borderBottomRightRadius: 30,
                    position: "absolute",
                    zIndex: 1,
                    backgroundColor: "#fff",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: progressVal
                }} />

                <Image
                    source={Images.bgBcLoading}
                    style={{
                        width: 300,
                        height: 20,
                        borderRadius: 30,
                    }}
                    resizeMode={'stretch'}
                    alt={"Loading"} />
            </View>

            <View alignItems={"flex-end"}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 18,
                    color: "#fff",
                }}>{progress}%</Text>
            </View>
        </VStack>
    )
}

function Index(props) {

    // #region Redux
    const lang = useSelector(Selectors.langSelect);
    // #endregion

    // #region Props
    const { duration = 10, overrideFlag, onTimerEnd } = props;
    // #endregion

    // #region UseState
    const [timer, setTimer] = useState(100);
    const [wait, setWait] = useState(duration * 1000 / 100);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (timer > 0) {
            setTimeout(() => {
                setTimer(timer - 1);
            }, wait);
        } else if (timer === 0) {
            onTimerEnd();
        }
    }, [timer]);

    useEffect(() => {
        if (overrideFlag) {
            setWait(10);
        }
    }, [overrideFlag])
    // #endregion

    return (
        <View
            bgColor={"#000"}
            opacity={0.8}
            alignItems={"center"}
            justifyContent={"center"}
            style={{
                position: "absolute",
                zIndex: 5,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }}
        >
            <VStack
                space={10}
                style={{
                    width: 300
                }}>
                <VStack space={3}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 20,
                        color: "#fff",
                        textAlign: "center"
                    }}>{Utility.translate("Please Wait", lang)}</Text>

                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 16,
                        color: "#fff",
                        textAlign: "center"
                    }}>{Utility.translate("We are compiling your message video for WhatsApp sharing.", lang)}</Text>
                </VStack>

                {/* Loading */}
                <Loading progress={100 - timer} />


            </VStack>
        </View>
    )
}

export default Index;