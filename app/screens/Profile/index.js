import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { Images, Svg, GlobalStyles, GlobalColors } from "@config";

// #region Components
function Header(props) {
    return (
        <View alignItems={"center"}>
            <HStack
                alignItems={"center"}
                justifyContent={"flex-end"}
                style={{ width: width - 40, height: 60 }}>
                {/* Btn */}
                <HStack alignItems={"center"} space={3}>
                    <TouchableOpacity>
                        <Ionicons name={"scan"} color={"#000"} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name={"gear"} color={"#000"} size={30} />
                    </TouchableOpacity>
                </HStack>
            </HStack>
        </View>
    )
}

function Profile(props) {
    return (
        <TouchableOpacity>
            <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                style={{ width: width - 40, height: 60 }}>
                {/* Btn */}
                <HStack pl={5} space={5}>
                    <FontAwesome name={"user-o"} color={"#000"} size={48} />
                    <View style={{ width: 100 }}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18
                        }}>Justin</Text>
                    </View>
                </HStack>

                {/* Angle-Right */}
                <View>
                    <FontAwesome name={"angle-right"} color={"#000"} size={32} />
                </View>
            </HStack>
        </TouchableOpacity>
    )
}

function PanelBtn(props) {
    const { icon, title, Btn } = props;
    const { onPress = () => { } } = props;

    return (
        <TouchableOpacity onPress={onPress}>
            <HStack px={3}
                alignItems={"center"}
                justifyContent={"space-between"}
                style={{ width: width - 40, height: 60 }}>
                {/* Icon & Title */}
                <HStack alignItems={"center"} space={3}>
                    <Btn name={icon} color={"#111111"} size={24} />
                    <View>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#111111"
                        }}>{title}</Text>
                    </View>
                </HStack>

                {/* FontAwesome */}
                <FontAwesome name={"angle-right"} color={"#000"} size={32} />

            </HStack>
        </TouchableOpacity>
    )
}

function NavPanel(props) {
    return (
        <VStack py={2}
            bgColor={"#FFF"}
            borderRadius={8}
            alignItems={"center"}>

            <PanelBtn Btn={FontAwesome} icon={"home"} title={"Home Management"} />
            <PanelBtn Btn={MaterialCommunityIcons} icon={"message-text-outline"} title={"Message Center"} />
            <PanelBtn Btn={SimpleLineIcons} icon={"question"} title={"FAQ & Feedback"} />
        </VStack>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View bgColor={"#F6F7FA"} style={{ flex: 1 }}>

                {/* Header */}
                <Header />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <VStack flexGrow={1}
                        alignItems={"center"}
                        space={5}>
                        {/* User */}
                        <View style={{ height: 80 }}>
                            <Profile />
                        </View>

                        <View
                            bgColor={"#FFF"}
                            borderRadius={8}
                            style={{
                                height: 120,
                                width: width - 40
                            }}>

                        </View>

                        <NavPanel />
                    </VStack>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;