import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { Images, clsConst } from "@config";

import { BcHeader, BcBoxShadow, BcSvgIcon } from "@components";

import { Linking } from "react-native";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from "@redux";

function AboutBtn(props) {
    const { children = "", name = "", onPress = () => { } } = props;
    return (
        <VStack space={2} alignItems={"center"} flex={1}>
            <TouchableOpacity onPress={onPress} style={{ width: "80%" }}>
                <View alignItems={"center"} justifyContent={"center"}
                    bgColor={"rgba(40, 152, 255, 0.25)"}
                    style={{
                        height: 50,
                        borderRadius: 8,
                    }}>
                    <BcSvgIcon name={name} width={24} height={24} fill={"#2898FF"} />
                </View>
            </TouchableOpacity>
            <View>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 10,
                    color: "#2898FF",
                    textAlign: "center",
                }}>{children}</Text>
            </View>
        </VStack>
    )
}

function Footer(props) {
    const { lang } = props;
    return (
        <View width={"90%"}
            alignItems={"center"}
            justifyContent={"center"}
            style={{ height: 60 }}>
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 14,
                color: "#A6AFB8"
            }}>{Utility.translate("App Version", lang)}</Text>
            <Text style={{
                fontFamily: "Roboto-Medium",
                color: "#2898FF"
            }}>v{clsConst.APP_VERSION}</Text>
        </View>
    );
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const lang = "en";

    // #region Helper
    const contactVigTech = () => {
        Linking.openURL(`tel:${clsConst.VIGTECH_PHONE_NUMBER}`);
    }

    const whatsappVigTech = () => {
        Linking.openURL(`whatsapp://send?phone=+6${clsConst.VIGTECH_BUSINESS_PHONE_NUMBER}`);
    }

    const emailVigTech = () => {
        Linking.openURL(`mailto:${clsConst.VIGTECH_EMAIL}`);
    }
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <BcHeader>{Utility.translate("About Us", lang)}</BcHeader>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} bgColor={"#FFF"} alignItems={"center"}>
                        {/* Last Updated */}
                        <View width={"90%"} justifyContent={"center"} style={{ height: 40 }}>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontWeight: "500",
                                fontSize: 12,
                            }}>{Utility.translate("Version", lang)} 15/05/2023</Text>
                        </View>

                        <View style={{ height: 10 }} />

                        {/* Content */}
                        <VStack
                            space={3}
                            width={"90%"}>

                        </VStack>

                        <View style={{ height: 20 }} />

                        {/* Buttons */}
                        <VStack width={"90%"} space={3}>
                            <View>
                                <Text style={{
                                    fontFamily: "Roboto-Medium",
                                    fontWeight: "500",
                                }}>{Utility.translate("Reach Us", lang)}</Text>
                            </View>

                            <HStack justifyContent={"space-between"}>
                                <AboutBtn name={"PhoneBook"} onPress={contactVigTech}>{clsConst.VIGTECH_PHONE_NUMBER}</AboutBtn>
                                <AboutBtn name={"WhatsApp"} onPress={whatsappVigTech}>{clsConst.VIGTECH_BUSINESS_PHONE_NUMBER}</AboutBtn>
                                <AboutBtn name={"Envelope"} onPress={emailVigTech}>{clsConst.VIGTECH_EMAIL}</AboutBtn>
                            </HStack>
                        </VStack>

                        <View style={{ height: 40 }} />

                        {/* Footer */}
                        <Footer lang={lang} />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Index;