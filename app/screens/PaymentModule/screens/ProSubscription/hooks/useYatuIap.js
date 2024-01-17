import React, { useState, useEffect } from "react";

import { Platform } from "react-native";

import { Logger } from "@utility";
import { clsConst } from "@config";

import {
    requestSubscription,
    useIAP,
} from "react-native-iap";

// todo: Get by API instead
const { SUBSCRIPTION_SKUS } = clsConst;

const { OS = "android" } = Platform;

function Index(onSetLoading = () => { }) {

    const {
        connected,
        subscriptions, // returns subscriptions for this app. (Subscriptions To Sell)
        getSubscriptions, // Gets available subsctiptions for this app.
        currentPurchase, // current purchase for the tranasction
        finishTransaction,
        purchaseHistory,
        getPurchaseHistory
    } = useIAP();

    const handleGetSubscriptions = () => {
        onSetLoading(true);
        getSubscriptions({
            skus: SUBSCRIPTION_SKUS
        })
            .then(data => {
                onSetLoading(false);
            })
            .catch(err => {
                onSetLoading(false);
                Logger.error({ message: "handleGetSubscriptions", data: err })
            });
    };

    const handleGetPurchaseHistory = (props) => {

        if (subscriptions.length == 0) {
            return;
        }

        const { onEndTrue = () => {}, onEndFalse = () => {} } = props;

        onSetLoading(true);

        getPurchaseHistory()
        .then(data => {
            onSetLoading(false);
            onEndTrue();
        })
        .catch(err => {
            onSetLoading(false);
            onEndFalse();
            console.err({ message: "handleGetPurchaseHistory GetPurchaseHistory", data: err });
        })
    };

    // Initialize
    useEffect(() => {
        if (connected) {
            handleGetSubscriptions();
        }
    }, [connected]);

    // #region Price Dict

    // Output priceDict: {"com.subscription.mspp0100":{"productId":"com.subscription.mspp0100","subPlanCode":"mspp0100","price":0,"offerToken":""}}
    const [priceDict, setPriceDict] = useState({});

    useEffect(() => {
        if (subscriptions.length > 0) {

            let dict = {};

            for (const obj of subscriptions) {
                try {
                    let key = ""; // com.subscription.mspp0600
                    let res = {
                        subPlanCode: "", // mspp0600
                        offerToken: "",
                        price: 0
                    }

                    if (OS === "android") {
                        const { productId = "", subscriptionOfferDetails } = obj;
                        key = productId;

                        if (subscriptionOfferDetails.length > 0) {
                            const { pricingPhases: { pricingPhaseList }, offerToken = "" } = subscriptionOfferDetails[0];

                            res["offerToken"] = offerToken;

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

    const handleRequestSubscription = (sku, offerToken = "") => {
        onSetLoading(true);
        if (OS === "android") {
            requestSubscription({
                sku,
                ...(offerToken && { subscriptionOffers: [{ sku, offerToken }] }),
            })
                .then(data => {
                    onSetLoading(false);
                })
                .catch(err => {
                    onSetLoading(false);
                    Logger.error({ data: err });
                })
        }
        else if (OS === "ios") {
            requestSubscription({ sku })
                .then(data => {
                    onSetLoading(false);
                })
                .catch(err => {
                    onSetLoading(false);
                    Logger.error({ data: err });
                })
        }
    }

    return [
        subscriptions, currentPurchase, finishTransaction,
        priceDict, handleRequestSubscription,
        purchaseHistory, handleGetPurchaseHistory
    ];
}

export default Index;