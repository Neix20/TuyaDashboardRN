import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Animation, Images } from "@config";
import { info, error, Utility } from "@utility";

import { BcSvgIcon, BcBoxShadow, BcHeader } from "@components";

// #region Components
function ProfilePhoto(props) {
    return (
        <BcBoxShadow>
            <VStack
                py={2}
                space={2}
                bgColor={"#FFF"}
                alignItems={"center"}
                style={{ width: width }}>
                {/* Profile Picture */}
                <View >

                    {/* Front Layer */}
                    <View
                        style={{
                            position: "absolute",
                            display: "none",
                            zIndex: 1,
                            bottom: -5,
                            right: -5,
                        }}>
                    </View>
                    <Image
                        source={Images.Profile}
                        style={{
                            width: 200,
                            height: 200,
                            borderRadius: 100,
                        }}
                        alt={"Model"} />
                </View>
            </VStack>
        </BcBoxShadow>
    )
}

function DetailsText(props) {
    const { title, children, disabled = false } = props;

    return (
        <HStack
            bgColor={"#fff"}
            space={3}
            alignItems={"center"}
            justifyContent={"space-between"}
            style={{
                width: width - 40,
            }}
        >
            <Text style={[{
                fontSize: 16,
                color: "#1E1E1E",
                fontFamily: "Roboto-Medium",
            }]}>{title}</Text>
            <Text style={[{
                fontSize: 16,
                color: "#1E1E1E",
                fontFamily: "Roboto-Medium",
                textAlign: "right",
            }]}>{children}</Text>
        </HStack>
    )
}

function Details(props) {
    // const { name, product_name, id, model, icon } = props;
    return (
        <BcBoxShadow>
            <View
                py={3}
                bgColor={"#fff"}
                alignItems={"center"}
                style={{
                    width: width,
                }}>

                <View style={{ width: width - 40 }}>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: "Roboto-Bold",
                        color: "#000"
                    }}>Details</Text>

                    <Divider bgColor={"#EBEBEB"} my={2} />
                </View>
                <VStack space={3}>
                    <DetailsText title={"Name"}>Logan Thornton</DetailsText>
                    <DetailsText title={"Nickname"}>Logan</DetailsText>
                    <DetailsText title={"Gender"}>{"Male"}</DetailsText>
                </VStack>
            </View>
        </BcBoxShadow>
    )
}

function LogOut(props) {
    const { lang } = props;
    const { onLogOut = () => { } } = props;
    return (
        <TouchableOpacity onPress={onLogOut}>
            <BcBoxShadow>
                <View
                    py={3}
                    bgColor={"#fff"}
                    alignItems={"center"}
                    style={{
                        width: width,
                    }}>
                    <View style={{ width: width - 40 }}>
                        <Text style={[{
                            fontSize: 16,
                            color: "#2898FF",
                            fontFamily: "Roboto-Medium",
                        }]}>{Utility.translate("Log Out", lang)}</Text>
                    </View>
                </View>
            </BcBoxShadow>
        </TouchableOpacity>
    )
}

function Header(props) {
    const { children } = props;
    return (
        <BcBoxShadow>
            <View
           alignItems={"center"}
                justifyContent={"center"}
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
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const lang = "en";

    // #region Navigation
    const GoToLogin = () => {
        navigation.navigate("Login");
    }
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <Header>Profile</Header>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <VStack space={2}>
                        {/* Profile Photo */}
                        <ProfilePhoto />

                        {/* Details */}
                        <Details />

                        {/* Log Out */}
                        <LogOut lang={lang} onLogOut={GoToLogin} />

                    </VStack>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 80 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;