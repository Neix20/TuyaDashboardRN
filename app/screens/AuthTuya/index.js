import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { Animation } from "@config";

import Lottie from "lottie-react-native";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { fetchAuthTuyaCode, fetchRegister } from "@api";

import Clipboard from '@react-native-clipboard/clipboard';

function Loading(props) {
    return (
        <View flexGrow={1}
            alignItems={"center"}
            justifyContent={"center"}>
            <Lottie
                autoPlay
                source={Animation.YatuLoader}
                loop={true}
                style={{
                    width: 360,
                    height: 360
                }} />
        </View>
    )
}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const userId = useSelector(Selectors.userIdSelect);

    const { Email } = props.route.params;
    // const Email = "";

    // #region UseState
    const [loading, setLoading] = useState(false);
    const [refLink, setRefLink] = useState("Hello d");
    // #endregion

    // #region Api
    const authTuyaCode = () => {
        fetchAuthTuyaCode({
            param: {
                UserId: userId
            },
            onSetLoading: setLoading,
        })
        .then(data => {
            const { AuthCode } = data;
            setRefLink(AuthCode)
        })
        .catch(err => {
            setLoading(false);
            console.log(`Error: ${err}`);
        })
    }

    const register = () => {
        setLoading(true);
        fetchRegister({
            param: {
                UserId: userId,
                Email: Email
            },
            onSetLoading: setLoading,
        })
        .then(data => {
            GoToHome();
        })
        .catch(err => {
            setLoading(false);
            console.log(`Error: ${err}`);
        })
    }
    // #endregion

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            authTuyaCode();
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
            screen: "Dashboard",
        });
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {
                    (loading) ? (
                        <Loading />
                    ) : (
                        <View flexGrow={1}
                            justifyContent={"center"}>
                            <VStack space={6} alignItems={"center"}>
                                {/* Instruction */}
                                <View width={"90%"}>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 18
                                    }}>Please Enter the Following Link at Any Available Browser.</Text>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 18
                                    }}>
                                        Scan the QR Code App using your existing Tuya Smart Home App.
                                    </Text>
                                </View>

                                <View width={"90%"}>
                                    <Image source={{ uri: refLink }}
                                        style={{
                                            width: "100%",
                                            height: 250
                                        }}
                                        resizeMode={"contain"}
                                        alt={"Auth QR Code"} />
                                </View>

                                {/* Copy Link */}
                                <HStack px={4} borderRadius={4}
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

                                {/* Button To Register */}
                                <TouchableOpacity style={{ width: "50%" }} onPress={register}>
                                    <View backgroundColor={"#2898FF"}
                                        alignItems={"center"} justifyContent={"center"}
                                        borderRadius={12}
                                        style={{ height: 80 }}
                                    >
                                        <Text style={[{
                                            fontSize: 24,
                                            fontWeight: "bold",
                                            color: "white",
                                        }]}>Register</Text>
                                    </View>
                                </TouchableOpacity>
                            </VStack>
                        </View>
                    )
                }

            </View>
        </SafeAreaView>
    );
}

export default Index;