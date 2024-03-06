import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeaderWithAdd, BcDisableII, BcLoading, BcBoxShadow, BcYesNoModal, BaseIIModal, BaseModal } from "@components";
import { useToggle, useModalToast } from "@hooks";

import { MasterUserDevice, MasterUserYatuSession as TestData, MasterUserDevice as TestMasterData } from "./data";

import { fetchGetDeviceByYatuSession, fetchToggleYatuSessionDevice, fetchRemoveYatuSession, fetchGetYatuSessionByMasterUser, fetchGenerateViewerAccessCodeInf } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// [ ] Modal Must Keep refreshing to Change Product Loadout
// [ ] Modal Must Have Loading

// [x] Long Press to Remove Session

// [x] Sample Item
// [x] FlatList Render Item

// #region Components
function EmptyList(props) {
    const style = {
        txt: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
            color: "#d3d3d3",
            fontWeight: "700"
        }
    }
    return (
        <View flexGrow={1} justifyContent={"center"} alignItems={"center"} bgColor={"#FFF"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <FontAwesome5 name={"clock"} color={"#d3d3d3"} size={80} />
                <Text style={style.txt}>No Session Created</Text>
            </VStack>
        </View>
    )
}
// #endregion

function useSessionDeviceLs() {
    const [ls, setLs] = useState([]);

    const updateLs = (data) => {
        let arr = [...data];
        for (let ind = 0; ind < arr.length; ind += 1) {
            const obj = {
                ...arr[ind],
                flag: arr[ind].SessionStatus == 1,
                pos: ind,
                img: { uri: arr[ind].DeviceImg }
            }
            arr[ind] = obj;
        }
        setLs(_ => arr);
    }

    const toggleItem = (item) => {
        const { pos } = item;

        let arr = [...ls];

        arr[pos].flag = !arr[pos].flag;

        setLs(_ => arr);
    }

    // At Least One
    const flag = ls.filter(x => x.flag).length > 0;

    return [ls, updateLs, toggleItem, flag];
}

import Clipboard from '@react-native-clipboard/clipboard';

function SessionAccessCode(props) {

    const { data = "", onCopy = () => { } } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 16,
            color: "#000"
        },
        accessCodeDiv: {
            height: 48, backgroundColor: "#e6e6e6", borderRadius: 4, paddingHorizontal: 16
        }
    }

    return (
        <VStack space={1} width={"100%"}>
            <Text style={style.title}>Access Code</Text>

            <HStack alignItems={"center"}
                justifyContent={"space-between"}
                style={style.accessCodeDiv}>
                <Text style={style.title}>{data}</Text>
                <TouchableOpacity onPress={onCopy}>
                    <HStack alignItems={"center"} space={1}>
                        <FontAwesome5 name={"clone"} size={20} />
                        <Text style={style.title}>Copy</Text>
                    </HStack>
                </TouchableOpacity>
            </HStack>

        </VStack>
    )
}

function SessionSubmitBtn(props) {
    const { onPress = () => { }, flag = false } = props;

    const style = {
        btnTitle: {
            fontFamily: "Roboto-Bold",
            fontSize: 16,
            color: "#FFF",
        }
    }

    const Item = () => (
        <View flex={1} backgroundColor={Utility.getColor()} borderRadius={12}
            alignItems={"center"} justifyContent={"center"}>
            <Text style={style.btnTitle}>Submit</Text>
        </View>
    )

    return (flag) ? (
        <TouchableOpacity onPress={onPress}
            style={{ width: "100%", height: 48 }}>
            <Item />
        </TouchableOpacity>
    ) : (
        <BcDisableII style={{ width: "100%", height: 48 }}>
            <Item />
        </BcDisableII>
    )
}

import { CheckBox } from "@rneui/base";

function SessionDeviceItem(props) {

    const { Title = "", flag } = props;
    const { onSelect = () => { } } = props;

    const style = {
        title: {
            fontFamily: "Roboto-Medium",
            fontSize: 16,
        },
        chkBox: {
            paddingHorizontal: 5,
            paddingVertical: 0,
        }
    }

    return (
        <TouchableOpacity onPress={onSelect}>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
                <HStack space={2}>
                    <Text style={style.title}>{Title}</Text>
                </HStack>
                <CheckBox
                    containerStyle={style.chkBox}
                    iconType={"material-community"}
                    checkedIcon={"checkbox-marked"}
                    uncheckedIcon={"checkbox-blank-outline"}
                    onPress={onSelect}
                    checked={flag}
                    checkedColor={Utility.getColor()} />
            </HStack>
        </TouchableOpacity>
    )
}

function SessionModal(props) {

    const { data = {}, showModal = false, setShowModal = () => { } } = props;
    const { Access_Code = "", Email = "", Id = -1 } = data;

    const closeModal = () => setShowModal(false);

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 20,
            color: "#000",
        }
    };

    const userId = useSelector(Selectors.userIdSelect);
    const [devLs, setDevLs, toggleItem, devFlag] = useSessionDeviceLs();
    const [cusToast, showToastMsg] = useModalToast();

    useEffect(() => {
        if (showModal) {
            GetDeviceList();
        }
    }, [showModal]);

    const GetDeviceList = () => {
        fetchGetDeviceByYatuSession({
            param: {
                UserId: userId,
                YatuSessionId: Id
            },
            onSetLoading: () => { }
        })
            .then(data => {
                setDevLs(data);
            })
            .catch(err => {
                console.error(err);
            })
    }

    // #region Helper
    const copyReferralCode = () => {
        const msg = "Successfully Copied to Clipboard!";
        showToastMsg(msg);

        Clipboard.setString(Access_Code);
    }

    const submitDev = () => {
        fetchToggleYatuSessionDevice({
            param: {
                UserId: userId,
                YatuSessionId: Id,
                DeviceLs: devLs.map(x => ({ Id: x.Id, Status: x.flag }))
            },
            onSetLoading: () => { }
        })
            .then(data => {
                closeModal();
            })
            .catch(err => {
                console.error(err);
            })
    }
    // #endregion

    const renderItem = ({ item, index }) => {
        const onSelect = () => toggleItem(item);
        return (
            <SessionDeviceItem key={index} onSelect={onSelect} {...item} />
        )
    }

    return (
        <BaseIIModal cusToast={cusToast} {...props}>
            <View alignItems={"center"}>
                <VStack width={"90%"} alignItems={"center"} space={3}>
                    <Text style={style.title}>New Session</Text>

                    {/* Access Code */}
                    <SessionAccessCode data={Access_Code} onCopy={copyReferralCode} />

                    {/* List Devices */}
                    <FlatList
                        data={devLs}
                        renderItem={renderItem}
                        contentContainerStyle={{ padding: 2 }}
                    />

                    {/* Submit Button */}
                    <SessionSubmitBtn flag={devFlag} onPress={submitDev} />
                </VStack>
            </View>
        </BaseIIModal>
    )
}

function SessionUserItem(props) {

    const { Email = "", Expiry_Date = "", Access_Code = "" } = props;

    const style = {
        email: {
            fontFamily: "Roboto-Bold",
            fontSize: 16
        },
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 14
        },
        txtAccess: {
            fontFamily: "Roboto-Bold",
            fontSize: 14,
            textAlign: "center"
        },
        img: {
            width: 160,
            height: 160
        }
    }

    return (
        <BcBoxShadow style={{ width: "100%" }}>
            <View flex={1} bgColor={"#FFF"} alignItems={"center"}>
                <VStack py={2} width={"90%"} alignItems={"center"} space={3}>
                    <Image source={Images.person} style={style.img} />
                    <View width={"100%"}>
                        <Text style={style.title}>Access Code</Text>
                        <Text style={style.email}>{Access_Code}</Text>
                    </View>
                    <View width={"100%"}>
                        <Text style={style.title}>Email</Text>
                        <Text style={style.email}>{Email}</Text>
                    </View>
                </VStack>

            </View>
        </BcBoxShadow>
    )
}

function SessionList(props) {

    const { data = [], loadingHook = [] } = props;
    const { refreshHook = [] } = props;

    // #region Use State
    const toast = useToast();
    const userId = useSelector(Selectors.userIdSelect);

    const [loading, setLoading, toggleLoading] = loadingHook;
    const [refresh, setRefresh, toggleRefresh] = refreshHook;

    const [rdModal, setRdModal, toggleRdModal] = useToggle(false);
    const [sesModal, setSesModal, toggleSesModal] = useToggle(false);

    const [selUser, setSelUser] = useState({});
    // #endregion

    if (data.length == 0) {
        return (
            <EmptyList />
        )
    }

    const renderItem = ({ item, index }) => {

        const onRemoveUser = () => {
            setSelUser(_ => item);
            setRdModal(_ => true);
        };

        const onSelectUser = () => {
            setSelUser(_ => item);
            setSesModal(_ => true);
        }


        return (
            <TouchableOpacity key={index} onLongPress={onRemoveUser} onPress={onSelectUser} style={{ flex: 1 }}>
                <SessionUserItem {...item} />
            </TouchableOpacity>
        )
    };

    const RemoveUser = () => {
        const { Id } = selUser;

        setLoading(true);
        fetchRemoveYatuSession({
            param: {
                UserId: userId,
                YatuSessionId: Id
            },
            onSetLoading: setLoading
        })
            .then(data => {
                setRdModal(_ => false);
                toggleRefresh();
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
            })
    }

    const style = {
        flatListContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            rowGap: 8,
            columnGap: 8,
        }
    }

    return (
        <>
            <SessionModal showModal={sesModal} setShowModal={setSesModal} data={selUser} />
            <BcYesNoModal showModal={rdModal} setShowModal={setRdModal}
                title={"Remove User"} showCross={false}
                onPressYes={RemoveUser}
                onPressNo={toggleRdModal}
                description={"Are you sure you want to remove this user?"} />
            <View flexGrow={1} py={3} alignItems={"center"}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={<View style={{ height: 10 }} />}
                    style={{ width: "90%", flex: 1 }}
                    // contentContainerStyle={style.flatListContainer}
                    numColumns={2}
                    columnWrapperStyle={{ columnGap: 8 }}
                />
            </View>
        </>
    )
}

function EmailModal(props) {

    const { showModal = false, setShowModal = () => { } } = props;
    const { refreshHook = [] } = props;

    const userId = useSelector(Selectors.userIdSelect);
    const [refresh, setRefresh, toggleRefresh] = refreshHook;

    const style = {

        title: {
            fontWeight: "bold",
            fontSize: 14,
            color: "#000"
        },
        txtInput: {
            fontFamily: "Roboto-Medium",
            fontSize: 16,
            color: "#000"
        },
        btnTitle: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#FFF",
        }
    }

    const closeModal = () => setShowModal(_ => false);

    const [email, setEmail] = useState("");

    const emailFlag = email.length > 0;
    const clearEmail = () => setEmail(_ => "");


    const GenerateAccessCode = () => {
        fetchGenerateViewerAccessCodeInf({
            param: {
                UserId: userId,
                Email: email
            },
            onSetLoading: () => { }
        })
            .then(data => {
                closeModal();
                clearEmail();
                toggleRefresh();
            })
            .catch(err => {
                console.error(err);
            })
    }

    return (

        <BaseModal {...props}>
            <VStack py={3} space={3} width={"100%"} alignItems={"center"}>
                <View width={"80%"}>
                    <Text style={style.title}>Email</Text>
                    <View px={1} bgColor={"#EEF3F6"}>
                        <TextInput
                            defaultValue={email}
                            onChangeText={setEmail}
                            keyboardType={"email-address"}
                            autoCapitalize={"none"}
                            placeholder={"Email"}
                            multiline={true}
                            style={style.txtInput} />
                    </View>
                </View>

                {
                    (emailFlag) ? (
                        <TouchableOpacity onPress={GenerateAccessCode} style={{ width: "60%", height: 40 }}>
                            <View flex={1} backgroundColor={Utility.getColor()}
                                alignItems={"center"} justifyContent={"center"}>
                                <Text style={style.btnTitle}>Submit</Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <BcDisableII style={{ width: "60%", height: 40 }}>
                            <View flex={1} backgroundColor={Utility.getColor()}
                                alignItems={"center"} justifyContent={"center"}>
                                <Text style={style.btnTitle}>Submit</Text>
                            </View>
                        </BcDisableII>
                    )
                }


            </VStack>
        </BaseModal>

    )
}

function HeaderRight(props) {

    const { refreshHook = [] } = props;

    const [viewModal, setViewModal, toggleViewModal] = useToggle(false);
    return (
        <>
            <EmailModal showModal={viewModal} setShowModal={setViewModal} {...props} />
            <TouchableOpacity onPress={toggleViewModal}>
                <View bgColor={Utility.getColor()} alignItems={"center"} justifyContent={"center"}
                    style={{ height: 40, width: 40, borderRadius: 20 }}>
                    <FontAwesome5 name={"plus"} color={"#FFF"} size={24} />
                </View>
            </TouchableOpacity>
        </>
    )
}

function useSessionLs() {
    const [data, setData] = useState([]);

    const updateData = (val) => {
        setData(_ => val);
    }

    return [data, updateData];
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // Lets Think About This
    const loadingHook = useToggle(false);
    const [loading, setLoading, toggleLoading] = loadingHook;

    const refreshHook = useToggle(false);
    const [refresh, setRefresh, toggleRefresh] = refreshHook;

    const [sessionLs, setSessionLs] = useSessionLs();

    const userId = useSelector(Selectors.userIdSelect);

    useEffect(() => {
        if (isFocused) {
            GetYatuSession();
        }
    }, [isFocused, refresh]);

    const GetYatuSession = () => {
        setLoading(true);
        fetchGetYatuSessionByMasterUser({
            param: {
                UserId: userId
            },
            onSetLoading: setLoading
        })
            .then(data => {
                setSessionLs(data);
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
            })
    }

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeaderWithAdd Right={<HeaderRight refreshHook={refreshHook} />}>Viewer Session</BcHeaderWithAdd>

                    <View style={{ height: 5 }} />

                    {/* Body */}
                    <SessionList data={sessionLs} loadingHook={loadingHook} refreshHook={refreshHook} />

                    <View style={{ height: 5 }} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;