import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { DashboardData, ReportData, DeviceDistributionData } from "./data";
import { useToggle, useOrientation, useEChart, useBarChart, useDevDistChart } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import {
    BcBoxShadow, BcSvgIcon, BcLoading,
    BcViewShot, BcDataAttribute,
    BcApacheChartFull, BcApacheBarChartFull, BcApachePieChart
} from "@components";

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

    // #region UseState
    const chartHook = useEChart("Absolute Humidity");
    const [chart, setChart] = chartHook.slice(0, 6);

    const spChartHook = useEChart("Voltage (V)");
    const [spChart, setSpChart] = spChartHook.slice(0, 2);

    const aqChartHook = useEChart("Particle Matter (ug/m3)");
    const [aqChart, setAqChart] = aqChartHook.slice(0, 2);

    const spBarChartHook = useBarChart("Total KiloWatt (KWh)");
    const [spBarChart, setSpBarChart] = spBarChartHook.slice(0, 2);

    const [drData, setDrData] = useState([]);
    const [drSpData, setDrSpData] = useState([]);
    const [drAqData, setDrAqData] = useState([]);

    const devDistChartHook = useDevDistChart();
    const [devDistChart, setDevDistChart, devDistChartData, devDistChartLegend] = devDistChartHook;
    // #endregion

    useEffect(() => {
        const res = DashboardData;
        if ("IR Temperature" in res) {
            const Data = res["IR Temperature"];
            setChart(Data);
        } else {
            setChart({})
        }

        if ("Smart Plug" in res) {
            const Data = res["Smart Plug"];
            setSpChart(Data);
        } else {
            setSpChart({});
        }

        if ("Smart Plug KWh" in res) {
            const Data = res["Smart Plug KWh"];
            setSpBarChart(Data);
        } else {
            setSpBarChart({});
        }

        if ("Air Quality" in res) {
            const Data = res["Air Quality"];
            setAqChart(Data);
        } else {
            setAqChart({});
        }
    }, [])

    const [width, height, isPort, isLand, c_width, c_height] = useOrientation();

    const notLoading = Object.keys(chart).length > 0 || Object.keys(spBarChart).length > 0 || Object.keys(aqChart).length > 0;

    return (
        <>
            <BcLoading loading={false} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <View alignItems={"center"}>
                        <View width={"90%"} justifyContent={"center"} style={{ height: 80 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20
                            }}>Dashboard</Text>
                        </View>
                    </View>

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        {
                            (notLoading) ? (
                                <View flexGrow={1}>
                                    <HStack
                                        flexWrap={"wrap"}
                                        rowGap={10}
                                        alignItems={"flex-start"}
                                        justifyContent={"space-between"}>

                                        <View px={3} style={{ width: width }}>
                                            <BcViewShot title="Daily Air Quality Data">
                                                <BcApacheChartFull hook={aqChartHook} height={400} />
                                            </BcViewShot>
                                        </View>

                                        {/* <View px={3} style={{ width: width }}>
                                            <BcViewShot title="Total KiloWatt (KWh) Report">
                                                <BcApacheBarChartFull hook={spBarChartHook} height={400} />
                                            </BcViewShot>
                                        </View>

                                        <View px={3} style={{ width: width }}>
                                            <BcViewShot title="Daily Air Quality Data">
                                                <BcApacheChartFull hook={aqChartHook} height={400} />
                                            </BcViewShot>
                                        </View> */}
                                    </HStack>
                                </View>
                            ) : (
                                <EmptyList />
                            )
                        }
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;