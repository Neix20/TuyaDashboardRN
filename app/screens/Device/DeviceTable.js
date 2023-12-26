import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcHeader, BcLoading, BcDateRange, BcSvgIcon, BcDataAttribute } from "@components";

import { fetchDeviceDataChart } from "@api";

import { Svg } from "@config";

import { useToggle, useDate } from "@hooks";

import { DateTime } from "luxon";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function EmptyList(props) {
    return (
        <View justifyContent={"center"} alignItems={"center"} style={{ height: 400 }}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <FontAwesome name={"plug"} color={"#e6e6e6"} size={80} />
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

function DataTable(props) {

    const { data = [] } = props;

    if (data.length == 0) {
        return (
            <EmptyList />
        )
    }

    let keys = Object.keys(data[0]);

    // Only Filter Keys That Are In Svg
    const svg_key = Object.keys(Svg["MetaData_Header"]);
    keys = keys.filter(x => [...svg_key, "Timestamp"].includes(x));

    // #region Render Item
    const renderHeader = (item, ind) => {
        return (
            <View key={ind} alignItems={"center"} flex={1}>
                <BcSvgIcon name={item} size={24} />
            </View>
        )
    }

    const renderValues = (item, index) => {

        const ts = item["Timestamp"];

        // #region Render
        const renderData = (key, jnd) => {
            const val = item[key] || 0;
            return (
                <View key={jnd} alignItems={"center"} flex={1}>
                    <Text>{val}</Text>
                </View>
            )
        }
        // #endregion

        return (
            <HStack key={index} width={"90%"} alignItems={"center"} justifyContent={"space-between"}>
                <View style={{ width: 90 }}>
                    <Text>{Utility.formatDt(ts, "hh:mm a")}</Text>
                </View>
                {
                    keys.slice(1).map(renderData)
                }
            </HStack>
        )
    }
    // #endregion

    return (
        <VStack alignItems={"center"} bgColor={"#FFF"}>
            {/* Data Header */}
            <HStack width={"90%"}
                alignItems={"center"} justifyContent={"space-between"}>
                <View style={{ width: 90 }}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 16
                    }}>{keys[0]}</Text>
                </View>
                {
                    keys.slice(1).map(renderHeader)
                }
            </HStack>
            {data.map(renderValues)}
        </VStack>
    )
}

function DataAttribute(props) {

    const { data = [] } = props;

    if (data.length == 0) {
        return (<></>)
    }


    return (
        <VStack pt={3} space={2}
            alignItems={"center"}
            bgColor={"#FFF"}>
            <View w={'90%'}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 18
                }}>Data Attributes</Text>
            </View>
            <View w={'90%'}>
                <BcDataAttribute {...props} />
            </View>
        </VStack>
    )
}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

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

    const userId = useSelector(Selectors.userIdSelect);

    // #region UseState
    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [data, setData] = useState([]);

    const dateHook = useDate(init.dateObj);
    const [startDt, setStartDt, endDt, setEndDt] = dateHook.slice(0, 4);

    const prevDateHook = useDate(init.cmpDateObj);
    // #endregion

    const { Id: deviceId } = props.route.params;

    useEffect(() => {
        if (isFocused) {
            setLoading(true);

            fetchDeviceDataChart({
                param: {
                    UserId: userId,
                    DeviceId: deviceId,
                    StartDate: startDt,
                    EndDate: `${endDt} 23:59:59`
                },
                onSetLoading: setLoading,
            })
                .then(data => {
                    setData(data);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`)
                })
        }
    }, [isFocused, JSON.stringify(startDt + endDt + deviceId)]);

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Data Table</BcHeader>

                    <View style={{ height: 10 }} />

                    <BcDateRange showCompare={false}
                        hook={dateHook} prevHook={prevDateHook} />

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1}>
                            <DataAttribute data={data} />

                            <View style={{ height: 10 }} />

                            <View py={3}
                                alignItems={"center"}
                                bgColor={"#FFF"}>
                                <View w={'90%'}>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 18
                                    }}>Device Data</Text>
                                </View>
                            </View>
                            <DataTable data={data} />
                        </View>
                    </ScrollView>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;