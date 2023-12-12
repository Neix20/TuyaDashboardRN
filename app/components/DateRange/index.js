import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";

import { BcDateRangeModal, BcBoxShadow, BcDisable } from "@components";

import { useToggle } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function Index(props) {

    const { hook = [] } = props;
    const [startDt, setStartDt, endDt, setEndDt, addDt, minusDt, stDiff, endDiff] = hook;

    // #region UseState
    const [showDtModal, setShowDtModal, toggleDateModal] = useToggle(false);
    // #endregion

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AccountType = -1 } = subUserAccess;

    return (
        <>
            <BcDateRangeModal showModal={showDtModal} setShowModal={setShowDtModal} {...props} />
            <TouchableOpacity onPress={toggleDateModal}>
                <BcBoxShadow>
                    <View py={3}
                        bgColor={"#fff"}
                        alignItems={"center"}>
                        <HStack
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            style={{ width: "90%" }}>

                            {/* Calendar */}
                            <HStack space={3} alignItems={"center"}>
                                <FontAwesome5 name={"calendar-alt"} size={27} color={"#606267"} />
                                <VStack space={1}>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 16,
                                    }}>{Utility.formatDt(startDt, "EEE, d MMMM yyyy")}</Text>
                                </VStack>
                            </HStack>

                            {/* Controls */}
                            <HStack>

                                {
                                    (stDiff > 90) ? (
                                        <BcDisable>
                                            <View
                                                justifyContent={"center"}
                                                alignItems={"center"}
                                                style={{ height: 40, width: 40 }}>
                                                <FontAwesome name={"angle-left"} size={27} />
                                            </View>
                                        </BcDisable>
                                    ) : (
                                        <TouchableOpacity onPress={minusDt}>
                                            <View
                                                justifyContent={"center"}
                                                alignItems={"center"}
                                                style={{ height: 40, width: 40 }}>
                                                <FontAwesome name={"angle-left"} size={27} />
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }

                                {
                                    (endDiff <= 1) ? (
                                        <BcDisable>
                                            <View
                                                justifyContent={"center"}
                                                alignItems={"center"}
                                                style={{ height: 40, width: 40 }}>
                                                <FontAwesome name={"angle-right"} size={27} />
                                            </View>
                                        </BcDisable>
                                    ) : (
                                        <TouchableOpacity onPress={addDt}>
                                            <View
                                                justifyContent={"center"}
                                                alignItems={"center"}
                                                style={{ height: 40, width: 40 }}>
                                                <FontAwesome name={"angle-right"} size={27} />
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }
                            </HStack>
                        </HStack>
                    </View>
                </BcBoxShadow>
            </TouchableOpacity>
        </>
    )
}

export default Index;