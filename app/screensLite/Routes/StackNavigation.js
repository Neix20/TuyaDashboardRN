
import React, { useState, useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { BcStackNavigator } from "@components";

import { Logger } from "@utility";
import { Platform } from "react-native";

import { useNavigation } from "@react-navigation/native";

// Screens
import Debug from "@screensLite/Debug";
import TabNavigation from "./TabNavigation";
import LoginII from "@screensLite/Login/LoginII";

import ProfileInfo from "@screensLite/Profile/ProfileInfo";
import ProfileWorkspace from "@screensLite/ProfileWorkspace";
import ProfileWorkspaceInfo from "@screensLite/ProfileWorkspace/ProfileWorkspaceInfo";

// Check Tuya Email & Auth
import CheckTuyaEmail from "@screens/CheckTuyaEmail";
import AuthTuya from "@screens/AuthTuya";
import AuthTuyaHighTraffic from "@screens/AuthTuya/HighTraffic";
import AuthTuyaSessionExpired from "@screens/AuthTuya/SessionExpired";

// Token & UserToken
import TokenActivation from "@screens/Token/screens/TokenActivation.js";
import TokenSuccess from "@screens/Token/screens/TokenSuccess.js";
import UserToken from "@screens/UserToken";
import UserTokenInfo from "@screens/UserToken/UserTokenInfo.js";

// Qr Scanner
import ScanQr from "@screens/ScanQr";
import DeviceResult from "@screensLite/Device/Result";

// Token Wallet
import TokenWallet from "@screens/TokenWallet";

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

StackScreens = {
    ...StackScreens,
    CheckTuyaEmail: {
        component: CheckTuyaEmail,
        title: "CheckTuyaEmail",
        option: {
            orientation: "portrait"
        }
    },
    AuthTuya: {
        component: AuthTuya,
        title: "AuthTuya",
        option: {
            orientation: "portrait"
        }
    },
    AuthTuyaHighTraffic: {
        component: AuthTuyaHighTraffic,
        title: "AuthTuyaHighTraffic",
        option: {
            orientation: "portrait"
        }
    },
    AuthTuyaSessionExpired: {
        component: AuthTuyaSessionExpired,
        title: "AuthTuyaSessionExpired",
        option: {
            orientation: "portrait"
        }
    }
};

StackScreens = {
    ...StackScreens,
    TokenActivation: {
        component: TokenActivation,
        title: "TokenActivation",
        option: {
            orientation: "portrait"
        }
    },
    TokenSuccess: {
        component: TokenSuccess,
        title: "TokenSuccess",
        option: {
            orientation: "portrait"
        }
    },
    UserToken: {
        component: UserToken,
        title: "UserToken",
        option: {
            orientation: "portrait"
        }
    },
    UserTokenInfo: {
        component: UserTokenInfo,
        title: "UserTokenInfo",
        option: {
            orientation: "portrait"
        }
    }
};

StackScreens = {
    ...StackScreens,
    ScanQr: {
        component: ScanQr,
        title: "ScanQr",
        option: {
            orientation: "portrait"
        }
    },
    DeviceResult: {
        component: DeviceResult,
        title: "DeviceResult",
        option: {
            orientation: "portrait"
        }
    }
}

StackScreens = {
    ...StackScreens,
    TokenWallet: {
        component: TokenWallet,
        title: "TokenWallet",
        option: {
            orientation: "portrait"
        }
    }
}

import AboutUs from "@screens/CompanyInfo/screens/AboutUs.js";
import Yatu from "@screens/CompanyInfo/screens/Yatu.js";
import Tnc from "@screens/CompanyInfo/screens/Tnc.js";
import Policy from "@screens/CompanyInfo/screens/Policy.js";
import Faq from "@screens/CompanyInfo/screens/Faq.js";
import ContactUs from "@screens/CompanyInfo/screens/ContactUs.js";

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
    Yatu: {
        component: Yatu,
        title: "Yatu",
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
    },
    ContactUs: {
        component: ContactUs,
        title: "ContactUs",
        option: {
            orientation: "portrait"
        }
    }
}

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
        // OneSignal Initialization
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
    // const defaultScreen = "AuthTuya";

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