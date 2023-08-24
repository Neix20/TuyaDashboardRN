import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions } from "react-native";
import { View, VStack, HStack, Spinner, Divider, FlatList } from "native-base";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { info, error, Utility } from "@utility";

import { BaseModal, BcLoading, BcTimer } from "@components";

import { Devices } from "@config";

// #region Components
function ItemElem(props) {

    const {name, uri, flag} = props;

    return (
        <HStack style={{width: width - 120}} alignItems={"center"} justifyContent={"space-between"}>

            {/* Image */}
            <View>
                <Image source={uri} style={{
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
                    <View style={{width: 32, height: 32}} />
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
    const {showModal, setShowModal} = props;
    // #endregion

    // #region Initial
    const init = {
        toast: {
            msg: "",
            flag: false
        },
        duration: 5,
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
    const [loading, setLoading] = useState(true);
    const [deviceLs, setDeviceLs] = useState(init.deviceLs);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (showModal) {
            setLoading(true);
        }
    }, [showModal]);
    // #endregion

    // #region Helper
    const hideLoading = () => setLoading(false);

    const timerEnded = () => {

        let arr = [...Devices];

            arr = arr.map((obj, ind) => {
                const {icon} = obj;

                return {
                    ...obj,
                    uri: {uri: icon},
                    pos: ind,
                    flag: false,
                }
            })

            setDeviceLs(arr);

            hideLoading();
    }

    const toggleSelectItem = (item) => {

        const {pos} = item;

        let arr = [...deviceLs];

        for(let ind in arr) {
            arr[ind].flag = false;
        }

        arr[pos].flag = true;

        setDeviceLs(arr);

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

                <Divider my={2}  bgColor={"#EBEBEB"} style={{width: width - 100}} />
                
                <FlatList 
                    data={deviceLs}
                    renderItem={renderItem}
                />
            </VStack>
        </BaseModal>
    )
}

export default Index;