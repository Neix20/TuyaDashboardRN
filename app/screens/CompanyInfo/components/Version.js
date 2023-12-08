import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { View } from "native-base";

import { Logger, Utility } from "@utility";

function Index(props) {
    const { lang = "en", version = "" } = props;
    return (
        <View width={"90%"} justifyContent={"center"} style={{ height: 40 }}>
            <Text style={{
                fontFamily: "Roboto-Medium",
                fontWeight: "500",
                fontSize: 12,
            }}>{Utility.translate("Version", lang)} {Utility.formatDt(version, "dd/MM/yyyy")}</Text>
        </View>
    )
}

export default Index;