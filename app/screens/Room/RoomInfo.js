import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcHeader, BcBoxShadow, BcLoading } from "@components";

import { fetchRoomInfo } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Components
function RoomInfo(props) {

    const { Name } = props;

    return (
        <View alignItems={"center"}
            bgColor={"#FFF"}>
            <HStack width={"90%"}
                alignItems={"center"}
                justifyContent={"space-between"}
                style={{ height: 40 }}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18
                }}>Name: </Text>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18,
                    color: "#CCC"
                }}>{Name}</Text>
            </HStack>
        </View>
    )
}

function DeleteRoom(props) {
    return (
        <TouchableOpacity>
            <View py={3}
                alignItems={"center"}
                bgColor={"#FFF"}>
                <Text style={{
                    fontSize: 16,
                    color: "#F00",
                    fontFamily: "Roboto-Medium",
                }}>Delete Room</Text>
            </View>
        </TouchableOpacity>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const userId = useSelector(Selectors.userIdSelect);

    // #region Props
    const data = props.route.params;
    const { Id: roomId } = data;
    // #endregion

    // #region UseState
    const [room, setRoom] = useState({})
    const [loading, setLoading] = useState(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchRoomInfo({
                param: {
                    UserId: userId,
                    RoomId: roomId
                },
                onSetLoading: setLoading
            })
            .then(data => {
                setRoom(data);
            })
            .catch(err => {
                setLoading(false)
                console.log(`Error: ${err}`);
            })
        }
    }, [isFocused]);
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Room Info</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack space={3} flexGrow={1}>
                            {/* Room Info */}
                            <RoomInfo {...room} />

                            {/* Delete Room */}
                            <DeleteRoom />
                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;