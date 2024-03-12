import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, FlatList } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { fetchGetStatusList } from "@api";

import { BaseIIModal } from "@components";

import { useTariff } from "@hooks";

import { UserTariffData } from "./data";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function TariffItemElem(props) {
    const { flag = false, Title = "" } = props;
    const { onPress = () => { } } = props;

    const style = {
        title: {
            fontSize: 16,
            fontFamily: "Roboto-Medium",
            color: Utility.getColor()
        },
        iconDiv: {
            width: 24,
            height: 24,
            borderRadius: 12,
        }
    }

    return (
        <TouchableOpacity onPress={onPress} style={{ width: "100%", height: 48 }}>
            <HStack py={3} flex={1} alignItems={"center"} justifyContent={"space-between"}>
                <View style={{ width: 10 }} />
                <Text style={style.title}>{Title}</Text>
                {
                    (flag) ? (
                        <View bgColor={"#4ECB71"}
                            alignItems={"center"} justifyContent={"center"}
                            style={style.iconDiv}>
                            <FontAwesome name={"check"} color={"#fff"} size={18} />
                        </View>
                    ) : (
                        <View style={style.iconDiv} />
                    )
                }
            </HStack>
        </TouchableOpacity>
    )
}

// Refer To: Viewer Sesssion Modal
function Index(props) {

    const { showModal = false, setShowModal = () => {} } = props;

    const dispatch = useDispatch();
    const [tariffData, setTariffData, toggleTariffItem, selectByTariff] = useTariff();

    const userTariff = useSelector(Selectors.userTariffSelect);
    const { Id: tariffId } = userTariff;

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
            color: "#000"
        }
    }

    // #region UseEffect
    useEffect(() => {
        if (showModal) {
            GetStatusList();
        }
    }, [showModal]);

    useEffect(() => {
        if (tariffData.length > 0) {
            const item = selectByTariff(tariffId);
            dispatch(Actions.onChangeUserTariff(item));
        }
    }, [tariffData]);
    // #endregion

    // #region Helper
    const GetStatusList = () => {
        fetchGetStatusList({
            param: {
                UserId: 10,
                StatusType: "UserTariff"
            },
            onSetLoading: () => {}
        }).then(data => {
            setTariffData(data);
        })
        .catch(err => {
            console.error(err);
        })
    }

    const renderItem = ({ item, index }) => {
        const onSelect = () => {
            toggleTariffItem(item);
            setShowModal(false);
        }
        return (
            <>
                <TariffItemElem key={index} onPress={onSelect} {...item} />
                <Divider bgColor={"#EBEBEB"} />
            </>
        )
    }
    // #endregion

    return (
        <BaseIIModal {...props}>
            <View alignItems={"center"}>
                <Text style={style.title}>Energy Tariff</Text>
                <Divider width={"90%"} bgColor={"#EBEBEB"} mt={2} />

                <FlatList
                    data={tariffData}
                    renderItem={renderItem}
                    style={{ width: "80%" }}
                />
            </View>
        </BaseIIModal>
    );
}

export default Index;