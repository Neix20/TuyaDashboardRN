import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcBoxShadow, BcLoading } from "@components";

import { fetchDeviceInfo } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Components
function Header(props) {

    const { children, onBack = () => { } } = props;

    const navigation = useNavigation();

    const toast = useToast();

    // #region Helper Functions
    const GoBack = () => {
        onBack();
        navigation.goBack();
    }
    // #endregion

    return (
        <BcBoxShadow>
            <View p={2}
                bgColor={"#FFF"}
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
                style={{ height: 60 }}>
                {/* Front Layer */}
                <TouchableOpacity
                    onPress={GoBack}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: 120,
                        height: 120,
                        position: "absolute",
                        left: -30,
                        top: -19,
                        zIndex: 1,
                    }}>
                    <FontAwesome5 name={"chevron-left"} size={20} color={"#2898FF"} />
                </TouchableOpacity>
                <View style={{
                    position: "absolute",
                    height: 120,
                    left: 45,
                    top: -20,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#000",
                    }}>{children}</Text>
                </View>
            </View>
        </BcBoxShadow>
    )
}

function DevicePhoto(props) {
    const { Title, img } = props;
    return (
        <BcBoxShadow>
            <VStack py={2}
                bgColor={"#FFF"}
                alignItems={"center"}>
                {/* Profile Picture */}
                <View >
                    {/* Front Layer */}
                    <View
                        style={{
                            position: "absolute",
                            display: "none",
                            zIndex: 1,
                            bottom: -5,
                            right: -5,
                        }}>
                    </View>
                    <Image
                        source={img}
                        style={{
                            width: 200,
                            height: 200,
                            borderRadius: 100,
                        }}
                        alt={Title} />
                </View>

            </VStack>
        </BcBoxShadow>
    )
}

function InfoItem(props) {

    const { Title, Value, onChangeValue = () => { } } = props;
    return (
        <HStack width={"90%"}
            alignItems={"center"}
            style={{ height: 48 }}>
            <View flex={.3}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18
                }}>{Title}: </Text>
            </View>
            <View flex={.7}>
                {/* <TextInput
                    defaultValue={Value}
                    onChangeValue={onChangeValue}
                    placeholder={""}
                    autoCapitalize={"none"}
                    style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: "#000",
                    }} /> */}
                <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: "#000",
                    }}>{Value}</Text>
            </View>
        </HStack>
    )
}

function InfoPanel(props) {

    const { Title, Tuya_Id, Ip_Addr, Timezone } = props;

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"}
                alignItems={"center"}>
                <InfoItem Title={"Name"} Value={Title} />
                <InfoItem Title={"Device Id"} Value={Tuya_Id} />
                <InfoItem Title={"Ip Address"} Value={Ip_Addr} />
                <InfoItem Title={"Timezone"} Value={Timezone} />
            </View>
        </BcBoxShadow>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const userId = useSelector(Selectors.userIdSelect);

    // #region Props
    const { Id: deviceId = -1 } = props.route.params;
    // #endregion

    // #region UseState
    const [deviceInfo, setDeviceInfo] = useState({});
    const [loading, setLoading] = useState(false);
    // #endregion

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchDeviceInfo({
                param: {
                    UserId: userId,
                    DeviceId: deviceId,
                },
                onSetLoading: setLoading,
            })
                .then(data => {
                    console.log(data);
                    setDeviceInfo(data)
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [deviceId]);

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <Header>Device Info</Header>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack space={3} flexGrow={1}>
                            <DevicePhoto {...deviceInfo} />
                            <InfoPanel {...deviceInfo} />
                        </VStack>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;