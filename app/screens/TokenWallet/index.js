import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { BcHeader, BcLoading, BcBoxShadow, BcSvgIcon } from "@components";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { useToggle } from "@hooks";

function useToken(val = 0) {
    const [data, setData] = useState(val);

    const addData = () => {
        setData(val => val + 1);
    }

    const minusData = () => {
        setData(val => val - 1);
    }

    return [data, addData, minusData];
}

function Body(props) {

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 14
        },
        point: {
            fontFamily: "Roboto-Medium",
            fontSize: 48
        },
        token: {
            fontFamily: "Roboto-Bold",
            fontSize: 18
        }
    }

    const [token, addToken, minusToken] = useToken(50);

    return (
        <VStack flexGrow={1} space={3}>
            <View width={"100%"}>
                <BcBoxShadow>
                    <VStack flex={1} bgColor={"#FFF"}
                        py={3}
                        alignItems={"center"}>
                        {/* Title */}
                        <Text style={style.title}>Points</Text>

                        {/* Points */}
                        <Text style={style.point}>{token}</Text>
                    </VStack>
                </BcBoxShadow>
            </View>

            <View width={"100%"}>
                <BcBoxShadow>
                    <VStack flex={1} bgColor={"#FFF"}
                        py={3} alignItems={"center"} space={2}>
                        {/* Title */}
                        <View w={"90%"}>
                            <Text style={style.title}>Tokens</Text>
                        </View>

                        <Divider w={"90%"} />

                        {/* Function List */}
                        {/* [Icon] [Function Name] */}
                        <TouchableOpacity onPress={minusToken} style={{ width: "90%" }}>
                            <HStack alignItems={"center"} justifyContent={"space-between"}>
                                <HStack space={3}>
                                    <FontAwesome5 name={"tools"} size={24} />
                                    <Text style={style.token}>Add Device Token</Text>
                                </HStack>
                                <FontAwesome name={"angle-right"} size={28} />
                            </HStack>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={minusToken}  style={{ width: "90%" }}>
                            <HStack alignItems={"center"} justifyContent={"space-between"}>
                                <HStack space={3}>
                                    <FontAwesome5 name={"tools"} size={24} />
                                    <Text style={style.token}>Add Device Storage</Text>
                                </HStack>
                                <FontAwesome name={"angle-right"} size={28} />
                            </HStack>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={minusToken}  style={{ width: "90%" }}>
                            <HStack alignItems={"center"} justifyContent={"space-between"}>
                                <HStack space={3}>
                                    <FontAwesome5 name={"tools"} size={24} />
                                    <Text style={style.token}>Extend Account Expiry</Text>
                                </HStack>
                                <FontAwesome name={"angle-right"} size={28} />
                            </HStack>
                        </TouchableOpacity>
                    </VStack>
                </BcBoxShadow>
            </View>
        </VStack>
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
                <BcHeader>Token Wallet</BcHeader>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <Body />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default Index;