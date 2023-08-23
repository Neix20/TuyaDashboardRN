import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, ImageBackground } from "react-native";
import { View, VStack, HStack, useToast, Divider } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { Images, GlobalStyles, GlobalColors } from "@config";

import { BaseModal } from "@components";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from "@redux";

function Index(props) {

    const navigation = useNavigation();

    // #region Redux
    const dispatch = useDispatch();
    const lang = useSelector(Selectors.langSelect);
    const { mobileNo, sessionId } = useSelector(Selectors.userSelect);
    // #endregion

    // #region Initial
    const init = {
        toast: {
            msg: "",
            flag: false
        }
    }
    // #endregion

    // #region Props
    const { showModal, setShowModal } = props;
    // #endregion

    // #region Toast
    const [cusToast, setCusToast] = useState(init.toast);

    const setToastFlag = (val) => {
        setCusToast({
            ...cusToast,
            flag: val
        });
    }

    const showToastMsg = (val) => {
        setCusToast({
            ...cusToast,
            msg: val,
            flag: true
        })
    }

    useEffect(() => {
        if (cusToast.flag) {
            setTimeout(() => {
                setToastFlag(false);
            }, 3 * 1000);
        }
    }, [cusToast.flag]);
    // #endregion

    // #region API List
    const fetchDeleteAccount = async () => {
        const action = "DeleteAccount";
        const url = Utility.genLoyaltyServerUrl(action);

        // Static Data
        let obj = Utility.requestObj({
            MobileNo: mobileNo,
            SessionId: sessionId,
        });

        const resp = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });

        const data = await resp.json();

        if (data["ResponseCode"] === "00") {
            Logout();
        }
        else {
            console.log(`LogoutModal - DeleteAccount - Request - ${JSON.stringify(obj)}`);
            console.log(`LogoutModal - DeleteAccount - Response - ${JSON.stringify(data)}`);
        }
    };
    // #endregion

    // #region Helper
    const closeModal = () => {
        setShowModal(false);
    }

    const DeleteAcc = () => {
        fetchDeleteAccount().catch(err => {
            console.log(`Error: ${err}`);
            showToastMsg("An Unexpected Error has occured!");
        })
    }

    const Logout = () => {
        dispatch(Actions.onChangeUser({
            name: "",
            mobileNo: "",
            userId: -1,
            sessionId: "",
        }));
        navigation.navigate("Onboarding");

        setShowModal(false);
    }
    // #endregion
    return (
        <BaseModal {...props} cusToast={cusToast}>
            {/* Content */}
            <VStack
                py={3}
                style={{width: width - 100}}
                alignItems={"center"} space={3}>
                <Text style={[GlobalStyles.txtTitle, { fontSize: 20 }]}>{Utility.translate("Confirm Log Out", lang)}</Text>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                    textAlign: "justify",
                    color: "#000",
                }}>{Utility.translate("Are you sure you want to log out? You will be returned to the login screen.", lang)}</Text>

                {/* Button Panel */}
                <HStack space={3}>
                    <TouchableOpacity onPress={DeleteAcc}>
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
                            }}>{Utility.translate("Delete", lang)}</Text>
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={Logout}>
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
                            }}>{Utility.translate("Logout", lang)}</Text>
                        </HStack>
                    </TouchableOpacity>
                </HStack>
            </VStack>
        </BaseModal>
    )
}

export default Index;