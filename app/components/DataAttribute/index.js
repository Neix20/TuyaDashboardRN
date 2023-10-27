import React from "react";
import { Text } from "react-native";
import { View, VStack, HStack } from "native-base";

import { Svg } from "@config";
import { BcSvgIcon } from "@components";

function Index(props) {

    const { data = [] } = props;

    if (data.length == 0) {
        return (<></>)
    }

    const svg_key = Object.keys(Svg["MetaData_Header"]);
    const keys = Object.keys(data[0]).filter(x => svg_key.includes(x));

    const renderItem = (item, index) => {
        return (
            <HStack key={index} space={3}
                alignItems={"center"}>
                <View style={{ width: 60 }}>
                    <BcSvgIcon name={item} />
                </View>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16
                }}>{item}</Text>
            </HStack>
        )
    }

    return (
        <VStack bgColor={"#FFF"} space={2} pb={2}>
            {keys.map(renderItem)}
        </VStack>
    )
}

export default Index;