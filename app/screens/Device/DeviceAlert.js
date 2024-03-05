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

import { BcBoxShadow, BcSvgIcon, BcLoading, BcHeader } from "@components";

import { fetchDeviceNotification } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Components

function EmptyList(props) {
    const style = {
        txt: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: "#d3d3d3",
            textAlign: "center",
            fontWeight: "700"
        }
    }
    return (
        <View flexGrow={1} justifyContent={"center"} alignItems={"center"} bgColor={"#FFF"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <FontAwesome name={"bell"} color={"#e6e6e6"} size={80} />
                <Text style={style.txt}>
                    Alerts help you to keep tracks of your devices.
                </Text>
            </VStack>
        </View>
    )
}

function AlertHeader(props) {
    return (
        <HStack alignItems={"center"}
            style={{ width: "90%", height: 60 }}>
            <View>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                }}>Alarm</Text>
            </View>
        </HStack>
    )
}

function Header(props) {

    const navigation = useNavigation();
    const GoBack = () => navigation.goBack();
    return (
        <BcBoxShadow>
            <View p={2} style={{ height: 60, backgroundColor: "#fff" }}
                alignItems={"flex-end"} justifyContent={"flex-end"}>
                {/* Front Layer */}
                <TouchableOpacity onPress={GoBack}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 120,
                        height: 120,
                        position: "absolute",
                        left: -30,
                        top: -19,
                        zIndex: 1,
                    }}>
                    <FontAwesome5 name={"chevron-left"} size={20} color={require("@utility").Utility.getColor()} />
                </TouchableOpacity>

                <View style={{
                    position: "absolute",
                    height: 120,
                    left: 45,
                    top: -20,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#000",
                    }}>Device Alert</Text>
                </View>

                <TouchableOpacity>
                    <View borderRadius={16} bgColor={require("@utility").Utility.getColor()}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 32, height: 32 }}>
                        <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                    </View>
                </TouchableOpacity>
            </View>
        </BcBoxShadow>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Props
    const { Id: deviceId } = props.route.params;
    // #endregion

    // #region Redux
    const userId = useSelector(Selectors.userIdSelect);
    // #endregion

    // #region UseState
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    // #endregion

    const dataKeys = Object.keys(data);

    // #region UseEffect
    useEffect(() => {
        setLoading(true);
        fetchDeviceNotification({
            param: {
                UserId: userId,
                DeviceId: deviceId,
            },
            onSetLoading: setLoading
        })
            .then(res => {
                setData(res);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`)
            });
    }, [deviceId]);
    // #endregion

    // #region Render
    const renderItem = (item, ind) => {
        const val = data[item];

        // #region Render
        const renderAlertItem = ({ Title, Message }, ind) => {
            return (
                <HStack key={ind}>
                    {/* FontAwesome */}
                    <View flex={.1} style={{ maxWidth: 40 }}>
                        <Ionicons name={"alert-circle"} color={"#F00"} size={24} />
                    </View>

                    {/* Alert */}
                    <View flex={.9}>
                        <BcBoxShadow style={{ width: "100%" }}>
                            <View p={1}
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
                    </View>

                </HStack>
            )
        }
        // #endregion

        return (
            <View>
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
                    {val.map(renderAlertItem)}
                </VStack>
            </View>
        )
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#f6f7fa"} style={{ flex: 1 }}>

                    {/* Header */}
                    <Header />

                    {/* Body */}

                    <View alignItems={"center"}>
                        {/* Alarm Header */}
                        <AlertHeader />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        {
                            (false) ? (
                                <View flexGrow={1} alignItems={"center"}>

                                    {/* Alarm */}
                                    <VStack space={5} width={"90%"}>
                                        {dataKeys.map(renderItem)}
                                    </VStack>

                                    <View style={{ height: 10 }} />

                                </View>
                            ) : (
                                <EmptyList />
                            )
                        }
                    </ScrollView>

                    {/* Footer */}
                    {/* <View style={{ height: 60 }} /> */}
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;