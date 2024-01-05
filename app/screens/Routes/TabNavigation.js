import React, { useEffect } from "react";

import { Text, BackHandler } from "react-native";
import { View, VStack } from "native-base";

import { BcTabNavigator, BcSvgIcon, BcPremiumModal } from "@components";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useIsFocused, useNavigation } from "@react-navigation/native";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useToggle } from "@hooks";

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

import PayProSubModal from "@screens/PaymentModule/screens/ProSubscription/Modal";

function Index(props) {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    // #region Redux
    const linkTimer = useSelector(Selectors.linkTimerSelect);

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AccountType = -1 } = subUserAccess;

    const premiumPayFlag = useSelector(Selectors.premiumPayFlagSelect);
    // #endregion

    // #region UseState
    const [showPsModal, setShowPsModal, togglePsModal] = useToggle(false);
    const openPsModal = () => setShowPsModal(true);

    const [showPreModal, setShowPreModal, togglePreModal] = useToggle(false);
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
            if (premiumPayFlag) {
                togglePreModal();
            }
        }, 3000)
        return () => clearTimeout(timeout);
    }, []);
    // #endregion

    const defaultScreen = (linkTimer > 0) ? "Device" : "Dashboard";
    // const defaultScreen = "Profile";

    const closePreModal = () => {
        dispatch(Actions.onChangePremiumPayFlag(false));
        togglePreModal();
    }

    return (
        <>
            <BcPremiumModal showModal={premiumPayFlag && showPreModal} setShowModal={closePreModal} />
            <PayProSubModal showModal={showPsModal && AccountType == 2} setShowModal={setShowPsModal} />
            <BcTabNavigator
                screens={TabScreens}
                defaultScreen={defaultScreen}
            />
        </>
    )
}

export default Index;