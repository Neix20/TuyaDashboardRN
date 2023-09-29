import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { DateTime } from "luxon";

import { DCHAhux } from "@config";

import { BcLoading, BcHeader, BcDateRange, BcLineChart } from "@components";

import { Tab, TabView } from "@rneui/themed";

import { useToggle } from "@hooks";

import { fetchDeviceDataChart } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

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
        if (chart.length > 0) {

            const ind = Utility.genRandomInt(0, 10);

            const obj = { ...chart[0] };

            delete obj["Timestamp"];
            delete obj["Device_Id"];

            const keys = Object.keys(obj);

            let dict = {};

            for (const key of keys) {
                let val = chart.map(x => x[key]);
                val = val.map(x => +x);

                let min_val = Number.MAX_VALUE;
                let max_val = Number.MIN_VALUE;

                min_val = Math.min(...val, min_val);
                max_val = Math.max(...val, max_val);

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

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Initial
    const init = {
        activeColor: "#2898FF",
        inActiveColor: "#000",
        dt: DateTime.now().minus({days: 1}).toFormat("yyyy-MM-dd"),
    }
    // #endregion

    // #region UseState
    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [startDt, setStartDt] = useState(init.dt);
    const [endDt, setEndDt] = useState(init.dt);

    const [tabPaneInd, setTabPaneInd] = useState(0);

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
                setChart(data)
                // console.log(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`)
            })

            let label = Utility.genLabel(startDt, endDt);
            setLabel(label);
        }
    }, [isFocused, JSON.stringify(startDt + endDt + deviceId)]);

    const attr = Object.keys(chartData);
    const dataset = Object.values(chartData);

    const renderTabItem = (item, ind) => {
        return (
            <Tab.Item key={ind}
                title={item} 
                titleStyle={{ color: "#000", fontSize: 14 }}
                buttonStyle={{ paddingVertical: 0, height: 60 }} />
        )
    }

    const renderTabViewItem = (item, ind) => {
        return (
            <TabView.Item key={ind} style={{ width: "100%" }}>
                <View px={3} bgColor={"#FFF"}>
                    <BcLineChart labels={label} {...item} />
                </View>
            </TabView.Item>
        )
    }

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Device Chart</BcHeader>

                    <View style={{ height: 10 }} />

                    <BcDateRange
                        startDt={startDt} setStartDt={setStartDt}
                        endDt={endDt} setEndDt={setEndDt}
                    />

                    <View style={{ height: 10 }} />

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

                    <View flexGrow={1}>
                        <TabView value={tabPaneInd} onChange={(e) => setTabPaneInd(e)}>
                            {
                                dataset.map(renderTabViewItem)
                            }
                        </TabView>
                    </View>

                    {/* Body */}
                    {/* <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1} bgColor={"#FFF"}>
                        </View>
                    </ScrollView> */}
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;