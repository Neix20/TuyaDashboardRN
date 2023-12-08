import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";
import { Images, clsConst } from "@config";

import { Linking } from "react-native";

import { BcHeader, BcBoxShadow, BcSvgIcon } from "@components";

import { BcVersion, BcFooter } from "./../components";
import { AboutUs as TestData } from "./../data";

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
                    <BcSvgIcon name={name} width={24} height={24} fill={"#2898FF"} />
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
    const { version = "", info = [] } = data;

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            setData(TestData);
        }
    }, [isFocused]);
    // #endregion

    // #region Helper
    const contactVigTech = () => {
        Linking.openURL(`tel:${clsConst.VIGTECH_PHONE_NUMBER}`);
    }

    const whatsappVigTech = () => {
        Linking.openURL(`whatsapp://send?phone=+6${clsConst.VIGTECH_BUSINESS_PHONE_NUMBER}`);
    }

    const emailVigTech = () => {
        Linking.openURL(`mailto:${clsConst.VIGTECH_EMAIL}`);
    }
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <BcHeader>{Utility.translate("About Us", lang)}</BcHeader>

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
                            <AboutUs data={info} />
                        </View>

                        <View style={{ height: 20 }} />

                        {/* Buttons */}
                        <VStack space={3}>
                            <View width={"90%"}>
                                <Text style={{
                                    fontFamily: "Roboto-Medium",
                                    fontWeight: "500",
                                }}>{Utility.translate("Reach Us", lang)}</Text>
                            </View>

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
    )
}

export default Index;