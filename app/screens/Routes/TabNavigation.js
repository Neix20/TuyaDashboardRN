import React from "react";

import { Text } from "react-native";
import { View, VStack } from "native-base";

import { BcTabNavigator, BcSvgIcon } from "@components";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

function TabIconFontAwesome(props) {
    const { icon, title, color, focused } = props;

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
            <FontAwesome name={icon} color={color} size={20} />
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
import Dashboard from "@screens/Dashboard";
import Device from "@screens/Device";
import Alert from "@screens/Alert";
import Usage from "@screens/Usage";
import Profile from "@screens/Profile";

import Empty from "@screens/Empty";

let TabScreens = {};

TabScreens = {
    ...TabScreens,
    Dashboard: {
        component: Dashboard,
        title: "Dashboard",
        tabBarIcon: (props) => (
            <TabIconFontAwesome
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
                icon={"plug"}
                title={"Device"}
                {...props} />
        )
    },
    Alert: {
        component: Alert,
        title: "Alert",
        tabBarIcon: (props) => (
            <TabIconFontAwesome
                icon={"bell"}
                title={"Alert"}
                {...props} />
        )
    },
    // Usage: {
    //     component: Usage,
    //     title: "Usage",
    //     tabBarIcon: (props) => (
    //         <TabIconFontAwesome
    //             icon={"bolt"}
    //             title={"Usage"}
    //             {...props} />
    //     )
    // },
    Profile: {
        component: Profile,
        title: "Profile",
        tabBarIcon: (props) => (
            <TabIconFontAwesome
                icon={"user"}
                title={"Profile"}
                {...props} />
        )
    }
};

function Index(props) {

    const defaultScreen = "Dashboard";

    return (
        <BcTabNavigator
            TabScreens={TabScreens}
            defaultScreen={defaultScreen}
        />
    )
}

export default Index;