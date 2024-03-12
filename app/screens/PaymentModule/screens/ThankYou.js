import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcBoxShadow, BcFooter } from "@components";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchSubUserAccess } from "@api";

function Header(props) {
    const { children, onBack = () => { } } = props;
    const { color = Utility.getColor(), txtColor = "#000", bgColor = "#FFF" } = props;

    return (
        <BcBoxShadow>
            <View
                style={{
                    height: 60,
                    backgroundColor: bgColor,
                }}>

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

    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);

    useEffect(() => {
        if (isFocused) {

            // Set Premium Flag to Be True
            dispatch(Actions.onChangePremiumPayFlag(true));

            // Set Viewer Session Flag To Be True
            dispatch(Actions.onChangeViewSesTutorial(true));

            RequestAccess(userId);
        }
    }, [isFocused]);

    const onExit = () => {
        navigation.navigate("TabNavigation", {
            screen: "Dashboard"
        })
    }

    // Request Access Here
    const RequestAccess = (userId) => {
        fetchSubUserAccess({
            param: {
                UserId: userId
            },
            onSetLoading: () => { },
        })
            .then(data => {
                dispatch(Actions.onChangeSubUserAccess(data));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
            })
    }


    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={Images.sunsetBgIII}
                resizeMode={"cover"}
                style={{ flex: 1, opacity: 0.4 }} />

            <View position={"absolute"} style={{ top: insets.top, bottom: insets.bottom, left: 0, right: 0 }}>

                {/* Header */}
                <Header>Payment Successful</Header>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
                        <VStack width={"80%"} space={5}>
                            <BcBoxShadow>
                                <VStack alignItems={"center"} justifyContent={"center"}
                                    p={3} space={3}
                                    bgColor={"#FFF"} style={{ minHeight: 120 }}>
                                    <VStack alignItems={"center"} space={1}>
                                        <Text style={{
                                            fontFamily: "Roboto-Bold",
                                            fontSize: 18
                                        }}>Payment Success!</Text>
                                        <FontAwesome name={"check-circle"} size={48} color={"#39B54A"} />
                                    </VStack>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 16
                                    }}>Thank you for making a purchase!</Text>
                                </VStack>
                            </BcBoxShadow>

                            <TouchableOpacity onPress={onExit} style={{ height: 48 }}>
                                <View bgColor={Utility.getColor()} flex={1}
                                    alignItems={"center"} justifyContent={"center"}>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 16,
                                        color: "#FFF"
                                    }}>Go To Dashboard</Text>
                                </View>
                            </TouchableOpacity>
                        </VStack>

                    </View>
                </ScrollView>

                <View style={{ height: 70 }} />

                {/* <BcFooter>
                    <TouchableOpacity onPress={onExit} style={{ width: "80%" }}>
                        <View bgColor={"#F00"} style={{ height: 48 }} alignItems={"center"} justifyContent={"center"}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 16,
                                color: "#FFF"
                            }}>Go To Dashboard</Text>
                        </View>
                    </TouchableOpacity>
                </BcFooter> */}
            </View>
        </SafeAreaView>
    );
}

export default Index;