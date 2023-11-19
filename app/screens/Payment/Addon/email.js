import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcBoxShadow, BcDisable, BcFooter } from "@components";
import { CheckBox } from "@rneui/base";

// #region Custom Hooks
function useSubLs(data = []) {
    const [ls, setLs] = useState(data);

    useEffect(() => {
        let arr = [...data];

        arr = arr.map((obj, index) => {
            const { img } = obj;
            return {
                ...obj,
                img: { uri: img },
                flag: false,
                pos: index
            }
        });

        setLs(_ => arr);
    }, []);

    const toggleItem = (item) => {
        const { pos = 0, flag = false } = item;

        let arr = [...ls];
        arr[pos].flag = !flag;
        setLs(_ => arr);
    }

    const atLeastOne = ls.filter(x => x.flag).length > 0;

    return [ls, setLs, toggleItem, atLeastOne];
}

function useFlagLs(length = 1) {
    const [ls, setLs] = useState([]);

    useEffect(() => {
        let arr = [];
        for (let ind = 0; ind < length; ind += 1) {
            const obj = {
                flag: false,
                pos: ind
            }
            arr.push(obj);
        }
        setLs(_ => arr);
    }, []);

    const toggleItem = (item) => {
        const { pos } = item;

        let arr = [...ls];

        for(let ind = 0; ind < arr.length; ind += 1) {
            arr[ind].flag = false;
        }

        arr[pos].flag = true;

        setLs(_ => arr);
    }

    return [ls, toggleItem];
}
// #endregion

// #region Components
function PaymentHeaderItem(props) {

    const { flag = false, onPress = () => { } } = props;
    const { title, price, description } = props;
    const clr = flag ? "#F01421" : "#98A0A8";

    return (
        <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
            <VStack p={1} borderRadius={8} borderWidth={2} borderColor={clr} space={2}>
                <View alignItems={"flex-end"}>
                    <View style={{ height: 18, width: 18 }}>
                        {
                            (flag) ? <FontAwesome name={"check-circle"} size={18} color={clr} /> : <></>
                        }
                    </View>
                </View>
                <View alignItems={"flex-start"}>
                    <View py={1} px={2}
                        borderRadius={4}
                        bgColor={"rgba(255, 0, 0, 0.3)"}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 14,
                            color: "#F01421",
                        }}>{title}</Text>
                    </View>
                </View>
                <HStack px={1} flexWrap={"wrap"} alignItems={"flex-start"} space={1}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 16
                    }}>{price}</Text>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 12
                    }}>RM</Text>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 12,
                        color: "#98A0A8"
                    }}>/mo.</Text>
                </HStack>
                <View px={1}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 12,
                        color: "#F01421"
                    }}>{description}</Text>
                </View>
            </VStack>
        </TouchableOpacity>
    )
}

function PaymentHeader(props) {

    const [flagLs, toggleFlag] = useFlagLs(3);

    if (flagLs.length <= 0) {
        return <></>
    }

    return (
        <VStack space={2} width={"90%"}
            style={{ paddingHorizontal: 2 }}>
            {/* Title */}
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 16,
            }}>Payment Plans</Text>

            <HStack space={2}>
                <PaymentHeaderItem flag={flagLs[0].flag} onPress={() => toggleFlag(flagLs[0])} title={"Free"} price={`0${(0).toFixed(2)}`} description={`RM ${(0).toFixed(2)} billed annually`} />
                <PaymentHeaderItem flag={flagLs[1].flag} onPress={() => toggleFlag(flagLs[1])} title={"Standard"} price={(29.99).toFixed(2)} description={`RM ${(29.99).toFixed(2)} billed annually`} />
                <PaymentHeaderItem flag={flagLs[2].flag} onPress={() => toggleFlag(flagLs[2])} title={"Premium"} price={(69.99).toFixed(2)} description={`RM ${(69.99).toFixed(2)} billed annually`} />
            </HStack>

        </VStack>
    )
}

function PaymentBodyItem(props) {
    const { data = {}, onPress = () => { } } = props;
    const { title, description, img, flag, pos } = data;

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
                            alt={title}
                        />
                        <VStack px={3} flex={1}
                            space={2}
                            style={{
                                height: 80
                            }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 16,
                            }}>{title}</Text>
                            <Text>{description}</Text>
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

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // TODO: Use API
    const data = [
        {
            "title": "Storage Module",
            "description": "Storage Fee 1 Year Data Keeping",
            "img": "https://i.imgur.com/dQDxXYa.png"
        },
        {
            "title": "Email Module",
            "description": "Archive Report Using Email",
            "img": "https://i.imgur.com/nQCj6ea.png"
        },
        {
            "title": "Real-Time Data Module",
            "description": "Real-Time Data Module",
            "img": "https://i.imgur.com/Y8RQ5pQ.png"
        },
        {
            "title": "User Module",
            "description": "User Module",
            "img": "https://i.imgur.com/q8FTn1s.png"
        }
    ];

    const dataHook = useSubLs(data);
    const [ls, setLs, toggleItem, submitFlag] = dataHook;

    const GoToPayment = () => {
        navigation.navigate("Payment", {
            data: ls.filter(x => x.flag)
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View flex={1} bgColor={"#FFF"}>

                {/* Header */}
                <BcHeader>Email Module</BcHeader>

                <View style={{ height: 10 }} />

                {/* Body */}
                <VStack flexGrow={1} 
                    space={2}
                    alignItems={"center"}>
                    {/* Header */}
                    <PaymentHeader />

                    {/* Body */}
                    <PaymentBody hook={dataHook} />
                </VStack>

                <BcFooter>
                    <PaymentBtn flag={submitFlag} onPress={GoToPayment}>Subscribe Now</PaymentBtn>
                </BcFooter>
            </View>
        </SafeAreaView>
    );
}

export default Index;