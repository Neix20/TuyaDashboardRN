import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { fetchSubscription, fetchCancelSubscriptionOrder } from "@api";

import { BcHeader, BcLoading, BcBoxShadow } from "@components";
import { useToggle } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { deepLinkToSubscriptions } from "react-native-iap";

// #region Custom Hooks
function useInfo() {
    const [data, setData] = useState({});

    const updateData = (data) => {

        const { Image = "" } = data;

        const next_state = {
            ...data,
            img: { uri: Image }
        };

        setData(_ => next_state);
    }

    return [data, updateData];
}
// #endregion

// #region Components
function TopItem(props) {
    const { data = {} } = props;
    const { Name, Description, img, flag = true } = data

    const borderRadius = 8;

    const style = {
        img: {
            height: 100,
            width: 100,
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
        },
        name: {
            fontFamily: "Roboto-Bold",
            fontSize: 16,
        }
    };

    return (
        <BcBoxShadow style={{ borderRadius, width: "100%" }}>
            <HStack bgColor={"#FFF"}
                borderRadius={borderRadius}
                alignItems={"center"}>
                <Image source={img} style={style.img} alt={Name} />
                <VStack px={3} flex={1}
                    space={2} style={{ height: 80 }}>
                    <Text style={style.name}>{Name}</Text>
                    <Text>{Description}</Text>
                </VStack>
            </HStack>
        </BcBoxShadow>
    )
}

function TopPanel(props) {
    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"} alignItems={"center"} py={3}>
                <View width={"90%"}>
                    <TopItem {...props} />
                </View>
            </View>
        </BcBoxShadow>
    )
}

function InfoItem(props) {
    const { Title, Value } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 18
        },
        value: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: "#000",
        }
    };

    return (
        <HStack width={"90%"} alignItems={"center"}>
            <View flex={.4}>
                <Text style={style.title}>{Title}: </Text>
            </View>
            <View flex={.6} alignItems={"flex-end"}>
                <Text style={style.value}>{Value}</Text>
            </View>
        </HStack>
    )
}

function InfoPanel(props) {

    const { data = {} } = props;
    const { SubscriptionCode = "", InitialDate, ExpiryDate, AutoRenew = 0 } = data;

    const autoRenewal = (AutoRenew == 0) ? "False" : "True";

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
            color: "#000"
        }
    }

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"} alignItems={"center"} pt={3}>
                <View width={"90%"}>
                    <Text style={style.title}>Details</Text>
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

function CancelSubscription(props) {

    const { hideFlag = false, onPress = () => { } } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
            color: "#F00"
        }
    }

    if (hideFlag) {
        return (<></>)
    }

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"} alignItems={"center"}>
                <TouchableOpacity onPress={onPress}
                    style={{ width: "90%", height: 40 }}>
                    <View flex={1} alignItems={"center"} justifyContent={"center"}>
                        <Text style={style.title}>Cancel Subscription</Text>
                    </View>
                </TouchableOpacity>
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

    const [subInfo, setSubInfo] = useInfo();
    const [loading, setLoading, toggleLoading] = useToggle(false);

    useEffect(() => {
        if (isFocused) {
            Subscription();
        }
    }, [isFocused]);

    const Subscription = () => {
        setLoading(true);
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

    const { SubscriptionCode = "" } = subInfo;

    const CancelSubscriptionOrder = () => {
        setLoading(true);
        fetchCancelSubscriptionOrder({
            param: {
                UserId: userId,
                SubscriptionId: SubId
            },
            onSetLoading: setLoading
        })
        .then(data => {
            GoToProfile();
        })
        .catch(err => {
            setLoading(false);
            console.error(`Error: ${err}`);
        })
    }

    const onCancelSubscription = () => {
        const sku = `com.subscription.${SubscriptionCode.toLowerCase()}`;
        // const sku = "com.subscription.mspp0100";

        // [x] API Call
        // Cancel Subscription

        deepLinkToSubscriptions({
            sku
        })
        .then(_ => {
            CancelSubscriptionOrder();
        })
        .catch(err => {
            console.error(`Error: ${err}`);
        });
    }

    const GoToProfile = () => {
        navigation.navigate("TabNavigation", {
            screen: "Profile",
        })
    }

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
                            <TopPanel data={subInfo} />
                            <InfoPanel data={subInfo} />
                            <CancelSubscription 
                                hideFlag={SubscriptionCode == "MSSP0007"} 
                                // hideFlag={false}
                                onPress={onCancelSubscription} />
                        </VStack>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;