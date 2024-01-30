import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

// import QRCodeScanner from 'react-native-qrcode-scanner';

import { BcHeaderWithAdd, BcYesNoModal, BcLoading, BcTooltip, BcSvgIcon, BcQrCamera } from "@components";

import { useToggle } from "@hooks";

import { fetchGetParamApi } from "@api";

// #region InfoTooltip
import { Linking } from "react-native";

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

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading, toggleLoading] = useToggle(false);

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

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeaderWithAdd Right={<InfoIcon />}>Scan QR</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    {/* Body */}

                    <View flexGrow={1}>
                    <BcQrCamera onRead={readQrCode} />
                    </View>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;