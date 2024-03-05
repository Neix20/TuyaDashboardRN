import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcLoading, BcBoxShadow, BcDisable } from "@components";
import { useToggle } from "@hooks";
import { fetchCheckTuyaEmail } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Custom Hooks
function useChangeBg() {
    const imgLs = [Images.sunsetBg, Images.sunsetBgII, Images.sunsetBgIII];

    const [img, setImg] = useState(imgLs[0]);

    const [ind, setInd] = useState(0);

    useEffect(() => {
        setImg(_ => imgLs[ind])
    }, [ind])

    useEffect(() => {
        const tick = () => setInd(val => (val + 1) % imgLs.length);
        const delay = 15 * 1000;

        const timer = setInterval(tick, delay);
        return () => clearInterval(timer);
    }, []);

    return [img];
}
// #endregion

// #region Question Pages
function OwnTuya(props) {

    const { onPressYes = () => { }, onPressNo = () => { } } = props;

    return (
        <VStack flexGrow={1} justifyContent={"center"} space={3}>

            <View alignItems={"center"}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18,
                    textAlign: "center",
                    width: "80%"
                }}>Are you a Tuya/SmartLife User?</Text>
            </View>

            <View alignItems={"center"}>
                <HStack space={3}>
                    <TouchableOpacity onPress={onPressYes}>
                        <HStack
                            bgColor={Utility.getColor()}
                            borderRadius={8}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{ width: 120, height: 40 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                textAlign: "center",
                                color: "#fff",
                            }}>Yes</Text>
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressNo}>
                        <HStack
                            borderRadius={8}
                            bgColor={"#E6E6E6"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{ width: 120, height: 40 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                textAlign: "center",
                                color: "#6A7683",
                            }}>No</Text>
                        </HStack>
                    </TouchableOpacity>
                </HStack>
            </View>
        </VStack>
    )
}

function CheckEmailBtn(props) {

    const { flag = false, onPress = () => { } } = props;

    const Item = () => {
        return (
            <HStack px={3}
                bgColor={Utility.getColor()}
                borderRadius={8}
                alignItems={"center"}
                style={{ height: 40 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 20,
                    textAlign: "center",
                    color: "#fff",
                }}>Link Tuya Email</Text>
            </HStack>
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

function EmailForm(props) {

    const { emailInit = "" } = props;

    const toast = useToast();
    const navigation = useNavigation();

    const { loadHook = [] } = props;
    const [loading, setLoading, toggleLoading] = loadHook;

    const userId = useSelector(Selectors.userIdSelect);

    const [email, setEmail] = useState(emailInit);
    const [eFlag, setEFlag, toggleEFlag] = useToggle(false);

    useEffect(() => {
        let flag = email.length > 0 && Utility.validateEmail(email);
        setEFlag(_ => flag);
    }, [email]);

    const CheckTuyaEmail = () => {
        setLoading(true);
        fetchCheckTuyaEmail({
            param: {
                UserId: userId,
                TuyaEmail: email
            },
            onSetLoading: setLoading
        })
            .then(data => {
                const { ResponseCode = "", Message = "" } = data;

                if (ResponseCode == "016001") {
                    toast.show({
                        description: Message
                    })
                } else if (ResponseCode == "00") {
                    navigation.navigate("AuthTuya", {
                        Email: email
                    });
                    setEmail("");
                } else {
                    toast.show({
                        description: "Please Enter a Valid Email!"
                    })
                    setEmail("");
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }

    return (
        <VStack flexGrow={1} justifyContent={"center"} space={3}>
            <View alignItems={"center"}>
                <View width={"90%"}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: "bold"
                    }}>Email</Text>
                    <View bgColor={"#F3F8FC"}>
                        <TextInput
                            defaultValue={email}
                            onChangeText={setEmail}
                            autoCapitalize={"none"}
                            placeholder={"xxx@gmail.com"}
                            style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 20,
                                color: "#5981A6",
                                height: 50,
                                textAlign: "center"
                            }} />
                    </View>
                </View>
            </View>

            <View alignItems={"center"}>
                <CheckEmailBtn flag={eFlag} onPress={CheckTuyaEmail} />
            </View>
        </VStack>
    )
}

function OnlySmartLife(props) {

    const navigation = useNavigation();
    const goBack = () => {
        navigation.goBack();
    }

    return (
        <VStack flexGrow={1} justifyContent={"center"} space={3}>
            <View alignItems={"center"}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18,
                    textAlign: "center",
                    width: "80%"
                }}>Sorry! Please Register a Tuya / SmartLife Account before proceeding!</Text>
            </View>

            <View alignItems={"center"}>
                <TouchableOpacity onPress={goBack}>
                    <HStack
                        bgColor={Utility.getColor()}
                        borderRadius={8}
                        alignItems={"center"}
                        justifyContent={"center"}
                        style={{ width: 120, height: 40 }}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 20,
                            textAlign: "center",
                            color: "#fff",
                        }}>Exit</Text>
                    </HStack>
                </TouchableOpacity>
            </View>
        </VStack>
    )
}

function SameEmail(props) {

    const { onPressYes = () => { }, onPressNo = () => { } } = props;

    return (
        <VStack flexGrow={1} justifyContent={"center"} space={3}>
            <View alignItems={"center"}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18,
                    textAlign: "center",
                    width: "80%"
                }}>Is your email same as your Tuya Email?</Text>
            </View>

            <View alignItems={"center"}>
                <HStack space={3}>
                    <TouchableOpacity onPress={onPressYes}>
                        <HStack
                            bgColor={Utility.getColor()}
                            borderRadius={8}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{ width: 120, height: 40 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                textAlign: "center",
                                color: "#fff",
                            }}>Yes</Text>
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressNo}>
                        <HStack
                            borderRadius={8}
                            bgColor={"#E6E6E6"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{ width: 120, height: 40 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                textAlign: "center",
                                color: "#6A7683",
                            }}>No</Text>
                        </HStack>
                    </TouchableOpacity>
                </HStack>
            </View>
        </VStack>
    )
}
// #endregion

function QuestionPage(props) {

    const { emailData = "" } = props;

    const [ownTuya, setOwnTuya, toggleOwnTuya] = useToggle(false);
    const [onlySmartLife, setOnlySmartLife, toggleOnlySmartLife] = useToggle(false);
    const [sameEmail, setSameEmail, toggleSameEmail] = useToggle(false);
    const [emailForm, setEmailForm, toggleEmailForm] = useToggle(false);

    const [email, setEmail] = useState("");

    const onSetEmailFormYes = () => {
        toggleEmailForm();
        setEmail(emailData)

    }

    if (emailForm) {
        return (<EmailForm emailInit={email} {...props} />)
    }

    if (onlySmartLife) {
        return (<OnlySmartLife {...props} />)
    }

    if (sameEmail) {
        return (<SameEmail onPressYes={onSetEmailFormYes} onPressNo={toggleEmailForm} {...props} />)
    }

    return (<OwnTuya onPressYes={toggleSameEmail} onPressNo={toggleOnlySmartLife} {...props} />);
}

function Question(props) {

    return (
        <View width={"80%"}>
            <BcBoxShadow style={{ width: "100%", height: 360, borderRadius: 12 }}>
                <VStack flex={1} p={3}
                    bgColor={"#FFF"} borderRadius={12}>

                    {/* Info */}
                    <View pt={5} alignItems={"center"}>
                        <HStack space={3} alignItems={"center"}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18
                            }}>Information</Text>
                            <FontAwesome5 name={"info-circle"} color={"#000"} size={28} />
                        </HStack>
                    </View>

                    {/* Body */}
                    <QuestionPage {...props} />

                    {/* Footer */}
                    <Text style={{
                        fontStyle: "italic"
                    }}>Note: Email has to be a registered SmartLife / Tuya Account</Text>
                </VStack>
            </BcBoxShadow>
        </View>
    )
}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const loadHook = useToggle(false);
    const [loading, setLoading, toggleLoading] = loadHook;

    const [img] = useChangeBg();

    const { Email = "" } = props.route.params;

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <ImageBackground
                    source={img}
                    resizeMode={"cover"}
                    style={{ flex: 1, opacity: 0.4 }} />
                <View position={"absolute"}
                    style={{ top: 0, bottom: 0, left: 0, right: 0 }}>

                    {/* Header */}
                    <BcHeader>Pre-Registration</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1}
                            justifyContent={"center"} alignItems={"center"}>
                            <Question loadHook={loadHook} emailData={Email} />
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;