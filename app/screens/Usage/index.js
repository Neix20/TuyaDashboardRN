import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { Images, Svg, GlobalStyles, GlobalColors } from "@config";

import {BcBoxShadow, BcSvgIcon} from "@components";

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
                    style={{ width: width - 40 }}
                    alignItems={"center"}
                    justifyContent={"space-between"}>
                    {/* Logo */}
                    <BcSvgIcon name={"Yatu"} width={80} height={40} />
                </HStack>
            </View>
        </BcBoxShadow>
    )
}

function EmptyList(props) {
    const { lang } = props;
    return (
        <View
            style={{ flexGrow: 1 }}
            alignItems={"center"}
            justifyContent={"center"}>
            <Text style={{
                fontSize: 22,
                fontWeight: '700',
                fontFamily: 'Roboto-Medium',
            }}>{Utility.translate("Empty List", lang)}</Text>
        </View>
    )
}

function UsageSign(props) {
    return (
        <VStack space={2} 
            alignItems={"center"} 
            style={{ width: width - 40 }}>

            <FontAwesome name={"bolt"} 
                color={"#e6e6e6"} 
                size={80} />

            <Text style={{
                fontFamily: "Roboto-Medium",
                fontSize: 18,
                color: "#d3d3d3",
                textAlign: "center",
            }}>
                We provide a variety of case scenario for any business model
            </Text>
        </VStack>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const lang = "en";

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
        
                {/* Header */}
                <Header />
        
                <View style={{ height: 10 }} />
        
                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1}
                        bgColor={"#FFF"} 
                        justifyContent={"center"} 
                        alignItems={"center"}>
                        <UsageSign />
                    </View>
                </ScrollView>
        
                {/* Footer */}
                <View style={{ height: 80 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;