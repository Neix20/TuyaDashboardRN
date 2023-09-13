import React, { useState, useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { BcStackNavigator } from "@components";

// Screens
import Debug from "@screens/Debug";

import TabNavigation from "./TabNavigation";

import DeviceDetail from "@screens/DeviceDetail";

import DeviceChart from "@screens/DeviceChart";
import DeviceScan from "@screens/Device/DeviceScan";

import DeviceLanding from "@screens/Device/DeviceLanding";
import DeviceInfo from "@screens/Device/DeviceInfo";
import DeviceAlert from "@screens/Device/DeviceAlert";

import HomeManagement from "@screens/Home/HomeManagement";
import HomeInfo from "@screens/Home/HomeInfo";
import AddHome from "@screens/Home/AddHome";

import Login from "@screens/Login";

import UsageInfo from "@screens/UsageInfo";

import WelcomeInfo from "@screens/WelcomeInfo";

import TuyaPanel from "@screens/TuyaPanel";

import ProfileBackup from "@screens/Profile/Backup";
import ProfileInfo from "@screens/Profile/ProfileInfo";

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
    DeviceDetail: {
        component: DeviceDetail,
        title: "DeviceDetail"
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
    ProfileBackup: {
        component: ProfileBackup,
        title: "ProfileBackup"
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
    Alert: {
        component: Alert,
        title: "Alert"
    },
    ProfileInfo: {
        component: ProfileInfo,
        title: "ProfileInfo"
    }
};

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function Index(props) {

    const dispatch = useDispatch();

    const init = {
        wifi: {
            ssid: null,
            password: null
        }
    }

    useEffect(() => {
        // Hide Splash Screen
        SplashScreen.hide();

        // Reset Wifi
        dispatch(Actions.onChangeWifi(init.wifi));
    }, []);

    const defaultScreen = "TabNavigation";
    // const defaultScreen = "TuyaPanel";

    return (
        <BcStackNavigator
            StackScreens={StackScreens}
            defaultScreen={defaultScreen} />
    )
}

export default Index;