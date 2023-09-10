import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { Images, Svg, GlobalStyles, GlobalColors } from "@config";

import { BcHeader, BcBoxShadow } from "@components";

// #region Components
function Details(props) {

    const { name, uri } = props;

    return (
        <BcBoxShadow style={{ width: "100%" }}>
            <VStack py={3} space={3}
                bgColor={"#FFF"}
                alignItems={"center"}>

                {/* Banner */}
                <View width={"90%"} height={180}>
                    <Image
                        source={uri}
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 8,
                        }}
                        resizeMode={"stretch"}
                        alt={name} />
                </View>

                <VStack space={3} width={"90%"}>
                    <VStack space={2}>
                        {/* Title */}
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 20,
                            color: "#000",
                        }}>{name}</Text>

                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 12,
                        }}>
                            This iot plan is used for improving overall efficiency in an industry workflow of automation. It aims to pinpoint areas that can be improved with speed via automation. It analyzes patterns where the workflow slow downs and provide recommendation for improvement. Furthermore, it check the status of machine to ensure minimal downtime. It provides data driven insight to improve overall efficiency.
                        </Text>
                    </VStack>

                    <VStack space={2}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 20,
                            color: "#000",
                        }}>Device</Text>

                        <Text>{"\u25CF"} 3 Temperature Sensor</Text>
                        <Text>{"\u25CF"} 3 Humidity Sensor</Text>
                        <Text>{"\u25CF"} 3 Air Quality Sensor</Text>
                        <Text>{"\u25CF"} 5 Proximity Sensor</Text>
                    </VStack>
                </VStack>

            </VStack>
        </BcBoxShadow>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Props
    const item = props.route.params;
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <BcHeader>Usage Info</BcHeader>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} >
                        <Details {...item} />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default Index;