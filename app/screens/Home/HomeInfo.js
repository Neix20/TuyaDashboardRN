import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";
1
const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { Images } from "@config";

import { BcHeader, BcBoxShadow, BcLoading } from "@components";

import { fetchHomeInfo } from "@api";

// #region Components
function HomeInfo(props) {

    // #region Props
    const { Name, Address } = props;
    // #endregion

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

            <HStack width={"90%"}
                alignItems={"center"}
                justifyContent={"space-between"}
                style={{ height: 40 }}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18
                }}>Rooms: </Text>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18,
                    color: "#CCC"
                }}>{null}</Text>
            </HStack>

            <HStack width={"90%"}
                alignItems={"center"}
                justifyContent={"space-between"}
                style={{ height: 40 }}>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18
                }}>Location: </Text>
                <Text style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 18,
                    color: "#CCC"
                }}>{Address}</Text>
            </HStack>
        </View>
    )
}

function AddRoom(props) {
    return (
        <TouchableOpacity>
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
        <TouchableOpacity>
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

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Home Settings</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack space={3}
                            flexGrow={1}>
                            {/* Info */}
                            <HomeInfo {...home} />

                            <AddRoom />

                            {/* Delete Home */}
                            <DeleteHome />
                        </VStack>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;