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

import { BcHeader, BcLoading, BcBoxShadow } from "@components";

import { fetchHomeInfo } from "@api";

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

function HomeInfo(props) {

    // #region Props
    const { Name, Address } = props;
    // #endregion

    return (
        <View alignItems={"center"}
            bgColor={"#FFF"}>
            <HStack width={"90%"}
                alignItems={"center"}
                style={{ height: 48 }}>
                <View flex={.3}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18
                    }}>Name: </Text>
                </View>
                <View flex={.7}>
                    <TextInput
                        defaultValue={Name}
                        placeholder={"Home Name"}
                        autoCapitalize={"none"}
                        style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#000",
                        }} />
                </View>
            </HStack>

            <HStack width={"90%"}
                alignItems={"center"}
                style={{ height: 48 }}>
                <View flex={.3}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18
                    }}>Rooms: </Text>
                </View>
                <View flex={.7}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: "#CCC"
                    }}>{null}</Text>
                </View>
            </HStack>

            <HStack width={"90%"}
                alignItems={"center"}
                style={{ height: 48 }}>
                <View flex={.3}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18
                    }}>Location: </Text>
                </View>
                <View flex={.7}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18,
                        color: "#CCC"
                    }}>{Address}</Text>
                </View>
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
                    <Header>Home Settings</Header>

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