import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";


import { Logger, Utility } from "@utility";

import { Images } from "@config";

import { BcHeader, BcLoading, BcBoxShadow } from "@components";

import { fetchHomeInfo, fetchDeleteHome } from "@api";

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

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { UpdateHome = -1 } = subUserAccess;

    return (
        <BcBoxShadow>
            <View
                p={2}
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
                style={{
                    height: 60,
                    backgroundColor: "#fff",
                }}>
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

                {
                    (UpdateHome == 1) ? (
                        <TouchableOpacity>
                            <Text style={{
                                fontSize: 20,
                                color: "#2898FF"
                            }}>Save</Text>
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )
                }
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

function InfoRoom(props) {

    const { Title, Value, onSelect = () => { } } = props;
    return (
        <TouchableOpacity onPress={onSelect}>
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
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18
                    }}>{Value}</Text>
                </View>
            </HStack>
        </TouchableOpacity>
    )
}

function InfoPanel(props) {

    // #region Props
    const { Name, RoomCount } = props;
    const { onRoomManagement = () => { } } = props;
    // #endregion

    return (
        <View alignItems={"center"}
            bgColor={"#FFF"}>
            <InfoItem Title={"Name"} Value={Name} />
            <InfoRoom Title={"Rooms"} Value={RoomCount} onSelect={onRoomManagement} />
            {/* <InfoItem Title={"Location"} Value={Address} /> */}
        </View>
    )
}

function AddRoom(props) {
    return (
        <TouchableOpacity {...props}>
            <View py={3}
                alignItems={"center"}
                bgColor={"#FFF"}>
                <View width={"90%"}>
                    <Text style={{
                        fontSize: 16,
                        color: "#2898FF",
                        fontFamily: "Roboto-Medium",
                    }}>Add Room</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function DeleteHome(props) {
    return (
        <TouchableOpacity {...props}>
            <View py={3}
                alignItems={"center"}
                bgColor={"#FFF"}>
                <Text style={{
                    fontSize: 16,
                    color: "#F00",
                    fontFamily: "Roboto-Medium",
                }}>Delete Home</Text>
            </View>
        </TouchableOpacity>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);

    // #region Props
    const data = props.route.params;
    const { Id: homeId } = data;
    // #endregion

    // #region UseState
    const [home, setHome] = useState({});
    const [loading, setLoading] = useState(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchHomeInfo({
                param: {
                    UserId: userId,
                    HomeId: homeId
                },
                onSetLoading: setLoading
            })
                .then(data => {
                    setHome(data)
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [isFocused]);
    // #endregion

    // #region Navigation
    const GoToAddRoom = () => navigation.navigate("AddRoom");
    const GoToRoomManagement = () => navigation.navigate("RoomManagement");
    // #endregion

    // #region Helper
    const onAddRoom = () => {
        dispatch(Actions.onChangeHomeId(homeId));
        GoToAddRoom();
    }

    const onDeleteRoom = () => {
        setLoading(true);
        fetchDeleteHome({
            param: {
                UserId: userId,
                HomeId: homeId
            },
            onSetLoading: setLoading,
        })
            .then(data => {
                // setLoading(false);
                toast.show({
                    description: "Successfully Deleted Home!"
                })

                navigation.navigate("HomeManagement");
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <Header>Home Settings</Header>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack space={3}
                            flexGrow={1}>
                            {/* Info */}
                            <InfoPanel onRoomManagement={GoToRoomManagement} {...home} />

                            {/* Add Room */}
                            {/* <AddRoom onPress={onAddRoom} /> */}

                            {/* Delete Home */}
                            {/* <DeleteHome onPress={onDeleteRoom} /> */}
                        </VStack>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;