import React, { useState, useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { BcStackNavigator } from "@components";

// Screens
import Debug from "@screens/Debug";

import TabNavigation from "./TabNavigation";

import DeviceScan from "@screens/Device/DeviceScan";

import DeviceLanding from "@screens/Device/DeviceLanding";
import DeviceInfo from "@screens/Device/DeviceInfo";
import DeviceAlert from "@screens/Device/DeviceAlert";
import DeviceTable from "@screens/Device/DeviceTable";
import DeviceChart from "@screens/Device/DeviceChart";

import DeviceRulesInfo from "@screens/Device/DeviceRulesInfo";
import AddDeviceRules from "@screens/Device/AddDeviceRules";

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

import RoomManagement from "@screens/Room/RoomManagement";
import RoomInfo from "@screens/Room/RoomInfo";
import AddRoom from "@screens/Room/AddRoom";

import Alert from "@screens/Alert";

let StackScreens = {};

StackScreens = {
    ...StackScreens,
    Debug: {
        component: Debug,
        title: "Debug"
    },
    TabNavigation: {
        component: TabNavigation,
        title: "TabNavigation"
    },
    Login: {
        component: Login,
        title: "Login"
    },
    DeviceChart: {
        component: DeviceChart,
        title: "DeviceChart"
    },
    UsageInfo: {
        component: UsageInfo,
        title: "UsageInfo"
    },
    WelcomeInfo: {
        component: WelcomeInfo,
        title: "WelcomeInfo"
    },
    TuyaPanel: {
        component: TuyaPanel,
        title: "TuyaPanel"
    },
    HomeManagement: {
        component: HomeManagement,
        title: "HomeManagement"
    },
    HomeInfo: {
        component: HomeInfo,
        title: "HomeInfo"
    },
    AddHome: {
        component: AddHome,
        title: "AddHome"
    },
    RoomManagement: {
        component: RoomManagement,
        title: "RoomManagement"
    },
    RoomInfo: {
        component: RoomInfo,
        title: "RoomInfo"
    },
    AddRoom: {
        component: AddRoom,
        title: "AddRoom"
    },
    DeviceScan: {
        component: DeviceScan,
        title: "DeviceScan"
    },
    DeviceLanding: {
        component: DeviceLanding,
        title: "DeviceLanding"
    },
    DeviceInfo: {
        component: DeviceInfo,
        title: "DeviceInfo"
    },
    DeviceAlert: {
        component: DeviceAlert,
        title: "DeviceAlert"
    },
    DeviceTable: {
        component: DeviceTable,
        title: "DeviceTable"
    },
    Alert: {
        component: Alert,
        title: "Alert"
    },
    ProfileInfo: {
        component: ProfileInfo,
        title: "ProfileInfo"
    },
    AuthTuya: {
        component: AuthTuya,
        title: "AuthTuya"
    },
    DeviceRulesInfo: {
        component: DeviceRulesInfo,
        title: "DeviceRulesInfo"
    },
    AddDeviceRules: {
        component: AddDeviceRules,
        title: "AddDeviceRules"
    },
    ReportSchedule: {
        component: ReportSchedule,
        title: "ReportSchedule"
    }
};

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import OneSignal from "react-native-onesignal";
import { clsConst } from "@config";

// #region Initial
const init = {
    wifi: {
        ssid: null,
        password: null
    }
}
// #endregion

function Index(props) {

    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);

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
    }, []);

    // const defaultScreen = (userId == -1) ? "Login" : "TabNavigation";
    const defaultScreen = "TabNavigation";

    return (
        <BcStackNavigator
            StackScreens={StackScreens}
            defaultScreen={defaultScreen} />
    )
}

export default Index;