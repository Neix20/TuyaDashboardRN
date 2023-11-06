import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { Images, Svg } from "@config";

import { BcHeaderWithCancel, BcBoxShadow, BcLoading } from "@components";
import { fetchAddSubUser } from "@api";

import { useToggle } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Hooks
function useForm(props) {

    const init = {
        form: {
            email: ""
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

    return [form, clearForm, onChangeEmail, submitFlag];
}
// #endregion

// #region Components
function AddSubUserForm(props) {

    const { hook = [] } = props;

    const [form, clearForm, onChangeEmail, submitFlag] = hook;
    const { email } = form;

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
                        }}>User Email</Text>
                    </View>
                    <View flex={.7}>
                        <TextInput
                            defaultValue={email}
                            onChangeText={onChangeEmail}
                            placeholder={"User Email"}
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

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const formHook = useForm();
    const [form, clearForm, flag] = [...formHook.slice(0, 2), formHook.at(-1)];

    const [loading, setLoading, toggleLoading] = useToggle(false);

    const { email } = form;
    const userId = useSelector(Selectors.userIdSelect);

    const save = () => {
        setLoading(true);
        fetchAddSubUser({
            param: {
                UserId: userId,
                Email: email
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
                    <BcHeaderWithCancel flag={flag} onSelect={save}>Add Sub User</BcHeaderWithCancel>

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