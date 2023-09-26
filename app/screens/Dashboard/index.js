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

import { BcBoxShadow, BcSvgIcon, BcDateRange, BcViewShot, BcLoading, BcYatuHome } from "@components";

import { DateTime } from "luxon";

import { fetchDashboardInfo } from "@api";

import { LineChart as LineChartSvg, YAxis, XAxis, Path } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

import { CheckBox } from "@rneui/base";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Line Chart
function CheckBoxLegend(props) {
    const { name, flag, color } = props;
    const { onPress = () => { } } = props;
    return (
        <CheckBox
            title={name}
            titleProps={{
                fontFamily: "Roboto-Medium",
                fontSize: 16,
                color: color,
            }}
            containerStyle={{
                flex: 1,
                minWidth: 100,
                paddingHorizontal: 5,
                paddingVertical: 0,
            }}
            iconType={"material-community"}
            checkedIcon={"checkbox-marked"}
            uncheckedIcon={"checkbox-blank-outline"}
            checked={flag}
            onPress={onPress}
            checkedColor={color} />
    )
}

function Legend(props) {
    const { data, onUpdateLegend = () => { } } = props;

    const renderItem = (obj, ind) => {
        const onSelect = () => onUpdateLegend(ind);
        return (
            <CheckBoxLegend key={ind} onPress={onSelect} {...obj} />
        )
    }

    if (data.length <= 0) {
        return (<></>)
    }

    return (
        <VStack bgColor={"#FFF"} alignItems={"center"} space={1}>
            <View width={"90%"}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                }}>Legend</Text>
            </View>
            <View
                borderWidth={1} borderRadius={0}
                borderColor={"#000"}
                width={"90%"}>
                <HStack flexWrap={"wrap"}>
                    {data.map(renderItem)}
                </HStack>
            </View>
        </VStack>
    );
}

function SvgLineChart(props) {

    const { metaData, chart, labels } = props;

    const Shadow = (props) => {
        const { lines } = props;
        return (
            <Path
                key={'shadow'}
                y={2}
                d={lines}
                fill={"none"}
                strokeWidth={4}
                stroke={'rgba(134, 65, 244, 0.2)'}
            />
        )
    }

    const { min, max } = metaData;

    return (
        <HStack space={2}>
            <YAxis
                data={[min, max]}
                contentInset={{ top: 20, bottom: 20 }}
                svg={{
                    fill: 'grey',
                    fontSize: 10,
                }}
            />
            <VStack width={"100%"}>
                <LineChartSvg
                    data={chart}
                    style={{ height: 300, width: "90%" }}
                    svg={{
                        strokeWidth: 2,
                    }}
                    curve={shape.curveNatural}
                    contentInset={{ top: 20, bottom: 20 }}
                >
                </LineChartSvg>
                <XAxis
                    style={{ width: "90%" }}
                    data={labels}
                    formatLabel={(_, index) => labels[index]}
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'black' }}
                />
            </VStack>
        </HStack>
    )
}
// #endregion

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
    const init = {
        svgChart: [
            { data: [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80] }
        ],
        svgMetaData: {
            min: Number.MIN_VALUE,
            max: Number.MAX_VALUE
        },
        legend: {
            name: "",
            flag: false,
            color: "#000",
        },
        colors: ["#DB7D86", "#E7E005", "#188B9A", "#DB2E54", "#A53202", "#82EB20", "#75368B", "#395DAD", "#EC259F", "#0FA1AF", "#ADAC72", "#7FD106", "#6AC237", "#C5F022", "#76862A"],
        dt: DateTime.now().toFormat("yyyy-MM-dd"),
    }
    // #endregion

    // #region UseState
    const [chartData, setChartData] = useState({});

    const [svgChart, setSvgChart] = useState(init.svgChart);
    const [svgMetaData, setSvgMetaData] = useState({});

    const [svgLegend, setSvgLegend] = useState([]);
    const [svgLabels, setSvgLabels] = useState(["00", "06", "12", "18", "24"]);

    const [startDt, setStartDt] = useState(init.dt);
    const [endDt, setEndDt] = useState(init.dt);

    const [loading, setLoading] = useState(false);
    // #endregion

    // #region UseEffect
    // Update Data
    useEffect(() => {
        if (isFocused) {
            getDashboard(startDt, endDt);
        }
    }, [isFocused, JSON.stringify(startDt + endDt + homeId)]);

    // Update Legend
    useEffect(() => {
        let legend = [...svgLegend];

        let datasets = [];

        let ind = 0;

        for (let key in chartData) {
            if (legend[ind] != null && legend[ind].flag) {
                let val = chartData[key];

                val = val.map(obj => +obj["absolute_humidity"]);

                val = (val.length > 0) ? val : [0];

                let obj = {
                    data: val,
                    svg: { stroke: init.colors[ind] },
                    strokeWidth: 2,
                }

                datasets.push(obj);
            }

            ind += 1;
        }

        setSvgChart(datasets);

    }, [JSON.stringify(svgLegend.map(obj => obj.flag)), JSON.stringify(chartData)]);
    // #endregion

    // #region API
    const getDashboard = (start_date = '2023-07-01', end_date = '2023-07-01') => {
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
                if ("Data" in res && "IR Temperature" in res["Data"]) {
                    const Data = res["Data"]["IR Temperature"];

                    setChartData(Data);

                    let datasets = [];
                    let legend = [];

                    let minData = Number.MAX_VALUE;
                    let maxData = Number.MIN_VALUE;

                    let ind = 0;
                    for (let key in Data) {
                        let val = Data[key];

                        val = val.map(obj => +obj["absolute_humidity"]);
                        val = (val.length > 0) ? val : [0];

                        minData = Math.min(...val, minData);
                        maxData = Math.max(...val, maxData);

                        let obj = {
                            data: val,
                            svg: { stroke: init.colors[ind] },
                            strokeWidth: 2,
                        }

                        datasets.push(obj);

                        let legendObj = {
                            name: key,
                            flag: true,
                            color: init.colors[ind],
                        }

                        legend.push(legendObj);

                        ind += 1;
                    }

                    setSvgChart(datasets);
                    setSvgLegend(legend);

                    setSvgMetaData({ min: minData, max: maxData });
                } else {
                    setChartData({});
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    // #region Helper
    const updateLegend = (pos) => {
        let arr = [...svgLegend];

        const { flag } = arr[pos];
        arr[pos].flag = !flag;

        setSvgLegend(arr);
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

                    <BcDateRange
                        startDt={startDt} setStartDt={setStartDt}
                        endDt={endDt} setEndDt={setEndDt}
                    />

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1}>
                            <HStack
                                px={3}
                                flexWrap={"wrap"}
                                rowGap={10}
                                alignItems={"flex-start"}
                                justifyContent={"space-between"}>

                                {
                                    (Object.keys(chartData).length > 0) ? (
                                        <BcViewShot title="Daily Device Report">
                                            <SvgLineChart metaData={svgMetaData} chart={svgChart} labels={svgLabels} />
                                            <Legend data={svgLegend} onUpdateLegend={updateLegend} />
                                        </BcViewShot>
                                    ) : (
                                        <></>
                                    )
                                }

                                {
                                    (Object.keys(chartData).length > 0) ? (
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