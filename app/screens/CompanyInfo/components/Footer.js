import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { View } from "native-base";

import { Logger, Utility } from "@utility";
import { Images, clsConst } from "@config";

function Index(props) {
    const { lang = "en" } = props;
    return (
        <View width={"90%"}
            alignItems={"center"}
            justifyContent={"center"}
            style={{ height: 60 }}>
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 14,
                color: "#A6AFB8"
            }}>{Utility.translate("App Version", lang)}</Text>
            <Text style={{
                fontFamily: "Roboto-Medium",
                color: "#2898FF"
            }}>v{clsConst.APP_VERSION}</Text>
        </View>
    );
}

export default Index;