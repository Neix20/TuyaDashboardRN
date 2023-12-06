import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg, Animation } from "@config";

import { BcHeader, BcLoading, BcBoxShadow, BcSvgIcon, BcTooltip } from "@components";
import { useToggle } from "@hooks";

import { fetchSubscriptionProPlan } from "@api";

import { Tab, TabView } from "@rneui/themed";
import LinearGradient from "react-native-linear-gradient";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import Lottie from "lottie-react-native";

import Tooltip from 'react-native-walkthrough-tooltip';

// #region Components
function EmptyList(props) {
    return (
        <View flexGrow={1} justifyContent={"center"}>
            <VStack space={3} alignItems={"center"}>
                <Lottie
                    autoPlay
                    source={Animation.YatuLoader}
                    loop={true}
                    style={{
                        width: 360,
                        height: 360
                    }} />

                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                    color: "#2898FF"
                }}>Loading ...</Text>
            </VStack>
        </View>
    )
}

function Footer(props) {
    return (
        <VStack space={1} py={2}>
            <View alignItems={"center"}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 14,
                    color: "#98A0A8"
                }}>Cancel Anytime</Text>
            </View>

            <View alignItems={"center"}>
                <HStack space={3} alignItems={"center"} width={"60%"} justifyContent={"space-between"}>
                    <TouchableOpacity disabled={true}>
                        <View>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 16,
                                textDecorationLine: "underline"
                            }}>Terms of Use</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={true}>
                        <View>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 16,
                                textDecorationLine: "underline"
                            }}>Privacy Policy</Text>
                        </View>
                    </TouchableOpacity>
                </HStack>
            </View>

            <View alignItems={"center"}>
                <Text style={{
                    width: "90%",
                    textAlign: "justify",
                    fontFamily: "Roboto-Medium",
                    fontSize: 14,
                    color: "#585858"
                }}>
                    Payment will be charged to your Payment Service at the confirmation of purchase. If you have paid for renewal service, your account will be charged for renewal within 24 hours prior to the end of the current period. You can cancel your subscriptions by cancelling via App or contact us at <Text style={{ color: "#00F", textDecorationLine: "underline" }}>app.vigtech@gmail.com</Text>
                </Text>
            </View>

        </VStack>
    )
}

function TPHeader(props) {
    const { hook = [], colors = {}, borderRadius = 8, payDictHook = [] } = props;
    const [tpInd, setTpInd, onChangeTpInd] = hook;
    const [payDict, setPayDict, payDictKey] = payDictHook;

    if (payDictKey.length == 0) {
        return (<></>)
    }

    return (
        <Tab dense
            value={tpInd}
            onChange={onChangeTpInd}
            disableIndicator={true}
            style={{
                height: 60, width: "90%",
                borderWidth: 1, borderRadius: borderRadius, borderColor: "#98A0A8",
                backgroundColor: "#FFF"
            }}>
            {
                payDictKey.map((term, ind) => {
                    return (
                        <Tab.Item key={ind}
                            title={term}
                            titleStyle={(active) => ({ color: (active) ? "#FFF" : "#000" })}
                            buttonStyle={(active) => ({
                                width: "100%", height: "100%", borderRadius: borderRadius - 2,
                                backgroundColor: (active) ? colors.activeColor : colors.inActiveColor
                            })}
                        />
                    )
                })
            }
        </Tab>
    )
}

function Detail(props) {

    const { inverse = false, data = [], colors = {} } = props;

    const iconColor = inverse ? colors.inActiveColor : colors.activeColor;
    const txtColor = inverse ? "#FFF" : "#000";
    const infoColor = inverse ? "#484848" : "#98A0A8";

    const renderItem = ({ item, index }) => {

        // To Remove
        if (typeof(item) === "string") {
            return (
                <>
                    <HStack key={index} alignItems={"center"} space={5}>
                        <FontAwesome name={"check-circle"} color={iconColor} size={24} />
                        <View flex={1}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18,
                                color: txtColor
                            }}>{item}</Text>
                        </View>
                        <View style={{ height: 24, width: 24 }} />
                    </HStack>
                    <View style={{ height: 5 }} />
                </>
            )
        }

        const { term = "", info = "", showInfo = false } = item;
        return (
            <>
                <HStack key={index} alignItems={"center"} space={5}>
                    <FontAwesome name={"check-circle"} color={iconColor} size={24} />
                    <View flex={1}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18,
                            color: txtColor
                        }}>{term}</Text>
                    </View>
                    {
                        (showInfo) ? (
                            <BcTooltip content={<Text style={{ textAlign: "justify" }}>{info}</Text>}>
                                <FontAwesome5 name={"info-circle"} color={infoColor} size={24} />
                            </BcTooltip>
                        ) : (
                            <View style={{ height: 24, width: 24 }} />
                        )
                    }
                </HStack>
                <View style={{ height: 5 }} />
            </>
        )
    }

    return (
        <View alignItems={"center"}>
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ width: "90%" }} />
        </View>
    )
}

function TPBody(props) {

    const navigation = useNavigation();

    const { inverse = false, title = "Pro 1 Month", hook = [], colors = {} } = props;

    const [payDict, setPayDict, payDictKey] = hook;

    if (payDictKey.length == 0) {
        return <></>
    }

    const obj = payDict[title];

    const { price = 0, detail = [], priceTerm = "", title: oTitle = "", data: oData = {}, showBtn = false } = obj;

    const GoToPayment = () => {
        navigation.navigate("Payment", {
            data: [oData]
        });
    }

    const txtColor = inverse ? "#FFF" : "#000";
    const txtInvColor = inverse ? "#000" : "#FFF";
    const bgColor = inverse ? colors.activeColor : colors.inActiveColor;
    const bgInvColor = inverse ? colors.inActiveColor : colors.activeColor;

    return (
        <TabView.Item style={{ width: "100%", alignItems: "center" }}>
            <VStack flex={1} width={"90%"} space={3} py={3}
                bgColor={bgColor} justifyContent={"space-between"}
                borderWidth={2} borderRadius={12} borderColor={"#98A0A8"}>

                <VStack space={3}>
                    {/* Term */}
                    <View alignItems={"center"}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 20,
                            color: txtColor
                        }}>{oTitle}</Text>
                    </View>

                    {/* Logo */}
                    <View alignItems={"center"}>
                        <BcBoxShadow style={{ width: "100%", borderRadius: 40 }}>
                            <View bgColor={"#FFF"} p={3} borderRadius={48}>
                                <BcSvgIcon name={"AppLogo"} width={64} height={64} />
                            </View>
                        </BcBoxShadow>
                    </View>
                </VStack>

                {/* Details */}
                <Detail data={detail} {...props} />

                {/* Price */}
                <View alignItems={"center"}>
                    {
                        (price == 0) ? (
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 24,
                                color: txtColor
                            }}>Free | {priceTerm}</Text>
                        ) : (
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 24,
                                color: txtColor
                            }}>RM {price.toFixed(2)} | {priceTerm}</Text>
                        )
                    }
                </View>

                {/* Buy Now Button */}
                {
                    (showBtn) ? (
                        <View alignItems={"center"}>
                            <TouchableOpacity onPress={GoToPayment}>
                                <HStack
                                    bgColor={bgInvColor}
                                    borderRadius={8}
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                    style={{ width: 120, height: 40 }}>
                                    <Text style={{
                                        fontFamily: "Roboto-Medium",
                                        fontSize: 20,
                                        textAlign: "center",
                                        color: txtInvColor,
                                    }}>Buy Now</Text>
                                </HStack>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ height: 40 }} />
                    )
                }
            </VStack>
        </TabView.Item>
    )
}
// #endregion

// #region Custom Hooks
function useTabPane(val = 0) {
    const [ind, setInd] = useState(val);

    const onChangeInd = (e) => setInd(_ => e);

    return [ind, setInd, onChangeInd];
}

function usePayDict() {

    const [dict, setDict] = useState({});
    const [data, setData] = useState([]);
    const [key, setKey] = useState([]);

    useEffect(() => {
        if (data.length > 0) {
            let arr = [...data];

            arr = arr.map(obj => {

                const { Image } = obj.data;
                return {
                    ...obj,
                    data: {
                        ...obj.data,
                        img: { uri: Image }
                    }
                }
            })

            let aDict = {};

            for (let obj of arr) {
                const { key } = obj;
                aDict[key] = obj;
            }

            let keys = Object.keys(aDict);
            setKey(keys);

            setDict(aDict);
        }
    }, [data]);

    return [dict, setData, key];
}
// #endregion

function Index(props) {

    const colors = {
        activeColor: "#2898FF",
        inActiveColor: "#FFF",
    }

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const userId = useSelector(Selectors.userIdSelect);

    // #region UseState
    const [loading, setLoading, toggleLoading] = useToggle(false);

    const tpHook = useTabPane(0);
    const [tpInd, setTpInd, onChangeTpInd] = tpHook;

    const payDictHook = usePayDict();
    const [payDict, setPayDict, payDictKey] = payDictHook;
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            SubscriptionProPlan();
        }
    }, [isFocused]);
    // #endregion

    // #region Api
    const SubscriptionProPlan = () => {
        setLoading(true);
        fetchSubscriptionProPlan({
            param: {
                UserId: userId
            },
            onSetLoading: setLoading
        })
            .then(data => {
                setPayDict(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    // #region Render
    const renderTabBody = (term, ind) => (
        <TPBody key={ind}
            title={term}
            inverse={ind % 2 == 1}
            hook={payDictHook}
            colors={colors} />
    )
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#F6F6F6"} style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Member Subscription</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        {
                            (payDictKey.length > 0) ? (
                                <VStack space={3} flexGrow={1}>
                                    {/* Tab Header */}
                                    <View alignItems={"center"}>
                                        <TPHeader hook={tpHook} colors={colors} payDictHook={payDictHook} />
                                    </View>

                                    {/* Tab Body */}
                                    <TabView value={tpInd} onChange={onChangeTpInd}>
                                        {payDictKey.map(renderTabBody)}
                                    </TabView>
                                </VStack>
                            ) : (
                                <EmptyList />
                            )
                        }
                    </ScrollView>

                    {/* Footer */}
                    <Footer />

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;