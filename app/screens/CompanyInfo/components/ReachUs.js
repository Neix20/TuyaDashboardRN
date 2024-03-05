import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Linking } from "react-native";
import { View, VStack, HStack } from "native-base";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { clsConst } from "@config";
import { BcSvgIcon } from "@components";

import { Utility } from "@utility";

function ReachUsBtn(props) {
    const { children = "", onPress = () => { } } = props;
    const { Btn, btnName = "" } = props;

    const style = {
        btnBg: {
            backgroundColor: "rgba(40, 152, 255, 0.25)",
            height: 50,
            borderRadius: 8,
        },
        btnTitle: {
            fontFamily: "Roboto-Medium",
            fontSize: 10,
            color: Utility.getColor(),
            textAlign: "center"
        }
    }

    return (
        <VStack space={2} alignItems={"center"} flex={1}>
            <TouchableOpacity onPress={onPress} style={{ width: "100%" }}>
                <View alignItems={"center"} justifyContent={"center"} style={style.btnBg}>
                    <Btn name={btnName} size={24} color={require("@utility").Utility.getColor()} />
                </View>
            </TouchableOpacity>
            <Text style={style.btnTitle}>{children}</Text>
        </VStack>
    )
}

function Index(props) {

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontWeight: "500",
        }
    }

    const contactVigTech = () => {
        Linking.openURL(`tel:${phone_no}`);
    }

    const browseYatu = () => {
        Linking.openURL(clsConst.YATU_URL);
    }

    const emailVigTech = () => {
        Linking.openURL(`mailto:${email}`);
    }

    return (
        <VStack space={3} width={"90%"}>
            <Text style={style.title}>Reach Us</Text>
            <HStack space={3} alignItems={"flex-start"} justifyContent={"space-between"}>
                <ReachUsBtn Btn={BcSvgIcon} btnName={"PhoneBook"} onPress={contactVigTech}>{clsConst.VIGTECH_PHONE_NUMBER}</ReachUsBtn>
                <ReachUsBtn Btn={MaterialCommunityIcons} btnName={"web"} onPress={browseYatu}>{clsConst.YATU_URL}</ReachUsBtn>
                <ReachUsBtn Btn={BcSvgIcon} btnName={"Envelope"} onPress={emailVigTech}>{clsConst.VIGTECH_EMAIL}</ReachUsBtn>
            </HStack>
        </VStack>
    )
}

export default Index;