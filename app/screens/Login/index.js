import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { loginWithEmail } from "@volst/react-native-tuya";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcSvgIcon } from "@components";

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region UseState
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // #endregion

    // #region Helper
    const Login = () => {

        setUsername("");
        setPassword("");

        if (username === "root" && password === "root") {
            // GoToWelcomeInfo();
            loginWithEmail({
                countryCode: 'MY',
                email: 'txen2000@gmail.com',
                password: 'arf11234'
            })
                .then(res => {
                    Logger.info({
                        content: res,
                        page: "App",
                        fileName: "tuya_login",
                    });
                })
                .catch(err => {
                    console.log(`Error: ${err}`);
                });

                GoToHome();
        } else {
            toast.show({
                description: "Account / Password is incorrect!"
            })
        }
    }
    // #endregion

    // #region Navigation
    const GoToHome = () => {
        navigation.navigate("TabNavigation", {
            screen: "Dashboard",
        });
    }

    const GoToWelcomeInfo = () => {
        navigation.navigate("WelcomeInfo");
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

                                {/* Username */}
                                <View style={{
                                    width: width - 80
                                }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: "bold"
                                    }}>Username</Text>

                                    <View bgColor={"#EEF3F6"}>
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
                                            defaultValue={username}
                                            onChangeText={setUsername}
                                            autoCapitalize={"none"}
                                            style={{
                                                fontFamily: "Roboto-Medium",
                                                fontSize: 20,
                                                height: 40,
                                                color: "#000"
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
                                    <View bgColor={"#EEF3F6"}>

                                        <TextInput
                                            secureTextEntry
                                            defaultValue={password}
                                            onChangeText={setPassword}
                                            autoCapitalize={"none"}
                                            style={{
                                                fontFamily: "Roboto-Medium",
                                                fontSize: 20,
                                                color: "#000",
                                                height: 40,
                                                placeholder: "Enter OTP"
                                            }} />
                                    </View>
                                </View>

                                {/* Login Btn */}
                                <TouchableOpacity onPress={Login}>
                                    <View backgroundColor={"#2898FF"}
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