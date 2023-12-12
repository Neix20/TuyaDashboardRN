import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcHeader, BcBoxShadow, BcLoading, BaseModal } from "@components";

import { useToggle, useModalToast } from "@hooks";

import { fetchGetRulesListing, fetchDeleteDeviceRules } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function Header(props) {

    const navigation = useNavigation();

    const GoBack = () => navigation.goBack();
    const GoToAddDeviceRule = () => navigation.navigate("AddDeviceRules", props);

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AddDeviceRules = -1, UpdateDeviceRules = -1, DeleteDeviceRules = -1 } = subUserAccess;

    return (
        <BcBoxShadow>
            <View py={2}
                alignItems={"center"} justifyContent={"flex-end"}
                style={{ height: 60, backgroundColor: "#fff" }}>
                {/* Front Layer */}
                <TouchableOpacity onPress={GoBack}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 120,
                        height: 120,
                        position: "absolute",
                        left: -30,
                        top: -19,
                        zIndex: 1,
                    }}>
                    <FontAwesome5 name={"chevron-left"} size={20} color={"#2898FF"} />
                </TouchableOpacity>

                <View style={{
                    position: "absolute",
                    height: 120,
                    left: 45,
                    top: -20,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#000",
                    }}>Device Rules</Text>
                </View>

                <View width={"90%"} alignItems={"flex-end"}>
                    {
                        (AddDeviceRules == 1) ? (
                            <TouchableOpacity onPress={GoToAddDeviceRule}>
                                <View borderRadius={16} bgColor={"#2898FF"}
                                    alignItems={"center"} justifyContent={"center"}
                                    style={{ width: 32, height: 32 }}>
                                    <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <></>
                        )
                    }
                </View>
            </View>
        </BcBoxShadow>
    )
}

function RemoveRulesModal(props) {

    const { onPress = () => { } } = props;
    const [cusToast, showMsg] = useModalToast();

    return (
        <BaseModal {...props} cusToast={cusToast}>
            <VStack py={5} space={5}
                alignItems={"center"}
                width={"80%"}>
                <View alignItems={"center"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#000",
                        textAlign: "center",
                    }}>Are you sure you want to remove this Rule?</Text>
                </View>

                <TouchableOpacity onPress={onPress} style={{ width: "80%" }}>
                    <View backgroundColor={"#ff0000"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ height: 40, borderRadius: 8 }}
                    >
                        <Text style={[{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "white",
                        }]}>Remove Rule</Text>
                    </View>
                </TouchableOpacity>
            </VStack>
        </BaseModal>
    )
}

function RulesItem(props) {

    const { Title, showDelete = true } = props;
    const { onSelect = () => { }, onSelectDelete = () => { } } = props;
    const [showRDModal, setShowRDModal, toggleRDModal] = useToggle(false);
    return (
        <>
            <RemoveRulesModal showModal={showRDModal} setShowModal={setShowRDModal} onPress={onSelectDelete} />
            <TouchableOpacity onPress={onSelect} style={{ width: "90%" }}>
                <HStack alignItems={"center"} justifyContent={"space-between"}>
                    <View>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18
                        }}>{Title}</Text>
                    </View>
                    {
                        (showDelete) ? (
                            <TouchableOpacity onPress={toggleRDModal}>
                                <View borderRadius={16} bgColor={"#F00"}
                                    alignItems={"center"} justifyContent={"center"}
                                    style={{ width: 32, height: 32 }}>
                                    <FontAwesome name={"minus"} size={16} color={"#FFF"} />
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: 32, height: 32 }}></View>
                        )
                    }
                </HStack>
                <Divider my={3} />
            </TouchableOpacity>
        </>
    )

}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const device = props.route.params;
    const { Id: deviceId } = device;

    const userId = useSelector(Selectors.userIdSelect);

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AddDeviceRules = -1, UpdateDeviceRules = -1, DeleteDeviceRules = -1 } = subUserAccess;

    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [refresh, setRefresh, toggleRefresh] = useToggle(false);

    const [data, setData] = useState([]);

    useEffect(() => {
        if (isFocused) {
            setLoading(true);

            fetchGetRulesListing({
                param: {
                    UserId: userId,
                    DeviceId: deviceId
                },
                onSetLoading: setLoading
            })
                .then(data => {
                    setData(data)
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`)
                })
        }

    }, [isFocused, refresh]);

    const deleteRules = (item) => {
        const { Id } = item;
        fetchDeleteDeviceRules({
            param: {
                UserId: userId,
                DeviceRulesId: Id
            },
            onSetLoading: setLoading
        })
            .then(data => {
                toggleRefresh();
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`)
            })
    }

    const renderItem = (item, index) => {
        const onSelect = () => navigation.navigate("UpdateDeviceRules", item);
        const onSelectDelete = () => deleteRules(item);

        return (
            <RulesItem key={index} showDelete={DeleteDeviceRules == 1}
                onSelect={onSelect} onSelectDelete={onSelectDelete}
                {...item} />
        )
    }

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <Header {...device} />

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack flexGrow={1}
                            py={3} bgColor={"#FFF"}
                            alignItems={"center"}>
                            {
                                data.map(renderItem)
                            }
                        </VStack>
                    </ScrollView>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;