import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { Images } from "@config";

import { BcHeader, BcLoading, BcBoxShadow } from "@components";

import { fetchHomeList } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function HomeList(props) {

    // #region Props
    const { data: ls = [] } = props;
    // #endregion

    // #region Render
    const renderItem = ({ item, index }) => {
        const { Name } = item;
        return (
            <TouchableOpacity>
                <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{ height: 40 }}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 18
                    }}>{Name}</Text>
                    <FontAwesome5 name={"angle-right"} color={"#CCC"} size={28} />
                </HStack>
            </TouchableOpacity>
        )
    }
    // #endregion

    if (ls.length == 0) {
        return (<></>)
    }

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"} alignItems={"center"}>
                <FlatList
                    data={ls}
                    renderItem={renderItem}
                    style={{ width: "90%" }}
                />
            </View>
        </BcBoxShadow>
    )
}

function AddHome(props) {
    const { onPress: onSelect = () => { } } = props;
    return (
        <TouchableOpacity onPress={onSelect}>
            <BcBoxShadow>
                <View
                    py={3}
                    bgColor={"#fff"}
                    alignItems={"center"}>
                    <View width={"90%"}>
                        <Text style={[{
                            fontSize: 16,
                            color: "#2898FF",
                            fontFamily: "Roboto-Medium",
                        }]}>Create Home</Text>
                    </View>
                </View>
            </BcBoxShadow>
        </TouchableOpacity>
    )
}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Redux
    const userId = useSelector(Selectors.userIdSelect);
    // #endregion

    // #region UseState
    const [homeLs, setHomeLs] = useState([]);
    const [loading, setLoading] = useState(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchHomeList({
                param: {
                    UserId: userId,
                },
                onSetLoading: setLoading
            })
                .then(data => {
                    setHomeLs(data);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [isFocused]);
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {/* Header */}
                    <BcHeader>Home Management</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack space={3}
                            flexGrow={1}>
                            {/* Home List Panel */}
                            <HomeList data={homeLs} />

                            {/*  */}
                            <AddHome />
                        </VStack>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;