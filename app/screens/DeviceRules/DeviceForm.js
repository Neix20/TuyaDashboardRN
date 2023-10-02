import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { Logger, Utility } from "@utility";

function DeviceFormItem(props) {

    const { Title = "", Value = "", onChangeValue = () => { } } = props;

    return (
        <HStack width={"90%"}
            alignItems={"center"}
            style={{ minHeight: 60, maxHeight: 180 }}>
            <View flex={.3}>
                <Text style={{
                    fontSize: 18
                }}>{Title}</Text>
            </View>
            <View flex={.7}>
                <TextInput
                    defaultValue={Value}
                    onChangeText={onChangeValue}
                    placeholder={Title}
                    autoCapitalize={"none"}
                    multiline={true}
                    style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: "#000",
                    }} />
            </View>
        </HStack>
    )
}

function Index(props) {

    const { hook = [] } = props;
    const [form, setForm, onChangeTitle, onChangeDescription, onChangeParam, onChangeOperation, onChangeExpression, isFormEmpty] = hook;

    // #region Initial
    const init = {
        formulaLs: [
            {
                "Name": "Temperature",
                "Title": "Temperature",
                "Description": "Parse Temperature",
                "Param": "[temp_current]",
                "Operation": "EVAL",
                "Expression": "temp_current => temp_current / 10",
            },
            {
                "Name": "Absolute Humidity",
                "Title": "Absolute Humidity",
                "Description": "Absolute Humidity",
                "Param": "[humidity_value, temp_current]",
                "Operation": "EVAL",
                "Expression": "absolute_humidity => 6.112 * humidity_value * ( 2.1674 / ( 273.15 + temp_current ) ) * 2.71828 ^ ( ( 17.67 * temp_current ) / ( temp_current + 243.5 ) )",
            },
            {
                "Name": "Rename Temperature",
                "Title": "Rename Temperature",
                "Description": "Rename Temperature",
                "Param": "[temp_current]",
                "Operation": "RENAME",
                "Expression": "temp_current => temperature"
            },
            {
                "Name": "Rename Humidity",
                "Title": "Rename Humidity",
                "Description": "Rename Humidity",
                "Param": "[humidity_value]",
                "Operation": "RENAME",
                "Expression": "humidity_value => relative_humidity"
            },
            {
                "Name": "Clear All",
                "Title": "",
                "Description": "",
                "Param": "",
                "Operation": "",
                "Expression": ""
            },
        ]
    }
    // #endregion

    const { Title, Description, Param, Operation, Expression } = form;

    // #region Render
    const renderItem = (item, index) => {
        const { Name, Title, Description, Param, Operation, Expression } = item;
        const onSelect = () => setForm(item);
        return (
            <TouchableOpacity key={index} onPress={onSelect}>
                <View borderWidth={1} borderRadius={8} p={2}>
                    <Text>{Name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    // #endregion

    return (
        <VStack space={3}>
            <View bgColor={"#FFF"} alignItems={"center"}>
                <DeviceFormItem Title={"Title"} Value={Title} onChangeValue={onChangeTitle} />
                <DeviceFormItem Title={"Description"} Value={Description} onChangeValue={onChangeDescription} />
                <DeviceFormItem Title={"Param"} Value={Param} onChangeValue={onChangeParam} />
                <DeviceFormItem Title={"Operation"} Value={Operation} onChangeValue={onChangeOperation} />
                <DeviceFormItem Title={"Expression"} Value={Expression} onChangeValue={onChangeExpression} />
            </View>

            <View alignItems={"center"}>
                <HStack width={'90%'}>
                    <Text>Recommended</Text>
                </HStack>
            </View>

            <View alignItems={"center"}>
                <HStack width={'90%'} space={3} rowGap={10} flexWrap={"wrap"}>
                    {init.formulaLs.map(renderItem)}
                </HStack>
            </View>
        </VStack>
    )
}

export default Index;