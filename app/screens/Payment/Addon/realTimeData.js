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
// #endregion

// #region Components
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
                <BcHeader>User Module</BcHeader>

                <View style={{ height: 10 }} />

                {/* Body */}
                <VStack flexGrow={1} 
                    space={2}
                    alignItems={"center"}>
                    

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