import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Lottie from 'lottie-react-native';
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Animation } from "@config";
import { info, error, Utility } from "@utility";

import { BcSvgIcon, BcBoxShadow, BcHeader } from "@components";

import { Devices } from "@config";

// #region Components
function EmptyList(props) {
    const { lang } = props;
    return (
        <View
            style={{ flexGrow: 1 }}
            alignItems={"center"}
            justifyContent={"center"}>
            <Text style={{
                fontSize: 22,
                fontWeight: '700',
                fontFamily: 'Roboto-Medium',
            }}>{Utility.translate("Empty List", lang)}</Text>
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
    const { name, img, icon, product_name } = props;
    const { onPress = () => { } } = props;
    const borderRadius = 8;
    return (
        <TouchableOpacity onPress={onPress}>
            <BcBoxShadow style={{ borderRadius: borderRadius }}>
                <View
                    py={2}
                    bgColor={"#fff"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    borderRadius={borderRadius}
                    style={{
                        width: (width - 60) / 2
                    }}>
                    <Image
                        source={img}
                        style={{
                            height: 100,
                            width: 100,
                        }}
                        resizeMode={"cover"}
                        alt={name} />
                    <Text style={{
                        fontSize: 18,
                        textAlign: "center",
                        fontFamily: 'Roboto-Medium',
                        color: "#000",
                    }}>{name}</Text>
                </View>
            </BcBoxShadow>
        </TouchableOpacity>
    )
}

function Header(props) {
    const { children } = props;
    return (
        <BcBoxShadow>
            <View
                pb={2}
                alignItems={"center"}
                justifyContent={"flex-end"}
                style={{
                    height: 60,
                    width: width,
                    backgroundColor: "#fff",
                }}>
                <HStack
                    style={{ width: width - 40 }}>
                    {/* Logo */}
                    <Lottie
                        source={Animation.Yuta}
                        style={{
                            width: 80,
                            height: 40
                        }} />
                </HStack>
            </View>
        </BcBoxShadow>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const lang = "en";

    // #region Initial
    const init = {}
    // #endregion

    // #region UseState
    const [oriLs, setOriLs] = useState([]);
    const [filterLs, setFilterLs] = useState([]);
    const [itemLs, setItemLs] = useState([]);

    const [refresh, setRefresh] = useState(false);
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
    const GoToDetail = (item) => {
        navigation.navigate("DeviceDetail", item);
    }
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View bgColor={"#FFF"} style={{ flex: 1 }}>
                {/* Device */}
                <Header>Merchant</Header>

                <View style={{ height: 5 }} />

                {/* Search */}
                <Search
                    lang={lang}
                    query={query} setQuery={setQuery} />

                <FlatList
                    data={itemLs}
                    renderItem={renderItem}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListEmptyComponent={<EmptyList lang={lang} />}
                />

                <View style={{
                    height: 80
                }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;