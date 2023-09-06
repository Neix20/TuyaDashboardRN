import React from "react";

import { SafeAreaView, StyleSheet, Image, Dimensions, TouchableOpacity, Text } from "react-native";
import { View, HStack } from "native-base";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { BcBoxShadow } from "@components";

const Tab = createBottomTabNavigator();

function MyTabBar(props) {
    const { state, descriptors, navigation } = props;
    const borderRadius = 30;
    return (
        <View
            style={{
                position: "absolute",
                bottom: 0,
                width: width,
            }}>

            <BcBoxShadow>
                <HStack
                    px={4}
                    justifyContent={"space-between"}
                    bgColor={"#fff"}
                    style={{
                        height: 60,
                        width: width,
                        // borderTopLeftRadius: borderRadius,
                        // borderTopRightRadius: borderRadius,
                    }}>
                    {state.routes.map((route, ind) => {
                        const { options: screen } = descriptors[route.key];

                        const { tabBarIcon, tabBarActiveTintColor, tabBarInactiveTintColor } = screen;

                        // #region Helper
                        const isFocused = state.index === ind;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                // The `merge: true` option makes sure that the params inside the tab screen are preserved
                                navigation.navigate({ name: route.name, merge: true });
                            }
                        };

                        const Btn = tabBarIcon;
                        const color = isFocused ? tabBarActiveTintColor : tabBarInactiveTintColor;
                        // #endregion

                        return (
                            <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
                                <Btn color={color} focused={isFocused} />
                            </TouchableOpacity>
                        )
                    })}
                </HStack>
            </BcBoxShadow>
        </View>
    );
}

const styles = StyleSheet.create({
    tabBarStyle: {
        position: 'absolute',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderTopWidth: 0,
        height: 70,
        backgroundColor: "transparent",
        shadowColor: "rgba(0, 0, 0, 0.5)",
        elevation: 1,
    }
})

const Index = (props) => {

    const { defaultScreen = "Home", TabScreens = {} } = props;

    const TabScreensArr = Object.values(TabScreens);

    return (
        <Tab.Navigator
            initialRouteName={defaultScreen}
            detachInactiveScreens={false}
            tabBar={MyTabBar}
            screenOptions={{
                headerShown: false,
                // tabBarStyle: styles.tabBarStyle,
                tabBarActiveTintColor: "#2898FF",
                tabBarInactiveTintColor: "#98A0A8"
            }}
            tabBarOptions={{ showLabel: false }}
        >
            {
                TabScreensArr.map((screen, ind) => {
                    const { title, component, tabBarIcon } = screen;
                    return (
                        <Tab.Screen
                            key={ind}
                            name={title}
                            component={component}
                            options={{
                                title: title,
                                tabBarIcon: tabBarIcon
                            }}
                        />
                    )
                })
            }
        </Tab.Navigator>
    );
};

export default Index;