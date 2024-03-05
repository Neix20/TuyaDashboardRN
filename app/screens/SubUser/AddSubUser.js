import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { Images, Svg } from "@config";

import { BcHeaderWithCancel, BcHeaderWithAdd, BcBoxShadow, BcLoading } from "@components";
import { fetchAddSubUser } from "@api";

import { useToggle } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Hooks
function useForm(props) {

    const init = {
        form: {
            username: "",
        }
    }

    const [form, setForm] = useState(init.form);
    const [submitFlag, setSubmitFlag] = useState(false);

    const onChange = (name, val) => {
        const nextState = { ...form };
        nextState[name] = val;
        setForm(() => nextState);
    }

    const onChangeEmail = (val) => onChange("email", val);
    const onChangeUsername = (val) => onChange("username", val);

    useEffect(() => {
        let flag = true;

        for (const key in form) {
            const val = form[key];
            flag = flag && val.length > 0;
        }

        setSubmitFlag(_ => flag);
    }, [JSON.stringify(form)]);

    const clearForm = () => {
        setForm(init.form);
    }

    return [form, clearForm, onChangeUsername, submitFlag];
}
// #endregion

// #region Components
function AddSubUserForm(props) {

    const { hook = [] } = props;

    const [form, clearForm, onChangeUsername, submitFlag] = hook;
    const { username } = form;

    return (
        <BcBoxShadow>
            <VStack alignItems={"center"} bgColor={"#FFF"}>
                <HStack
                    alignItems={"center"}
                    width={"90%"}
                    style={{ height: 60 }}>
                    <View flex={.3}>
                        <Text style={{
                            fontSize: 18
                        }}>Username</Text>
                    </View>
                    <View flex={.7}>
                        <TextInput
                            defaultValue={username}
                            onChangeText={onChangeUsername}
                            placeholder={"Username"}
                            autoCapitalize={"none"}
                            style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                                color: "#000",
                            }} />
                    </View>
                </HStack>
            </VStack>
        </BcBoxShadow>
    )
}
// #endregion

function HeaderRight() {
    return (
        <Text style={{
            fontSize: 20,
            color: require("@utility").Utility.getColor()
        }}>Save</Text>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const formHook = useForm();
    const [form, clearForm] = formHook.slice(0, 2);
    const flag = formHook.at(-1);

    const [loading, setLoading, toggleLoading] = useToggle(false);

    const { username } = form;
    
    const userId = useSelector(Selectors.userIdSelect);

    const save = () => {
        setLoading(true);
        fetchAddSubUser({
            param: {
                UserId: userId,
                Username: username
            },
            onSetLoading: setLoading,
        })
        .then(res => {
            clearForm();

            navigation.goBack();
            toast.show({
                description: `Successfully Added ${email}!`
            });
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
                    <BcHeaderWithAdd flag={flag} onSelect={save} RightChild={HeaderRight}>Add Sub User</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1}>
                            <AddSubUserForm hook={formHook} />
                        </View>
                    </ScrollView>

                </View>
            </SafeAreaView>

        </>
    );
}

export default Index;