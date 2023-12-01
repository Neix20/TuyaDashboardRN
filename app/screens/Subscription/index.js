import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcLoading, BcBoxShadow } from "@components";

import { fetchSubscriptionOrder } from "@api";

import { useToggle } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function EmptyList(props) {
    return (
        <View flexGrow={1} justifyContent={"center"} alignItems={"center"} bgColor={"#FFF"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <FontAwesome5 name={"tools"} color={"#e6e6e6"} size={80} />
                <Text style={{
                    fontSize: 18,
                    color: "#d3d3d3",
                    fontFamily: 'Roboto-Medium',
                    fontWeight: "700"
                }}>No Purchases Yet</Text>
            </VStack>
        </View>
    )
}

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

    return [ls, setData];
}

function PaymentBodyItem(props) {
    const { data = {}, onPress = () => {} } = props;
    const { Name, Description, img, flag = true } = data;
    const { InitialDate = "", ExpiryDate = "" } = data;

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
                        <VStack px={3} flex={1}
                            space={2} style={{ height: 100 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 16,
                            }}>{Name}</Text>
                            <Text>{Description}</Text>
                            <VStack>
                                <HStack alignItems={"center"} justifyContent={"space-between"}>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 14
                                    }}>Purchase Date: </Text>
                                    <Text>{Utility.formatDt(InitialDate, "yyyy-MM-dd 00:00")}</Text>
                                </HStack>
                                <HStack alignItems={"center"} justifyContent={"space-between"}>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 14
                                    }}>Expiry Date: </Text>
                                    <Text>{Utility.formatDt(ExpiryDate, "yyyy-MM-dd hh:mm")}</Text>
                                </HStack>

                            </VStack>
                        </VStack>
                    </HStack>
                </BcBoxShadow>
            </TouchableOpacity>
            <View style={{ height: 10 }} />
        </>
    )
}

function PaymentBody(props) {
    
    const { data = [] } = props;

    const navigation = useNavigation();

    const renderItem = ({ item, index }) => {
        const onSelect = () => {
            navigation.navigate("SubscriptionInfo", item);
        }
        return <PaymentBodyItem key={index} data={item} onPress={onSelect} />
    }

    if (data.length == 0) {
        return (<EmptyList />)
    }

    return (
        <VStack flex={1} py={3} space={2}
            bgColor={"#FFF"} alignItems={"center"}>
            <View width={"90%"} style={{ paddingHorizontal: 2 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                }}>Active Purchases</Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ width: "90%" }}
                contentContainerStyle={{ padding: 2 }} />
        </VStack>
    );
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading, toggleLoading] = useToggle(false);

    const [ls, setLs] = useSubLs();

    const userId = useSelector(Selectors.userIdSelect);

    useEffect(() => {
        if (isFocused) {
            fetchSubscriptionOrder({
                param: {
                    UserId: userId,
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

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Paid Subscriptions</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    {/* <ScrollView showsVerticalScrollIndicator={false} 
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        
                    </ScrollView> */}

                    <VStack space={3} flexGrow={1}>
                        <PaymentBody data={ls} />
                    </VStack>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;