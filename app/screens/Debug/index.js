import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, Dimensions, SafeAreaView, ScrollView, FlatList, TouchableWithoutFeedback } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { BcSvgChart, BcDateRangeModal, BcViewShot } from "@components";

import { iRData } from "@config";

import { Checkbox as PaperCheckbox } from "react-native-paper";
import { CheckBox as ElemCheckbox } from '@rneui/base';
import { Checkbox as NativeCheckbox } from "native-base";

// #region Trash
function Chart(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [chart, setChart] = useState([]);
    const [label, setLabel] = useState([]);

    const data = iRData["DCH-AHUX"]

    useEffect(() => {
        if (isFocused) {
            let val = data.slice(0, 100);
            val = val.map(obj => obj["Absolute_Humidity"]);

            setChart(val);

            val = data.slice(0, 100);
            val = val.map(obj => obj["Timestamp"]);
            val = val.map(obj => obj.replace(" ", "T"));
            val = val.map(obj => Utility.formatDt(obj, "hh:mm"));

            setLabel(val)
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
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
                        <BcSvgChart
                            key={label.length}
                            data={chart} labels={label} />
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 80 }} />
            </View>
        </SafeAreaView>
    );
}

function TestCheckbox(props) {

    const navigation = useNavigation();

    // #region UseState
    const [nativeFlag, setNativeFlag] = useState(false);
    const [elemFlag, setElemFlag] = useState(false);
    const [paperFlag, setPaperFlag] = useState(false);

    const [tabIndex, setTabIndex] = useState(0);
    // #endregion

    // #region Toggle
    const togglePaperFlag = () => setPaperFlag(paperFlag => !paperFlag);
    const toggleNativeFlag = () => setNativeFlag(nativeFlag => !nativeFlag);
    const toggleElemFlag = () => setElemFlag(elemFlag => !elemFlag);
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <View style={{ height: 80 }} />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
                        <VStack space={1}>
                            <HStack space={3} alignItems={"center"}>
                                <NativeCheckbox colorScheme={"red"} />
                                <Text>Native Checkbox</Text>
                            </HStack>
                            <HStack space={3} alignItems={"center"}>
                                <NativeCheckbox defaultIsChecked />
                                <Text>Native Checkbox: Checked</Text>
                            </HStack>
                        </VStack>
                        <VStack space={1}>
                            <HStack space={3} alignItems={"center"}>
                                <PaperCheckbox status={paperFlag ? "checked" : "unchecked"} onPress={togglePaperFlag} />
                                <Text>Paper Checkbox</Text>
                            </HStack>
                            <HStack space={3} alignItems={"center"}>
                                <PaperCheckbox status={"checked"} />
                                <Text>Paper Checkbox: Checked</Text>
                            </HStack>
                        </VStack>
                        <VStack space={1}>
                            <ElemCheckbox checked={elemFlag} onPress={toggleElemFlag} checkedColor="#F00" />
                            <ElemCheckbox checked={true} />
                        </VStack>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 80 }} />
            </View>
        </SafeAreaView>
    )
}
// #endregion

function DebugRange(props) {

    // #region Init
    const init = {
        dt: "2023-09-04"
    }
    // #endregion

    // #region UseState
    const [showDtModal, setShowDtModal] = useState(false);
    const [startDt, setStartDt] = useState("2023-08-18");
    const [endDt, setEndDt] = useState("2023-08-19");
    // #endregion

    // #region Helper
    const toggleDtModal = () => setShowDtModal(!showDtModal);
    // #endregion

    return (
        <>
            <BcDateRangeModal dt={init.dt}
                startDt={startDt} setStartDt={setStartDt}
                endDt={endDt} setEndDt={setEndDt}
                showModal={showDtModal} setShowModal={setShowDtModal} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    <VStack space={3} p={3}>

                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 16
                        }}>Start Date: {Utility.formatDt(startDt, "EEEE, d MMM")}</Text>

                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 16
                        }}>End Date: {Utility.formatDt(endDt, "EEEE, d MMM")}</Text>

                        <TouchableOpacity onPress={toggleDtModal}>
                            <View backgroundColor={"#ff0000"}
                                alignItems={"center"} justifyContent={"center"}
                                style={{ width: 100, height: 40 }}>
                                <Text style={[{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "white",
                                }]}>Date Range</Text>
                            </View>
                        </TouchableOpacity>

                        <BcViewShot>
                            <View backgroundColor={"#F00"}
                                alignItems={"center"} justifyContent={"center"}
                                style={{ width: 100, height: 40 }}>
                                <Text style={[{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "white",
                                }]}>View Shot</Text>
                            </View>
                        </BcViewShot>

                        <BcViewShot>
                            <View backgroundColor={"#00F"}
                                alignItems={"center"} justifyContent={"center"}
                                style={{ width: 100, height: 40 }}>
                                <Text style={[{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "white",
                                }]}>View Shot</Text>
                            </View>
                        </BcViewShot>
                    </VStack>
                </View>
            </SafeAreaView>
        </>
    )
}

// Choose your preferred renderer
// import { SkiaChart, SVGRenderer } from '@wuba/react-native-echarts';
import { SvgChart, SVGRenderer } from '@wuba/react-native-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';

// Register extensions
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    SVGRenderer,
    BarChart,
])

const E_HEIGHT = 250;
const E_WIDTH = 300;

// Initialize
function ChartComponent(props) {

    const { option } = props;
    const chartRef = useRef(null);

    useEffect(() => {
        let chart;
        if (chartRef.current) {
            // @ts-ignore
            chart = echarts.init(chartRef.current, 'light', {
                renderer: 'svg',
                width: E_WIDTH,
                height: E_HEIGHT,
            });
            chart.setOption(option);
        }
        return () => chart?.dispose();
    }, [option]);

    // Choose your preferred chart component
    // return <SkiaChart ref={chartRef} />;
    return (
        <SvgChart ref={chartRef} />
    );
}

// Component usage
function Index() {
    const option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
            },
        ],
    }

    return (
        <ChartComponent option={option} />
    )
}

export default Index;