import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { iRData } from "@config";

import { LineChart as LineChartSvg, YAxis, XAxis, Path } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

import { CheckBox } from "@rneui/base";

import { BcViewShot, BaseModal } from "@components";

import { useToggle, useChart, useModalToast } from "@hooks";

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
    const { legend = [], onUpdateLegend = () => { } } = props;

    const renderItem = (obj, ind) => {
        const onSelect = () => onUpdateLegend(ind);
        return (
            <CheckBoxLegend key={ind} onPress={onSelect} {...obj} />
        )
    }

    if (legend.length <= 0) {
        return (<></>)
    }

    return (
        <VStack alignItems={"center"} space={1}>
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
                    {legend.map(renderItem)}
                </HStack>
            </View>
        </VStack>
    );
}

function SvgLineChart(props) {

    const { labels = [] } = props;
    const { min = 0, max = 0, dataset = [] } = props;

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

    if (dataset.length == [0] || labels.length == 0) {
        return (<></>)
    }

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
                    data={dataset}
                    style={{ height: 300, width: "90%" }}
                    svg={{ strokeWidth: 2 }}
                    curve={shape.curveNatural}
                    contentInset={{ top: 20, bottom: 20 }}
                ></LineChartSvg>
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

function DataAttributeModal(props) {

    const { showModal, setShowModal } = props;
    const { data = [], chartKey, setChartKey = () => { } } = props;

    const [cusToast, showMsg] = useModalToast();
    const [ls, setLs] = useState([]);

    useEffect(() => {
        let arr = [...data];

        arr = arr.map((obj, ind) => {
            const flag = obj === chartKey;
            return { name: obj, flag, pos: ind };
        });

        setLs(arr);
    }, []);

    const toggleItem = (obj) => {
        const { pos, name } = obj;

        let arr = [...ls];

        for (let ind in arr) {
            arr[ind].flag = false;
        }

        arr[pos].flag = true;
        setChartKey(name);

        setLs(arr);

        setShowModal(false);
    }

    const renderItem = (obj, ind) => {
        const { name, flag } = obj;
        const onSelect = () => toggleItem(obj);
        return (
            <View key={ind} width={"90%"}>
                <TouchableOpacity onPress={onSelect}>
                    <CheckBox
                        title={name}
                        titleProps={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 16,
                            color: "#000",
                        }}
                        containerStyle={{
                            width: "100%",
                            paddingHorizontal: 5,
                            paddingVertical: 0,
                        }}
                        iconType={"material-community"}
                        checkedIcon={"checkbox-marked"}
                        uncheckedIcon={"checkbox-blank-outline"}
                        checked={flag}
                        checkedColor={"#F00"}
                        onPress={onSelect} />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <BaseModal cusToast={cusToast} {...props}>
            <View alignItems={"center"}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 18,
                }}>Data Attributes</Text>
            </View>
            {
                ls.map(renderItem)
            }
        </BaseModal>
    )
}

function BcLineChart(props) {

    const { labels = [], chartData } = props;

    const { chartKey, setChartKey = () => { }, chartKeyOption = [] } = props;
    const { chartLegend, setChartLegend = () => { } } = props;

    const [showLegend, setShowLegend, toggleLegend] = useToggle(true);
    const [showDaModal, setShowDaModal, toggleDaModal] = useToggle(false);

    const updateLegend = (pos) => {
        let arr = [...chartLegend];

        const { flag } = arr[pos];
        arr[pos].flag = !flag;

        setChartLegend(arr)
    }

    return (
        <>
            <DataAttributeModal data={chartKeyOption}
                showModal={showDaModal} setShowModal={setShowDaModal}
                chartKey={chartKey} setChartKey={setChartKey}
            />
            <HStack alignItems={"center"}>
                <TouchableOpacity onPress={toggleDaModal} style={{ flex: 1 }}>
                    <VStack px={3} borderWidth={1} justifyContent={"space-between"} style={{ height: 44 }}>
                        <View>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 16
                            }}>Data Attributes</Text>
                        </View>
                        <View alignItems={"flex-end"}>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 14
                            }}>{chartKey}</Text>
                        </View>
                    </VStack>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleLegend} style={{ flex: 1 }}>
                    <VStack px={3} borderWidth={1} justifyContent={"space-between"} style={{ height: 44 }}>
                        <View>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 16
                            }}>Legend</Text>
                        </View>
                        <View alignItems={"flex-end"}>
                            {
                                (showLegend) ? (
                                    <HStack alignItems={"center"} space={2}>
                                        <FontAwesome5 name={"eye-slash"} size={14} />
                                        <Text style={{
                                            fontFamily: "Roboto-Medium",
                                            fontSize: 14
                                        }}>Hide Legend</Text>
                                    </HStack>
                                ) : (
                                    <HStack alignItems={"center"} space={2}>
                                        <FontAwesome5 name={"eye"} size={14} />
                                        <Text style={{
                                            fontFamily: "Roboto-Medium",
                                            fontSize: 14
                                        }}>Show Legend</Text>
                                    </HStack>
                                )
                            }
                        </View>
                    </VStack>
                </TouchableOpacity>
            </HStack>
            <SvgLineChart key={chartKey} labels={labels} {...chartData} />
            {
                (showLegend) ? (
                    <Legend legend={chartLegend} onUpdateLegend={updateLegend} />
                ) : (
                    <></>
                )
            }
        </>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const init = {
        labels: ["00", "06", "12", "18", "24", "30", "36", "42", "48"]
    }

    const chartHook = useChart("absolute_humidity");
    const chartObj = {
        chart: chartHook[0],
        setChart: chartHook[1],
        chartKey: chartHook[2],
        setChartKey: chartHook[3],
        chartData: chartHook[4],
        setChartData: chartHook[5],
        chartLegend: chartHook[6],
        setChartLegend: chartHook[7],
        chartKeyOption: chartHook[8]
    };

    const { setChart } = chartObj;

    useEffect(() => {
        setChart(iRData);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <View style={{ height: 80 }} />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"}>

                        <View px={3}>
                            <BcViewShot title="Daily Device Report">
                                <BcLineChart labels={init.labels} {...chartObj} />
                            </BcViewShot>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;