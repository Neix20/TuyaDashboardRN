import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { Images, Svg } from "@config";

import { BcBoxShadow, BcSvgIcon, BcDateRange, BcViewShot, BcLoading, BcYatuHome, BcLineChartFull, BcApacheChart } from "@components";

import { DateTime } from "luxon";

import { fetchDashboardInfo, fetchReportData } from "@api";

import { useChart, useDate, useToggle, useEChart } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Components
function Header(props) {
    return (
        <BcBoxShadow style={{ width: "100%" }}>
            <View
                alignItems={"center"}
                justifyContent={"center"}
                style={{
                    height: 60,
                    backgroundColor: "#fff",
                }}>
                <HStack style={{ width: "90%" }}>
                    <BcYatuHome />
                </HStack>
            </View>
        </BcBoxShadow>
    )
}

function CardGradientItem(props) {
    const { bgName = "CardGradientRed" } = props;
    return (
        <View
            style={{ height: 180 }}>
            <Image source={Images[bgName]} style={{ width: "100%", height: "100%", borderRadius: 15 }} resizeMode={"cover"} alt={bgName} />
            <VStack p={2}
                space={4}
                position={"absolute"} style={{ left: 0, right: 0 }}>
                <View>
                    <Text style={{
                        fontSize: 12,
                        color: "#FFF",
                    }}>Cozy Home</Text>
                </View>

                <HStack space={3}>
                    <FontAwesome5 name={"cloud"} color={"#FFF"} size={36} />
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 32,
                        color: "#f1f1f1"
                    }}>29°C</Text>
                </HStack>

                <HStack alignItems={"center"} justifyContent={"space-between"}>
                    <VStack>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#FFF",
                        }}>Excellent</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: "#FFF",
                        }}>Outdoor PM 2.5</Text>
                    </VStack>
                    <VStack>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#FFF",
                        }}>74.0%</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: "#FFF",
                        }}>Outdoor Humidity</Text>
                    </VStack>
                    <VStack>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#FFF",
                        }}>1006.9hPa</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: "#FFF",
                        }}>Outdoor Air Pres...</Text>
                    </VStack>
                </HStack>
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

function DashboardHumidityReport(props) {

    // #region Initial
    const init = {
        colors: {
            "yellow": "#FFC000",
            "green": "#92D050",
            "red": "#FF0000",
        }
    }
    // #endregion

    // #region Props
    const { data = [] } = props;
    // #endregion

    if (data.length == 0) {
        return (<></>)
    }

    // #region Render
    const renderKeys = (item, index) => {
        return (
            <Text style={{
                fontFamily: "Roboto-Bold"
            }}>{item}</Text>
        )
    }

    const renderValues = (item, index) => {

        const { Device_Name, Count } = item;

        const Absolute_Humidity = item["Absolute Humidity"]

        const keys = Object.keys(item);

        // #region Render
        const renderData = (key, jnd) => {
            const val = item[key];
            return (
                <View style={{ width: 40 }}>
                    <Text>{val}</Text>
                </View>
            )
        }
        // #endregion

        const getColor = (val) => {
            const { green, yellow, red } = init.colors;

            if (val <= 14) {
                return green;
            }
            else if (val > 14 && val <= 17) {
                return yellow;
            }

            return red;
        }

        return (

            <HStack key={index} alignItems={"center"} justifyContent={"space-between"}>
                <View style={{ width: 80 }}>
                    <Text style={{
                        fontFamily: "Roboto-Bold"
                    }}>{Device_Name}</Text>
                </View>
                {
                    keys.slice(3, -1).map(renderData)
                }
                <View
                    bgColor={getColor(Absolute_Humidity)}
                    alignItems={"center"}
                    style={{ width: 60 }}>
                    <Text style={{
                        fontFamily: "Roboto-Bold"
                    }}>{Absolute_Humidity}</Text>
                </View>
                <Text>{Count}</Text>
            </HStack>
        )
    }
    // #endregion

    const keys = Object.keys(data[0]);

    return (
        <VStack>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
                <View style={{ width: 80 }}>
                    <Text style={{ fontFamily: "Roboto-Bold" }}>Name</Text>
                </View>
                <View alignItems={"center"} style={{ width: 40 }}><Text style={{ fontFamily: "Roboto-Bold" }}>Temp</Text></View>
                <View alignItems={"center"} style={{ width: 40 }}><Text style={{ fontFamily: "Roboto-Bold" }}>R Humid</Text></View>
                <View alignItems={"center"} style={{ width: 60 }}><Text style={{ fontFamily: "Roboto-Bold" }}>A Humid</Text></View>
                <Text style={{ fontFamily: "Roboto-Bold" }}>Count</Text>
            </HStack>
            {data.map(renderValues)}
        </VStack>
    )
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
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Redux
    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);
    // #endregion

    // #region Initial
    const dt = DateTime.now();

    const init = {
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
    const chartHook = useEChart("Absolute Humidity");
    const [chart, setChart] = chartHook.slice(0, 6);

    const spChartHook = useEChart("Voltage");
    const [spChart, setSpChart] = spChartHook.slice(0, 2);

    const prevChartHook = useEChart("Absolute Humidity");
    const [prevChart, setPrevChart] = prevChartHook.slice(0, 6);

    const dateHook = useDate(init.dateObj);
    const [startDt, setStartDt, endDt, setEndDt] = dateHook.slice(0, 4);

    const cmpDateHook = useDate(init.cmpDateObj);
    const [cmpStartDt, setCmpStartDt, cmpEndDt, setCmpEndDt] = cmpDateHook.slice(0, 4);

    const chartCompareHook = useToggle(false);
    const [compare, setCompare, toggleCompare] = chartCompareHook;

    const [drData, setDrData] = useState([]);
    const [drSpData, setDrSpData] = useState([]);

    const [loading, setLoading, toggleLoading] = useToggle(false);
    // #endregion

    // #region UseEffect
    // Update Data
    useEffect(() => {
        if (isFocused) {
            getDashboard(startDt, endDt, setChart);

            fetchReportData({
                param: {
                    UserId: userId,
                    HomeId: homeId,
                    StartDate: startDt,
                    EndDate: `${endDt} 23:59:59`
                },
                onSetLoading: () => { }
            })
                .then(res => {

                    if ("IR Temperature" in res) {
                        const Data = res["IR Temperature"]

                        const Data_II = Object.values(Data).map(x => x[0]);

                        setDrData(Data_II);
                    } else {
                        setDrData([])
                    }

                })
                .catch(err => {
                    console.log(`Error: ${err}`);
                })

        }
    }, [isFocused, JSON.stringify(startDt + endDt + homeId)]);

    useEffect(() => {
        if (isFocused) {
            setTimeout(() => {
                getDashboard(cmpStartDt, cmpEndDt, setPrevChart);
            }, 2000);
        }
    }, [isFocused, JSON.stringify(cmpStartDt + cmpEndDt + homeId)])

    // #region API
    const getDashboard = (start_date, end_date, setFunc = () => { }) => {
        setLoading(true);
        fetchDashboardInfo({
            param: {
                UserId: userId,
                HomeId: homeId,
                DataCount: 100,
                StartDate: start_date,
                EndDate: `${end_date} 23:59:59`
            },
            onSetLoading: setLoading,
        })
            .then(res => {
                if ("IR Temperature" in res) {
                    const Data = res["IR Temperature"]
                    setFunc(Data);
                } else {
                    setFunc({})
                }

                if ("Default" in res) {
                    const Data = res["Default"];
                    setSpChart(Data);
                } else {
                    setSpChart({});
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <Header />

                    <View style={{ height: 10 }} />

                    <BcDateRange hook={dateHook} prevHook={cmpDateHook} flagHook={chartCompareHook} />

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        {
                            (Object.keys(chart).length > 0) ? (
                                <View flexGrow={1}>
                                    <HStack
                                        flexWrap={"wrap"}
                                        rowGap={10}
                                        alignItems={"flex-start"}
                                        justifyContent={"space-between"}>
                                        <View px={3} style={{ width: width }}>
                                            <BcViewShot title="Daily Humidity Device Report">
                                                <BcApacheChart hook={chartHook} height={360} />
                                            </BcViewShot>
                                        </View>

                                        {
                                            (Object.keys(spChart).length > 0) ? (
                                                <View px={3} style={{ width: width }}>
                                                    <BcViewShot title="Daily Smart Plug Data">
                                                        <BcApacheChart hook={spChartHook} height={360} />
                                                    </BcViewShot>
                                                </View>
                                            ) : (
                                                <></>
                                            )
                                        }

                                        {
                                            (compare && Object.keys(prevChart).length > 0) ? (
                                                <View px={3} style={{ width: width }}>
                                                    <BcViewShot title="Comparison">
                                                        <BcApacheChart hook={prevChartHook} height={360} />
                                                    </BcViewShot>
                                                </View>
                                            ) : (
                                                <></>
                                            )
                                        }

                                        {
                                            (Object.keys(drData).length > 0) ? (
                                                <>
                                                    <View px={3} style={{ width: width }}>
                                                        <BcViewShot title="Humidity Device Report">
                                                            <DashboardHumidityReport data={drData} />
                                                        </BcViewShot>
                                                    </View>
                                                </>
                                            ) : (
                                                <></>
                                            )
                                        }
                                    </HStack>
                                </View>
                            ) : (
                                <EmptyList />
                            )
                        }


                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 70 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;