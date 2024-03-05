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

import { fetchProfileInfo, fetchSubUserAccess, fetchDeleteAccount, fetchRestoreStorePurchase, fetchGetParamApi } from "@api";

import { BcLoading, BaseModal, BcYesNoModal } from "@components";

import { useToggle, useYatuIap } from "@hooks";
import { withIAPContext } from "react-native-iap";

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
    const { AccountType = 1 } = props;

    const AccountStatus = (val = 1) => {
        val = +val;

        let dict = {
            1: {
                color: "#000",
                term: "Free"
            },
            2: {
                color: Utility.getColor(),
                term: "Professional (Trial)"
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
                                fontSize: 18,
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

    const { Created_Date = "2023-07-01", DataAvailableDate = "2023-07-01", ExpiryDate = "2023-07-01" } = props;

    return (
        <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
            <PanelBtnII Btn={FontAwesome} icon={"user"} title={"Joined in " + Utility.formatDt(Created_Date, "yyyy-MM-dd")} />
            <PanelBtnII Btn={FontAwesome5} icon={"user-alt-slash"} title={"Expires In " + Utility.formatDt(ExpiryDate, "yyyy-MM-dd")} />
            <PanelBtnII Btn={FontAwesome5} icon={"database"} title={"Data available from " + Utility.formatDt(DataAvailableDate, "yyyy-MM-dd")} />
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

    const toast = useToast();
    const navigation = useNavigation();

    const GoToHomeManagement = () => navigation.navigate("HomeManagement");
    const GoToAlert = () => navigation.navigate("Alert");
    const GoToReportSchedule = () => navigation.navigate("ReportSchedule");

    const GoToSubUser = () => navigation.navigate("SubUser");
    const GoToAddSubUser = () => navigation.navigate("AddSubUserWithCode");

    const GoToSubscription = () => navigation.navigate("Subscription");
    const GoToUserToken = () => navigation.navigate("UserToken");
    const GoToProfileWorkspace = () => navigation.navigate("ProfileWorkspace");

    const workInProgress = () => {
        toast.show({
            description: "Work In-Progress!"
        })
    }

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { MS_Email = -1, MS_User = -1 } = subUserAccess;

    return (
        <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
            <PanelBtn onPress={GoToHomeManagement} Btn={FontAwesome} icon={"home"} title={"Home Management"} />
            {/* <PanelBtn onPress={GoToAlert} Btn={MaterialCommunityIcons} icon={"message-text-outline"} title={"Message Center"} />
            <PanelBtn onPress={GoToReportSchedule} Btn={FontAwesome5} icon={"clipboard-list"} title={"Email Alert"} /> */}
            {/* {
                (MS_Email == 1) ? (<PanelBtn onPress={GoToReportSchedule} Btn={FontAwesome5} icon={"clipboard-list"} title={"Email Alert"} />) : (<></>)
            } */}
            {/* {
                (MS_User == 1) ? (<PanelBtn onPress={GoToSubUser} Btn={FontAwesome5} icon={"users"} title={"Manage Members"} />) : (<></>)
            } */}
            {/* <PanelBtn Btn={SimpleLineIcons} icon={"question"} title={"FAQ & Feedback"} /> */}
            <PanelBtn onPress={GoToSubscription} Btn={FontAwesome5} icon={"shopping-cart"} title={"View Subscriptions"} />
            <PanelBtn onPress={GoToUserToken} Btn={FontAwesome5} icon={"shopping-cart"} title={"View Token Wallet"} />
            {/* <PanelBtn onPress={GoToProfileWorkspace} Btn={Ionicons} icon={"settings-sharp"} title={"View Profile Workspace"} /> */}
        </VStack>
    )
}

function CompanyInfoPanel(props) {
    const navigation = useNavigation();

    const GoToAboutUs = () => navigation.navigate("AboutUs");
    const GoToTnc = () => navigation.navigate("Tnc");
    const GoToPolicy = () => navigation.navigate("Policy");
    const GoToFaq = () => navigation.navigate("Faq");

    return (
        <VStack bgColor={"#FFF"} borderRadius={8} width={"90%"} alignItems={"center"}>
            <PanelBtn onPress={GoToAboutUs} Btn={FontAwesome5} icon={"info-circle"} title={"About Us"} />
            <PanelBtn onPress={GoToTnc} Btn={FontAwesome5} icon={"clipboard-list"} title={"Terms & Conditions"} />
            <PanelBtn onPress={GoToPolicy} Btn={FontAwesome5} icon={"unlock-alt"} title={"Privacy Policy"} />
            <PanelBtn onPress={GoToFaq} Btn={FontAwesome5} icon={"question-circle"} title={"FAQ"} />
        </VStack>
    )
}

function PaymentSubscriptionPanel(props) {

    const toast = useToast();
    const navigation = useNavigation();

    const GoToPayment = () => {
        navigation.navigate("PaymentProSubscription");
    };

    return (
        <VStack bgColor={"#FFF"} borderRadius={8}
            width={"90%"} alignItems={"center"}>
            <PanelBtn
                onPress={GoToPayment} title={"Get Value with Pro Subscription"}
                Btn={FontAwesome5} icon={"crown"}
                color={"#FFAA00"} showRight={false} />
        </VStack>
    )
}

function TokenSubscriptionPanel(props) {

    const toast = useToast();
    const navigation = useNavigation();

    const GoToRedeemToken = () => {
        navigation.navigate("TokenActivation");
    };

    return (
        <VStack bgColor={"#FFF"} borderRadius={8}
            width={"90%"} alignItems={"center"}>
            <PanelBtn
                onPress={GoToRedeemToken} title={"Redeem your Activation Tokens!"}
                Btn={FontAwesome} icon={"ticket"}
                color={"#FFAA00"} showRight={false} />
        </VStack>
    )
}

function RestorePurchasePanel(props) {

    const toast = useToast();

    const { onGetPurchaseHistory = () => { } } = props;

    const userId = useSelector(Selectors.userIdSelect);

    // #region Restore Purchase Helper
    const [showRpModal, setShowRpModal, toggleRpModal] = useToggle();

    const closeRpModal = () => setShowRpModal(false);

    const RestoreStorePurchase = (SubscriptionCode = "") => {
        setLoading(true);
        fetchRestoreStorePurchase({
            param: {
                UserId: userId,
                SubscriptionCode
            },
            onSetLoading: setLoading
        })
            .catch(err => {
                setLoading(false);
                console.error(`Error: ${err}`);
            })
    }

    const RestorePurchase = () => {
        const onEndTrue = () => {
            if (purchaseHistoryLs.length > 0) {

                const { productId = "" } = purchaseHistoryLs[0];

                // const sku = "com.subscription.mspp0100";
                const sku = productId.split(".").at(-1);
                RestoreStorePurchase(sku);

                toast.show({
                    description: "Successfully restored your subscription."
                })
            } else {
                toast.show({
                    description: "No subscription available to restore."
                })
            }
            closeRpModal();
        }

        const onEndFalse = () => {
            toast.show({
                description: "No subscription available to restore."
            })
            closeRpModal();
        }

        onGetPurchaseHistory({ onEndTrue, onEndFalse });
    };
    // #endregion

    return (
        <>
            <BcYesNoModal
                showModal={showRpModal} setShowModal={setShowRpModal}
                title={"Restore Purchase"}
                description={`This will restore all your deleted purchases from App Store & Google play store.\n\nWould you like to restore your purchases?`}
                titleYes={"Restore"} titleNo={"Cancel"}
                onPressYes={RestorePurchase} onPressNo={toggleRpModal}
            />
            <VStack bgColor={"#FFF"} borderRadius={8}
                width={"90%"} alignItems={"center"}>
                <PanelBtn onPress={toggleRpModal}
                    Btn={FontAwesome5} icon={"cart-arrow-down"}
                    title={"Restore Purchases"} showRight={false} />
            </VStack>
        </>
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
                titleYes={"Delete"} titleNo={"Logout"}
                onPressYes={DeleteAccount} onPressNo={Logout}
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

    const userId = useSelector(Selectors.userIdSelect);

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AccountType = -1 } = subUserAccess;

    // #region UseState
    const [profileInfo, setProfileInfo] = useState({});

    const loadingHook = useState(false);
    const [loading, setLoading] = loadingHook;

    const [t1, t2, t3, t4, t5, purchaseHistoryLs, getPurchaseHistory] = useYatuIap(setLoading);
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

        // Reset User Id
        dispatch(Actions.onChangeUserId(-1));

        // Reset Home Id
        dispatch(Actions.onChangeHomeId(-1));

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
                            <Profile {...profileInfo} onPress={GoToProfileInfo} />

                            {/* Join Information */}
                            <ProfileInfo {...profileInfo} />

                            <NavPanel {...profileInfo} />

                            {/* Make Payment */}
                            {(AccountType <= 2) ? <PaymentSubscriptionPanel /> : <></>}
                            {/* <TokenSubscriptionPanel /> */}

                            <CompanyInfoPanel />

                            <RestorePurchasePanel onGetPurchaseHistory={getPurchaseHistory} />

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
                            }}>v{clsConst.APP_VERSION}</Text>
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

export default withIAPContext(Index);