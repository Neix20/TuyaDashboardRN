import React from "react";
import { Text } from "react-native";
import { View, VStack, HStack } from "native-base";

import { CheckBox } from "@rneui/base";

function CheckBoxLegend(props) {
    const { name, flag, color } = props;
    const { onPress = () => { } } = props;
    return (
        <CheckBox
            title={name}
            titleProps={{
                fontFamily: "Roboto-Medium",
                fontSize: 16,
                color: color,
            }}
            containerStyle={{
                flex: 1,
                minWidth: 100,
                paddingHorizontal: 5,
                paddingVertical: 0,
            }}
            iconType={"material-community"}
            checkedIcon={"checkbox-marked"}
            uncheckedIcon={"checkbox-blank-outline"}
            checked={flag}
            onPress={onPress}
            checkedColor={color} />
    )
}

function Index(props) {
    const { legend = [], onUpdateLegend = () => { } } = props;

    const renderItem = (obj, ind) => {
        const onSelect = () => onUpdateLegend(ind);
        return (
            <CheckBoxLegend key={ind} onPress={onSelect} {...obj} />
        )
    }

    if (legend.length <= 0) {
        return (<></>)
    }

    return (
        <VStack alignItems={"center"} space={1}>
            <View width={"90%"}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                }}>Legend</Text>
            </View>
            <View
                borderWidth={1} borderRadius={0}
                borderColor={"#000"}
                width={"90%"}>
                <HStack flexWrap={"wrap"}>
                    {legend.map(renderItem)}
                </HStack>
            </View>
        </VStack>
    );
}

export default Index; 