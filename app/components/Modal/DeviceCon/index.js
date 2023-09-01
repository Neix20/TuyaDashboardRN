import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, Platform, PermissionsAndroid } from "react-native";
import { View, VStack, HStack, Spinner, Divider, FlatList } from "native-base";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { Logger, Utility } from "@utility";

import { BaseModal, BcLoading, BcTimer } from "@components";

import { initBluetoothDualModeActivator, queryHomeList } from '@volst/react-native-tuya';

import { Devices } from "@config";

// #region Components
function EmptyList(props) {
    const { lang } = props;
    return (
        <View
            style={{ flexGrow: 1 }}
            alignItems={"center"}
            justifyContent={"center"}>

            <VStack space={2}
                alignItems={"center"}
                style={{ width: width - 100 }}>

                <FontAwesome name={"plug"}
                    color={"#e6e6e6"}
                    size={80} />

                <Text style={{
                    fontSize: 18,
                    color: "#d3d3d3",
                    fontFamily: 'Roboto-Medium',
                    fontWeight: "700"
                }}>{Utility.translate("Empty List", lang)}</Text>
            </VStack>
        </View>
    )
}

function ItemElem(props) {

    const { name, img, flag } = props;

    return (
        <HStack style={{ width: width - 120 }} alignItems={"center"} justifyContent={"space-between"}>

            {/* Image */}
            <View>
                <Image source={img} style={{
                    width: 40,
                    height: 40
                }} alt={name} />
            </View>

            {/* Title */}
            <Text style={{
                fontFamily: "Roboto-Medium",
                fontWeight: '700',
                fontSize: 18
            }}>{name}</Text>

            {
                (flag) ? (
                    <View
                        backgroundColor={"#4ECB71"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        borderRadius={16}
                        style={{
                            height: 32, width: 32
                        }}>
                        <FontAwesome name={"check"} size={16} color={"#FFF"} />
                    </View>
                ) : (
                    <View style={{ width: 32, height: 32 }} />
                )
            }
        </HStack>
    )
}
// #endregion

function Index(props) {

    // #region Redux
    // const lang = useSelector(Selectors.langSelect);
    const lang = "en";
    // #endregion

    // #region Props
    const { AddDevice } = props;
    const { showModal, setShowModal } = props;
    // #endregion

    // #region Initial
    const init = {
        toast: {
            msg: "",
            flag: false
        },
        duration: 0,
        deviceLs: []
    };
    // #endregion

    // #region Toast
    const [cusToast, setCusToast] = useState(init.toast);

    const setToastFlag = (val) => {
        setCusToast({
            ...cusToast,
            flag: val
        });
    }

    const showToastMsg = (val) => {
        setCusToast({
            ...cusToast,
            msg: val,
            flag: true
        })
    }

    useEffect(() => {
        if (cusToast.flag) {
            setTimeout(() => {
                setToastFlag(false);
            }, 3 * 1000);
        }
    }, [cusToast.flag]);
    // #endregion

    // #region UseState
    const [loading, setLoading] = useState(false);
    const [deviceLs, setDeviceLs] = useState(init.deviceLs);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (showModal) {
            setLoading(true);
            onRegisterDevice();
        }
    }, [showModal]);
    // #endregion

    // #region Helper
    const onRegisterDevice = () => {
        queryHomeList().then(res => {
            Logger.info({
                content: res,
                page: "App",
                fileName: "tuya_query_home",
            });

            const { homeId } = res[0];

            requestPermission()
                .then(flag => {
                    if (flag) {
                        initBluetoothDualModeActivator({
                            homeId: homeId,
                            ssid: "ivd_office",
                            password: "ivd#2456"
                        }).then(res => {
                            setLoading(false);
                            
                            Logger.info({
                                content: res,
                                page: "App",
                                fileName: "tuya_blueTooth_scan",
                            });

                            const {name: product_name, devId: id, iconUrl: icon} = res;

                            let obj = {
                                name: "S8-HOME",
                                model: "S1 PRO",
                                description: "34.4°C 53%",
                                product_name: product_name,
                                id: id,
                                icon: icon,
                                img: {uri: icon},
                                pos: 0,
                                flag: false
                            };

                            let arr = [];
                            arr.push(obj);

                            setDeviceLs(arr);

                        })
                            .catch(err => {
                                throw err;
                            });
                    }
                })
                .catch(err => {
                    throw err;
                });
        })
        .catch(err => {
            setLoading(false);
            console.log(`Error: ${err}`);
        });

    }

    const requestPermission = async () => {
        if (Platform.OS === "ios") {
            return true;
        }

        if (Platform.OS === "android") {
            const flagI = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
            const flagII = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

            res = flagI === PermissionsAndroid.RESULTS.GRANTED
                && flagII === PermissionsAndroid.RESULTS.GRANTED;
        }

        return true;
    }

    const hideLoading = () => setLoading(false);

    const timerEnded = () => {
        hideLoading();
    }

    const toggleSelectItem = (item) => {

        const { pos } = item;

        let arr = [...deviceLs];

        for (let ind in arr) {
            arr[ind].flag = false;
        }

        arr[pos].flag = true;

        setDeviceLs(arr);

        AddDevice(item);

        setShowModal(false);
    }
    // #endregion

    // #region Render
    const renderItem = ({ item }) => {
        const onSelectItem = () => toggleSelectItem(item);
        return (
            <>
                <TouchableOpacity onPress={onSelectItem}>
                    <ItemElem {...item} />
                </TouchableOpacity>
                <Divider bgColor={"#EBEBEB"} my={2} w={width - 40} />
            </>
        )
    }
    // #endregion

    return (
        <BaseModal {...props} cusToast={cusToast}>
            <BcLoading showLoading={loading} />
            <BcTimer duration={init.duration} onTimerEnd={timerEnded} hide={true} />
            <VStack
                pt={4}
                alignItems={"center"}
                style={{
                    width: width - 100,
                    height: 0.64 * height
                }}>
                <View alignItems={"center"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#000"
                    }}>Device List</Text>
                </View>

                <Divider my={2} bgColor={"#EBEBEB"} style={{ width: width - 100 }} />

                <FlatList
                    data={deviceLs}
                    renderItem={renderItem}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={<EmptyList lang={lang} />}
                />
            </VStack>
        </BaseModal>
    )
}

export default Index;