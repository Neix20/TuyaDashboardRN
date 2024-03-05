import React, { useState, useEffect } from "react";
import { Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import { BcSvgIcon, BcBoxShadow } from "@components";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Utility } from "@utility";

const Drawer = createDrawerNavigator();

function MyDrawerContainerItem(props) {
    const { title = "" } = props;
    return (
        <HStack flex={1}
            alignItems={"center"} space={3}>
            <FontAwesome name={"chevron-right"} color={Utility.getColor()} size={18} />
            <Text>{title}</Text>
        </HStack>
    )
}


function MyDrawerContainer(props) {

    const { screens = {}, navigation } = props;

    const arr = Object.values(screens);

    const renderItem = ((obj, ind) => {
        const { title = "", component } = obj;
        const onSelect = () => navigation.navigate(title);
        return (
            <DrawerItem key={ind}
                onPress={onSelect}
                label={() => <MyDrawerContainerItem {...obj} />}
            />
        )
    });

    return (
        <DrawerContentScrollView>
            <View alignItems={"center"} pt={3}>
                <View width={"90%"}>
                    <BcSvgIcon name={"Yatu"} width={80} height={40} />
                </View>
            </View>

            {/* List of Screens */}
            {arr.map(renderItem)}
        </DrawerContentScrollView>
    );
};

function Index(props) {

    const { defaultScreen = "Home", screens = {} } = props;
    const arr = Object.values(screens);

    const renderItem = ({ title, component, option = {} }, ind) => (
        <Drawer.Screen key={ind}
            name={title}
            component={component}
            options={option}
        />
    )

    const renderContainer = (props) => (<MyDrawerContainer screens={screens} {...props} />);

    return (
        <Drawer.Navigator initialRouteName={defaultScreen}
            drawerContent={renderContainer}
            screenOptions={{
                swipeEdgeWidth: 0,
            }}>
            {arr.map(renderItem)}
        </Drawer.Navigator>
    );
}

export default Index;