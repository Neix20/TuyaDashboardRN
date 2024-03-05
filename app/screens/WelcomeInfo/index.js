// FIX ME

import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Utility } from "@utility";

import { TabView } from "@rneui/themed";

import { GenQuestion } from "./Generator";

import PaginationDot from 'react-native-animated-pagination-dot';

// #region Components
function OptionElem(props) {

    const { name, uri, flag = false } = props;
    const { onSelect = () => { } } = props;

    const borderRadius = 8;

    return (
        <TouchableOpacity onPress={onSelect}
            style={{ flex: 1 }}>
            <View
                style={{
                    borderWidth: flag ? 5 : 0,
                    borderRadius: borderRadius,
                    borderColor: Utility.getColor()
                }}>
                {/* Background */}
                <View
                    bgColor={"#000"}
                    opacity={0.5}
                    display={flag ? "none" : "flex"}
                    style={{
                        position: "absolute",
                        zIndex: 2,
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderRadius: borderRadius,
                    }} />

                {/* Name */}
                <View
                    style={{
                        position: "absolute",
                        zIndex: 3,
                        left: 10,
                        bottom: 20,
                    }}>
                    {
                        (flag) ? (
                            <View
                                py={1} px={1} maxW={120}
                                borderRadius={borderRadius}
                                bgColor={Utility.getColor()}>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    fontSize: 16,
                                    color: "#FFF"
                                }}>{name}</Text>
                            </View>
                        ) : (
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 16,
                                color: "#FFF"
                            }}>{name}</Text>
                        )
                    }
                </View>

                {/* Option */}
                <Image
                    source={uri}
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: borderRadius,
                    }}
                    resizeMode={"cover"}
                    alt={name} />
            </View>
        </TouchableOpacity>
    )
}

function Welcome(props) {

    const { question, option, qInd } = props;

    const {
        onNextTab = () => { },
        onSetAns = () => { }
    } = props;

    // #region UseState
    const [ls, setLs] = useState([]);
    const [itemLs, setItemLs] = useState([]);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        let arr = [...option];

        arr = arr.map((obj, ind) => ({
            ...obj,
            pos: ind,
            flag: false
        }));

        setLs(arr);

        let fArr = Utility.splitItemsIntoK(arr, 2);
        setItemLs(fArr);
    }, []);
    // #endregion

    // #region Helper
    const toggleItem = (item) => {
        const { pos, name } = item;

        let arr = [...ls];

        for (let ind in arr) {
            arr[ind].flag = false;
        }

        arr[pos].flag = true;

        setLs(arr);

        let fArr = Utility.splitItemsIntoK(arr, 2);
        setItemLs(fArr);

        let ansObj = {
            question: question,
            answer: name,
            qInd: qInd,
            ansInd: pos,
            pos: qInd,
            flag: true
        };
        onSetAns(ansObj);

        onNextTab();
    }
    // #endregion

    // #region Render
    const renderItem = (item, index) => {
        return (
            <HStack key={index}
                flex={1} space={3} maxHeight={320}>
                {
                    item.map((obj, ind) => {
                        const selItem = () => toggleItem(obj);
                        return (
                            <OptionElem key={ind} onSelect={selItem} {...obj} />
                        )
                    })
                }
            </HStack>
        )
    }
    // #endregion

    return (
        <VStack space={3} flex={1} alignItems={"center"}
            style={{
                width: width
            }}>
            {/* Question */}
            <View style={{ width: width - 40, height: 80 }}>
                <Text style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: "#6A7683",
                }}>{question}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                contentContainerStyle={{ flexGrow: 1 }}>
                {/* Options */}
                <VStack
                    space={3}
                    flexGrow={1}
                    justifyContent={"center"}
                    style={{
                        width: width - 40,
                        height: (option.length <= 4) ? 540 : "100%"
                    }}>
                    {
                        itemLs.map((obj, ind) => renderItem(obj, ind))
                    }
                </VStack>
            </ScrollView>
        </VStack>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region UseState
    const [welcomeLs, setWelcomeLs] = useState([]);
    const [quesInd, setQuesInd] = useState(0);

    const [ansLs, setAnsLs] = useState([]);

    const [ansFlag, setAnsFlag] = useState(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            let qArr = GenQuestion();
            setWelcomeLs(qArr);

            // Initialize Answers
            let aArr = [];
            for (let ind in qArr) {
                let obj = { flag: false };
                aArr.push(obj);
            }
            setAnsLs(aArr);
        }
    }, [isFocused]);

    useEffect(() => {
        let arr = [];

        arr = ansLs.map(obj => obj.flag ? 1 : 0);

        let mFlag = Math.min(...arr) > 0;

        setAnsFlag(mFlag);
    }, [JSON.stringify(ansLs)]);
    // #endregion

    // #region Helper
    const toggleAns = (item) => {
        const { pos } = item;

        let arr = [...ansLs];
        arr[pos] = item;

        setAnsLs(arr);
    }

    const nextTab = () => {
        let tabLen = welcomeLs.length;
        if ((quesInd + 1) < tabLen) {
            setQuesInd(quesInd => quesInd + 1);
        }
    }
    // #endregion

    // #region Navigation
    const GoToHome = () => {
        navigation.navigate("TabNavigation", {
            screen: "Dashboard"
        });
    }
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View bgColor={"#FFF"} flex={1}>

                {/* Header */}
                <View style={{ height: 30 }} />

                {/* Header Title */}
                <View alignItems={"center"}>
                    <HStack
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        style={{ width: width - 40 }}>
                        <View>
                            <Text style={{
                                fontSize: 32,
                                fontWeight: "bold",
                                color: "#000",
                            }}>Welcome</Text>
                        </View>

                        {
                            (ansFlag) ? (
                                <TouchableOpacity onPress={GoToHome}>
                                    <View 
                                        backgroundColor={Utility.getColor()}
                                        borderRadius={20}
                                        alignItems={"center"} justifyContent={"center"}
                                        style={{ width: 40, height: 40 }}
                                    >
                                        <Entypo name={"check"} size={30} color={"#FFF"} />
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <></>
                            )
                        }
                    </HStack>
                </View>

                {/* Body */}
                <TabView
                    value={quesInd}
                    onChange={(e) => setQuesInd(e)}>
                    {
                        welcomeLs.map((obj, ind) => (
                            <TabView.Item key={ind}>
                                <Welcome qInd={ind}
                                    onSetAns={toggleAns}
                                    onNextTab={nextTab}
                                    {...obj} />
                            </TabView.Item>
                        ))
                    }
                </TabView>

                {/* Footer */}
                <View
                    alignItems={"center"}
                    justifyContent={"center"}
                    style={{ height: 80 }}>
                    <View alignItems={"center"} style={{ width: width - 40 }}>
                        <View style={{ width: 200 }} >
                            <PaginationDot
                                activeDotColor={"#000"}
                                inactiveDotColor={"#000"}
                                curPage={quesInd}
                                maxPage={welcomeLs.length}
                                sizeRatio={2}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Index;