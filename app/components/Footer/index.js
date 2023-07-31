import React from "react";

import { Dimensions } from "react-native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { View } from "native-base";

import { BcBoxShadow } from "@components";

function Index(props) {
    const { children } = props;
    return (
        <BcBoxShadow style={{
            borderRadius: 30,
        }}>
            <View
                alignItems={"center"}
                justifyContent={"center"}
                style={{
                    height: 80,
                    width: width,
                    backgroundColor: "#fff",
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                }}>
                {children}
            </View>
        </BcBoxShadow>
    )
}

export default Index;