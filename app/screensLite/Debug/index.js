import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg, clsConst } from "@config";

import { useDevDistChart, useChartSimple, useBarChartSimple } from "@hooks";
import { fetchGetDeviceDistribution } from "@api";

import { DevDistriData, ChartSimpleData, BarChartSimpleData } from "./data";

// #region Components
function DebugI(props) {

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
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}
// #endregion

import { BcSvgIcon, BcQrCameraBtn } from "@components";
import { useModalToast } from "@hooks";

function DebugII(props) {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [qrCode, setQrCode] = useState("");

    const [mToast, showMsg] = useModalToast();

    const onScanQr = (value) => {
        showMsg(value);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <BcQrCameraBtn cusToast={mToast} onScanQr={onScanQr} />
            </View>
        </SafeAreaView>
    )
}

import { LogLevel, OneSignal } from 'react-native-onesignal';

// Add OneSignal within your App's root component
function Index() {

    const toast = useToast();

    useEffect(() => {
        // Remove this method to stop OneSignal Debugging
        OneSignal.Debug.setLogLevel(LogLevel.Verbose);

        // OneSignal Initialization
        OneSignal.initialize(clsConst.ONESIGNAL_APP_ID);

        // requestPermission will show the native iOS or Android notification permission prompt.
        // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
        OneSignal.Notifications.requestPermission(true);

        // Method for listening for notification clicks
        OneSignal.Notifications.addEventListener('click', (event) => {
            console.log('OneSignal: notification clicked:', event);
        });
    }, []);

    const testSub = () => {
        const email = "txen2000@gmail.com"
        OneSignal.login(email);
        toast.show({
            description: `Email: ${email}`
        })
    }

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
                    <VStack flexGrow={1} space={3}
                        justifyContent={"center"} alignItems={"center"}>
                        <Text>This is to test OneSignal</Text>
                        <TouchableOpacity onPress={testSub}
                            style={{ width: "60%", height: 40 }}>
                            <View flex={1} backgroundColor={"#ff0000"}
                                alignItems={"center"} justifyContent={"center"}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "white",
                                }}>Test Sub</Text>
                            </View>
                        </TouchableOpacity>
                    </VStack>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    )

}

export default Index;