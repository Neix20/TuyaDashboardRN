import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import DeviceItem from "./DeviceItem";
import { BcHeader, BcFooter, BcYesNoModal, BcLoading } from "@components";

import { fetchActivateYatuPackage } from "@api";

import { useDeviceLs } from "./hooks";
import { useToggle } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

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

    const deviceData = props.route?.params?.DeviceLs || [];
    const deviceToken = props.route?.params?.Token || "";

    const [deviceLs, setDeviceLs, toggleDeviceFlag, addToFavorite, deviceCount, deviceSession, devicePos] = useDeviceLs([]);
    const [showResModal, setShowResModal, toggleResModal] = useToggle(false);
    const [loading, setLoading, toggleLoading] = useToggle(false);

    const userId = useSelector(Selectors.userIdSelect);

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

    const renderDeviceItem = ({ item, index }) => {
        return (<DeviceItem key={index} showFavorite={false} showCheckbox={false} showOnlineStatus={false} {...item} />)
    };

    const GoToDevice = () => {
        navigation.navigate("TabNavigation", {
            screen: "Device"
        })
    }

    const ActivateYatuPackage = () => {
        setLoading(true);
        fetchActivateYatuPackage({
            param: {
                UserId: userId,
                Token: deviceToken,
                DeviceLs: deviceData
            },
            onSetLoading: setLoading
        })
        .then(data => {
            // toggleResModal();
            GoToDevice();
        }) 
        .catch(err => {
            setLoading(false);
            console.error(err);
        })
    }

    return (
    <>
            <BcYesNoModal showModal={showResModal} setShowModal={setShowResModal}
                title={"Package Activation"}
                titleYes={"Yes"} titleNo={"Cancel"}
                onPressYes={ActivateYatuPackage} onPressNo={toggleResModal}
                description={"Would you like to activate?\n\nOnce activated, you will not be able to undo this action."} />
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Yatu Package</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <DeviceLs data={deviceLs} renderItem={renderDeviceItem} />

                    {/* Footer */}
                    <BcFooter>
                        <TouchableOpacity onPress={ActivateYatuPackage} style={{ width: "80%", height: "60%" }}>
                            <View flex={1} backgroundColor={require("@utility").Utility.getColor()}
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