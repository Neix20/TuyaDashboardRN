import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");

import { Logger, Utility } from "@utility";

import { iRData, clsConst, DowntimeData } from "@config";

import { useChart } from "@hooks";

import { BcViewShot, BcLineChartFull } from "@components";

import OneSignal from 'react-native-onesignal';

function TestOneSignal(props) {

    useEffect(() => {
        // // Remove this method to stop OneSignal Debugging
        // OneSignal.Debug.setLogLevel(LogLevel.Verbose);

        OneSignal.setAppId(clsConst.ONESIGNAL_APP_ID);

        OneSignal.promptForPushNotificationsWithUserResponse();

        OneSignal.setNotificationWillShowInForegroundHandler(event => {
            const notification = event.getNotification();
            // Complete with null means don't show a notification.
            event.complete(notification);
        });

        OneSignal.setNotificationOpenedHandler(event => {
        });

        OneSignal.setExternalUserId(`60166489466`);
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <View style={{ height: 80 }} />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"}>
                        <Text>Test</Text>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    )
}

function TestChart(props) {

    const chartHook = useChart("absolute_humidity");
    const setChart = chartHook[1];

    useEffect(() => {
        setChart(iRData);
    }, []);

    const labels = Utility.genLabel("2023-09-28", "2023-09-29", 5);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <View style={{ height: 80 }} />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"}>

                        <View px={3}>
                            <BcViewShot title={"Daily Device Report"}>
                                <BcLineChartFull hook={chartHook} labels={labels} />
                            </BcViewShot>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}

function DownTimeTable(props) {

    const color = {
        active: "#F00",
        inactive: "#0F0"
    }

    const { data = [] } = props;

    if (data.length == 0) {
        return (
            <></>
        )
    }

    const renderValues = (item, index) => {

        const { Name, Timestamp, Status } = item;

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
                    <View w={"100%"} bgColor={Status ? color.active : color.inactive}></View>
                </View>
            </HStack>
        )
    }

    return (
        <VStack>
            {data.map(renderValues)}
        </VStack>
    )
}

function Index(props) {



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <View style={{ height: 80 }} />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1}>
                        <HStack
                            flexWrap={"wrap"}
                            rowGap={10}
                            alignItems={"flex-start"}
                            justifyContent={"space-between"}>
                            <View px={3} style={{ width: width }}>
                                <BcViewShot title={"Test"}>
                                    <View bgColor={"#F00"} w={"100%"} height={100}>
                                    </View>
                                </BcViewShot>
                            </View>
                            <View px={3} style={{ maxWidth: width }}>
                                <BcViewShot title={"Device Downtime"}>
                                    <DownTimeTable data={DowntimeData} />
                                </BcViewShot>
                            </View>
                        </HStack>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    )
}

export default Index;