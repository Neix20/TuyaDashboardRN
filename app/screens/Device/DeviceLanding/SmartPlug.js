import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";

import { Images, Svg } from "@config";

import { BcLoading } from "@components";

import { useOrientation } from "@hooks";
import { fetchDeviceInfo } from "@api";

import { DateTime } from "luxon";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import ItemPanel from "./ItemPanel";

// #region Components
function LandingHeaderTxt(props) {
    const { Title = "", Value = "" } = props;
    return (
        <VStack alignItems={"center"}>
            <Text style={{
                fontSize: 18,
                color: "#b2d9c8"
            }}>{Value}</Text>
            <Text style={{
                fontSize: 14,
                color: "#b2d9c8"
            }}>{Title}</Text>
        </VStack>
    )
}

function LandingInfo(props) {
    const { Title = "", Value = "", width = 400 } = props;
    return (
        <View
            alignItems={"center"}
            justifyContent={"center"}
            borderWidth={2}
            borderColor={"#b2d9c8"}
            borderRadius={width * 0.4}
            style={{
                width: width * 0.8,
                height: width * 0.8
            }}>

            <View
                borderWidth={2}
                borderStyle={"dashed"}
                borderColor={"#b2d9c8"}
                borderRadius={width * 0.38}
                style={{
                    position: "absolute",
                    width: width * 0.76,
                    height: width * 0.76
                }}>
            </View>

            <View>
                <Text style={{
                    fontSize: 64,
                    fontFamily: "Roboto-Bold",
                    color: "#b2d9c8"
                }}>{Value}</Text>
            </View>

            {/* Bottom Tab */}
            <View
                bgColor={"#392c44"}
                alignItems={"center"}
                // justifyContent={"center"}
                style={{
                    position: "absolute",
                    bottom: -10,
                    width: width * 0.5,
                    height: 60
                }}>
                <Text style={{
                    fontSize: 16,
                    fontFamily: "Roboto-Medium",
                    color: "#b2d9c8"
                }}>{Title}</Text>
            </View>
        </View>
    )
}

function Header(props) {
    const { children } = props;

    const navigation = useNavigation();
    const goBack = () => {
        navigation.goBack();
    }

    return (
        <View pb={2} justifyContent={"flex-end"}
            style={{ height: 60 }}>
            <HStack px={3}
                alignItems={"center"} justifyContent={"space-between"}>
                <TouchableOpacity onPress={goBack}>
                    <View alignItems={"center"} justifyContent={"center"}
                        style={{ width: 40, height: 40 }}>
                        <FontAwesome5 name={"arrow-left"} color={"#FFF"} size={20} />
                    </View>
                </TouchableOpacity>

                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 20,
                    color: "#FFF",
                }}>{children}</Text>

                <View style={{ width: 40, height: 40 }}></View>
            </HStack>
        </View>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const userId = useSelector(Selectors.userIdSelect);

    // #region Props
    const item = props.route.params;
    const { Id: deviceId, Title } = item;
    // #endregion

    // #region UseState
    const [deviceInfo, setDeviceInfo] = useState({});
    const [loading, setLoading] = useState(false);

    const color = ["#392c44", "#b2d9c8"];

    const orientHook = useOrientation();
    const [width, height] = orientHook.slice(0, 2);
    // #endregion

    // #region UseEffect
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
    // #endregion

    const { MetaData = {}, Online_Status = 0 } = deviceInfo;

    const Current = MetaData["Current (mA)"];
    const Power = MetaData["Power (W)"];
    const Voltage = MetaData["Voltage (V)"];
    const KWh = MetaData["KWh"];

    // #region Navigation
    const GoToInfo = () => navigation.navigate("DeviceInfo", deviceInfo);
    const GoToChart = () => navigation.navigate("DeviceSPChart", deviceInfo);
    const GoToTable = () => navigation.navigate("DeviceTable", deviceInfo);
    const GoToRules = () => navigation.navigate("DeviceRulesInfo", deviceInfo);
    // #endregion

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { ManageDeviceRules = -1} = subUserAccess;

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }} bgColor={"#392c44"}>

                    {/* Header */}
                    <Header>{Title}</Header>

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack flexGrow={1} space={3}>
                            <View alignItems={"center"}>
                                <LandingInfo Title={"Total (KWh)"} Value={KWh} width={width} />
                            </View>

                            <View alignItems={"center"}>
                                <HStack width={"90%"} alignItems={"center"} justifyContent={"space-between"}>
                                    <LandingHeaderTxt Title={"Current (mA)"} Value={Current} />
                                    <LandingHeaderTxt Title={"Power (W)"} Value={Power} />
                                    <LandingHeaderTxt Title={"Voltage (V)"} Value={Voltage} />
                                    <LandingHeaderTxt Title={"Total (KWh)"} Value={KWh} />
                                </HStack>
                            </View>

                            <VStack space={3} alignItems={"center"}>
                                <ItemPanel Icon={FontAwesome5} name={"power-off"} disabled={true} onPress={() => { }}>
                                    <Text style={{
                                        fontSize: 18,
                                        fontFamily: "Roboto-Medium",
                                    }}>
                                        <Text>Status: </Text>
                                        <Text key={Online_Status} style={{
                                            color: (Online_Status == 1) ? "#0F0" : "#F00"
                                        }}>{Online_Status == 1 ? "Online" : "Offline"}</Text>
                                    </Text>
                                </ItemPanel>
                                {/* { (ManageDeviceRules == 1) ? <ItemPanel Icon={FontAwesome5} name={"clipboard-list"} onPress={GoToRules}>Device Rules</ItemPanel> : <></>} */}
                                { (true) ? <ItemPanel Icon={FontAwesome5} name={"clipboard-list"} onPress={GoToRules}>Device Rules</ItemPanel> : <></>}
                                <ItemPanel Icon={FontAwesome5} name={"chart-area"} onPress={GoToChart}>Data Chart</ItemPanel>
                                <ItemPanel Icon={FontAwesome5} name={"table"} onPress={GoToTable}>Data Table</ItemPanel>
                            </VStack>

                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;