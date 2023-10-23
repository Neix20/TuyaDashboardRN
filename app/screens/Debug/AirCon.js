import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";

import { Images, Svg } from "@config";
import { SmartPlugIIData, DashboardSmartPlugData, AirConData } from "@config";

import { BcApacheBarChart, BcHeader } from "@components";

import { useOrientation } from "@hooks";

import { DateTime } from "luxon";

// #region Components
function LandingHeaderTxt(props) {
    const { Title, Value } = props;
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
    const { Title, Value, width = 400 } = props;
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

    const { Power, Mode, Temperature, Fan } = AirConData;

    const color = ["#392c44", "#b2d9c8"];

    const orientHook = useOrientation();
    const [width, height] = orientHook.slice(0, 2);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }} bgColor={"#392c44"}>

                {/* Header */}
                <Header>Air Conditioner</Header>

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <VStack flexGrow={1} space={3}>
                        <View alignItems={"center"}>
                            <LandingInfo Title={"Current Temperature"} Value={`${Temperature} ℃`} />
                        </View>

                        <View alignItems={"center"}>
                            <HStack width={"90%"} alignItems={"center"} justifyContent={"space-between"}>
                                <LandingHeaderTxt Title={"Status"} Value={Power ? "On" : "Off"} />
                                <LandingHeaderTxt Title={"Fan"} Value={Fan} />
                                <LandingHeaderTxt Title={"Temperature"} Value={Temperature} />
                                <LandingHeaderTxt Title={"Mode"} Value={Mode} />
                            </HStack>
                        </View>
                    </VStack>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;