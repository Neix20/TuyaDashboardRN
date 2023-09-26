import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";

import { BcDateRangeModal, BcBoxShadow } from "@components";

import { DateTime } from "luxon";

import { useToggle } from "@hooks";

function Index(props) {

    // #region Props
    const { startDt = "2023-09-01", setStartDt = () => {} } = props;
    const { endDt = "2023-09-01", setEndDt = () => {} } = props;
    // #endregion

    // #region UseState
    const [showDtModal, setShowDtModal, toggleDateModal] = useToggle(false);


    // #endregion

    // #region Helper

    const addDt = () => {
        const tStartDt = DateTime.fromISO(startDt)
            .plus({ days: 1 })
            .toFormat("yyyy-MM-dd");
        setStartDt(tStartDt);

        const tEndDt = DateTime.fromISO(endDt)
            .plus({ days: 1 })
            .toFormat("yyyy-MM-dd");
        setEndDt(tEndDt);
    };

    const minusDt = () => {
        const tStartDt = DateTime.fromISO(startDt)
            .plus({ days: -1 })
            .toFormat("yyyy-MM-dd");
        setStartDt(tStartDt);

        const tEndDt = DateTime.fromISO(endDt)
            .plus({ days: -1 })
            .toFormat("yyyy-MM-dd");
        setEndDt(tEndDt);
    };
    // #endregion

    return (
        <>
            <BcDateRangeModal key={startDt + endDt} showModal={showDtModal} setShowModal={setShowDtModal} {...props} />
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
                                    }}>{Utility.formatDt(startDt, "EEEE, d MMMM")}</Text>
                                </VStack>
                            </HStack>

                            {/* Controls */}
                            <HStack>
                                <TouchableOpacity onPress={minusDt}>
                                    <View
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        style={{ height: 40, width: 40 }}>
                                        <FontAwesome name={"angle-left"} size={27} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={addDt}>
                                    <View
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        style={{ height: 40, width: 40 }}>
                                        <FontAwesome name={"angle-right"} size={27} />
                                    </View>
                                </TouchableOpacity>
                            </HStack>
                        </HStack>
                    </View>
                </BcBoxShadow>
            </TouchableOpacity>
        </>
    )
}

export default Index;