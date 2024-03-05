import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, FlatList, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { CheckBox } from "@rneui/base";

import Modal from "react-native-modal";

import { Logger, Utility } from "@utility";
import { Images } from "@config";

import { BcBoxShadow, BcLoading, BcPhotoGalleryModal, BcSvgIcon, BcYesNoModal } from "@components";

import { fetchDeviceByUserII, fetchToggleFavoriteDevice, fetchLinkDevice } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useToggle } from "@hooks";

// #region Custom Hooks
function useDeviceLs(val = []) {

    const init = {
        position: {
            tempHumd: 0,
            smartPlug: 1,
        }
    }

    const [data, setData] = useState(val);
    const [oridLs, setOridLs] = useState([]);
    const [posObj, setPosObj] = useState(init.position);

    const updateData = (arr = []) => {
        arr = arr.map((obj, pos) => ({
            ...obj,
            pos,
            flag: obj.Status == 1,
            pwsFlag: obj.ProfileWorkspaceStatus == 1,
            img: { uri: obj.DeviceImg }
        }));
        setData(_ => arr);

        let _oridLs = arr.filter(x => x.flag).map(x => x.Id);
        setOridLs(_ => _oridLs);

        let _posObj = { ...posObj };
        for (let ind in arr) {
            const { IsSmartPlug } = arr[ind];

            if (IsSmartPlug == 1) {
                _posObj["smartPlug"] = ind;
                break;
            }
        }
        setPosObj(_ => _posObj);
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

    const syncCount = data.filter(x => x.Status).length;

    const nOridLs = data.filter(x => x.flag).map(x => x.Id).join("");
    const sessionFlag = nOridLs !== oridLs.join("");

    return [data, updateData, toggleFlag, addToFavorite, syncCount, sessionFlag, posObj];
}
// #endregion

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
    const { navToTempHumd = () => {}, navToSmartPlug = () => {} }  = props;
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
        <TouchableOpacity onPress={onLinkDevice} onLongPress={onAddToFavorite}>
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
                                <FontAwesome name={"star"} size={24} color={pwsColor} />
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
                            onPress={onLinkDevice}
                            checkedColor={"#F00"} />
                    </HStack>
                </HStack>
            </BcBoxShadow>
        </TouchableOpacity>
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
            <FlatList
                ref={deviceLsRef}
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

    const { flag = false } = props;
    const { onSelectAdd = () => { } } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 1,
            color: "#FFF"
        }
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
                    <BcSvgIcon name={"Yatu"} size={80} color={require("@utility").Utility.getColor()} />

                    {
                        (flag) ? (
                            <TouchableOpacity onPress={onSelectAdd}>
                                {/* <View borderRadius={20}
                                    bgColor={require("@utility").Utility.getColor()}
                                    alignItems={"center"} justifyContent={"center"}
                                    style={{ width: 32, height: 32 }}>
                                    <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                                </View> */}
                                <View borderRadius={20} px={3} bgColor={require("@utility").Utility.getColor()}>
                                    <Text style={style.title}>Sync Now</Text>
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
    const [deviceData, setDeviceData, toggleDeviceFlag, addToFavorite, deviceCount, deviceSession, devicePos] = useDeviceLs([]);

    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [refresh, setRefresh, toggleRefresh] = useToggle(false);
    const [showTGModal, setShowTGModal, toggleTGModal] = useToggle(false);
    const [showLdModal, setShowLdModal, toggleLdModal] = useToggle(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            // setDeviceData(UserDeviceIIData);
            GetDeviceByUserII();
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
        fetchLinkDevice({
            param: {
                UserId: userId,
                DeviceLs: deviceData.map(x => ({ Id: x.Id, Status: x.flag ? 1 : 0 }))
            },
            onSetLoading: setLoading
        })
            .then(data => {
                toggleLdModal();
                toggleRefresh();
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            });
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

        return (
            <DeviceItem
                key={index}
                onLinkDevice={onLinkDevice}
                onAddToFavorite={onAddToFavorite}
                {...item} />
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
        }
    }

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

                    <View style={{ height: 10 }} />

                    <View style={{ height: 5 }} />

                    <View alignItems={"center"}>
                        <HStack alignItems={"center"} width={"90%"}>
                            <Text style={style.title}>Sync Devices ({deviceCount}/20)</Text>
                            <View justifyContent={"center"}
                                style={style.tabDetail}>
                                <TabDetail navToTempHumd={navToTempHumd} navToSmartPlug={navToSmartPlug} />
                            </View>
                        </HStack>
                    </View>

                    {/* Body */}
                    <DeviceLs
                        deviceLsRef={machineListView}
                        data={deviceData} renderItem={renderDeviceItem} />

                    {/* Footer */}
                    <View style={{ height: 70 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;