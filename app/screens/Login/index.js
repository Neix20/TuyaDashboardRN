import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcSvgIcon, BcLoading } from "@components";

import { fetchRequestOtp, fetchLogin } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { loginWithEmail } from "@volst/react-native-tuya";

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    // #region Initial
    const init = {
        form: {
            email: "",
            otp: "",
            sessionId: "",
        }
    }
    // #endregion

    // #region UseState
    const [form, setForm] = useState(init.form);
    const [loading, setLoading] = useState(false);
    // #endregion

    const { email, otp, sessionId } = form;

    // #region Helper
    const RequestOtp = () => {
        setLoading(true);
        fetchRequestOtp({
            param: {
                Email: email
            },
            onSetLoading: setLoading,
        })
        .then(data => {
            const { Otp, SessionId, MsgTemplate, ShowDebugFlag } = data;

            console.log(`DebugFlag: ${ShowDebugFlag}`);
            if (ShowDebugFlag) {
                toast.show({
                    description: MsgTemplate
                })
            }

            setForm({
                ...form,
                sessionId: SessionId
            })


        })
        .catch(err => {
            setLoading(false);
            console.log(`Error: ${err}`);
        })
    }

    const Login = () => {
        setLoading(true);
        fetchLogin({
            param: {
                Email: email,
                Otp: otp,
                SessionId: sessionId
            },
            onSetLoading: setLoading,
        })
            .then(data => {
                if (data !== null) {

                    const { Data: { User_Id, FirstTimeUserId } } = data;

                    dispatch(Actions.onChangeUserId(User_Id));

                    if (FirstTimeUserId == 1) {
                        navigation.navigate("AuthTuya", {
                            Email: email,
                        })
                    } else {                        
                        GoToHome();
                    }
                } else {
                    toast.show({
                        description: "Account / otp is incorrect!"
                    })
                }
                clearForm();
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }

    const onChangeForm = (name, val) => {
        let obj = { ...form };
        obj[name] = val;
        setForm(obj);
    }

    const clearForm = () => setForm(init.form);

    const setEmail = (val) => onChangeForm("email", val);
    const setOtp = (val) => onChangeForm("otp", val);
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
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View
                    bgColor={"#FFF"}
                    style={{ flex: 1 }}>

                    <View style={{ height: 40 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View
                            style={{ flexGrow: 1 }}
                            justifyContent={"center"}>
                            <VStack
                                justifyContent={"space-between"}
                                alignItems={"center"}
                                style={{ height: 450 }}>
                                {/* Logo Header */}
                                <View alignItems={"center"}>
                                    <BcSvgIcon
                                        name={"AppLogo"}
                                        width={160}
                                        height={160} />
                                </View>
                                <VStack width={"80%"}
                                    space={3}>
                                    {/* OTP */}
                                    <View>
                                        <View>
                                            <Text style={{
                                                fontSize: 14,
                                                fontWeight: "bold"
                                            }}>Email</Text>
                                        </View>

                                        <View
                                            bgColor={"#EEF3F6"}>
                                            {/* Front Layer */}
                                            <View style={{
                                                position: "absolute",
                                                zIndex: 2,
                                                top: 5,
                                                bottom: 5,
                                                right: 5,
                                            }}>
                                                <TouchableOpacity onPress={RequestOtp}>
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
                                            </View>

                                            <TextInput
                                                defaultValue={email}
                                                onChangeText={setEmail}
                                                autoCapitalize={"none"}
                                                style={{
                                                    fontFamily: "Roboto-Medium",
                                                    fontSize: 20,
                                                    height: 50,
                                                    color: "#000",
                                                }} />
                                        </View>
                                    </View>

                                    {/* Enter OTP */}
                                    <View>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: "bold"
                                        }}>OTP</Text>
                                        <View bgColor={"#EEF3F6"}>

                                            <TextInput
                                                defaultValue={otp}
                                                onChangeText={setOtp}
                                                autoCapitalize={"none"}
                                                keyboardType={"numeric"}
                                                style={{
                                                    fontFamily: "Roboto-Medium",
                                                    fontSize: 20,
                                                    color: "#000",
                                                    height: 50,
                                                    placeholder: "Enter OTP"
                                                }} />
                                        </View>
                                    </View>

                                    {/* Login Btn */}
                                    <TouchableOpacity onPress={Login}>
                                        <View backgroundColor={"#2898FF"}
                                            alignItems={"center"} justifyContent={"center"}
                                            style={{ height: 50 }}>
                                            <Text style={[{
                                                fontSize: 14,
                                                fontWeight: "bold",
                                                color: "white",
                                            }]}>Login</Text>
                                        </View>
                                    </TouchableOpacity>
                                </VStack>
                            </VStack>

                            {/* Footer */}
                            <View style={{ height: 40 }} />
                        </View>
                    </ScrollView>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;