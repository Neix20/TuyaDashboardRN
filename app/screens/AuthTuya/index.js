import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused, useRoute } from "@react-navigation/native";

import { Logger, Utility } from "@utility";
import { Animation, Images, clsConst } from "@config";

import Lottie from "lottie-react-native";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { fetchAuthTuyaCode, fetchRegister } from "@api";

import Clipboard from '@react-native-clipboard/clipboard';

import { useModalToast, useToggle, useTimer } from "@hooks";

import { BcPhotoGalleryModal, BcYesNoModal } from "@components";

import { BackHandler } from "react-native";

// #region Components
function GenQrLoading(props) {
    const [timer, setTimer, totalDuration, setTotalDuration, progress] = useTimer(45);
    return (
        <View mt={3}>
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 18,
                textAlign: "center"
            }}>
                Overall Loading: <Text style={{ color: "#F00" }}>{progress.toFixed(2)}</Text>%
            </Text>
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 18,
                textAlign: "center"
            }}>
                Time Left: <Text style={{ color: "#F00" }}>{timer}</Text> seconds
            </Text>
        </View>
    )
}

function SyncWithSmartLife(props) {
    const [timer, setTimer, totalDuration, setTotalDuration, progress] = useTimer(180);
    return (
        <>
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 18,
                textAlign: "center"
            }}>(It May take 1 to 5 Minutes to Sync Data)</Text>
            <View mt={3}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 18,
                    textAlign: "center"
                }}>
                    Overall Loading: <Text style={{ color: "#F00" }}>{progress.toFixed(2)}</Text>%
                </Text>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 18,
                    textAlign: "center"
                }}>
                    Time Left: <Text style={{ color: "#F00" }}>{timer}</Text> seconds
                </Text>
            </View>
        </>
    )
}

function Loading(props) {

    const { children } = props;

    const LoadingTxt = (children === "Syncing Data With Smart Life App...") ? SyncWithSmartLife : GenQrLoading;

    return (
        <View flexGrow={1}
            alignItems={"center"}
            justifyContent={"center"}>
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 20,
                textAlign: "center"
            }}>Please Refrain from Closing the App</Text>
            <Lottie
                autoPlay
                source={Animation.YatuLoader}
                loop={true}
                style={{
                    width: 360,
                    height: 360
                }} />
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 20,
                textAlign: "center"
            }}>{children}</Text>
            <LoadingTxt />
        </View>
    )
}

function TutorialGuideBtn(props) {

    const [showTGModal, setShowTGModal, toggleTGModal] = useToggle(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            toggleTGModal();
        }, 1000)
        return () => clearTimeout(timeout);
    }, [])

    const images = [
        { uri: Images.ScanQrI },
        { uri: Images.ScanQrII },
        { uri: Images.ScanQrIII },
    ]

    return (
        <>
            <BcPhotoGalleryModal showModal={showTGModal} setShowModal={setShowTGModal} images={images} />
            <TouchableOpacity onPress={toggleTGModal}>
                <VStack alignItems={"center"}>
                    <View borderRadius={20}
                        bgColor={"#000"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 32, height: 32 }}>
                        <FontAwesome5 name={"info"} size={16} color={"#FFF"} />
                    </View>
                    <Text>Guide</Text>
                </VStack>
            </TouchableOpacity>
        </>
    )
}

function Disable(props) {
    const { children, timer = 0 } = props;
    return (
        <View>
            {/* Front Layer */}
            <View alignItems={"center"}
                justifyContent={"center"}
                borderRadius={12}
                style={{
                    position: "absolute",
                    zIndex: 10,
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}
                backgroundColor={"rgba(0, 0, 0, 0.5)"}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                    color: "#FFF"
                }}>
                    {timer}
                </Text>
            </View>
            <View>
                {children}
            </View>
        </View>
    )
}

function RefreshQrBtn(props) {
    const { timer = 0, onPress = () => { } } = props;

    const Item = () => (
        <View backgroundColor={"#F00"} borderRadius={12}
            alignItems={"center"} justifyContent={"center"}
            style={{ height: 80, width: 120 }}>
            <Text style={[{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
            }]}>Refresh</Text>
        </View>
    )

    if (timer > 0) {
        return (
            <Disable {...props}>
                <Item />
            </Disable>
        )
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <Item />
        </TouchableOpacity>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);

    const { Email } = props.route.params;
    // const Email = "";

    // #region UseState
    const [loading, setLoading] = useState(false);
    const [refLink, setRefLink] = useState("");
    const [refImg, setRefImg] = useState("");
    const [loadingTxt, setLoadingTxt] = useState("");
    const [timer, setTimer] = useTimer(0);

    const [atcFlag, setAtcFlag] = useState(false);
    const [showExitModal, setShowExitModal, toggleExitModal] = useToggle(false);
    // #endregion

    const upadteAtcFlag = () => {
        const timeout = setTimeout(() => {
            if (navigation.isFocused()) {
                setAtcFlag(_ => true);
            }
        }, 1500)
        return () => clearTimeout(timeout);
    }

    // #region Api
    const authTuyaCode = () => {
        setLoading(true);
        setLoadingTxt("Generating Smart Home QR Code...");
        fetchAuthTuyaCode({
            param: {
                UserId: userId
            },
            onSetLoading: setLoading,
        })
            .then(data => {
                const { AuthCode, Flag = false, AuthImg } = data;
                setAtcFlag(_ => Flag);

                if (Flag) {
                    setRefImg(AuthImg);
                    setRefLink(AuthCode);
                    setTimer(60);
                } else {
                    // toast.show({
                    //     description: AuthCode
                    // });
                    // navigation.navigate("LoginII");
                    navigation.navigate("AuthTuyaHighTraffic", data);
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }

    const register = () => {
        setLoading(true);
        setLoadingTxt("Syncing Data With Smart Life App...");

        fetchRegister({
            param: {
                UserId: userId,
                Email: Email
            },
            onSetLoading: setLoading,
        })
            .then(data => {
                const { ResponseCode, ResponseMessage } = data;

                if (ResponseCode == "00") {
                    GoToHome();
                } else {
                    toast.show({
                        description: ResponseMessage
                    })
                }

            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    useEffect(() => {
        if (isFocused) {
            authTuyaCode();
            upadteAtcFlag();
        }
    }, [isFocused]);

    const copyRefLink = () => {
        Clipboard.setString(refLink);
        toast.show({
            description: `'${refLink}' has been copied to Clipboard!`
        })
    }

    const GoToHome = () => {
        navigation.navigate("TabNavigation", {
            screen: "Device",
        });
    }

    // Disable Back Button
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

    // Shown at False
    if (!atcFlag) {
        return (
            <>
                <BcYesNoModal showModal={showExitModal} setShowModal={setShowExitModal}
                    title={"Warning"} showCross={false}
                    onPressYes={GoBack}
                    onPressNo={toggleExitModal}
                    description={"Are you sure you want to exit this page?"} />
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 80 }} />
                        <Loading>{loadingTxt}</Loading>
                    </View>

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
                </SafeAreaView>
            </>
        )
    }

    // Never Show Not Once
    return (
        <>
            <BcYesNoModal showModal={showExitModal} setShowModal={setShowExitModal}
                title={"Warning"} showCross={false}
                onPressYes={GoBack}
                onPressNo={toggleExitModal}
                description={"Are you sure you want to exit this page?"} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <View alignItems={"center"} justifyContent={"center"} style={{ height: 80 }}>
                        <HStack width={"90%"} alignItems={"flex-end"} justifyContent={"flex-end"}>
                            <TutorialGuideBtn />
                        </HStack>
                    </View>
                    {
                        (loading) ? (
                            <Loading>{loadingTxt}</Loading>
                        ) : (
                            <>
                                <VStack flexGrow={1} space={5}>
                                    <VStack space={6} alignItems={"center"}>
                                        {/* Instruction */}
                                        <View width={"90%"}>
                                            <Text style={{
                                                fontFamily: "Roboto-Bold",
                                                fontSize: 18
                                            }}>
                                                Please use your Tuya or SmartLife app to scan the QR code provided through any web browser.
                                            </Text>
                                        </View>

                                        <View width={"90%"}>
                                            <Image source={{ uri: refImg }}
                                                style={{
                                                    width: "100%",
                                                    height: 250
                                                }}
                                                resizeMode={"contain"}
                                                alt={"Auth QR Code"} />
                                        </View>

                                        {/* Copy Link */}
                                        {
                                            (false) ? (
                                                <HStack
                                                    px={4} borderRadius={4}
                                                    bgColor={"#E6E6E6"}
                                                    alignItems={"center"}
                                                    justifyContent={"space-between"}
                                                    width={"90%"} style={{ height: 48 }}>

                                                    <View width={"80%"}>
                                                        <Text style={{ fontFamily: "Roboto-Medium", fontSize: 14 }}>{refLink}</Text>
                                                    </View>

                                                    <TouchableOpacity onPress={copyRefLink}>
                                                        <HStack alignItems={"center"} space={1}>
                                                            <FontAwesome5 name={"clone"} size={20} />
                                                            <Text style={{ fontFamily: "Roboto-Bold", fontSize: 16 }}>
                                                                Copy
                                                            </Text>
                                                        </HStack>
                                                    </TouchableOpacity>
                                                </HStack>
                                            ) : (
                                                <></>
                                            )
                                        }

                                        {/* Button To Register */}
                                        <HStack space={5}
                                            alignItems={"center"} justifyContent={"center"}>
                                            <TouchableOpacity onPress={register}>
                                                <View backgroundColor={"#2898FF"} borderRadius={12}
                                                    alignItems={"center"} justifyContent={"center"}
                                                    style={{ height: 80, width: 120 }}>
                                                    <Text style={[{
                                                        fontSize: 24,
                                                        fontWeight: "bold",
                                                        color: "white",
                                                    }]}>Register</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <RefreshQrBtn onPress={authTuyaCode} timer={timer} />
                                        </HStack>
                                    </VStack>


                                </VStack>
                            </>
                        )
                    }
                </View>

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
            </SafeAreaView>
        </>
    );
}

export default Index;