import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcBoxShadow } from "@components";

function Header(props) {
    const { children, onBack = () => { } } = props;
    const { color = require("@utility").Utility.getColor(), txtColor = "#000", bgColor = "#FFF" } = props;

    const navigation = useNavigation();
    const toast = useToast();

    // #region Helper Functions
    const GoBack = () => {
        navigation.navigate("LoginII");
    }
    // #endregion

    return (
        <BcBoxShadow>
            <View
                style={{
                    height: 60,
                    backgroundColor: bgColor,
                }}>
                {/* Front Layer */}
                <TouchableOpacity
                    onPress={GoBack}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 120,
                        height: 120,
                        position: "absolute",
                        left: -30,
                        top: -19,
                        zIndex: 1,
                    }}>
                    <FontAwesome5 name={"chevron-left"} size={20} color={color} />
                </TouchableOpacity>

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

    const { Message = "" } = props.route.params;
    // const Message = "";

    const goBack = () => {
        navigation.navigate("LoginII");
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={Images.sunsetBgII}
                resizeMode={"cover"}
                style={{ flex: 1, opacity: 0.4 }} />
            <View position={"absolute"} style={{ top: 0, bottom: 0, left: 0, right: 0 }}>

                {/* Header */}
                <Header>Session Expired</Header>

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
                                        }}>Your session has Expired!</Text>
                                        <FontAwesome5 name={"user-clock"} color={"#F01421"} size={28} />
                                    </VStack>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 16,
                                        textAlign: "justify"
                                    }}>{Message}</Text>
                                </VStack>
                            </BcBoxShadow>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View alignItems={"center"} justifyContent={"center"} style={{ height: 60 }}>
                    <TouchableOpacity onPress={goBack}>
                        <HStack
                            bgColor={require("@utility").Utility.getColor()}
                            borderRadius={8}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{ width: 120, height: 40 }}>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 20,
                                textAlign: "center",
                                color: "#FFF",
                            }}>Back</Text>
                        </HStack>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Index;