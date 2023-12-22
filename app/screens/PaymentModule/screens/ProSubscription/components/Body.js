import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Tab, TabView } from "@rneui/themed";

import { BcSvgIcon, BcTooltip } from "@components";

import { useTabPane } from "@hooks";

function TPHeader(props) {

    const { hook = [], colors = {}, borderRadius = 4, payDictHook = [] } = props;

    const [tpInd, setTpInd, onChangeTpInd] = hook;
    const [payDict, setPayDict, payDictKey, payProImg] = payDictHook;

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
                <HStack key={index} alignItems={"center"} space={5} onStartShouldSetResponder={() => true}>
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
                keyboardShouldPersistTaps={"always"}
                style={{ flex: 1, width: "90%" }} />
        </View>
    );
}

function TPBody(props) {

    const navigation = useNavigation();

    const { inverse = false, title = "", hook = [], colors = {} } = props;
    const { onPurchase = () => {} } = props;

    const [payDict, setPayDict, payDictKey, payProImg] = hook;

    if (payDictKey.length == 0) {
        return <></>
    }

    const obj = payDict[title];
    
    const { price = 0, detail = [], title: oTitle = "", data: oData = {}, showBtn = false } = obj;
    const { productId, offerToken } = obj;

    const onPurchaseSelect = () => onPurchase(productId, offerToken);

    const txtColor = inverse ? "#FFF" : "#000";
    const bgColor = inverse ? colors.activeColor : colors.inActiveColor;
    const bgInvColor = inverse ? colors.inActiveColor : colors.activeColor;

    return (
        <TabView.Item style={{ width: "100%", alignItems: "center" }}>

            <VStack flexGrow={1} space={2} py={3} bgColor={bgColor}
                width={"90%"}
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
                            <TouchableOpacity onPress={onPurchaseSelect} style={{ width: "90%", height: 48 }}>
                                <HStack flex={1}
                                    borderRadius={4}
                                    bgColor={bgInvColor}
                                    alignItems={"center"}
                                    justifyContent={"center"}>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 18,
                                        textAlign: "center",
                                        color: bgColor,
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

function Index(props) {

    const { hook = [], colors = {}, onPurchase = () => {} } = props;

    const tpHook = useTabPane(0);
    const [tpInd, setTpInd, onChangeTpInd] = tpHook;

    const [payDict, setPayDict, payDictKey, payProImg] = hook;

    const renderTabBody = (term, ind) => (
        <TPBody key={ind}
            title={term}
            inverse={ind % 2 == 1}
            hook={hook}
            colors={colors}
            onPurchase={onPurchase} />
    )

    return (
        <VStack space={3} flexGrow={1}>
            {/* Tab Header */}
            <View alignItems={"center"}>
                <TPHeader hook={tpHook} colors={colors} payDictHook={hook} />
            </View>

            {/* Tab Body */}
            <TabView value={tpInd} onChange={onChangeTpInd}>
                {payDictKey.map(renderTabBody)}
            </TabView>
        </VStack>
    )
}

export default Index;