import React from "react";
import { Text } from "react-native";
import { View, VStack } from "native-base";

import { Animation } from "@config";
import { Utility } from "@utility";

import Lottie from "lottie-react-native";

function Index(props) {
    return (
        <View flexGrow={1} justifyContent={"center"}>
            <VStack space={3} alignItems={"center"}>
                <Lottie
                    autoPlay
                    source={Animation.YatuLoader}
                    loop={true}
                    style={{
                        width: 360,
                        height: 360
                    }} />

                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                    color: Utility.getColor()
                }}>Loading ...</Text>
            </VStack>
        </View>
    )
}

export default Index;