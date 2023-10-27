import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { BaseModal, BcApacheChart, BcDropdown } from "@components";

import { useToggle, useModalToast } from "@hooks";
import { CheckBox } from "@rneui/base";

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
                    <View style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1
                    }} />
                    <CheckBox
                        title={name}
                        titleProps={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 16,
                            color: "#000",
                        }}
                        containerStyle={{
                            width: 200,
                            paddingHorizontal: 5,
                            paddingVertical: 0,
                        }}
                        iconType={"material-community"}
                        checkedIcon={"checkbox-marked"}
                        uncheckedIcon={"checkbox-blank-outline"}
                        checked={flag}
                        checkedColor={"#F00"} />
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

    const { hook = [] } = props;

    const [chart, setChart, chartKey, setChartKey, chartData, setChartData, chartLegend, chartKeyOption = [], setChartKeyOption] = hook;

    const [showDaModal, setShowDaModal, toggleDaModal] = useToggle(false);

    const dropdownLs = chartKeyOption.map(x => ({ label: x, value: x }));

    return (
        <VStack space={2}>
            <HStack py={1}
                alignItems={"center"} style={{ height: 48 }}>
                <View flex={.4}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 16
                    }}>Data Attribute</Text>
                </View>
                <View flex={.6}>
                    <BcDropdown key={chartKeyOption.length}
                        items={dropdownLs} placeholder={"Select Data Attribute"}
                        value={chartKey} setValue={setChartKey}
                    />
                </View>
            </HStack>
            <BcApacheChart {...props} />
        </VStack>
    )
}

export default Index;