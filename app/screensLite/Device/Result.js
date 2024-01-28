import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import DeviceItem from "./DeviceItem";
import { BcHeader, BcFooter, BcYesNoModal } from "@components";

import { useDeviceLs } from "./hooks";
import { useToggle } from "@hooks";

function EmptyList(props) {

    const style = {
        txt: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: "#d3d3d3",
            textAlign: "center",
            fontWeight: "700"
        }
    };

    return (
        <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <FontAwesome5 name={"exclamation-triangle"} color={"#e6e6e6"} size={80} />
                <Text style={style.txt}>Error</Text>
            </VStack>
        </View>
    )
}

function DeviceLs(props) {
    const { deviceLsRef = null, data = [], renderItem = () => { } } = props;

    if (data.length <= 0) {
        return (<EmptyList />);
    }

    const style = {
        flatListContainer: {
            flexDirection: "column",
            flexWrap: "nowrap",
            justifyContent: "flex-start",
            padding: 5,
            rowGap: 8,
            columnGap: 8,
        }
    }

    return (
        <View alignItems={"center"} flexGrow={1}>
            <FlatList ref={deviceLsRef}
                data={data} renderItem={renderItem}
                style={{ width: "90%", flex: 1 }}
                contentContainerStyle={style.flatListContainer}
            />
        </View>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const deviceData = props.route?.params?.data || [];
    const deviceToken = props.route?.params?.token || "";

    const [deviceLs, setDeviceLs, toggleDeviceFlag, addToFavorite, deviceCount, deviceSession, devicePos] = useDeviceLs([]);
    const [showResModal, setShowResModal, toggleResModal] = useToggle(false);

    useEffect(() => {
        if (isFocused) {
            let arr = [...deviceData];

            arr = arr.map(x => ({
                ...x,
                Status: 1,
                Online_Status: 1,
                ProfileWorkspaceStatus: 0,
            }))

            setDeviceLs(arr);
        }
    }, [isFocused]);

    const renderDeviceItem = ({ item, index }) => (<DeviceItem key={index} showFavorite={false} showCheckbox={false} {...item} />);

    const GoToDevice = () => {
        navigation.navigate("TabNavigation", {
            screen: "Device",
            params: {
                qrFlag: true,
                qrToken: deviceToken,
            }
        })
    }

    return (
    <>
            <BcYesNoModal showModal={showResModal} setShowModal={setShowResModal}
                title={"Package Activation"}
                titleYes={"Yes"} titleNo={"Cancel"}
                onPressYes={GoToDevice} onPressNo={toggleResModal}
                description={"Would you like to activate?\n\nOnce activated, you will not be able to undo this action."} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Yatu Package</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <DeviceLs data={deviceLs} renderItem={renderDeviceItem} />

                    {/* Footer */}
                    <BcFooter>
                        <TouchableOpacity onPress={toggleResModal} style={{ width: "80%", height: "60%" }}>
                            <View flex={1} backgroundColor={"#2898FF"}
                                alignItems={"center"} justifyContent={"center"}>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "white",
                                }}>Activate</Text>
                            </View>
                        </TouchableOpacity>
                    </BcFooter>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;