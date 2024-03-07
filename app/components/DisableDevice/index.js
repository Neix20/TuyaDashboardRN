import React, { useState, useEffect, useRef } from "react";
import { View, VStack, HStack, Divider, useToast } from "native-base";

function Index(props) {


    const { children, backgroundColor = "#fff", opacity = 0.72 } = props;
    const { flag = false, placeholder = () => <></> } = props;

    if (!flag) {
        return (
            <>
                {children}
            </>
        )
    }

    const style = {
        frontLayer: {
            position: "absolute",
            zIndex: 2,
            opacity: opacity,
            backgroundColor: backgroundColor,
            top: 0, bottom: 0,
            left: 0, right: 0
        },
        textLayer: {
            position: "absolute",
            zIndex: 2,
            top: 0, bottom: 0,
            left: 0, right: 0
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Front Layer */}
            <View style={style.frontLayer} />
            <View alignItems={"center"} justifyContent={"center"} style={style.textLayer}>
                {placeholder}
            </View>
            {children}
        </View>
    );
}

import Item from "./Item.js";
import Screen from "./screen.js";
import ScreenPro from "./screenPro.js";

export {
    Index,
    Item,
    Screen,
    ScreenPro
}