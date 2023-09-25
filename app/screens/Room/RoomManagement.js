import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, FlatList, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcHeader, BcLoading } from "@components";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { fetchRoomList } from "@api";

// #region Components
function RoomList(props) {

    // #region Props
    const { data = [] } = props;
    const { onItemSelect = () => { } } = props;
    // #endregion

    // #region Render
    const renderItem = ({ item, index }) => {
        const { Title } = item;
        const selectItem = () => onItemSelect(item);
        return (
            <TouchableOpacity onPress={selectItem}>
                <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{ height: 40 }}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18
                    }}>{Title}</Text>
                    <FontAwesome5 name={"angle-right"} color={"#CCC"} size={28} />
                </HStack>
            </TouchableOpacity>
        )
    }
    // #endregion

    if (data.length == 0) {
        return (<></>)
    }

    return (
        <View bgColor={"#FFF"} alignItems={"center"}>
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ width: "90%" }}
            />
        </View>
    )
}

function AddRoom(props) {
    const { onSelect = () => { } } = props;
    return (
        <TouchableOpacity onPress={onSelect}>
            <View
                py={3}
                bgColor={"#fff"}
                alignItems={"center"}>
                <View width={"90%"}>
                    <Text style={[{
                        fontSize: 16,
                        color: "#2898FF",
                        fontFamily: "Roboto-Medium",
                    }]}>Create Room</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
// #endregion

function Index(props) {
    
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Redux
    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);
    // #endregion

    // #region UseState
    const [roomLs, setRoomLs] = useState([]);
    const [loading, setLoading] = useState(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchRoomList({
                param: {
                    UserId: userId,
                    HomeId: homeId
                },
                onSetLoading: setLoading
            })
            .then(data => {
                console.log(data);
                setRoomLs(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`)
            })
        }
    }, [isFocused]);
    // #endregion

    // #region Navigation
    const GoToRoomInfo = (item) => navigation.navigate("RoomInfo", item);
    const GoToAddRoom = (item) => navigation.navigate("AddRoom");
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Room Management</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack space={3}
                            flexGrow={1}>
                            {/* Room List */}
                            <RoomList data={roomLs} onItemSelect={GoToRoomInfo} />

                            {/* Add Room */}
                            {/* <AddRoom onSelect={GoToAddRoom} /> */}
                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 20 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;