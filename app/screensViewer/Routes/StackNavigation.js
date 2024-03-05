
import React, { useState, useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { BcStackNavigator } from "@components";

import { Logger } from "@utility";
import { Platform } from "react-native";

import { useNavigation } from "@react-navigation/native";

// Screens
import TabNavigation from "./TabNavigation";
import LoginII from "@screensViewer/Login/LoginII";

let StackScreens = {};

StackScreens = {
    ...StackScreens,
    LoginII: {
        component: LoginII,
        title: "LoginII",
        option: {
            orientation: "portrait"
        }
    }
};

StackScreens = {
    ...StackScreens,
    TabNavigation: {
        component: TabNavigation,
        title: "TabNavigation"
    }
};

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { clsConst } from "@config";

import { OneSignal } from "react-native-onesignal";

import { BcAppUpdateModal, BcServerMainModal } from "@components";
import { fetchGetAppVersion, fetchGetServerStatus, fetchSubUserAccess } from "@api";

import { useToggle } from "@hooks";
import { useToast } from "native-base";

import { setup } from "react-native-iap";

function Index(props) {

    // #region UseState
    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);
    const firstTimeLink = useSelector(Selectors.firstTimeLinkSelect);
    const loginAccess = useSelector(Selectors.loginAccessSelect);
    const tutorial = useSelector(Selectors.tutorialSelect);

    const [appFlag, setAppFlag, toggleAppFlag] = useToggle(false);
    const [serverFlag, setServerFlag, toggleServerFlag] = useToggle(false);
    // #endregion

    const navigation = useNavigation();
    const toast = useToast();

    useEffect(() => {
        // Hide Splash Screen
        SplashScreen.hide();

        // #region OneSignal
        OneSignal.initialize(clsConst.ONESIGNAL_APP_ID);

        // requestPermission will show the native iOS or Android notification permission prompt.
        // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
        OneSignal.Notifications.requestPermission(true);

        // Method for listening to Notification
        const fgEvt = (event) => {

            const { additionalData = {} } = event.notification;

            // console.log(OneSignal.Notifications.hasPermission(), additionalData);

            if ("Action" in additionalData && additionalData["Action"] == "Data_Controller") {
                const { Message } = additionalData;
                toast.show({
                    description: Message
                })
            }

            if ("Action" in additionalData && additionalData["Action"] == "Data_Auth") {
                navigation.navigate("AuthTuyaSessionExpired", additionalData);
            }

            if ("Action" in additionalData && additionalData["Action"] == "Data_Logout") {
                toast.show({
                    description: "Logout"
                })
                dispatch(Actions.onChangeLoginAccess(-1));
                navigation.navigate("LoginII");
            }

            if ("Action" in additionalData && additionalData["Action"] == "Data_Alert") {
                if (!tutorial) {
                    navigation.navigate("TabNavigation", {
                        screen: "Dashboard"
                    })
                }
            }

            event.getNotification().display();
        }
        OneSignal.Notifications.addEventListener('foregroundWillDisplay', fgEvt);

        // Method for listening for notification clicks
        const ckEvt = (event) => {

            const { additionalData = {} } = event.notification;

            if ("Action" in additionalData && additionalData["Action"] == "Data_Alert") {
                navigation.navigate("TabNavigation", {
                    screen: "Dashboard"
                })
            }

            event.getNotification().display();
        }
        OneSignal.Notifications.addEventListener('click', ckEvt);
        // #endregion

        getAppVersion();
        getServerStatus();
        RequestAccess(userId);

        // Setup for Getting Purchase History
        setup({ storekitMode: 'STOREKIT_HYBRID_MODE' });

        // Set Tutorial To True
        dispatch(Actions.onChangeTutorial(true));
    }, []);

    // #region Helper
    const getAppVersion = () => {
        fetchGetAppVersion({
            param: {
                UserId: 10,
            },
            onSetLoading: () => { }
        })
            .then(data => {
                setAppFlag(data);
            })
            .catch(err => {
                console.log(`Error: ${err}`)
            })
    }

    const getServerStatus = () => {
        fetchGetServerStatus({
            param: {
                UserId: 10,
            },
            onSetLoading: () => { }
        })
            .then(data => {
                setServerFlag(data);
            })
            .catch(err => {
                console.log(`Error: ${err}`)
            })
    }

    const RequestAccess = (userId) => {
        fetchSubUserAccess({
            param: {
                UserId: userId
            },
            onSetLoading: () => { },
        })
            .then(data => {
                dispatch(Actions.onChangeSubUserAccess(data));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    const defaultScreen = (userId == -1 || firstTimeLink) ? "LoginII" : "TabNavigation";
    // const defaultScreen = "Debug";

    return (
        <>
            <BcAppUpdateModal showModal={appFlag} />
            <BcServerMainModal showModal={serverFlag} />
            <BcStackNavigator
                screens={StackScreens}
                defaultScreen={defaultScreen} />
        </>
    )
}

export default Index;