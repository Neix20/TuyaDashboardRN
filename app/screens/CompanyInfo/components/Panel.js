import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";


import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

function PanelBtn(props) {
    const { Btn, icon } = props;
    const { showRight = true, disabled = false } = props;
    const { title = "", color = "#111111" } = props;
    const { onPress = () => { } } = props;

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={{ width: "90%" }}>
            <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                style={{ height: 60 }}>
                {/* Icon & Title */}
                <HStack alignItems={"center"}>
                    <View alignItems={"flex-start"} style={{ width: 40 }}>
                        <Btn name={icon} color={color} size={24} />
                    </View>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: color
                    }}>{title}</Text>
                </HStack>

                {/* FontAwesome */}
                {
                    (showRight) ? (
                        <FontAwesome name={"angle-right"} color={color} size={32} />
                    ) : (
                        <></>
                    )
                }

            </HStack>
        </TouchableOpacity>
    )
}

function Index(props) {
    const navigation = useNavigation();

    const GoToAboutUs = () => navigation.navigate("AboutUs");
    const GoToTnc = () => navigation.navigate("Tnc");
    const GoToPolicy = () => navigation.navigate("Policy");
    const GoToFaq = () => navigation.navigate("Faq");

    return (
        <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
            <PanelBtn onPress={GoToAboutUs} Btn={FontAwesome5} icon={"info-circle"} title={"About Us"} />
            <PanelBtn onPress={GoToTnc} Btn={FontAwesome5} icon={"clipboard-list"} title={"Terms & Conditions"} />
            <PanelBtn onPress={GoToPolicy} Btn={FontAwesome5} icon={"unlock-alt"} title={"Privacy Policy"} />
            <PanelBtn onPress={GoToFaq} Btn={FontAwesome5} icon={"question-circle"} title={"FAQ"} />
        </VStack>
    )
}

export default Index;