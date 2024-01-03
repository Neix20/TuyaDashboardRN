import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView, BackHandler } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { fetchCheckTuyaEmail } from "@api";

import { useToggle, useModalToast } from "@hooks";
import { BcYesNoModal, BaseIIModal } from "@components";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Custom Hooks
function useFlag() {
    const [flag, setFlag] = useState({});

    const { ats = false, rts = false } = flag;

    const toggleAts = () => {
        const next_state = {
            ...flag,
            ats: !ats
        }
        setFlag(_ => next_state);
    }

    const setAtsOn = () => {
        const next_state = {
            ...flag,
            ats: true
        }
        setFlag(_ => next_state);
    }

    const setAtsOff = () => {
        const next_state = {
            ...flag,
            ats: false
        }
        setFlag(_ => next_state);
    }

    const toggleRts = () => {

        const next_state = {
            ...flag,
            rts: !rts
        }
        setFlag(_ => next_state);
    }

    const setRtsOn = () => {
        const next_state = {
            ...flag,
            rts: true
        }
        setFlag(_ => next_state);
    }

    const setRtsOff = () => {
        const next_state = {
            ...flag,
            rts: false
        }
        setFlag(_ => next_state);
    }

    const checkFlag = ats && rts;

    return [flag, setFlag, toggleAts, setAtsOn, setAtsOff, toggleRts, setRtsOn, setRtsOff, checkFlag];
}
// #endregion

// #region Modals
function ATSModal(props) {

    const { onPress = () => { } } = props;

    const [cusToast, showMsg] = useModalToast();

    return (
        <BaseIIModal cusToast={cusToast} style={{ margin: 10 }}
            {...props}>
            <View flexGrow={1} py={8}
                alignItems={"center"}>
                <VStack alignItems={"center"} width={"90%"} space={5}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 20,
                        color: "#000",
                        textAlign: "center",
                    }}>Sorry, we can't sync your account. Please register a Tuya or Smart Life account before continue on Yatu.</Text>
                    <TouchableOpacity onPress={onPress}
                        style={{ height: 48, width: "100%" }}>
                        <View flex={1} backgroundColor={"#2898FF"}
                            borderRadius={8}
                            alignItems={"center"} justifyContent={"center"}>
                            <Text style={[{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#FFF",
                            }]}>Exit</Text>
                        </View>
                    </TouchableOpacity>
                </VStack>
            </View>
        </BaseIIModal>
    )
}

function RtsEmailModal(props) {

    const { onDone = () => { }, emailHook = [] } = props;

    const [cusToast, showMsg] = useModalToast();

    const [email, setEmail] = emailHook;
    const [eFlag, setEFlag, toggleEFlag] = useToggle(false);

    const userId = useSelector(Selectors.userIdSelect);

    useEffect(() => {
        let flag = email.length > 0 && Utility.validateEmail(email);
        setEFlag(_ => flag);
    }, [email]);

    const CheckTuyaEmail = () => {
        fetchCheckTuyaEmail({
            param: {
                UserId: userId,
                TuyaEmail: email
            },
            onSetLoading: () => { }
        })
            .then(data => {
                const { ResponseCode = "", Message = "" } = data;

                if (ResponseCode == "016001") {
                    showMsg(Message);
                } else if (ResponseCode == "00") {
                    onDone();
                    setEmail("");
                } else {
                    showMsg("Please Enter a Valid Email!");
                    setEmail("");
                }

            })
            .catch(err => {
                console.log(`Error: ${err}`);
            })
    }

    const Btn = (props) => {

        const { flag = false, onPress = () => { } } = props;

        if (!flag) {
            return (
                <View backgroundColor={"#F3F8FC"} borderRadius={8}
                    alignItems={"center"} justifyContent={"center"}
                    width={"100%"} style={{ height: 48 }}>
                    <Text style={[{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#5981A6",
                    }]}>Link Email & Sync Account</Text>
                </View>
            )
        }

        return (
            <TouchableOpacity onPress={onPress} style={{ height: 48, width: "100%" }}>
                <View flex={1} backgroundColor={"#2898FF"}
                    borderRadius={8}
                    alignItems={"center"} justifyContent={"center"}>
                    <Text style={[{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#FFF",
                    }]}>Link Email & Sync Account</Text>
                </View>
            </TouchableOpacity>
        )

    }

    return (
        <BaseIIModal cusToast={cusToast} style={{ margin: 10 }} {...props}>
            <View flexGrow={1} py={8}
                alignItems={"center"}>
                <VStack alignItems={"center"} width={"90%"} space={5}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 20,
                        color: "#000",
                        textAlign: "center",
                    }}>Enter your Tuya or Smart Life email</Text>
                    <View width={"100%"} bgColor={"#F3F8FC"}>
                        <TextInput
                            defaultValue={email}
                            onChangeText={setEmail}
                            autoCapitalize={"none"}
                            placeholder={"xxx@gmail.com"}
                            style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 20,
                                color: "#5981A6",
                                height: 48,
                                textAlign: "center"
                            }} />
                    </View>
                    <Btn flag={eFlag} onPress={CheckTuyaEmail} />
                </VStack>
            </View>
        </BaseIIModal>
    )
}
// #endregion

// #region Components
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

    const { flag = false, onPress = () => { } } = props;

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
            <TouchableOpacity onPress={onPress} style={{ width: "80%" }}>
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
// #endregion

// #region Components II
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
    const { disabled = false, flag = false, onPress = () => { } } = props;

    if (!flag) {
        return (
            <TouchableOpacity onPress={onPress} disabled={disabled}
                style={{ flex: 1 }}>
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
        <TouchableOpacity onPress={onPress} disabled={disabled} style={{ flex: 1 }}>
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

    const { title = "", description = "", pos = "", flag = false } = props;
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
                    <ATSBtn onPress={onPressNo}>No</ATSBtn>
                    <ATSBtn flag={flag} onPress={onPressYes}>Yes</ATSBtn>
                </HStack>

            </VStack>
        </View>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [showExitModal, setShowExitModal, toggleExitModal] = useToggle(false);
    const [showAtsModal, setShowAtsModal, toggleAtsModal] = useToggle(false);
    const [showRtsModal, setShowRtsModal, toggleRtsModal] = useToggle(false);

    const flagHook = useFlag();
    const [flag, setFlag, toggleAts, setAtsOn, setAtsOff, toggleRts, setRtsOn, setRtsOff, syncFlag] = flagHook;

    const emailHook = useState("");
    const [email, setEmail] = emailHook;

    const { ats: atsFlag, rts: rtsFlag } = flag;

    // #region Exit
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

    const GoToAuthTuya = () => {
        navigation.navigate("AuthTuya", {
            Email: email
        });
    }

    const onToggleAtsModal = () => {
        setAtsOff();
        toggleAtsModal();
    }

    const onToggleRtsModal = () => {
        setRtsOff();
        toggleRtsModal();
    }

    const onEmailDone = () => {
        setRtsOn();
        setShowRtsModal(false);
    }
    // #endregion

    return (
        <>
            <BcYesNoModal showModal={showExitModal} setShowModal={setShowExitModal}
                title={"Warning"} showCross={false}
                onPressYes={GoBack}
                onPressNo={toggleExitModal}
                description={"Are you sure you want to exit this page?"} />
            <ATSModal showModal={showAtsModal} setShowModal={setShowAtsModal} onPress={GoBack} />
            <RtsEmailModal showModal={showRtsModal} setShowModal={setShowRtsModal} onDone={onEmailDone} emailHook={emailHook} />
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
                                Icon={FontAwesome5} fontName={"user-alt"}
                                onPressYes={toggleAts} flag={atsFlag}
                                onPressNo={onToggleAtsModal} />

                            {/* Is Email Same as Your Tuya / SmartLife ? */}
                            <ATSLogo pos={"2/2"}
                                title={"Is registered email same as your Tuya or Smart Life email?"}
                                description={"Tuya or Smart Life account’s email is needed for Yatu auto-sync to start generating complete data."}
                                Icon={FontAwesome} fontName={"envelope"}
                                onPressYes={toggleRts} flag={rtsFlag}
                                onPressNo={onToggleRtsModal} />
                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <Footer flag={syncFlag} onPress={GoToAuthTuya} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;