import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, BackHandler } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcYesNoModal, BcLoading, BcTooltip, BcSvgIcon, BcQrCamera, BcBoxShadow } from "@components";

import { useToggle } from "@hooks";

import { fetchGetParamApi } from "@api";
import { Linking } from "react-native";

// #region InfoTooltip

const url = {
    lazada: "https://www.lazada.com.my/shop/wrap2rap/?itemId=3181365586&spm=a2o4k.pdp_revamp.seller.1.6a4f756eqP4ZIJ&path=promotion-42621-0.htm&tab=promotion&channelSource=pdp",
    shopee: "https://shopee.com.my/wrap2rap?categoryId=100640&entryPoint=ShopByPDP&itemId=18616269176"
}

function InfoTooltip(props) {

    const { hook = [] } = props;
    const [open, setOpen, toggleOpen] = hook;

    const navigation = useNavigation();

    const style = {
        hyperlink: {
            textDecorationLine: "underline",
            fontFamily: "Roboto-Medium",
            color: "#3366CC"
        },
        txt: {
            fontFamily: "Roboto-Medium",
            fontSize: 14,
            color: "#484848"
        }
    }

    const GoToShopee = () => {
        Linking.openURL(url["shopee"])
    }

    const GoToLazada = () => {
        Linking.openURL(url["lazada"])
    }

    const Shopee = () => (
        <TouchableOpacity onPress={GoToShopee}>
            <Text style={style.hyperlink}>Shopee</Text>
        </TouchableOpacity>
    );

    const Lazada = () => (
        <TouchableOpacity onPress={GoToLazada}>
            <Text style={style.hyperlink}>Lazada</Text>
        </TouchableOpacity>
    );

    return (
        <VStack>
            <Text style={{ textAlign: "justify", ...style.txt }}>You can get our QR tokens by visiting our e-commercee Sites!</Text>
            <HStack alignItems={"flex-start"} space={1.5}>
                <Shopee />
                <Text>&</Text>
                <Lazada />
            </HStack>
        </VStack>
    )
}

function InfoIcon(props) {

    const openHook = useToggle(false);

    return (
        <BcTooltip hook={openHook}
            placement={"bottom"} bgColor={"#FFF"}
            modalBgColor={"rgba(0, 0, 0, 0.25)"}
            borderWidth={0}
            content={<InfoTooltip hook={openHook} />}>
            <BcSvgIcon name={"InfoIcon"} size={24} />
        </BcTooltip>
    )
}
// #endregion

// #region Components
function Header(props) {

    const { children = null, Right = null } = props;
    const navigation = useNavigation();

    const style = {
        main: {
            backgroundColor: "#FFF",
            height: 60
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#000",
        }
    }

    return (
        <BcBoxShadow>
            <View pb={2}
                alignItems={"center"}
                justifyContent={"flex-end"}
                style={style.main}>

                <HStack w={"90%"} alignItems={"center"} justifyContent={"space-between"}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <FontAwesome5 name={"arrow-left"} size={24} color={"#000"} />
                    </TouchableOpacity>
                    <Text style={style.title}>{children}</Text>
                    {Right}
                </HStack>
            </View>
        </BcBoxShadow >
    )
}
// #endregion

function Index(props) {

    const prevTitle = props.route?.params?.title || "";

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [exitModal, showExitModal, toggleExitModal] = useToggle(false);

    useEffect(() => {
        const backAction = () => {
            if (!isFocused) {
                return false;
            }

            toggleExitModal();
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [isFocused]);

    const GoBack = () => {
        if (prevTitle === "AuthTuya") {
            navigation.navigate("TabNavigation", {
                screen: "Device"
            });
            return;
        }

        navigation.goBack();
    }

    // #region Helper
    const readQrCode = (value) => {
        try {
            if (value.length > 0) {
                GetParamApi(value);
            }
        } catch (error) {

        }
    }

    const GetParamApi = (token) => {
        setLoading(true);
        fetchGetParamApi({
            param: {
                ParamKey: token
            },
            onSetLoading: setLoading
        })
            .then(data => {
                navigation.navigate("DeviceResult", data);
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
            })
    }
    // #endregion

    const headerTitle = (prevTitle === "AuthTuya") ? "Step 4: Scan Yatu Token QR" : "Scan Yatu Token QR";

    return (
        <>
            <BcYesNoModal showModal={exitModal} setShowModal={showExitModal}
                title={"Warning"}
                titleYes={"Yes"} titleNo={"Cancel"}
                onPressYes={GoBack} onPressNo={toggleExitModal}
                description={"Would you like to exit this page?"} />
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <Header Right={<InfoIcon />}>{headerTitle}</Header>

                    <View style={{ height: 10 }} />

                    {/* Body */}

                    <View flexGrow={1}>
                        <BcQrCamera onRead={readQrCode} />
                        <VStack space={2} p={3} alignItems={'center'}>
                            <Text style={{ textAlign: "center", fontWeight: "bold" }}>Please scan the QR code provided inside the box.</Text>
                            <VStack>

                                <Text style={{ textAlign: "center" }}>If you don't find any QR code, please contact us via</Text>
                                <Text style={{ textAlign: "center" }}>Shopee or Lazada.</Text>
                            </VStack>
                            <HStack space={3}>
                                <TouchableOpacity onPress={() => Linking.openURL(url["shopee"])}>
                                    <Image source={Images.Shopee} alt={"Shopee Logo"} style={{ width: 80, height: 40, borderRadius: 5 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Linking.openURL(url["lazada"])}>
                                    <Image source={Images.Lazada} alt={"Lazada Logo"} style={{ width: 80, height: 40, borderRadius: 5 }} />
                                </TouchableOpacity>
                            </HStack>
                        </VStack>
                    </View>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;