import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcHeader, BcLoading } from "@components";

import { fetchDeviceDataChart } from "@api";

import { useToggle } from "@hooks";

import { DCHAhux } from "@config";

import { DateTime } from "luxon";

function DataTable(props) {

    const { data = [] } = props;

    const renderValues = (item, index) => {

        const ts = item["Timestamp"];

        const keys = Object.keys(item);

        // #region Render
        const renderData = (key, jnd) => {
            const val = item[key];
            return (
                <View alignItems={"center"} style={{ width: 60 }}>
                    <Text>{val}</Text>
                </View>
            )
        }
        // #endregion

        return (
            <HStack key={index} width={"90%"}
                alignItems={"center"} justifyContent={"space-between"}>
                <View alignItems={"center"} style={{ width: 160 }}>
                    <Text>{Utility.formatDt(ts, "yyyy-MM-dd hh:mm:ss")}</Text>
                </View>
                {
                    keys.slice(2).map(renderData)
                }
            </HStack>
        )
    }

    return (
        <VStack py={3} alignItems={"center"}>
            {data.map(renderValues)}
        </VStack>
    )
}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [data, setData] = useState([]);

    // const { Id: deviceId } = props.route.params;

    useEffect(() => {
        const { Data } = DCHAhux;
        setData(Data);
    }, []);

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Data Table</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1} bgColor={"#FFF"}>
                            <DataTable data={data} />
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;