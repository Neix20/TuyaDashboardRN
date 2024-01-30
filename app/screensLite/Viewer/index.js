import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { BcHeader, BcLoading, BcBoxShadow, BcSvgIcon } from "@components";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { useToggle } from "@hooks";

// #region Components
function Header(props) {

    const { flag = false } = props;

    const toast = useToast();

    const onSelectAdd = () => {
        toast.show({
            description: "Work in progress"
        })
    }

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"}
                alignItems={"center"}
                justifyContent={"center"}
                style={{ height: 60 }}>
                <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{ width: "90%" }}>

                    {/* Logo */}
                    <HStack alignItems={"center"} space={3}>
                        {/* <BcYatuHome /> */}
                        <BcSvgIcon name={"Yatu"} size={80} color={"#2898FF"} />
                    </HStack>
                    {
                        (flag) ? (
                            <TouchableOpacity onPress={onSelectAdd}>
                                <View borderRadius={20}
                                    bgColor={"#2898FF"}
                                    alignItems={"center"} justifyContent={"center"}
                                    style={{ width: 32, height: 32 }}>
                                    <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <></>
                        )
                    }
                </HStack>
            </View>
        </BcBoxShadow>
    )
}
// #endregion

function Body(props) {

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 16,
            color: "#000"
        },
        txtInput: {
            fontFamily: "Roboto-Medium",
            fontSize: 16,
            backgroundColor: "#e6e6e6",
            color: "#5981A6",
            width: "90%",
            textAlign: "center"
        }
    }

    const [tokenCode, setTokenCode] = useState("");

    return (
        <View style={{ width: "90%" }}>
            <BcBoxShadow>
                <VStack flex={1} bgColor={"#FFF"} py={3}
                    alignItems={"center"}
                    space={3}>
                    <TextInput
                        defaultValue={tokenCode}
                        onChangeText={setTokenCode}
                        autoCapitalize={"none"}
                        keyboardType={"number-pad"}
                        placeholder={"Enter Viewer Code"}
                        style={style.txtInput} />

                    {/* Activate Button */}
                    <TouchableOpacity style={{ width: "60%", height: 40 }}>
                        <View flex={1} backgroundColor={"#2898FF"}
                            alignItems={"center"} justifyContent={"center"}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                color: "white",
                            }}>Submit</Text>
                        </View>
                    </TouchableOpacity>
                </VStack>
            </BcBoxShadow>
        </View>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <Header />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} bgColor={"#F6F6F6"}
                        justifyContent={"center"}
                        alignItems={"center"}>
                        <Body />
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;