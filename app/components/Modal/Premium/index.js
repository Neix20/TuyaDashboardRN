import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput } from "react-native";
import { View, VStack, HStack } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { BaseModal } from "@components";

import { useModalToast } from "@hooks";

function Index(props) {

    const [cusToast, showMsg] = useModalToast();

    return (
        <BaseModal {...props} cusToast={cusToast}>
            <VStack width={"90%"} space={5}
                alignItems={"center"}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                    color: "#000"
                }}>Congratulations!</Text>

                <FontAwesome5 name={"crown"} size={64} color={"#FFAA00"} />

                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18,
                    color: "#000",
                    textAlign: "justify",
                }}>
                    You are now a premium member.
                </Text>
            </VStack>
        </BaseModal>
    )
}

export default Index;