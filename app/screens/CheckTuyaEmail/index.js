import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView, BackHandler } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { useToggle } from "@hooks";
import { BcYesNoModal } from "@components";

function Header(props) {
    return (
        <View alignItems={"center"}>
            <View width={"80%"}
                justifyContent={"center"}
                style={{ height: 100 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 20
                }}>
                    New User Checkpoint
                </Text>
            </View>
        </View>
    )
}

function Footer(props) {

    const { flag = false } = props;

    if (!flag) {
        return (
            <View alignItems={"center"} justifyContent={"center"} style={{ height: 100 }}>
                <View width={"80%"} borderRadius={8}
                    alignItems={"center"} justifyContent={"center"}
                    bgColor={"#FFF"} style={{ height: 60 }}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#5981A6"
                    }}>Sync my Account</Text>
                </View>
            </View>
        )
    }

    return (
        <View alignItems={"center"} justifyContent={"center"} style={{ height: 100 }}>
            <TouchableOpacity style={{ width: "80%" }}>
                <View borderRadius={8}
                    alignItems={"center"} justifyContent={"center"}
                    bgColor={"#2898FF"} style={{ height: 60 }}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#FFF"
                    }}>Sync my Account</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

function TuyaSmartLogo(props) {
    const style = {
        img: {
            width: 40,
            height: 40,
            borderRadius: 8
        }
    }
    return (
        <HStack alignItems={"center"} space={3}>
            <Image source={Images.TuyaLogo} style={style.img} alt={"Tuya Logo"} />
            <Image source={Images.SmartLifeLogo} style={style.img} alt={"Smart Life Logo"} />
        </HStack>
    )
}

function ATSBtn(props) {
    const { children } = props;
    const { flag = false, onPress = () => { } } = props;

    if (!flag) {
        return (
            <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
                <View flex={1} bgColor={"#FFF"}
                    alignItems={"center"} justifyContent={"center"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#5981A6"
                    }}>{children}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
            <View flex={1} bgColor={"#FFF"}
                alignItems={"center"} justifyContent={"center"}>
                <HStack alignItems={"center"} space={3}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#5981A6"
                    }}>{children}</Text>
                    <FontAwesome name={"check-circle"} size={24} color={"#39B54A"} />
                </HStack>
            </View>
        </TouchableOpacity>
    )
}

function ATSLogo(props) {

    const { title = "", description = "", pos = "" } = props;
    const { Icon = () => { }, fontName = "" } = props;
    const { onPressNo = () => { }, onPressYes = () => { } } = props;

    return (
        <View alignItems={"center"}>
            <VStack space={3} width={"80%"}>
                <View>
                    <HStack
                        alignItems={"flex-end"}
                        justifyContent={"space-between"}>
                        <View >
                            {/* Front Layer */}
                            <View position={"absolute"} zIndex={2} style={{ top: 40, left: 80 }}>
                                <TuyaSmartLogo />
                            </View>
                            <Icon name={fontName} size={96} color={"#B6DBFD"} />
                        </View>
                        <View>
                            <Text>{pos}</Text>
                        </View>
                    </HStack>
                    <Divider bgColor={"#EBEBEB"} />
                </View>

                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 20,
                    textAlign: "justify"
                }}>{title}</Text>

                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 16,
                    textAlign: "justify"
                }}>{description}</Text>

                {/* Buttons */}
                <HStack space={5} style={{ height: 40 }}>
                    <ATSBtn>No</ATSBtn>
                    <ATSBtn>Yes</ATSBtn>
                </HStack>

            </VStack>
        </View>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Exit
    const [showExitModal, setShowExitModal, toggleExitModal] = useToggle(false);

    useEffect(() => {
        const backAction = () => {
            if (!isFocused) {
                return false;
            }

            toggleExitModal();
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [isFocused]);

    const GoBack = () => {
        navigation.goBack();
    }
    // #endregion

    return (
        <>
            <BcYesNoModal showModal={showExitModal} setShowModal={setShowExitModal} 
                title={"Warning"} showCross={false}
                onPressYes={GoBack}
                onPressNo={toggleExitModal}
                description={"Are you sure you want to exit this page?"} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#F3F8FC"} style={{ flex: 1 }}>

                    {/* Header */}
                    <Header />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack space={5} flexGrow={1}>
                            {/* Are you a Tuya or SmartLife User */}
                            <ATSLogo pos={"1/2"}
                                title={"Are you a Tuya or Smart Life user?"}
                                description={"Yatu is advanced monitoring app for Tuya or Smart Life smart devices. Data will be synced for analysis."}
                                Icon={FontAwesome5} fontName={"user-alt"} />
                            <ATSLogo pos={"2/2"}
                                title={"Is registered email same as your Tuya or Smart Life email?"}
                                description={"Tuya or Smart Life account’s email is needed for Yatu auto-sync to start generating complete data."}
                                Icon={FontAwesome} fontName={"envelope"} />

                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <Footer />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;