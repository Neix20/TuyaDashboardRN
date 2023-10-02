import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcHeader, BcBoxShadow, BcLoading } from "@components";

import { useToggle } from "@hooks";

import { fetchGetRulesListing, fetchDeleteDeviceRules } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function Header(props) {

    const navigation = useNavigation();

    const GoBack = () => navigation.goBack();
    const GoToAddDeviceRule = () => navigation.navigate("AddDeviceRules", props);

    return (
        <BcBoxShadow>
            <View py={2}
                alignItems={"center"} justifyContent={"flex-end"}
                style={{ height: 60, backgroundColor: "#fff" }}>
                {/* Front Layer */}
                <TouchableOpacity onPress={GoBack}
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
                    }}>Device Rules</Text>
                </View>

                <View width={"90%"} alignItems={"flex-end"}>
                    <TouchableOpacity onPress={GoToAddDeviceRule}>
                        <View borderRadius={16} bgColor={"#2898FF"}
                            alignItems={"center"} justifyContent={"center"}
                            style={{ width: 32, height: 32 }}>
                            <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </BcBoxShadow>
    )
}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const device = props.route.params;
    const { Id: deviceId } = device;

    const userId = useSelector(Selectors.userIdSelect);

    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [refresh, setRefresh, toggleRefresh] = useToggle(false);

    const [data, setData] = useState([]);

    useEffect(() => {
        if (isFocused) {
            setLoading(true);

            fetchGetRulesListing({
                param: {
                    UserId: userId,
                    DeviceId: deviceId
                },
                onSetLoading: setLoading
            })
                .then(data => {
                    setData(data)
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`)
                })
        }

    }, [isFocused, refresh]);

    const deleteRules = (item) => {
        const { Id } = item;
        fetchDeleteDeviceRules({
            param: {
                UserId: userId,
                DeviceRulesId: Id
            },
            onSetLoading: setLoading
        })
            .then(data => {
                toggleRefresh();
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`)
            })
    }

    const renderItem = (item, index) => {
        const { Title } = item;
        const onSelectDelete = () => deleteRules(item);
        const onSelect = () => navigation.navigate("UpdateDeviceRules", item);
        return (
            <TouchableOpacity onPress={onSelect} style={{ width: "90%"}}>
                <HStack alignItems={"center"} justifyContent={"space-between"}>
                    <View>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18
                        }}>{Title}</Text>
                    </View>
                    <TouchableOpacity onPress={onSelectDelete}>
                        <View borderRadius={16} bgColor={"#F00"}
                            alignItems={"center"} justifyContent={"center"}
                            style={{ width: 32, height: 32 }}>
                            <FontAwesome name={"minus"} size={16} color={"#FFF"} />
                        </View>
                    </TouchableOpacity>
                </HStack>
                <Divider my={3} />
            </TouchableOpacity>
        )
    }

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <Header {...device} />

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack flexGrow={1}
                            py={3} bgColor={"#FFF"}
                            alignItems={"center"}>
                            {
                                data.map(renderItem)
                            }
                        </VStack>
                    </ScrollView>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;