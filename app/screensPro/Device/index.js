import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, FlatList, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { BcBoxShadow, BcLoading, BcPhotoGalleryModal, BcSvgIcon } from "@components";
import { Images } from "@config";

import Modal from "react-native-modal";

import { fetchDeviceByUserII, fetchToggleFavoriteDevice } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useToggle } from "@hooks";

import { CheckBox } from "@rneui/base";
import { UserDeviceIIData } from "./data";

// #region Custom Hooks
function useDeviceLs(val = []) {
    const [data, setData] = useState(val);

    const updateData = (arr = []) => {
        arr = arr.map((obj, pos) => ({
            ...obj,
            pos,
            flag: obj.Status == 1,
            pwsFlag: obj.ProfileWorkspaceStatus == 1,
            img: { uri: obj.DeviceImg }
        }));

        setData(_ => arr);
    }

    const toggleFlag = (item) => {
        const { pos, flag = false } = item;

        let arr = [...data];
        arr[pos].flag = !flag;

        setData(arr);
    }

    const addToFavorite = (item) => {
        const { pos, pwsFlag = false } = item;

        let arr = [...data];
        arr[pos].pwsFlag = !pwsFlag;

        setData(arr);
    }

    return [data, updateData, toggleFlag, addToFavorite];
}

function useViewMode(val = "List") {
    const [viewMode, setViewMode] = useState(val);

    const toggleViewMode = () => {
        setViewMode(_ => "List");
    };

    return [viewMode, toggleViewMode];
}
// #endregion

// #region Tab Detail
function TabDetailModal(props) {

    const navigation = useNavigation();

    const onSelectProfileWorkspace = () => {
        navigation.navigate("ProfileWorkspace");
    }

    // #region Props
    const { showModal, setShowModal = () => { } } = props;
    const { viewMode, toggleViewMode = () => { } } = props;
    // #endregion

    const closeModal = () => setShowModal(false);

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 18
        }
    };

    return (
        <Modal
            isVisible={showModal}
            animationInTiming={1}
            animationOutTiming={1}
            onBackButtonPress={closeModal}
            onBackdropPress={closeModal}
            backdropOpacity={.3}>
            <View py={3} borderRadius={8}
                alignItems={"center"} bgColor={"#FFF"}>
                <TouchableOpacity onPress={onSelectProfileWorkspace} style={{ width: "90%" }}>
                    <HStack alignItems={"center"} style={{ height: 40 }}>
                        <HStack alignItems={"center"} space={3}>
                            <Ionicons name={"settings-sharp"} size={28} />
                            <Text style={style.title}>Profile Workspace</Text>
                        </HStack>
                    </HStack>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

function TabDetail(props) {

    const navigation = useNavigation();

    const { toggleViewMode = () => { } } = props;

    const [showTdModal, setShowTdModal, toggleTabDetail] = useToggle(false);

    const onSelectViewMode = () => {
        toggleViewMode();
        toggleTabDetail();
    }

    const GoToRoomManagement = () => {
        toggleTabDetail();
        navigation.navigate("RoomManagement");
    }

    return (
        <>
            <TabDetailModal {...props}
                toggleViewMode={onSelectViewMode}
                onSelectRoomManagement={GoToRoomManagement}
                showModal={showTdModal} setShowModal={setShowTdModal} />
            <TouchableOpacity onPress={toggleTabDetail}>
                <MaterialCommunityIcons name={"dots-horizontal"} size={32} />
            </TouchableOpacity>
        </>
    )
}
// #endregion

// #region Device
function DeviceItem(props) {

    // #region Props
    const { Title, Online_Status, pwsFlag, img, flag, Status } = props;
    const { onLinkDevice = () => { }, onAddToFavorite = () => { } } = props;
    // #endregion

    const borderRadius = 8;

    const ols = (Online_Status === 1) ? ({ color: "#0F0", term: "Online" }) : ({ color: "#F00", term: "Offline" });
    const pwsColor = pwsFlag ? "#F00" : "#98A0A8";

    const style = {
        img: {
            height: 60,
            width: 60,
        },
        title: {
            fontSize: 14,
            fontFamily: 'Roboto-Bold',
            color: "#000",
        },
        onlineStatus: {
            fontSize: 12,
            fontFamily: 'Roboto-Bold',
            color: ols.color,
        },
        chkBox: {
            paddingHorizontal: 0,
            paddingVertical: 0,
        }
    }

    return (
        <TouchableOpacity onPress={onLinkDevice}>
            <BcBoxShadow style={{ borderRadius, width: "100%" }}>
                <HStack p={2} bgColor={"#FFF"}
                    justifyContent={"space-between"} alignItems={"center"}
                    style={{ borderRadius }}>
                    <VStack space={2}>
                        <Image source={img} style={style.img} resizeMode={"cover"} alt={Title} />
                        <VStack>
                            <Text style={style.title}>{Title}</Text>
                            <Text style={style.onlineStatus}>{ols.term}</Text>
                        </VStack>
                    </VStack>
                    <HStack alignItems={"center"} space={2}>
                        {
                            (Status == 1) ? (
                                <TouchableOpacity onPress={onAddToFavorite}>
                                    <FontAwesome name={"star"} size={24} color={pwsColor} />
                                </TouchableOpacity>
                            ) : (
                                <View style={{ width: 32, height: 32 }} />
                            )
                        }
                        <CheckBox
                            containerStyle={style.chkBox}
                            iconType={"material-community"}
                            checkedIcon={"checkbox-marked"}
                            uncheckedIcon={"checkbox-blank-outline"}
                            checked={flag}
                            checkedColor={"#F00"} />
                    </HStack>
                </HStack>
            </BcBoxShadow>
        </TouchableOpacity>
    )
}

function DeviceLs(props) {
    const { data = [], renderItem = () => { } } = props;

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
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ width: "90%", flex: 1 }}
                contentContainerStyle={style.flatListContainer}
            />
        </View>
    )
}
// #endregion

// #region Components
function Header(props) {
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
                    <BcSvgIcon name={"Yatu"} size={80} color={"#2898FF"} />
                </HStack>
            </View>
        </BcBoxShadow>
    )
}

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
                <FontAwesome name={"plug"} color={"#e6e6e6"} size={80} />
                <Text style={style.txt}>Add Device to Your Dashboard</Text>
            </VStack>
        </View>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Redux
    const lang = "en";

    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);
    // #endregion

    // #region UseState
    const [deviceData, setDeviceData, toggleDeviceFlag, addToFavorite] = useDeviceLs([]);
    
    const [viewMode, toggleViewMode] = useViewMode();
    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [refresh, setRefresh, toggleRefresh] = useToggle(false);
    const [showTGModal, setShowTGModal, toggleTGModal] = useToggle(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            // setDeviceData(UserDeviceIIData);
            GetDeviceByUserII();
        }
    }, [homeId, refresh, isFocused]);

    const GetDeviceByUserII = () => {
        setLoading(true);
        fetchDeviceByUserII({
            param: {
                UserId: userId,
            },
            onSetLoading: setLoading,
        })
            .then(data => {
                setDeviceData(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            });
    }

    const ToggleFavoriteDevice = (item) => {

        const devLs = [{
            Id: item.Id,
            Status: !item.pwsFlag ? 1 : 0
        }];

        setLoading(true);
        fetchToggleFavoriteDevice({
            param: {
                UserId: userId,
                DeviceLs: devLs
            },
            onSetLoading: setLoading,
        })
            .then(data => {
                addToFavorite(item);
                toggleRefresh();
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            });
    }

    const renderDeviceItem = ({ item, index }) => {

        const onLinkDevice = () => {
            toggleDeviceFlag(item);
        };

        const onAddToFavorite = () => {
            ToggleFavoriteDevice(item);
        }

        return (
            <DeviceItem
                key={index}
                onLinkDevice={onLinkDevice}
                onAddToFavorite={onAddToFavorite}
                {...item} />
        )
    }

    // #region Tab Detail
    const images = [
        { uri: Images.LinkDeviceI },
        { uri: Images.LinkDeviceII },
        { uri: Images.LinkDeviceIII },
        { uri: Images.LinkDeviceIV },
        { uri: Images.LinkDeviceV },
    ]

    const updateFirstTimeLink = () => {
        toggleTGModal();
    }
    // #endregion

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
            paddingHorizontal: 0,
        },
        tabDetail: {
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
        }
    }

    return (
        <>
            <BcLoading loading={loading} />
            <BcPhotoGalleryModal showModal={showTGModal} setShowModal={updateFirstTimeLink} images={images} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#FFF"} style={{ flex: 1 }}>

                    {/* Header */}
                    <Header key={refresh} toggleRefresh={toggleRefresh} flag={false} />

                    <View style={{ height: 10 }} />

                    <View style={{ height: 5 }} />

                    <View alignItems={"center"}>
                        <HStack alignItems={"center"} width={"90%"}>
                            <Text style={style.title}>Sync Devices</Text>
                            <View justifyContent={"center"}
                                style={style.tabDetail}>
                                <TabDetail toggleViewMode={toggleViewMode} />
                            </View>
                        </HStack>
                    </View>

                    {/* Body */}
                    <DeviceLs data={deviceData} renderItem={renderDeviceItem} />

                    {/* Footer */}
                    <View style={{ height: 70 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;