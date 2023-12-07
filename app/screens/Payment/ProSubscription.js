import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg, Animation } from "@config";

import { BcHeaderWithAdd, BcLoading, BcBoxShadow, BcSvgIcon, BcTooltip } from "@components";
import { useToggle } from "@hooks";

import { fetchSubscriptionProPlan } from "@api";

import { Tab, TabView } from "@rneui/themed";
import LinearGradient from "react-native-linear-gradient";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import Lottie from "lottie-react-native";
import { subProData } from "./data";

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
        <View alignItems={"center"}
            justifyContent={"center"}
            style={{ height: 60 }}>
            <Text style={{
                width: "90%",
                textAlign: "center",
                fontFamily: "Roboto-Medium",
                fontSize: 14,
                color: "#585858"
            }}>
                All Subscription are automatically renewed unless cancelled during the subscription period.
            </Text>
        </View>
    )
}

function TPHeader(props) {

    const { hook = [], colors = {}, borderRadius = 4, payDictHook = [] } = props;

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
                height: 32,
                width: "90%", columnGap: 5,

            }}>
            {
                payDictKey.map((term, ind) => {
                    return (
                        <Tab.Item key={ind}
                            title={term}
                            titleStyle={(active) => ({
                                color: (active) ? "#FFF" : "#ACB3BB",
                                fontSize: 12
                            })}
                            buttonStyle={(active) => ({
                                width: "100%", height: "100%",
                                padding: 0, borderRadius: borderRadius,
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
        if (typeof (item) === "string") {
            return (
                <>
                    <HStack key={index} alignItems={"center"} space={5}>
                        <FontAwesome name={"check-circle"} color={"#FFF"} size={24} />
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

        const { title = "", description = "", icon = "", info = "", showInfo = false } = item;
        return (
            <>
                <HStack key={index} alignItems={"center"} space={5}>
                    <BcSvgIcon name={icon} size={24} color={iconColor} />
                    <View flex={1}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 16,
                            color: txtColor
                        }}>{title}</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: txtColor
                        }}>{description}</Text>
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
                <View style={{ height: 10 }} />
            </>
        );
    }

    return (
        <View flexGrow={1} alignItems={"center"}>
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ flex: 1, width: "90%" }} />
        </View>
    );
}

function TPBody(props) {

    const navigation = useNavigation();
    const { inverse = false, title = "", hook = [], colors = {} } = props;
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
            <VStack flexGrow={1} space={2} py={3}
                width={"90%"} bgColor={bgColor}
                justifyContent={"space-between"}
                borderRadius={8}>

                {/* Price */}
                <View alignItems={"center"}>
                    <HStack alignItems={"center"} justifyContent={"space-between"} width={"90%"}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 20,
                            textAlign: "center",
                            color: txtColor,
                        }}>Pro</Text>
                        <HStack alignItems={"center"} space={1}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                color: bgInvColor,
                            }}>RM {price.toFixed(2)}</Text>

                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                color: bgInvColor,
                            }}>/ Month</Text>
                        </HStack>
                    </HStack>
                </View>

                {/* Details */}
                <Detail data={detail} {...props} />

                {/* Buy Now Button */}
                {
                    (showBtn) ? (
                        <View alignItems={"center"}>
                            <TouchableOpacity onPress={GoToPayment} style={{ width: "90%", height: 48 }}>
                                <HStack flex={1}
                                    borderRadius={4}
                                    bgColor={bgInvColor}
                                    alignItems={"center"}
                                    justifyContent={"center"}>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 18,
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

function Logo(props) {
    return (
        <VStack space={2} alignItems={"center"}>
            {/* Term */}
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 20
            }}>Yatu Pro</Text>

            {/* Logo */}
            <Image
                source={Images.SubProIILogo}
                resizeMode={"contain"}
                style={{
                    height: 100,
                    width: 100,
                    borderRadius: 8
                }}
                alt={"Yatu Pro Subscription"}
            />
        </VStack>
    )
}

function InfoTooltip(props) {

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

    const TAC = () => (
        <TouchableOpacity>
            <Text style={style.hyperlink}>Terms of use</Text>
        </TouchableOpacity>
    );

    const PP = () => (
        <TouchableOpacity>
            <Text style={style.hyperlink}>Privacy Policy</Text>
        </TouchableOpacity>
    );

    return (
        <VStack>
            <Text style={{ textAlign: "justify", ...style.txt }}>Payment will be charged to your Payment Service at the confirmation of purchase. If you have paid for renewal service, your account will be charged for renewal within 24 hours prior to the end of the current period. You can cancel your subscriptions at any time.</Text>
            <HStack alignItems={"flex-start"} space={1.5}>
                <Text style={style.txt}>Read Subscription:</Text>
                <TAC />
                <Text>&</Text>
                <PP />
            </HStack>
        </VStack>
    )
}

function InfoIcon(props) {
    return (
        <BcTooltip placement={"bottom"} bgColor={"#FFF"}
            modalBgColor={"rgba(0, 0, 0, 0.25)"} borderWidth={0}
            content={<InfoTooltip />}>
            <BcSvgIcon name={"InfoIcon"} size={24} />
        </BcTooltip>
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
            // SubscriptionProPlan();
            setPayDict(subProData);
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
            // inverse={false}
            hook={payDictHook}
            colors={colors} />
    )
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#F3F8FC"} style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeaderWithAdd Right={<InfoIcon />}>Subscription</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    {
                        (payDictKey.length > 0) ? (
                            <VStack space={3} flexGrow={1}>
                                {/* Logo */}
                                <Logo />

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

                    {/* Footer */}
                    <Footer />

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;