import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, HStack } from "native-base";

function Index(props) {

    const { Icon, name } = props;

    const { children } = props;

    return (
        <View
            width={"90%"} bgColor={"#FFF"}
            alignItems={"center"} justifyContent={"center"}
            borderRadius={12} style={{ height: 60 }}>
            <TouchableOpacity {...props} style={{ width: "90%" }}>
                <HStack alignItems={"center"} space={3}>
                    <Icon name={name} color={"#000"} size={24} />
                    <Text style={[{
                        fontSize: 18,
                        color: "#000",
                        fontFamily: "Roboto-Medium",
                    }]}>{children}</Text>
                </HStack>
            </TouchableOpacity>
        </View>
    )
}

export default Index;