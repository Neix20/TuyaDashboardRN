import React, { useState, useEffect } from "react";
import { View, VStack, HStack, useToast } from "native-base";
import { Text, TouchableOpacity, TextInput, Image, SafeAreaView, ScrollView, FlatList } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { clsConst } from "@config";
import { Logger, Utility } from "@utility";

import { Actions, Selectors } from '@redux';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProfileInfo, fetchSubUserAccess, fetchDeleteAccount, fetchRestoreStorePurchase } from "@api";

import { BcLoading, BcYesNoModal, BcDisableII, BcSessionPanel } from "@components";

import { useToggle } from "@hooks";

// #region Components
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

    const color = Utility.getColor();

    return (
        <HStack alignItems={"center"} space={1.5}>
            <FontAwesome5 name={"crown"} color={color} size={18} />
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 18,
                color: color
            }}>Viewer</Text>
        </HStack>
    )
}

function Profile(props) {

    const { Email = "temp@gmail.com" } = props;

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AccountType = -1 } = subUserAccess;

    return (
        <View width={"90%"} alignItems={"center"} style={{ minHeight: 60 }}>
            <HStack width={"90%"} space={5} alignItems={'center'}>
                <FontAwesome name={"user-o"} color={"#000"} size={48} />
                <VStack width={"78%"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18
                    }}>{Email}</Text>

                    <ProfilePremium AccountType={AccountType} />
                </VStack>
            </HStack>
        </View>
    )
}

function ProfileInfo(props) {

    const { Created_Date = "2023-07-01", DataAvailableDate = "2023-07-01" } = props;

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { DeviceQty = 0, ExpiryDate = "2023-07-01" } = subUserAccess;

    return (
        <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
            <PanelBtnII Btn={FontAwesome} icon={"user"} title={"Joined in " + Utility.formatDt(Created_Date, "yyyy-MM-dd")} />
            <PanelBtnII Btn={FontAwesome5} icon={"tools"} title={`Yatu Device Count: ${DeviceQty}`} />
        </VStack>
    )
}

function PanelBtn(props) {

    const { Btn, icon } = props;
    const { showRight = true, disabled = false } = props;
    const { title = "", color = "#111111" } = props;
    const { onPress = () => { } } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: color
        }
    }

    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={{ width: "90%" }}>
            <HStack alignItems={"center"} justifyContent={"space-between"} style={{ height: 60 }}>
                {/* Icon & Title */}
                <HStack alignItems={"center"}>
                    <View alignItems={"flex-start"} style={{ width: 40 }}>
                        <Btn name={icon} color={color} size={24} />
                    </View>
                    <Text style={style.title}>{title}</Text>
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

function CompanyInfoPanel(props) {
    const navigation = useNavigation();

    const GoToAboutUs = () => navigation.navigate("AboutUs");
    const GoToYatu = () => navigation.navigate("Yatu");
    const GoToTnc = () => navigation.navigate("Tnc");
    const GoToPolicy = () => navigation.navigate("Policy");
    const GoToFaq = () => navigation.navigate("Faq");
    const GoContactUs = () => navigation.navigate("ContactUs");

    return (
        <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
            <PanelBtn onPress={GoToAboutUs} Btn={FontAwesome5} icon={"info-circle"} title={"About Us"} />
            <PanelBtn onPress={GoToYatu} Btn={FontAwesome5} icon={"tablet-alt"} title={"What is Yatu"} />
            <PanelBtn onPress={GoToTnc} Btn={FontAwesome5} icon={"clipboard-list"} title={"Terms & Conditions"} />
            <PanelBtn onPress={GoToPolicy} Btn={FontAwesome5} icon={"unlock-alt"} title={"Privacy Policy"} />
            <PanelBtn onPress={GoToFaq} Btn={FontAwesome5} icon={"question-circle"} title={"FAQ"} />
            <PanelBtn onPress={GoContactUs} Btn={FontAwesome5} icon={"phone-square-alt"} title={"Contact Us"} />
        </VStack>
    )
}

function LogoutPanel(props) {

    const { onLogout = () => { }, onDeleteAccount = () => { } } = props;

    // #region Logout Helper
    const [showLgModal, setShowLgModal, toggleLgModal] = useToggle(false);

    const closeLgModal = () => setShowLgModal(false);

    const DeleteAccount = () => {
        onDeleteAccount();
        closeLgModal();
    }

    const Logout = () => {
        onLogout();
        closeLgModal();
    }
    // #endregion

    return (
        <>
            <BcYesNoModal
                showModal={showLgModal} setShowModal={setShowLgModal}
                title={"Confirm Log Out"} description={"Are you sure you want to log out? You will be returned to the login screen."}
                titleYes={"Confirm"} titleNo={"Cancel"}
                onPressYes={Logout} onPressNo={closeLgModal}
            />
            <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
                <PanelBtn onPress={toggleLgModal} title={"Log Out"}
                    Btn={MaterialIcons} icon={"logout"}
                    color={Utility.getColor()} showRight={false} />
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

    const viewerSession = useSelector(Selectors.viewerSessionSelect);
    const { User_Id: userId, YatuSessionId: prwsId, SessionExpiryDate: expiryDt = 100, ViewerEmail: email = "temp@gmail.com" } = viewerSession;

    // #region UseState
    const [profileInfo, setProfileInfo] = useState({});

    const loadingHook = useState(false);
    const [loading, setLoading] = loadingHook;
    // #endregion

    useEffect(() => {
        if (isFocused) {
            GetProfileInfo();
            RequestAccess(userId);
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

        // Reset Viewer Session
        dispatch(Actions.onChangeViewerSession({}));

        navigation.navigate("LoginII");
    }
    // #endregion

    // #region API
    const RequestAccess = (userId) => {
        fetchSubUserAccess({
            param: {
                UserId: userId
            },
            onSetLoading: () => { },
        })
            .then(data => {
                dispatch(Actions.onChangeSubUserAccess(data));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
            })
    }

    const GetProfileInfo = () => {
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

    const DeleteAccount = () => {
        setLoading(true);
        fetchDeleteAccount({
            param: {
                UserId: userId
            },
            onSetLoading: setLoading
        })
            .then(data => {
                SignOut();
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            });
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
                        <VStack flexGrow={1} alignItems={"center"} space={4}>
                            {/* User */}
                            <Profile Email={email} onPress={GoToProfileInfo} />

                            {/* Join Information */}
                            <ProfileInfo {...profileInfo} />

                            <CompanyInfoPanel />

                            {/* Logout */}
                            <LogoutPanel onLogout={SignOut} onDeleteAccount={DeleteAccount} />
                        </VStack>

                        <View style={{ height: 10 }} />

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
                                color: Utility.getColor()
                            }}>{clsConst.VIEWER_APP_VERSION}</Text>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 16,
                                color: "#A6AFB8"
                            }}>Powered By {clsConst.ORG_NAME}</Text>
                        </VStack>

                        <View style={{ height: 10 }} />

                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;