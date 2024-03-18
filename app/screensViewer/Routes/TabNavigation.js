import React, { useEffect } from "react";

import { Text, BackHandler } from "react-native";
import { View, VStack } from "native-base";

import { BcTabNavigator, BcAdFullModal } from "@components";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Utility } from "@utility";

import { useToggle } from "@hooks";

function TabIconFontAwesome(props) {
    const { icon, title, color, focused, Btn } = props;

    const styles = {
        activeDot: {
            width: 5, height: 5, borderRadius: 5, backgroundColor: Utility.colorOpacity(color, 0.5)
        },
        inActiveDot: {
            width: 5, height: 5
        },
        textStyle: {
            color: color,
            fontSize: 10,
            fontFamily: "Roboto-Bold",
        }
    }

    return (
        <VStack flex={1} space={.5} alignItems={"center"} justifyContent={"center"}>
            <Btn name={icon} color={color} size={20} />
            <Text style={styles.textStyle}>{title}</Text>
            {
                (focused) ? (
                    <View style={styles.activeDot} />
                ) : (
                    <View style={styles.inActiveDot} />
                )
            }
        </VStack>
    )
}

// Screens
import Dashboard from "../Session/Dashboard.js";
import Device from "../Session/Device.js";
import Profile from "../Session/Profile.js";

let TabScreens = {};

TabScreens = {
    ...TabScreens,
    Dashboard: {
        component: Dashboard,
        title: "Dashboard",
        tabBarIcon: (props) => (
            <TabIconFontAwesome
                Btn={FontAwesome}
                icon={"area-chart"}
                title={"Dashboard"}
                {...props} />
        )
    },
    Device: {
        component: Device,
        title: "Device",
        tabBarIcon: (props) => (
            <TabIconFontAwesome
                Btn={FontAwesome}
                icon={"plug"}
                title={"Device"}
                {...props} />
        )
    },
    Profile: {
        component: Profile,
        title: "Profile",
        tabBarIcon: (props) => (
            <TabIconFontAwesome
                Btn={FontAwesome}
                icon={"user"}
                title={"Profile"}
                {...props} />
        )
    }
};

function Index(props) {

    const defaultScreen = "Dashboard";

    const [adModal, setAdModal, toggleAdModal] = useToggle(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            toggleAdModal();
        }, 3000)
        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            <BcAdFullModal showModal={adModal} setShowModal={setAdModal} ParamKey={"Yatu_Viewer_AdUrl"} />
            <BcTabNavigator
                screens={TabScreens}
                defaultScreen={defaultScreen}
            />
        </>
    )
}

export default Index;