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

import { BcBoxShadow, BcLoading, BcYatuHome, BaseModal, BcPhotoGalleryModal, BcSvgIcon } from "@components";
import { Devices, Images, Animation, clsConst } from "@config";

import TopModal from "@components/Modal/TopModal";
import Modal from "react-native-modal";

import { fetchDeviceList, fetchDeleteDevice, fetchGetLinkedDevice, fetchLinkDevice } from "@api";
import { fetchDeviceListII, fetchDeviceByUserII, fetchDeviceByUser } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useToggle, useModalToast, useTimer } from "@hooks";

import { CheckBox } from "@rneui/base";

// #region Custom Hooks
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

    const { viewMode, toggleViewMode = () => { } } = props;

    const [showTdModal, setShowTdModal, toggleTabDetail] = useToggle(false);

    const onSelectViewMode = () => {
        toggleViewMode();
        toggleTabDetail();
    }

    const GoToRoomManagement = () => {
        navigation.navigate("RoomManagement");
        toggleTabDetail();
    }

    return (
        <>
            <TabDetailModal {...props}
                toggleViewMode={onSelectViewMode}
                onSelectRoomManagement={GoToRoomManagement}
                showModal={showTdModal} setShowModal={setShowTdModal} />
            {/* <TouchableOpacity onPress={toggleTabDetail}>
                <MaterialCommunityIcons name={"dots-horizontal"} size={32} />
            </TouchableOpacity> */}
        </>
    )
}
// #endregion

// #region Device
function DeviceRemoveModal(props) {

    const { onPress = () => { } } = props;
    const [cusToast, showMsg] = useModalToast();

    const style = {
        title: {
            fontSize: 14,
            fontWeight: "bold",
            color: "white",
        },
        description: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
            color: "#000",
            textAlign: "center",
        }
    }

    return (
        <BaseModal {...props} cusToast={cusToast}>
            <VStack py={5} space={5}
                alignItems={"center"} width={"80%"}>
                <View alignItems={"center"}>
                    <Text style={style.description}>Are you sure you want to remove this device?</Text>
                </View>

                <TouchableOpacity onPress={onPress} style={{ width: "80%" }}>
                    <View backgroundColor={"#F00"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ height: 40, borderRadius: 8 }}>
                        <Text style={style.title}>Remove Device</Text>
                    </View>
                </TouchableOpacity>
            </VStack>
        </BaseModal>
    )
}

function DeviceItem(props) {

    const toast = useToast();

    // #region Props
    const { Title, img, Description, Tuya_Id = "", Id: deviceId, Online_Status, flag } = props;
    const { loading, setLoading = () => { } } = props;
    const { onSelect = () => { } } = props;
    const { toggleRefresh = () => { }, viewMode } = props;
    // #endregion

    const userId = useSelector(Selectors.userIdSelect);

    // #region UseState
    const [showRdModal, setShowRdModal, toggleRdModal] = useToggle(false);
    // #endregion

    // #region Helper
    const onRemoveDevice = () => {
        setLoading(true);
        fetchDeleteDevice({
            param: {
                UserId: userId,
                DeviceId: deviceId,
            },
            onSetLoading: setLoading
        })
            .then(data => {
                toggleRdModal();
                toggleRefresh();
                toast.show({
                    description: "Successfully Removed Device!"
                });
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`)
            })
    }
    // #endregion

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { UnlinkDevice = -1 } = subUserAccess;

    const borderRadius = 8;

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
            color: (Online_Status === 1) ? "#0F0" : "#F00",
        },
        chkBox: {
            paddingHorizontal: 0,
            paddingVertical: 0,
        }
    }

    return (
        <>
            <DeviceRemoveModal onPress={onRemoveDevice}
                showModal={showRdModal && UnlinkDevice == 1} setShowModal={setShowRdModal} />
            <TouchableOpacity onPress={onSelect} onLongPress={toggleRdModal}>
                <BcBoxShadow style={{ borderRadius: borderRadius, width: "100%" }}>
                    <HStack p={2} bgColor={"#FFF"}
                        justifyContent={"space-between"} alignItems={"center"}
                        style={{ borderRadius: borderRadius }}>
                        <VStack space={2}>
                            <Image source={img} style={style.img} resizeMode={"cover"} alt={Title} />
                            <VStack>
                                <Text style={style.title}>{Title}</Text>
                                <Text style={style.onlineStatus}>{Online_Status === 1 ? "Online" : "Offline"}</Text>
                            </VStack>
                        </VStack>
                        <HStack alignItems={"center"}>
                            <FontAwesome5 name={"eye"} size={24} />
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
        </>
    )
}

function DeviceLs(props) {
    const { data = [], renderItem = () => {} } = props;

    if (data.length <= 0) {
        return (<EmptyList />);
    }

    return (
        <View alignItems={"center"} flexGrow={1}>
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ width: "90%", flex: 1 }}
                contentContainerStyle={{
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    justifyContent: "flex-start",
                    padding: 5, rowGap: 8, columnGap: 8,
                }}
            />
        </View>
    )
}
// #endregion

// #region Components
function Header(props) {

    const { flag = false } = props;

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { LinkDevice = -1 } = subUserAccess;

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
                    <BcSvgIcon name={"Yatu"} size={80} color={"#2898FF"} />

                    {
                        (flag) ? (
                            <TouchableOpacity onPress={onSelectAdd}>
                                <View borderRadius={20}
                                    bgColor={"#2898FF"}
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

import { UserDeviceIIData } from "./data";

function useDeviceLs(val = []) {
    const [data, setData] = useState(val);

    const updateData = (arr = []) => {
        arr = arr.map((obj, pos) => ({
            ...obj,
            pos,
            flag: obj.Status == 1,
            img: { uri: obj.DeviceImg }
        }));

        setData(_ => arr);
    }

    return [data, updateData];
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Redux
    const lang = "en";

    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);
    const firstTimeLink = useSelector(Selectors.firstTimeLinkSelect);
    // #endregion

    const [viewMode, toggleViewMode] = useViewMode();
    const [deviceData, setDeviceData] = useDeviceLs([]);

    const [loading, setLoading, toggleLoading] = useToggle(false);


    const [refresh, setRefresh, toggleRefresh] = useToggle(false);
    const [devFlag, setDevFlag, toggleDevFlag] = useToggle(false);

    const [showTGModal, setShowTGModal, toggleTGModal] = useToggle(false);

    // #region UseEffect
    useEffect(() => {
       if (isFocused) {
            setDeviceData(UserDeviceIIData);
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
            })
    }

    useEffect(() => {
        if (deviceData.length > 0) {
            let flag = false;

            let arr = [...deviceData];

            for (const obj of arr) {
                flag = flag || obj.flag
            }

            setDevFlag(_ => flag);
        }
    }, [JSON.stringify(deviceData)]);

    const toggleDeviceFlag = (item) => {
        const { pos, flag } = item;

        let arr = [...deviceData];

        arr[pos].flag = !flag;

        setDeviceData(arr);
    }

    const renderDeviceItem = ({ item, index }) => {
        const onSelect = () => toggleDeviceFlag(item);

        return (
            <DeviceItem key={index} viewMode={viewMode}
                toggleRefresh={toggleRefresh}
                loading={loading} setLoading={setLoading}
                onSelect={onSelect} {...item} />
        )
    }

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
                    <Header key={refresh} toggleRefresh={toggleRefresh} flag={devFlag} />

                    <View style={{ height: 10 }} />

                    <View style={{ height: 5 }} />

                    <View alignItems={"center"}>
                        <HStack alignItems={"center"} width={"90%"}>
                            <Text style={style.title}>Sync Devices</Text>
                            <View justifyContent={"center"}
                                style={style.tabDetail}>
                                <TabDetail viewMode={viewMode} toggleViewMode={toggleViewMode} />
                            </View>
                        </HStack>
                    </View>

                    <DeviceLs data={deviceData} renderItem={renderDeviceItem} />

                    {/* Footer */}
                    <View style={{ height: 70 }} />
                </View>
            </SafeAreaView>
        </>

    );
}

export default Index;