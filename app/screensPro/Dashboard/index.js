import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import {
    BcBoxShadow, BcSvgIcon, BcDateRange, BcViewShot, BcLoading, BcYatuHome, BcApacheChartFull, BcDataAttribute,
    BcApacheBarChartFull, BcApachePieChart, BcProfileWorkspace
} from "@components";

import { DateTime } from "luxon";

import { fetchDashboardInfo, fetchReportData, fetchGetDeviceDistribution } from "@api";
import { fetchDashboardInfoByProfileWorkspace, fetchReportDataByProfileWorkspace, fetchDeviceDistributionByProfileWorkspace } from "@api";
import { useDate, useToggle, useOrientation } from "@hooks";
import { useEChart, useBarChart, useDevDistChart } from "@hooks";

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
                <HStack justifyContent={"space-between"} style={{ width: "90%" }}>                    
                    <BcProfileWorkspace />
                </HStack>
            </View>
        </BcBoxShadow>
    )
}

function EmptyList(props) {
    const style = {
        txt: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: "#d3d3d3",
            fontWeight: "700"
        }
    }
    return (
        <View flexGrow={1} justifyContent={"center"} alignItems={"center"} bgColor={"#FFF"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <FontAwesome5 name={"chart-line"} color={"#e6e6e6"} size={80} />
                <Text style={style.txt}>No Data Collected Yet</Text>
            </VStack>
        </View>
    )
}
// #endregion

// #region Dashboard Components
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
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"KWh"} size={24} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Current"} size={24} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Power"} size={24} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Voltage"} size={24} /></View>
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
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Formaldehyde"} width={40} height={12} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Particle Matter"} width={40} height={12} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Carbon Dioxide"} size={24} /></View>
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
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Absolute Humidity"} size={24} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Temperature"} size={24} /></View>
                <View alignItems={"center"} flex={1}><BcSvgIcon name={"Relative Humidity"} size={24} /></View>
                <View alignItems={"flex-end"} flex={1}>
                    <Text style={{ fontFamily: "Roboto-Bold" }}>Uptime %</Text>
                </View>
            </HStack>
            {data.map(renderValues)}
        </VStack>
    )
}

function DashboardReport(props) {

    const dispatch = useDispatch();

    const { title = "", daData = [] } = props;
    const { Report, rptData = [] } = props;

    // #region Helper
    const dashboardReportFlag = useSelector(Selectors.dashboardReportFlagSelect);
    const { humidity = false, voltage = false, airQuality = false } = dashboardReportFlag;

    const onChangeHumidity = () => {
        const next_state = { 
            ...dashboardReportFlag, 
            humidity: !humidity 
        };
        dispatch(Actions.onChangeDashboardReportFlag(next_state));
    }

    const onChangeVoltage = () => {
        const next_state = { 
            ...dashboardReportFlag, 
            voltage: !voltage 
        };
        dispatch(Actions.onChangeDashboardReportFlag(next_state));
    }

    const onChangeAirQuality = () => {
        const next_state = { 
            ...dashboardReportFlag, 
            airQuality: !airQuality 
        };
        dispatch(Actions.onChangeDashboardReportFlag(next_state));
    }

    const dict = {
        "Daily Humidity Average Report": {
            flag: humidity,
            func: onChangeHumidity
        },
        "Daily Smart Plug Average Report": {
            flag: voltage,
            func: onChangeVoltage
        },
        "Daily Air Quality Average Report": {
            flag: airQuality,
            func: onChangeAirQuality
        },
    }
    // #endregion

    const { flag, func = () => {}} = dict[title];
    const [showDaInfo, setShowDaInfo, toggleDaInfo] = useToggle(flag);
    const onToggleDaInfo = () => {
        toggleDaInfo();
        func();
    }

    return (
        <BcViewShot title={title}
            showInfo={true} onPressInfo={onToggleDaInfo}>
            {
                (showDaInfo) ? (
                    <TouchableOpacity onPress={toggleDaInfo}>
                        <BcDataAttribute data={daData} />
                    </TouchableOpacity>
                ) : (<></>)
            }
            <Report data={rptData} />
        </BcViewShot>
    )
}
// #endregion

import { DashboardInfoData, DeviceDistriData, ReportDataJson } from "./data";

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Redux
    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);
    const prwsId = useSelector(Selectors.profileWorkspaceIdSelect);
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

    const spBarChartHook = useBarChart("Total KiloWatt (KWh)");
    const [spBarChart, setSpBarChart] = spBarChartHook.slice(0, 2);

    const aqChartHook = useEChart("Particle Matter (ug/m3)");
    const [aqChart, setAqChart] = aqChartHook.slice(0, 2);

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
            DashboardInfo();
            ReportData();
            GetDeviceDistribution();
        }
    }, [isFocused, JSON.stringify(startDt + endDt + prwsId)]);

    // #region API
    const DashboardInfo = () => {
        setLoading(true);
        fetchDashboardInfoByProfileWorkspace({
            param: {
                UserId: userId,
                ProfileWorkspaceId: prwsId,
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
    }

    const ReportData = () => {
        fetchReportDataByProfileWorkspace({
            param: {
                UserId: userId,
                ProfileWorkspaceId: prwsId,
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
    }

    const GetDeviceDistribution = () => {
        fetchDeviceDistributionByProfileWorkspace({
            param: {
                UserId: userId,
                ProfileWorkspaceId: prwsId,
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
    // #endregion

    return (
        <>
            <BcLoading loading={false} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <Header />

                    <View style={{ height: 10 }} />

                    {
                        (isPort) ? (
                            <>
                                <BcDateRange showCompare={false} hook={dateHook} prevHook={cmpDateHook} flagHook={chartCompareHook} />
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
                                                    <DashboardReport
                                                        title={"Daily Humidity Average Report"}
                                                        daData={[{
                                                            "Average Absolute Humidity": 0,
                                                            "Average Temperature (℃)": 0,
                                                            "Average Relative Humidity (%)": 0,
                                                        }]}
                                                        Report={DashboardHumidityReport} rptData={drData} />
                                                </View>
                                            ) : (
                                                <></>
                                            )
                                        }

                                        {
                                            (Object.keys(drSpData).length > 0) ? (
                                                <View px={3} style={{ width: c_width }}>
                                                    <DashboardReport
                                                        title={"Daily Smart Plug Average Report"}
                                                        daData={[{
                                                            "Average Total KiloWatt (KWh)": 0,
                                                            "Average Current (mA)": 0,
                                                            "Average Power (W)": 0,
                                                            "Average Voltage (V)": 0,
                                                        }]}
                                                        Report={DashboardVoltageReport} rptData={drSpData} />
                                                </View>
                                            ) : (
                                                <></>
                                            )
                                        }

                                        {
                                            (Object.keys(drAqData).length > 0) ? (
                                                <View px={3} style={{ width: c_width }}>
                                                    <DashboardReport
                                                        title={"Daily Air Quality Average Report"}
                                                        daData={[{
                                                            "Average Formaldehyde (mg/m3)": 0,
                                                            "Average Particle Matter (ug/m3)": 0,
                                                            "Average Carbon Dioxide (ppm)": 0,
                                                        }]}
                                                        Report={DashboardAirQualityReport} rptData={drAqData} />
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