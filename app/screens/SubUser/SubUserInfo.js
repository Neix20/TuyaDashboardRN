import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcLoading, BcBoxShadow, BaseModal } from "@components";

import { fetchProfileInfo, fetchDeleteSubUser, fetchUpdateSubUser } from "@api";
import { useToggle, useModalToast } from "@hooks";

// #region Components
function UserInfoDiv(props) {
    const { title = "", value = "" } = props;
    return (
        <HStack width={"90%"} alignItems={"center"} style={{ height: 48 }}>
            <View flex={.3}>
                <Text style={{
                    fontSize: 18
                }}>{title}</Text>
            </View>
            <View flex={.7} alignItems={"flex-end"}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18,
                    color: "#000",
                }}>{value}</Text>
            </View>
        </HStack>
    )
}

function UserInfo(props) {

    const { data = {} } = props;
    const { Email = "", IsManager = -1 } = data;

    return (
        <BcBoxShadow>
            <VStack alignItems={"center"} bgColor={"#FFF"}>
                <UserInfoDiv title={"Email"} value={Email} />
                <UserInfoDiv title={"Role"} value={(IsManager == -1) ? "Member" : "Admin"} />
            </VStack>
        </BcBoxShadow>
    )
}

function RemoveModal(props) {

    const { data = {} } = props;
    const { Email = "" } = data;

    const { onPressYes = () => { }, onPressNo = () => { } } = props;

    return (
        <BaseModal {...props}>
            <VStack py={5} space={5} alignItems={"center"}>
                {/* Title */}
                <View alignItems={"center"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#000"
                    }}>Are you sure you want to remove {Email}?</Text>
                </View>

                <HStack space={3}>
                    <TouchableOpacity onPress={onPressYes}>
                        <HStack
                            bgColor={"#F00"}
                            borderRadius={8}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{ width: 120, height: 40 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                textAlign: "center",
                                color: "#fff",
                            }}>Yes</Text>
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressNo}>
                        <HStack
                            borderRadius={8}
                            bgColor={"#E6E6E6"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{ width: 120, height: 40 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                textAlign: "center",
                                color: "#6A7683",
                            }}>No</Text>
                        </HStack>
                    </TouchableOpacity>
                </HStack>

            </VStack>
        </BaseModal>
    )
}

function RemoveMember(props) {

    const { data = {}, onSelect = () => {},  } = props;
    const { IsManager = -1 } = data;

    const [showRdModal, setShowRdModal, toggleRdModal] = useToggle(false);

    // #region Helper
    const onPressYes = () => {
        toggleRdModal();
        onSelect();
    }
    // #endregion

    return (
        <>
            <RemoveModal showCross={false}
                showModal={showRdModal} setShowModal={setShowRdModal} 
                onPressYes={onPressYes} onPressNo={toggleRdModal}
                {...props} />
            <BcBoxShadow>
                <TouchableOpacity onPress={toggleRdModal}>
                    <View bgColor={"#FFF"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ height: 48 }}>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#F00"
                        }}>Remove {(IsManager == -1) ? "Member" : "Admin"}</Text>
                    </View>
                </TouchableOpacity>
            </BcBoxShadow>
        </>
    )
}

function SetAdmin(props) {

    const { data = {}, onSelect = () => {},  } = props;
    const { IsManager = -1 } = data;

    return (
        <BcBoxShadow>
            <TouchableOpacity onPress={onSelect}>
                <View bgColor={"#FFF"}
                    alignItems={"center"} justifyContent={"center"}
                    style={{ height: 48 }}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: (IsManager == -1) ? "#28984f" : require("@utility").Utility.getColor()
                    }}>Set {(IsManager == -1) ? "Admin" : "Member"}</Text>
                </View>
            </TouchableOpacity>
        </BcBoxShadow>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { User_Id = -1 } = props.route.params;

    // #region UseState
    const [user, setUser] = useState({});
    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [refresh, setRefresh, toggleRefresh] = useToggle(false);
    // #endregion

    const { Email = "" } = user;

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchProfileInfo({
                param: {
                    UserId: User_Id
                },
                onSetLoading: setLoading
            })
                .then(data => {
                    setUser(data);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [isFocused, refresh]);

    // #region Helper
    const updateSubUser = () => {
        setLoading(true);
        fetchUpdateSubUser({
            param: {
                UserId: User_Id
            },
            onSetLoading: setLoading
        })
            .then(data => {
                toggleRefresh();
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }

    const deleteSubUser = () => {
        setLoading(true);
        fetchDeleteSubUser({
            param: {
                UserId: User_Id
            },
            onSetLoading: setLoading
        })
        .then(data => {
            toggleRefresh();

            navigation.goBack();

            toast.show({
                description: `Successfully Deleted ${Email}!`
            });
        })
        .catch(err => {
            setLoading(false);
            console.log(`Error: ${err}`);
        })

    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Member Info</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack flexGrow={1} space={3}>
                            <UserInfo data={user} />
                            
                            <SetAdmin data={user} onSelect={updateSubUser} />

                            <RemoveMember data={user} onSelect={deleteSubUser} />
                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;