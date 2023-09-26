import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcHeader, BcBoxShadow, BcDisable } from "@components"

function Header(props) {

    // #region Props
    const { children, onBack = () => { }, onSave = () => { } } = props;
    const { flag = false } = props;
    // #endregion

    const navigation = useNavigation();

    // #region Helper Functions
    const GoBack = () => {
        onBack();
        navigation.goBack();
    }
    // #endregion

    return (
        <View bgColor={"#FFF"}
            alignItems={"center"}>
            <HStack alignItems={"center"}
                justifyContent={"space-between"}
                style={{ height: 60, width: "90%" }}>
                <TouchableOpacity onPress={GoBack}>
                    <Text style={{
                        fontSize: 20,
                        color: "#ccc",
                    }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#000",
                }}>{children}</Text>
                {
                    (flag) ? (
                        <TouchableOpacity onPress={onSave}>
                            <Text style={{
                                fontSize: 20,
                                color: "#2898FF"
                            }}>Save</Text>
                        </TouchableOpacity>
                    ) : (
                        <BcDisable>
                            <Text style={{
                                fontSize: 20,
                                color: "#2898FF"
                            }}>Save</Text>
                        </BcDisable>
                    )
                }
            </HStack>
        </View>
    )
}

function DeviceForm(props) {

    const isFocused = useIsFocused();

    const [form, setForm] = useState({});

    // #region Initial
    const init = {
        formulaLs: ["Absolute Humidity"]
    }
    // #endregion

    const { formula } = form;

    // #region Helper
    const onChangeFormula = (val) => {
        const nextState = {
            ...form,
            formula: val
        }
        setForm(nextState);
    }
    // #endregion

    // #region Render
    const renderItem = (item, index) => {
        const onSelect = () => onChangeFormula(item);
        return (
            <TouchableOpacity key={index}
                onPress={onSelect}>
                <View borderWidth={1} borderRadius={8} p={2}>
                    <Text>{item}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    // #endregion

    return (
        <VStack space={3}>
            <View bgColor={"#FFF"}
                alignItems={"center"}>
                <HStack
                    alignItems={"center"}
                    width={"90%"}
                    style={{ height: 60 }}>
                    <View flex={.3}>
                        <Text style={{
                            fontSize: 18
                        }}>Formula</Text>
                    </View>
                    <View flex={.7}>
                        <TextInput
                            defaultValue={formula}
                            onChangeText={onChangeFormula}
                            placeholder={"Formula"}
                            autoCapitalize={"none"}
                            style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                                color: "#000",
                            }} />
                    </View>
                </HStack>
            </View>

            <View alignItems={"center"}>
                <HStack width={'90%'}>
                    <Text>Recommended</Text>
                </HStack>
            </View>

            <View alignItems={"center"}>
                <HStack space={3} rowGap={10}
                    flexWrap={"wrap"}
                    width={'90%'}>
                    {
                        init.formulaLs.map(renderItem)
                    }
                </HStack>
            </View>


        </VStack>
    )
}


function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <Header />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1}>
                        <DeviceForm />
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;