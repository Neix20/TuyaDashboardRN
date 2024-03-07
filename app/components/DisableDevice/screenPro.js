
import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation } from "@react-navigation/native";

import { Utility } from "@utility";

function Index(props) {
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

    const GoToPaymentProSubscription = () => {
        navigation.navigate("PaymentProSubscription");
    }

    return (
        <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <FontAwesome5 name={"lock"} color={"#000"} size={80} />
                <Text style={style.txt}>Activate your Yatu Account with Pro Subscription</Text>
                {/* <TouchableOpacity onPress={GoToToken}>
                    <View backgroundColor={Utility.getColor()}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 120, height: 48 }}>
                        <Text style={style.btnTitle}>Activate Token</Text>
                    </View>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={GoToPaymentProSubscription}>
                    <View backgroundColor={Utility.getColor()}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 120, height: 48 }}>
                        <Text style={style.btnTitle}>Subscribe Pro</Text>
                    </View>
                </TouchableOpacity>
            </VStack>
        </View>
    )
}

export default Index;