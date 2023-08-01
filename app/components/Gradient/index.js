import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions } from "react-native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import LinearGradient from "react-native-linear-gradient";

function Index(props) {

    const { children } = props;
    const { startColor, endColor, style, orientation = "vertical" } = props;

    const end = (orientation === "vertical") ? ({ x: 0, y: 1 }) : ({ x: 1, y: 0 });

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }} end={end}
            colors={[startColor, endColor]} style={style}>
            {children}
        </LinearGradient>
    );
}

export default Index;