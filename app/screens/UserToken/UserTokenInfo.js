import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcLoading, BcBoxShadow } from "@components";
import { useToggle } from "@hooks";

import { UserTokenInfo as TestData } from "./data";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { fetchTokenInfo } from "@api";

// #region Custom Hooks
function useInfo() {
    const [data, setData] = useState({});

    const updateData = (data) => {

        const { Image = "" } = data;

        const next_state = {
            ...data,
            img: { uri: Image }
        };

        setData(_ => next_state);
    }

    return [data, updateData];
}
// #endregion

// #region Components
function TopItem(props) {
    const { data = {} } = props;
    
    const { Code: Name, Description, img } = data;

    const borderRadius = 8;

    const style = {
        img: {
            height: 100,
            width: 100,
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
        },
        name: {
            fontFamily: "Roboto-Bold",
            fontSize: 16,
        }
    };

    return (
        <BcBoxShadow style={{ borderRadius, width: "100%" }}>
            <HStack bgColor={"#FFF"}
                borderRadius={borderRadius}
                alignItems={"center"}>
                <Image source={img} style={style.img} alt={Name} />
                <VStack px={3} flex={1}
                    space={2} style={{ height: 80 }}>
                    <Text style={style.name}>{Name}</Text>
                    <Text>{Description}</Text>
                </VStack>
            </HStack>
        </BcBoxShadow>
    )
}

function TopPanel(props) {
    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"} alignItems={"center"} py={3}>
                <View width={"90%"}>
                    <TopItem {...props} />
                </View>
            </View>
        </BcBoxShadow>
    )
}

function InfoItem(props) {
    const { Title, Value } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 18
        },
        value: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: "#000",
        }
    };

    return (
        <HStack width={"90%"} alignItems={"center"}>
            <View flex={.4}>
                <Text style={style.title}>{Title}: </Text>
            </View>
            <View flex={.6} alignItems={"flex-end"}>
                <Text style={style.value}>{Value}</Text>
            </View>
        </HStack>
    )
}

function InfoPanel(props) {

    const { data = {} } = props;
    const { Code = "", InitialDate, ExpiryDate, AutoRenew = 0 } = data;

    const autoRenewal = (AutoRenew == 0) ? "False" : "True";

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
            color: "#000"
        }
    }

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"} alignItems={"center"} pt={3}>
                <View width={"90%"}>
                    <Text style={style.title}>Details</Text>
                </View>
                <Divider bgColor={"#EBEBEB"} my={2} width={"90%"} />

                <InfoItem Title={"Code"} Value={Code} />
                <Divider bgColor={"#EBEBEB"} my={2} width={"90%"} />

                <InfoItem Title={"Auto-Renewal"} Value={autoRenewal} />
                <Divider bgColor={"#EBEBEB"} my={2} width={"90%"} />

                <InfoItem Title={"Date Purchased"} Value={Utility.formatDt(InitialDate, "yyyy-MM-dd")} />
                <Divider bgColor={"#EBEBEB"} my={2} width={"90%"} />

                <InfoItem Title={"Date Expired"} Value={Utility.formatDt(ExpiryDate, "yyyy-MM-dd")} />
                <Divider bgColor={"#EBEBEB"} my={2} width={"90%"} />
            </View>
        </BcBoxShadow>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { Code: Token = "" } = props.route.params;
    console.log(Token);
    // const TokenId = 26;

    const userId = useSelector(Selectors.userIdSelect);

    const [tokenInfo, setTokenInfo] = useInfo();
    const [loading, setLoading, toggleLoading] = useToggle(false);

    useEffect(() => {
        if (isFocused) {
            // setTokenInfo(TestData);
            UserTokenInfo();
        }
    }, [isFocused]);

    // #region API
    const UserTokenInfo = () => {
        setLoading(true);
        fetchTokenInfo({
            param: {
                UserId: 10,
                Token
            },
            onSetLoading: setLoading
        })
        .then(data => {
            setTokenInfo(data)
        })
        .catch(err => {
            setLoading(false);
            console.error(`Error: ${err}`);
        })
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Token Information</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack space={3} flexGrow={1}>
                            <TopPanel data={tokenInfo} />
                            <InfoPanel data={tokenInfo} />
                        </VStack>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;