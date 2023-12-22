import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";
import { clsConst } from "@config";

import { useToggle, usePayDict } from "@hooks";

import { BcLoading } from "@components";

import { fetchSubscriptionProPlan } from "@api";
import { DateTime } from "luxon";


// #region IAP Hooks
import { Platform, Alert } from "react-native";
import {
    PurchaseError,
    requestSubscription,
    validateReceiptIos,
    useIAP,
    withIAPContext,
    purchaseErrorListener,
    purchaseUpdatedListener
} from "react-native-iap";
const { APP_STORE_SECRET_KEY } = clsConst;

// // TODO: Get From 'GetSubProPlan' API
const subscriptionSkus = [
    // "com.subscription.mspp0100",
    "com.subscription.mspp0300",
    "com.subscription.mspp0600",
    "com.subscription.mspp1000"
];

const { OS = "android" } = Platform;

function useYatuIAP(onSetLoading = () => { }) {

    const {
        connected,
        subscriptions, // returns subscriptions for this app.
        getSubscriptions, // Gets available subsctiptions for this app.
        currentPurchase, // current purchase for the tranasction
        purchaseHistory, // return the purchase history of the user on the device (sandbox user in dev)
        getPurchaseHistory, // gets users purchase history
    } = useIAP();

    const [purchased, setPurchased, togglePurchased] = useToggle();

    const handleGetSubscriptions = () => {
        onSetLoading(true);
        getSubscriptions({
            skus: subscriptionSkus
        })
            .then(data => {
                onSetLoading(false);
            })
            .catch(err => {
                onSetLoading(false);
                Logger.error({ data: err });
            });
    };

    // Initialize
    useEffect(() => {
        if (connected) {
            handleGetSubscriptions();
        }
    }, [connected]);

    // Listener
    useEffect(() => {
        const purchaseErrorSubscription = purchaseErrorListener((error) => {
            if (!(error["responseCode"] === "2")) {
                Alert.alert("Error", `There has been an error with your purchase, error code: ${error["code"]}`);
            }
        });

        const purchaseUpdateSubscription = purchaseUpdatedListener((purchase) => {
            const receipt = purchase.transactionReceipt;
            if (receipt) {
                Alert.alert("Success", "Successful Transaction!")
                finishTransaction(purchase, false);
            }
        });

        return () => {
            purchaseUpdateSubscription.remove();
            purchaseErrorSubscription.remove();
        };
    }, [])

    // #region Price Dict
    const [priceDict, setPriceDict] = useState({});
    useEffect(() => {
        if (subscriptions.length > 0) {

            let dict = {};

            for (const obj of subscriptions) {
                try {
                    let key = ""; // com.subscription.mspp0600
                    let res = {
                        subPlanCode: "", // mspp0600
                        price: 0
                    }

                    if (OS === "android") {
                        const { productId = "", subscriptionOfferDetails } = obj;
                        key = productId;

                        if (subscriptionOfferDetails.length > 0) {
                            const { pricingPhases: { pricingPhaseList } } = subscriptionOfferDetails[0];

                            if (pricingPhaseList.length > 0) {
                                const { priceAmountMicros = 0 } = pricingPhaseList[0];
                                res["price"] = +priceAmountMicros / 1000000;
                            }
                        }
                    }
                    else if (OS === "ios") {
                        const { productId = "", price: planPrice = 0 } = obj;
                        key = productId;

                        res["price"] = +planPrice;
                    }

                    if (key != "") {
                        res["subPlanCode"] = key.split(".").at(-1);
                        res["productId"] = key;
                        dict[key] = res;
                    }
                } catch (err) {
                    console.error(`Error: ${err}`);
                }
            }

            setPriceDict(_ => dict);
        }
    }, [subscriptions]);
    // #endregion

    // Things to check:
    // // 1. List All Subscription
    // // 2. Generate Dict to Integrate Product Id and Price Into UsePayDict
    // 3. EAS Build (OTA Update)
    // 2. Buy Subscription
    // 3. Check Subscription Payment
    // 4. List Purchase History

    return [subscriptions, priceDict];
}
// #endregion

function Index() {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading] = useToggle(false);

    const [subLs, subPriceDict] = useYatuIAP(setLoading);

    // #region Subscription Plan
    const payDictHook = usePayDict();
    const [payDict, setPayDict, payDictKey, payProImg] = payDictHook;

    useEffect(() => {
        if (isFocused && subLs.length > 0) {
            SubscriptionProPlan();
        }
    }, [isFocused, subLs]);

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
                data = data.filter(x => {
                    const { data: { StoreCode } } = x;
                    return subscriptionSkus.includes(StoreCode);
                });
                setPayDict(data);
            })
            .catch(err => {
                setLoading(false);
                console.error(`Error: ${err}`);
            })
    }
    // #endregion

    const renderItem = (obj, ind) => {
        const { productId, price, subPlanCode } = obj;

        const onSelect = () => requestSubscription(productId);

        return (
            <TouchableOpacity onPress={onSelect} style={{ flex: 1 }}>
                <View backgroundColor={"#00F"} flexGrow={1}
                    alignItems={"center"} justifyContent={"center"}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "#FFF",
                    }}>{subPlanCode}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <>
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
                        <View flexGrow={1}
                            justifyContent={"center"}
                            alignItems={"center"}>
                            <Text>This is Debug Page</Text>
                            <HStack width={"80%"} space={3}
                                alignItems={"center"}
                                style={{ height: 60 }}>
                                {Object.values(subPriceDict).map(renderItem)}
                            </HStack>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    )
}

export default withIAPContext(Index);