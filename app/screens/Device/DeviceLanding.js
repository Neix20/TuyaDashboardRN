import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { Images } from "@config";

import { BcBoxShadow } from "@components";

// #region Components
function Header(props) {

    const { children, onBack = () => { } } = props;
    const { onSelectEdit = () => { } } = props;

    const navigation = useNavigation();

    const toast = useToast();

    // #region Helper Functions
    const GoBack = () => {
        onBack();
        navigation.goBack();
    }
    // #endregion

    return (
        <View
            p={2}
            alignItems={"flex-end"}
            justifyContent={"flex-end"}
            style={{
                height: 60
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
                <FontAwesome5 name={"chevron-left"} size={20} color={"#FFF"} />
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
                    color: "#FFF",
                }}>{children}</Text>
            </View>

            <TouchableOpacity onPress={onSelectEdit}>
                <FontAwesome5 name={"edit"} size={24} color={"#FFF"} />
            </TouchableOpacity>
        </View>
    )
}

function AlertPanel(props) {
    return (
        <View
            bgColor={"#FFF"}
            width={"90%"}
            alignItems={"center"}
            justifyContent={"center"}
            borderRadius={12}
            style={{ height: 60 }}>
            <TouchableOpacity {...props}
                style={{ width: "90%" }}>
                <HStack alignItems={"center"} space={3}>
                    <FontAwesome5 name={"bell"} color={"#000"} size={24} />
                    <View>
                        <Text style={[{
                            fontSize: 18,
                            color: "#000",
                            fontFamily: "Roboto-Medium",
                        }]}>Device Alert</Text>
                    </View>
                </HStack>
            </TouchableOpacity>
        </View>
    )
}

function ChartPanel(props) {
    return (
        <View
            bgColor={"#FFF"}
            width={"90%"}
            alignItems={"center"}
            justifyContent={"center"}
            borderRadius={12}
            style={{ height: 60 }}>
            <TouchableOpacity {...props}
                style={{ width: "90%" }}>
                <HStack alignItems={"center"} space={3}>
                    <FontAwesome5 name={"chart-area"} color={"#000"} size={24} />
                    <View>
                        <Text style={[{
                            fontSize: 18,
                            color: "#000",
                            fontFamily: "Roboto-Medium",
                        }]}>Data Chart</Text>
                    </View>
                </HStack>
            </TouchableOpacity>
        </View>
    )
}

function InfoPanel(props) {
    return (
        <View
            bgColor={"#FFF"}
            width={"90%"}
            alignItems={"center"}
            justifyContent={"center"}
            borderRadius={12}
            style={{ height: 60 }}>
            <TouchableOpacity {...props}
                style={{ width: "90%" }}>
                <HStack alignItems={"center"} space={3}>
                    <FontAwesome5 name={"info-circle"} color={"#000"} size={24} />
                    <View>
                        <Text style={[{
                            fontSize: 18,
                            color: "#000",
                            fontFamily: "Roboto-Medium",
                        }]}>Device Info</Text>
                    </View>
                </HStack>
            </TouchableOpacity>
        </View>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Props
    const item = props.route.params;
    const { Id: DeviceId } = item;
    // #endregion

    const GoToInfo = () => navigation.navigate("DeviceInfo", item);
    const GoToAlert = () => navigation.navigate("DeviceAlert", item);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Background */}
                <View flexGrow={1}>
                    <View flex={.4}>
                        <Image source={Images.CardGradientRed}
                            style={{
                                width: "100%",
                                height: "100%"
                            }}
                            resizeMode="cover"
                            alt={"Card Gradient"}
                        />
                    </View>
                </View>

                <View position={"absolute"}
                    style={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                    {/* Header */}
                    <Header onSelectEdit={GoToInfo}>Device Information</Header>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack space={5}
                            flexGrow={1} alignItems={"center"}>
                            <View flex={.5}>

                            </View>
                            <InfoPanel onPress={GoToInfo} />
                            <AlertPanel onPress={GoToAlert} />
                            <ChartPanel />
                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Index;