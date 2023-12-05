import React, { useState, useEffect } from "react";

import { BcDrawerNavigator } from "@components";

import Empty from "@screens/Empty";
import EmptyII from "@screens/Empty/EmptyII";

import Dashboard from "@screens/Dashboard";
import Device from "@screens/Device";
import Profile from "@screens/Profile";

let DrawerScreens = {};

DrawerScreens = {
    ...DrawerScreens,
    Empty: {
        component: Empty,
        title: "Empty"
    },
    EmptyII: {
        component: EmptyII,
        title: "EmptyII",
    },
    Dashboard: {
        component: Dashboard,
        title: "Dashboard"
    },
    Device: {
        component: Device,
        title: "Device"
    },
    Profile: {
        component: Profile,
        title: "Profile"
    }
};

function Index(props) {
    const defaultScreen = "Empty";
    return (
        <BcDrawerNavigator
            screens={DrawerScreens} 
            defaultScreen={defaultScreen} />
    );
}

export default Index;