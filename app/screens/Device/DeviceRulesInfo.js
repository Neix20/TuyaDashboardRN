import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcHeader, BcBoxShadow } from "@components";

function Header(props) {

    const navigation = useNavigation();

    const GoBack = () => navigation.goBack();
    const GoToAddDeviceRule = () => navigation.navigate("AddDeviceRules");


    return (
        <BcBoxShadow>
            <View p={2} style={{ height: 60, backgroundColor: "#fff" }}
                alignItems={"flex-end"} justifyContent={"flex-end"}>
                {/* Front Layer */}
                <TouchableOpacity onPress={GoBack}
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
                    }}>Device Rules</Text>
                </View>

                <TouchableOpacity onPress={GoToAddDeviceRule}>
                    <View borderRadius={16} bgColor={"#2898FF"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 32, height: 32 }}>
                        <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                    </View>
                </TouchableOpacity>
            </View>
        </BcBoxShadow>
    )
}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // const { Id: deviceId } = props.route.params;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
        
                {/* Header */}
                <Header />
        
                <View style={{ height: 10 }} />
        
                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} 
                        bgColor={"#FFF"}
                        justifyContent={"center"}>
                    </View>
                </ScrollView>
    
            </View>
        </SafeAreaView>
    );
}

export default Index;