import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { useDevDistChart, useChartSimple, useBarChartSimple } from "@hooks";
import { fetchGetDeviceDistribution, fetchGetParamApi } from "@api";

import { DevDistriData, ChartSimpleData, BarChartSimpleData } from "./data";

import { useToggle } from "@hooks";

function Temp(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Hooks
    const devDistChartHook = useDevDistChart();
    const [devDistChart, setDevDistChart, devDistChartLegend] = devDistChartHook;

    const chartSimpleHook = useChartSimple();
    const [smChart, setSmChart, sm1, sm2, sm3] = chartSimpleHook;

    const barChartSimpleHook = useBarChartSimple();
    const [bsmChart, setBsmChart, bsm1, bsm2, bsm3] = barChartSimpleHook;
    // #endregion

    useEffect(() => {
        if (isFocused) {
            setDevDistChart(DevDistriData);
            setSmChart(ChartSimpleData);
            setBsmChart(BarChartSimpleData);
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <View style={{ height: 80 }} />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"}>
                        <View alignItems={"center"}>
                            <Text>This is Yatu Pro Page</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 48 }} />
            </View>
        </SafeAreaView>
    );
}

import { BcAdFullModal } from "@components";

function Index(props) {

    const [adModal, setAdModal, toggleAdModal] = useToggle(false);

    return (
        <>
            <BcAdFullModal ParamKey={"Yatu_AdUrl"} showModal={adModal} setShowModal={setAdModal} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <View style={{ height: 80 }} />

                    <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
                        <TouchableOpacity onPress={toggleAdModal} style={{ width: "48%", height: 40 }}>
                            <View flex={1} backgroundColor={"#F00"}
                                alignItems={"center"} justifyContent={"center"}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "#FFF",
                                }}>Show Ad Modal</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={{ height: 80 }} />
                </View>
            </SafeAreaView>
        </>
    )
}

export default Index;