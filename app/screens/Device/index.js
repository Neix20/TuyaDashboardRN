import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { BcSvgIcon, BcBoxShadow, BcDeviceConModal, BcDropdown } from "@components";

import { Devices } from "@config";

import { Tab, TabView } from "@rneui/themed";

// #region Components
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
    const { onPress = () => { } } = props;
    const borderRadius = 8;
    return (
        <TouchableOpacity onPress={onPress}>
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
    )
}

function Header(props) {

    const { children } = props;
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
                    zIndex: 100,
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
                            items={homeLs} placeholder={"Home"}
                            value={homeVal} setValue={setHomeVal}
                            width={120} height={40}
                        />

                        {/* Button */}
                        <TouchableOpacity onPress={onAddDevice}>
                            <View backgroundColor={"#2898FF"}
                                alignItems={"center"} justifyContent={"center"}
                                style={{
                                    width: 40, height: 40
                                }}
                                borderRadius={20}>
                                <FontAwesome name={"plus"} size={18} color={"#FFF"} />
                            </View>
                        </TouchableOpacity>
                    </HStack>
                </HStack>
            </View>
        </>
    )
}

// #endregion

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
    const [oriLs, setOriLs] = useState([]);
    const [filterLs, setFilterLs] = useState([]);
    const [itemLs, setItemLs] = useState([]);

    const [refresh, setRefresh] = useState(false);

    const [homePaneInd, setHomePaneInd] = useState(0);
    const [roomLs, setRoomLs] = useState(init.roomLs);

    const [showDeviceConModal, setShowDeviceConModal] = useState(false);

    const [homeVal, setHomeVal] = useState(null);

    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            let arr = Devices;

            arr = arr.map((obj, ind) => (
                {
                    ...obj,
                    img: { uri: obj.icon },
                }
            ));

            setOriLs(arr);

            setFilterLs(arr);

            let fArr = Utility.splitItemsIntoK(arr);
            setItemLs(fArr);

            setRefresh(val => !refresh);
        }
    }, [isFocused]);
    // #endregion

    // #region Render
    const renderItem = ({ item, index }) => {
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
    // #endregion

    // #region Filter Query
    const [query, setQuery] = useState("");

    useEffect(() => {
        let arr = [...oriLs];
        if (query !== "" && arr.length > 0) {
            arr = arr.filter(x => x["name"].toLowerCase().includes(query.toLowerCase()));
        }

        let fArr = Utility.splitItemsIntoK(arr);
        setItemLs(fArr);

        setFilterLs(arr);
    }, [query, refresh]);
    // #endregion

    // #region Helper
    const GoToDetail = (item) => navigation.navigate("DeviceDetail", item);

    const toggleDeviceConModal = () => setShowDeviceConModal(!showDeviceConModal);
    // #endregion

    return (
        <>
            <BcDeviceConModal key={showDeviceConModal} showModal={showDeviceConModal} setShowModal={setShowDeviceConModal} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#FFF"} style={{ flex: 1 }}>
                    {/* Device */}
                    <Header
                        homeLs={init.homeLs}
                        homeVal={homeVal} setHomeVal={setHomeVal}
                        onAddDevice={toggleDeviceConModal}>Device</Header>

                    <View style={{ height: 5 }} />

                    <View alignItems={"center"} pt={2}>
                        {/* <Tab
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
                        </Tab> */}
                    </View>

                    {/* Search */}
                    <Search
                        lang={lang}
                        query={query} setQuery={setQuery} />

                    <TabView
                        value={homePaneInd}
                        onChange={(e) => setHomePaneInd(e)}>
                        <TabView.Item style={{ width: "100%" }}>
                            <FlatList
                                data={itemLs}
                                renderItem={renderItem}
                                contentContainerStyle={{ flexGrow: 1 }}
                                ListEmptyComponent={<EmptyList lang={lang} />}
                            />
                        </TabView.Item>
                        {
                            roomLs.slice(1).map((room, ind) => (
                                <TabView.Item style={{ width: "100%" }}>
                                    <FlatList
                                        data={itemLs.slice(ind, ind + 1)}
                                        renderItem={renderItem}
                                        contentContainerStyle={{ flexGrow: 1 }}
                                        ListEmptyComponent={<EmptyList lang={lang} />}
                                    />
                                </TabView.Item>
                            ))
                        }
                    </TabView>

                    <View style={{ height: 80 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;