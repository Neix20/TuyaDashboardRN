import React, { useState, useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { BcStackNavigator } from "@components";

// Screens
import Debug from "@screens/Debug";

import TabNavigation from "./TabNavigation";

import DeviceDetail from "@screens/DeviceDetail";
import DeviceChart from "@screens/DeviceChart";

import Login from "@screens/Login";

import UsageInfo from "@screens/UsageInfo";

import WelcomeInfo from "@screens/WelcomeInfo";

import TuyaPanel from "@screens/TuyaPanel";

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
    }
}

function Index(props) {
    useEffect(() => {
        // Hide Splash Screen
        SplashScreen.hide();
    }, []);

    const defaultScreen = "Debug";
    // const defaultScreen = "TuyaPanel";

    return (
        <BcStackNavigator
            StackScreens={StackScreens}
            defaultScreen={defaultScreen} />
    )
}

export default Index;