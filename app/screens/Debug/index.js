import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { iRData, iRDataUnit, DowntimeData, clsConst, Images } from "@config";

import { useChart, useToggle, useDate, useEChart, useOrientation, useTimer } from "@hooks";

import { BcViewShot, BcLineChartFull, BcDateRange, BcLineChart, BcLineLegend, BcApacheChart, BcApacheChartFull, BcDropdown, BcApacheChartDebug } from "@components";


function DownTimeTable(props) {

    const color = {
        active: "#F00",
        inactive: "#0F0"
    }

    // const duration = 1000;

    // const [opacity, setOpacity] = useState(0);
    // const [flag, setFlag, toggleFlag] = useToggle(false);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         // setOpacity(opacity => (opacity + 1) % 21)
    //         toggleFlag();
    //     }, duration);

    //     return () => clearInterval(interval);
    // }, [])

    const { data = [] } = props;

    if (data.length == 0) {
        return (
            <></>
        )
    }

    // #region Render
    const Active = () => {
        return (
            <View flex={1} opacity={1} bgColor={color.active} />
        )
    }

    const InActive = () => {
        return (
            <View flex={1} bgColor={color.inactive} />
        )
    }

    const renderValues = (item, index) => {

        const { Name, Timestamp, Status } = item;

        const StatusDiv = (Status) ? Active : InActive;

        return (
            <HStack key={index} alignItems={"center"} justifyContent={"space-between"}>
                <View flex={.3}>
                    <Text style={{
                        fontFamily: "Roboto-Bold"
                    }}>{Name}</Text>
                </View>
                <View flex={.5}>
                    <Text>{Utility.formatDt(Timestamp, "yyyy-MM-dd HH:mm:ss")}</Text>
                </View>
                <View flex={.2}>
                    <StatusDiv />
                </View>
            </HStack>
        )
    }
    // #endregion

    // return (
    //     <Text>{1 - Math.abs(opacity / 5 - 1)}</Text>
    // )

    return (
        <VStack>{data.slice(0, 2).map(renderValues)}</VStack>
    )
}

function Index(props) {

    const toast = useToast();

    const init = {
        dateObj: {
            startDt: "2023-08-18",
            endDt: "2023-08-19"
        },
        prevDateObj: {
            startDt: "2023-07-18",
            endDt: "2023-07-19"
        }
    }

    const dateHook = useDate(init.dateObj);

    const startDt = dateHook[0];
    const endDt = dateHook[2];

    const prevHook = useDate(init.prevDateObj);

    const pStartDt = prevHook[0];
    const pEndDt = prevHook[2];

    const flagHook = useToggle(false);
    const [flag, setFlag, toggleFlag] = flagHook;

    const [width, height, isPort, isLand, c_width, c_height] = useOrientation();

    const [timer, setTimer, totalDuration, setTotalDuration, progress] = useTimer(30);

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <View style={{ height: 80 }} />

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack flexGrow={1} space={3}>
                            <HStack
                                flexWrap={"wrap"}
                                rowGap={10}
                                alignItems={"flex-start"}
                                justifyContent={"space-between"}>
                                <View px={3} style={{ width: width }}>
                                    <BcViewShot title={"Test"}>

                                    </BcViewShot>
                                </View>
                                <View px={3} style={{ width: width }}>
                                    <BcViewShot title={"Device Downtime"}>
                                        <DownTimeTable data={DowntimeData} />
                                    </BcViewShot>
                                </View>
                            </HStack>

                            {
                                (isPort) ? (
                                    <BcDateRange showCompare={false}
                                        hook={dateHook}
                                        flagHook={flagHook}
                                        prevHook={prevHook} />
                                ) : (
                                    <></>
                                )
                            }

                            <View>
                                <Text>Start Date: {startDt}</Text>
                                <Text>End Date: {endDt}</Text>

                                {
                                    (flag) ? (
                                        <>
                                            <Text>Start Date: {pStartDt}</Text>
                                            <Text>End Date: {pEndDt}</Text>
                                        </>
                                    ) : (
                                        <></>
                                    )
                                }
                            </View>

                            <Text>{progress.toFixed(2)}</Text>
                            <Text>{timer}</Text>
                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>

        </>
    )
}

function DeviceChart(props) {

    // const chartHook = useEChart("Absolute Humidity");

    // const [chart, setChart] = chartHook.slice(0, 2);

    // useEffect(() => {
    //     setChart(iRDataUnit);
    // }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={"handled"}
                contentContainerStyle={{ flexGrow: 1 }}>
                <VStack py={3} space={3} alignItems={"center"}>
                    {/* <BcApacheChartFull hook={chartHook} height={480} /> */}
                    <BcApacheChartDebug />
                </VStack>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DeviceChart;