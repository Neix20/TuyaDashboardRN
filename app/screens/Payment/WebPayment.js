import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, BackHandler, SafeAreaView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { info, error, Utility } from "@utility";

import { WebView } from "react-native-webview";

import { BcYesNoModal, BcLoading, BcBoxShadow, BcHeader } from "@components";

import { Images } from "@config";

import { useToggle } from "@hooks";

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Props
    // const { url } = props.route.params;
    const url = "https://google.com";
    // #endregion

    // #region UseState
    const webView = useRef(null);

    const [resp, setResp] = useState("");
    const [showWebView, setShowWebView] = useState(false);

    const [showExitModal, setShowExitModal, toggleExitModal] = useToggle(false);
    // #endregion

    // #region UseEffect
    // Detect Back Button
    useEffect(() => {
        const backAction = () => {
            if (!isFocused) {
                return false;
            }

            setShowExitModal(true);
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [isFocused]);

    useEffect(() => {
        if (isFocused) {
            setTimeout(() => {
                setShowWebView(true);
            }, 1000);

            setResp("");
        }
    }, [isFocused]);

    useEffect(() => {
        if (resp == "successful") {
            GoToThankYou();
        } else if (resp === "fail") {
            GoToPaymentFailed();
        }
    }, [resp]);
    // #endregion

    const onChangeUrl = (state) => {
        const { url } = state;

        if (!url) return;

        if(url.includes("google")) {

        }
        else {
            let term = url.includes("youtube") ? "successful" : "fail";
    
            setResp(term);
        }

        // const rgx = /.*wrap2rap.*transaction(.*)\..*/g;
            // const term = url.replace(rgx, "$1");
        
    }

    // #region Navigation Function
    const GoToThankYou = () => {
        navigation.navigate("ThankYou");
    }

    const GoToPaymentFailed = () => {
        navigation.navigate("PaymentFailed");
    }

    const onBack = () => {
        setShowExitModal(true);
    }
    // #endregion

    return (
        <>
            <BcYesNoModal showModal={showExitModal} setShowModal={setShowExitModal} 
                title={"Warning"} showCross={false}
                onPressYes={GoToPaymentFailed}
                description={"Are you sure you want to exit this page?"} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <BcHeader onBack={onBack}>Payment</BcHeader>
                    <View style={{ height: 5 }} />
                    {
                        (showWebView) ? (
                            <WebView
                                ref={webView}
                                source={{ uri: url }}
                                onNavigationStateChange={onChangeUrl}
                                scalesPageToFit={true}
                            />
                        ) : (
                            <View alignItems={"center"}>
                                <View width={"90%"}>
                                    <Text>Redirecting you to payment page...</Text>
                                </View>
                            </View>
                        )
                    }
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;