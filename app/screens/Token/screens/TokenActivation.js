import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeaderWithAdd, BcLoading, BcSvgIcon, BcDisableII, BcFooter, BcTooltip } from "@components";
import { useToggle } from "@hooks";
import { fetchRedeemToken } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Custom Hook
function useTokenCode() {
    const [query, setQuery] = useState("");
    const flag = query === "";
    return [query, setQuery, flag];
}
// #endregion

// #region Components
function Search(props) {

    const { queryHook = [] } = props;
    const [query, setQuery, queryFlag] = queryHook;

    const colors = {
        bg: "#EDEEEF",
        default: "#6A7683",
        txt: "#000"
    };

    const style = {
        txtInput: {
            fontSize: 14,
            fontFamily: "Roboto-Medium",
            paddingHorizontal: 16,
            color: colors.txt,
        },
        frontLayer: {
            position: "absolute",
            zIndex: 2,
            top: 0,
            bottom: 0,
            right: 16,
        }
    };

    const display = queryFlag ? "flex" : "none";

    return (
        <View width={"90%"} borderRadius={4}
            justifyContent={"center"}
            bgColor={colors.bg} style={{ height: 48 }}>
            <TextInput
                autoCapitalize={"characters"}
                placeholder={"Token Code 12 Digits"}
                placeholderTextColor={colors.default}
                defaultValue={query}
                onChangeText={setQuery}
                style={style.txtInput}
            />

            {/* Front Layer */}
            <View display={display}
                justifyContent={"center"} style={style.frontLayer}>
                <FontAwesome name={"ticket"} size={20} color={colors.default} />
            </View>
        </View>
    )
}

function RedeemTokenBtn(props) {
    const { flag = true, onPress = () => { } } = props;

    const style = {
        txt: {
            fontSize: 24,
            fontWeight: "bold",
            color: "white",
        }
    }

    const Elem = flag ? BcDisableII : TouchableOpacity;

    return (
        <Elem style={{ width: "80%", height: 60 }} onPress={onPress}>
            <View flex={1}
                backgroundColor={"#6c63ff"} borderRadius={12}
                alignItems={"center"} justifyContent={"center"}>
                <Text style={style.txt}>Redeem Token</Text>
            </View>
        </Elem>
    );
}

function TnC(props) {

    const arr = [
        "The token can only be utilized for the specified services as outlined in its details.",
        "The token is valid until the specified expiration date mentioned in the token details or as communicated by the issuer. Once redeemed, it cannot be refunded.",
        "Expired Tokens will not grant access to the subscribed services.",
        "The issuer reserves the right to refuse access or cancel the subscription if there is a reasonable belief of fraud, misuse, or violation of the terms and conditions.",
        "Any attempt to tamper with, alter, or duplicate the subscription may be considered fraudulent and could lead to legal action.",
    ];

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 24
        },
        description: {
            fontFamily: "Roboto-Medium",
            fontSize: 14,
            textAlign: 'justify'
        }
    }

    const renderItem = (item, index) => (
        <Text key={index} style={style.description}>{'\u2B24'} {item}</Text>
    )

    return (
        <View p={3} width={"90%"}
            borderColor={"#000"} borderWidth={2}>

            {/* Title */}
            <View alignItems={"center"}
                justifyContent={"center"}
                style={{ height: 40 }}>
                <Text style={style.title}>Terms & Conditions</Text>
            </View>

            {/* Terms & Conditions */}
            <VStack space={3}>
                {arr.map(renderItem)}
            </VStack>
        </View>
    )
}
// #endregion

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
            <Text style={{ textAlign: "justify", ...style.txt }}>You can get more tokens by visiting our e-commercee Sites!</Text>
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

function HeaderRightDiv(props) {

    const navigation = useNavigation();

    const GoToScanQr = () => {
        navigation.navigate("ScanQr");
    }

    return (
        <HStack alignItems={"flex-end"} space={2}>
            <InfoIcon />
            <TouchableOpacity onPress={GoToScanQr}>
                <View borderRadius={20} bgColor={Utility.getColor()}
                    alignItems={"center"} justifyContent={"center"}
                    style={{ height: 40, width: 40 }}>
                    <BcSvgIcon name={"QrScan"} size={24} color={"#FFF"} />
                </View>
            </TouchableOpacity>
        </HStack>
    )

}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading, toggleLoading] = useToggle(false);

    const tokenCodeHook = useTokenCode();
    const [tokenCode, setTokenCode, tokenCodeFlag] = tokenCodeHook;

    const userId = useSelector(Selectors.userIdSelect);

    const RedeemToken = () => {
        setLoading(true);
        fetchRedeemToken({
            param: {
                UserId: userId,
                Token: tokenCode
            },
            onSetLoading: setLoading
        })
            .then(data => {
                const { ResponseCode = "00", ResponseMessage = "" } = data;
                if (ResponseCode === "00") {
                    GoToTokenSuccess();
                } else {
                    toast.show({
                        description: ResponseMessage
                    })
                }
                setTokenCode("");
            })
            .catch(err => {
                setLoading(false);
                console.error(`Error: ${err}`)
            })
    }

    const GoToTokenSuccess = () => {
        navigation.navigate("TokenSuccess", {
            Token: tokenCode
        });
    }

    const GoToShopee = () => {
        Linking.openURL(url["shopee"])
    }

    const GoToLazada = () => {
        Linking.openURL(url["lazada"])
    }

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeaderWithAdd Right={<HeaderRightDiv />}>Redeem Tokens</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack
                            flexGrow={1} bgColor={"#FFF"}
                            pt={3} pb={5} space={5}>

                            {/* SVG Icon */}
                            <View alignItems={"center"}>
                                <HStack w={"90%"} space={2} alignItems={"flex-start"}>
                                    <BcSvgIcon name={"RedeemTokens"} width={280} height={200} />
                                    <VStack space={3}>
                                        <TouchableOpacity onPress={GoToShopee}>
                                            <Image source={{
                                                uri: "https://i.imgur.com/dsMnSNd.png"
                                            }}
                                                style={{ width: 60, height: 32 }}
                                                resizeMode={"contain"}
                                                alt={"Shopee"} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={GoToLazada}>
                                            <Image source={{
                                                uri: "https://i.imgur.com/zMRoDRJ.jpg"
                                            }}
                                                style={{ width: 60, height: 48 }}
                                                resizeMode={"contain"}
                                                alt={"Shopee"} />
                                        </TouchableOpacity>
                                    </VStack>
                                </HStack>
                            </View>

                            {/* Text Input */}
                            <View alignItems={"center"}>
                                <Search queryHook={tokenCodeHook} />
                            </View>

                            {/* Terms & Conditions */}
                            <View alignItems={"center"}>
                                <TnC />
                            </View>
                        </VStack>

                    </ScrollView>

                    {/* Redeem Button */}
                    <BcFooter>
                        <RedeemTokenBtn flag={tokenCodeFlag} onPress={RedeemToken} />
                    </BcFooter>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;