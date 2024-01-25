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

import { fetchProfileWorkspace } from "@api";
import { useToggle } from "@hooks";

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
                <FlatList data={data}
                    renderItem={renderItem} style={{ width: "100%" }} />
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

    const { hook = [] } = props;

    if (hook.length <= 0) {
        return;
    }

    // #region UseState
    const [profileWs, profileWsLs, setProfileWsLs, selectProfileWs] = hook;
    const [setProfileWsModal, setShowProfileWsModal, toggleProfileWsModal] = useToggle(false);

    const [loading, setLoading] = useState(false);
    // #endregion

    useEffect(() => {
        if (isFocused) {
            ProfileWorkspace();
        }
    }, [isFocused]);

    // #region Helper
    const onSelectProfileWs = (item) => {
        selectProfileWs(item);
        toggleProfileWsModal();
    }

    const GoToProfileWorkspace = () => {
        navigation.navigate("ProfileWorkspace");
        toggleProfileWsModal();
    };

    const ProfileWorkspace = () => {
        setLoading(true);

        fetchProfileWorkspace({
            param: {
                UserId: userId,
            },
            onSetLoading: setLoading
        })
            .then(data => {
                console.log(data[0]);
                setProfileWsLs(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    const { Name = "Default", WsColor = "#c3c3c3" } = profileWs;

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
                        fontSize: 18,
                        color: WsColor
                    }}>{Name}</Text>
                    <FontAwesome5 name={"caret-down"} color={WsColor} size={32} />
                </HStack>
            </TouchableOpacity>
        </>
    )
}

export default Index;