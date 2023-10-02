import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { clsConst } from "@config";

import { BcSvgIcon, BcLoading, BcDisable } from "@components";

import { fetchRequestOtp, fetchLogin } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useTimer, useToggle } from "@hooks";

function Timer(props) {
    const { timer = 0 } = props;

    const style = {
        txtStyle: {
            fontSize: 14,
            fontWeight: "bold"
        }
    }

    if (timer == 0) {
        return (<></>)
    }

    return (
        <Text style={{ fontFamily: "Roboto-Medium" }}>
            <Text>Didn't Receive OTP? </Text>
            <Text style={style.txtStyle}>Resend ({timer}s)</Text>
        </Text>
    )
}

function RequestOtpBtn(props) {

    const { flag = true, onPress = () => { } } = props;

    const Item = () => {
        return (
            <View backgroundColor={"#fff"}
                alignItems={"center"} justifyContent={"center"}
                style={{ width: 100, height: 40 }}>
                <Text style={[{
                    fontSize: 14,
                    fontWeight: "bold",
                }]}>Request OTP</Text>
            </View>
        )
    }

    if (!flag) {
        return (
            <BcDisable>
                <Item />
            </BcDisable>
        )
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <Item />
        </TouchableOpacity>
    )
}

function LoginBtn(props) {

    const { flag = true, onPress = () => { } } = props;

    const Item = () => (
        <View backgroundColor={"#2898FF"}
            alignItems={"center"} justifyContent={"center"}
            style={{ height: 50 }}>
            <Text style={[{
                fontSize: 14,
                fontWeight: "bold",
                color: "white",
            }]}>Login</Text>
        </View>
    )

    if (!flag) {
        return (
            <BcDisable>
                <Item />
            </BcDisable>
        )
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <Item />
        </TouchableOpacity>
    )
}

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
        },
        duration: 30
    }
    // #endregion

    // #region UseState
    const [form, setForm] = useState(init.form);
    const [loading, setLoading] = useState(false);

    const [timer, setTimer] = useTimer(0);

    const [otpFlag, setOtpFlag, toggleOtpFlag] = useToggle(false);
    const [loginFlag, setLoginFlag, toggleLoginFlag] = useToggle(false);
    // #endregion

    const { email, otp, sessionId } = form;

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            clearForm();
            setTimer(0);
        }
    }, [isFocused]);

    useEffect(() => {
        let flag = email.length > 0 && timer == 0;
        flag = flag && Utility.validateEmail(email);
        setOtpFlag(flag);
    }, [email, timer]);

    useEffect(() => {
        let flag = email.length > 0 && otp.length >= 6;
        flag = flag && Utility.validateEmail(email);
        setLoginFlag(flag);
    }, [email, otp])
    // #endregion

    // #region Helper
    const RequestOtp = () => {
        setTimer(init.duration);
        fetchRequestOtp({
            param: {
                Email: email
            },
            onSetLoading: setLoading,
        })
            .then(data => {
                const { Otp, SessionId, MsgTemplate, ShowDebugFlag } = data;
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

                    const { Data: { User_Id, FirstTimeUserId }, ResponseCode } = data;

                    

                    dispatch(Actions.onChangeUserId(User_Id));

                    if (FirstTimeUserId == 1) {
                        dispatch(Actions.onChangeFirstTimeLink(true));
                        navigation.navigate("AuthTuya", {
                            Email: email,
                        })
                    } else {
                        dispatch(Actions.onChangeFirstTimeLink(false));
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

        clearForm();
        setTimer(0);
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
                        <View justifyContent={"center"}
                            style={{ flexGrow: 1 }}>
                            <VStack
                                justifyContent={"space-between"}
                                alignItems={"center"}
                                style={{ height: 500 }}>
                                {/* Logo Header */}
                                <View alignItems={"center"}>
                                    <BcSvgIcon name={"AppLogo"} width={160} height={160} />
                                </View>
                                <VStack width={"80%"} space={3}>
                                    <Text style={{
                                        fontSize: 18,
                                        fontWeight: "bold"
                                    }}>Login</Text>

                                    {/* Email */}
                                    <View>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: "bold"
                                        }}>Email</Text>

                                        <View bgColor={"#EEF3F6"}>
                                            {/* Front Layer */}
                                            <View style={{
                                                position: "absolute",
                                                zIndex: 2,
                                                top: 5,
                                                bottom: 5,
                                                right: 5,
                                            }}>
                                                <RequestOtpBtn flag={otpFlag} onPress={RequestOtp} />
                                            </View>

                                            <TextInput
                                                defaultValue={email}
                                                onChangeText={setEmail}
                                                autoCapitalize={"none"}
                                                multiline={true}
                                                style={{
                                                    fontFamily: "Roboto-Medium",
                                                    fontSize: 16,
                                                    height: 50,
                                                    color: "#000",
                                                }} />
                                        </View>

                                        <View alignItems={"flex-end"}>
                                            <Timer timer={timer} />
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
                                    <LoginBtn flag={loginFlag} onPress={Login} />
                                </VStack>
                            </VStack>
                        </View>

                        {/* Footer */}
                        <View
                            justifyContent={"center"}
                            alignItems={"center"}
                            style={{ height: 60 }}>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 16
                            }}>Powered By {clsConst.ORG_NAME}</Text>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 14
                            }}>© Version {clsConst.APP_VERSION}</Text>
                        </View>
                    </ScrollView>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;