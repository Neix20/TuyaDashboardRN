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
function SubUserList(props) {

    const navigation = useNavigation();

    const { data = [] } = props;

    if (data.length <= 0) {
        return (<></>)
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

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);

    const [subUserLs, setSubUserLs] = useState([]);
    const [loading, setLoading, toggleLoading] = useToggle(false);

    const GoToAddSubUser = () => navigation.navigate("AddSubUser");

    // useEffect(() => {
    //     if (isFocused) {
    //         setLoading(true);
    //         fetchSubUserList({
    //             param: {
    //                 UserId: userId,
    //                 HomeId: homeId
    //             },
    //             onSetLoading: setLoading
    //         })
    //         .then(data => {
    //             setSubUserLs(data);
    //         })
    //         .catch(err => {
    //             setLoading(false);
    //             console.log(`Error: ${err}`);
    //         })
    //     }
    // }, [isFocused]);

    useEffect(() => {
        if (isFocused) {
            setSubUserLs(SubUserData);
        }
    }, [isFocused]);

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeaderWithAdd flag={true} onSelect={GoToAddSubUser}>Member List</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View bgColor={"#FFF"} alignItems={"center"}>
                            <SubUserList data={subUserLs} />
                        </View>
                    </ScrollView>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;