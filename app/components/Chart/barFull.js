import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { BaseModal, BcApacheBarChart, BcDropdown } from "@components";

import { useToggle } from "@hooks";

function Index(props) {

    const { hook = [] } = props;

    const [chart, setChart, chartKey, setChartKey, chartData, setChartData, chartLegend, chartKeyOption = [], setChartKeyOption] = hook;

    const [showDaModal, setShowDaModal, toggleDaModal] = useToggle(false);

    const dropdownLs = chartKeyOption.map(x => ({ label: x, value: x }));

    return (
        <BcApacheBarChart {...props} />
    )

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
            <BcApacheBarChart {...props} />
        </VStack>
    )
}

export default Index;