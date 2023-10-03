import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { BcDisable, BcLoading } from "@components"

import { fetchAddDeviceRules } from "@api";

import { useToggle } from "@hooks";
import useForm from "./useForm";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import DeviceForm from "./DeviceForm";

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

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region UseState
    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [flag, setFlag, toggleFlag] = useToggle(false);

    const formHook = useForm();
    const [form, setForm] = formHook.slice(0, 2);
    const isFormEmpty = formHook.at(-1);
    // #endregion

    // #region Props
    const device = props.route.params;
    const { Id: deviceId, Device_Category_Id } = device;
    // #endregion

    useEffect(() => {
        const t_flag = isFormEmpty();
        setFlag(!t_flag);
    }, [JSON.stringify(form)]);

    const userId = useSelector(Selectors.userIdSelect);

    const onSave = () => {
        setLoading(true);
        fetchAddDeviceRules({
            param: {
                UserId: userId,
                DeviceCategoryId: Device_Category_Id,
                ...form,
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
                    <Header flag={flag} onSave={onSave}>Add Rules</Header>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1}>
                            <DeviceForm hook={formHook} />
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;