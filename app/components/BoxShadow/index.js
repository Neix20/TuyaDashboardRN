import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Shadow } from "react-native-shadow-2";

function Index(props) {
    const { distance = 5, startColor = "rgba(0, 0, 0, 0.05)", offset = [0, 0], style = { borderRadius: 8 } } = props;
    const { children } = props;
    return (
        <Shadow
            distance={distance}
            startColor={startColor}
            offset={offset}
            style={style}
            {...props}
        >
            {children}
        </Shadow>
    );
}

export default Index;