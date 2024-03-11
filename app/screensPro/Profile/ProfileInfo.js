import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { fetchProfileInfo, fetchUpdateProfile } from "@api";

import { BcLoading, BcBoxShadow, BcDisable, BcHeaderWithAdd, BaseIIModal, BcUserTariffModal } from "@components";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useToggle, useTariff } from "@hooks";

function InfoTariff(props) {

    const { Title, Value, onChangeValue = () => { } } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 18
        },
        txtInput: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: "#000",
        }
    }

    const [trfModal, setTrfModal, toggleTrfModal] = useToggle(false);

    const tariff = useSelector(Selectors.userTariffSelect);

    return (
        <>
            <BcUserTariffModal showModal={trfModal} setShowModal={setTrfModal} />
            <TouchableOpacity onPress={toggleTrfModal}>
                <HStack width={"90%"}
                    alignItems={"center"}
                    style={{ height: 48 }}>
                    <View flex={.3}>
                        <Text style={style.title}>{Title}: </Text>
                    </View>
                    <View flex={.7}>
                        <Text style={style.txtInput}>{tariff.Title}</Text>
                    </View>
                </HStack>
            </TouchableOpacity>
        </>
    )
}

// #region Components
function InfoTxt(props) {
    const { Title, Value, Placeholder = "", onChangeValue = () => { }, Editable = true } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 18
        },
        txtInput: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: "#000",
        }
    }

    return (
        <HStack width={"90%"}
            alignItems={"center"}
            style={{ height: 48 }}>
            <View flex={.3}>
                <Text style={style.title}>{Title}: </Text>
            </View>
            <View flex={.7}>
                <TextInput
                    editable={Editable}
                    defaultValue={Value}
                    onChangeText={onChangeValue}
                    placeholder={Placeholder}
                    autoCapitalize={"none"}
                    style={style.txtInput} />
            </View>
        </HStack>
    )
}

function InfoMobileNo(props) {
    const { Title, Value, Placeholder = "", onChangeValue = () => { }, Editable = true } = props;
    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 18
        },
        txtInput: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: "#000",
        }
    }

    return (
        <HStack width={"90%"}
            alignItems={"center"}
            style={{ height: 48 }}>
            <View flex={.3}>
                <Text style={style.title}>{Title}: </Text>
            </View>
            <View flex={.7}>
                <TextInput
                    keyboardType="number-pad"
                    editable={Editable}
                    defaultValue={Value}
                    onChangeText={onChangeValue}
                    placeholder={Placeholder}
                    autoCapitalize={"none"}
                    style={style.txtInput} />
            </View>
        </HStack>
    )
}

function InfoPassword(props) {
    const { Title, Value, Placeholder = "", onChangeValue = () => { }, Editable = true } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 18
        },
        txtInput: {
            fontFamily: "Roboto-Medium",
            fontSize: 18,
            color: "#000",
        }
    }

    return (
        <HStack width={"90%"}
            alignItems={"center"}
            style={{ height: 48 }}>
            <View flex={.3}>
                <Text style={style.title}>{Title}: </Text>
            </View>
            <View flex={.7}>
                <TextInput
                    secureTextEntry
                    editable={Editable}
                    defaultValue={Value}
                    onChangeText={onChangeValue}
                    placeholder={Placeholder}
                    autoCapitalize={"none"}
                    style={style.txtInput} />
            </View>
        </HStack>
    )
}

function InfoPanel(props) {

    const { hook = [] } = props;
    const [profile, setProfile, onChangeUsername, onChangeMobileNo, onChangeEmail, onChangeAddress, onChangeTariffType] = hook;

    const { Username, MobileNo, Email, Address, TariffType } = profile;

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"} alignItems={"center"}>
                <InfoTxt Title={"Email"} Value={Email} Placeholder={"xxx@gmail.com"} />
                <InfoMobileNo Title={"MobileNo"} Value={MobileNo} onChangeValue={onChangeMobileNo} Placeholder={"+60 XXX-XXXX"} />
                <InfoTariff Title={"Tariff"} Value={TariffType} onChangeValue={onChangeTariffType} Placeholder={"Residential"} />
            </View>
        </BcBoxShadow>
    )
}
// #endregion

function HeaderRight(props) {
    const { flag = true, showFlag = true, onSelect = () => { } } = props;

    if (!flag) {
        return (<></>)
    }

    const Item = () => (
        <Text style={{
            fontSize: 20,
            color: Utility.getColor()
        }}>Save</Text>
    )

    return (showFlag) ? (
        <TouchableOpacity onPress={onSelect}>
            <Item />
        </TouchableOpacity>
    ) : (
        <BcDisable>
            <Item />
        </BcDisable>
    )
}

// #region Custom Hooks
function useProfile() {
    const [profile, setProfile] = useState({});

    const updateProfile = (name, value) => {
        const nextState = { ...profile };
        nextState[name] = value;

        setProfile(() => nextState);
    }

    const onChangeUsername = (val) => updateProfile("Username", val);
    const onChangeMobileNo = (val) => updateProfile("MobileNo", val);
    const onChangeEmail = (val) => updateProfile("Email", val);
    const onChangeAddress = (val) => updateProfile("Address", val);
    const onChangeTariffType = (val) => updateProfile("TariffType", val);

    return [profile, setProfile, onChangeUsername, onChangeMobileNo, onChangeEmail, onChangeAddress, onChangeTariffType];
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const userId = useSelector(Selectors.userIdSelect);

    // #region UseState
    const [loading, setLoading, toggleLoading] = useToggle();
    const [flag, setFlag, toggleFlag] = useToggle();

    const profileHook = useProfile();
    const [profile, setProfile] = profileHook.slice(0, 2);

    const [oProfile, setOProfile] = useState({});
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            getProfile();
        }
    }, [isFocused, userId]);

    // Compare Flag
    useEffect(() => {
        const str = JSON.stringify(profile);
        const str_2 = JSON.stringify(oProfile);

        const t_flag = str !== str_2;
        setFlag(() => t_flag);
    }, [profile])
    // #endregion

    const getProfile = () => {
        setLoading(true);
        fetchProfileInfo({
            param: {
                UserId: userId,
            },
            onSetLoading: setLoading,
        })
            .then(data => {
                setProfile(() => data);
                setOProfile(() => data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }

    const tariff = useSelector(Selectors.userTariffSelect);

    const updateProfile = () => {

        setLoading(true);
        fetchUpdateProfile({
            param: {
                UserId: userId,
                ...profile,
                TariffType: tariff.Id
            },
            onSetLoading: setLoading
        })
            .then(data => { })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { UpdateProfile = -1 } = subUserAccess;

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeaderWithAdd Right={<HeaderRight flag={true} showFlag={flag} onSelect={updateProfile} />}>Profile Info</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1}>
                            <InfoPanel hook={profileHook} />
                        </View>
                    </ScrollView>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;