import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, FlatList, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeaderWithAdd, BcLoading, BcBoxShadow, BcDisable, BaseModal } from "@components";

import { fetchSubUserList, fetchAcceptPendingUser, fetchMerchantAccessCode } from "@api";
import { useToggle } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { SubUserData } from "@config";

// #region Components
function EmptyList(props) {
    return (
        <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
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
    )
}

function SubUserList(props) {

    const navigation = useNavigation();

    const { data = [], pendingData = [], toggleRefresh = () => {} } = props;

    if (data.length <= 0 && pendingData <= 0) {
        return (
            <EmptyList />
        )
    }

    const AcceptPendingUser = (UserId) => {
        fetchAcceptPendingUser({
            param: {
                UserId: UserId
            },
            onSetLoading: () => {}
        })
        .then(data => {
            toggleRefresh();
        })
        .catch(err => {
            console.log(`Error: ${err}`)
        })
    }

    const renderMember = ({ item, index }) => {
        const { Email = "" } = item;

        const GoToInfo = () => navigation.navigate("SubUserInfo", item);

        return (
            <TouchableOpacity key={index} onPress={GoToInfo}>
                <HStack alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{ height: 60 }}>
                    {/* Btn */}
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18
                    }}>{Email}</Text>

                    {/* Angle-Right */}
                    <FontAwesome name={"angle-right"} color={"#000"} size={32} />
                </HStack>
            </TouchableOpacity>
        )
    }

    const renderPendingUser = ({ item, index }) => {
        const { Email = "", User_Id } = item;

        const onPressTrue = () => AcceptPendingUser(User_Id);

        return (
            <HStack alignItems={"center"}
                justifyContent={"space-between"}
                style={{ height: 60 }}>
                {/* Btn */}
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 18
                }}>{Email}</Text>

                {/* Angle-Right */}
                <HStack space={2}>
                    <TouchableOpacity onPress={onPressTrue}>
                        <FontAwesome name={"check"} color={"#39B54A"} size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name={"close"} color={"#F01421"} size={24} />
                    </TouchableOpacity>
                </HStack>
            </HStack>
        )
    }

    return (
        <VStack width={"90%"} flexGrow={1}>
            <FlatList
                data={data}
                renderItem={renderMember}
            />
            <FlatList
                data={pendingData}
                renderItem={renderPendingUser}
            />
        </VStack>
    )
}
// #endregion

function HeaderRight() {
    
    return (
        <View bgColor={"#2898FF"} borderRadius={20}
            alignItems={"center"} justifyContent={"center"}
            style={{ width: 32, height: 32 }}>
            <FontAwesome name={"info"} size={16} color={"#FFF"} />
        </View>
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

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);

    const [subUserLs, setSubUserLs] = useState([]);

    const [pendingSubUserLs, setPendingSubUserLs] = useState([]);

    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [refresh, setRefresh, toggleRefresh] = useToggle(false);

    const [showAcModal, setShowAcModal, toggleAcModal] = useToggle(false);

    const [acc, setAcc] = useState("");

    // const GoToAddSubUser = () => navigation.navigate("AddSubUser");

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

            fetchSubUserList({
                param: {
                    UserId: userId,
                    IsPending: 1,
                },
                onSetLoading: () => {}
            })
                .then(data => {
                    setPendingSubUserLs(data);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })

                fetchMerchantAccessCode({
                    param: {
                        UserId: userId,
                    },
                    onSetLoading: () => {}
                })
                .then(data => {
                    const { AccessCode } = data;
                    setAcc(AccessCode);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [isFocused, refresh]);

    return (
        <>
            <BcLoading loading={loading} />
            <AccCodeModal data={acc} showModal={showAcModal} setShowModal={setShowAcModal} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeaderWithAdd flag={true} onSelect={toggleAcModal} RightChild={HeaderRight}>Member List</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1} bgColor={"#FFF"} alignItems={"center"}>
                            <SubUserList 
                                data={subUserLs} 
                                pendingData={pendingSubUserLs} 
                                toggleRefresh={toggleRefresh} />
                        </View>
                    </ScrollView>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;