import React from "react";

import { Text, TouchableOpacity } from "react-native";
import { View, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation } from "@react-navigation/native";

import { BcBoxShadow, BcDisable } from "@components";

function Index(props) {

    // #region Props
    const { children, onBack = () => { } } = props;
    const { flag = false, onSelect = () => { }, RightChild = () => (<></>) } = props;
    // #endregion

    const navigation = useNavigation();

    // #region Helper Functions
    const GoBack = () => {
        onBack();
        navigation.goBack();
    }
    // #endregion

    return (
        <BcBoxShadow>
            <View px={3} pb={2}
                bgColor={"#FFF"}
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
                style={{ height: 60 }}>
                {/* Front Layer */}
                <TouchableOpacity
                    onPress={GoBack}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 120,
                        height: 120,
                        position: "absolute",
                        left: -30,
                        top: -19,
                        zIndex: 1,
                    }}>
                    <FontAwesome5 name={"chevron-left"} size={20} color={"#2898FF"} />
                </TouchableOpacity>
                <View style={{
                    position: "absolute",
                    height: 120,
                    left: 45,
                    top: -20,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#000",
                    }}>{children}</Text>
                </View>
                {
                    (flag) ? (
                        <TouchableOpacity onPress={onSelect}>
                            <RightChild />
                        </TouchableOpacity>
                    ) : (
                        <BcDisable>
                            <RightChild />
                        </BcDisable>
                    )
                }
            </View>
        </BcBoxShadow>
    )
}

export default Index;