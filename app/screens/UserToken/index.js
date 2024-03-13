import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcLoading, BcBoxShadow } from "@components";
import { fetchGetUserToken } from "@api";

import { useToggle } from "@hooks";
import { UserTokenData as TestData } from "./data";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Custom Hook
function useLs(val = []) {

    const [data, setData] = useState(val);

    const updateLs = (arr = []) => {
        if (arr.length > 0) {

            arr = arr.map((obj, pos) => {
                const { Image = "https://i.imgur.com/TYUESIY.jpg", Id = -1 } = obj;

                return {
                    ...obj,
                    img: { uri: Image },
                    pos
                }
            });

            setData(_ => arr);
        }
    }

    return [data, updateLs];
}
// #endregion

// #region Components
function EmptyList(props) {

    const style = {
        txt: {
            fontSize: 18,
            color: "#d3d3d3",
            fontFamily: 'Roboto-Medium',
            fontWeight: "700"
        }
    }

    return (
        <View flexGrow={1} bgColor={"#FFF"}
            justifyContent={"center"} alignItems={"center"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <Ionicons name={"settings-sharp"} color={"#e6e6e6"} size={80} />
                <Text style={style.txt}>No Tokens Yet</Text>
            </VStack>
        </View>
    )
}

function BodyItem(props) {
    const { data = {}, onPress = () => { } } = props;

    const { Code: Name = "", Description = "", img } = data;
    const { InitialDate = "", ExpiryDate = "" } = data;

    const borderRadius = 8;

    const style = {
        icon: {
            height: 100,
            width: 100,
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
        },
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 16,
        },
        date: {
            fontFamily: "Roboto-Bold",
            fontSize: 14
        }
    };

    return (
        <TouchableOpacity onPress={onPress}>
            <BcBoxShadow style={{ borderRadius, width: "100%" }}>
                <HStack bgColor={"#FFF"} borderRadius={borderRadius}
                    alignItems={"center"}>
                    <Image source={img} alt={Name} style={style.icon} />
                    <VStack flex={1} px={3} py={2}
                        justifyContent={"space-between"}
                        style={{ height: 100 }}>
                        <VStack space={2}>
                            <Text style={style.title}>{Name}</Text>
                            <Text>{Description}</Text>
                        </VStack>
                        <VStack>
                            {/* <HStack alignItems={"center"} justifyContent={"space-between"}>
                                    <Text style={style.date}>Purchase Date: </Text>
                                    <Text>{Utility.formatDt(InitialDate, "yyyy-MM-dd 00:00")}</Text>
                                </HStack> */}
                            <HStack alignItems={"center"} justifyContent={"space-between"}>
                                <Text style={style.date}>Expiry Date: </Text>
                                <Text>{Utility.formatDt(ExpiryDate, "yyyy-MM-dd")}</Text>
                            </HStack>
                        </VStack>
                    </VStack>
                </HStack>
            </BcBoxShadow>
        </TouchableOpacity>
    )
}

function Body(props) {

    const { data = [] } = props;

    const navigation = useNavigation();
    const toast = useToast();

    const renderItem = ({ item, index }) => {
        const onSelect = () => {
            navigation.navigate("UserTokenInfo", item);
        }
        return <BodyItem key={index} data={item} onPress={onSelect} />
    }

    if (data.length == 0) {
        return (<EmptyList />)
    }

    return (
        <VStack flexGrow={1}
            py={3} space={2}
            bgColor={"#FFF"} alignItems={"center"}>
            <View width={"90%"} style={{ paddingHorizontal: 2 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                }}>Active Tokens</Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ width: "90%" }}
                contentContainerStyle={{ padding: 2 }}
                ItemSeparatorComponent={<View style={{ height: 10 }} />} />
        </VStack>
    );
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [tokenLs, setTokenLs] = useLs([]);
    const [loading, setLoading, toggleLoading] = useToggle(false);

    const userId = useSelector(Selectors.userIdSelect);

    useEffect(() => {
        if (isFocused) {
            GetUserTokenData();
            // setTokenLs(TestData);
        }
    }, [isFocused]);

    // #region Api
    const GetUserTokenData = () => {
        setLoading(true);
        fetchGetUserToken({
            param: {
                UserId: userId
            },
            onSetLoading: setLoading
        })
        .then(data => {
            setTokenLs(data);
        })
        .catch(err => {
            setLoading(false);
            console.error(err);
        })
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Paid Yatu QR</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <Body data={tokenLs} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;