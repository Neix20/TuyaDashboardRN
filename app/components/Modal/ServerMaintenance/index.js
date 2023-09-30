import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput } from "react-native";
import { View, VStack, HStack } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Logger, Utility } from "@utility";

import { BaseModal } from "@components";

import { useModalToast } from "@hooks";

function Index(props) {

    const [cusToast, showMsg] = useModalToast();

    return (
        <BaseModal {...props}
            cusToast={cusToast}
            showCross={false}
            setShowModal={() => { }}>
            <View py={5} alignItems={"center"}>
                <VStack width={"90%"} space={5}
                    alignItems={"center"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 24,
                        color: "#000"
                    }}>Server Maintenance</Text>

                    <FontAwesome5 name={"cogs"} size={84} color={"#d3d3d3"} />

                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: "#000",
                        textAlign: "justify",
                    }}>
                        Uh-oh! Scheduled Server Maintenance in Progress. Thank You for Your Patience!
                    </Text>
                </VStack>
            </View>
        </BaseModal>
    )
}

export default Index;