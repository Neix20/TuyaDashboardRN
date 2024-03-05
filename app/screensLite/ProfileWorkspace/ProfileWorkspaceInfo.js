import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Images, Svg } from "@config";
import { Logger, Utility } from "@utility";

import { BcHeaderWithAdd, BcLoading, BcBoxShadow, BcTooltip, BcSvgIcon } from "@components";
import { fetchDeviceByProfileWorkspace, fetchToggleDeviceListing } from "@api";

import { useToggle } from "@hooks";
import { ProfileWsData as TestData } from "./data";

import { Actions, Selectors } from '@redux';
import { useDispatch, useSelector } from 'react-redux';

import { CheckBox } from "@rneui/base";

// #region Custom Hook
function useLs(val = []) {

    const [data, setData] = useState(val);

    const updateLs = (arr = []) => {
        if (arr.length > 0) {

            arr = arr.map((obj, pos) => {

                const { DeviceImg = "https://i.imgur.com/Du4wGXQ.jpg", Id = -1, Status } = obj;

                const flag = Status == 1;

                return {
                    ...obj,
                    img: { uri: DeviceImg },
                    pos,
                    flag,
                }
            });

            setData(_ => arr);
        }
    }

    const toggleFlag = (item) => {
        const { pos, flag } = item;
        let arr = [...data];

        arr[pos].flag = !flag;

        setData(_ => arr);
    }

    const addFlag = data.filter(x => x.flag).length > 0;

    return [data, updateLs, toggleFlag, addFlag];
}
// #endregion

// #region Components
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
                <FontAwesome5 name={"tools"} color={"#e6e6e6"} size={80} />
                <Text style={style.txt}>No Devices Yet</Text>
            </VStack>
        </View>
    )
}

function BodyItem(props) {
    const { data = {}, onPress = () => { } } = props;

    const { Title, img, flag = true, Online_Status = 0, HomeName = "" } = data;
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
        home: {
            fontFamily: "Roboto-Bold",
            fontSize: 14,
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

    const borderColor = "#FFF";

    return (
        <TouchableOpacity onPress={onPress}>
            <BcBoxShadow style={{ borderRadius, width: "100%" }}>
                {/* Front Layer */}
                <HStack
                    bgColor={"#FFF"} borderRadius={borderRadius}
                    borderColor={borderColor} borderWidth={2}
                    alignItems={"center"}>
                    <Image source={img} alt={Title} style={style.icon} />
                    <VStack flex={1} px={3} py={2}
                        justifyContent={"space-between"}
                        style={{ height: 100 }}>
                        <VStack space={2}>
                            <Text style={style.title}>{Title}</Text>
                            <Text style={style.home}>{HomeName}</Text>
                            {/* <Text>{Description}</Text> */}
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'Roboto-Bold',
                                color: (Online_Status === 1) ? "#0F0" : "#F00",
                            }}>
                                {Online_Status === 1 ? "Online" : "Offline"}
                            </Text>
                        </VStack>
                    </VStack>
                    <CheckBox
                        containerStyle={{
                            paddingHorizontal: 5,
                            paddingVertical: 0,
                        }}
                        iconType={"material-community"}
                        checkedIcon={"checkbox-marked"}
                        uncheckedIcon={"checkbox-blank-outline"}
                        // onPress={onSelect}
                        checked={flag} />
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

    const tutorial = useSelector(Selectors.tutorialSelect);

    const toast = useToast();
    const navigation = useNavigation();

    const renderItem = ({ item, index }) => {
        const onSelect = () => {
            onSelectItem(item);
            const { Title = "", flag = false } = item;

            const msg = (flag) ? `Device ${Title} is added to workspace!` : `Device ${Title} is removed from workspace!`
            if (tutorial) {
                toast.show({ description: msg })
            }
        }
        return (<BodyItem key={index} data={item} onPress={onSelect} />)
    }

    return (
        <VStack flex={1} py={3} space={2}
            bgColor={"#FFF"} alignItems={"center"}>
            {/* <View width={"90%"} style={{ paddingHorizontal: 2 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                }}>Active Profiles</Text>
            </View> */}
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ width: "90%" }}
                contentContainerStyle={{ padding: 2 }}
                ItemSeparatorComponent={<View style={{ height: 10 }} />} />
        </VStack>
    );
}

function TutorialBtn(props) {

    const navigation = useNavigation();

    const dispatch = useDispatch();
    const tutorial = useSelector(Selectors.tutorialSelect);

    if (!tutorial) {
        return (<></>);
    }

    const style = {
        main: {
            position: "absolute",
            zIndex: 1,
            bottom: 10,
            right: 0, left: 0
        },
        btnTxt: {
            fontSize: 16,
            fontWeight: "bold",
            color: "#FFF"
        }
    }

    const completeTutorial = () => {
        // Update Tutorial
        dispatch(Actions.onChangeTutorial(false));

        navigation.navigate("TabNavigation", {
            screen: "Dashboard"
        });
    } 

    return (
        <View alignItems={"center"} style={style.main}>
            <TouchableOpacity onPress={completeTutorial} style={{ width: "50%", height: 40 }}>
                <View flex={1} backgroundColor={require("@utility").Utility.getColor()} borderRadius={12}
                    alignItems={"center"} justifyContent={"center"}>
                    <Text style={style.btnTxt}>Complete Tutorial</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}
// #endregion

// #region Info Tooltip
function InfoTooltip(props) {

    const { hook = [] } = props;

    const style = {
        hyperlink: {
            textDecorationLine: "underline",
            fontFamily: "Roboto-Medium",
            color: "#3366CC"
        },
        txt: {
            fontFamily: "Roboto-Medium",
            fontSize: 14,
            color: "#484848",
            textAlign: "justify"
        }
    }

    return (
        <VStack>
            <Text style={style.txt}>1. Add Device to Workspace by Pressing on the Device</Text>
            <Text style={style.txt}>2. Devices added to workspace will have a blue checkmark beside it.</Text>
        </VStack>
    )
}

function InfoIcon(props) {

    const tutorial = useSelector(Selectors.tutorialSelect);
    const openHook = useToggle(tutorial);

    return (
        <BcTooltip hook={openHook}
            placement={"bottom"} bgColor={"#FFF"}
            modalBgColor={"rgba(0, 0, 0, 0.25)"}
            borderWidth={0}
            content={<InfoTooltip hook={openHook} />}>
            <BcSvgIcon name={"InfoIcon"} size={24} />
        </BcTooltip>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [devLs, setDevLs, toggleDevFlag, addFlag] = useLs([]);

    const loadingHook = useToggle(false);
    const [loading, setLoading, toggleLoading] = loadingHook;

    const [refresh, setRefresh, toggleRefresh] = useToggle();

    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);

    const { Id: ProfileWorkspaceId = -1 } = props.route.params;
    // const ProfileWorkspaceId = -1;

    useEffect(() => {
        if (isFocused) {
            GetProfileWsDevice();
        }
    }, [isFocused, refresh]);

    // #region Api
    const GetProfileWsDevice = () => {
        setLoading(true);
        fetchDeviceByProfileWorkspace({
            param: {
                UserId: userId,
                ProfileWorkspaceId,
                HomeId: userId
            },
            onSetLoading: setLoading
        })
            .then(data => {
                setDevLs(data);
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
            })
    }

    const ToggleDeviceListing = (t_devLs) => {

        setLoading(true);
        fetchToggleDeviceListing({
            param: {
                UserId: userId,
                ProfileWorkspaceId,
                DeviceLs: t_devLs
            },
            onSetLoading: setLoading
        })
            .then(data => {
                toggleRefresh()
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
            })
    }
    // #endregion

    const onSelectDevice = (item) => {

        toggleDevFlag(item);

        setTimeout(() => {
            const t_devLs = [{
                Id: item.Id,
                Status: item.flag ? 1 : 0
            }]

            ToggleDeviceListing(t_devLs)
        }, 500);
    }

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeaderWithAdd Right={<InfoIcon />}>Device List</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <Body data={devLs} onSelectItem={onSelectDevice} />
                </View>
            </SafeAreaView>
            <TutorialBtn />
        </>
    );
}

export default Index;