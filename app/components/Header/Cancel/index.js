import React from "react";

import { Text, TouchableOpacity } from "react-native";
import { View, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation } from "@react-navigation/native";

import { BcBoxShadow, BcDisable } from "@components";

import { Utility } from "@utility";

function Index(props) {
    
    // #region Props
    const { children, onBack = () => { }, onSelect = () => { } } = props;
    const { flag = false } = props;
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
            <View bgColor={"#FFF"}
                alignItems={"center"}>
                <HStack alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{ height: 60, width: "90%" }}>
                    <TouchableOpacity onPress={GoBack}>
                        <Text style={{
                            fontSize: 20,
                            color: "#ccc",
                        }}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#000",
                    }}>{children}</Text>
                    {
                        (flag) ? (
                            <TouchableOpacity onPress={onSelect}>
                                <Text style={{
                                    fontSize: 20,
                                    color: Utility.getColor()
                                }}>Save</Text>
                            </TouchableOpacity>
                        ) : (
                            <BcDisable>
                                <Text style={{
                                    fontSize: 20,
                                    color: Utility.getColor()
                                }}>Save</Text>
                            </BcDisable>
                        )
                    }
                </HStack>
            </View>
        </BcBoxShadow>
    )
}

export default Index;