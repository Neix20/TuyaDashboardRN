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

import { BcLoading } from "@components";

import { fetchSubscriptionProPlan } from "@api";

import { withIAPContext } from "react-native-iap";

function Index() {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading] = useToggle(false);

    const [subLs, t1, t2, subPriceDict, handleRequestSubscription] = useYatuIap(setLoading);

    // #region Subscription Plan
    const payDictHook = usePayDict();
    const [payDict, setPayDict, payDictKey, payProImg] = payDictHook;

    useEffect(() => {
        if (isFocused && subLs.length > 0) {
            SubscriptionProPlan();
        }
    }, [isFocused, subLs]);

    useEffect(() => {
        const data = {
            "autoRenewingAndroid": false,
            "dataAndroid": "{\"orderId\":\"GPA.3379-7537-5652-93189\",\"packageName\":\"com.yatudashboard\",\"productId\":\"com.subscription.mspp0300\",\"purchaseTime\":1703577705812,\"purchaseState\":0,\"purchaseToken\":\"lcohkopiojnfojffnkffblmk.AO-J1Oz03tZuP2jwUrlBCwp_J28-lEn_Rv6Ul6HryAd_4aJDZA6gb82tXUzQED_PTKv6qIcAdOsjpwDHIPiPELZAblHSE6kYKw\",\"quantity\":1,\"autoRenewing\":false,\"acknowledged\":false}",
            "developerPayloadAndroid": "",
            "isAcknowledgedAndroid": false,
            "obfuscatedAccountIdAndroid": "",
            "obfuscatedProfileIdAndroid": "",
            "packageNameAndroid": "com.yatudashboard",
            "productId": "com.subscription.mspp0300",
            "productIds": [
                "com.subscription.mspp0300"
            ],
            "purchaseStateAndroid": 1,
            "purchaseToken": "lcohkopiojnfojffnkffblmk.AO-J1Oz03tZuP2jwUrlBCwp_J28-lEn_Rv6Ul6HryAd_4aJDZA6gb82tXUzQED_PTKv6qIcAdOsjpwDHIPiPELZAblHSE6kYKw",
            "signatureAndroid": "iIkBQJeC7OjQF3efLGfgshuBPU1YvoNZtxxeKxx45LmQgwkKFpv8hMar0Q7WSVN5eLyQ20ZtN1j0NWcPULXZWBdndonuaw2dx8fJHT/mNZtVuQo2liRRbJ17s+dNX992x1GRcbuNuBjYjU7JmJq+vqNDHV3z+eMkf+NN6lZGKApk3oUg+h5OEI0YB3hx023KM1LsycP+7tKevNqy57SGTz6NoJkXR/xAAc54DrJo668qyz8LNWyxD6X6zWAcQ8hEdBpW1Eyh0UDCr0NOOHgGFX0YUEY92mFkDEGKFZh833KMMEWdReQVGSlWkVVMx+wbrODupVX88fDzRVoZGuMkVw==",
            "transactionDate": 1703577705812,
            "transactionId": "GPA.3379-7537-5652-93189",
            "transactionReceipt": "{\"orderId\":\"GPA.3379-7537-5652-93189\",\"packageName\":\"com.yatudashboard\",\"productId\":\"com.subscription.mspp0300\",\"purchaseTime\":1703577705812,\"purchaseState\":0,\"purchaseToken\":\"lcohkopiojnfojffnkffblmk.AO-J1Oz03tZuP2jwUrlBCwp_J28-lEn_Rv6Ul6HryAd_4aJDZA6gb82tXUzQED_PTKv6qIcAdOsjpwDHIPiPELZAblHSE6kYKw\",\"quantity\":1,\"autoRenewing\":false,\"acknowledged\":false}"
        };
        Logger.serverInfo({res: data})
    }, []);

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
                        <View flexGrow={1} justifyContent={"center"}>
                            <VStack alignItems={"center"} space={3}>
                                <Text>This is Debug Page</Text>
                                <HStack width={"80%"} space={3} 
                                    alignItems={"center"} style={{ height: 60 }}>
                                    {Object.values(payDict).map(renderItem)}
                                </HStack>
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

export default withIAPContext(Index);