import React, { useState, useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { BcStackNavigator } from "@components";

// Screens
import Debug from "@screens/Debug";

import TabNavigation from "./TabNavigation";

import AboutUs from "@screens/AboutUs";

import DeviceScan from "@screens/Device/DeviceScan";

import DeviceLanding from "@screens/Device/DeviceLanding";
import DeviceLandingSmartPlug from "@screens/Device/DeviceLanding/SmartPlug";
import DeviceLandingAirCon from "@screens/Device/DeviceLanding/AirCon";

import DeviceInfo from "@screens/Device/DeviceInfo";
import DeviceAlert from "@screens/Device/DeviceAlert";
import DeviceTable from "@screens/Device/DeviceTable";

import DeviceChart from "@screens/Device/DeviceChart";
import DeviceSPChart from "@screens/Device/DeviceChart/SmartPlug";

import DeviceRulesInfo from "@screens/DeviceRules/DeviceRulesInfo";
import AddDeviceRules from "@screens/DeviceRules/AddDeviceRules";
import UpdateDeviceRules from "@screens/DeviceRules/UpdateDeviceRules";

import HomeManagement from "@screens/Home/HomeManagement";
import HomeInfo from "@screens/Home/HomeInfo";
import AddHome from "@screens/Home/AddHome";

import Login from "@screens/Login";
import AuthTuya from "@screens/AuthTuya";

import UsageInfo from "@screens/UsageInfo";

import WelcomeInfo from "@screens/WelcomeInfo";

import TuyaPanel from "@screens/TuyaPanel";

import ProfileInfo from "@screens/Profile/ProfileInfo";
import ReportSchedule from "@screens/ReportSchedule";

import PaymentSubscription from "@screens/Payment/Subscription";
import Payment from "@screens/Payment";
import WebPayment from "@screens/Payment/WebPayment";
import PaymentFailed from "@screens/Payment/PaymentFailed";

import ThankYou from "@screens/ThankYou";

import RoomManagement from "@screens/Room/RoomManagement";
import RoomInfo from "@screens/Room/RoomInfo";
import AddRoom from "@screens/Room/AddRoom";

import Alert from "@screens/Alert";

import SubUser from "@screens/SubUser";
import AddSubUser from "@screens/SubUser/AddSubUser";
import SubUserInfo from "@screens/SubUser/SubUserInfo";
import AddSubUserWithCode from "@screens/SubUser/AddSubUserWithCode";

import Subscription from "@screens/Subscription";
import SubscriptionInfo from "@screens/Subscription/SubscriptionInfo";

let StackScreens = {};

StackScreens = {
    ...StackScreens,
    Login: {
        component: Login,
        title: "Login",
        option: {
            orientation: "portrait"
        }
    },
    Debug: {
        component: Debug,
        title: "Debug"
    },
    TabNavigation: {
        component: TabNavigation,
        title: "TabNavigation"
    },
    DeviceChart: {
        component: DeviceChart,
        title: "DeviceChart",
    },
    DeviceSPChart: {
        component: DeviceSPChart,
        title: "DeviceSPChart",
    },
    UsageInfo: {
        component: UsageInfo,
        title: "UsageInfo",
        option: {
            orientation: "portrait"
        }
    },
    WelcomeInfo: {
        component: WelcomeInfo,
        title: "WelcomeInfo",
        option: {
            orientation: "portrait"
        }
    },
    TuyaPanel: {
        component: TuyaPanel,
        title: "TuyaPanel",
        option: {
            orientation: "portrait"
        }
    },
    HomeManagement: {
        component: HomeManagement,
        title: "HomeManagement",
        option: {
            orientation: "portrait"
        }
    },
    HomeInfo: {
        component: HomeInfo,
        title: "HomeInfo",
        option: {
            orientation: "portrait"
        }
    },
    AddHome: {
        component: AddHome,
        title: "AddHome",
        option: {
            orientation: "portrait"
        }
    },
    RoomManagement: {
        component: RoomManagement,
        title: "RoomManagement",
        option: {
            orientation: "portrait"
        }
    },
    RoomInfo: {
        component: RoomInfo,
        title: "RoomInfo",
        option: {
            orientation: "portrait"
        }
    },
    AddRoom: {
        component: AddRoom,
        title: "AddRoom",
        option: {
            orientation: "portrait"
        }
    },
    DeviceScan: {
        component: DeviceScan,
        title: "DeviceScan",
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
    },
    DeviceInfo: {
        component: DeviceInfo,
        title: "DeviceInfo",
        option: {
            orientation: "portrait"
        }
    },
    DeviceAlert: {
        component: DeviceAlert,
        title: "DeviceAlert",
        option: {
            orientation: "portrait"
        }
    },
    DeviceTable: {
        component: DeviceTable,
        title: "DeviceTable",
        option: {
            orientation: "portrait"
        }
    },
    Alert: {
        component: Alert,
        title: "Alert",
        option: {
            orientation: "portrait"
        }
    },
    ProfileInfo: {
        component: ProfileInfo,
        title: "ProfileInfo",
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
    DeviceRulesInfo: {
        component: DeviceRulesInfo,
        title: "DeviceRulesInfo",
        option: {
            orientation: "portrait"
        }
    },
    AddDeviceRules: {
        component: AddDeviceRules,
        title: "AddDeviceRules",
        option: {
            orientation: "portrait"
        }
    },
    ReportSchedule: {
        component: ReportSchedule,
        title: "ReportSchedule",
        option: {
            orientation: "portrait"
        }
    },
    UpdateDeviceRules: {
        component: UpdateDeviceRules,
        title: "UpdateDeviceRules",
        option: {
            orientation: "portrait"
        }
    },
    AboutUs: {
        component: AboutUs,
        title: "AboutUs",
        option: {
            orientation: "portrait"
        }
    },
    DeviceLandingSmartPlug: {
        component: DeviceLandingSmartPlug,
        title: "DeviceLandingSmartPlug",
        option: {
            orientation: "portrait"
        }
    },
    DeviceLandingAirCon: {
        component: DeviceLandingAirCon,
        title: "DeviceLandingAirCon",
        option: {
            orientation: "portrait"
        }
    },
    SubUser: {
        component: SubUser,
        title: "SubUser",
        option: {
            orientation: "portrait"
        }
    },
    AddSubUser: {
        component: AddSubUser,
        title: "AddSubUser",
        option: {
            orientation: "portrait"
        }
    },
    AddSubUserWithCode: {
        component: AddSubUserWithCode,
        title: "AddSubUserWithCode",
        option: {
            orientation: "portrait"
        }
    },
    SubUserInfo: {
        component: SubUserInfo,
        title: "SubUserInfo",
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
    }
};

import LoginII from "@screens/Login/LoginII";


import PaymentSubscriptionAddOn from "@screens/Payment/Addon";
import PaymentSubscriptionDetail from "@screens/Payment/Addon/detail.js";

StackScreens = {
    ...StackScreens,
    LoginII: {
        component: LoginII,
        title: "LoginII",
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
    },
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

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { clsConst } from "@config";

import OneSignal from "react-native-onesignal";

// #region Initial
const init = {
    wifi: {
        ssid: null,
        password: null
    }
}
// #endregion

import { BcAppUpdateModal, BcServerMainModal } from "@components";
import { fetchGetAppVersion, fetchGetServerStatus, fetchSubUserAccess } from "@api";

import { useToggle } from "@hooks";

function Index(props) {

    // #region UseState
    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);
    const firstTimeLink = useSelector(Selectors.firstTimeLinkSelect);

    const [appFlag, setAppFlag, toggleAppFlag] = useToggle(false);
    const [serverFlag, setServerFlag, toggleServerFlag] = useToggle(false);
    // #endregion

    useEffect(() => {
        // Hide Splash Screen
        SplashScreen.hide();

        // Reset Wifi
        dispatch(Actions.onChangeWifi(init.wifi));

        // One Signal
        OneSignal.setAppId(clsConst.ONESIGNAL_APP_ID);

        OneSignal.promptForPushNotificationsWithUserResponse();

        //Method for handling notifications received while app in foreground
        OneSignal.setNotificationWillShowInForegroundHandler(event => {
            const notification = event.getNotification();

            const { additionalData = {} } = notification;

            // Check For Payment Success
            if ("Action" in additionalData && additionalData["Action"] == "Data_Controller") {

            }

            // Complete with null means don't show a notification.
            event.complete(notification);
        });

        //Method for handling notifications opened
        OneSignal.setNotificationOpenedHandler(event => {
            const { additionalData = {} } = event.notification;

            if ("Action" in additionalData && additionalData["Action"] == "Data_Alert") {

            }
        });

        getAppVersion();
        getServerStatus();
        RequestAccess(userId);
    }, []);

    // #region Helper
    const getAppVersion = () => {
        fetchGetAppVersion({
            param: {
                UserId: 10,
            },
            onSetLoading: () => {}
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
            onSetLoading: () => {}
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
            onSetLoading: () => {},
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
    // const defaultScreen = "Payment";

    return (
        <>
            <BcAppUpdateModal showModal={appFlag} />
            <BcServerMainModal showModal={serverFlag} />
            <BcStackNavigator
                StackScreens={StackScreens}
                defaultScreen={defaultScreen} />
        </>
    )
}

export default Index;