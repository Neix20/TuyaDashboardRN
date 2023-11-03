import React from "react";

import { Text, TouchableOpacity } from "react-native";
import { View, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation } from "@react-navigation/native";

import { BcBoxShadow, BcDisable } from "@components";

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
                alignItems={"center"}
                justifyContent={"center"}>
                <HStack pb={2} alignItems={"flex-end"}
                    justifyContent={"space-between"}
                    style={{ height: 60, width: "90%" }}>

                    <TouchableOpacity onPress={GoBack}>
                        <HStack alignItems={"center"} space={2} >
                            <FontAwesome5 name={"chevron-left"} size={20} color={"#2898FF"} />
                            <Text style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: "#000",
                            }}>{children}</Text>
                        </HStack>
                    </TouchableOpacity>


                    {
                        (flag) ? (
                            <TouchableOpacity onPress={onSelect}>
                                <View borderRadius={20}
                                    bgColor={"#2898FF"}
                                    alignItems={"center"} justifyContent={"center"}
                                    style={{ width: 32, height: 32 }}>
                                    <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <BcDisable>
                                <View borderRadius={20}
                                    bgColor={"#2898FF"}
                                    alignItems={"center"} justifyContent={"center"}
                                    style={{ width: 32, height: 32 }}>
                                    <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                                </View>
                            </BcDisable>
                        )
                    }
                </HStack>
            </View>
        </BcBoxShadow>
    )
}

export default Index;