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

import { BcSvgIcon, BcBoxShadow, BcDeviceConModal, BcDropdown, BcLoading, BcYatuHome } from "@components";

import { Devices } from "@config";

import { Tab, TabView } from "@rneui/themed";

import { removeDevice as TuyaRemoveDevice } from "@volst/react-native-tuya";

import PaginationDot from 'react-native-animated-pagination-dot';

import TopModal from "@components/Modal/TopModal";
import Modal from "react-native-modal";

// #region Add Device Modal
function AddDeviceModal(props) {
    return (
        <TopModal showCross={false} {...props}>
            <View alignItems={"center"} width={"100%"}>
                <TouchableOpacity style={{ width: "90%" }}>
                    <HStack alignItems={"center"} style={{ height: 40 }}>
                        <View flex={.1}>
                            <Feather name={"target"} color={"#ccc"} size={20} />
                        </View>
                        <View flex={.9}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18,
                            }}>Scan Device</Text>
                        </View>
                    </HStack>
                </TouchableOpacity>
            </View>
        </TopModal>
    )
}

function AddDeviceBtn(props) {

    // #region UseState
    const [showAdModal, setShowAdModal] = useState(false);
    // #endregion

    // #region Helper
    const toggleAdModal = () => setShowAdModal((val) => !val);
    // #endregion

    return (
        <>
            <AddDeviceModal showModal={showAdModal} setShowModal={setShowAdModal} />
            <TouchableOpacity onPress={toggleAdModal}>
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
    const { onSelectRoomManagement = () => {} } = props;
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

                <TouchableOpacity style={{ width: "90%" }}>
                    <HStack
                        alignItems={"center"}
                        style={{ height: 40 }}>
                        <HStack alignItems={"center"} space={3}>
                            <MaterialCommunityIcons name={"view-grid-outline"} size={28} />
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18
                            }}>Grid View</Text>
                        </HStack>
                    </HStack>
                </TouchableOpacity>

                <TouchableOpacity onPress={onSelectRoomManagement}
                    style={{ width: "90%" }}>
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

    // #region UseState
    const [showTdModal, setShowTdModal] = useState(false);
    // #endregion

    // #region Helper
    const toggleTabDetail = () => setShowTdModal((val) => !val);
    // #endregion

    // #region Navigation
    const GoToRoomManagement = () => {
        navigation.navigate("RoomManagement");
        toggleTabDetail();
    }
    // #endregion

    return (
        <>
            <TabDetailModal onSelectRoomManagement={GoToRoomManagement}
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
    return (
        <BcBoxShadow style={{ width: "100%" }}>
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

                    {/* Button */}
                    <AddDeviceBtn />
                </HStack>
            </View>
        </BcBoxShadow>
    )
}

function DeviceItem(props) {

    const { name, img, icon, product_name, description } = props;
    const { onSelect = () => { } } = props;
    const borderRadius = 8;

    return (
        <TouchableOpacity onPress={onSelect}>
            <BcBoxShadow
                style={{
                    borderRadius: borderRadius,
                    minWidth: 170,
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

function CardGradientItem(props) {
    const { bgName = "CardGradientRed" } = props;
    return (
        <View style={{ height: 180, width: width - 40 }}>
            {/* <BcSvgIcon name={bgName} /> */}
            <View bgColor={"#00F"} flex={1} borderRadius={8} />
            <VStack p={2}
                space={4}
                position={"absolute"}>
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

                <HStack alignItems={"center"} space={1}>
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

function CardGradient(props) {
    return (
        <View>
            <CardGradientItem {...props} />
            <View style={{
                position: "absolute",
                alignItems: "center",
                left: 0,
                right: 0,
                bottom: 20,
            }}>
                <PaginationDot
                    activeDotColor={"#F00"}
                    inactiveDotColor={"#fff"}
                    curPage={1}
                    maxPage={4}
                />
            </View>
        </View>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Props
    const lang = "en";
    // #endregion

    // #region Init
    const init = {
        txtActive: "#2898FF",
        txtInActive: "#6A7683",
        bgActive: "#FFF",
        bgInActive: "#EDEEEF",
        roomLs: ["All Devices", "Living Room", "Office", "Kitchen", "Master Bedroom", "Dining Room"],
    }
    // #endregion

    // #region UseState
    const [deviceLs, setDeviceLs] = useState([]);
    const [viewMode, setViewMode] = useState("grid");

    const [roomLs, setRoomLs] = useState(init.roomLs);

    const [roomPaneInd, setRoomPaneInd] = useState(0);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            let arr = Devices;

            arr = arr.map((obj, ind) => (
                {
                    ...obj,
                    img: { uri: obj.icon },
                    pos: ind,
                }
            ));

            setDeviceLs(arr);
        }
    }, [isFocused]);
    // #endregion

    const GoToDetail = (item) => navigation.navigate("DeviceDetail", item);

    // #region Render
    const renderDeviceItem = ({ item, index }) => {
        const onSelect = () => GoToDetail(item);
        return (
            <DeviceItem key={index} onSelect={onSelect}
                {...item} />
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
                    // backgroundColor: active ? init.bgActive : init.bgInActive,
                    // borderWidth: active ? 1 : 0,
                    borderRadius: 8,
                    marginRight: 10,
                    paddingVertical: 0,
                    paddingHorizontal: 0,
                })}
            />
        )
    }

    const renderTabViewItem = ({ item, index }) => {
        return (
            <></>
        )
    }
    // #endregion

    // #region Helper
    const toggleViewMode = () => {
        const val = (viewMode === "list") ? "grid" : "list";
        setViewMode(val);
    };
    // #endregion

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#FFF"} style={{ flex: 1 }}>

                    {/* Header */}
                    <Header />

                    <View style={{ height: 10 }} />

                    {/* Card Gradient */}
                    <View alignItems={"center"}>
                        <CardGradient />
                    </View>

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
                                <TabDetail />
                            </View>
                        </HStack>
                    </View>

                    <View style={{ height: 450 }} />

                    {/* <View flexGrow={1}
                    alignItems={"center"}>
                    <FlatList
                        key={viewMode}
                        data={deviceLs}
                        renderItem={renderDeviceItem}
                        style={{ flex: 1, width: width - 30 }}
                        contentContainerStyle={{
                            flexDirection: (viewMode === "grid") ? "row" : "column",
                            flexWrap: (viewMode === "grid") ? "wrap" : "nowrap",
                            justifyContent: (viewMode === "grid") ? "space-between" : "center",
                            padding: 5, rowGap: 8,
                        }}
                        ListEmptyComponent={<EmptyList lang={lang} />}
                    />
                </View> */}

                    {/* <TabView
                    value={roomPaneInd}
                    onChange={(e) => setRoomPaneInd(e)}>
                    <TabView.Item
                        style={{ width: "100%", alignItems: "center" }}>
                        <FlatList key={viewMode}
                            data={deviceLs}
                            renderItem={renderDeviceItem}
                            style={{ flex: 1, width: width - 30 }}
                            contentContainerStyle={{
                                flexDirection: (viewMode === "grid") ? "row" : "column",
                                flexWrap: (viewMode === "grid") ? "wrap" : "nowrap",
                                justifyContent: (viewMode === "grid") ? "space-between" : "center",
                                padding: 5, rowGap: 8,
                            }}
                            ListEmptyComponent={<EmptyList lang={lang} />}
                        />
                    </TabView.Item>

                    {
                        roomLs.map((room, ind) => {
                            const flag = Math.random() > 0.3;
                            return (
                                <TabView.Item style={{ width: "100%", alignItems: "center" }}>
                                    <FlatList key={ind + viewMode}
                                        data={deviceLs.slice(ind, ind + 2)}
                                        renderItem={renderDeviceItem}
                                        style={{ flex: 1, width: width - 30 }}
                                        contentContainerStyle={{
                                            flexDirection: (flag) ? "row" : "column",
                                            flexWrap: (flag) ? "wrap" : "nowrap",
                                            justifyContent: (flag) ? "space-between" : "center",
                                            padding: 5, rowGap: 8,
                                        }}
                                        ListEmptyComponent={<EmptyList lang={lang} />}
                                    />
                                </TabView.Item>
                            )
                        })
                    }
                </TabView> */}

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>
        </>
    )
}

export default Index;