import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, SafeAreaView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcBoxShadow } from "@components";

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

    return [ls, setLs];
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
                    </HStack>
                </BcBoxShadow>
            </TouchableOpacity>
            <View style={{ height: 10 }} />
        </>
    )
}

function PaymentBody(props) {

    const { hook = [] } = props;
    const [ls, setLs] = hook;

    const renderItem = ({ item, index }) => {

        const { goToFunc = () => { } } = item;

        // const onPress = () => toggleItem(item);
        const onPress = () => goToFunc();
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

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const GoToStorage = () => {
        navigation.navigate("PaymentSubscriptionDetail", {
            Detail: {
                Title: "Storage Module",
                Description: "In est fugiat Lorem culpa elit labore elit exercitation. Deserunt elit eu ad aliquip esse eu labore cillum velit. Sit voluptate fugiat veniam Lorem magna ut sit et Lorem enim irure."
            },
            Type: "MSP_SM"
        });
    }
    const GoToEmail = () => {
        navigation.navigate("PaymentSubscriptionDetail", {
            Detail: {
                Title: "Email Module",
                Description: "In est fugiat Lorem culpa elit labore elit exercitation. Deserunt elit eu ad aliquip esse eu labore cillum velit. Sit voluptate fugiat veniam Lorem magna ut sit et Lorem enim irure."
            },
            Type: "MSP_EM"
        });
    }
    const GoToRealTimeData = () => {
        navigation.navigate("PaymentSubscriptionDetail", {
            Detail: {
                Title: "Real-Time Data Module",
                Description: "In est fugiat Lorem culpa elit labore elit exercitation. Deserunt elit eu ad aliquip esse eu labore cillum velit. Sit voluptate fugiat veniam Lorem magna ut sit et Lorem enim irure."
            },
            Type: "MSP_RTM"
        });
    }

    const GoToUser = () => {
        navigation.navigate("PaymentSubscriptionDetail", {
            Detail: {
                Title: "User Module",
                Description: "In est fugiat Lorem culpa elit labore elit exercitation. Deserunt elit eu ad aliquip esse eu labore cillum velit. Sit voluptate fugiat veniam Lorem magna ut sit et Lorem enim irure."
            },
            Type: "MSP_UM"
        });
    }

    // TODO: Use API
    const data = [
        {
            "title": "Storage Module",
            "description": "Storage Fee 1 Year Data Keeping",
            "img": "https://i.imgur.com/dQDxXYa.png",
            goToFunc: GoToStorage,
        },
        {
            "title": "Email Module",
            "description": "Archive Report Using Email",
            "img": "https://i.imgur.com/nQCj6ea.png",
            goToFunc: GoToEmail,
        },
        {
            "title": "Real-Time Data Module",
            "description": "Real-Time Data Module",
            "img": "https://i.imgur.com/Y8RQ5pQ.png",
            goToFunc: GoToRealTimeData,
        },
        {
            "title": "User Module",
            "description": "User Module",
            "img": "https://i.imgur.com/q8FTn1s.png",
            goToFunc: GoToUser,
        }
    ];

    const dataHook = useSubLs(data);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View bgColor={"#FFF"} style={{ flex: 1 }}>

                {/* Header */}
                <BcHeader>Payment Subscription</BcHeader>

                <View style={{ height: 10 }} />

                {/* Body */}
                <VStack flexGrow={1}
                    space={2}
                    alignItems={"center"}>


                    {/* Body */}
                    <PaymentBody hook={dataHook} />
                </VStack>
            </View>
        </SafeAreaView>
    );
}

export default Index;