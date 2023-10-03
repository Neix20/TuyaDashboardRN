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
    const { onLogout = () => {} } = props;

    const closeModal = () => setShowModal(false);

    return (

        <BaseModal {...props}>
            {/* Content */}
            <VStack
                py={3}
                width={"90%"}
                alignItems={"center"} space={3}>
                <Text style={{ fontFamily: "Roboto-Bold", fontSize: 20 }}>Confirm Log Out</Text>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                    textAlign: "justify",
                    color: "#000",
                }}>Are you sure you want to log out? You will be returned to the login screen.</Text>

                {/* Button Panel */}
                <HStack space={3}>
                    <TouchableOpacity onPress={onLogout}>
                        <HStack
                            bgColor={"#2898FF"}
                            borderRadius={8}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{
                                width: 120,
                                height: 40
                            }}
                        >
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
                            style={{
                                width: 120,
                                height: 40
                            }}
                        >
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

function Profile(props) {
    const { Email = "Nickname" } = props;
    return (
        <TouchableOpacity {...props} style={{ width: "90%" }}>
            <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                style={{ height: 60 }}>
                {/* Btn */}
                <HStack space={5}>
                    <FontAwesome name={"user-o"} color={"#000"} size={48} />
                    <View width={"70%"}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18
                        }}>{Email}</Text>
                    </View>
                </HStack>

                {/* Angle-Right */}
                <View>
                    <FontAwesome name={"angle-right"} color={"#000"} size={32} />
                </View>
            </HStack>
        </TouchableOpacity>
    )
}

function PanelBtn(props) {
    const { icon, title, Btn } = props;
    const { onPress = () => { } } = props;

    return (
        <TouchableOpacity onPress={onPress} style={{ width: "90%" }}>
            <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                style={{ height: 60 }}>
                {/* Icon & Title */}
                <HStack alignItems={"center"} space={3}>
                    <Btn name={icon} color={"#111111"} size={24} />
                    <View>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#111111"
                        }}>{title}</Text>
                    </View>
                </HStack>

                {/* FontAwesome */}
                <FontAwesome name={"angle-right"} color={"#000"} size={32} />

            </HStack>
        </TouchableOpacity>
    )
}

function NavPanel(props) {

    const navigation = useNavigation();

    const GoToHomeManagement = () => navigation.navigate("HomeManagement");
    const GoToAlert = () => navigation.navigate("Alert");
    const GoToReportSchedule = () => navigation.navigate("ReportSchedule");

    return (
        <VStack py={2}
            bgColor={"#FFF"}
            borderRadius={8}
            width={"90%"}
            alignItems={"center"}>

            <PanelBtn onPress={GoToHomeManagement} Btn={FontAwesome} icon={"home"} title={"Home Management"} />
            <PanelBtn onPress={GoToAlert} Btn={MaterialCommunityIcons} icon={"message-text-outline"} title={"Message Center"} />
            <PanelBtn onPress={GoToReportSchedule} Btn={FontAwesome5} icon={"clipboard-list"} title={"Report Schedule"} />
            {/* <PanelBtn Btn={SimpleLineIcons} icon={"question"} title={"FAQ & Feedback"} /> */}
        </VStack>
    )
}

function AppInfoPanel(props) {
    const navigation = useNavigation();

    const GoToAboutUs = () => navigation.navigate("AboutUs");
    return (
        <VStack bgColor={"#FFF"} borderRadius={8}
            width={"90%"} alignItems={"center"}>
            <PanelBtn onPress={GoToAboutUs} Btn={FontAwesome5} icon={"info-circle"} title={"About Us"} />
        </VStack>
    )
}

function LogoutPanel(props) {

    const [showLgModal, setShowLgModal, toggleLgModal] = useToggle(false);

    return (
        <>
            <LogoutModal showModal={showLgModal} setShowModal={setShowLgModal} {...props} />
            <View
                py={3}
                width={"90%"}
                alignItems={"center"}
                bgColor={"#FFF"}
                borderRadius={12}>
                <TouchableOpacity onPress={toggleLgModal}
                    style={{ width: "90%" }}>
                    <HStack alignItems={"center"} space={3}>
                        <MaterialIcons name={"logout"} color={"#2898FF"} size={24} />
                        <View>
                            <Text style={[{
                                fontSize: 18,
                                color: "#2898FF",
                                fontFamily: "Roboto-Medium",
                            }]}>Log Out</Text>
                        </View>
                    </HStack>
                </TouchableOpacity>
            </View>

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
    }, [userId]);

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
                        <VStack flexGrow={1}
                            alignItems={"center"}
                            space={5}>
                            {/* User */}
                            <View width={"90%"} alignItems={"center"}
                                style={{ height: 80 }}>
                                <Profile {...profileInfo} onPress={GoToProfileInfo} />
                            </View>

                            <NavPanel />

                            {/* <AppInfoPanel /> */}

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