import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, FlatList } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { BcLoading } from "@components"

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import TopModal from "@components/Modal/TopModal";

import { fetchHomeList } from "@api";

function HomeModal(props) {

    // #region Props
    const { data = [], onItemSelect = () => { } } = props;
    const { onSelectHomeManagement = () => { } } = props;
    // #endregion

    // #region Render
    const renderItem = ({ item, index }) => {
        const { Name, pos, flag } = item;
        const selectItem = () => onItemSelect(item);

        return (
            <TouchableOpacity onPress={selectItem}>
                <HStack alignItems={"center"} style={{ height: 40 }}>
                    {
                        (flag) ? (
                            <View flex={.1}>
                                <FontAwesome5 name={"check"} color={"#28984f"} size={20} />
                            </View>
                        ) : (
                            <View flex={.1}></View>
                        )
                    }
                    <View flex={.9}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18,
                        }}>{Name}</Text>
                    </View>
                </HStack>
            </TouchableOpacity>
        )
    }
    // #endregion

    return (
        <TopModal showCross={false} {...props}>
            <View alignItems={"center"} width={"100%"}>
                <FlatList data={data} renderItem={renderItem} style={{ width: "90%" }} />
                <Divider my={2} width={"90%"} />
                <TouchableOpacity onPress={onSelectHomeManagement} style={{ width: "90%" }}>
                    <HStack alignItems={"center"} style={{ height: 40 }}>
                        <View flex={.1}>
                            <FontAwesome name={"home"} color={"#ccc"} size={20} />
                        </View>
                        <View flex={.9}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18,
                            }}>Home Management</Text>
                        </View>
                    </HStack>
                </TouchableOpacity>
            </View>
        </TopModal>
    )
}

function Index(props) {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const userId = useSelector(Selectors.userIdSelect);
    const dispatch = useDispatch();

    // #region Initial
    const init = {
        home: {
            Name: "",
            pos: 0,
            flag: false,
        }
    }
    // #endregion

    // #region UseState
    const [home, setHome] = useState(init.home);
    const [homeLs, setHomeLs] = useState([]);
    const [showHomeModal, setShowHomeModal] = useState(false);

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
                    if (data.length > 0) {
                        const { Id: homeId } = data[0];
                        setHome(data[0]);
                        dispatch(Actions.onChangeHomeId(homeId));
                    }
                    setHomeLs(data);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`Error: ${err}`);
                })
        }
    }, [isFocused]);
    // #endregion

    // #region Helper
    const toggleHomeModal = () => setShowHomeModal((val) => !val);
    const selectHome = ({ pos }) => {
        let arr = [...homeLs];

        for (let ind in arr) {
            arr[ind].flag = false;
        }

        arr[pos].flag = true;
        
        setHomeLs(arr);
        
        const { Id: homeId } = arr[pos];
        setHome(arr[pos]);

        dispatch(Actions.onChangeHomeId(homeId));

        toggleHomeModal();
    }
    // #endregion

    // #region Navigation
    const GoToHomeManagement = () => {
        navigation.navigate("HomeManagement");
        toggleHomeModal();
    };
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <HomeModal
                data={homeLs} onItemSelect={selectHome}
                onSelectHomeManagement={GoToHomeManagement}
                showModal={showHomeModal} setShowModal={setShowHomeModal} />
            <TouchableOpacity onPress={toggleHomeModal}>
                <HStack alignItems={"center"} space={2}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 20,
                        color: "#c3c3c3"
                    }}>{home.Name}</Text>
                    <FontAwesome5 name={"caret-down"} color={"#c3c3c3"} size={32} />
                </HStack>
            </TouchableOpacity>
        </>
    )
}

export default Index;