import React from "react";

import { TouchableOpacity, } from "react-native";
import { View, HStack } from "native-base";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { BcBoxShadow } from "@components";

const Tab = createBottomTabNavigator();

function MyTabBar(props) {
    const { state, descriptors, navigation } = props;
    const borderRadius = 30;

    // #region Render
    const renderTabItem = (route, ind) => {
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
    }
    // #endregion

    return (
        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
            <BcBoxShadow style={{ width: "100%" }}>
                <HStack bgColor={"#fff"}
                    justifyContent={"space-between"}
                    style={{ height: 60 }}>
                    {state.routes.map(renderTabItem)}
                </HStack>
            </BcBoxShadow>
        </View>
    );
}

function Index(props) {

    const { defaultScreen = "Home", TabScreens = {} } = props;

    const TabScreensArr = Object.values(TabScreens);

    // #region Render
    const renderScreen = ({ title, component, tabBarIcon }, ind) => (
        <Tab.Screen key={ind}
            name={title}
            component={component}
            options={{ title: title, tabBarIcon: tabBarIcon }}
        />
    )
    // #endregion

    return (
        <Tab.Navigator
            initialRouteName={defaultScreen}
            tabBar={MyTabBar}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2898FF",
                tabBarInactiveTintColor: "#98A0A8"
            }}
            tabBarOptions={{ showLabel: false }}
        >
            {TabScreensArr.map(renderScreen)}
        </Tab.Navigator>
    );
};

export default Index;