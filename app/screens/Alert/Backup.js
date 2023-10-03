import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { Images, Svg, AlertDataList } from "@config";

import { BcBoxShadow, BcSvgIcon } from "@components";

import { fetchGetNotification } from "@api";

// #region Components
function Header(props) {
    const { children } = props;
    return (
        <BcBoxShadow>
            <View
                alignItems={"center"}
                justifyContent={"center"}
                style={{
                    height: 60,
                    width: width,
                    backgroundColor: "#fff",
                }}>
                <HStack
                    style={{ width: width - 40 }}>
                    {/* Logo */}
                    <BcSvgIcon name={"Yatu"} width={80} height={40} />
                </HStack>
            </View>
        </BcBoxShadow>
    )
}

function AlertSign(props) {
    return (
        <VStack space={2}
            alignItems={"center"}
            style={{ width: width - 40 }}>
            <FontAwesome name={"bell"} color={"#e6e6e6"} size={80} />
            <Text style={{
                fontFamily: "Roboto-Medium",
                fontSize: 18,
                color: "#d3d3d3",
                textAlign: "center",
            }}>
                Alerts help you to keep tracks of your devices.
            </Text>
        </VStack>
    )
}

function AlertHeader(props) {
    return (
        <HStack alignItems={"center"}
            style={{ width: width - 40, height: 60 }}>
            <View>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                }}>Alarm</Text>
            </View>
        </HStack>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region UseState
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        // let arr = [...data].slice(0, 5);
        if (isFocused) {
            fetchGetNotification({
                param: {
                    UserId: 2
                },
                onSetLoading: setLoading
            })
                .then(res => {
                    setData(res);
                })
                .catch(err => {
                    console.log(`Error: ${err}`)
                });
        }
    }, [isFocused]);
    // #endregion

    // #region Render
    const renderItem = (item, ind) => {
        const val = data[item];
        return (
            <View style={{ width: width - 40 }}>
                {/* Date */}
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 28,
                }}>
                    {Utility.formatDt(item, "dd") + " "}
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18
                    }}>
                        {Utility.formatDt(item, "MMM")}
                    </Text>
                </Text>

                {/* Item */}
                <VStack space={3}>
                    {
                        val.map((obj, ind) => {
                            const { Title, Message } = obj;
                            return (
                                <HStack style={{ width: width - 40 }}>
                                    {/* FontAwesome */}
                                    <View style={{ width: 40 }}>
                                        <Ionicons name={"alert-circle"} color={"#F00"} size={24} />
                                    </View>

                                    {/* Alert */}
                                    <BcBoxShadow style={{ borderRadius: 8, width: width - 80 }}>
                                        <View p={1} flex={1}
                                            bgColor={"#FFF"}
                                            borderRadius={8}>
                                            <Text style={{
                                                fontFamily: "Roboto-Bold",
                                                fontSize: 18
                                            }}>{Title}</Text>

                                            <Text style={{
                                                fontFamily: "Roboto-Medium",
                                                fontSize: 14
                                            }}>{Message}</Text>
                                        </View>
                                    </BcBoxShadow>

                                </HStack>
                            )
                        })
                    }
                </VStack>
            </View>
        )
    }
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View bgColor={"#f6f7fa"} style={{ flex: 1 }}>

                {/* Header */}
                <Header>Alert</Header>

                {/* Body */}

                <View alignItems={"center"}>
                    {/* Alarm Header */}
                    <AlertHeader />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} alignItems={"center"}>

                        {/* Alarm */}
                        <VStack space={5}>
                        {
                            Object.keys(data).map(renderItem)
                        }
                        </VStack>

                        <View style={{ height: 10 }} />

                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;