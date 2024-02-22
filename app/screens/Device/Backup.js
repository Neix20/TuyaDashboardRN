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

import { BcBoxShadow, BcLoading, BcYatuHome, BaseModal, BcPhotoGalleryModal, BcProfileWorkspace } from "@components";

import { Devices, Images, Animation, clsConst } from "@config";

import { Tab, TabView } from "@rneui/themed";

import TopModal from "@components/Modal/TopModal";
import Modal from "react-native-modal";

import { fetchDeviceList, fetchDeleteDevice, fetchGetLinkedDevice, fetchLinkDevice } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useToggle, useModalToast, useTimer } from "@hooks";

import { CheckBox } from "@rneui/base";

import { DateTime } from "luxon";

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

    const { Title, flag, Model } = props;
    const { onSelect = () => { } } = props;

    return (
        <TouchableOpacity onPress={onSelect}>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
                <View>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 16,
                    }}>{Title}</Text>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 12,
                        color: "#c6c6c6"
                    }}><Text>Model: </Text>{Model}</Text>
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
    };

    const dispatch = useDispatch();

    const { showModal, setShowModal } = props;
    const { toggleRefresh = () => { } } = props;

    // #region Redux
    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);
    const linkTimer = useSelector(Selectors.linkTimerSelect);
    const linkTsStart = useSelector(Selectors.linkTsStartSelect);
    // #endregion

    // #region UseState
    const [cusToast, showMsg] = useModalToast();
    const [data, setData, toggleItem] = useLinkDevice([]);
    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [tabPaneInd, setTabPaneInd] = useState(0);

    // ! Can Be Removed
    const [timer, setTimer, totalDuration, setTotalDuration, overallPercent] = useTimer(0, () => onTimerEnd());
    const [subLoadFlag, setSubLoadFlag, toggleSubLoadFlag] = useToggle(false);
    const [curDeviceInd, setCurDeviceInd] = useState(0);
    const [percentage, setPercentage] = useState(0);
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
        const { flag } = item;
        const onSelect = () => {
            let arr = data.filter(obj => obj.flag == true);

            if (arr.length >= 5 && !flag) {
                showMsg("You can only link 5 Devices at a time!");
            } else {
                toggleItem(item, showMsg);
            }
        };
        return (
            <LinkDeviceItem key={index} onSelect={onSelect} {...item} />
        )
    }

    const renderUnsupportItem = ({ item, index }) => {
        const { Title } = item;
        return (
            <HStack key={index} alignItems={"center"} justifyContent={"space-between"}>
                <View>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 16,
                    }}>{Title}</Text>
                </View>
                <View bgColor={"#F00"}
                    py={1} px={3}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 12,
                        color: "#FFF"
                    }}>Device Not Supported</Text>
                </View>
            </HStack>
        )
    }
    // #endregion

    const dev_to_update_len = data.filter(x => x.Status).length;

    const time_to_wait = clsConst.TUYA_TIME_TO_WAIT_SYNC;

    useEffect(() => {
        if (timer > 0 && data.length > 0) {
            let ind = Math.floor((timer - 1) / time_to_wait);
            setCurDeviceInd(ind);

            let percent = (time_to_wait - (timer - ind * time_to_wait)) / time_to_wait * 100;
            setPercentage(percent);
        }
    }, [timer]);

    useEffect(() => {

        const ts = Math.floor(DateTime.now().toMillis() / 1000);

        if (linkTimer > -1 && (linkTsStart + linkTimer) > ts) {
            let duration = linkTimer + linkTsStart - ts;
            setTimer(duration);
            setTotalDuration(duration);

            setSubLoadFlag(true);

            dispatch(Actions.onChangeLinkTsStart(ts));
        } else {
            dispatch(Actions.onChangeLinkTimer(-1));
        }
    }, [])

    const onSubmit = () => {
        let arr = [];

        dispatch(Actions.onChangeLinkDeviceLs(data));

        const link_ts = Math.floor(DateTime.now().toMillis() / 1000);
        dispatch(Actions.onChangeLinkTsStart(link_ts));

        arr = data.map(obj => {
            const { Id, Status, IsEmpty } = obj;
            return { Id, Status, IsEmpty };
        })

        setLoading(true);
        setSubLoadFlag(true);

        let f_arr = arr.filter(x => x.Status).filter(x => x.IsEmpty == 1);

        let duration = f_arr.length * time_to_wait;

        setTimer(duration);
        setTotalDuration(duration);

        fetchLinkDevice({
            param: {
                UserId: userId,
                DeviceLs: arr
            },
            onSetLoading: () => { }
        })
            .then(data => {
                // setShowModal(false);

                // Refresh Home List
                // toggleRefresh();
            })
            .catch(err => {
                setLoading(false);
                setSubLoadFlag(false);
                console.log(`Error: ${err}`);
            })
    }

    const onTimerEnd = () => {
        setLoading(false);
        setSubLoadFlag(false);
        toggleRefresh();
    }

    return (
        <BaseModal {...props} cusToast={cusToast}
            showCross={!loading && !subLoadFlag}
            showModal={showModal || subLoadFlag}>
            {
                (loading || subLoadFlag) ? (
                    <View flexGrow={1} alignItems={"center"} justifyContent={"center"} pt={1}>
                        {
                            (subLoadFlag) ? (
                                <VStack px={3}>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 20,
                                        textAlign: "center"
                                    }}>
                                        Sync Data
                                    </Text>
                                    {
                                        (data.filter(x => x.Status).length > 0) ? (
                                            <Text style={{
                                                fontFamily: "Roboto-Bold",
                                                fontSize: 20,
                                                textAlign: "center"
                                            }}>
                                                <Text>{data.filter(x => x.Status).sort((a, b) => a.IsEmpty - b.IsEmpty)[dev_to_update_len - curDeviceInd - 1]?.Title}</Text> <Text style={{ color: "#F00" }}>{dev_to_update_len - curDeviceInd}</Text>/{dev_to_update_len}
                                            </Text>
                                        ) : (
                                            <></>
                                        )
                                    }
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 20,
                                        textAlign: "center"
                                    }}>
                                        Overall Loading: <Text style={{ color: "#F00" }}>{overallPercent.toFixed(1)}</Text>%
                                    </Text>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 20,
                                        textAlign: "center"
                                    }}>
                                        Time Left: <Text style={{ color: "#F00" }}>{timer}</Text> seconds
                                    </Text>
                                </VStack>
                            ) : (
                                <></>
                            )
                        }
                        <Lottie
                            autoPlay
                            source={Animation.YatuLoader}
                            loop={true}
                            style={{
                                width: 320,
                                height: 320
                            }} />
                        {
                            (subLoadFlag) ? (
                                <View>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 18,
                                        textAlign: "center"
                                    }}>
                                        Syncing Data with Smart Home Server
                                    </Text>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 16,
                                        textAlign: "center"
                                    }}>
                                        (It may take upwards to 15 minutes)
                                    </Text>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 18,
                                        textAlign: "center"
                                    }}>
                                        Please be patient. Your data is being sync!
                                    </Text>
                                </View>
                            ) : (
                                <View>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 18,
                                        textAlign: "center"
                                    }}>
                                        Loading Device List...
                                    </Text>
                                </View>
                            )
                        }
                    </View>
                )
                    : (
                        <VStack py={3} space={3} w={"100%"}
                            bgColor={"#FFF"} alignItems={"center"}>

                            <View>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    fontSize: 18
                                }}>Sync Devices</Text>
                            </View>

                            {
                                (data.length > 0) ? (
                                    <>
                                        <FlatList
                                            data={data.filter(obj => obj.flag && obj.Supported == 1)}
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
                                            data={data.filter(obj => !obj.flag && obj.Supported == 1)}
                                            renderItem={renderItem}
                                            style={{ width: "90%", maxHeight: 300 }}
                                            contentContainerStyle={{
                                                flexDirection: "column",
                                                padding: 5,
                                                rowGap: 8,
                                            }}
                                            ListEmptyComponent={<></>}
                                        />

                                        {
                                            (data.filter(obj => obj.Supported == 0).length > 0) ? (
                                                <>
                                                    <View width={"90%"} style={{ paddingHorizontal: 5 }}>
                                                        <Text style={{
                                                            fontFamily: "Roboto-Bold",
                                                            fontSize: 16
                                                        }}>Not Supported</Text>
                                                    </View>

                                                    <FlatList
                                                        data={data.filter(obj => obj.Supported == 0)}
                                                        renderItem={renderUnsupportItem}
                                                        style={{ width: "90%", maxHeight: 300 }}
                                                        contentContainerStyle={{
                                                            flexDirection: "column",
                                                            padding: 5,
                                                            rowGap: 8,
                                                        }}
                                                        ListEmptyComponent={<></>}
                                                    />
                                                </>
                                            ) : (
                                                <></>
                                            )
                                        }

                                        <TouchableOpacity onPress={onSubmit} style={{ width: "60%" }}>
                                            <View backgroundColor={"#ff0000"}
                                                alignItems={"center"} justifyContent={"center"}
                                                borderRadius={8}
                                                style={{ height: 48 }}
                                            >
                                                <Text style={[{
                                                    fontSize: 14,
                                                    fontWeight: "bold",
                                                    color: "white",
                                                }]}>Sync Now</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <VStack space={2} alignItems={"center"}>
                                        <FontAwesome name={"check-circle"}
                                            color={"#26cd14"}
                                            size={80} />

                                        <Text style={{
                                            fontSize: 18,
                                            fontFamily: 'Roboto-Medium',
                                            fontWeight: "700"
                                        }}>All devices have been synced</Text>
                                    </VStack>
                                )
                            }
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
    const { Title, img, Description, Tuya_Id = "", Id: deviceId, Online_Status } = props;
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

    if (viewMode == "List") {
        return (
            <>
                <DeviceRemoveModal onPress={onRemoveDevice}
                    showModal={showRdModal && UnlinkDevice == 1} setShowModal={setShowRdModal} />
                <TouchableOpacity
                    onPress={onSelect}
                    onLongPress={toggleRdModal}>
                    <BcBoxShadow
                        style={{
                            borderRadius: borderRadius,
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
                                    fontFamily: 'Roboto-Bold',
                                    color: (Online_Status === 1) ? "#0F0" : "#F00",
                                }}>
                                    {Online_Status === 1 ? "Online" : "Offline"}
                                </Text>
                            </VStack>
                        </VStack>
                    </BcBoxShadow>
                </TouchableOpacity>
            </>
        )
    }

    return (
        <>
            <DeviceRemoveModal onPress={onRemoveDevice}
                showModal={showRdModal && UnlinkDevice == 1} setShowModal={setShowRdModal} />
            <TouchableOpacity
                onPress={onSelect}
                onLongPress={toggleRdModal}>
                <BcBoxShadow
                    style={{
                        borderRadius: borderRadius,
                        width: 160,
                    }}>
                    <VStack p={2} space={2}
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
                        <VStack style={{ width: 160 }}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Roboto-Bold',
                                color: "#000",
                            }}>{Title}</Text>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'Roboto-Bold',
                                color: (Online_Status === 1) ? "#0F0" : "#F00",
                            }}>
                                {Online_Status === 1 ? "Online" : "Offline"}
                            </Text>
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

    // const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    // const { LinkDevice = -1 } = subUserAccess;

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
                    {/* <BcYatuHome /> */}

                    <HStack alignItems={"center"} space={3}>
                        {/* Button */}
                        <TutorialGuideBtn />
                        {/* <AddDeviceBtn {...props} /> */}
                    </HStack>

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
    }, [homeId, refresh, isFocused]);

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
    const GoToDetail = (item) => {
        const { IsTempHumd = 0, IsSmartPlug = 0, IsAirQuality = 0, IsAirCon = 0, IsSmartCamera = 0 } = item;

        if (IsSmartPlug == 1) {
            navigation.navigate("DeviceLandingSmartPlug", item);
        }

        else if (IsAirCon == 1) {
            navigation.navigate("DeviceLandingAirCon", item);
        }

        else {
            navigation.navigate("DeviceLanding", item);
        }
    };
    // #endregion

    // #region Render
    const renderDeviceItem = ({ item, index }) => {
        const onSelect = () => GoToDetail(item);
        return (
            <DeviceItem key={index} viewMode={viewMode}
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
                        <BcCarousel data={imgLs} renderItem={renderGradientItem} />
                    </View> */}

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
                                                justifyContent: "flex-start",
                                                padding: 5, rowGap: 8, columnGap: 8,
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