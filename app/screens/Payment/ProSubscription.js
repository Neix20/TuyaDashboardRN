import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcLoading, BcBoxShadow, BcSvgIcon } from "@components";
import { useToggle } from "@hooks";

import { Tab, TabView } from "@rneui/themed";
import LinearGradient from "react-native-linear-gradient";

// #region Components
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
    const { hook = [], colors = {}, borderRadius = 8 } = props;
    const [tpInd, setTpInd, onChangeTpInd] = hook;
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
            <Tab.Item
                title={"Pro 1 Month"}
                titleStyle={(active) => ({ color: (active) ? "#FFF" : "#000" })}
                buttonStyle={(active) => ({
                    width: "100%", height: "100%", borderRadius: borderRadius - 2,
                    backgroundColor: (active) ? colors.activeColor : colors.inActiveColor
                })} />
            <Tab.Item
                title={"Pro 3 Month"}
                titleStyle={(active) => ({ color: (active) ? "#FFF" : "#000" })}
                buttonStyle={(active) => ({
                    width: "100%", height: "100%", borderRadius: borderRadius - 2,
                    backgroundColor: (active) ? colors.activeColor : colors.inActiveColor
                })} />
            <Tab.Item
                title={"Pro 6 Month"}
                titleStyle={(active) => ({ color: (active) ? "#FFF" : "#000" })}
                buttonStyle={(active) => ({
                    width: "100%", height: "100%", borderRadius: borderRadius - 2,
                    backgroundColor: (active) ? colors.activeColor : colors.inActiveColor
                })} />
            <Tab.Item
                title={"Pro 1 Year"}
                titleStyle={(active) => ({ color: (active) ? "#FFF" : "#000" })}
                buttonStyle={(active) => ({
                    width: "100%", height: "100%", borderRadius: borderRadius - 2,
                    backgroundColor: (active) ? colors.activeColor : colors.inActiveColor
                })} />
        </Tab>
    )
}

function Detail(props) {

    const { inverse = false, data = [] } = props;

    let renderItem = ({ item, index }) => {
        return (
            <>
                <HStack key={index} alignItems={"center"} space={5}>
                    <FontAwesome name={"check-circle"} color={"#2898FF"} size={24} />
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18
                    }}>{item}</Text>
                </HStack>
                <View style={{ height: 5 }} />
            </>
        )
    }

    if (inverse) {
        renderItem = ({ item, index }) => {
            return (
                <>
                    <HStack key={index} alignItems={"center"} space={5}>
                        <FontAwesome name={"check-circle"} color={"#FFF"} size={24} />
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18,
                            color: "#FFF"
                        }}>{item}</Text>
                    </HStack>
                    <View style={{ height: 5 }} />
                </>
            )
        }
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

    const { inverse = false, title = "Pro 1 Month" } = props;

    const payDict = {
        "Pro 1 Month": {
            title: "Professional (1 Month)",
            detail: [
                "1 Hr Interval Data Retrieval",
                "1 Month Secure Data Storage",
                "24 Hr Support",
                "20 Devices",
                "Email Archiving",
            ],
            data: {
                "Code": "MSPP0100",
                "Name": "Pro Subscription",
                "Description": "Pro Subscription for 1 Month",
                "Duration": 1,
                "Price": 39.99,
                "GroupCode": null,
                "TypeCode": "MSP_SP",
                "DurationTypeCode": "DT_MM",
                "ModuleCode": null,
                "MetaData": null,
                "Status": 1,
                "Remark": "",
                "Created_By": "System",
                "Created_Date": "2023-11-08T15:10:45",
                "Last_Updated_By": "System",
                "Last_Updated_Date": "2023-11-08T15:10:45",
                "Image": "https://i.imgur.com/nQCj6ea.png",
                img: { uri: "https://i.imgur.com/nQCj6ea.png" }
            },
            price: 39.99,
            priceTerm: "Monthly",
            showBtn: true,
        },
        "Pro 3 Month": {
            title: "Professional (3 Month)",
            detail: [
                "1 Hr Interval Data Retrieval",
                "3 Month Secure Data Storage",
                "24 Hr Support",
                "20 Devices",
                "Email Archiving",
            ],
            data: {
                "Code": "MSPP0300",
                "Name": "Pro Subscription",
                "Description": "Pro Subscription for 3 Month",
                "Duration": 3,
                "Price": 39.99,
                "GroupCode": null,
                "TypeCode": "MSP_SP",
                "DurationTypeCode": "DT_MM",
                "ModuleCode": null,
                "MetaData": null,
                "Status": 1,
                "Remark": "",
                "Created_By": "System",
                "Created_Date": "2023-11-08T15:10:45",
                "Last_Updated_By": "System",
                "Last_Updated_Date": "2023-11-08T15:10:45",
                "Image": "https://i.imgur.com/nQCj6ea.png",
                img: { uri: "https://i.imgur.com/nQCj6ea.png" }
            },
            price: 39.99 * 3,
            priceTerm: "Quarterly",
            showBtn: true,
        },
        "Pro 6 Month": {
            title: "Professional (6 Month)",
            detail: [
                "Real-Time Data Analysis",
                "6 Months Secure Data Storage",
                "24 / 7 Live Support",
                "50 Devices",
                "Email Archiving",
            ],
            data: {
                "Code": "MSPP0600",
                "Name": "Pro Subscription",
                "Description": "Pro Subscription for 6 Month",
                "Duration": 6,
                "Price": 39.99,
                "GroupCode": null,
                "TypeCode": "MSP_SP",
                "DurationTypeCode": "DT_MM",
                "ModuleCode": null,
                "MetaData": null,
                "Status": 1,
                "Remark": "",
                "Created_By": "System",
                "Created_Date": "2023-11-08T15:10:45",
                "Last_Updated_By": "System",
                "Last_Updated_Date": "2023-11-08T15:10:45",
                "Image": "https://i.imgur.com/nQCj6ea.png",
                img: { uri: "https://i.imgur.com/nQCj6ea.png" }
            },
            price: 39.99 * 6,
            priceTerm: "Half-Yearly",
            showBtn: true,
        },
        "Pro 1 Year": {
            title: "Professional (1 Year)",
            detail: [
                "Real-Time Data Analysis",
                "1-Year Secure Data Storage",
                "24 / 7 Live Support",
                "50 Devices",
                "Email Archiving",
            ],
            data: {
                "Code": "MSPP1000",
                "Name": "Pro Subscription",
                "Description": "Pro Subscription for 1 Year",
                "Duration": 1,
                "Price": 39.99,
                "GroupCode": null,
                "TypeCode": "MSP_SP",
                "DurationTypeCode": "DT_YY",
                "ModuleCode": null,
                "MetaData": null,
                "Status": 1,
                "Remark": "",
                "Created_By": "System",
                "Created_Date": "2023-11-08T15:10:45",
                "Last_Updated_By": "System",
                "Last_Updated_Date": "2023-11-08T15:10:45",
                "Image": "https://i.imgur.com/nQCj6ea.png",
                img: { uri: "https://i.imgur.com/nQCj6ea.png" }
            },
            price: 39.99 * 12,
            priceTerm: "Annually",
            showBtn: true,
        }
    }

    const obj = payDict[title];

    const { price = 0, detail = [], priceTerm = "", title: oTitle = "", data: oData = {}, showBtn = false } = obj;

    const GoToPayment = () => {
        navigation.navigate("Payment", {
            data: [oData]
        });
    }

    if (inverse) {
        return (
            <TabView.Item style={{ width: "100%", alignItems: "center" }}>
                <VStack flex={1} width={"90%"} space={3} py={3}
                    bgColor={"#2898FF"} justifyContent={"space-between"}
                    borderWidth={2} borderRadius={12} borderColor={"#98A0A8"}>

                    <VStack space={3}>
                        {/* Term */}
                        <View alignItems={"center"}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                color: "#FFF"
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
                                    color: "#FFF"
                                }}>Free | {priceTerm}</Text>
                            ) : (
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    fontSize: 24,
                                    color: "#FFF"
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
                                        bgColor={"#FFF"}
                                        borderRadius={8}
                                        alignItems={"center"}
                                        justifyContent={"center"}
                                        style={{ width: 120, height: 40 }}>
                                        <Text style={{
                                            fontFamily: "Roboto-Medium",
                                            fontSize: 20,
                                            textAlign: "center",
                                            color: "#000",
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

    return (
        <TabView.Item style={{ width: "100%", alignItems: "center" }}>
            <VStack flex={1} width={"90%"} space={3} py={3}
                bgColor={"#FFF"} justifyContent={"space-between"}
                borderWidth={2} borderRadius={12} borderColor={"#98A0A8"}>

                <VStack space={3}>
                    {/* Term */}
                    <View alignItems={"center"}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 20
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
                            }}>Free | {priceTerm}</Text>
                        ) : (
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 24
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
                                    bgColor={"#2898FF"}
                                    borderRadius={8}
                                    alignItems={"center"}
                                    justifyContent={"center"}
                                    style={{ width: 120, height: 40 }}>
                                    <Text style={{
                                        fontFamily: "Roboto-Medium",
                                        fontSize: 20,
                                        textAlign: "center",
                                        color: "#FFF",
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
// #endregion

function Index(props) {

    const colors = {
        activeColor: "#2898FF",
        inActiveColor: "#FFF",
    }

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading, toggleLoading] = useToggle(false);

    const tpHook = useTabPane(0);
    const [tpInd, setTpInd, onChangeTpInd] = tpHook;

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
                        <VStack space={3} flexGrow={1}>
                            {/* Tab Header */}
                            <View alignItems={"center"}>
                                <TPHeader hook={tpHook} colors={colors} />
                            </View>

                            {/* Tab Body */}
                            <TabView value={tpInd} onChange={onChangeTpInd}>
                                <TPBody title={"Pro 1 Month"} inverse={false} />
                                <TPBody title={"Pro 3 Month"} inverse={true} />
                                <TPBody title={"Pro 6 Month"} inverse={false} />
                                <TPBody title={"Pro 1 Year"} inverse={true} />
                            </TabView>
                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <Footer />

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;