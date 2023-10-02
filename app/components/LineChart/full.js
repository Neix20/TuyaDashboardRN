import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { BcViewShot, BaseModal, BcLineChart } from "@components";

import { useToggle, useModalToast } from "@hooks";
import { CheckBox } from "@rneui/base";

import Legend from "./Legend";

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

    const { labels = [], hook = [], legendHook = [] } = props;

    const [chart, setChart, chartKey, setChartKey, chartData, setChartData, chartLegend, setChartLegend, chartKeyOption, setChartKeyOption] = hook;
    const showLegend = legendHook[0];

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
            <VStack>
                <TouchableOpacity onPress={toggleDaModal}>
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
                <BcLineChart key={chartKey} labels={labels} {...chartData} />
                {
                    (showLegend) ? (
                        <Legend legend={chartLegend} onUpdateLegend={updateLegend} />
                    ) : (
                        <></>
                    )
                }
            </VStack>
        </>
    )
}

export default Index;