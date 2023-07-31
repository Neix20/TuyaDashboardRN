import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { View, VStack, HStack } from "native-base";

import { info, error } from "@utility";

function Index(props) {
    const { children } = props;
    return (
        <View bgColor={"#000"} p={3} 

            alignItems={"center"} justifyContent={"center"}
            borderRadius={15}>
            <Text style={{
                color: "#fff",
                fontSize: 16,
                textAlign: "center",
            }}>{children}</Text>
        </View>
    )
}

export default Index;