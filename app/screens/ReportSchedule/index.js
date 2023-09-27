import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcHeader, BaseModal, BcDisable, BcLoading } from "@components";

import { useToggle } from "@hooks";

import { fetchGetReportSchedule, fetchAddReportSchedule } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function useLs(value = []) {
    const [ls, setLs] = useState([]);

    useEffect(() => {
        if (value.length > 0) {
            updateLs(value);
        }
    }, [value]);

    const updateLs = (value = []) => {
        let arr = [...value];

        for (let ind in arr) {
            arr[ind].pos = ind;
        }

        setLs(arr);
    }

    const addItem = (item) => {
        let arr = [...ls];

        arr.push(item);

        for (let ind in arr) {
            arr[ind].pos = ind;
        }

        setLs(arr);
    }

    const deleteItem = (item) => {
        const { pos } = item;

        let arr = [...ls];

        if (pos > -1) {
            arr.splice(pos, 1);
        }

        for (let ind in arr) {
            arr[ind].pos = ind;
        }

        setLs(arr);
    }

    const toggleDevice = (item) => {
        const { pos } = item;

        let arr = [...ls];

        arr[pos].Status = 1;

        setLs(arr);
    }

    return [ls, updateLs, addItem, deleteItem, toggleDevice];
}

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

function Title(props) {

    const { children, onPress = () => { } } = props;

    return (
        <View py={3} alignItems={"center"}>
            <HStack w={"90%"}
                alignItems={"center"} justifyContent={"space-between"}>
                <View>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 20
                    }}>{children}</Text>
                </View>
                <TouchableOpacity onPress={onPress}>
                    <View borderRadius={16} bgColor={"#2898FF"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 32, height: 32 }}>
                        <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                    </View>
                </TouchableOpacity>
            </HStack>
        </View>
    )
}

function EmailModal(props) {
    const { onChangeEmail } = props;

    const [value, setValue] = useState("");

    const onChangeValue = (e) => {
        setValue(e);
    }

    const onSubmit = () => {
        setValue("");
        onChangeEmail(value);
    }

    return (
        <BaseModal {...props}>
            <VStack pt={8} space={3} w={"100%"} alignItems={"center"}>
                <View w={"90%"}>
                    <TextInput
                        defaultValue={value}
                        onChangeText={onChangeValue}
                        placeholder={"Email"}
                        autoCapitalize={"none"}
                        keyboardType={"email-address"}
                        style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#000",
                            backgroundColor: "#e6e6e6",
                            borderRadius: 12
                        }} />
                </View>
                <TouchableOpacity onPress={onSubmit}>
                    <View backgroundColor={"#ff0000"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 200, height: 48, borderRadius: 15 }}>
                        <Text style={[{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "white",
                        }]}>Submit</Text>
                    </View>
                </TouchableOpacity>
            </VStack>
        </BaseModal>
    )
}

function EmailTitle(props) {

    const { hook = [] } = props;

    const [emailLs, setEmailLs, addEmail, deleteEmail] = hook;

    const [showEmailModal, setShowEmailModal, toggleEmailModal] = useToggle(false);

    const onChangeEmail = (email) => {
        const obj = {
            name: email,
        }
        addEmail(obj);
        toggleEmailModal();
    }

    return (
        <>
            <EmailModal showModal={showEmailModal} setShowModal={setShowEmailModal} onChangeEmail={onChangeEmail} />
            <Title onPress={toggleEmailModal}>Email List</Title>
        </>
    )
}

function DeviceModal(props) {
    const { data = [], onChangeDevice = () => { } } = props;

    const renderItem = (item, index) => {
        const { Name } = item;
        const onSelect = () => onChangeDevice(item);
        return (
            <>
                <TouchableOpacity onPress={onSelect}
                    style={{ width: "90%" }}>
                    <View>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18,
                        }}>{Name}</Text>
                    </View>
                </TouchableOpacity>
                <Divider width={"90%"} />
            </>
        )
    }

    return (
        <BaseModal {...props} showCross={false}>
            <View alignItems={"center"}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 18,
                }}>Device List</Text>
            </View>
            <VStack space={3} width={"100%"}
                alignItems={"center"}>
                {data.map(renderItem)}
            </VStack>
        </BaseModal>
    )
}

function DeviceTitle(props) {

    const { hook = [], devices = [] } = props;

    const [deviceLs, setDeviceLs, addDevice, deleteDevice, toggleDevice] = hook;

    const [showDeviceModal, setShowDeviceModal, toggleDeviceModal] = useToggle(false);

    const onChangeDevice = (val) => {
        toggleDevice(val);
        toggleDeviceModal();
    }

    return (
        <>
            <DeviceModal data={devices} onChangeDevice={onChangeDevice}
                showModal={showDeviceModal} setShowModal={setShowDeviceModal} />
            <Title onPress={toggleDeviceModal}>Device List</Title>
        </>
    )
}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const emailHook = useLs([]);
    const deviceHook = useLs([]);

    const [emailLs, setEmailLs, addEmail, deleteEmail] = emailHook;
    const [deviceLs, setDeviceLs, addDevice, deleteDevice] = deviceHook;

    const [flag, setFlag, toggleFlag] = useToggle(false);
    const [loading, setLoading, toggleLoading] = useToggle(false);

    const userId = useSelector(Selectors.userIdSelect);

    useEffect(() => {
        const t_flag = emailLs.length > 0 && deviceLs.length > 0;
        setFlag(t_flag);
    }, [emailLs.length, deviceLs.length]);

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchGetReportSchedule({
                param: {
                    UserId: userId
                },
                onSetLoading: setLoading,
            })
                .then(data => {
                    const { Email, Device } = data;
                    setEmailLs(Email);
                    setDeviceLs(Device);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`)
                })

        }
    }, [isFocused]);

    // #region Render Item
    const renderEmail = (item, index) => {
        const { name } = item;

        const onSelect = () => deleteEmail(item);
        return (
            <HStack width={"90%"} alignItems={"center"} justifyContent={"space-between"}>
                <View>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18
                    }}>{name}</Text>
                </View>
                <TouchableOpacity onPress={onSelect}>
                    <View borderRadius={16} bgColor={"#F00"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 32, height: 32 }}>
                        <FontAwesome name={"minus"} size={16} color={"#FFF"} />
                    </View>
                </TouchableOpacity>
            </HStack>
        )
    }

    const renderDevice = (item, index) => {
        const { Name } = item;
        const onSelect = () => deleteDevice(item);
        return (
            <HStack width={"90%"} alignItems={"center"} justifyContent={"space-between"}>
                <View>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18
                    }}>{Name}</Text>
                </View>
                <TouchableOpacity onPress={onSelect}>
                    <View borderRadius={16} bgColor={"#F00"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 32, height: 32 }}>
                        <FontAwesome name={"minus"} size={16} color={"#FFF"} />
                    </View>
                </TouchableOpacity>
            </HStack>
        )
    }
    // #endregion


    const onSubmit = () => {
        setLoading(true);
        fetchAddReportSchedule({
            param: {
                UserId: userId,
                EmailLs: emailLs.map(x => x.name),
                DeviceLs: deviceLs.filter(x => x.Status == 1).map(x => x.Id)
            },
            onSetLoading: setLoading
        })
            .then(data => { })
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
                    <Header flag={flag} onSave={onSubmit}>Report Schedule</Header>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1} bgColor={"#FFF"}>
                            <View flex={1}>
                                {/* Email List */}
                                <EmailTitle hook={emailHook} />

                                {/* Email List */}
                                <VStack space={3} alignItems={"center"}>
                                    {emailLs.map(renderEmail)}
                                </VStack>
                            </View>
                            <View flex={1}>
                                <DeviceTitle hook={deviceHook}
                                    devices={deviceLs.filter(x => x.Status == 0)} />

                                {/* Device List */}
                                <VStack space={3} alignItems={"center"}>
                                    {deviceLs.filter(x => x.Status == 1).map(renderDevice)}
                                </VStack>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>

        </>
    );
}

export default Index;