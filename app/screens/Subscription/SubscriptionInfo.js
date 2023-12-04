import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { fetchSubscription } from "@api";

import { BcHeader, BcLoading, BcBoxShadow } from "@components";
import { useToggle } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Custom Hooks
function useSubInfo() {
    const [sub, setSub] = useState({});
    const [data, setData] = useState({});

    useEffect(() => {
        const { Image = "" } = data;

        const next_state = {
            ...data,
            img: { uri: Image }
        };

        setSub(_ => next_state);
    }, [data]);

    return [sub, setData];
}
// #endregion

// #region Components
function SubItem(props) {
    const { data = {} } = props;
    const { Name, Description, img, flag = true } = data

    const borderRadius = 8;

    return (
        <BcBoxShadow style={{ borderRadius, width: "100%" }}>
            <HStack bgColor={"#FFF"}
                borderRadius={borderRadius}
                alignItems={"center"}>
                <Image
                    source={img}
                    style={{
                        height: 100,
                        width: 100,
                        borderTopLeftRadius: borderRadius,
                        borderBottomLeftRadius: borderRadius,
                    }}
                    alt={Name}
                />
                <VStack px={3} flex={1}
                    space={2} style={{ height: 80 }}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 16,
                    }}>{Name}</Text>
                    <Text>{Description}</Text>
                </VStack>
            </HStack>
        </BcBoxShadow>
    )
}

function SubPanel(props) {
    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"} alignItems={"center"} py={3}>
                <View width={"90%"}>
                <SubItem {...props} />
                </View>
            </View>
        </BcBoxShadow>
    )
}

function InfoItem(props) {
    const { Title, Value } = props;
    return (
        <HStack width={"90%"} alignItems={"center"}>
            <View flex={.4}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18
                }}>{Title}: </Text>
            </View>
            <View flex={.6} alignItems={"flex-end"}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18,
                    color: "#000",
                }}>{Value}</Text>
            </View>
        </HStack>
    )
}

function InfoPanel(props) {

    const { data = {} } = props;
    const { SubscriptionCode = "", InitialDate, ExpiryDate, AutoRenew = 0 } = data;

    const autoRenewal = (AutoRenew == 0) ? "False" : "True"

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"} alignItems={"center"} pt={3}>
                <View width={"90%"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#000"
                    }}>Details</Text>
                </View>
                <Divider bgColor={"#EBEBEB"} my={2} width={"90%"} />

                <InfoItem Title={"Code"} Value={SubscriptionCode} />
                <Divider bgColor={"#EBEBEB"} my={2} width={"90%"} />

                <InfoItem Title={"Auto-Renewal"} Value={autoRenewal} />
                <Divider bgColor={"#EBEBEB"} my={2} width={"90%"} />

                <InfoItem Title={"Date Purchased"} Value={Utility.formatDt(InitialDate, "yyyy-MM-dd")} />
                <Divider bgColor={"#EBEBEB"} my={2} width={"90%"} />

                <InfoItem Title={"Date Expired"} Value={Utility.formatDt(ExpiryDate, "yyyy-MM-dd")} />
                <Divider bgColor={"#EBEBEB"} my={2} width={"90%"} />
            </View>
        </BcBoxShadow>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { Id: SubId = -1 } = props.route.params;
    // const SubId = 26;

    const userId = useSelector(Selectors.userIdSelect);

    const [subInfo, setSubInfo] = useSubInfo();
    const [loading, setLoading, toggleLoading] = useToggle(false);

    useEffect(() => {
        if (isFocused) {
            fetchSubscription({
                param: {
                    UserId: userId,
                    SubscriptionId: SubId
                },
                onSetLoading: setLoading
            })
                .then(data => {
                    setSubInfo(data)
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [isFocused]);

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Subscription Information</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack space={3} flexGrow={1}>
                            <SubPanel data={subInfo} />
                            <InfoPanel data={subInfo} />
                        </VStack>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;