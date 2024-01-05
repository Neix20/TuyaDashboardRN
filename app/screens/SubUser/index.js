import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, FlatList, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeaderWithAdd, BcLoading, BcBoxShadow, BcDisable, BaseModal } from "@components";

import { fetchSubUserList, fetchAcceptPendingUser, fetchMerchantAccessCode, fetchDeleteSubUser } from "@api";
import { useToggle } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { SubUserData } from "@config";

// #region Components
function AddMoreUser(props) {
    const navigation = useNavigation();

    const GoToUser = () => {
        navigation.navigate("PaymentSubscriptionDetail", {
            Term: "MSP_UM"
        });
    }

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"}
                alignItems={"center"} justifyContent={"center"}
                style={{ height: 180 }}>
                <TouchableOpacity onPress={GoToUser} style={{ width: "90%" }}>
                    <VStack space={2} alignItems={"center"} bgColor={"#A0AAB6"} borderRadius={12}>
                        <FontAwesome name={"plus-circle"} color={"#e6e6e6"} size={80} />
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#e6e6e6",
                            textAlign: "center",
                            fontWeight: "700"
                        }}>
                            Not Enough Members? Click to Expand Member List
                        </Text>
                    </VStack>
                </TouchableOpacity>
            </View>
        </BcBoxShadow>
    )
}

function EmptyList(props) {
    return (
        <BcBoxShadow>
            <View py={3} bgColor={"#FFF"} justifyContent={"center"} alignItems={"center"}>
                <VStack space={2} width={"90%"} alignItems={"center"}>
                    <FontAwesome5 name={"users"} color={"#e6e6e6"} size={80} />
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: "#d3d3d3",
                        textAlign: "center",
                        fontWeight: "700"
                    }}>
                        Tap "+" to add new members to manage your home
                    </Text>
                </VStack>
            </View>
        </BcBoxShadow>
    )
}

function SubUserList(props) {

    const navigation = useNavigation();

    const { data = [], setItem = () => { } } = props;

    if (data.length <= 0) {
        return (
            <EmptyList />
        )
    }

    const renderMember = ({ item, index }) => {
        const { Username = "" } = item;

        const GoToInfo = () => navigation.navigate("SubUserInfo", item);

        const onSelectItem = () => setItem(item);

        return (
            <TouchableOpacity key={index} onPress={onSelectItem}>
                <HStack alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{ height: 60 }}>
                    {/* Btn */}
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18
                    }}>{Username}</Text>

                    {/* Angle-Right */}
                    <FontAwesome name={"angle-right"} color={"#000"} size={32} />
                </HStack>
            </TouchableOpacity>
        )
    }

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"} alignItems={"center"} style={{ maxHeight: 300 }}>
                <View width={"90%"}>
                    <FlatList
                        data={data}
                        renderItem={renderMember}
                    />
                </View>
            </View>
        </BcBoxShadow>
    )
}

function AccCodeModal(props) {
    const { data = "" } = props;

    return (
        <BaseModal {...props}>
            <VStack space={3} alignItems={"center"} style={{ height: 100 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24
                }}>Home Access Code</Text>

                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 18
                }}>{data}</Text>
            </VStack>
        </BaseModal>
    )
}

function SubUserModal(props) {

    const { data = {}, onDelete = () => { } } = props;
    const { Username = "", Password = "" } = data;

    const [pswd, setPswd, togglePswd] = useToggle(true);

    return (
        <BaseModal {...props}>
            <VStack space={1.5} alignItems={"center"}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 20
                }}>Sub-User Information</Text>

                <HStack alignItems={"flex-end"}>
                    <VStack flex={.3} space={2} alignItems={"center"} justifyContent={"center"}>
                        <Image
                            source={Images.person}
                            style={{ width: 80, height: 80 }}
                            resizeMode={"contain"}
                            alt={"Profile Picture"} />
                        <TouchableOpacity onPress={onDelete}>
                            <View bgColor={"#F00"} borderRadius={4}
                                alignItems={"center"} justifyContent={"center"}
                                style={{ width: 60, height: 24 }}>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    fontSize: 12,
                                    color: "#FFF"
                                }}>Delete</Text>
                            </View>
                        </TouchableOpacity>
                    </VStack>
                    <View flex={.7}>
                        <HStack width={"100%"} alignItems={"center"} justifyContent={"space-between"} pr={3}>
                            <View flex={1}>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    fontSize: 18
                                }}>Username: </Text>
                            </View>
                            <View flex={1}>
                                <TextInput
                                    defaultValue={Username}
                                    editable={false}
                                    style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 18,
                                        color: "#000"
                                    }}
                                />
                            </View>
                            <View><FontAwesome5 name={"eye"} color={"#FFF"} size={24} /></View>
                        </HStack>

                        <HStack width={"100%"} alignItems={"center"} justifyContent={"space-between"} pr={3}>
                            <View flex={1}>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    fontSize: 18
                                }}>Password: </Text>
                            </View>
                            <View flex={1}>
                                <TextInput
                                    editable={false}
                                    secureTextEntry={pswd}
                                    defaultValue={Password}
                                    style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 18,
                                        color: "#000"
                                    }}
                                />
                            </View>
                            <View alignItems={"center"} justifyContent={"center"}>
                                <TouchableOpacity onPress={togglePswd}>
                                    <FontAwesome5 name={pswd ? "eye-slash" : "eye"} color={"#98A0A8"} size={24} />
                                </TouchableOpacity>
                            </View>
                        </HStack>
                    </View>
                </HStack>



            </VStack>
        </BaseModal>
    )
}
// #endregion

function HeaderRight() {
    return (
        <View bgColor={"#2898FF"} borderRadius={20}
            alignItems={"center"} justifyContent={"center"}
            style={{ width: 32, height: 32 }}>
            {/* <FontAwesome name={"info"} size={16} color={"#FFF"} /> */}
            <FontAwesome name={"plus"} size={16} color={"#FFF"} />
        </View>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { MSMU_User_Count = 0, MSMU_Max_User_Count = 20 } = subUserAccess;

    const [subUserLs, setSubUserLs] = useState([]);

    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [refresh, setRefresh, toggleRefresh] = useToggle(false);

    const [showSUModal, setShowSUModal, toggleSUModal] = useToggle(false);
    const [suItem, setSuItem] = useState({});

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchSubUserList({
                param: {
                    UserId: userId,
                    IsPending: 0,
                },
                onSetLoading: setLoading
            })
                .then(data => {
                    setSubUserLs(data);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [isFocused, refresh]);
    // #endregion

    // #region Helper
    const onSetSuItem = (item) => {
        toggleSUModal();
        setSuItem(item);
    }

    const GoToAddSubUser = () => navigation.navigate("AddSubUser");

    const DeleteSubUser = () => {
        const { Id } = suItem;
        fetchDeleteSubUser({
            param: {
                UserId: Id,
            },
            onSetLoading: setLoading
        })
            .then(data => {
                toggleSUModal();
                toggleRefresh();
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    const ls_len = 5;

    return (
        <>
            <BcLoading loading={loading} />
            <SubUserModal data={suItem} onDelete={DeleteSubUser} showModal={showSUModal} setShowModal={setShowSUModal} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeaderWithAdd flag={(subUserLs.length + 1) <= MSMU_User_Count} onSelect={GoToAddSubUser} RightChild={HeaderRight}>Member List</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    <View alignItems={"center"}>
                        <HStack width={"90%"} alignItems={"center"} justifyContent={"space-between"}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 16
                            }}>Members: </Text>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 16
                            }}>{(subUserLs.length + "").padStart(2, "0")} / {(MSMU_User_Count + "").padStart(2, "0")}</Text>
                        </HStack>
                    </View>

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack space={3}>
                            <SubUserList data={subUserLs.slice(0, 5)} setItem={onSetSuItem} />
                            {(MSMU_User_Count > 5) ? <SubUserList data={subUserLs.slice(5, 10)} setItem={onSetSuItem} /> : <></>}
                            {(MSMU_User_Count > 10) ? <SubUserList data={subUserLs.slice(10, 15)} setItem={onSetSuItem} /> : <></>}
                            {(MSMU_User_Count > 15) ? <SubUserList data={subUserLs.slice(15)} setItem={onSetSuItem} /> : <></>}
                            {(MSMU_User_Count <= 15) ? <AddMoreUser /> : <></>}
                        </VStack>
                    </ScrollView>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;