import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { clsConst } from "@config";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { fetchProfileInfo } from "@api";

import { BcLoading, BaseModal } from "@components";

import { useToggle } from "@hooks";

// #region Components
function LogoutModal(props) {

    const { showModal, setShowModal } = props;
    const { onLogout = () => { } } = props;

    const closeModal = () => setShowModal(false);

    const signOut = () => {
        onLogout();
        closeModal();
    }

    return (
        <BaseModal {...props}>
            {/* Content */}
            <VStack
                py={3} space={3}
                width={"90%"} alignItems={"center"}>
                <Text style={{ fontFamily: "Roboto-Bold", fontSize: 20 }}>Confirm Log Out</Text>

                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                    textAlign: "justify",
                    color: "#000",
                }}>Are you sure you want to log out? You will be returned to the login screen.</Text>

                {/* Button Panel */}
                <HStack space={3}>
                    <TouchableOpacity onPress={signOut}>
                        <HStack
                            bgColor={"#2898FF"}
                            borderRadius={8}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{ width: 120, height: 40 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                textAlign: "center",
                                color: "#fff",
                            }}>Yes</Text>
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeModal}>
                        <HStack
                            borderRadius={8}
                            bgColor={"#E6E6E6"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{ width: 120, height: 40 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                textAlign: "center",
                                color: "#6A7683",
                            }}>No</Text>
                        </HStack>
                    </TouchableOpacity>
                </HStack>
            </VStack>
        </BaseModal>
    )
}

function Header(props) {
    const { onSelectSetting = () => { } } = props;
    return (
        <View alignItems={"center"}>
            <HStack width={"90%"}
                alignItems={"center"}
                justifyContent={"flex-end"}
                style={{ height: 60 }}>
                {/* Btn */}
                {/* <HStack alignItems={"center"} space={3}>
                    <TouchableOpacity onPress={onSelectSetting}>
                        <FontAwesome name={"gear"} color={"#000"} size={30} />
                    </TouchableOpacity>
                </HStack> */}
            </HStack>
        </View>
    )
}

function ProfilePremium(props) {
    const { AccountType = 1 } = props;

    const AccountStatus = (val = 1) => {
        val = +val;

        let dict = {
            1: {
                color: "#000",
                term: "Free"
            },
            2: {
                color: "#2898FF",
                term: "Standard"
            },
            3: {
                color: "#FFAA00",
                term: "Premium"
            }
        }

        if (val in dict) {
            return dict[val];
        }

        return {
            color: "#000",
            term: "Free"
        };
    }

    const { color, term } = AccountStatus(AccountType);

    return (
        <HStack alignItems={"center"} space={1.5}>
            <FontAwesome5 name={"crown"} color={color} size={18} />
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 18,
                color: color
            }}>{term}</Text>
        </HStack>
    )
}

function Profile(props) {

    const { Email = "temp@gmail.com" } = props;

    const { Created_Date = "2023-07-01", DataAvailableDate = "2023-07-01" } = props;

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AccountType = -1 } = subUserAccess;

    return (
        <View width={"90%"} alignItems={"center"} style={{ minHeight: 60 }}>
            <TouchableOpacity {...props} style={{ width: "90%" }}>
                <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}>
                    {/* Btn */}
                    <HStack space={5}>
                        <FontAwesome name={"user-o"} color={"#000"} size={48} />
                        <VStack width={"70%"}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18
                            }}>{Email}</Text>

                            <ProfilePremium AccountType={AccountType} />
                        </VStack>
                    </HStack>

                    {/* Angle-Right */}
                    <FontAwesome name={"angle-right"} color={"#000"} size={32} />
                </HStack>
            </TouchableOpacity>
        </View>
    )
}

function ProfileInfo(props) {

    const { Created_Date = "2023-07-01", DataAvailableDate = "2023-07-01" } = props;

    return (
        <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
            <PanelBtnII
                Btn={FontAwesome} icon={"user"} title={"Joined in " + Utility.formatDt(Created_Date, "yyyy-MM-dd")} />
            <PanelBtnII
                Btn={FontAwesome5} icon={"database"} title={"Data available from " + Utility.formatDt(DataAvailableDate, "yyyy-MM-dd")} />
        </VStack>
    )
}

function PanelBtn(props) {
    const { Btn, icon } = props;
    const { showRight = true, disabled = false } = props;
    const { title = "", color = "#111111" } = props;
    const { onPress = () => { } } = props;

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={{ width: "90%" }}>
            <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                style={{ height: 60 }}>
                {/* Icon & Title */}
                <HStack alignItems={"center"}>
                    <View alignItems={"flex-start"} style={{ width: 40 }}>
                        <Btn name={icon} color={color} size={24} />
                    </View>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: color
                    }}>{title}</Text>
                </HStack>

                {/* FontAwesome */}
                {
                    (showRight) ? (
                        <FontAwesome name={"angle-right"} color={color} size={32} />
                    ) : (
                        <></>
                    )
                }

            </HStack>
        </TouchableOpacity>
    )
}

function PanelBtnII(props) {
    const { Btn, icon } = props;
    const { title = "", color = "#111111" } = props;

    return (
        <HStack
            width={"90%"}
            alignItems={"center"}
            style={{ height: 40 }}>
            <View alignItems={"flex-start"} style={{ width: 40 }}>
                <Btn name={icon} color={color} size={24} />
            </View>
            <Text style={{
                fontFamily: "Roboto-Medium",
                fontSize: 16,
                color: color
            }}>{title}</Text>
        </HStack>
    )
}

function NavPanel(props) {

    const navigation = useNavigation();

    const GoToHomeManagement = () => navigation.navigate("HomeManagement");
    const GoToAlert = () => navigation.navigate("Alert");
    const GoToReportSchedule = () => navigation.navigate("ReportSchedule");

    const GoToSubUser = () => navigation.navigate("SubUser");
    const GoToAddSubUser = () => navigation.navigate("AddSubUserWithCode");

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { ManageUserList = -1 } = subUserAccess;

    return (
        <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
            <PanelBtn onPress={GoToHomeManagement} Btn={FontAwesome} icon={"home"} title={"Home Management"} />
            {/* <PanelBtn onPress={GoToAlert} Btn={MaterialCommunityIcons} icon={"message-text-outline"} title={"Message Center"} />
            <PanelBtn onPress={GoToReportSchedule} Btn={FontAwesome5} icon={"clipboard-list"} title={"Email Alert"} /> */}
            {
                (ManageUserList == 1) ? (<PanelBtn onPress={GoToSubUser} Btn={FontAwesome5} icon={"users"} title={"Manage Members"} />) : (<PanelBtn onPress={GoToAddSubUser} Btn={FontAwesome5} icon={"house-user"} title={"Join a Home"} />)
            }
            {/* <PanelBtn Btn={SimpleLineIcons} icon={"question"} title={"FAQ & Feedback"} /> */}
        </VStack>
    )
}

function AppInfoPanel(props) {
    const navigation = useNavigation();
    const GoToAboutUs = () => navigation.navigate("AboutUs");

    return (
        <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
            <PanelBtn onPress={GoToAboutUs} Btn={FontAwesome5} icon={"info-circle"} title={"About Us"} />
        </VStack>
    )
}

function PaymentSubscriptionPanel(props) {

    const navigation = useNavigation();
    const toast = useToast();
    const GoToPayment = () => {
        navigation.navigate("PaymentSubscription");
        // toast.show({
        //     description: "Work In-Progress!"
        // });
    };

    return (
        <VStack bgColor={"#FFF"} borderRadius={8}
            width={"90%"} alignItems={"center"}>
            <PanelBtn
                onPress={GoToPayment} title={"Subscribe to Pro Edition"}
                Btn={FontAwesome5} icon={"crown"}
                color={"#FFAA00"} showRight={false} />
        </VStack>
    )
}

function LogoutPanel(props) {
    const [showLgModal, setShowLgModal, toggleLgModal] = useToggle(false);
    return (
        <>
            <LogoutModal showModal={showLgModal} setShowModal={setShowLgModal} {...props} />
            <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
                <PanelBtn onPress={toggleLgModal} title={"Log Out"}
                    Btn={MaterialIcons} icon={"logout"}
                    color={"#2898FF"} showRight={false} />
            </VStack>
        </>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);

    // #region UseState
    const [profileInfo, setProfileInfo] = useState({});
    const [loading, setLoading] = useState(false);
    // #endregion

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchProfileInfo({
                param: {
                    UserId: userId
                },
                onSetLoading: setLoading
            })
                .then(data => {
                    setProfileInfo(data);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [isFocused, userId]);

    // #region Navigation
    const GoToProfileInfo = () => {
        navigation.navigate("ProfileInfo");
    }

    const GoToTuyaPanel = () => {
        navigation.navigate("TuyaPanel");
    }

    const SignOut = () => {

        // Reset User Id
        dispatch(Actions.onChangeUserId(-1));

        // Reset Home Id
        dispatch(Actions.onChangeHomeId(-1));

        navigation.navigate("Login");
    }
    // #endregion

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AccountType = -1 } = subUserAccess;
    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#F6F7FA"} style={{ flex: 1 }}>

                    {/* Header */}
                    <Header onSelectSetting={GoToTuyaPanel} />

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack flexGrow={1} alignItems={"center"} space={4}>
                            {/* User */}
                            <Profile {...profileInfo} onPress={GoToProfileInfo} />

                            {/* Join Information */}
                            <ProfileInfo {...profileInfo} />

                            <NavPanel {...profileInfo} />

                            {/* <AppInfoPanel /> */}

                            {/* {(AccountType <= 1) ? <PaymentSubscriptionPanel /> : <></>} */}
                            <PaymentSubscriptionPanel />

                            {/* Logout */}
                            <LogoutPanel onLogout={SignOut} />
                        </VStack>

                        <VStack space={2}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{ height: 80 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18,
                                color: "#A6AFB8"
                            }}>App Version</Text>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 16,
                                color: "#2898FF"
                            }}>v{clsConst.APP_VERSION}</Text>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 16,
                                color: "#A6AFB8"
                            }}>Powered By {clsConst.ORG_NAME}</Text>
                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 70 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;