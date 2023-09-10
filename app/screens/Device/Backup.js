import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcSvgIcon, BcBoxShadow, BcDeviceConModal, BcDropdown, BaseModal } from "@components";

import { Devices } from "@config";

import { Tab, TabView } from "@rneui/themed";

import { removeDevice as TuyaRemoveDevice } from "@volst/react-native-tuya";

// #region Components
function DeviceRemoveModal(props) {

    // #region Redux
    const lang = "en";
    // #endregion

    // #region Props
    const { onPress = () => { } } = props;
    // #endregion

    // #region Initial
    const init = {
        toast: {
            msg: "",
            flag: false
        },
    };
    // #endregion

    // #region Toast
    const [cusToast, setCusToast] = useState(init.toast);

    const setToastFlag = (val) => {
        setCusToast({
            ...cusToast,
            flag: val
        });
    }

    const showToastMsg = (val) => {
        setCusToast({
            ...cusToast,
            msg: val,
            flag: true
        })
    }

    useEffect(() => {
        if (cusToast.flag) {
            setTimeout(() => {
                setToastFlag(false);
            }, 3 * 1000);
        }
    }, [cusToast.flag]);
    // #endregion

    return (
        <BaseModal {...props} cusToast={cusToast}>
            <VStack
                py={5}
                space={5}
                alignItems={"center"}
                style={{
                    width: width - 100,
                }}>
                <View alignItems={"center"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#000",
                        textAlign: "center",
                    }}>Are you sure you want to remove this device?</Text>
                </View>

                <TouchableOpacity onPress={onPress}>
                    <View backgroundColor={"#ff0000"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{
                            width: width - 120,
                            height: 40,
                            borderRadius: 8,
                        }}
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

function EmptyList(props) {
    const { lang } = props;
    return (
        <View
            style={{ flexGrow: 1 }}
            alignItems={"center"}
            justifyContent={"center"}>

            <VStack space={2}
                alignItems={"center"}
                style={{ width: width - 40 }}>

                <FontAwesome name={"plug"}
                    color={"#e6e6e6"}
                    size={80} />

                <Text style={{
                    fontSize: 18,
                    color: "#d3d3d3",
                    fontFamily: 'Roboto-Medium',
                    fontWeight: "700"
                }}>{Utility.translate("Empty List", lang)}</Text>
            </VStack>
        </View>
    )
}

function Search(props) {
    const { lang } = props;
    const { query, setQuery } = props;
    return (
        <View
            alignItems={"center"}
            justifyContent={"center"}
            style={{
                height: 60,
            }}>
            <View
                bgColor={"#EDEEEF"}
                borderRadius={4}>
                <TextInput
                    style={{
                        fontSize: 14,
                        fontFamily: "Roboto-Medium",
                        height: 40,
                        width: 360,
                        paddingHorizontal: 16,
                        color: "#000",
                    }}
                    placeholder={Utility.translate("Search", lang)}
                    placeholderTextColor={"#6A7683"}
                    defaultValue={query}
                    onChangeText={setQuery}
                />

                {/* Front Layer */}
                <View
                    justifyContent={"center"}
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        right: 16,
                        display: (query !== "") ? "none" : "flex"
                    }}>
                    <FontAwesome5 name={"search"} size={20} color={"#6A7683"} />
                </View>
            </View>
        </View>
    )
}

function Item(props) {
    const { lang } = props;
    const { name, img, icon, product_name, description } = props;
    const { onPress = () => { }, RemoveDevice = () => { } } = props;
    const borderRadius = 8;

    const [showDevRemModal, setShowDevRemModal] = useState(false);
    const toggleDeviceRemModal = () => setShowDevRemModal(val => !val);

    const onLongPress = () => toggleDeviceRemModal();

    const onRemoveDevice = () => {
        RemoveDevice();
        toggleDeviceRemModal();
    }

    return (
        <>
            <DeviceRemoveModal
                onPress={onRemoveDevice}
                showModal={showDevRemModal} setShowModal={setShowDevRemModal} />
            <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
                <BcBoxShadow style={{ borderRadius: borderRadius }}>
                    <VStack
                        p={2} space={2}
                        bgColor={"#fff"}
                        borderRadius={borderRadius}
                        style={{
                            width: (width - 60) / 2
                        }}>
                        <Image
                            source={img}
                            style={{
                                height: 60,
                                width: 60,
                            }}
                            resizeMode={"cover"}
                            alt={name} />
                        <VStack>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Roboto-Bold',
                                color: "#000",
                            }}>{name}</Text>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'Roboto-Medium',
                                color: "#c6c6c6"
                            }}>{description}</Text>
                        </VStack>
                    </VStack>
                </BcBoxShadow>
            </TouchableOpacity>

        </>
    )
}

function Header(props) {

    const { onAddDevice = () => { } } = props;

    const { homeLs, homeVal, setHomeVal } = props;

    return (
        <>
            <BcBoxShadow>
                <View
                    style={{
                        height: 60,
                        width: width,
                        backgroundColor: "#fff",
                    }}>
                </View>
            </BcBoxShadow>
            <View
                justifyContent={"center"}
                alignItems={"center"}
                style={{
                    position: "absolute",
                    zIndex: 20,
                    height: 60,
                    left: 0,
                    right: 0,
                }}>
                <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{ width: width - 40 }}>
                    {/* Logo */}
                    <BcSvgIcon name={"Yatu"} width={80} height={40} />

                    <HStack alignItems={"center"} space={3}>
                        {/* Current Home */}
                        <BcDropdown
                            items={homeLs} placeholder={"s8-office"}
                            value={homeVal} setValue={setHomeVal}
                            width={120} height={40}
                        />

                        {/* Button */}
                        <TouchableOpacity onPress={onAddDevice}>
                            <View backgroundColor={"#2898FF"}
                                alignItems={"center"} justifyContent={"center"}
                                style={{ width: 32, height: 32 }}
                                borderRadius={20}>
                                <FontAwesome name={"plus"} size={16} color={"#FFF"} />
                            </View>
                        </TouchableOpacity>
                    </HStack>
                </HStack>
            </View>
        </>
    )
}

// #endregion

import Modal from 'react-native-modal';

function CustomDropdownModal(props) {
    // #region Props
    const { showModal = false, setShowModal = () => { } } = props;
    const { cTop, cRight } = props;
    // #endregion

    // #region Helper
    const closeModal = () => setShowModal(false);
    // #endregion

    if (!showModal) {
        return (<></>)
    }

    return (
        <Modal
            isVisible={showModal}
            animationInTiming={1} animationOutTiming={1}
            onBackButtonPress={closeModal}
            onBackdropPress={closeModal}
            backdropOpacity={0}>
            <View style={{
                position: "absolute",
                top: 40,
                right: 0,
            }}>
                <View bgColor={"#0F0"} h={100} w={100} />
            </View>
        </Modal>
    )
}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const lang = "en";

    // #region Initial
    const init = {
        txtActive: "#2898FF",
        txtInActive: "#6A7683",
        bgActive: "#FFF",
        bgInActive: "#EDEEEF",
        roomLs: ["All Devices", "Living Room", "Office", "Kitchen", "Master Bedroom", "Dining Room"],
        homeLs: [
            { label: "s8-office", value: "s8-office" },
            { label: "s10-office", value: "s10-office" },
        ]
    };
    // #endregion

    // #region UseState
    const [tmpLs, setTmpLs] = useState([]);

    const [oriLs, setOriLs] = useState([]);
    const [filterLs, setFilterLs] = useState([]);

    const [refresh, setRefresh] = useState(false);

    const [homePaneInd, setHomePaneInd] = useState(0);
    const [roomLs, setRoomLs] = useState(init.roomLs);

    const [showDeviceConModal, setShowDeviceConModal] = useState(false);

    const [homeVal, setHomeVal] = useState(null);
    // #endregion

    // #region UseEffect

    useEffect(() => {
        if (isFocused) {
            if (homeVal === "s10-office") {
                // setOriLs([]);
                let arr = [...tmpLs];
                setOriLs(arr);
                toggleRefresh();
            } else {
                let arr = Devices;

                arr = arr.map((obj, ind) => (
                    {
                        ...obj,
                        img: { uri: obj.icon },
                        pos: ind,
                    }
                ));

                setOriLs(arr);

                toggleRefresh();
            }
        }
    }, [homeVal, isFocused])
    // #endregion

    // #region Render
    const renderDoubleItem = ({ item, index }) => {
        let [itemA, itemB = {}] = item

        const DetailA = () => GoToDetail(itemA);
        const DetailB = () => GoToDetail(itemB);

        return (
            <View alignItems={"center"} py={2}>
                <HStack justifyContent={"space-between"} style={{ width: width - 40 }}>
                    <Item {...itemA} onPress={DetailA} lang={lang} />
                    {
                        (item.length >= 2) ? <Item {...itemB} onPress={DetailB} lang={lang} /> : <View style={{ width: (width - 40) / 2 }} />
                    }
                </HStack>
            </View>
        )
    };

    const renderItem = ({ item, index }) => {
        const Detail = () => GoToDetail(item);
        const RemoveDevice = () => removeDevice(item);
        return (
            <View m={1}>
                <Item {...item} onPress={Detail} RemoveDevice={RemoveDevice} lang={lang} />
            </View>
        )
    }
    // #endregion

    // #region Filter Query
    const [query, setQuery] = useState("");

    useEffect(() => {
        let arr = [...oriLs];
        if (query !== "" && arr.length > 0) {
            arr = arr.filter(x => x["name"].toLowerCase().includes(query.toLowerCase()));
        }

        // let fArr = Utility.splitItemsIntoK(arr);
        // setItemLs(fArr);

        setFilterLs(arr);
    }, [query, refresh]);
    // #endregion

    // #region Helper
    const GoToDetail = (item) => navigation.navigate("DeviceDetail", item);

    const AddDevice = (item) => {
        let arr = [...tmpLs];

        arr.push(item);

        // Reset Position
        for (let ind in arr) {
            arr[ind].pos = ind;
        }

        setTmpLs(arr);

        setOriLs(arr);

        toggleRefresh();
    }

    const removeDevice = (item) => {
        let arr = [...oriLs];

        // Remove At Position
        const { pos, id } = item;
        arr.splice(+pos, 1);

        // Reset Position
        for (let ind in arr) {
            arr[ind].pos = ind;
        }

        if (homeVal === "s10-office") {
            setTmpLs(arr);

            TuyaRemoveDevice({
                devId: id
            })
                .then(res => {
                    Logger.info({
                        content: res,
                        page: "App",
                        fileName: "tuya_remove_device",
                    });

                    setOriLs(arr);
                    toggleRefresh();

                })
                .catch(err => {
                    console.log(`Error: ${err}`);
                });
        }
        else {
            setOriLs(arr);
            toggleRefresh();
        }
    }

    const toggleDeviceConModal = () => setShowDeviceConModal(!showDeviceConModal);
    const toggleRefresh = () => setRefresh(val => !val);
    // #endregion

    return (
        <>
            <BcDeviceConModal key={showDeviceConModal} AddDevice={AddDevice} showModal={false} setShowModal={setShowDeviceConModal} />
            <CustomDropdownModal showModal={showDeviceConModal} setShowModal={setShowDeviceConModal} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#FFF"} style={{ flex: 1 }}>
                    {/* Device */}
                    <Header
                        homeLs={init.homeLs}
                        homeVal={homeVal} setHomeVal={setHomeVal}
                        onAddDevice={toggleDeviceConModal}>Device</Header>

                    <View style={{ height: 5 }} />

                    <View alignItems={"center"} pt={2}>
                        <Tab
                            dense
                            value={homePaneInd}
                            onChange={(e) => setHomePaneInd(e)}
                            scrollable={true}
                            disableIndicator={true}
                            style={{ width: width - 40 }}>
                            {
                                roomLs.map((room, ind) => (
                                    <Tab.Item
                                        key={ind}
                                        title={room}
                                        titleStyle={(active) => ({
                                            fontSize: 12,
                                            color: active ? init.txtActive : init.txtInActive
                                        })}
                                        buttonStyle={(active) => ({
                                            borderWidth: active ? 1 : 0,
                                            backgroundColor: active ? init.bgActive : init.bgInActive,
                                            borderRadius: 8,
                                            marginRight: 5,
                                            minWidth: 100,
                                        })}
                                    />
                                ))
                            }
                        </Tab>
                    </View>

                    {/* Search */}
                    <Search
                        lang={lang}
                        query={query} setQuery={setQuery} />

                    <TabView
                        value={homePaneInd}
                        onChange={(e) => setHomePaneInd(e)}>
                        <TabView.Item style={{ width: "100%", alignItems: "center" }}>
                            <FlatList
                                data={filterLs}
                                numColumns={2}
                                renderItem={renderItem}
                                contentContainerStyle={{ flexGrow: 1 }}
                                ListEmptyComponent={<EmptyList lang={lang} />}
                                style={{ width: width - 40 }}
                            />
                        </TabView.Item>

                        {
                            roomLs.slice(1).map((room, ind) => (
                                <TabView.Item style={{ width: "100%", alignItems: "center" }}>
                                    <FlatList
                                        numColumns={2}
                                        data={filterLs.slice(ind, ind + 1)}
                                        renderItem={renderItem}
                                        contentContainerStyle={{ flexGrow: 1 }}
                                        ListEmptyComponent={<EmptyList lang={lang} />}
                                        style={{ width: width - 40 }}
                                    />
                                </TabView.Item>
                            ))
                        }

                    </TabView>

                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;