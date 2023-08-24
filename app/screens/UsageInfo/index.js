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

    const {name, uri} = props;

    return (
        <BcBoxShadow>
            <VStack py={3} 
                bgColor={"#FFF"}
                alignItems={"center"} 
                style={{
                    width: width
                }}>

                {/* Banner */}
                <View>
                    <Image
                        source={uri}
                        style={{
                            width: width - 40,
                            height: 180,
                            borderRadius: 8,
                        }}
                        resizeMode={"stretch"}
                        alt={name} />
                </View>

                {/* Title */}
                <HStack alignItems={"center"} 
                style={{
                    width: width - 40
                }}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 20,
                        color: "#000",
                    }}>{name}</Text>
                </HStack>

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
        
                {/* Footer */}
                <View style={{ height: 80 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;