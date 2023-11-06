import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { DateTime } from "luxon";

import { BcLoading, BcHeader, BcDateRange, BcLineChart, BcSvgIcon, BcApacheChart } from "@components";

import { useToggle, useDate, useOrientation } from "@hooks";

import { fetchDeviceDataChart } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useChartSimple } from "@hooks";

function EmptyList(props) {
    return (
        <View flexGrow={1} justifyContent={"center"} alignItems={"center"} bgColor={"#FFF"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <FontAwesome5 name={"chart-line"} color={"#e6e6e6"} size={80} />
                <Text style={{
                    fontSize: 18,
                    color: "#d3d3d3",
                    fontFamily: 'Roboto-Medium',
                    fontWeight: "700"
                }}>No Data Collected Yet</Text>
            </VStack>
        </View>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Initial
    const dt = DateTime.now();

    const init = {
        activeColor: "#2898FF",
        inActiveColor: "#000",
        dateObj: {
            startDt: dt.toFormat("yyyy-MM-dd"),
            endDt: dt.toFormat("yyyy-MM-dd")
        },
        cmpDateObj: {
            startDt: dt.plus({ months: -1 }).toFormat("yyyy-MM-dd"),
            endDt: dt.plus({ months: -1 }).toFormat("yyyy-MM-dd")
        }
    }
    // #endregion

    // #region UseState
    const [loading, setLoading, toggleLoading] = useToggle(false);

    const dateHook = useDate(init.dateObj);
    const [startDt, setStartDt, endDt, setEndDt] = dateHook.slice(0, 4);

    const prevDateHook = useDate(init.cmpDateObj);

    const [chart, setChart, chartData, setChartData, chartLegend] = useChartSimple();

    const [width, height, isPort, isLand] = useOrientation();
    // #endregion

    const userId = useSelector(Selectors.userIdSelect);

    const { Id: deviceId } = props.route.params;

    useEffect(() => {
        const flag = isFocused && startDt != undefined && endDt != undefined;
        if (flag) {
            setLoading(true);

            fetchDeviceDataChart({
                param: {
                    UserId: userId,
                    DeviceId: deviceId,
                    StartDate: startDt,
                    EndDate: `${endDt} 23:59:59`
                },
                onSetLoading: setLoading,
            })
                .then(data => {
                    setChart(data);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`)
                })
        }
    }, [isFocused, JSON.stringify(startDt + endDt + deviceId)]);

    const eChartHook = [chart, setChart, null, null, chartData, setChartData, chartLegend, null, null]

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Device Chart</BcHeader>

                    <View style={{ height: 10 }} />

                    {
                        (isPort) ? (
                            <>
                                <BcDateRange showCompare={false} hook={dateHook} prevHook={prevDateHook} />
                                <View style={{ height: 10 }} />
                            </>
                        ) : (
                            <></>
                        )
                    }

                    {
                        (Object.keys(chart).length > 0) ? (
                            <>
                                {/* Body */}
                                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                                    contentContainerStyle={{ flexGrow: 1 }}>
                                    <View flexGrow={1} bgColor={"#FFF"}>
                                        <View pt={3} alignItems={"center"}>
                                            <BcApacheChart hook={eChartHook} height={360} />
                                        </View>
                                    </View>
                                </ScrollView>
                            </>
                        ) : (
                            <EmptyList />
                        )
                    }
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;