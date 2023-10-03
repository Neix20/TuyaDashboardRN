import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { Images } from "@config";

import { BcBoxShadow, BcLoading } from "@components";

import { fetchDeviceInfo } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Components
function Header(props) {

    const { children, onBack = () => { } } = props;
    const { onSelectEdit = () => { } } = props;

    const navigation = useNavigation();

    const toast = useToast();

    // #region Helper Functions
    const GoBack = () => {
        onBack();
        navigation.goBack();
    }
    // #endregion

    return (
        <View
            p={2}
            alignItems={"flex-end"}
            justifyContent={"flex-end"}
            style={{
                height: 60
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
                <FontAwesome5 name={"chevron-left"} size={20} color={"#FFF"} />
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
                    color: "#FFF",
                }}>{children}</Text>
            </View>

            {/* <TouchableOpacity onPress={onSelectEdit}>
                <FontAwesome5 name={"edit"} size={24} color={"#FFF"} />
            </TouchableOpacity> */}
        </View>
    )
}

function ItemPanel(props) {

    const { Icon, name } = props;

    const { children } = props;

    return (
        <View
            width={"90%"} bgColor={"#FFF"}
            alignItems={"center"} justifyContent={"center"}
            borderRadius={12} style={{ height: 60 }}>
            <TouchableOpacity {...props} style={{ width: "90%" }}>
                <HStack alignItems={"center"} space={3}>
                    <Icon name={name} color={"#000"} size={24} />
                    <Text style={[{
                        fontSize: 18,
                        color: "#000",
                        fontFamily: "Roboto-Medium",
                    }]}>{children}</Text>
                </HStack>
            </TouchableOpacity>
        </View>
    )
}

function DeviceDataPanel(props) {
    const { Title, Temperature, Humidity } = props;
    return (
        <VStack space={5} height={"100%"}
            alignItems={"center"} justifyContent={"flex-end"}>
            <View>
                <Text style={{
                    fontSize: 24,
                    fontFamily: "Roboto-Medium",
                    color: "#FFF"
                }}>{Title}</Text>
            </View>
            <HStack width={"90%"}
                alignItems={"center"} justifyContent={"space-between"}>
                <VStack alignItems={"center"}>
                    <Text style={{
                        fontSize: 24,
                        fontFamily: "Roboto-Medium",
                        color: "#FFF"
                    }}>Temperature</Text>
                    <Text style={{
                        fontSize: 56,
                        fontFamily: "Roboto-Bold",
                        color: "#FFF"
                    }}>{(Temperature / 10).toFixed(1)}℃</Text>
                </VStack>
                <Divider orientation={"vertical"} style={{ width: 3 }} bgColor={"#FFF"} />
                <VStack alignItems={"center"}>
                    <Text style={{
                        fontSize: 24,
                        fontFamily: "Roboto-Medium",
                        color: "#FFF"
                    }}>Humidity</Text>
                    <Text style={{
                        fontSize: 56,
                        fontFamily: "Roboto-Bold",
                        color: "#FFF"
                    }}>{Humidity}%</Text>
                </VStack>
            </HStack>
        </VStack>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Initital
    const init = {
        svgLs: ["CardGradientRed", "CardGradientGreen", "CardGradientOrange", "CardGradientBlue"]
    }
    // #endregion

    const userId = useSelector(Selectors.userIdSelect);

    // #region Props
    const item = props.route.params;
    const { Id: deviceId } = item;
    // #endregion

    const [deviceInfo, setDeviceInfo] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchDeviceInfo({
                param: {
                    UserId: userId,
                    DeviceId: deviceId,
                },
                onSetLoading: setLoading,
            })
                .then(data => {
                    setDeviceInfo(data)
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [deviceId]);

    // #region Navigation
    const GoToInfo = () => navigation.navigate("DeviceInfo", deviceInfo);
    const GoToAlert = () => navigation.navigate("DeviceAlert", deviceInfo);
    const GoToChart = () => navigation.navigate("DeviceChart", deviceInfo);
    const GoToTable = () => navigation.navigate("DeviceTable", deviceInfo);
    const GoToRules = () => navigation.navigate("DeviceRulesInfo", deviceInfo);

    // #endregion

    const ind = 3;

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Background */}
                    <View flexGrow={1}>
                        <View flex={.4}>
                            <Image source={Images[init.svgLs[ind]]}
                                style={{
                                    width: "100%",
                                    height: "100%"
                                }}
                                resizeMode="cover"
                                alt={"Card Gradient"}
                            />
                        </View>
                    </View>

                    <View position={"absolute"}
                        style={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                        {/* Header */}
                        <Header onSelectEdit={GoToInfo}>Device Information</Header>

                        <View style={{ height: 10 }} />

                        {/* Body */}
                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1 }}>
                            <VStack flexGrow={1} alignItems={"center"} space={3}>
                                <View flex={.25}>
                                    <DeviceDataPanel {...deviceInfo} />
                                </View>
                                <VStack
                                    flex={.75} space={5} width={"100%"} alignItems={"center"}>
                                    <ItemPanel Icon={FontAwesome5} name={"info-circle"} onPress={GoToInfo}>Device Info</ItemPanel>
                                    <ItemPanel Icon={FontAwesome5} name={"clipboard-list"} onPress={GoToRules}>Device Rules</ItemPanel>
                                    {/* <ItemPanel Icon={FontAwesome5} name={"bell"} onPress={GoToAlert}>Device Alert</ItemPanel> */}
                                    <ItemPanel Icon={FontAwesome5} name={"chart-area"} onPress={GoToChart}>Data Chart</ItemPanel>
                                    <ItemPanel Icon={FontAwesome5} name={"table"} onPress={GoToTable}>Data Table</ItemPanel>
                                </VStack>
                            </VStack>
                        </ScrollView>

                        {/* Footer */}
                        {/* <View style={{ height: 60 }} /> */}
                    </View>
                </View>
            </SafeAreaView>

        </>
    );
}

export default Index;