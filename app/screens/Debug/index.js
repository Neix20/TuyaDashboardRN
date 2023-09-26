import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { iRData } from "@config";

import { useChart } from "@hooks";

import { BcViewShot, BcLineChartFull } from "@components";

function Index(props) {

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

export default Index;