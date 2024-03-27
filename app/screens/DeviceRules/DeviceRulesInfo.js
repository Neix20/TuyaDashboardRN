import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcHeader, BcHeaderWithAdd, BcLoading, BaseModal, BcDisable, BcYesNoModal } from "@components";

import { useToggle, useModalToast } from "@hooks";

import { fetchGetRulesListing, fetchDeleteDeviceRules, fetchMoveDeviceRulesSeq } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Components
function AddDeviceRuleBtn(props) {

    const navigation = useNavigation();
    const GoToAddDeviceRule = () => navigation.navigate("AddDeviceRules", props);

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AddDeviceRules = -1 } = subUserAccess;

    const style = {
        btn: {
            width: 32,
            height: 32,
            backgroundColor: Utility.getColor(),
            borderRadius: 16
        }
    }

    if (AddDeviceRules === -1) {
        return (
            <BcDisable>
                <View alignItems={"center"} justifyContent={"center"} style={style.btn}>
                    <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                </View>
            </BcDisable>
        )
    }

    return (
        <TouchableOpacity onPress={GoToAddDeviceRule}>
            <View alignItems={"center"} justifyContent={"center"} style={style.btn}>
                <FontAwesome name={"plus"} size={16} color={"#FFF"} />
            </View>
        </TouchableOpacity>
    )
}

function RemoveRulesModal(props) {

    const { onPress = () => { } } = props;
    const [cusToast, showMsg] = useModalToast();

    const style = {
        txtTitle: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
            color: "#000",
            textAlign: "center",
        },
        btnTitle: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#FFF",
        },
        btn: {
            borderRadius: 8
        }
    }

    return (
        <BaseModal {...props} cusToast={cusToast}>
            <VStack py={5} space={5}
                alignItems={"center"} width={"80%"}>
                <View alignItems={"center"}>
                    <Text style={style.txtTitle}>Are you sure you want to remove this Rule?</Text>
                </View>

                <TouchableOpacity onPress={onPress} style={{ width: "80%", height: 40 }}>
                    <View flex={1} backgroundColor={"#F00"}
                        alignItems={"center"} justifyContent={"center"}
                        style={style.btn}>
                        <Text style={style.btnTitle}>Remove Rule</Text>
                    </View>
                </TouchableOpacity>
            </VStack>
        </BaseModal>
    )
}

function RulesItem(props) {

    const { Title, showDelete = true } = props;
    const { onSelect = () => { }, onSelectDelete = () => { } } = props;
    const { showUpFlag = true, onMoveDataUp = () => { } } = props;
    const { showDownFlag = true, onMoveDataDown = () => { } } = props;

    const [showRDModal, setShowRDModal, toggleRDModal] = useToggle(false);

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 18
        },
        btn: {
            width: 32,
            height: 32,
            backgroundColor: Utility.getColor(),
            borderRadius: 16
        },
        upDownBtn: {
            width: 36,
            height: 36
        }
    }

    const onDelete = () => {
        onSelectDelete();
        toggleRDModal();
    }

    return (
        <>
            <BcYesNoModal showAnimation={true}
                showModal={showRDModal} setShowModal={setShowRDModal}
                title={"Warning"} description={"Are you sure you want to remove this rule?"} 
                titleYes={"Remove"} titleNo={"Cancel"}
                onPressYes={onDelete} onPressNo={toggleRDModal}
                />
            <HStack space={2}>
                <HStack alignItems={"center"}>
                    {
                        (showUpFlag) ? (
                            <TouchableOpacity onPress={onMoveDataUp}>
                                <View alignItems={"center"} justifyContent={"center"}
                                    style={style.upDownBtn}>
                                    <Entypo name={"arrow-bold-up"} size={32} color={"#0F0"} />
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={style.upDownBtn} />
                        )
                    }
                    {
                        (showDownFlag) ? (
                            <TouchableOpacity onPress={onMoveDataDown}>
                                <View alignItems={"center"} justifyContent={"center"}
                                    style={style.upDownBtn}>
                                    <Entypo name={"arrow-bold-down"} size={32} color={"#F00"} />
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={style.upDownBtn} />
                        )
                    }
                </HStack>
                <TouchableOpacity onPress={onSelect} style={{ flex: 1 }}>
                    <HStack alignItems={"center"} justifyContent={"space-between"}>
                        <Text style={style.title}>{Title}</Text>
                        {
                            (showDelete) ? (
                                <TouchableOpacity onPress={toggleRDModal}>
                                    <View alignItems={"center"} justifyContent={"center"}
                                        style={style.btn}>
                                        <FontAwesome name={"minus"} size={16} color={"#FFF"} />
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <View style={{ width: 32, height: 32 }}></View>
                            )
                        }
                    </HStack>
                </TouchableOpacity>
            </HStack>
        </>
    )
}
// #endregion

// #region Hooks
function useDeviceRules() {
    const [ls, setLs] = useState([]);

    const updateData = (data) => {
        let arr = [...data];

        arr = arr.map((item, index) => {
            return {
                ...item,
                pos: index
            }
        });

        setLs(_ => arr);
    };

    const MoveDeviceRulesSeq = (data) => {
        const rulesSeqLs = data.map(x => ({ Id: x.Id, SeqNo: x.pos }));

        fetchMoveDeviceRulesSeq({
            param: {
                UserId: 10,
                RulesSeqLs: rulesSeqLs
            },
            onSetLoading: () => { }
        })
            .then(data => {
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`)
            })
    }

    const moveUp = (item) => {
        const { pos = -1 } = item;

        let arr = [...ls];

        // Assume Position is at 1
        if (pos >= 1) {
            const nextItem = arr[pos - 1];

            // Update Item Pos
            arr[pos] = { ...nextItem, pos: pos };
            arr[pos - 1] = { ...item, pos: pos - 1 };

            MoveDeviceRulesSeq(arr);
        }

        setLs(_ => arr);
    }

    const moveDown = (item) => {
        const { pos = -1 } = item;

        let arr = [...ls];

        // Assume Position is at Length - 1
        if (pos <= arr.length - 2) {
            const nextItem = arr[pos + 1];

            // Update Item Pos
            arr[pos] = { ...nextItem, pos: pos };
            arr[pos + 1] = { ...item, pos: pos + 1 };

            MoveDeviceRulesSeq(arr);
        }

        setLs(_ => arr);
    }

    return [ls, updateData, moveUp, moveDown]
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region UseState
    const device = props.route.params;
    const { Id: deviceId } = device;

    const userId = useSelector(Selectors.userIdSelect);

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AddDeviceRules = -1, UpdateDeviceRules = -1, DeleteDeviceRules = -1 } = subUserAccess;

    const [loading, setLoading, toggleLoading] = useToggle(false);
    const refreshHook = useToggle(false);
    const [refresh, setRefresh, toggleRefresh] = refreshHook;

    const [data, setData, moveDataUp, moveDataDown] = useDeviceRules();
    // #endregion

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

    const renderItem = ({ item, index }) => {

        const onSelect = () => navigation.navigate("UpdateDeviceRules", item);
        const onSelectDelete = () => deleteRules(item);

        const onMoveDataUp = () => moveDataUp(item);
        const onMoveDataDown = () => moveDataDown(item);

        return (
            <RulesItem key={index} showDelete={DeleteDeviceRules == 1}
                onSelect={onSelect} onSelectDelete={onSelectDelete}
                showUpFlag={index >= 1} onMoveDataUp={onMoveDataUp}
                showDownFlag={index <= data.length - 2} onMoveDataDown={onMoveDataDown}
                {...item} />
        )
    }

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View flex={1}>
                    {/* Header */}
                    <BcHeaderWithAdd Right={<AddDeviceRuleBtn {...device} />}>Device Rules</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <View flexGrow={1} py={2}
                        alignItems={"center"} bgColor={"#FFF"}>
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            style={{ width: "90%", flex: 1 }}
                            contentContainerStyle={{ padding: 2 }}
                            ItemSeparatorComponent={<Divider my={2} />} />
                    </View>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;