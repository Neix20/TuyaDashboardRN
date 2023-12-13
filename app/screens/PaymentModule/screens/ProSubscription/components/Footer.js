import React, { useState, useEffect } from "react";

import { View } from "native-base";
import { Text } from "react-native";

function Index(props) {

    const { height = 60 } = props;
    return (
        <View alignItems={"center"}
            justifyContent={"center"}
            style={{ height: height }}>
            <Text style={{
                width: "90%",
                textAlign: "center",
                fontFamily: "Roboto-Medium",
                fontSize: 14,
                color: "#585858"
            }}>
                All Subscription are automatically renewed unless cancelled during the subscription period.
            </Text>
        </View>
    )
}

export default Index;