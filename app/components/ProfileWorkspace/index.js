import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, FlatList } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { BcLoading } from "@components"

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import TopModal from "@components/Modal/TopModal";

import { fetchProfileWorkspace, fetchUpdateProfileWorkspace } from "@api";
import { useToggle } from "@hooks";

// #region Custom Hooks
function useProfileWs() {

    const init = {
        profileWs: {
            Name: "",
            flag: false,
        }
    }

    const dispatch = useDispatch();

    const [ws, setWs] = useState(init.profileWs);
    const [ls, setLs] = useState([]);

    const updateLs = (data = [], profileWorkspace) => {

        if (data.length <= 0) {
            return;
        }

        let arr = [...data];

        arr = arr.map((obj, pos) => ({
            ...obj,
            pos,
            flag: false,
        }))

        if (profileWorkspace == -1) {
            arr[0].flag = true;
            setWs(_ => arr[0]);
            dispatch(Actions.onChangeProfileWorkspaceId(arr[0].Id));
        } else {
            for (const obj of arr) {
                if (obj.Id == profileWorkspace) {
                    obj.flag = true;
                    setWs(_ => obj);
                    dispatch(Actions.onChangeProfileWorkspaceId(obj.Id));
                }
            }
        }

        setLs(_ => arr);
    }

    const selectProfileWs = ({ pos }) => {
        let arr = [...ls];

        for (let ind in arr) {
            arr[ind].flag = false;
        }

        arr[pos].flag = true;

        setLs(_ => arr);

        const { Id: ProfileWorkspaceId } = arr[pos];
        setWs(arr[pos]);
        dispatch(Actions.onChangeProfileWorkspaceId(ProfileWorkspaceId));
    }

    return [ws, ls, updateLs, selectProfileWs];
}
// #endregion

// #region Components
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
    const { onSelectManagement = () => { } } = props;
    // #endregion

    // #region Render
    const renderItem = ({ item, index }) => {

        const { Name = "", flag = false } = item;
        const selectItem = () => onItemSelect(item);

        return (
            <View alignItems={"center"}>
                <HomeItem key={index}
                    onPress={selectItem} flag={flag}
                    IconBtn={FontAwesome5} IconName={"check"} IconColor={"#28984f"}>
                    {Name}
                </HomeItem>
            </View>
        )
    }
    // #endregion

    return (
        <TopModal showCross={false} {...props}>
            <View alignItems={"center"} width={"100%"}>
                <FlatList data={data} renderItem={renderItem} style={{ width: "100%" }} />
                <Divider my={2} width={"90%"} />
                <HomeItem onPress={onSelectManagement} flag={true}
                    IconBtn={Ionicons} IconName={"settings-sharp"} IconColor={"#ccc"}>ProfileWorkspace</HomeItem>
            </View>
        </TopModal>
    )
}
// #endregion

function Index(props) {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);

    // #region UseState
    const [profileWs, profileWsLs, setProfileWsLs, selectProfileWs] = useProfileWs();
    const [setProfileWsModal, setShowProfileWsModal, toggleProfileWsModal] = useToggle(false);

    const [loading, setLoading] = useState(false);
    // #endregion

    useEffect(() => {
        if (isFocused) {
            ProfileWorkspace();
        }
    }, [isFocused]);

    // #region Helper
    // const onSelectProfileWs = (item) => {
    //     selectProfileWs(item);
    //     toggleProfileWsModal();
    // }

    const onSelectProfileWs = (item) => {
        const { Id = 0, pos, Name, Code = "" } = item;
        
        let ProfileWorkspaceId = Code.slice(Code.length - 1);

        if (ProfileWorkspaceId == 1) {
            ProfileWorkspaceId = 0;
        }
        
        setLoading(true);
        fetchUpdateProfileWorkspace({
            param: {
                UserId: userId,
                ProfileWorkspaceId
            },
            onSetLoading: setLoading
        })
        .then(data => {
            selectProfileWs(item);
            toggleProfileWsModal();
        })
        .catch(err => {
            setLoading(false);
            console.error(err);
        })
    }

    const GoToProfileWorkspace = () => {
        navigation.navigate("ProfileWorkspace");
        toggleProfileWsModal();
    };

    const ProfileWorkspace = () => {
        setLoading(true);
        Logger.info({
            UserId: userId
        })
        fetchProfileWorkspace({
            param: {
                UserId: userId,
            },
            onSetLoading: setLoading
        })
            .then(data => {
                setProfileWsLs(data, homeId);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    const { Code = "PFWS0001" } = profileWs;

    return (
        <>
            <BcLoading loading={loading} />
            <HomeModal
                data={profileWsLs} onItemSelect={onSelectProfileWs}
                onSelectManagement={GoToProfileWorkspace}
                showModal={setProfileWsModal} setShowModal={setShowProfileWsModal} />
            <TouchableOpacity onPress={toggleProfileWsModal}>
                <HStack alignItems={"center"} space={2}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 20,
                        color: "#c3c3c3"
                    }}>{Code}</Text>
                    <FontAwesome5 name={"caret-down"} color={"#c3c3c3"} size={32} />
                </HStack>
            </TouchableOpacity>
        </>
    )
}

export default Index;