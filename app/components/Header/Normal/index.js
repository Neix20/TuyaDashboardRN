import React from "react";

import { Text, TouchableOpacity, Dimensions } from "react-native";
import { View, HStack, useToast } from "native-base";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation } from "@react-navigation/native";

import { BcBoxShadow } from "@components";

function Index(props) {
    const { children, onBack = () => { } } = props;

    const navigation = useNavigation();

    const toast = useToast();

    // #region Helper Functions
    const GoBack = () => {
        onBack();
        navigation.goBack();
    }
    // #endregion

    return (
        <BcBoxShadow style={{width: "100%"}}>
            <View
                style={{
                    height: 60,
                    backgroundColor: "#fff",
                }}>
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
            </View>
        </BcBoxShadow>
    )
}

export default Index;