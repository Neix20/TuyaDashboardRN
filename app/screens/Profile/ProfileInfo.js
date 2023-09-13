import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { fetchProfileInfo } from "@api";

import { BcLoading, BcBoxShadow } from "@components";

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
                <TouchableOpacity>
                    <Text style={{
                        fontSize: 20,
                        color: "#2898FF"
                    }}>Save</Text>
                </TouchableOpacity>
            </View>
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
                <TextInput
                    defaultValue={Value}
                    onChangeValue={onChangeValue}
                    placeholder={"Home Name"}
                    autoCapitalize={"none"}
                    style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: "#000",
                    }} />
            </View>
        </HStack>
    )
}

function InfoPassword(props) {
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
                <TextInput
                secureTextEntry
                    defaultValue={Value}
                    onChangeValue={onChangeValue}
                    placeholder={""}
                    autoCapitalize={"none"}
                    style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: "#000",
                    }} />
            </View>
        </HStack>
    )
}

function InfoPanel(props) {

    const { Username, Password, MobileNo, Email, Address } = props;

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"}
                alignItems={"center"}>
                <InfoItem Title={"Name"} Value={Username} />
                <InfoPassword Title={"Password"} Value={Password} />
                <InfoItem Title={"MobileNo"} Value={MobileNo} />
                <InfoItem Title={"Email"} Value={Email} />
                <InfoItem Title={"Address"} Value={Address} />
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

    // #region UseState
    const [profileInfo, setProfileInfo] = useState({});
    const [loading, setLoading] = useState(false);
    // #endregion

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchProfileInfo({
                param: {
                    UserId: userId,
                },
                onSetLoading: setLoading,
            })
                .then(data => {
                    setProfileInfo(data)
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [userId]);

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <Header>Profile Info</Header>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1}>
                            <InfoPanel {...profileInfo} />
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    {/* <View style={{ height: 60 }} /> */}
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;