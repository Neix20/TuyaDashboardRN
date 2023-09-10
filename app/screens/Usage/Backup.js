import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { Images, Svg } from "@config";

import { BcBoxShadow, BcSvgIcon } from "@components";

// #region Components
function Header(props) {
    const { children } = props;

    return (
        <BcBoxShadow>
            <View
                alignItems={"center"}
                justifyContent={"center"}
                style={{
                    height: 60,
                    width: width,
                    backgroundColor: "#fff",
                }}>
                <HStack
                    style={{ width: width - 40 }}
                    alignItems={"center"}
                    justifyContent={"space-between"}>
                    {/* Logo */}
                    <BcSvgIcon name={"Yatu"} width={80} height={40} />
                </HStack>
            </View>
        </BcBoxShadow>
    )
}

function EmptyList(props) {
    return (
        <View flexGrow={1}
            alignItems={"center"} justifyContent={"center"}>
            <UsageSign />
        </View>
    )
}

function UsageSign(props) {
    return (
        <VStack space={2}
            alignItems={"center"}
            style={{ width: width - 40 }}>

            <FontAwesome name={"bolt"}
                color={"#e6e6e6"}
                size={80} />

            <Text style={{
                fontFamily: "Roboto-Medium",
                fontSize: 18,
                color: "#d3d3d3",
                textAlign: "center",
            }}>
                We provide a variety of case scenario for any business model
            </Text>
        </VStack>
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

    const { name, uri } = props;
    const { onSelect = () => { } } = props;

    // return (
    //     <TouchableOpacity onPress={onSelect}>
    //         <BcBoxShadow>
    //             <VStack
    //                 pb={3} space={2}
    //                 bgColor={"#FFF"}
    //                 alignItems={"center"}
    //                 style={{ width: width }}>

    //                 {/* Banner */}
    //                 <View>
    //                     <Image
    //                         source={uri}
    //                         style={{
    //                             width: width - 40,
    //                             height: 120,
    //                         }}
    //                         resizeMode={"cover"}
    //                         alt={name} />

    //                 </View>

    //                 {/* Description */}
    //                 <HStack alignItems={"center"} style={{ width: width - 40 }}>
    //                     <Text style={{
    //                         fontFamily: "Roboto-Bold",
    //                         fontSize: 16,
    //                         color: "#000",
    //                     }}>{name}</Text>
    //                 </HStack>
    //             </VStack>
    //         </BcBoxShadow>
    //     </TouchableOpacity>
    // )

    return (
        <TouchableOpacity onPress={onSelect}>
            <BcBoxShadow style={{ borderRadius: 15 }}>
                <View>
                    <Image
                        source={uri}
                        style={{ 
                            width: width - 40, 
                            maxHeight: 150,
                            borderRadius: 15 
                        }}
                        resizeMethod="auto"
                        resizeMode={"cover"}
                        alt={name} />
                </View>
            </BcBoxShadow>
        </TouchableOpacity>
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
        usageLs: [
            {
                name: "Energy Saving",
                uri: Images.esgBanner,
            },
            {
                name: "Industry Workflow Monitoring",
                uri: Images.esgIIBanner,
            },
            {
                name: "Fault Maintenance",
                uri: Images.esgIIIBanner,
            },
        ]
    }
    // #endregion

    // #region UseState
    const [refresh, setRefresh] = useState(false);

    const [oriLs, setOriLs] = useState(init.usageLs);
    const [filterLs, setFilterLs] = useState([]);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            setOriLs(init.usageLs);
        }
    }, [isFocused]);
    // #endregion

    // #region Filter Query
    const [query, setQuery] = useState("");

    useEffect(() => {
        let arr = [...oriLs];
        if (query !== "" && arr.length > 0) {
            arr = arr.filter(x => x["name"].toLowerCase().includes(query.toLowerCase()));
        }

        setFilterLs(arr);
    }, [query, refresh]);
    // #endregion

    // #region Render
    const renderItem = (item, index) => {

        const onSelectItem = () => toggleSelectItem(item);

        return (
            <Item
                key={index}
                onSelect={onSelectItem}
                {...item} />
        )
    }
    // #endregion

    // #region Helper
    const toggleSelectItem = (item) => {
        navigation.navigate("UsageInfo", item);
    };
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View bgColor={"#f6f7fa"} style={{ flex: 1 }}>

                {/* Header */}
                <Header />

                <View style={{ height: 10 }} />

                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <VStack
                        flexGrow={1}
                        alignItems={"center"}
                        space={3}>
                        {
                            filterLs.map((obj, ind) => renderItem(obj, ind))
                        }
                    </VStack>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;