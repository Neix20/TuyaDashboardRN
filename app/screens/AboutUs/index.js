import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { Images, clsConst } from "@config";

import { BcHeader, BcBoxShadow, BcSvgIcon } from "@components";

import { Linking } from "react-native";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from "@redux";

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

function Footer(props) {
    const { lang } = props;
    return (
        <View width={"90%"}
            alignItems={"center"}
            justifyContent={"center"}
            style={{ height: 60 }}>
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 14,
                color: "#A6AFB8"
            }}>{Utility.translate("App Version", lang)}</Text>
            <Text style={{
                fontFamily: "Roboto-Medium",
                color: "#2898FF"
            }}>v{clsConst.APP_VERSION}</Text>
        </View>
    );
}
// #endregion

function useTextInfo(val) {
    const [txt, setTxt] = useState(val);
    const [data, setData] = useState("");

    useEffect(() => {
        if (data.length > 0) {
            let arr = data.split("\n");
            setTxt(arr);
        }
    }, [data]);

    return [txt, setData]
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const lang = "en";
    
    const resp = {
        version: "15/05/2023",
        info: `Consectetur dolore Lorem laborum proident dolore adipisicing velit ad nostrud fugiat. Magna aliquip qui proident cillum deserunt elit voluptate magna. Et esse ullamco nostrud duis ea consectetur culpa fugiat. Reprehenderit elit laboris sit do laborum enim ut fugiat aliquip anim amet eu. Aliquip et tempor adipisicing duis irure.
        Dolor mollit nulla sint consequat sint nostrud reprehenderit quis et aliqua amet officia esse eu. Et officia labore id deserunt laborum excepteur minim deserunt eiusmod minim laborum. Mollit non excepteur velit cupidatat irure commodo minim irure mollit labore. Commodo consequat adipisicing cillum consectetur adipisicing aute eu aute.
        Occaecat occaecat consectetur est veniam et sit aute occaecat nulla eu non. Consequat sint id commodo adipisicing ullamco laborum. Lorem incididunt laborum labore commodo deserunt magna exercitation exercitation quis veniam. Cupidatat deserunt ipsum fugiat amet esse nostrud. Reprehenderit veniam eiusmod veniam sunt amet consectetur enim consequat officia.
        Irure sint est irure do laborum nulla velit ullamco cillum elit. Id est ipsum sit velit voluptate nostrud aliqua sit mollit ex. Ipsum tempor laborum aliqua veniam excepteur ut do incididunt aliquip aliquip. Elit id ut est dolore id culpa occaecat anim aute exercitation sit irure. Non culpa laborum sunt adipisicing ad et reprehenderit id elit esse mollit in mollit laboris. Sit Lorem fugiat elit tempor quis tempor laboris qui exercitation nulla in magna fugiat et. Lorem aliquip esse cillum est do do irure veniam consequat aliquip nisi amet aliquip.
        Non dolor reprehenderit aliqua consequat aliquip velit voluptate occaecat. Commodo laborum deserunt est nostrud aliquip. Id id est fugiat irure est dolor Lorem enim. Qui et aliqua anim consequat. Ex labore anim quis nisi ullamco laborum enim aute tempor esse dolore. Do incididunt sunt sunt laboris quis ipsum ea amet.`
    }

    const [data, setData] = useTextInfo([]);

    useEffect(() => {
        if (isFocused) {
            setData(info);
        }
    }, [isFocused]);

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
                        <View width={"90%"} justifyContent={"center"} style={{ height: 40 }}>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontWeight: "500",
                                fontSize: 12,
                            }}>{Utility.translate("Version", lang)} 15/05/2023</Text>
                        </View>

                        {/* Logo */}
                        <View width={"90%"}>
                            <BcSvgIcon name={"Yatu"} width={100} height={50} />
                        </View>

                        {/* Content */}
                        <VStack space={3} width={"90%"}>
                            {
                                data.map((term, ind) => (<Text key={ind}>{term}</Text>))
                            }
                        </VStack>

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
                    <Footer lang={lang} />
                </View>


            </View>
        </SafeAreaView>

    )

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <BcHeader>{Utility.translate("About Us", lang)}</BcHeader>

                <View style={{ height: 10 }} />

                {/* Last Updated */}
                <View alignItems={"center"} bgColor={"#FFF"}>
                    <View width={"90%"} justifyContent={"center"} style={{ height: 40 }}>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontWeight: "500",
                            fontSize: 12,
                        }}>{Utility.translate("Version", lang)} 15/05/2023</Text>
                    </View>
                </View>

                {/* Logo */}
                <View alignItems={"center"} bgColor={"#FFF"}>
                    <View width={"90%"}>
                        <BcSvgIcon name={"Yatu"} width={100} height={50} />
                    </View>
                </View>

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} bgColor={"#FFF"} alignItems={"center"}>
                        {/* Content */}
                        <VStack space={3} width={"90%"}>
                            {
                                data.map((term, ind) => (<Text key={ind}>{term}</Text>))
                            }
                        </VStack>

                    </View>
                </ScrollView>

                <View bgColor={"#FFF"} style={{ height: 20 }} />

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

                {/* Footer */}
                <View alignItems={"center"} bgColor={"#FFF"}>
                    <Footer lang={lang} />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Index;