import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { DateTime } from "luxon";

import { BcLoading, BcHeader, BcDateRange, BcLineChart, BcSvgIcon } from "@components";

import { Tab, TabView } from "@rneui/themed";

import { useToggle, useDate } from "@hooks";

import { fetchDeviceDataChart } from "@api";

import { Svg } from "@config";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function genDefArr(start_num = 0, end_num = 0, data_point = 12) {
    start_num = start_num * 60;
    end_num = end_num * 60;

    let arr = [];

    let step = 60 / data_point;

    for (let ind = start_num; ind < end_num; ind += step) {
        arr.push(null);
    }

    return arr;
}

function useChart() {

    const [chart, setChart] = useState([]);

    const [chartData, setChartData] = useState({});

    const init = {
        colors: [
            "#DB7D86", "#E7E005", "#188B9A",
            "#DB2E54", "#A53202", "#82EB20",
            "#75368B", "#395DAD", "#EC259F",
            "#0FA1AF", "#ADAC72", "#7FD106",
            "#6AC237", "#C5F022", "#76862A"
        ]
    }

    useEffect(() => {
        if (chart.length > 1) {

            const ind = Utility.genRandomInt(0, 10);

            const obj = { ...chart[0] };

            delete obj["Device_Id"];

            const ts = chart.map(x => x["Timestamp"]);
            
            delete obj["Timestamp"];

            const keys = Object.keys(obj);

            let dict = {};

            for (const key of keys) {
                let val = chart.map(x => x[key]);
                val = val.map(x => +x);

                if (val.length == 0) continue;

                let min_val = Number.MAX_VALUE;
                let max_val = Number.MIN_VALUE;

                min_val = Math.min(...val, min_val);
                max_val = Math.max(...val, max_val);

                if (ts.length > 0) {
                    min_dt = ts[0];
                    max_dt = ts.at(-1);

                    // Get Start Dt
                    const s_hr = DateTime.fromISO(min_dt).hour;

                    let s_arr = genDefArr(0, s_hr);

                    // Get End Dt
                    const e_hr = DateTime.fromISO(max_dt).hour;

                    let e_arr = genDefArr(e_hr, 23);

                    val = [...s_arr, ...val, ...e_arr]
                }

                let dataset = [{
                    data: val,
                    svg: { stroke: init.colors[ind] },
                    strokeWidth: 2,
                }]

                dict[key] = {
                    dataset,
                    name: key,
                    min: min_val,
                    max: max_val,
                };
            }

            setChartData(dict);
        }
    }, [chart]);

    return [chart, setChart, chartData, setChartData];
}

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

function DataAttribute(props) {

    const { data = [] } = props;

    if (data.length == 0) {
        return (<></>)
    }

    let keys = Object.keys(data[0]);

    const svg_key = Object.keys(Svg["MetaData_Header"]);

    keys = keys.filter(x => svg_key.includes(x));

    const renderItem = (item, index) => {
        return (
            <HStack key={index} space={3}
                width={"90%"}
                alignItems={"center"}>
                <BcSvgIcon name={item} />
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16
                }}>{item}</Text>
            </HStack>
        )
    }

    return (
        <>
            <View py={3}
                alignItems={"center"}
                bgColor={"#FFF"}>
                <View w={'90%'}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18
                    }}>Data Attributes</Text>
                </View>
            </View>
            <VStack alignItems={"center"} bgColor={"#FFF"} space={2} pb={2}>
                {keys.map(renderItem)}
            </VStack>
        </>
    )
}

function DataChart(props) {
    const { label = [], dataset = [] } = props;
    const { tabPaneInd, setTabPaneInd } = props;

    if (dataset.length == 0) {
        return (
            <EmptyList />
        )
    }

    const renderTabViewItem = (item, ind) => {
        return (
            <TabView.Item key={ind} style={{ width: "100%" }}>
                <View px={3} pt={3} bgColor={"#FFF"}>
                    <BcLineChart labels={label} {...item} />
                </View>
            </TabView.Item>
        )
    }

    return (
        <TabView value={tabPaneInd} onChange={(e) => setTabPaneInd(e)}>
            {dataset.map(renderTabViewItem)}
        </TabView>
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

    const [tabPaneInd, setTabPaneInd] = useState(0);

    const [data, setData] = useState([]);

    const [chart, setChart, chartData, setChartData] = useChart();

    const [label, setLabel] = useState([]);
    // #endregion

    const userId = useSelector(Selectors.userIdSelect);

    const { Id: deviceId } = props.route.params;

    useEffect(() => {
        if (isFocused) {
            setLoading(true);

            fetchDeviceDataChart({
                param: {
                    UserId: userId,
                    DeviceId: deviceId,
                    DataCount: 100,
                    StartDate: startDt,
                    EndDate: `${endDt} 23:59:59`
                },
                onSetLoading: setLoading,
            })
                .then(data => {
                    setChart(data);
                    setData(data);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`)
                })

            let label = Utility.genLabel(startDt, `${endDt}T23:59:59`);
            setLabel(label);
        }
    }, [isFocused, JSON.stringify(startDt + endDt + deviceId)]);

    const attr = Object.keys(chartData);
    const dataset = Object.values(chartData);

    // #region Render
    const renderTabItem = (item, ind) => {
        return (
            <Tab.Item key={ind}
                title={item}
                titleStyle={{ color: "#000", fontSize: 14 }}
                buttonStyle={{ paddingVertical: 0, height: 60 }} />
        )
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Device Chart</BcHeader>

                    <View style={{ height: 10 }} />

                    <BcDateRange showCompare={false}
                        hook={dateHook} prevHook={prevDateHook} />

                    <View style={{ height: 10 }} />

                    {
                        (Object.keys(chart).length > 0) ? (
                            <>
                                {/* Tab View */}
                                <View bgColor={"#FFF"}>
                                    <Tab
                                        value={tabPaneInd}
                                        onChange={(e) => setTabPaneInd(e)}
                                        indicatorStyle={{
                                            backgroundColor: init.activeColor,
                                            height: 3
                                        }}>
                                        {
                                            attr.map(renderTabItem)
                                        }
                                    </Tab>
                                </View>

                                {/* Body */}
                                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                                    contentContainerStyle={{ flexGrow: 1 }}>
                                    <View flexGrow={1} bgColor={"#FFF"}>
                                        <DataChart
                                            tabPaneInd={tabPaneInd} setTabPaneInd={setTabPaneInd}
                                            label={label} dataset={dataset} />
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