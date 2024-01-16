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
import { useToggle } from "@hooks";

function useHome() {

    const init = {
        home: {
            Name: "",
            flag: false,
        }
    }

    const dispatch = useDispatch();

    const [home, setHome] = useState(init.home);
    const [ls, setLs] = useState([]);

    const updateLs = (data = [], homeId) => {

        if (data.length <= 0) {
            return;
        }

        let arr = [...data];

        arr = arr.map((obj, pos) => ({
            ...obj,
            pos,
            flag: false,
        }))

        if (homeId == -1) {
            arr[0].flag = true;
            setHome(_ => arr[0]);
            dispatch(Actions.onChangeHomeId(arr[0].Id));
        } else {
            for (const obj of arr) {
                if (obj.Id == homeId) {
                    obj.flag = true;
                    setHome(_ => obj);
                    dispatch(Actions.onChangeHomeId(obj.Id));
                }
            }
        }

        setLs(_ => arr);
    }

    const selectHome = ({ pos }) => {
        let arr = [...ls];

        for (let ind in arr) {
            arr[ind].flag = false;
        }

        arr[pos].flag = true;

        setLs(_ => arr);

        const { Id: HomeId } = arr[pos];
        setHome(arr[pos]);
        dispatch(Actions.onChangeHomeId(HomeId));
    }

    return [home, ls, updateLs, selectHome];
}

function HomeItem(props) {

    const { children = null, onPress = () => { } } = props;

    const { flag = false, IconBtn = () => <></>, IconName = "", IconColor = "#000" } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
        }
    }

    return (
        <TouchableOpacity onPress={onPress} style={{ width: "90%" }}>
            <HStack alignItems={"center"} style={{ height: 40 }}>
                <View flex={.1}>
                    {flag ? <IconBtn name={IconName} color={IconColor} size={20} /> : <></>}
                </View>
                <View flex={.9}>
                    <Text style={style.title}>{children}</Text>
                </View>
            </HStack>
        </TouchableOpacity>
    )
}

function HomeModal(props) {

    // #region Props
    const { data = [], onItemSelect = () => { } } = props;
    const { onSelectHomeManagement = () => { } } = props;
    // #endregion

    // #region Render
    const renderItem = ({ item, index }) => {
        const { Name = "", flag = false } = item;
        const selectItem = () => onItemSelect(item);

        return (
            <HomeItem key={index} 
                onPress={selectItem} flag={flag}
                IconBtn={FontAwesome5} IconName={"check"} IconColor={"#28984f"}>
                {Name}
            </HomeItem>
        )
    }
    // #endregion

    return (
        <TopModal showCross={false} {...props}>
            <View alignItems={"center"} width={"100%"}>
                <FlatList data={data} renderItem={renderItem} style={{ width: "96%" }} />
                <Divider my={2} width={"90%"} />
                <HomeItem onPress={onSelectHomeManagement} flag={true}
                    IconBtn={FontAwesome5} IconName={"home"} IconColor={"#ccc"}>Home Management</HomeItem>
            </View>
        </TopModal>
    )
}

function Index(props) {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);

    // #region UseState
    const [home, homeLs, setHomeLs, selectHome] = useHome();
    const [showHomeModal, setShowHomeModal, toggleHomeModal] = useToggle(false);

    const [loading, setLoading] = useState(false);
    // #endregion

    useEffect(() => {
        if (isFocused) {
            HomeList();
        }
    }, [isFocused]);

    const onSelectHome = (item) => {
        selectHome(item);
        toggleHomeModal();
    }

    const GoToHomeManagement = () => {
        navigation.navigate("HomeManagement");
        toggleHomeModal();
    };

    const HomeList = () => {
        setLoading(true);
        fetchHomeList({
            param: {
                UserId: userId,
            },
            onSetLoading: setLoading
        })
            .then(data => {
                setHomeLs(data, homeId);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }

    const { Name = "" } = home;

    return (
        <>
            <BcLoading loading={loading} />
            <HomeModal
                data={homeLs} onItemSelect={onSelectHome}
                onSelectHomeManagement={GoToHomeManagement}
                showModal={showHomeModal} setShowModal={setShowHomeModal} />
            <TouchableOpacity onPress={toggleHomeModal}>
                <HStack alignItems={"center"} space={2}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 20,
                        color: "#c3c3c3"
                    }}>{Name}</Text>
                    <FontAwesome5 name={"caret-down"} color={"#c3c3c3"} size={32} />
                </HStack>
            </TouchableOpacity>
        </>
    )
}

export default Index;