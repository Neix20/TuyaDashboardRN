import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { BcHeader, BcLoading, BcBoxShadow, BcSvgIcon, BcUserStatus } from "@components";
import { DisableDevice, DisableDeviceScreen, DisableDeviceItem } from "@componentsLite";

import { fetchProfileWorkspace } from "@api";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { useToggle } from "@hooks";
import { ProfileWsData as TestData } from "./data";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Custom Hook
function useProfileWs(val = []) {

    const [data, setData] = useState(val);

    const updateLs = (arr = []) => {
        if (arr.length > 0) {

            arr = arr.filter(x => x.Code !== "PFWS0001");

            arr = arr.map((obj, pos) => {

                const { Image = "https://i.imgur.com/Du4wGXQ.jpg", Id = -1 } = obj;

                const flag = false;

                return {
                    ...obj,
                    img: { uri: Image },
                    pos,
                    flag,
                }
            });

            setData(_ => arr);
        }
    }

    const toggleFlag = (pos) => {
        let arr = [...data];

        // Set All Flag as False
        for (let ind in arr) {
            arr[ind].flag = false;
        }

        arr[pos].flag = true;

        setData(_ => arr);
    }

    return [data, updateLs, toggleFlag];
}
// #endregion

// #region Components
function Header(props) {

    const { flag = false } = props;

    const toast = useToast();

    const onSelectAdd = () => {
        toast.show({
            description: "Work in progress"
        })
    }

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"}
                alignItems={"center"}
                justifyContent={"center"}
                style={{ height: 60 }}>
                <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{ width: "90%" }}>

                    {/* Logo */}
                    <HStack alignItems={"center"} space={3}>
                        {/* <BcYatuHome /> */}
                        <BcSvgIcon name={"YatuLite"} size={80} color={Utility.getColor()} />
                        <BcUserStatus />
                    </HStack>

                    {
                        (flag) ? (
                            <TouchableOpacity onPress={onSelectAdd}>
                                <View borderRadius={20}
                                    bgColor={Utility.getColor()}
                                    alignItems={"center"} justifyContent={"center"}
                                    style={{ width: 32, height: 32 }}>
                                    <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <></>
                        )
                    }
                </HStack>
            </View>
        </BcBoxShadow>
    )
}

function EmptyList(props) {

    const style = {
        txt: {
            fontSize: 18,
            color: "#d3d3d3",
            fontFamily: 'Roboto-Medium',
            fontWeight: "700"
        }
    }

    return (
        <View flexGrow={1} bgColor={"#FFF"}
            justifyContent={"center"} alignItems={"center"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <Ionicons name={"settings-sharp"} color={"#e6e6e6"} size={80} />
                <Text style={style.txt}>No Purchases Yet</Text>
            </VStack>
        </View>
    )
}

function BodyItem(props) {
    const { data = {}, onPress = () => { } } = props;

    const { Name, Description, img, flag = true } = data;
    const { InitialDate = "", ExpiryDate = "" } = data;

    const borderRadius = 8;

    const style = {
        icon: {
            height: 100,
            width: 100,
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
        },
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 16,
        },
        date: {
            fontFamily: "Roboto-Bold",
            fontSize: 14
        },
        frontLayer: {
            position: "absolute",
            zIndex: 2,
            top: 5,
            right: 5
        }
    };

    const borderColor = flag ? "#39B54A" : "#FFF";

    return (
        <TouchableOpacity onPress={onPress}>
            <BcBoxShadow style={{ borderRadius, width: "100%" }}>
                {/* Front Layer */}
                {flag ? (
                    <View style={style.frontLayer}>
                        <FontAwesome name={"check-circle"} size={24} color={"#39B54A"} />
                    </View>
                ) : (
                    <></>
                )}
                <HStack
                    bgColor={"#FFF"} borderRadius={borderRadius}
                    borderColor={borderColor} borderWidth={2}
                    alignItems={"center"}>
                    <Image source={img} alt={Name} style={style.icon} />
                    <VStack flex={1} px={3} py={2}
                        justifyContent={"space-between"}
                        style={{ height: 100 }}>
                        <VStack space={2}>
                            <Text style={style.title}>{Name}</Text>
                            <Text>{Description}</Text>
                        </VStack>
                        {/* <HStack alignItems={"center"}
                            justifyContent={"space-between"}>
                            <Text style={style.date}>Expiry Date: </Text>
                            <Text style={style.date}>{Utility.formatDt(ExpiryDate, "yyyy-MM-dd")}</Text>
                        </HStack> */}
                    </VStack>
                </HStack>
            </BcBoxShadow>
        </TouchableOpacity>
    )
}

function Body(props) {

    const { data = [], onSelectItem = () => { } } = props;

    if (data.length == 0) {
        return (<EmptyList />);
    }

    const toast = useToast();
    const navigation = useNavigation();

    const renderItem = ({ item, index }) => {
        const onSelect = () => {
            onSelectItem(item);
        }
        return (<BodyItem key={index} data={item} onPress={onSelect} />)
    }

    return (
        <VStack flex={1} py={3} space={2}
            bgColor={"#FFF"} alignItems={"center"}>
            <View width={"90%"} style={{ paddingHorizontal: 2 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                }}>Active Profiles</Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ width: "90%" }}
                contentContainerStyle={{ padding: 2 }}
                ItemSeparatorComponent={<View style={{ height: 10 }} />} />
        </VStack>
    );
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [profileWsLs, setProfileWsLs, toggleProfileWsFlag] = useProfileWs(2);
    const loadingHook = useToggle(false);
    const [loading, setLoading, toggleLoading] = loadingHook;

    const userId = useSelector(Selectors.userIdSelect);

    useEffect(() => {
        if (isFocused) {
            GetProfileWorkspaceData();
        }
    }, [isFocused]);

    // #region Api
    const GetProfileWorkspaceData = () => {
        setLoading(true);
        fetchProfileWorkspace({
            param: {
                UserId: userId
            },
            onSetLoading: setLoading
        })
            .then(data => {
                setProfileWsLs(data);
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
            })
    }

    const SelectProfileWorkspace = (item) => {
        navigation.navigate("ProfileWorkspaceInfo", item);

    }
    // #endregion

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { DeviceQty = 0 } = subUserAccess;

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    {/* <BcHeader>Profiles Workspace</BcHeader> */}
                    <Header />

                    <View style={{ height: 10 }} />

                    <DisableDevice flag={DeviceQty == 0} placeholder={<DisableDeviceScreen />}>
                        {/* Body */}
                        <Body
                            data={profileWsLs}
                            onSelectItem={SelectProfileWorkspace} />
                    </DisableDevice>

                    <View style={{ height: 70 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;