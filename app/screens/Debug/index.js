import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { clsConst } from "@config";
const { SUBSCRIPTION_SKUS } = clsConst;

import { useToggle, usePayDict, useYatuIap } from "@hooks";
import { BcLoading, BcYesNoModal } from "@components";

import { fetchSubscriptionProPlan } from "@api";
import { withIAPContext } from "react-native-iap";

function PaymentIap() {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading] = useToggle(false);

    const [subLs, t1, t2, subPriceDict, handleRequestSubscription, purchaseHistoryLs] = useYatuIap(setLoading);
    const [showRpModal, setShowRpModal, toggleRpModal] = useToggle();

    // #region Subscription Plan
    const payDictHook = usePayDict();
    const [payDict, setPayDict, payDictKey, payProImg] = payDictHook;

    useEffect(() => {
        const length = Object.keys(subPriceDict).length;
        if (isFocused && length > 0) {
            SubscriptionProPlan();
        }
    }, [isFocused, subPriceDict]);

    const SubscriptionProPlan = () => {
        setLoading(true);
        fetchSubscriptionProPlan({
            param: {
                UserId: 10
            },
            onSetLoading: setLoading
        })
            .then(data => {
                // Filter Data By SubCode
                data = data.map(x => {
                    const { data: { StoreCode } } = x;
                    return {
                        ...x,
                        ...subPriceDict[StoreCode]
                    }
                });

                data = data.filter(x => {
                    const { data: { StoreCode } } = x;
                    return SUBSCRIPTION_SKUS.includes(StoreCode);
                });

                setPayDict(data);
            })
            .catch(err => {
                setLoading(false);
                console.error(`Error: ${err}`);
            })
    }
    // #endregion

    // #region Render
    const renderItem = (obj) => {
        const { key, productId, offerToken = "" } = obj;

        const onSelect = () => handleRequestSubscription(productId, offerToken);

        return (
            <TouchableOpacity key={productId} onPress={onSelect}
                style={{ flex: 1 }}>
                <View backgroundColor={"#00F"} flexGrow={1}
                    alignItems={"center"} justifyContent={"center"}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#FFF",
                    }}>{key}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    // #endregion

    const onPressYes = () => {};
    const onPressNo = () => {};

    return (
        <>
            <BcYesNoModal 
                showModal={showRpModal} setShowModal={setShowRpModal}
                title={"Test"} description={"Test"}
                titleYes={"Delete"} titleNo={"Cancel"}
                onPressYes={onPressYes} onPressNo={onPressNo}
            />
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <View style={{ height: 80 }} />

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1} justifyContent={"center"}>
                            <VStack alignItems={"center"} space={3}>
                                <Text>This is Debug Page</Text>
                                <HStack width={"80%"} space={3} 
                                    alignItems={"center"} style={{ height: 60 }}>
                                    {Object.values(payDict).map(renderItem)}
                                </HStack>

                                <TouchableOpacity onPress={toggleRpModal}
                                    style={{ width: "60%", height: 40 }}>
                                    <View flex={1} backgroundColor={"#ff0000"}
                                        alignItems={"center"} justifyContent={"center"}>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: "bold",
                                            color: "white",
                                        }}>Restore Purchases</Text>
                                    </View>
                                </TouchableOpacity>
                            </VStack>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    )
}

export default withIAPContext(PaymentIap);

// import Dashboard from "./Dashboard";
// export default Dashboard;
