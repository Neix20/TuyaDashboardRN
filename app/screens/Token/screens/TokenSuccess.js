import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcBoxShadow, BcLoading, BcSvgIcon, BcDisableII, BcFooter } from "@components";
import { useToggle } from "@hooks";

import { fetchTokenInfo } from "@api";

// #region Components
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
            fontSize: 14
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

function DashboardBtn(props) {
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
                <Text style={style.txt}>Go Home</Text>
            </View>
        </Elem>
    );
}

function RedeemedToken(props) {

    const { Name =  "Yatu Pro Token", img } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 24,
            textAlign: "center"
        }
    }

    return (
        <VStack width={"80%"} space={3}
            alignItems={"center"}>
            <Text style={style.title}>You've successfully redeemed {Name}!</Text>
            <Image source={img} alt={Name} style={{ width: 100, height: 100 }} />
        </VStack>
    )
}

function Header(props) {
    const { children } = props;
    const { color = require("@utility").Utility.getColor(), txtColor = "#000", bgColor = "#FFF" } = props;

    const navigation = useNavigation();

    // #region Helper Functions
    const GoBack = () => {
        navigation.navigate("TabNavigation", {
            screen: "Profile",
        })
    }
    // #endregion

    return (
        <BcBoxShadow>
            <View
                style={{
                    height: 60,
                    backgroundColor: bgColor,
                }}>
                {/* Front Layer */}
                <TouchableOpacity
                    onPress={GoBack}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 120,
                        height: 120,
                        position: "absolute",
                        left: -30,
                        top: -19,
                        zIndex: 1,
                    }}>
                    <FontAwesome5 name={"chevron-left"} size={20} color={color} />
                </TouchableOpacity>

                <View style={{
                    position: "absolute",
                    height: 120,
                    left: 45,
                    top: -20,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: txtColor,
                    }}>{children}</Text>
                </View>
            </View>
        </BcBoxShadow>
    )
}
// #endregion

function useToken(props) {
    const [token, setToken] = useState({});

    const updateToken = (data = {}) => {
        const { Image = "https://i.imgur.com/Du4wGXQ.jpg" } = data;

        const next_state = {
            ...data,
            img: { uri: Image },
        }

        setToken(_ => next_state);
    }

    return [token, updateToken]
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading, toggleLoading] = useToggle(false);
    
    const { Token = "" } = props.route.params;
    // const Token = "";

    const [token, setToken] = useToken();

    useEffect(() => {
        if (isFocused) {
            TokenInfo();
        }
    }, [isFocused]);

    const GoDashboard = () => {
        navigation.navigate("TabNavigation", {
            screen: "Profile"
        })
    }

    const TokenInfo = () => {
        setLoading(true);
        fetchTokenInfo({
            param: {
                UserId: 10,
                Token
            },
            onSetLoading: setLoading
        })
        .then(data => {
            setToken(data)
        })
        .catch(err => {
            setLoading(false);
            console.error(`Error: ${err}`);
        })

    }

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <Header>Successful Redemption</Header>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack flexGrow={1} bgColor={"#FFF"}
                            pt={3} pb={5} space={5}
                            justifyContent={"space-between"}>

                            {/* SVG Icon */}
                            <View alignItems={"center"}>
                                <BcSvgIcon name={"RedeemSucess"} width={300} height={200} />
                            </View>

                            {/* Token For Selected Item */}
                            <View alignItems={"center"}>
                                <RedeemedToken {...token} />
                            </View>

                            {/* Terms & Conditions */}
                            <View alignItems={"center"}>
                                <TnC />
                            </View>
                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <BcFooter>
                        <DashboardBtn flag={false} onPress={GoDashboard} />
                    </BcFooter>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;