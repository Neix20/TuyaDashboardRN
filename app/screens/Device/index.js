import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, FlatList, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

// const {width, height} = useWindowDimensions();

import { Logger, Utility } from "@utility";

import { BcBoxShadow, BcLoading, BcYatuHome, BaseModal, BcPhotoGalleryModal } from "@components";

import { Devices, Images, Animation } from "@config";

import { Tab, TabView } from "@rneui/themed";

import TopModal from "@components/Modal/TopModal";
import Modal from "react-native-modal";

import { fetchDeviceList, fetchDeleteDevice, fetchGetLinkedDevice, fetchLinkDevice } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useToggle, useModalToast } from "@hooks";

import { CheckBox } from "@rneui/base";

import Lottie from "lottie-react-native";

// #region Hooks
function useViewMode(val = "list") {
    const [viewMode, setViewMode] = useState(val);

    const toggleViewMode = () => {
        const val = (viewMode === "List") ? "Grid" : "List";
        setViewMode(val);
    };

    return [viewMode, toggleViewMode];
}

function useLinkDevice(val = []) {
    const [ls, setLs] = useState(val);

    const toggleItem = (item) => {
        const { pos, flag } = item;

        let arr = [...ls];
        arr[pos].flag = !flag;
        arr[pos].Status = !flag ? 1 : 0;

        setLs(arr);
    }

    return [ls, setLs, toggleItem];
}
// #endregion

// #region Linked Device
function LinkDeviceItem(props) {

    const { Title, flag } = props;
    const { onSelect = () => { } } = props;

    return (
        <TouchableOpacity onPress={onSelect}>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
                <View>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 16,
                    }}>{Title}</Text>
                </View>
                <CheckBox
                    containerStyle={{
                        paddingHorizontal: 5,
                        paddingVertical: 0,
                    }}
                    iconType={"material-community"}
                    checkedIcon={"checkbox-marked"}
                    uncheckedIcon={"checkbox-blank-outline"}
                    onPress={onSelect}
                    checked={flag} />
            </HStack>
        </TouchableOpacity>
    )
}

function LinkDeviceModal(props) {

    const init = {
        txtActive: "#2898FF",
        txtInActive: "#6A7683",
        bgActive: "#FFF",
        bgInActive: "#EDEEEF",
        tabLs: ["Inactive", "Active"]
    }

    const { tabLs = [] } = init;

    const { showModal, setShowModal } = props;
    const { toggleRefresh = () => { } } = props;

    // #region Redux
    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);
    // #endregion

    // #region UseState
    const [cusToast, showMsg] = useModalToast();
    const [data, setData, toggleItem] = useLinkDevice([]);
    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [tabPaneInd, setTabPaneInd] = useState(0);
    // #endregion

    useEffect(() => {
        setLoading(true);
        fetchGetLinkedDevice({
            param: {
                UserId: userId,
                HomeId: homeId
            },
            onSetLoading: setLoading
        })
            .then(data => {
                setData(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })

    }, [userId, homeId])

    // #region Render
    const renderItem = ({ item, index }) => {
        const onSelect = () => toggleItem(item);
        return (
            <LinkDeviceItem key={index} onSelect={onSelect} {...item} />
        )
    }

    const renderTabItem = (item, index) => {
        return (
            <Tab.Item
                key={index}
                title={item}
                titleStyle={(active) => ({
                    fontSize: 18,
                    paddingHorizontal: 0,
                    color: active ? init.txtActive : init.txtInActive
                })}
                buttonStyle={(active) => ({
                    borderWidth: active ? 1 : 0,
                    borderRadius: 8,
                    marginRight: 5,
                    paddingVertical: 0,
                    paddingHorizontal: 30,
                })}
            />
        )
    }
    // #endregion

    const onSubmit = () => {
        let arr = [];

        arr = data.map(obj => {
            const { Id, Status } = obj;
            return { Id, Status };
        })

        setLoading(true);
        fetchLinkDevice({
            param: {
                UserId: userId,
                DeviceLs: arr
            },
            onSetLoading: setLoading
        })
            .then(data => {
                setShowModal(false);
                toggleRefresh();
                // Refresh Home List
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }


    return (
        <BaseModal {...props} cusToast={cusToast}>
            {
                (loading) ? (
                    <View flexGrow={1} alignItems={"center"} justifyContent={"center"}>
                        <Lottie
                            autoPlay
                            source={Animation.YatuLoader}
                            loop={true}
                            style={{
                                width: 320,
                                height: 320
                            }} />

                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18,
                            textAlign: "center"
                        }}>Please refrain from closing the app...</Text>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18,
                            textAlign: "center"
                        }}>
                            Syncing Data with Smart Home Server...
                        </Text>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 16,
                            textAlign: "center"
                        }}>
                            (It Make take 1 to 5 Minutes ...)
                        </Text>
                    </View>
                ) : (
                    <VStack py={3} space={3} w={"100%"}
                        bgColor={"#FFF"} alignItems={"center"}>

                        <View>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18
                            }}>Device List</Text>
                        </View>

                        {/* <View>
                            <Tab scrollable={true} disableIndicator={true} value={tabPaneInd} onChange={(e) => setTabPaneInd(e)}>
                                {tabLs.map(renderTabItem)}
                            </Tab>
                        </View>

                        {
                            (tabPaneInd == 0) ? (
                                <FlatList
                                    data={data.filter(obj => !obj.flag)}
                                    renderItem={renderItem}
                                    style={{ width: "90%", height: 300 }}
                                    contentContainerStyle={{
                                        flexDirection: "column",
                                        padding: 5,
                                        rowGap: 8,
                                    }}
                                    ListEmptyComponent={<></>}
                                />
                            ) : (tabPaneInd == 1) ? (
                                <FlatList
                                    data={data.filter(obj => obj.flag)}
                                    renderItem={renderItem}
                                    style={{ width: "90%", height: 300 }}
                                    contentContainerStyle={{
                                        flexDirection: "column",
                                        padding: 5,
                                        rowGap: 8,
                                    }}
                                    ListEmptyComponent={<></>}
                                />
                            ) : (
                                <></>
                            )
                        } */}

                        <FlatList
                            data={data.filter(obj => obj.flag)}
                            renderItem={renderItem}
                            style={{ width: "90%", maxHeight: 300 }}
                            contentContainerStyle={{
                                flexDirection: "column",
                                padding: 5,
                                rowGap: 8,
                            }}
                            ListEmptyComponent={<></>}
                        />

                        <FlatList
                            data={data.filter(obj => !obj.flag)}
                            renderItem={renderItem}
                            style={{ width: "90%", maxHeight: 300 }}
                            contentContainerStyle={{
                                flexDirection: "column",
                                padding: 5,
                                rowGap: 8,
                            }}
                            ListEmptyComponent={<></>}
                        />

                        <TouchableOpacity onPress={onSubmit}
                            style={{ width: "60%" }}>
                            <View backgroundColor={"#ff0000"}
                                alignItems={"center"} justifyContent={"center"}
                                borderRadius={8}
                                style={{ height: 48 }}
                            >
                                <Text style={[{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "white",
                                }]}>Submit</Text>
                            </View>
                        </TouchableOpacity>
                    </VStack>
                )
            }
        </BaseModal>
    )
}
// #endregion

// #region Add Device Modal
function AddDeviceModal(props) {

    // #region Props
    const { onLinkedDevice = () => { } } = props;
    // #endregion

    return (
        <TopModal showCross={false} {...props}>
            <View alignItems={"center"} width={"100%"}>
                <TouchableOpacity onPress={onLinkedDevice}
                    style={{ width: "90%" }}>
                    <HStack alignItems={"center"} style={{ height: 40 }}>
                        <View flex={.1}>
                            <FontAwesome name={"plug"} color={"#ccc"} size={20} />
                        </View>
                        <View flex={.9}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18,
                            }}>Linked Device</Text>
                        </View>
                    </HStack>
                </TouchableOpacity>
            </View>
        </TopModal>
    )
}

function AddDeviceBtn(props) {

    const { toggleRefresh = () => { } } = props;

    // #region UseState
    const [showAdModal, setShowAdModal, toggleAdModal] = useToggle(false);
    const [showLdModal, setShowLdModal, toggleLdModal] = useToggle(false);
    // #endregion

    // #region Navigation
    const GoToLinkDevice = () => {
        toggleAdModal();
        setShowLdModal(() => true)
    }
    // #endregion

    return (
        <>
            <LinkDeviceModal showModal={showLdModal} setShowModal={setShowLdModal} toggleRefresh={toggleRefresh} />
            <AddDeviceModal onLinkedDevice={GoToLinkDevice} showModal={showAdModal} setShowModal={setShowAdModal} />
            <TouchableOpacity onPress={toggleLdModal}>
                <View borderRadius={20}
                    bgColor={"#2898FF"}
                    alignItems={"center"} justifyContent={"center"}
                    style={{ width: 32, height: 32 }}>
                    <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                </View>
            </TouchableOpacity>
        </>
    )
}
// #endregion

// #region Tab Detail
function TabDetailModal(props) {

    // #region Props
    const { showModal, setShowModal } = props;
    const { onSelectRoomManagement = () => { } } = props;
    const { viewMode, toggleViewMode = () => { } } = props;
    // #endregion

    return (
        <Modal
            isVisible={showModal}
            animationInTiming={1}
            animationOutTiming={1}
            onBackButtonPress={() => setShowModal(false)}
            onBackdropPress={() => setShowModal(false)}
            backdropOpacity={.3}>
            <View py={3}
                alignItems={"center"}
                borderRadius={8}
                bgColor={"#FFF"}>

                <TouchableOpacity onPress={toggleViewMode}
                    style={{ width: "90%" }}>
                    <HStack
                        alignItems={"center"}
                        style={{ height: 40 }}>
                        <HStack alignItems={"center"} space={3}>
                            <MaterialCommunityIcons name={viewMode === "List" ? "view-grid-outline" : "view-list-outline"} size={28} />
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18
                            }}>{viewMode === "List" ? "Grid" : "List"} View</Text>
                        </HStack>
                    </HStack>
                </TouchableOpacity>

                <TouchableOpacity onPress={onSelectRoomManagement} style={{ width: "90%" }}>
                    <HStack
                        alignItems={"center"}
                        style={{ height: 40 }}>
                        <HStack alignItems={"center"} space={3}>
                            <MaterialCommunityIcons name={"hexagon-slice-4"} size={28} />
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18
                            }}>Room Management</Text>
                        </HStack>
                    </HStack>
                </TouchableOpacity>

            </View>
        </Modal>
    )
}

function TabDetail(props) {

    const navigation = useNavigation();

    // #region Props
    const { viewMode, toggleViewMode = () => { } } = props;
    // #endregion

    // #region UseState
    const [showTdModal, setShowTdModal, toggleTabDetail] = useToggle(false);
    // #endregion

    // #region Helper

    const onSelectViewMode = () => {
        toggleViewMode();
        toggleTabDetail();
    }
    // #endregion

    // #region Navigation
    const GoToRoomManagement = () => {
        navigation.navigate("RoomManagement");
        toggleTabDetail();
    }
    // #endregion

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
function DeviceRemoveModal(props) {

    const { onPress = () => { } } = props;
    const [cusToast, showMsg] = useModalToast();

    return (
        <BaseModal {...props} cusToast={cusToast}>
            <VStack py={5} space={5}
                alignItems={"center"}
                width={"80%"}>
                <View alignItems={"center"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#000",
                        textAlign: "center",
                    }}>Are you sure you want to remove this device?</Text>
                </View>

                <TouchableOpacity onPress={onPress} style={{ width: "80%" }}>
                    <View backgroundColor={"#ff0000"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ height: 40, borderRadius: 8 }}
                    >
                        <Text style={[{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "white",
                        }]}>Remove Device</Text>
                    </View>
                </TouchableOpacity>
            </VStack>
        </BaseModal>
    )
}

function DeviceItem(props) {

    const toast = useToast();

    // #region Props
    const { Title, img, Description, Tuya_Id = "", Id: deviceId } = props;
    const { loading, setLoading = () => { } } = props;
    const { onSelect = () => { } } = props;
    const { toggleRefresh = () => { } } = props;
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

    const borderRadius = 8;

    return (
        <>
            <DeviceRemoveModal onPress={onRemoveDevice}
                showModal={showRdModal} setShowModal={setShowRdModal} />
            <TouchableOpacity
                onPress={onSelect}
                onLongPress={toggleRdModal}>
                <BcBoxShadow
                    style={{
                        borderRadius: borderRadius,
                        minWidth: 160,
                        width: "100%",
                    }}>
                    <VStack
                        p={2} space={2}
                        style={{
                            backgroundColor: "#FFF",
                            borderRadius: borderRadius,
                        }}>
                        <Image
                            source={img}
                            style={{
                                height: 60,
                                width: 60,
                            }}
                            resizeMode={"cover"}
                            alt={Title} />
                        <VStack>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Roboto-Bold',
                                color: "#000",
                            }}>{Title}</Text>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'Roboto-Medium',
                                color: "#c6c6c6"
                            }}>{Description}</Text>
                        </VStack>
                    </VStack>
                </BcBoxShadow>
            </TouchableOpacity>
        </>
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
                    <BcYatuHome />

                    <HStack alignItems={"center"} space={3}>
                        {/* Button */}
                        <TutorialGuideBtn />
                        <AddDeviceBtn {...props} />
                    </HStack>

                </HStack>
            </View>
        </BcBoxShadow>
    )
}

function EmptyList(props) {
    const { lang } = props;
    return (
        <View flexGrow={1}
            alignItems={"center"}
            justifyContent={"center"}>

            <VStack space={2}
                alignItems={"center"}
                width={"90%"}>

                <FontAwesome name={"plug"}
                    color={"#e6e6e6"}
                    size={80} />

                <Text style={{
                    fontSize: 18,
                    color: "#d3d3d3",
                    fontFamily: 'Roboto-Medium',
                    fontWeight: "700"
                }}>Add Device to Your Dashboard</Text>
            </VStack>
        </View>
    )
}

function CardGradientItem(props) {
    const { bgName = "CardGradientRed" } = props;
    return (
        <View style={{ height: 180 }}>
            <Image source={Images[bgName]} style={{ width: "100%", height: "100%", borderRadius: 15 }} resizeMode={"cover"} alt={bgName} />
            <VStack p={2}
                space={4}
                position={"absolute"} style={{ left: 0, right: 0 }}>
                <View>
                    <Text style={{
                        fontSize: 12,
                        color: "#FFF",
                    }}>Cozy Home</Text>
                </View>

                <HStack space={3}>
                    <FontAwesome5 name={"cloud"} color={"#FFF"} size={36} />
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 32,
                        color: "#f1f1f1"
                    }}>29°C</Text>
                </HStack>

                <HStack alignItems={"center"} justifyContent={"space-between"}>
                    <VStack>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#FFF",
                        }}>Excellent</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: "#FFF",
                        }}>Outdoor PM 2.5</Text>
                    </VStack>
                    <VStack>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#FFF",
                        }}>74.0%</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: "#FFF",
                        }}>Outdoor Humidity</Text>
                    </VStack>
                    <VStack>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#FFF",
                        }}>1006.9hPa</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: "#FFF",
                        }}>Outdoor Air Pres...</Text>
                    </VStack>
                </HStack>
            </VStack>
        </View>
    )
}
// #endregion

function TutorialGuideBtn(props) {
    const [showTGModal, setShowTGModal, toggleTGModal] = useToggle(false);

    const images = [
        { uri: Images.LinkDeviceI },
        { uri: Images.LinkDeviceII },
        { uri: Images.LinkDeviceIII },
        { uri: Images.LinkDeviceIV },
        { uri: Images.LinkDeviceV },
    ]

    return (
        <>
            <BcPhotoGalleryModal showModal={showTGModal} setShowModal={setShowTGModal} images={images} />
            <TouchableOpacity onPress={toggleTGModal}>
                <View borderRadius={20}
                    bgColor={"#d3d3d3"}
                    alignItems={"center"} justifyContent={"center"}
                    style={{ width: 32, height: 32 }}>
                    <FontAwesome name={"info"} size={16} color={"#FFF"} />
                </View>
            </TouchableOpacity>
        </>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    // #region Redux
    const lang = "en";

    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);
    // #endregion

    // #region Init
    const init = {
        txtActive: "#2898FF",
        txtInActive: "#6A7683",
        bgActive: "#FFF",
        bgInActive: "#EDEEEF",
        roomLs: ["All Devices", "Living Room", "Office", "Kitchen", "Master Bedroom", "Dining Room"],
        imgLs: ["CardGradientRed", "CardGradientGreen", "CardGradientOrange", "CardGradientBlue"]
    }
    // #endregion

    // #region UseState
    const [deviceData, setDeviceData] = useState({});
    const [roomPaneInd, setRoomPaneInd] = useState(0);

    const [imgLs, setImgLs] = useState(init.imgLs);

    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [refresh, setRefresh, toggleRefresh] = useToggle(false);

    const [viewMode, toggleViewMode] = useViewMode();
    // #endregion

    const roomLs = Object.keys(deviceData);

    const firstTimeLink = useSelector(Selectors.firstTimeLinkSelect);

    // #region UseEffect
    useEffect(() => {
        setLoading(true);
        fetchDeviceList({
            param: {
                UserId: userId,
                HomeId: homeId
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
    }, [homeId, refresh]);

    useEffect(() => {
        if (isFocused && firstTimeLink) {
            setTimeout(() => {
                toggleTGModal();
            }, 3000);
        }
    }, [isFocused, firstTimeLink]);
    // #endregion

    const [showTGModal, setShowTGModal, toggleTGModal] = useToggle(false);

    // #region Navigation
    const GoToDetail = (item) => navigation.navigate("DeviceLanding", item);
    // #endregion

    // #region Render
    const renderDeviceItem = ({ item, index }) => {
        const onSelect = () => GoToDetail(item);
        return (
            <DeviceItem key={index}
                toggleRefresh={toggleRefresh}
                loading={loading} setLoading={setLoading}
                onSelect={onSelect} {...item} />
        )
    }

    const renderTabItem = (item, index) => {
        return (
            <Tab.Item
                key={index}
                title={item}
                titleStyle={(active) => ({
                    fontSize: 18,
                    paddingHorizontal: 0,
                    color: active ? init.txtActive : init.txtInActive
                })}
                buttonStyle={(active) => ({
                    borderRadius: 8,
                    marginRight: 10,
                    paddingVertical: 0,
                    paddingHorizontal: 0,
                })}
            />
        )
    }

    const renderGradientItem = ({ index }) => {
        const bgName = imgLs[index];
        return (
            <CardGradientItem key={index} bgName={bgName} />
        )
    }

    const updateFirstTimeLink = () => {
        toggleTGModal();
        dispatch(Actions.onChangeFirstTimeLink(false));
    }

    const images = [
        { uri: Images.LinkDeviceI },
        { uri: Images.LinkDeviceII },
        { uri: Images.LinkDeviceIII },
        { uri: Images.LinkDeviceIV },
        { uri: Images.LinkDeviceV },
    ]
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <BcPhotoGalleryModal showModal={showTGModal} setShowModal={updateFirstTimeLink} images={images} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#FFF"} style={{ flex: 1 }}>

                    {/* Header */}
                    <Header key={refresh} toggleRefresh={toggleRefresh} />

                    <View style={{ height: 10 }} />

                    {/* Card Gradient */}
                    {/* <View alignItems={"center"}>
                        <BcCarousel images={imgLs} renderItem={renderGradientItem} />
                    </View> */}

                    <View style={{ height: 5 }} />

                    <View alignItems={"center"}>
                        <HStack alignItems={"center"} width={"90%"}>
                            <Tab
                                scrollable={true}
                                disableIndicator={true}
                                value={roomPaneInd}
                                onChange={(e) => setRoomPaneInd(e)}>
                                {roomLs.map(renderTabItem)}
                            </Tab>
                            <View justifyContent={"center"}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    right: 0,
                                }}>
                                <TabDetail viewMode={viewMode} toggleViewMode={toggleViewMode} />
                            </View>
                        </HStack>
                    </View>

                    <TabView
                        value={roomPaneInd}
                        onChange={(e) => setRoomPaneInd(e)}>
                        {
                            roomLs.map((room, ind) => {
                                const deviceLs = deviceData[room];
                                return (
                                    <TabView.Item key={ind}
                                        style={{ width: "100%", alignItems: "center" }}>
                                        <FlatList
                                            key={viewMode}
                                            data={deviceLs}
                                            renderItem={renderDeviceItem}
                                            style={{ width: "90%" }}
                                            contentContainerStyle={{
                                                flexGrow: 1,
                                                flexDirection: (viewMode === "List") ? "column" : "row",
                                                flexWrap: (viewMode === "List") ? "nowrap" : "wrap",
                                                justifyContent: (viewMode === "List") ? "flex-start" : "space-between",
                                                padding: 5, rowGap: 8,
                                            }}
                                            ListEmptyComponent={<EmptyList lang={lang} />}
                                        />
                                    </TabView.Item>
                                )
                            })
                        }
                    </TabView>

                    {/* Footer */}
                    <View style={{ height: 70 }} />
                </View>
            </SafeAreaView>
        </>
    )
}

export default Index;