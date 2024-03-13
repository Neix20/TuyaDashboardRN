import React, { useEffect } from "react";

import { Text, BackHandler } from "react-native";
import { View, VStack } from "native-base";

import { BcTabNavigator, BcSvgIcon, BcPremiumModal, BcAdFullModal } from "@components";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useIsFocused, useNavigation } from "@react-navigation/native";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useToggle } from "@hooks";
import { Utility } from "@utility";


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
import Dashboard from "@screensPro/Dashboard";
import Device from "@screensPro/Device";
import Profile from "@screensPro/Profile";
import ProfileWorkspace from "@screensPro/ProfileWorkspace";

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
    ProfileWorkspace: {
        component: ProfileWorkspace,
        title: "ProfileWorkspace",
        tabBarIcon: (props) => (
            <TabIconFontAwesome
                Btn={Ionicons}
                icon={"settings-sharp"}
                title={"Profile Selection"}
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

import PayProSubModal from "@screens/PaymentModule/screens/ProSubscription/Modal";

function Index(props) {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    // #region Redux
    const linkTimer = useSelector(Selectors.linkTimerSelect);

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AccountType = -1 } = subUserAccess;

    const adFlag = useSelector(Selectors.advertisementSelect);
    // #endregion

    // #region UseState
    const [showPsModal, setShowPsModal, togglePsModal] = useToggle(false);
    const openPsModal = () => setShowPsModal(true);

    const [adModal, setAdModal, toggleAdModal] = useToggle(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        // Disable Back Button
        const backAction = () => {
            if (!isFocused) {
                return false;
            }

            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [isFocused]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (navigation.isFocused()) {
                openPsModal();
            }
        }, 3000)
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (adFlag) {
                toggleAdModal();
            }
        }, 3000)
        return () => clearTimeout(timeout);
    }, []);
    // #endregion

    const defaultScreen = (linkTimer > 0) ? "Device" : "Dashboard";
    // const defaultScreen = "Profile";

    const closeAdModal = () => {
        dispatch(Actions.onChangeAdvertisement(false));
        setAdModal(_ => false);
    }

    return (
        <>
            <BcAdFullModal showModal={adFlag && adModal && !(showPsModal && AccountType == 2)} setShowModal={closeAdModal} />
            <PayProSubModal showModal={showPsModal && AccountType == 2} setShowModal={setShowPsModal} />
            <BcTabNavigator
                screens={TabScreens}
                defaultScreen={defaultScreen}
            />
        </>
    )
}

export default Index;