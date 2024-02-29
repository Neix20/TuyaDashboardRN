import React, { useEffect } from "react";

import { Text, BackHandler } from "react-native";
import { View, VStack } from "native-base";

import { BcTabNavigator } from "@components";

import FontAwesome from "react-native-vector-icons/FontAwesome";

function TabIconFontAwesome(props) {
    const { icon, title, color, focused, Btn } = props;

    const styles = {
        activeDot: {
            width: 5, height: 5, borderRadius: 5, backgroundColor: "rgba(40, 152, 255, 0.35)"
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
import Dashboard from "./index.js";
import Device from "./Device.js";

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
    }
};

function Index(props) {

    const defaultScreen = "Dashboard";

    return (
        <BcTabNavigator
            screens={TabScreens}
            defaultScreen={defaultScreen}
        />
    )
}

export default Index;