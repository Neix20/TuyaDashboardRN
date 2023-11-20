import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcBoxShadow, BcFooter } from "@components";

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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <Header>Payment Failed</Header>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
                        <BcBoxShadow>
                            <View alignItems={"center"} justifyContent={"center"} width={"80%"} px={3} bgColor={"#FFF"} style={{ height: 120 }}>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    fontSize: 16
                                }}>Payment has Failed, Please Try Again</Text>
                            </View>
                        </BcBoxShadow>

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