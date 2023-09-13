import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { fetchProfileInfo } from "@api";

import { BcLoading } from "@components";

// #region Components
function Header(props) {
    const { onSelectSetting = () => { } } = props;
    return (
        <View alignItems={"center"}>
            <HStack width={"90%"}
                alignItems={"center"}
                justifyContent={"flex-end"}
                style={{ height: 60 }}>
                {/* Btn */}
                <HStack alignItems={"center"} space={3}>
                    <TouchableOpacity onPress={onSelectSetting}>
                        <FontAwesome name={"gear"} color={"#000"} size={30} />
                    </TouchableOpacity>
                </HStack>
            </HStack>
        </View>
    )
}

function Profile(props) {
    const { Username = "Nickname" } = props;
    return (
        <TouchableOpacity {...props} style={{ width: "90%"}}>
            <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                style={{ height: 60 }}>
                {/* Btn */}
                <HStack space={5}>
                    <FontAwesome name={"user-o"} color={"#000"} size={48} />
                    <View style={{ width: 100 }}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18
                        }}>{Username}</Text>
                    </View>
                </HStack>

                {/* Angle-Right */}
                <View>
                    <FontAwesome name={"angle-right"} color={"#000"} size={32} />
                </View>
            </HStack>
        </TouchableOpacity>
    )
}

function PanelBtn(props) {
    const { icon, title, Btn } = props;
    const { onPress = () => { } } = props;

    return (
        <TouchableOpacity onPress={onPress} style={{ width: "90%" }}>
            <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                style={{ height: 60 }}>
                {/* Icon & Title */}
                <HStack alignItems={"center"} space={3}>
                    <Btn name={icon} color={"#111111"} size={24} />
                    <View>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#111111"
                        }}>{title}</Text>
                    </View>
                </HStack>

                {/* FontAwesome */}
                <FontAwesome name={"angle-right"} color={"#000"} size={32} />

            </HStack>
        </TouchableOpacity>
    )
}

function NavPanel(props) {

    const navigation = useNavigation();

    const GoToHomeManagement = () => navigation.navigate("HomeManagement");
    const GoToAlert = () => navigation.navigate("Alert");

    return (
        <VStack py={2}
            bgColor={"#FFF"}
            borderRadius={8}
            width={"90%"}
            alignItems={"center"}>

            <PanelBtn onPress={GoToHomeManagement}
                Btn={FontAwesome} icon={"home"} title={"Home Management"} />
            <PanelBtn onPress={GoToAlert}
                Btn={MaterialCommunityIcons} icon={"message-text-outline"} title={"Message Center"} />
            {/* <PanelBtn Btn={SimpleLineIcons} icon={"question"} title={"FAQ & Feedback"} /> */}
        </VStack>
    )
}

function LogoutPanel(props) {
    return (
        <View
            py={3}
            width={"90%"}
            alignItems={"center"}
            bgColor={"#FFF"}
            borderRadius={12}>
            <TouchableOpacity {...props}
                style={{ width: "90%" }}>
                <HStack alignItems={"center"} space={3}>
                    <MaterialIcons name={"logout"} color={"#2898FF"} size={24} />
                    <View>
                        <Text style={[{
                            fontSize: 18,
                            color: "#2898FF",
                            fontFamily: "Roboto-Medium",
                        }]}>Log Out</Text>
                    </View>
                </HStack>
            </TouchableOpacity>
        </View>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    const userId = useSelector(Selectors.userIdSelect);

    // #region UseState
    const [profileInfo, setProfileInfo] = useState({});
    const [loading, setLoading] = useState(false);
    // #endregion

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchProfileInfo({
                param: {
                    UserId: userId
                },
                onSetLoading: setLoading
            })
            .then(data => {
                console.log(data);
                setProfileInfo(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
        }
    }, [userId]);

    // #region Navigation
    const GoToProfileInfo = () => {
        navigation.navigate("ProfileInfo");
    }

    const GoToTuyaPanel = () => {
        navigation.navigate("TuyaPanel");
    }

    const SignOut = () => {

        // Reset User Id
        dispatch(Actions.onChangeUserId(-1));

        // Reset Home Id
        dispatch(Actions.onChangeHomeId(-1));

        navigation.navigate("Login");
    }
    // #endregion

    return (
        <>
        <BcLoading loading={loading} />
        <SafeAreaView style={{ flex: 1 }}>
            <View bgColor={"#F6F7FA"} style={{ flex: 1 }}>

                {/* Header */}
                <Header onSelectSetting={GoToTuyaPanel} />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <VStack flexGrow={1}
                        alignItems={"center"}
                        space={5}>
                        {/* User */}
                        <View width={"90%"} alignItems={"center"}
                            style={{ height: 80 }}>
                            <Profile {...profileInfo}
                                onPress={GoToProfileInfo} />
                        </View>

                        <NavPanel />

                        {/* Logout */}
                        <LogoutPanel onPress={SignOut} />

                    </VStack>
                </ScrollView>

                {/* Footer */}
                {/* <View style={{ height: 70 }} /> */}
            </View>
        </SafeAreaView>
        </>
    );
}

export default Index;