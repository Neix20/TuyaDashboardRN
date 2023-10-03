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

import { Animation } from "@config";

import { BcBoxShadow, BcSvgIcon, BcLoading, BcYatuHome } from "@components";

import { fetchGetNotification } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import Lottie from "lottie-react-native";

function EmptyList(props) {
    return (
        <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <FontAwesome name={"bell"} color={"#e6e6e6"} size={80} />
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18,
                    color: "#d3d3d3",
                    textAlign: "center",
                    fontWeight: "700"
                }}>
                    Alerts help you to keep tracks of your devices.
                </Text>
            </VStack>
        </View>
    )
}

// #region Components
function Loading(props) {
    return (
        <View flexGrow={1} justifyContent={"center"}>
            <View alignItems={"center"}>
                <Lottie
                    autoPlay
                    source={Animation.YatuLoader}
                    loop={true}
                    style={{
                        width: 360,
                        height: 360
                    }} />
            </View>
            <View
                display={"none"}
                alignItems={"center"}
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 10,
                }}
            >
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                    color: "#2898FF"
                }}>Loading ...</Text>
            </View>
        </View>
    )
}

function Header(props) {

    const { children, onBack = () => { } } = props;

    const navigation = useNavigation();

    const toast = useToast();

    // #region Helper Functions
    const GoBack = () => {
        onBack();
        navigation.goBack();
    }
    // #endregion

    return (
        <BcBoxShadow>
            <View
                p={2}
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
                style={{
                    height: 60,
                    backgroundColor: "#fff",
                }}>
                {/* Front Layer */}
                <TouchableOpacity
                    onPress={GoBack}
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
                    <FontAwesome5 name={"chevron-left"} size={20} color={"#2898FF"} />
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
                    }}>{children}</Text>
                </View>

                <BcYatuHome />
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
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Redux
    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);
    // #endregion

    // #region UseState
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    // #endregion

    const dataKeys = Object.keys(data);

    // #region UseEffect
    useEffect(() => {
        setLoading(true);
        fetchGetNotification({
            param: {
                UserId: userId,
                HomeId: homeId,
            },
            onSetLoading: setLoading
        })
            .then(res => {
                console.log(res);
                setData(res);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`)
            });
    }, [homeId]);
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
            {/* <BcLoading loading={loading} /> */}
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#f6f7fa"} style={{ flex: 1 }}>

                    {/* Header */}
                    <Header>Alert</Header>

                    {/* Body */}

                    <View alignItems={"center"}>
                        {/* Alarm Header */}
                        <AlertHeader />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        {
                            (loading) ? (
                                <Loading />
                            ) : (
                                (dataKeys.length > 0) ? (
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