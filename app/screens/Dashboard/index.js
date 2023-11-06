import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { Images, Svg, iRDataUnit, DashboardSmartPlugData } from "@config";

import {
    BcBoxShadow, BcSvgIcon, BcDateRange, BcViewShot, BcLoading, BcYatuHome, BcApacheChartFull, BcDataAttribute,
    BcApacheBarChart, BcApacheBarChartFull, BcApachePieChart, BcApacheChartDebug
} from "@components";

import { DateTime } from "luxon";

import { fetchDashboardInfo, fetchReportData, fetchGetDeviceDistribution } from "@api";
import { useDate, useToggle, useEChart, useOrientation, useBarChart, useDevDistChart } from "@hooks";

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

function DashboardVoltageReport(props) {
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
    const renderValues = (item, index) => {

        if (item == undefined) {
            return (<></>)
        }

        const { Device_Name = "", Count = 0 } = item;

        const Current = item["Current (mA)"] || 0;
        const Power = item["Power (W)"] || 0;
        const Voltage = item["Voltage (V)"] || 0;
        const KWh = item["KWh"] || 0;

        const getColor = (val) => {
            const { green, yellow, red } = init.colors;

            if (val <= 500) {
                return green;
            }
            else if (val > 500 && val <= 1500) {
                return yellow;
            }

            return red;
        }

        const getTxtcolor = (val) => {
            val = +val;

            const { green, yellow, red } = init.colors;

            if (val <= 30) {
                return red;
            }
            else if (val > 30 && val <= 75) {
                return yellow;
            }

            return green;
        }

        return (
            <HStack key={index} alignItems={"center"} justifyContent={"space-between"}>
                <View style={{ width: 80 }}>
                    <Text style={{
                        fontFamily: "Roboto-Bold"
                    }}>{Device_Name}</Text>
                </View>
                <View
                    bgColor={getColor(KWh)}
                    alignItems={"center"}
                    flex={1}>
                    <Text style={{
                        fontFamily: "Roboto-Bold"
                    }}>{(KWh * 1).toFixed(2)}</Text>
                </View>
                <View alignItems={"center"}
                    flex={1}>
                    <Text>{Current}</Text>
                </View>
                <View alignItems={"center"}
                    flex={1}>
                    <Text>{Power}</Text>
                </View>
                <View alignItems={"center"}
                    flex={1}>
                    <Text>{Voltage}</Text>
                </View>
                <View
                    bgColor={getTxtcolor(Count)}
                    alignItems={"flex-end"} flex={1.5}>
                    <Text style={{
                        fontFamily: "Roboto-Bold"
                    }}>{(Count * 1).toFixed(2)}</Text>
                </View>
            </HStack>
        )
    }
    // #endregion

    return (
        <VStack space={1}>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
                <View style={{ width: 80 }}>
                    <Text style={{ fontFamily: "Roboto-Bold" }}>Name</Text>
                </View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"KWh"} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Current"} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Power"} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Voltage"} /></View>
                <View alignItems={"flex-end"} flex={1.5}>
                    <Text style={{ fontFamily: "Roboto-Bold" }}>Uptime %</Text>
                </View>

            </HStack>
            {data.map(renderValues)}
        </VStack>
    )
}

function DashboardAirQualityReport(props) {

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
    const renderValues = (item, index) => {

        const { Device_Name, Count = 0 } = item;

        const pm25 = item["Particle Matter (ug/m3)"];
        const co2 = item["Carbon Dioxide (ppm)"];
        const ch20 = item["Formaldehyde (mg/m3)"];

        const getColor = (val) => {
            const { green, yellow, red } = init.colors;

            if (ch20 <= 5) {
                return green;
            }
            else if (val > 5 && val <= 10) {
                return yellow;
            }

            return red;
        }

        const getTxtcolor = (val) => {
            const { green, yellow, red } = init.colors;

            val = +val;

            if (val <= 30) {
                return red;
            }
            else if (val > 30 && val <= 75) {
                return yellow;
            }

            return green;
        }

        return (
            <HStack key={index} alignItems={"center"} justifyContent={"space-between"}>
                <View style={{ width: 80 }}>
                    <Text style={{
                        fontFamily: "Roboto-Bold"
                    }}>{Device_Name}</Text>
                </View>
                <View
                    bgColor={getColor(ch20)}
                    alignItems={"center"}
                    flex={1}>
                    <Text style={{
                        fontFamily: "Roboto-Bold"
                    }}>{ch20}</Text>
                </View>
                <View alignItems={"center"}
                    flex={1}>
                    <Text>{pm25}</Text>
                </View>
                <View alignItems={"center"}
                    flex={1}>
                    <Text>{co2}</Text>
                </View>

                <View
                    bgColor={getTxtcolor(Count)}
                    alignItems={"flex-end"} flex={1}>
                    <Text style={{
                        fontFamily: "Roboto-Bold"
                    }}>{(Count * 1).toFixed(2)}</Text>
                </View>
            </HStack>
        )
    }
    // #endregion

    return (
        <VStack space={1}>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
                <View style={{ width: 80 }}>
                    <Text style={{ fontFamily: "Roboto-Bold" }}>Name</Text>
                </View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Formaldehyde"} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Particle Matter"} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Carbon Dioxide"} /></View>
                <View alignItems={"flex-end"} flex={1}>
                    <Text style={{ fontFamily: "Roboto-Bold" }}>Uptime %</Text>
                </View>

            </HStack>
            {data.map(renderValues)}
        </VStack>
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
    const renderValues = (item, index) => {

        const { Device_Name, Count = 0 } = item;

        const Temperature = item["Temperature (℃)"];
        const Relative_Humidity = item["Relative Humidity (%)"];
        const Absolute_Humidity = item["Absolute Humidity"];

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

        const getTxtcolor = (val) => {
            const { green, yellow, red } = init.colors;

            val = +val;

            if (val <= 30) {
                return red;
            }
            else if (val > 30 && val <= 75) {
                return yellow;
            }

            return green;
        }

        return (
            <HStack key={index} alignItems={"center"} justifyContent={"space-between"}>
                <View style={{ width: 80 }}>
                    <Text style={{
                        fontFamily: "Roboto-Bold"
                    }}>{Device_Name}</Text>
                </View>
                <View
                    bgColor={getColor(Absolute_Humidity)}
                    alignItems={"center"}
                    flex={1}>
                    <Text style={{
                        fontFamily: "Roboto-Bold"
                    }}>{Absolute_Humidity}</Text>
                </View>
                <View alignItems={"center"}
                    flex={1}>
                    <Text>{Temperature}</Text>
                </View>
                <View alignItems={"center"}
                    flex={1}>
                    <Text>{Relative_Humidity}</Text>
                </View>


                <View
                    bgColor={getTxtcolor(Count)}
                    alignItems={"flex-end"} flex={1}>
                    <Text style={{
                        fontFamily: "Roboto-Bold"
                    }}>{(Count * 1).toFixed(2)}</Text>
                </View>
            </HStack>
        )
    }
    // #endregion

    return (
        <VStack space={1}>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
                <View style={{ width: 80 }}>
                    <Text style={{ fontFamily: "Roboto-Bold" }}>Name</Text>
                </View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Absolute Humidity"} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Temperature"} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Relative Humidity"} /></View>
                <View alignItems={"flex-end"} flex={1}>
                    <Text style={{ fontFamily: "Roboto-Bold" }}>Uptime %</Text>
                </View>
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

    const spChartHook = useEChart("Voltage (V)");
    const [spChart, setSpChart] = spChartHook.slice(0, 2);

    const spBarChartHook = useBarChart("Total KiloWatt (KWh)");
    const [spBarChart, setSpBarChart] = spBarChartHook.slice(0, 2);

    const aqChartHook = useEChart("Particle Matter (ug/m3)");
    const [aqChart, setAqChart] = aqChartHook.slice(0, 2);

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
    const [drAqData, setDrAqData] = useState([]);

    const [loading, setLoading, toggleLoading] = useToggle(false);

    const [width, height, isPort, isLand, c_width, c_height] = useOrientation();

    const devDistChartHook = useDevDistChart();
    const [devDistChart, setDevDistChart, devDistChartData, devDistChartLegend] = devDistChartHook;
    // #endregion

    // #region UseEffect
    // Update Data
    useEffect(() => {

        const flag = isFocused && startDt != undefined && endDt != undefined;

        if (flag) {

            setLoading(true);
            fetchDashboardInfo({
                param: {
                    UserId: userId,
                    HomeId: homeId,
                    StartDate: startDt,
                    EndDate: `${endDt} 23:59:59`
                },
                onSetLoading: setLoading,
            })
                .then(res => {
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
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })

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

                    if ("Smart Plug" in res) {
                        const Data = res["Smart Plug"];

                        const Data_II = Object.values(Data).map(x => x[0]);

                        setDrSpData(Data_II);
                    } else {
                        setDrSpData([])
                    }

                    if ("Air Quality" in res) {
                        const Data = res["Air Quality"];

                        const Data_II = Object.values(Data).map(x => x[0]);

                        setDrAqData(Data_II);
                    } else {
                        setDrAqData([])
                    }

                })
                .catch(err => {
                    console.log(`Error: ${err}`);
                })

            fetchGetDeviceDistribution({
                param: {
                    UserId: userId,
                    HomeId: homeId,
                },
                onSetLoading: () => { }
            })
                .then(data => {
                    setDevDistChart(data);
                })
                .catch(err => {
                    console.log(`Error: ${err}`);
                })

        }
    }, [isFocused, JSON.stringify(startDt + endDt + homeId)]);

    // useEffect(() => {
    //     if (isFocused) {
    //         setTimeout(() => {
    //             fetchDashboardInfo({
    //                 param: {
    //                     UserId: userId,
    //                     HomeId: homeId,
    //                     StartDate: cmpStartDt,
    //                     EndDate: `${cmpEndDt} 23:59:59`
    //                 },
    //                 onSetLoading: () => { },
    //             })
    //                 .then(res => {
    //                     if ("IR Temperature" in res) {
    //                         const Data = res["IR Temperature"]
    //                         setPrevChart(Data);
    //                     } else {
    //                         setPrevChart({})
    //                     }
    //                 })
    //                 .catch(err => {
    //                     setLoading(false);
    //                     console.log(`Error: ${err}`);
    //                 })
    //         }, 10 * 1000);
    //     }
    // }, [isFocused, JSON.stringify(cmpStartDt + cmpEndDt + homeId)]);
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <Header />

                    <View style={{ height: 10 }} />

                    {
                        (isPort) ? (
                            <>
                                <BcDateRange showCompare={false}
                                    hook={dateHook} prevHook={cmpDateHook} flagHook={chartCompareHook} />
                                <View style={{ height: 10 }} />
                            </>
                        ) : (
                            <></>
                        )
                    }

                    {/* Body */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        {
                            (Object.keys(chart).length > 0 || Object.keys(spBarChart).length > 0 || Object.keys(aqChart).length > 0) ? (
                                <View flexGrow={1}>
                                    <HStack
                                        flexWrap={"wrap"}
                                        rowGap={10}
                                        alignItems={"flex-start"}
                                        justifyContent={"space-between"}>
                                        {
                                            (Object.keys(chart).length > 0) ? (
                                                <View px={3} style={{ width: width }}>
                                                    <BcViewShot title="Daily Humidity Device Report">
                                                        <BcApacheChartFull hook={chartHook} height={400} />
                                                    </BcViewShot>
                                                </View>
                                            ) : (
                                                <></>
                                            )
                                        }

                                        {
                                            (Object.keys(spBarChart).length > 0) ? (
                                                <View px={3} style={{ width: width }}>
                                                    <BcViewShot title="Total KiloWatt (KWh) Report">
                                                        {/* <BcApacheChartFull hook={spChartHook} height={400} /> */}
                                                        <BcApacheBarChartFull hook={spBarChartHook} height={400} />
                                                    </BcViewShot>
                                                </View>
                                            ) : (
                                                <></>
                                            )
                                        }

                                        {
                                            (Object.keys(aqChart).length > 0) ? (
                                                <View px={3} style={{ width: width }}>
                                                    <BcViewShot title="Daily Air Quality Data">
                                                        <BcApacheChartFull hook={aqChartHook} height={400} />
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
                                                        <BcApacheChartFull hook={prevChartHook} height={400} />
                                                    </BcViewShot>
                                                </View>
                                            ) : (
                                                <></>
                                            )
                                        }

                                        {
                                            (devDistChart.length > 0) ? (
                                                <View px={3} style={{ width: width }}>
                                                    <BcViewShot title={"Total Device Distribution"}>
                                                        <BcApachePieChart hook={devDistChartHook} />
                                                    </BcViewShot>
                                                </View>
                                            ) : (
                                                <></>
                                            )
                                        }

                                        {
                                            (Object.keys(drData).length > 0) ? (
                                                <View px={3} style={{ width: c_width }}>
                                                    <BcViewShot title="Daily Humidity Average Report">
                                                        <BcDataAttribute data={[{
                                                            "Average Absolute Humidity": 0,
                                                            "Average Temperature (℃)": 0,
                                                            "Average Relative Humidity (%)": 0,
                                                        }]} />
                                                        <DashboardHumidityReport data={drData} />
                                                    </BcViewShot>
                                                </View>
                                            ) : (
                                                <></>
                                            )
                                        }

                                        {
                                            (Object.keys(drSpData).length > 0) ? (
                                                <View px={3} style={{ width: c_width }}>
                                                    <BcViewShot title="Daily Smart Plug Average Report">
                                                        <BcDataAttribute data={[{
                                                            "Average Total KiloWatt (KWh)": 0,
                                                            "Average Current (mA)": 0,
                                                            "Average Power (W)": 0,
                                                            "Average Voltage (V)": 0,
                                                        }]} />
                                                        <DashboardVoltageReport data={drSpData} />
                                                    </BcViewShot>
                                                </View>
                                            ) : (
                                                <></>
                                            )
                                        }

                                        {
                                            (Object.keys(drAqData).length > 0) ? (
                                                <View px={3} style={{ width: c_width }}>
                                                    <BcViewShot title="Daily Air Quality Average Report">
                                                        <BcDataAttribute data={[{
                                                            "Average Formaldehyde (mg/m3)": 0,
                                                            "Average Particle Matter (ug/m3)": 0,
                                                            "Average Carbon Dioxide (ppm)": 0,
                                                        }]} />
                                                        <DashboardAirQualityReport data={drAqData} />
                                                    </BcViewShot>
                                                </View>
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