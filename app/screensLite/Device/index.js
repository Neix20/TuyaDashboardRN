import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, FlatList, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import Modal from "react-native-modal";

import { Logger, Utility } from "@utility";
import { Images } from "@config";

import { BcBoxShadow, BcLoading, BcPhotoGalleryModal, BcSvgIcon, BcYesNoModal, BcUserStatus } from "@components";
import { DisableDevice, DisableDeviceScreen, DisableDeviceItem } from "@componentsLite";

import { fetchDeviceByUserII, fetchToggleFavoriteDevice, fetchLinkDeviceLite, fetchSubUserAccess } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useDeviceLs } from "./hooks";
import DeviceItem from "./DeviceItem";

import { useToggle } from "@hooks";

// #region Tab Detail
function TabDetailModalItem(props) {
    const { onPress = () => { } } = props;
    const { Btn, btnName = "", title = "" } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 18
        }
    };

    return (
        <TouchableOpacity onPress={onPress} style={{ width: "90%" }}>
            <HStack alignItems={"center"} style={{ height: 40 }}>
                {/* Logo */}
                <HStack alignItems={"center"} space={3}>
                    <Btn name={btnName} size={28} />
                    <Text style={style.title}>{title}</Text>
                </HStack>
            </HStack>
        </TouchableOpacity>
    )
}

function TabDetailModal(props) {

    // #region Props
    const { showModal, setShowModal = () => { } } = props;
    const { navToTempHumd = () => { }, navToSmartPlug = () => { } } = props;
    // #endregion

    const closeModal = () => setShowModal(false);

    const onNavToTempHumd = () => {
        navToTempHumd();
        closeModal();
    }

    const onNavToSmartPlug = () => {
        navToSmartPlug();
        closeModal();
    }

    return (
        <Modal
            isVisible={showModal}
            animationInTiming={1}
            animationOutTiming={1}
            onBackButtonPress={closeModal}
            onBackdropPress={closeModal}
            backdropOpacity={.3}>
            <View py={3} borderRadius={8} alignItems={"center"} bgColor={"#FFF"}>
                <TabDetailModalItem onPress={onNavToTempHumd}
                    Btn={FontAwesome5} btnName={"temperature-low"} title={"Temperature & Humidity"} />
                <TabDetailModalItem onPress={onNavToSmartPlug}
                    Btn={FontAwesome5} btnName={"plug"} title={"Smart Plug"} />
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

// #region Components
function Header(props) {

    const navigation = useNavigation();

    const GoToScanQr = () => {
        navigation.navigate("ScanQr");
    }

    const { flag = false, onSelectAdd = () => { } } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
            color: "#FFF"
        }
    }

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { Email = "", UserStatus = 0 } = subUserAccess;

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
                        <BcSvgIcon name={"Yatu"} size={80} color={"#2898FF"} />
                        <BcUserStatus key={UserStatus} flag={UserStatus == 0} />
                    </HStack>

                    {/* Qr Scanner */}
                    <TouchableOpacity onPress={GoToScanQr}>
                        <View borderRadius={20} bgColor={"#2898FF"}
                            alignItems={"center"} justifyContent={"center"}
                            style={{ height: 40, width: 40 }}>
                            <BcSvgIcon name={"QrScan"} size={28} color={"#FFF"} />
                        </View>
                    </TouchableOpacity>
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

// #region Device
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
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Redux
    const lang = "en";

    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);

    const dispatch = useDispatch();
    // #endregion

    // #region UseState
    const [deviceData, setDeviceData, toggleDeviceFlag, addToFavorite, deviceCount, deviceSession, devicePos] = useDeviceLs([]);

    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [refresh, setRefresh, toggleRefresh] = useToggle(false);
    const [showTGModal, setShowTGModal, toggleTGModal] = useToggle(false);
    const [showLdModal, setShowLdModal, toggleLdModal] = useToggle(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            GetDeviceByUserII();
            RequestAccess(userId);
        }
    }, [homeId, refresh, isFocused]);
    // #endregion

    // #region API List
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

    const LinkDevice = () => {
        setLoading(true);
        fetchLinkDeviceLite({
            param: {
                UserId: userId,
                DeviceLs: deviceData.map(x => ({ Id: x.Id, Status: x.flag ? 1 : 0 }))
            },
            onSetLoading: setLoading
        })
            .then(data => {
                const { ResponseCode = "", ResponseMessage = "" } = data;
                toggleLdModal();
                if (ResponseCode == "00") {
                    toggleRefresh();
                } else {
                    // Pop Up Modal Saying Max Device Limit Reached
                    toast.show({
                        description: ResponseMessage
                    })
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            });
    }

    const RequestAccess = (userId) => {
        fetchSubUserAccess({
            param: {
                UserId: userId
            },
            onSetLoading: () => { },
        })
            .then(data => {
                dispatch(Actions.onChangeSubUserAccess(data));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    // #region Render Item
    const renderDeviceItem = ({ item, index }) => {

        const onLinkDevice = () => {
            toggleDeviceFlag(item);
        };

        const onAddToFavorite = () => {
            ToggleFavoriteDevice(item);

            const { Title = "" } = item;
            toast.show({
                description: `${Title} has been added to favorites!`
            })
        }

        const { DeviceLinkStatus = 0 } = item;

        const flag = DeviceLinkStatus == 0;

        return (
            <DisableDevice flag={flag} placeholder={<DisableDeviceItem />}>
                <DeviceItem key={index}
                    onLinkDevice={onLinkDevice}
                    onAddToFavorite={onAddToFavorite}
                    showFavorite={!flag}
                    showCheckbox={!flag}
                    showOnlineStatus={!flag}
                    {...item} />
            </DisableDevice>
        )
    }
    // #endregion

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

    const navToTempHumd = () => {
        const { tempHumd = 0 } = devicePos;
        machineListView.current.scrollToIndex({
            index: tempHumd,
            animated: true,
        })
    }

    const navToSmartPlug = () => {
        const { smartPlug = 0 } = devicePos;
        machineListView.current.scrollToIndex({
            index: smartPlug,
            animated: true,
        })
    }
    // #endregion

    const machineListView = useRef(null);

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
        },
        syncTitle: {

            fontFamily: "Roboto-Bold",
            fontSize: 18,
            paddingHorizontal: 0,
            color: "#FFF"
        }
    };

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { DeviceQty = 0 } = subUserAccess;

    return (
        <>
            <BcYesNoModal
                showModal={showLdModal} setShowModal={setShowLdModal}
                title={"Link Devices"}
                description={`Are you sure you want to link these devices?\n\nOnce your downloads have completed, a notification will be send out to alert you!`}
                titleYes={"Link"} titleNo={"Cancel"}
                onPressYes={LinkDevice} onPressNo={toggleLdModal}
            />
            <BcLoading loading={loading} />
            <BcPhotoGalleryModal showModal={showTGModal} setShowModal={updateFirstTimeLink} images={images} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#FFF"} style={{ flex: 1 }}>

                    {/* Header */}
                    <Header toggleRefresh={toggleRefresh} flag={deviceSession} onSelectAdd={toggleLdModal} />

                    <View style={{ height: 15 }} />

                    <DisableDevice flag={DeviceQty == 0} placeholder={<DisableDeviceScreen />}>

                        <View alignItems={"center"}>
                            <HStack alignItems={"center"} justifyContent={"space-between"} width={"90%"}>
                                <Text style={style.title}>Sync Devices ({deviceCount}/{DeviceQty})</Text>
                                <HStack alignItems={"center"} space={3}>
                                    {
                                        (deviceSession) ? (
                                            <TouchableOpacity onPress={toggleLdModal}>
                                                <View borderRadius={20} px={3} py={1} bgColor={"#2898FF"}>
                                                    <Text style={style.syncTitle}>Sync Now</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <></>
                                        )
                                    }
                                    <View justifyContent={"center"}>
                                        <TabDetail navToTempHumd={navToTempHumd} navToSmartPlug={navToSmartPlug} />
                                    </View>
                                </HStack>
                            </HStack>
                        </View>

                        {/* Body */}
                        <DeviceLs deviceLsRef={machineListView} data={deviceData} renderItem={renderDeviceItem} />

                        {/* Footer */}
                        <View style={{ height: 70 }} />
                    </DisableDevice>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;