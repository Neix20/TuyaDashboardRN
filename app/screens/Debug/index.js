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
import { withIAPContext, PurchaseError } from "react-native-iap";

import { Platform } from "react-native";

function PaymentIap() {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading] = useToggle(false);

    const [subLs, currentPurchase, finishTransaction, subPriceDict, handleRequestSubscription, purchaseHistoryLs] = useYatuIap(setLoading);
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

    useEffect(() => {
        if (purchaseHistoryLs.length > 0) {
            Logger.info({ 
                data: purchaseHistoryLs, 
                os: Platform.OS,
                code: "PurchaseHistoryLs"
            });
            toast.show({
                description: "Purchase History Loaded!"
            })
        }
    }, [purchaseHistoryLs]);

    useEffect(() => {
        if (subLs.length > 0) {
            Logger.info({ 
                data: subLs, 
                os: Platform.OS,
                code: "Subscription Listing"
            });
            toast.show({
                description: "Subscription Listing Loaded!"
            })
        }
    }, [subLs]);

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

    // #region IAP Listener
    useEffect(() => {
        const checkCurrentPurchase = async () => {
            try {
                if (currentPurchase?.productId) {
                    setLoading(true);
                    const { productId } = currentPurchase;

                    const ackResult = await finishTransaction({ purchase: currentPurchase, isConsumable: false });

                    // Debug
                    const resp = {
                        ...currentPurchase,
                        ...ackResult,
                        os: Platform.OS,
                        code: "PurchaseTransaction"
                    }
                    Logger.info(resp);

                    setLoading(false);

                    // const { transactionId: refNo = "", purchaseToken = "" } = resp;

                    // const subCode = productId.split(".").at(-1);
                    // CreateSubscriptionOrderWithStorePayment(subCode, refNo);
                }
            } catch (error) {
                if (error instanceof PurchaseError) {
                    Logger.error({ message: `[${error.code}]: ${error.message}`, error });
                } else {
                    Logger.error({ message: "handleBuyProduct", error });
                }

                setLoading(false);
            }
        };

        if (currentPurchase != undefined) {
            checkCurrentPurchase();
        }
    }, [currentPurchase]);
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
