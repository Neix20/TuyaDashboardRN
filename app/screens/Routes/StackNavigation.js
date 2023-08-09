import React, { useState, useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { BcStackNavigator } from "@components";

// Screens
import Debug from "@screens/Debug";

import TabNavigation from "./TabNavigation";

import DeviceDetail from "@screens/DeviceDetail";
import DeviceChart from "@screens/DeviceChart";

import Login from "@screens/Login";

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
    }
}

function Index(props) {
    useEffect(() => {
        // Hide Splash Screen
        SplashScreen.hide();
    }, []);

    const defaultScreen = "Login";

    return (
        <BcStackNavigator
            StackScreens={StackScreens}
            defaultScreen={defaultScreen} />
    )
}

export default Index;