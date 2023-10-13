import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, Spinner, useToast } from "native-base";

import { PermissionsAndroid, Platform, BackHandler } from "react-native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcHeader, BcTimer, BaseModal, BcLoading } from "@components";

// import { startBluetoothScan, initBluetoothDualModeActivator } from "@volst/react-native-tuya";
const startBluetoothScan = async () => {};
const initBluetoothDualModeActivator = async () => {};

import { DeviceInfoDict, Animation } from "@config";

import { useWifi } from "@hooks";

import { fetchAddDevice } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import Lottie from "lottie-react-native";

const requestPermission = async () => {
    if (Platform.OS === "ios") {
        return true;
    }

    if (Platform.OS === "android") {
        const flagI = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        const flagII = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

        const res = flagI === PermissionsAndroid.RESULTS.GRANTED
            && flagII === PermissionsAndroid.RESULTS.GRANTED;

        return res;
    }

    return false;
}

// #region Loading
function EmptyList(props) {

    // #region Props
    const { lang = "en" } = props;
    // #endregion

    return (
        <VStack space={2}
            width={"90%"}
            alignItems={"center"}>

            <FontAwesome name={"plug"}
                color={"#CCC"}
                size={80} />

            <Text style={{
                fontSize: 24,
                color: "#CCC",
                fontFamily: 'Roboto-Medium',
                fontWeight: "700"
            }}>{Utility.translate("Empty List", lang)}</Text>
        </VStack>
    )
}

function LoadingItem(props) {
    return (
        <View flexGrow={1} justifyContent={"center"}>
            <View alignItems={"center"}>
                <Lottie
                    autoPlay
                    source={Animation.YatuLoader}
                    loop={true}
                    style={{
                        width: 360,
                        height: 360
                    }} />
            </View>
            <View
                display={"none"}
                alignItems={"center"}
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 10,
                }}
            >
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                    color: "#2898FF"
                }}>Loading ...</Text>
            </View>
        </View>
    )
}

function Loading(props) {

    // #region Props
    const { onRefresh = () => { } } = props;
    // #endregion

    // #region Initial
    const init = {
        duration: 60
    }
    // #endregion

    // #region UseState
    const [eFlag, setEFlag] = useState(false);
    // #endregion

    // #region Helper
    const toggleEFlag = () => setEFlag((val) => !val);
    // #endregion

    if (eFlag) {
        return (
            <View flexGrow={1}
                alignItems={"center"}
                justifyContent={"center"}>
                <TouchableOpacity onPress={onRefresh}>
                    <EmptyList />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <>
            <BcTimer
                hide={true}
                duration={init.duration}
                onTimerEnd={toggleEFlag} />
            <LoadingItem />
        </>
    )
}
// #endregion

// #region Device
function WifiModal(props) {

    // #region Redux
    const dispatch = useDispatch();
    // #endregion

    // #region Props
    const { flag, setFlag = () => { } } = props;
    // #endregion

    // #region UseState
    const [wifi, onChangeSSID, onChangePassword] = useWifi();
    // #endregion

    const { ssid, password } = wifi;

    // #region Helper
    const onSubmit = () => {
        let flag = true;

        flag = flag && ssid != null;
        flag = flag && password != null;

        setFlag(flag);

        dispatch(Actions.onChangeWifi(wifi));
    }
    // #endregion

    return (
        <BaseModal showCross={false} {...props}>
            <VStack space={3} alignItems={"center"}>
                <View>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 20,
                    }}>Wifi Information</Text>
                </View>

                {/* Wifi SSID */}
                <HStack
                    alignItems={"center"}
                    width={"80%"}>
                    <View flex={.3}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18,
                            color: "#000",
                        }}>SSID</Text>
                    </View>
                    <View flex={.7}>
                        <TextInput
                            defaultValue={ssid}
                            onChangeText={onChangeSSID}
                            placeholder={"SSID"}
                            autoCapitalize={"none"}
                            style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                                color: "#000",
                            }} />
                    </View>
                </HStack>

                {/* Wifi Password */}
                <HStack
                    alignItems={"center"}
                    width={"80%"}>
                    <View flex={.3}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18,
                            color: "#000",
                        }}>Password</Text>
                    </View>
                    <View flex={.7}>
                        <TextInput
                            defaultValue={password}
                            onChangeText={onChangePassword}
                            placeholder={"Password"}
                            autoCapitalize={"none"}
                            style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                                color: "#000",
                            }} />
                    </View>
                </HStack>

                {/* Submit */}
                <TouchableOpacity onPress={onSubmit}>
                    <View backgroundColor={"#2898FF"}
                        borderRadius={15}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 120, height: 40 }}>
                        <Text style={[{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "white",
                        }]}>Submit</Text>
                    </View>
                </TouchableOpacity>
            </VStack>
        </BaseModal>
    )
}

function AddDeviceModal(props) {

    const navigation = useNavigation();
    const toast = useToast();

    // #region Redux
    const wifi = useSelector(Selectors.wifiSelect);
    const tuyaHomeId = useSelector(Selectors.tuyaHomeIdSelect);

    const userId = useSelector(Selectors.userIdSelect);
    const homeId = useSelector(Selectors.homeIdSelect);
    // #endregion

    // #region Props
    const { showModal, setShowModal = () => { } } = props;
    // #endregion

    // #region UseState
    const [wFlag, setWFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (showModal) {
            const { ssid, password } = wifi;

            let flag = true;

            flag = flag && ssid != null;
            flag = flag && password != null;

            console.log(flag);

            setWFlag(flag);
        }
    }, [showModal]);
    // #endregion

    // #region Helper
    const closeModal = () => setShowModal(false);

    const onAddDevice = () => {
        setLoading(true);
        requestPermission()
            .then(flag => {
                if (flag) {
                    initBluetoothDualModeActivator({
                        homeId: tuyaHomeId,
                        ...wifi
                    }).then(res => {
                        // setLoading(false);

                        Logger.info({
                            content: res,
                            page: "App",
                            fileName: "tuya_blueTooth",
                        });

                        // Add Device
                        const { ip, mac, name: devName, devId, timezoneId } = res;

                        fetchAddDevice({
                            param: {
                                "UserId": userId,
                                "HomeId": homeId,
                                "RoomId": 999,
                                "TuyaName": devName,
                                "MDevice": "IR Temperature",
                                "TuyaId": devId,
                                "Ip_Addr": ip,
                                "Mac_Addr": mac,
                                "Timezone": timezoneId
                            },
                            onSetLoading: setLoading
                        })
                            .then(data => {
                                closeModal();
                                navigation.goBack();
                                toast.show({
                                    description: "Successfully Added Device!"
                                })
                            })
                            .catch(err => {
                                setLoading(false);
                                console.log(`Error: ${err}`);
                            });

                    })
                        .catch(err => {
                            setLoading(false);
                            console.log(`Error: ${err}`);
                        });
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            });

    }
    // #endregion

    if (!wFlag) {
        return (
            <WifiModal
                flag={wFlag} setFlag={setWFlag}
                {...props}
            />
        )
    }

    return (
        <>
            <BaseModal {...props}>
                <VStack space={3} alignItems={"center"}>
                    <View width={"70%"}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 20,
                            textAlign: "center",
                        }}>Would you like to add the following Device?</Text>
                    </View>

                    {/* Control */}
                    <HStack alignItems={"center"} space={5}>
                        <TouchableOpacity onPress={onAddDevice}>
                            <View backgroundColor={"#2898FF"}
                                borderRadius={8}
                                alignItems={"center"} justifyContent={"center"}
                                style={{ width: 60, height: 40 }}>
                                <Text style={[{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    color: "white",
                                }]}>Yes</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={closeModal}>
                            <View backgroundColor={"#CCC"}
                                borderRadius={8}
                                alignItems={"center"} justifyContent={"center"}
                                style={{ width: 60, height: 40 }}>
                                <Text style={[{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    color: "white",
                                }]}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                    </HStack>
                </VStack>
            </BaseModal>
            <BcLoading loading={loading} />
        </>
    )
}

function DevicePanelItem(props) {

    // #region Props
    const { uri, product_name } = props;
    // #endregion

    // #region UseState
    const [showAdModal, setShowAdModal] = useState(false);
    // #endregion

    // #region Helper
    const toggleAdModal = () => setShowAdModal((val) => !val);
    // #endregion

    return (
        <>
            <AddDeviceModal showModal={showAdModal} setShowModal={setShowAdModal} />
            <HStack
                alignItems={"center"} justifyContent={"space-between"}
                style={{ height: 80 }}>
                <HStack space={3} alignItems={"center"}>
                    <Image
                        source={uri}
                        style={{
                            width: 60,
                            height: 60
                        }}
                        resizeMode="cover"
                        alt={product_name} />
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                    }}>{product_name}</Text>
                </HStack>

                {/* Button */}
                <TouchableOpacity onPress={toggleAdModal}>
                    <View backgroundColor={"#2898FF"}
                        borderRadius={8}
                        alignItems={"center"}
                        justifyContent={"center"}
                        style={{
                            height: 40,
                            width: 60
                        }}
                    >
                        <Text style={[{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "white",
                        }]}>Add</Text>
                    </View>
                </TouchableOpacity>
            </HStack>
        </>
    )
}

function DevicePanel(props) {

    // #region Props
    const { data = [] } = props;
    // #endregion

    // #region Render
    const renderItem = ({ item, index }) => (<DevicePanelItem key={index} {...item} />)
    // #endregion

    return (
        <View bgColor={"#FFF"}
            alignItems={"center"}>
            <FlatList
                data={data}
                renderItem={renderItem}
                style={{ width: "90%" }} />
        </View>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region UseState
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const [btScanArr, setBtScanArr] = useState([]);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            onBlueToothScan();
        }
    }, [isFocused]);
    // #endregion

    // #region Helper
    const toggleRefresh = () => setRefresh((val) => !val);

    const refreshScan = () => {
        toggleRefresh();
        onBlueToothScan();
    }

    const onBlueToothScan = () => {
        setLoading(true);
        requestPermission()
            .then(flag => {
                if (flag) {
                    startBluetoothScan()
                        .then(res => {
                            setLoading(false);

                            const { productId } = res;

                            // Filter Out Device From ProductId
                            const data = DeviceInfoDict[productId];

                            data["uri"] = { "uri": data["icon"] };

                            let arr = [data];
                            setBtScanArr(arr);
                        })
                        .catch(err => {
                            setLoading(false);
                            console.log(`Error: ${err}`);
                        });
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            });
    }
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <BcHeader>Device Scan</BcHeader>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    {
                        (loading) ? (
                            <Loading key={refresh}
                                onRefresh={refreshScan} />
                        ) : (
                            <View flexGrow={1}>
                                <DevicePanel
                                    data={btScanArr} />
                            </View>
                        )
                    }
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 20 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;