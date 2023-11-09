import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, FlatList, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeaderWithAdd, BcLoading, BcBoxShadow, BcDisable } from "@components";

import { fetchSubUserList } from "@api";
import { useToggle } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { SubUserData } from "@config";

// #region Components
function EmptyList(props) {
    return (
        <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <FontAwesome5 name={"users"} color={"#e6e6e6"} size={80} />
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18,
                    color: "#d3d3d3",
                    textAlign: "center",
                    fontWeight: "700"
                }}>
                    Tap "+" to add new members to manage your home
                </Text>
            </VStack>
        </View>
    )
}

function SubUserList(props) {

    const navigation = useNavigation();

    const { data = [] } = props;

    if (data.length <= 0) {
        return (
            <EmptyList />
        )
    }

    const renderItem = ({ item, index }) => {
        const { Email = "" } = item;

        const GoToInfo = () => navigation.navigate("SubUserInfo", item);

        return (
            <TouchableOpacity key={index} onPress={GoToInfo}>
                <HStack alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{ height: 60 }}>
                    {/* Btn */}
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18
                    }}>{Email}</Text>

                    {/* Angle-Right */}
                    <FontAwesome name={"angle-right"} color={"#000"} size={32} />
                </HStack>
            </TouchableOpacity>
        )
    }

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            style={{ width: "90%" }}
        />
    )
}
// #endregion

function HeaderRight() {
    return (
        <View bgColor={"#2898FF"} borderRadius={20}
            alignItems={"center"} justifyContent={"center"}
            style={{ width: 32, height: 32 }}>
            <FontAwesome name={"plus"} size={16} color={"#FFF"} />
        </View>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);

    const [subUserLs, setSubUserLs] = useState([]);
    const [loading, setLoading, toggleLoading] = useToggle(false);

    const GoToAddSubUser = () => navigation.navigate("AddSubUser");

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchSubUserList({
                param: {
                    UserId: userId
                },
                onSetLoading: setLoading
            })
                .then(data => {
                    setSubUserLs(data);
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
                    <BcHeaderWithAdd flag={true} onSelect={GoToAddSubUser} RightChild={HeaderRight}>Member List</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1} bgColor={"#FFF"} alignItems={"center"}>
                            <SubUserList data={subUserLs} />
                        </View>
                    </ScrollView>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;