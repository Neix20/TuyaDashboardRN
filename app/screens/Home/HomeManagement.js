import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { Images } from "@config";

import { BcHeader, BcLoading, BcBoxShadow } from "@components";

import { fetchHomeList } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function EmptyList(props) {
    const style = {
        txt: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: "#d3d3d3",
            fontWeight: "700"
        }
    }
    return (
        <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <FontAwesome name={"home"} color={"#e6e6e6"} size={80} />
                <Text style={style.txt}>Please Add Home to your SmartLife Account</Text>
            </VStack>
        </View>
    )
}

// #region Components
function HomeList(props) {

    // #region Props
    const { data = [] } = props;
    const { onItemSelect = () => { } } = props;
    // #endregion

    // #region Render
    const renderItem = ({ item, index }) => {
        const { Name } = item;
        const selectItem = () => onItemSelect(item);
        return (
            <TouchableOpacity onPress={selectItem}>
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

    if (data.length == 0) {
        return (<EmptyList />)
    }

    return (
        <View bgColor={"#FFF"} alignItems={"center"}>
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ width: "90%" }}
            />
        </View>
    )
}

function AddHome(props) {
    const { onSelect = () => { } } = props;
    return (
        <TouchableOpacity onPress={onSelect}>
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
        </TouchableOpacity>
    )
}
// #endregion

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

    // #region Navigation
    const GoToHomeInfo = (item) => navigation.navigate("HomeInfo", item);
    const GoToAddHome = () => navigation.navigate("AddHome");
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#F6F6F6"} style={{ flex: 1 }}>
                    {/* Header */}
                    <BcHeader>Home Management</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack space={3} flexGrow={1}>
                            {/* Home List Panel */}
                            <HomeList data={homeLs} onItemSelect={GoToHomeInfo} />

                            {/* Add Home  */}
                            {/* <AddHome onSelect={GoToAddHome} /> */}
                        </VStack>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;