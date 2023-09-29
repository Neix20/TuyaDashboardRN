import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcHeader, BcBoxShadow, BcDisable, BcLoading } from "@components"

import { fetchAddDeviceRules } from "@api";

import { useToggle } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

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

    const { form, setForm } = props;

    // #region Initial
    const init = {
        formulaLs: [
            {
                "Title": "Temperature",
                "Description": "Parse Temperature",
                "Param": "[temp_current]",
                "Operation": "EVAL",
                "Expression": "temp_current => temp_current / 10",
            },
            {
                "Title": "Absolute Humidity",
                "Description": "Absolute Humidity",
                "Param": "[humidity_value, temp_current]",
                "Operation": "EVAL",
                "Expression": "absolute_humidity => 6.112 * humidity_value * ( 2.1674 / ( 273.15 + temp_current ) ) * 2.71828 ^ ( ( 17.67 * temp_current ) / ( temp_current + 243.5 ) )",
            },
            {
                "Title": "Rename Temperature",
                "Description": "Rename Temperature",
                "Param": "[temp_current]",
                "Operation": "RENAME",
                "Expression": "temp_current => temperature"
            },
            {
                "Title": "Rename Humidity",
                "Description": "Rename Humidity",
                "Param": "[humidity_value]",
                "Operation": "RENAME",
                "Expression": "humidity_value => relative_humidity"
            },
            {
                "Title": "Clear All",
                "Description": "",
                "Param": "",
                "Operation": "",
                "Expression": ""
            },
        ]
    }
    // #endregion

    const { Title, Description, Param, Operation, Expression } = form;

    // #region Helper
    const onChangeForm = (name, val) => {
        const nextState = { ...form, name: val };
        setForm(nextState);
    }
    // #endregion

    // #region Render
    const renderItem = (item, index) => {
        const { Title, Description, Param, Operation, Expression } = item;
        const onSelect = () => setForm(item);
        return (
            <TouchableOpacity key={index}
                onPress={onSelect}>
                <View borderWidth={1} borderRadius={8} p={2}>
                    <Text>{Title}</Text>
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
                    style={{ minHeight: 60, maxHeight: 180 }}>
                    <View flex={.3}>
                        <Text style={{
                            fontSize: 18
                        }}>Title</Text>
                    </View>
                    <View flex={.7}>
                        <TextInput
                            defaultValue={Title}
                            onChange={(e) => onChangeForm("Title", e)}
                            placeholder={"Title"}
                            autoCapitalize={"none"}
                            multiline={true}
                            style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                                color: "#000",
                            }} />
                    </View>
                </HStack>
                <HStack
                    alignItems={"center"}
                    width={"90%"}
                    style={{ minHeight: 60, maxHeight: 180 }}>
                    <View flex={.3}>
                        <Text style={{
                            fontSize: 18
                        }}>Description</Text>
                    </View>
                    <View flex={.7}>
                        <TextInput
                            defaultValue={Description}
                            onChange={(e) => onChangeForm("Description", e)}
                            placeholder={"Description"}
                            autoCapitalize={"none"}
                            multiline={true}
                            style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                                color: "#000",
                            }} />
                    </View>
                </HStack>
                <HStack
                    alignItems={"center"}
                    width={"90%"}
                    style={{ minHeight: 60, maxHeight: 180 }}>
                    <View flex={.3}>
                        <Text style={{
                            fontSize: 18
                        }}>Param</Text>
                    </View>
                    <View flex={.7}>
                        <TextInput
                            defaultValue={Param}
                            onChange={(e) => onChangeForm("Param", e)}
                            placeholder={"Param"}
                            autoCapitalize={"none"}
                            multiline={true}
                            style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                                color: "#000",
                            }} />
                    </View>
                </HStack>
                <HStack
                    alignItems={"center"}
                    width={"90%"}
                    style={{ minHeight: 60, maxHeight: 180 }}>
                    <View flex={.3}>
                        <Text style={{
                            fontSize: 18
                        }}>Operation</Text>
                    </View>
                    <View flex={.7}>
                        <TextInput
                            defaultValue={Operation}
                            onChange={(e) => onChangeForm("Operation", e)}
                            placeholder={"Operation"}
                            autoCapitalize={"none"}
                            multiline={true}
                            style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                                color: "#000",
                            }} />
                    </View>
                </HStack>
                <HStack
                    alignItems={"center"}
                    width={"90%"}
                    style={{ minHeight: 60, maxHeight: 180 }}>
                    <View flex={.3}>
                        <Text style={{
                            fontSize: 18
                        }}>Expression</Text>
                    </View>
                    <View flex={.7}>
                        <TextInput
                            defaultValue={Expression}
                            onChange={(e) => onChangeForm("Expression", e)}
                            placeholder={"Expression"}
                            autoCapitalize={"none"}
                            multiline={true}
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

    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [form, setForm] = useState({});

    const { Id: deviceId} = props.route.params;
    const userId = useSelector(Selectors.userIdSelect);

    const onSave = () => {
        setLoading(true);
        fetchAddDeviceRules({
            param: {
                UserId: userId,
                DeviceId: deviceId,
                ...form
            },
            onSetLoading: setLoading
        })
            .then(data => {
                toast.show({
                    description: "Successfully Added New Formula"
                })
                setForm({});

                navigation.goBack();
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`)
            })
    }

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <Header flag={true} onSave={onSave}>Rules List</Header>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1}>
                            <DeviceForm form={form} setForm={setForm} />
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;