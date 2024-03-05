import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast, Divider } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";
import { Images, clsConst } from "@config";

import { BcHeader, BcBoxShadow, BcSvgIcon, BcLoading } from "@components";
import { useToggle } from "@hooks";

import { BcFooter, BcReachUs } from "./../components";

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const lang = "en";

    const [loading, setLoading, toggleLoading] = useToggle(false);

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

                            <View style={{ height: 20 }} />

                            {/* Logo */}
                            <View width={"90%"} style={{ alignItems: "center" }}>
                                <BcSvgIcon name={"Yatu"} color={Utility.getColor()} width={100} height={50} />
                            </View>

                            {/* Content */}
                            <View width={"90%"}>
                                <VStack space={5}>
                                    <Text style={{ textAlign: "justify", marginTop: 20 }}>
                                        Have questions or need assistance?
                                        Feel free to reach out to us anytime through the provided contact information.
                                        We're here to help!
                                    </Text>
                                    <VStack space={4} alignItems={'center'}>

                                        <FontAwesome5 name={"map-marker-alt"} size={24} color={Utility.getColor()} />

                                        <Text style={{ textAlign: "center" }}>G2, Skyville, 8 @ Benteng, 439, Old Klang Rd, 58000 Kuala Lumpur, Federal Territory of Kuala Lumpur</Text>

                                        <Divider />
                                        <FontAwesome5 name={"clock"} size={24} color={Utility.getColor()} />

                                        <VStack alignItems={'center'}>
                                            <Text>Monday - Friday</Text>
                                            <Text>9:00 a.m. - 6:00 p.m.</Text>
                                        </VStack>
                                        <Divider />
                                        <FontAwesome5 name={"address-book"} size={24} color={Utility.getColor()} />

                                    </VStack>
                                </VStack>
                            </View>

                            <View style={{ height: 20 }} />

                            {/* Buttons */}
                            <BcReachUs />

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