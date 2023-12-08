import React, { useState, useEffect } from "react";

import { BcDrawerNavigator } from "@components";

import Empty from "@screens/Empty";
import EmptyII from "@screens/Empty/EmptyII";

let DrawerScreens = {};

import AboutUs from "@screens/CompanyInfo/screens/AboutUs.js";
import Tnc from "@screens/CompanyInfo/screens/Tnc.js";
import Policy from "@screens/CompanyInfo/screens/Policy.js";
import Faq from "@screens/CompanyInfo/screens/Faq.js";

DrawerScreens = {
    ...DrawerScreens,
    AboutUs: {
        component: AboutUs,
        title: "AboutUs"
    },
    Tnc: {
        component: Tnc,
        title: "Tnc"
    },
    Policy: {
        component: Policy,
        title: "Policy"
    },
    Faq: {
        component: Faq,
        title: "Faq"
    }
}

function Index(props) {
    const defaultScreen = "Faq";
    return (
        <BcDrawerNavigator
            screens={DrawerScreens} 
            defaultScreen={defaultScreen} />
    );
}

export default Index;