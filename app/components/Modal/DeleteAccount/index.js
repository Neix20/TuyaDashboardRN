import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Linking } from "react-native";
import { View, VStack, HStack } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Logger, Utility } from "@utility";

import { clsConst } from "@config";

import { BaseModal } from "@components";

import { useModalToast } from "@hooks";

function Index(props) {

    const [cusToast, showMsg] = useModalToast();

    const { showModal = false, setShowModal = () => {} } = props;

    const style = {
        hyperlink: {
            textDecorationLine: "underline",
            fontFamily: "Roboto-Medium",
            fontSize: 16,
            color: "#3366CC"
        },
        txt: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: "#000",
            textAlign: "justify"
        }
    }

    const Email = () => {
        const onPress = () => {
            Linking.openURL(`mailto:${clsConst.VIGTECH_EMAIL}`);
        }

        return (
            <TouchableOpacity onPress={onPress} style={{ paddingBottom: 2 }}>
                <Text style={style.hyperlink}>{clsConst.VIGTECH_EMAIL}</Text>
            </TouchableOpacity>
        )
    };

    return (
        <BaseModal cusToast={cusToast} {...props}>
            <VStack width={"90%"} space={5} alignItems={"center"}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                    color: "#000"
                }}>Deleted Account</Text>

                <FontAwesome5 name={"user-alt-slash"} size={84} color={"#d3d3d3"} />

                <View>
                    <Text style={style.txt}>
                        Uh-oh! This account is deleted. Email us to restore your account.
                    </Text>

                    <HStack alignItems={"flex-end"} space={1}>
                        <Text style={style.txt}>Email: </Text>
                        <Email />
                    </HStack>
                </View>

            </VStack>
        </BaseModal>
    )
}

export default Index;