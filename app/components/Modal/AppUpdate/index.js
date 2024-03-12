import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput } from "react-native";
import { View, VStack, HStack } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";

import { BaseModal } from "@components";

import { clsConst } from "@config";

import { useModalToast } from "@hooks";

function Index(props) {

    const [cusToast, showMsg] = useModalToast();

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 24,
            color: "#000"
        },
        description: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: "#000",
            textAlign: "justify",
        }
    }

    return (
        <BaseModal {...props}
            cusToast={cusToast}
            showCross={false}
            setShowModal={() => { }}>
            <VStack width={"90%"} space={5} alignItems={"center"}>
                <Text style={style.title}>App Version</Text>
                <FontAwesome5 name={"store"} size={84} color={"#d3d3d3"} />
                <Text style={style.description}>
                    Uh-oh! The app version {clsConst.APP_VERSION} is outdated. Kindly update the app from your respective store. Thank you!
                </Text>
            </VStack>
        </BaseModal>
    )
}

export default Index;