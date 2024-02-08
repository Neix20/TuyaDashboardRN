import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast, Divider } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";
import { Images, clsConst } from "@config";

import { Linking } from "react-native";

import { BcHeader, BcBoxShadow, BcSvgIcon, BcLoading } from "@components";
import { useToggle } from "@hooks";

import { BcVersion, BcFooter } from "./../components";
import { AboutUs as TestData } from "./../data";
import { fetchAboutUs } from "./../api";

// #region Components
function AboutBtn(props) {
    const { children = "", name = "", onPress = () => { } } = props;
    return (
        <VStack space={2} alignItems={"center"} flex={1}>
            <TouchableOpacity onPress={onPress} style={{ width: "100%" }}>
                <View alignItems={"center"} justifyContent={"center"}
                    bgColor={"rgba(40, 152, 255, 0.25)"}
                    style={{
                        height: 50,
                        borderRadius: 8,
                    }}>
                    <BcSvgIcon name={name} size={24} fill={"#2898FF"} />
                </View>
            </TouchableOpacity>
            <View>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 10,
                    color: "#2898FF",
                    textAlign: "center",
                }}>{children}</Text>
            </View>
        </VStack>
    )
}

function AboutUs(props) {
    const { data = [] } = props;

    if (data.length == 0) {
        return (<></>);
    }

    const renderItem = (term, ind) => (<Text key={ind} style={{ textAlign: "justify" }}>{term}</Text>);

    return (
        <VStack space={3}>
            {data.map(renderItem)}
        </VStack>
    )
}
// #endregion

// #region Custom Hooks
function useTextInfo(val) {
    const [txt, setTxt] = useState(val);
    const [data, setData] = useState({});

    useEffect(() => {
        const { version = "", info = "" } = data;
        if (info.length > 0) {
            let arr = info.split("\n");

            const obj = {
                version: version,
                info: arr
            };

            setTxt(_ => obj);

        }
    }, [data]);

    return [txt, setData];
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const lang = "en";

    const init = {
        data: {
            version: "",
            info: ""
        }
    };

    const [data, setData] = useTextInfo(init.data);
    const [loading, setLoading, toggleLoading] = useToggle(false);

    const { version = "", info = [], phone_no = "", business_phone_no = "", email = "" } = data;

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            // setData(TestData);
            GetData();
        }
    }, [isFocused]);
    // #endregion

    // #region Helper
    const contactVigTech = () => {
        Linking.openURL(`tel:${phone_no}`);
    }

    const whatsappVigTech = () => {
        Linking.openURL(`whatsapp://send?phone=+6${business_phone_no}`);
    }

    const emailVigTech = () => {
        Linking.openURL(`mailto:${email}`);
    }

    const GetData = () => {
        setLoading(true);
        fetchAboutUs({
            param: {
                UserId: 10
            },
            onSetLoading: setLoading
        })
            .then(data => {
                setData(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);

                setData(TestData);
            })
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>{Utility.translate("Contact Us", lang)}</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1} bgColor={"#FFF"} alignItems={"center"}>

                            {/* Version */}
                            <BcVersion {...data} />

                            {/* Logo */}
                            <View width={"90%"}>
                                <BcSvgIcon name={"Yatu"} color={"#2898FF"} width={100} height={50} />
                            </View>

                            {/* Content */}
                            <View width={"90%"}>
                                <VStack space={5}>
                                    <Text>
                                        Have questions or need assistance?
                                        Feel free to reach out to us anytime through the provided contact information.
                                        We're here to help!
                                    </Text>
                                    <VStack space={4} alignItems={'center'}>

                                        <FontAwesome5 name={"map-marker-alt"} size={24} color={"#2898FF"} />

                                        <Text style={{ textAlign: "center" }}>G2, Skyville, 8 @ Benteng, 439, Old Klang Rd, 58000 Kuala Lumpur, Federal Territory of Kuala Lumpur</Text>

                                        <Divider />
                                        <FontAwesome5 name={"clock"} size={24} color={"#2898FF"} />

                                        <VStack alignItems={'center'}>
                                            <Text>Monday - Friday</Text>
                                            <Text>9:00 a.m. - 6:00 p.m.</Text>
                                        </VStack>
                                        <Divider />
                                        <FontAwesome5 name={"address-book"} size={24} color={"#2898FF"} />

                                    </VStack>
                                </VStack>
                            </View>

                            <View style={{ height: 20 }} />

                            {/* Buttons */}
                            <VStack space={3}>
                                {/* <View width={"90%"}>
                                    <Text style={{
                                        fontFamily: "Roboto-Medium",
                                        fontWeight: "500",
                                    }}>{Utility.translate("Reach Us", lang)}</Text>
                                </View> */}

                                <HStack width={"90%"} space={3}
                                    alignItems={"flex-start"} justifyContent={"space-between"}>
                                    <AboutBtn name={"PhoneBook"} onPress={contactVigTech}>{clsConst.VIGTECH_PHONE_NUMBER}</AboutBtn>
                                    <AboutBtn name={"WhatsApp"} onPress={whatsappVigTech}>{clsConst.VIGTECH_BUSINESS_PHONE_NUMBER}</AboutBtn>
                                    <AboutBtn name={"Envelope"} onPress={emailVigTech}>{clsConst.VIGTECH_EMAIL}</AboutBtn>
                                </HStack>
                            </VStack>

                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View alignItems={"center"} bgColor={"#FFF"}>
                        <BcFooter lang={lang} />
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

export default Index;