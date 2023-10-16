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

import { BcLoading, BcHeader, BcDateRange, BcLineChart, BcSvgIcon, BcApacheChart } from "@components";

import { Tab, TabView } from "@rneui/themed";

import { useToggle, useDate, useOrientation } from "@hooks";

import { fetchDeviceDataChart } from "@api";

import { Svg } from "@config";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Trash
function DataChart(props) {
    const { dataset = [] } = props;
    const { tabPaneInd, setTabPaneInd } = props;

    if (dataset.length == 0) {
        return (
            <EmptyList />
        )
    }

    const renderTabViewItem = (item, ind) => {

        const hook = [null, null, null, null, item, null, [], null, null];
        return (
            <TabView.Item key={ind} style={{ width: "100%" }}>
                <View pt={3} bgColor={"#FFF"} alignItems={"center"}>
                    <BcApacheChart hook={hook} height={360} />
                </View>
            </TabView.Item>
        )
    }

    return (
        <TabView disableSwipe={true}
            value={tabPaneInd}
            onChange={(e) => setTabPaneInd(e)}>
            {dataset.map(renderTabViewItem)}
        </TabView>
    )
}

function Index_Chart(props) {

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

    const [chart, setChart, chartData = {}, setChartData] = useChart();
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

                    <BcDateRange showCompare={false} hook={dateHook} prevHook={prevDateHook} />

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
                                            tabPaneInd={tabPaneInd} setTabPaneInd={setTabPaneInd} dataset={dataset} />
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
// #endregion

function useChart() {

    const [chart, setChart] = useState([]);

    const [chartData, setChartData] = useState({});

    const [chartLegend, setChartLegend] = useState([]);

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

            const obj = { ...chart[0] };

            delete obj["Device_Id"];

            let ts = chart.map(x => x["Timestamp"]);

            const label = ts.map(x => DateTime.fromISO(x).toFormat("T"));

            ts = ts.map(x => DateTime.fromISO(x).toSeconds());
            ts = ts.map(x => Math.floor(x * 1000));

            delete obj["Timestamp"];

            let keys = Object.keys(obj);

            const svg_key = Object.keys(Svg["MetaData_Header"]);

            keys = keys.filter(x => svg_key.includes(x));

            setChartLegend(keys);

            let min_val = Number.MAX_VALUE;
            let max_val = Number.MIN_VALUE;

            let min_dt = DateTime.now().toSeconds();
            let max_dt = DateTime.fromFormat("2021-01-01", "yyyy-MM-dd").toSeconds();

            min_dt = Math.floor(min_dt * 1000);
            max_dt = Math.floor(max_dt * 1000);

            min_dt = Math.min(...ts, min_dt);
            max_dt = Math.max(...ts, max_dt);

            let dataset = [];

            for (const key of keys) {
                let val = chart.map(x => x[key]);
                val = val.map(x => +x);

                if (val.length == 0) continue;

                min_val = Math.min(...val, min_val);
                max_val = Math.max(...val, max_val);

                val = val.map((x, ind) => ({
                    value: [ts[ind], x]
                }));

                let obj = {
                    name: key,
                    data: val
                }

                dataset.push(obj);
            }

            let dict = {
                label,
                dataset,
                min: min_val,
                max: max_val,
                min_dt,
                max_dt
            };

            setChartData(dict);
        }
    }, [chart]);

    return [chart, setChart, chartData, setChartData, chartLegend];
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

    const [chart, setChart, chartData, setChartData, chartLegend] = useChart();

    const [width, height, isPort, isLand] = useOrientation();
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