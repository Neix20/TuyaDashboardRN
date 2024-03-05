import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation } from "@react-navigation/native";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { Utility } from "@utility";

function Item(props) {
    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
            color: "#000"
        }
    }
    return (
        <Text style={style.title}>Sync Device With Smart Life</Text>
    )
}

function Screen(props) {
    const style = {
        txt: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: "#000",
            textAlign: "center",
            fontWeight: "700"
        },
        btnTitle: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#FFF",
        }
    };

    const navigation = useNavigation();
    const GoToToken = () => {
        navigation.navigate("TokenActivation");
    }

    const GoToScanQr = () => {
        navigation.navigate("ScanQr");
    }

    return (
        <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <FontAwesome5 name={"lock"} color={"#000"} size={80} />
                <Text style={style.txt}>Activate your Yatu Account with Tokens</Text>
                {/* <TouchableOpacity onPress={GoToToken}>
                    <View backgroundColor={require("@utility").Utility.getColor()}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 120, height: 48 }}>
                        <Text style={style.btnTitle}>Activate Token</Text>
                    </View>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={GoToScanQr}>
                    <View backgroundColor={require("@utility").Utility.getColor()}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 120, height: 48 }}>
                        <Text style={style.btnTitle}>Scan QR</Text>
                    </View>
                </TouchableOpacity>
            </VStack>
        </View>
    )
}

function Index(props) {


    const { children, backgroundColor = "#fff", opacity = 0.72 } = props;
    const { flag = false, placeholder = () => <></> } = props;

    if (!flag) {
        return (
            <>
                {children}
            </>
        )
    }

    const style = {
        frontLayer: {
            position: "absolute",
            zIndex: 2,
            opacity: opacity,
            backgroundColor: backgroundColor,
            top: 0, bottom: 0,
            left: 0, right: 0
        },
        textLayer: {
            position: "absolute",
            zIndex: 2,
            top: 0, bottom: 0,
            left: 0, right: 0
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Front Layer */}
            <View style={style.frontLayer} />
            <View alignItems={"center"} justifyContent={"center"} style={style.textLayer}>
                {placeholder}
            </View>
            {children}
        </View>
    );
}

export {
    Index,
    Screen,
    Item
}