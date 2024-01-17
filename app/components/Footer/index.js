import React from "react";

import { Dimensions } from "react-native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { View } from "native-base";

import { BcBoxShadow } from "@components";

function Index(props) {
    const { children } = props;

    const borderRadius = 30;

    const style = {
        footer: {
            height: 80,
            width: width,
            backgroundColor: "#fff",
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
        }
    }

    return (
        <BcBoxShadow style={{
            borderRadius,
        }}>
            <View alignItems={"center"} justifyContent={"center"} style={style.footer}>
                {children}
            </View>
        </BcBoxShadow>
    )
}

export default Index;