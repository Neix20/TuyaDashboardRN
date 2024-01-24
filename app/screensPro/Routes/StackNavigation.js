
import React, { useState, useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { BcStackNavigator } from "@components";

import { Logger } from "@utility";
import { Platform } from "react-native";

import { useNavigation } from "@react-navigation/native";

// Screens
import Debug from "@screensPro/Debug";

import TabNavigation from "./TabNavigation";

import LoginII from "@screensPro/Login/LoginII";

import ProfileInfo from "@screensPro/Profile/ProfileInfo";

import ProfileWorkspace from "@screensPro/ProfileWorkspace";
import ProfileWorkspaceInfo from "@screensPro/ProfileWorkspace/ProfileWorkspaceInfo";

let StackScreens = {};

StackScreens = {
    ...StackScreens,
    LoginII: {
        component: LoginII,
        title: "LoginII",
        option: {
            orientation: "portrait"
        }
    },
    Debug: {
        component: Debug,
        title: "Debug"
    },
    ProfileInfo: {
        component: ProfileInfo,
        title: "ProfileInfo",
        option: {
            orientation: "portrait"
        }
    },
    ProfileWorkspace: {
        component: ProfileWorkspace,
        title: "ProfileWorkspace",
        option: {
            orientation: "portrait"
        }
    },
    ProfileWorkspaceInfo: {
        component: ProfileWorkspaceInfo,
        title: "ProfileWorkspaceInfo",
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

import AboutUs from "@screens/CompanyInfo/screens/AboutUs.js";
import Tnc from "@screens/CompanyInfo/screens/Tnc.js";
import Policy from "@screens/CompanyInfo/screens/Policy.js";
import Faq from "@screens/CompanyInfo/screens/Faq.js";

import YatuEngine from "@screens/YatuEngine";

StackScreens = {
    ...StackScreens,
    AboutUs: {
        component: AboutUs,
        title: "AboutUs",
        option: {
            orientation: "portrait"
        }
    },
    Tnc: {
        component: Tnc,
        title: "Tnc",
        option: {
            orientation: "portrait"
        }
    },
    Policy: {
        component: Policy,
        title: "Policy",
        option: {
            orientation: "portrait"
        }
    },
    Faq: {
        component: Faq,
        title: "Faq",
        option: {
            orientation: "portrait"
        }
    },
    YatuEngine: {
        component: YatuEngine,
        title: "YatuEngine",
        option: {
            orientation: "portrait"
        }
    }
}

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { clsConst } from "@config";

import OneSignal from "react-native-onesignal";


import { BcAppUpdateModal, BcServerMainModal } from "@components";
import { fetchGetAppVersion, fetchGetServerStatus, fetchSubUserAccess } from "@api";

import { useToggle } from "@hooks";
import { useToast } from "native-base";

import { initConnection, IapIosSk2, setup } from "react-native-iap";

function Index(props) {

    // #region UseState
    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);
    const firstTimeLink = useSelector(Selectors.firstTimeLinkSelect);
    const loginAccess = useSelector(Selectors.loginAccessSelect);

    const [appFlag, setAppFlag, toggleAppFlag] = useToggle(false);
    const [serverFlag, setServerFlag, toggleServerFlag] = useToggle(false);
    // #endregion

    const navigation = useNavigation();
    const toast = useToast();

    useEffect(() => {
        // Hide Splash Screen
        SplashScreen.hide();

        // One Signal
        OneSignal.setAppId(clsConst.ONESIGNAL_APP_ID);

        OneSignal.promptForPushNotificationsWithUserResponse();

        //Method for handling notifications received, When App Opened
        OneSignal.setNotificationWillShowInForegroundHandler(event => {
            const notification = event.getNotification();

            const { additionalData = {} } = notification;

            // Check For Payment Success
            if ("Action" in additionalData && additionalData["Action"] == "Data_Controller") {

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

            // Complete with null means don't show a notification.
            event.complete(notification);
        });

        //Method for handling notifications opened, When App closed
        OneSignal.setNotificationOpenedHandler(event => {
            const { additionalData = {} } = event.notification;
            
            if ("Action" in additionalData && additionalData["Action"] == "Data_Alert") {

            }
        });

        getAppVersion();
        getServerStatus();
        RequestAccess(userId);

        // Setup for Getting Purchase History
        setup({ storekitMode: 'STOREKIT_HYBRID_MODE' });
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

    const defaultScreen = (loginAccess == -1 || userId == -1 || firstTimeLink) ? "LoginII" : "TabNavigation";
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
// export default Debug;