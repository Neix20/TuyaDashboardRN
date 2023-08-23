import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView, Alert } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { Images, Svg } from "@config";

import { BcBoxShadow, BcSvgIcon } from "@components";

// #region Components
function Header(props) {
    const { children } = props;

    return (
        <BcBoxShadow>
            <View
                pb={2}
                alignItems={"center"}
                justifyContent={"flex-end"}
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
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Helper
    const createAlert = () => {
        toast.show({
            description: "Work in progress!"
        })
    }
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <Header>Alert</Header>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View
                        alignItems={"center"}
                        justifyContent={"center"}
                        bgColor={"#FFF"}
                        flexGrow={1}>
                        <VStack 
                            alignItems={"center"}
                            space={10}>
                            <AlertSign />

                            <TouchableOpacity onPress={createAlert}>
                                <View
                                    borderRadius={15}
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                    bgColor={"#2898FF"}
                                    style={{
                                        width: 180,
                                        height: 40,
                                    }}>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 18,
                                        color: "#FFF"
                                    }}>Create Alert</Text>
                                </View>
                            </TouchableOpacity>
                        </VStack>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View
                    bgColor={"#FFF"}
                    style={{ height: 80 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;