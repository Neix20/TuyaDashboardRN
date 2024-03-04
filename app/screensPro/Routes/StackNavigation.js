
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

// Token
import UserToken from "@screens/UserToken";
import UserTokenInfo from "@screens/UserToken/UserTokenInfo.js";

// Qr Scanner
import ScanQr from "@screens/ScanQr";
import DeviceResult from "@screensLite/Device/Result";

// Device
import DeviceLanding from "@screens/Device/DeviceLanding";
import DeviceLandingSmartPlug from "@screens/Device/DeviceLanding/SmartPlug";
import DeviceLandingAirCon from "@screens/Device/DeviceLanding/AirCon";

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
}

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
    },
    DeviceLanding: {
        component: DeviceLanding,
        title: "DeviceLanding",
        option: {
            orientation: "portrait"
        }
    }
}

import Subscription from "@screens/Subscription";
import SubscriptionInfo from "@screens/Subscription/SubscriptionInfo";

import Payment from "@screens/PaymentModule/screens/Payment.js";
import WebPayment from "@screens/PaymentModule/screens/WebPayment.js";
import PaymentFailed from "@screens/PaymentModule/screens/PaymentFailed.js";
import ThankYou from "@screens/PaymentModule/screens/ThankYou.js";
import PaymentProSubscription from "@screens/PaymentModule/screens/ProSubscription";

import PaymentSubscription from "@screens/PaymentModule/screens/Subscription.js";
import PaymentSubscriptionAddOn from "@screens/PaymentModule/screens/Addon/index.js";
import PaymentSubscriptionDetail from "@screens/PaymentModule/screens/Addon/detail.js";

StackScreens = {
    ...StackScreens,
    Subscription: {
        component: Subscription,
        title: "Subscription",
        option: {
            orientation: "portrait"
        }
    },
    SubscriptionInfo: {
        component: SubscriptionInfo,
        title: "SubscriptionInfo",
        option: {
            orientation: "portrait"
        }
    }
}

StackScreens = {
    ...StackScreens,
    Payment: {
        component: Payment,
        title: "Payment",
        option: {
            orientation: "portrait"
        }
    },
    WebPayment: {
        component: WebPayment,
        title: "WebPayment",
        option: {
            orientation: "portrait"
        }
    },
    PaymentFailed: {
        component: PaymentFailed,
        title: "PaymentFailed",
        option: {
            orientation: "portrait"
        }
    },
    ThankYou: {
        component: ThankYou,
        title: "ThankYou",
        option: {
            orientation: "portrait"
        }
    },
    PaymentProSubscription: {
        component: PaymentProSubscription,
        title: "PaymentProSubscription",
        option: {
            orientation: "portrait"
        }
    },
    PaymentSubscription: {
        component: PaymentSubscription,
        title: "PaymentSubscription",
        option: {
            orientation: "portrait"
        }
    },
    PaymentSubscriptionAddOn: {
        component: PaymentSubscriptionAddOn,
        title: "PaymentSubscriptionAddOn",
        option: {
            orientation: "portrait"
        }
    },
    PaymentSubscriptionDetail: {
        component: PaymentSubscriptionDetail,
        title: "PaymentSubscriptionDetail",
        option: {
            orientation: "portrait"
        }
    }
}

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

import { OneSignal } from "react-native-onesignal";

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

        // #region OneSignal
        // OneSignal Initialization
        OneSignal.initialize(clsConst.ONESIGNAL_APP_ID);

        // requestPermission will show the native iOS or Android notification permission prompt.
        // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
        OneSignal.Notifications.requestPermission(true);

        // Method for listening to Notification
        OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
            const { additionalData = {} } = event.notification;

            if ("Action" in additionalData && additionalData["Action"] == "Data_Controller") {}

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
        });

        // Method for listening for notification clicks
        OneSignal.Notifications.addEventListener('click', (event) => {
            const { additionalData = {} } = event.notification;

            if ("Action" in additionalData && additionalData["Action"] == "Data_Alert") {}
        });
        // #endregion

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

    /**
     * Get Sub User Access Based on Current User Id
     * @param {int} userId 
     */
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

    // const defaultScreen = (loginAccess == -1 || userId == -1 || firstTimeLink) ? "LoginII" : "TabNavigation";
    const defaultScreen = (userId == -1) ? "LoginII" : "TabNavigation";
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