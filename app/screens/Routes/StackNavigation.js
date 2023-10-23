import React, { useState, useEffect } from "react";
import SplashScreen from "react-native-splash-screen";
import { BcStackNavigator } from "@components";

// Screens
import Debug from "@screens/Debug";

import TabNavigation from "./TabNavigation";

import AboutUs from "@screens/AboutUs";

import DeviceScan from "@screens/Device/DeviceScan";

import DeviceLanding from "@screens/Device/DeviceLanding";
import DeviceInfo from "@screens/Device/DeviceInfo";
import DeviceAlert from "@screens/Device/DeviceAlert";
import DeviceTable from "@screens/Device/DeviceTable";
import DeviceChart from "@screens/Device/DeviceChart";

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

import RoomManagement from "@screens/Room/RoomManagement";
import RoomInfo from "@screens/Room/RoomInfo";
import AddRoom from "@screens/Room/AddRoom";

import Alert from "@screens/Alert";

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

import { BcAppUpdateModal, BcServerMainModal } from "@components";
import { fetchGetAppVersion, fetchGetServerStatus } from "@api";

import { useToggle } from "@hooks";

function Index(props) {

    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);
    const firstTimeLink = useSelector(Selectors.firstTimeLinkSelect);

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
    }, []);

    const [appFlag, setAppFlag, toggleAppFlag] = useToggle(false);
    const [serverFlag, setServerFlag, toggleServerFlag] = useToggle(false);

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

    // const defaultScreen = (userId == -1 || firstTimeLink) ? "Login" : "TabNavigation";
    const defaultScreen = "Debug";

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