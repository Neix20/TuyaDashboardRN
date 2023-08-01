import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { Images, Animation } from "@config";

import { BcSvgIcon } from "@components";

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Navigation
    const GoToHome = () => {
        navigation.navigate("TabNavigation");
    }
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View 
                bgColor={"#FFF"}
                style={{ flex: 1 }}>

                {/* Header */}
                <View style={{ height: 80 }} />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View
                        style={{ flexGrow: 1 }}
                        justifyContent={"center"}>
                        <VStack
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            style={{
                                height: 450
                            }}>
                            {/* Logo Header */}
                            <View alignItems={"center"}>
                                <BcSvgIcon 
                                    name={"AppLogo"} 
                                    width={160} 
                                    height={160} />
                            </View>
                            <VStack space={3}>
                                {/* Login Header */}
                                <View
                                    justifyContent={"center"}
                                    style={{
                                        height: 40,
                                        width: width - 80,
                                    }}>
                                    <Text style={{
                                        fontSize: 24,
                                        fontFamily: "Roboto-Bold"
                                    }}>Log In</Text>
                                </View>

                                {/* Mobile No */}
                                <View style={{
                                    width: width - 80
                                }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: "bold"
                                    }}>Username</Text>

                                    <View bgColor={"#ddd"}>
                                        {/* Front Layer */}
                                        {/* <View style={{
                                            position: "absolute",
                                            zIndex: 2,
                                            top: 5,
                                            bottom: 5,
                                            right: 5,
                                        }}>
                                            <TouchableOpacity>
                                                <View backgroundColor={"#fff"}
                                                    alignItems={"center"} justifyContent={"center"}
                                                    style={{
                                                        width: 100,
                                                        height: 40
                                                    }}
                                                >
                                                    <Text style={[{
                                                        fontSize: 14,
                                                        fontWeight: "bold",

                                                    }]}>Request OTP</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View> */}
                                        
                                        <TextInput
                                            keyboardType={"numeric"}
                                            style={{
                                                fontFamily: "Roboto-Medium",
                                                fontSize: 20,
                                                color: "#000",
                                                maxWidth: 210
                                            }} />
                                    </View>
                                </View>

                                {/* Enter OTP */}
                                <View style={{
                                    width: width - 80
                                }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: "bold"
                                    }}>Password</Text>
                                    <View bgColor={"#ddd"}>

                                        <TextInput
                                            keyboardType={"visible-password"}
                                            style={{
                                                fontFamily: "Roboto-Medium",
                                                fontSize: 20,
                                                color: "#000",
                                                maxWidth: 210,
                                                placeholder: "Enter OTP"
                                            }} />
                                    </View>
                                </View>

                                {/* Login Btn */}
                                <TouchableOpacity onPress={GoToHome}>
                                    <View backgroundColor={"#F00"}
                                        alignItems={"center"} justifyContent={"center"}
                                        style={{
                                            width: width - 80,
                                            height: 48
                                        }}
                                    >
                                        <Text style={[{
                                            fontSize: 14,
                                            fontWeight: "bold",
                                            color: "white",
                                        }]}>Login</Text>
                                    </View>
                                </TouchableOpacity>
                            </VStack>
                        </VStack>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 80 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;