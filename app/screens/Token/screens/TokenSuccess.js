import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcLoading, BcSvgIcon } from "@components";
import { useToggle } from "@hooks";

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading, toggleLoading] = useToggle(false);

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Redeem Tokens</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack flexGrow={1} bgColor={"#F6F6F6"}
                            space={5} justifyContent={"space-between"}>
                            {/* Title */}
                            <View alignItems={"center"}
                                justifyContent={"center"}
                                style={{ height: 40 }}>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    fontSize: 24
                                }}>
                                    Redeem Success!
                                </Text>
                            </View>

                            {/* SVG Icon */}
                            <BcSvgIcon name={"RedeemSucess"} width={400} height={200} /> 

                            {/* Token For Selected Item */}

                            {/* Terms & Conditions */}

                            {/* Go Dashboard */}
                            <View alignItems={"center"}>
                                <TouchableOpacity style={{ width: "80%", height: 60 }}>
                                    <View flex={1} backgroundColor={"#6c63ff"}
                                        borderRadius={12}
                                        alignItems={"center"} justifyContent={"center"}>
                                        <Text style={{
                                            fontSize: 24,
                                            fontWeight: "bold",
                                            color: "white",
                                        }}>Go Dashboard</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;