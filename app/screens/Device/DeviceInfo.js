import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcBoxShadow } from "@components";

function Header(props) {

    const { children, onBack = () => { } } = props;

    const navigation = useNavigation();

    const toast = useToast();

    // #region Helper Functions
    const GoBack = () => {
        onBack();
        navigation.goBack();
    }
    // #endregion

    return (
        <BcBoxShadow>
            <View p={2}
                bgColor={"#FFF"}
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
                style={{ height: 60 }}>
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
                    <FontAwesome5 name={"chevron-left"} size={20} color={"#2898FF"} />
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
                        color: "#000",
                    }}>{children}</Text>
                </View>
                <TouchableOpacity>
                    <Text style={{
                        fontSize: 20,
                        color: "#2898FF"
                    }}>Save</Text>
                </TouchableOpacity>
            </View>
        </BcBoxShadow>
    )
}

function DevicePhoto(props) {
    const { Title, img } = props;
    return (
        <BcBoxShadow>
            <VStack py={2} space={2}
                bgColor={"#FFF"}
                alignItems={"center"}
                style={{ width: width }}>
                {/* Profile Picture */}
                <View >
                    {/* Front Layer */}
                    <View
                        style={{
                            position: "absolute",
                            display: "none",
                            zIndex: 1,
                            bottom: -5,
                            right: -5,
                        }}>
                    </View>
                    <Image
                        source={img}
                        style={{
                            width: 200,
                            height: 200,
                            borderRadius: 100,
                        }}
                        alt={"Model"} />
                </View>

                {/* Name */}
                <Text style={{
                    fontSize: 22,
                    fontFamily: "Roboto-Medium",
                    color: "#000"
                }}>{Title}</Text>
            </VStack>
        </BcBoxShadow>
    )
}

function DeviceInfo(props) {
    return (<></>)
}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
        
                {/* Header */}
                <Header>Device Info</Header>
        
                <View style={{ height: 10 }} />
        
                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"}>
                    </View>
                </ScrollView>
        
                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;