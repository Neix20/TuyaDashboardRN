import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { BcViewShot, BaseModal, BcLineChart } from "@components";

import { useToggle, useModalToast } from "@hooks";
import { CheckBox } from "@rneui/base";

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

function Index(props) {

    const { labels = [], hook = [] } = props;

    const [ chart, setChart, chartKey, setChartKey, chartData, setChartData, chartLegend, setChartLegend, chartKeyOption, setChartKeyOption ] = hook;

    const [showLegend, setShowLegend, toggleLegend] = useToggle(false);
    const [showDaModal, setShowDaModal, toggleDaModal] = useToggle(false);

    const updateLegend = (pos) => {
        let arr = [...chartLegend];

        const { flag } = arr[pos];
        arr[pos].flag = !flag;

        setChartLegend(arr)
    }

    return (
        <>
            <DataAttributeModal key={chartKeyOption.length}
                data={chartKeyOption}
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
            <BcLineChart key={chartKey} labels={labels} {...chartData} />
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

export default Index;