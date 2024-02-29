import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { clsConst } from "@config";
const { SUBSCRIPTION_SKUS } = clsConst;

import { useToggle, usePayDict, useYatuIap } from "@hooks";
import { BcLoading, BcYesNoModal } from "@components";

import { fetchSubscriptionProPlan, fetchRestoreStorePurchase } from "@api";
import { withIAPContext, PurchaseError } from "react-native-iap";

import { Platform } from "react-native";

function PaymentIap() {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading] = useToggle(false);

    const [subLs, currentPurchase, finishTransaction, subPriceDict, handleRequestSubscription, purchaseHistoryLs, getPurchaseHistory] = useYatuIap(setLoading);
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
        if (subLs.length > 0) {
            Logger.serverInfo({
                data: subLs,
                os: Platform.OS,
                code: "SubscriptionLs"
            });
            toast.show({
                description: "Subscription Listing Loaded!"
            })
        }
    }, [subLs]);

    // useEffect(() => {
    //     if (purchaseHistoryLs.length > 0) {
    //         Logger.serverInfo({ 
    //             data: purchaseHistoryLs, 
    //             os: Platform.OS,
    //             code: "PurchaseHistoryLs"
    //         });
    //         toast.show({
    //             description: "Purchase History Loaded!"
    //         })
    //     }
    // }, [purchaseHistoryLs]);

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

    const RestoreStorePurchase = (SubscriptionCode = "") => {
        setLoading(true);
        fetchRestoreStorePurchase({
            param: {
                UserId: 10,
                SubscriptionCode
            },
            onSetLoading: setLoading
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

                    const ackResult = await finishTransaction({ purchase: currentPurchase, isConsumable: false });

                    // Debug
                    const resp = {
                        ...currentPurchase,
                        ...ackResult,
                        os: Platform.OS,
                        code: "PurchaseTransaction"
                    }
                    Logger.serverInfo(resp);
                    setLoading(false);

                    // const { productId = "", transactionId: refNo = "", purchaseToken = "" } = resp;

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

    const RestorePurchase = () => {
        const onEndTrue = () => {
            if (purchaseHistoryLs.length > 0) {

                const { productId = "" } = purchaseHistoryLs[0];

                // const sku = "com.subscription.mspp0100";
                const sku = productId.split(".").at(-1);
                RestoreStorePurchase(sku);

                toast.show({
                    description: "Successfully restored your subscription."
                })
            } else {
                toast.show({
                    description: "No subscription available to restore."
                })
            }
            setShowRpModal(false);
        }

        const onEndFalse = () => {
            toast.show({
                description: "No subscription available to restore."
            })
            setShowRpModal(false);
        }

        getPurchaseHistory({ onEndTrue, onEndFalse });
    };

    return (
        <>
            <BcYesNoModal
                showModal={showRpModal} setShowModal={setShowRpModal}
                title={"Restore Purchase"}
                description={`This will restore all your deleted purchases from App Store & Google play store.\n\nWould you like to restore your purchases?`}
                titleYes={"Restore"} titleNo={"Cancel"}
                onPressYes={RestorePurchase} onPressNo={toggleRpModal}
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

import AppLink from 'react-native-app-link';

import { Linking } from "react-native";

function OpenTuyaApp(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const links = [
        "https://apps.apple.com/my/app/smart-life-smart-living/id=1115101477"
    ];

    const tuyaLink = {
        appName: "Smart Life",
        appStoreId: "1115101477",
        appStoreLocale: "us",
        playStoreId: "com.tuya.smartlife"
    }

    const openTuyaLink = () => {

        Linking.openURL(links[0]);
       
        // AppLink.openInStore(tuyaLink).then(() => {
        //     // do stuff
        //     toast.show({
        //         description: "Nani the Fuck"
        //     })
        //   })
        //   .catch((err) => {
        //     // handle error
        //     console.error(err);
        //   });
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
        
                {/* Header */}
                <View style={{ height: 80 }} />
        
                <View style={{ height: 10 }} />
        
                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false} 
                    keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
                        <TouchableOpacity onPress={openTuyaLink} style={{ width: "60%", height: 40 }}>
                            <View flex={1} backgroundColor={"#F00"}
                                alignItems={"center"} justifyContent={"center"}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "white",
                                }}>Open Smart Life</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
        
                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    )
}

// export default OpenTuyaApp;

function TestNotification(props) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
        
                {/* Header */}
                <View style={{ height: 80 }} />
        
                <View style={{ height: 10 }} />
        
                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false} 
                    keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
                        <Text>This is to Test Notification</Text>
                    </View>
                </ScrollView>
        
                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    )
}

export default TestNotification;