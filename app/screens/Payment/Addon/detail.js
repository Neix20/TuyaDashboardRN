import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { fetchSubscriptionPlan } from "@api";
import { useToggle } from "@hooks";

import { BcHeader, BcBoxShadow, BcDisable, BcFooter, BcLoading } from "@components";
import { CheckBox } from "@rneui/base";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Custom Hooks
function useSubLs() {

    const [ls, setLs] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        let arr = [...data];

        arr = arr.map((obj, index) => {
            const { Image } = obj;
            return {
                ...obj,
                img: { uri: Image },
                flag: false,
                pos: index
            }
        });

        setLs(_ => arr);
    }, [JSON.stringify(data)]);

    const toggleItem = (item) => {
        const { pos = 0, flag = false } = item;

        let arr = [...ls];

        for (let ind in arr) {
            arr[ind].flag = false;
        }

        arr[pos].flag = !flag;
        setLs(_ => arr);
    }

    const atLeastOne = ls.filter(x => x.flag).length > 0;

    return [ls, setData, toggleItem, atLeastOne];
}
// #endregion

// #region Components
function PaymentBodyItem(props) {
    const { data = {}, onPress = () => { } } = props;
    const { Name, Description, Price, img, flag, pos } = data;

    const borderRadius = 8;

    return (
        <>
            <TouchableOpacity onPress={onPress}>
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
                        <VStack px={3} flex={1} justifyContent={"center"}
                            space={2} style={{ height: 100 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 16,
                            }}>{Name}</Text>
                            <Text>{Description}</Text>
                            <Text>Price: <Text style={{ fontFamily: "Roboto-Bold" }}>RM {Price.toFixed(2)}</Text></Text>
                        </VStack>
                        <CheckBox
                            containerStyle={{
                                paddingHorizontal: 5,
                                paddingVertical: 0,
                            }}
                            iconType={"material-community"}
                            checkedIcon={"checkbox-marked"}
                            uncheckedIcon={"checkbox-blank-outline"}
                            checked={flag}
                            checkedColor={"#F01421"} />
                    </HStack>
                </BcBoxShadow>
            </TouchableOpacity>
            <View style={{ height: 10 }} />
        </>
    )
}

function PaymentBody(props) {

    const { hook = [] } = props;
    const [ls, setLs, toggleItem, submitFlag] = hook;

    const renderItem = ({ item, index }) => {
        const onPress = () => toggleItem(item);
        return (
            <PaymentBodyItem key={index}
                onPress={onPress}
                data={item} />
        )
    }

    return (
        <VStack width={"90%"} flex={1} space={2}>
            <View style={{ paddingHorizontal: 2 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                }}>Add-Ons</Text>
            </View>
            <FlatList
                data={ls}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 2 }}
            />
        </VStack>
    )
}

function PaymentHeader(props) {
    const { Title = "", Description = "", Align = "Left" } = props;

    if (Align == "Left") {
        return (
            <HStack alignItems={"center"} justifyContent={"space-between"}
                width={"90%"} style={{ paddingHorizontal: 2 }}>

                <Image
                    source={Images.paymentII}
                    resizeMode={"cover"}
                    style={{ width: 100, height: 100 }} />


                <VStack flex={1}>
                    {/* Title */}
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#000"
                    }}>{Title}</Text>

                    {/* Description */}
                    <Text>{Description}</Text>
                </VStack>
            </HStack>
        )
    }

    return (
        <HStack alignItems={"center"} justifyContent={"space-between"}
            width={"90%"} style={{ paddingHorizontal: 2 }}>

            <VStack flex={1}>
                {/* Title */}
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 18,
                    color: "#000"
                }}>{Title}</Text>

                {/* Description */}
                <Text>{Description}</Text>
            </VStack>

            <Image
                source={Images.paymentII}
                resizeMode={"cover"}
                style={{ width: 100, height: 100 }} />

        </HStack>
    )
    return (
        <VStack width={"90%"} space={1}>
            <View style={{ paddingHorizontal: 2 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                }}>{Title}</Text>
            </View>
            <View style={{ paddingHorizontal: 2 }}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 14,
                }}>{Description}</Text>
            </View>
        </VStack>
    )
}

function PaymentBtn(props) {

    const { flag = false, onPress = () => { } } = props;
    const { children = "" } = props;

    const Item = (props) => {
        return (
            <View bgColor={"#F01421"}
                borderRadius={12}
                alignItems={"center"}
                justifyContent={"center"}
                style={{ height: 48 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                    color: "#FFF"
                }}>{children}</Text>
            </View>
        )
    }

    if (flag) {
        return (
            <TouchableOpacity style={{ width: "90%" }} onPress={onPress}>
                <Item />
            </TouchableOpacity>
        )
    }

    return (
        <View width={"90%"}>
            <BcDisable>
                <Item />
            </BcDisable>
        </View>
    )
}
// #endregion

function getDetail(term = "MSP_SP") {
    const detail = {
        "MSP_EM": {
            Detail: {
                Title: "Email Module",
                Description: "In est fugiat Lorem culpa elit labore elit exercitation. Deserunt elit eu ad aliquip esse eu labore cillum velit. Sit voluptate fugiat veniam Lorem magna ut sit et Lorem enim irure.",
                Align: "Right",
            },
            Type: "MSP_EM"
        },
        "MSP_SP": {
            Detail: {
                Title: "Subscription Module",
                Description: "In est fugiat Lorem culpa elit labore elit exercitation. Deserunt elit eu ad aliquip esse eu labore cillum velit. Sit voluptate fugiat veniam Lorem magna ut sit et Lorem enim irure.",
                Align: "Left",
            },
            Type: "MSP_SP"
        },
        "MSP_SM": {
            Detail: {
                Title: "Storage Module",
                Description: "In est fugiat Lorem culpa elit labore elit exercitation. Deserunt elit eu ad aliquip esse eu labore cillum velit. Sit voluptate fugiat veniam Lorem magna ut sit et Lorem enim irure.",
                Align: "Right",
            },
            Type: "MSP_SM"
        },
        "MSP_RTM": {
            Detail: {
                Title: "Real-Time Data Module",
                Description: "In est fugiat Lorem culpa elit labore elit exercitation. Deserunt elit eu ad aliquip esse eu labore cillum velit. Sit voluptate fugiat veniam Lorem magna ut sit et Lorem enim irure.",
                Align: "Left",
            },
            Type: "MSP_RTM"
        },
        "MSP_UM": {
            Detail: {
                Title: "User Module",
                Description: "In est fugiat Lorem culpa elit labore elit exercitation. Deserunt elit eu ad aliquip esse eu labore cillum velit. Sit voluptate fugiat veniam Lorem magna ut sit et Lorem enim irure.",
                Align: "Right",
            },
            Type: "MSP_UM"
        }
    }

    if (term in detail) {
        return detail[term];
    }

    return detail["MSP_SP"];
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const userId = useSelector(Selectors.userIdSelect);

    const { Term = "" } = props.route.params;
    console.log(Term);

    // #region Use State
    const dataHook = useSubLs();
    const [ls, setLs, toggleItem, submitFlag] = dataHook;

    const [loading, setLoading, toggleLoading] = useToggle(false);
    // #endregion

    useEffect(() => {
        if (isFocused) {
            fetchSubscriptionPlan({
                param: {
                    UserId: userId,
                    Type: Type
                },
                onSetLoading: setLoading
            })
                .then(data => {
                    setLs(data);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [isFocused]);

    const GoToPayment = () => {
        navigation.navigate("Payment", {
            data: ls.filter(x => x.flag)
        });
    };

    const { Type = "", Detail = {} } = getDetail(Term);

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View flex={1} bgColor={"#FFF"}>

                    {/* Header */}
                    <BcHeader>Add-Ons</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <VStack flexGrow={1} space={2}
                        alignItems={"center"}>
                        {/* Header */}
                        <PaymentHeader {...Detail} />

                        {/* Body */}
                        <PaymentBody hook={dataHook} />
                    </VStack>

                    <BcFooter>
                        <PaymentBtn flag={submitFlag} onPress={GoToPayment}>Subscribe Now</PaymentBtn>
                    </BcFooter>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;