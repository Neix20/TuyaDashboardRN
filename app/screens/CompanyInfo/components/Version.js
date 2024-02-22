import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { View } from "native-base";

import { Logger, Utility } from "@utility";

function Index(props) {
    const { lang = "en", Version = "" } = props;

    const style = {
        version: {
            fontFamily: "Roboto-Medium",
            fontWeight: "500",
            fontSize: 12,
        }
    };

    return (
        <View width={"90%"} justifyContent={"center"} style={{ height: 40 }}>
            <Text style={style.version}>{Utility.translate("Last Updated at", lang)} {Utility.formatDt(Version, "yyyy-MM-dd HH:mm:ss")}</Text>
        </View>
    )
}

export default Index;