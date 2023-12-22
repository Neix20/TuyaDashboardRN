import React, { useState, useEffect } from "react";

import { Platform } from "react-native";

import { Logger } from "@utility";
import { clsConst } from "@config";

import {
    PurchaseError,
    requestSubscription,
    validateReceiptIos,
    useIAP
} from "react-native-iap";
const { APP_STORE_SECRET_KEY, SUBSCRIPTION_SKUS } = clsConst;

import { useToggle } from "@hooks";

const { OS = "android" } = Platform;

function Index(onSetLoading = () => { }) {

    const {
        connected,
        subscriptions, // returns subscriptions for this app.
        getSubscriptions, // Gets available subsctiptions for this app.
        currentPurchase, // current purchase for the tranasction
        purchaseHistory, // return the purchase history of the user on the device (sandbox user in dev)
        getPurchaseHistory, // gets users purchase history
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
                Logger.error({ data: err });
            });
    };

    // Initialize
    useEffect(() => {
        if (connected) {
            handleGetSubscriptions();
        }
    }, [connected]);

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

    // Things to check:
    // // 1. List All Subscription
    // // 2. Generate Dict to Integrate Product Id and Price Into UsePayDict
    // 3. EAS Build (OTA Update)
    // 2. Buy Subscription
    // 3. Check Subscription Payment
    // 4. List Purchase History

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
                    Logger.error({
                        data: err
                    });
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

    /* Output
    const obj = {
        "com.subscription.mspp0100": {
            productId: "com.subscription.mspp0100", 
            subPlanCode: "mspp0100", 
            price: 0, 
            offerToken: ""
        }
    }
    */

    return [subscriptions, priceDict, handleRequestSubscription];
}

export default Index;