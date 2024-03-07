import React, { useState, useEffect, useRef } from "react";
import { Text } from "react-native";

function Index(props) {
    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
            color: "#000"
        }
    }
    return (
        <Text style={style.title}>Sync Device With Smart Life</Text>
    )
}

export default Index;