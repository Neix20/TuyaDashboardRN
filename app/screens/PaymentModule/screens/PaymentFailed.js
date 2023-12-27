import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcBoxShadow, BcFooter } from "@components";

import { useSafeAreaInsets } from "react-native-safe-area-context";

function Header(props) {
    const { children, onBack = () => { } } = props;
    const { color = "#2898FF", txtColor = "#000", bgColor = "#FFF" } = props;

    return (
        <BcBoxShadow>
            <View
                style={{
                    height: 60,
                    backgroundColor: bgColor,
                }}>

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
                        color: txtColor,
                    }}>{children}</Text>
                </View>
            </View>
        </BcBoxShadow>
    )
}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const onExit = () => {
        navigation.navigate("TabNavigation", {
            screen: "Dashboard"
        })
    }

    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground
                source={Images.sunsetBgII}
                resizeMode={"cover"}
                style={{ flex: 1, opacity: 0.4 }} />

            <View position={"absolute"} style={{ top: insets.top, bottom: insets.bottom, left: 0, right: 0 }}>

                {/* Header */}
                <Header>Payment Failed</Header>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
                        <View width={"90%"}>
                            <BcBoxShadow>
                                <VStack alignItems={"center"} justifyContent={"center"}
                                    p={3} space={3}
                                    bgColor={"#FFF"} style={{ minHeight: 120 }}>
                                    <VStack alignItems={"center"} space={1}>
                                        <Text style={{
                                            fontFamily: "Roboto-Bold",
                                            fontSize: 18
                                        }}>Unsuccessful Payment</Text>
                                        <FontAwesome name={"warning"} color={"#F01421"} size={28} />
                                    </VStack>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 16
                                    }}>Payment has Failed, Please Try Again</Text>
                                </VStack>
                            </BcBoxShadow>
                        </View>
                    </View>
                </ScrollView>

                <BcFooter>
                    <TouchableOpacity onPress={onExit} style={{ width: "80%" }}>
                        <View bgColor={"#F00"} style={{ height: 48 }} alignItems={"center"} justifyContent={"center"}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 16,
                                color: "#FFF"
                            }}>Go To Dashboard</Text>
                        </View>
                    </TouchableOpacity>
                </BcFooter>
            </View>
        </SafeAreaView>
    );
}

export default Index;