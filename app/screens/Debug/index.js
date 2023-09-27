import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { iRData, clsConst } from "@config";

import { useChart } from "@hooks";

import { BcViewShot, BcLineChartFull } from "@components";

function TestChart(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const init = {
        labels: ["00", "06", "12", "18", "24", "30", "36", "42", "48"]
    }

    const chartHook = useChart("absolute_humidity");
    const chartObj = {
        chart: chartHook[0],
        setChart: chartHook[1],
        chartKey: chartHook[2],
        setChartKey: chartHook[3],
        chartData: chartHook[4],
        setChartData: chartHook[5],
        chartLegend: chartHook[6],
        setChartLegend: chartHook[7],
        chartKeyOption: chartHook[8]
    };

    const { setChart } = chartObj;

    useEffect(() => {
        setChart(iRData);
    }, []);

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
                                <BcLineChartFull labels={init.labels} {...chartObj} />
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

import OneSignal from 'react-native-onesignal';


function Index(props) {

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

        // // // OneSignal Initialization
        // OneSignal.initialize(clsConst.ONESIGNAL_APP_ID)

        // // requestPermission will show the native iOS or Android notification permission prompt.
        // // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
        // OneSignal.Notifications.requestPermission(true);

        // // Method for listening for notification clicks
        // OneSignal.Notifications.addEventListener('foregroundWillDisplayµ', (event) => {
        //     console.log('OneSignal: notification clicked:', event);
        // });

        // OneSignal.setConsentGiven(true)

        // OneSignal.User.addEmail("txen2000@gmail.com");


        // OneSignal.User.addSms("+60166489466");

        // console.log(clsConst.ONESIGNAL_APP_ID)
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

export default Index;