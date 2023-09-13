import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcHeader, BcBoxShadow, BcLoading } from "@components";

import { fetchRoomInfo, fetchDeleteRoom } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Components
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

    const { Title } = props;

    return (
        <View alignItems={"center"}
            bgColor={"#FFF"}>
            <InfoItem Title={"Name"} Value={Title} />
        </View>
    )
}

function DeleteRoom(props) {
    return (
        <TouchableOpacity {...props}>
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

    const onDeleteRoom = () => {
        setLoading(true);
        fetchDeleteRoom({
            param: {
                UserId: userId,
                RoomId: roomId
            },
            onSetLoading: setLoading
        })
        .then(data => {
            // setLoading(false);
            toast.show({
                description: "Successfully Deleted Room!"
            })

            navigation.navigate("RoomManagement");
        })
        .catch(err => {
            setLoading(false);
            console.log(`Error: ${err}`);
        })
    }

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
                            <InfoPanel {...room} />

                            {/* Delete Room */}
                            <DeleteRoom onPress={onDeleteRoom} />
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