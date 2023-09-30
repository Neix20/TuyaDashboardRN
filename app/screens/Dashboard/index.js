import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { Images, DashboardReportData } from "@config";

import { BcBoxShadow, BcSvgIcon, BcDateRange, BcViewShot, BcLoading, BcYatuHome, BcLineChartFull } from "@components";

import { DateTime } from "luxon";

import { fetchDashboardInfo } from "@api";

import { useChart, useDate, useToggle } from "@hooks";

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

function DashboardReport(props) {

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
    const { data = {} } = props;
    // #endregion

    const dataValues = Object.values(data);

    // #region Render
    const renderKeys = (item, index) => {
        return (
            <Text style={{
                fontFamily: "Roboto-Bold"
            }}>{item}</Text>
        )
    }

    const renderValues = (item, index) => {

        const { Name, Absolute_Humidity, Count } = item;

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
                    }}>{Name}</Text>
                </View>
                {
                    keys.slice(1, -2).map(renderData)
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

    return (
        <VStack>
            {dataValues.map(renderValues)}
        </VStack>
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
            startDt: dt.plus({months: -1}).toFormat("yyyy-MM-dd"),
            endDt: dt.plus({months: -1}).toFormat("yyyy-MM-dd")
        }
    }
    // #endregion

    // #region UseState
    const chartHook = useChart("Absolute Humidity");
    const [chart, setChart] = chartHook.slice(0, 2);

    const prevChartHook = useChart("Absolute Humidity");
    const [prevChart, setPrevChart] = prevChartHook.slice(0, 2);

    const dateHook = useDate(init.dateObj);
    const [startDt, setStartDt, endDt, setEndDt] = dateHook.slice(0, 4);

    const cmpDateHook = useDate(init.cmpDateObj);
    const [cmpStartDt, setCmpStartDt, cmpEndDt, setCmpEndDt] = cmpDateHook.slice(0, 4);

    const chartCompareHook = useToggle(false); 
    const [compare, setCompare, toggleCompare] = chartCompareHook;

    const [labels, setLabels] = useState([]);
    const [prevLabels, setPrevLabels] = useState([]);

    const [loading, setLoading, toggleLoading] = useToggle(false);
    // #endregion

    // #region UseEffect
    // Update Data
    useEffect(() => {
        if (isFocused) {
            getDashboard(startDt, endDt, setChart);

            let label = Utility.genLabel(startDt, endDt);
            setLabels(label);
        }
    }, [isFocused, JSON.stringify(startDt + endDt + homeId)]);

    useEffect(() => {
        if (isFocused) {
            setTimeout(() => {
                getDashboard(cmpStartDt, cmpEndDt, setPrevChart);

                let label = Utility.genLabel(cmpStartDt, cmpEndDt);
                setPrevLabels(label);
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
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1}>
                            <HStack
                                flexWrap={"wrap"}
                                rowGap={10}
                                alignItems={"flex-start"}
                                justifyContent={"space-between"}>

                                {
                                    
                                    (Object.keys(chart).length > 0) ? (
                                        <View px={3} style={{ width: width}}>
                                            <BcViewShot title="Daily Device Report">
                                                <BcLineChartFull labels={labels} hook={chartHook} />
                                            </BcViewShot>
                                        </View>
                                    ) : (
                                        <></>
                                    )
                                }

                                {
                                    (compare && Object.keys(prevChart).length > 0) ? (
                                        <View px={3} style={{ width: width}}>
                                            <BcViewShot title="Comparison">
                                            <BcLineChartFull labels={prevLabels} hook={prevChartHook} />
                                            </BcViewShot>
                                        </View>
                                    ) : (
                                        <></>
                                    )
                                }

                                {
                                    (Object.keys(chart).length > 0) ? (
                                        <BcViewShot title="Device Report">
                                            <DashboardReport data={DashboardReportData} />
                                        </BcViewShot>
                                    ) : (
                                        <></>
                                    )
                                }
                            </HStack>
                        </View>

                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 70 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;