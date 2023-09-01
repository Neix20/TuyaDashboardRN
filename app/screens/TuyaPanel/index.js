import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions, SafeAreaView, PermissionsAndroid, Platform } from "react-native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { loginWithEmail, initBluetoothDualModeActivator, queryHomeList, getHomeDetail, removeDevice, logout, registerAnonymousAccount, startBluetoothScan, createHome } from '@volst/react-native-tuya';

import { Logger } from "@utility";

import { BcHeader } from "@components";

// #region Components
function Btn(props) {
    const { onPress = () => { }, title = "" } = props;
    const { bgColor = "#F00", txtColor = "#FFF" } = props;

    return (
        <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
            <View style={{
                backgroundColor: bgColor,
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                borderRadius: 8,
            }}>
                <Text style={[{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: txtColor,
                }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}
// #endregion

function Index(props) {

    // #region UseState
    const [resOutput, setResOutput] = useState("Press Any Button!");
    const [homeId, setHomeId] = useState(0);
    const [devId, setDevId] = useState("");
    // #endregion

    // #region Function
    // #endregion

    // #region Helper
    const onRegister = () => {
        console.log(registerAnonymousAccount);
        registerAnonymousAccount()
            .then(res => {
                Logger.info({
                    content: res,
                    page: "App",
                    fileName: "tuya_anon_register",
                });

                setResOutput(_ => JSON.stringify(res));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
                setResOutput(_ => JSON.stringify(err));
            });
    }

    const onLogin = () => {
        console.log(loginWithEmail);
        loginWithEmail({
            countryCode: 'MY',
            email: 'txen2000@gmail.com',
            password: 'arf11234'
        })
            .then(res => {
                Logger.info({
                    content: res,
                    page: "App",
                    fileName: "tuya_login",
                });

                setResOutput(_ => JSON.stringify(res));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
                setResOutput(_ => JSON.stringify(err));
            });
    }

    const onRegisterDevice = () => {
        console.log(initBluetoothDualModeActivator);
        requestPermission()
            .then(flag => {
                if (flag) {
                    console.log(flag);
                    initBluetoothDualModeActivator({
                        homeId: homeId,
                        ssid: "ivd_office",
                        password: "ivd#2456"
                    }).then(res => {
                        Logger.info({
                            content: res,
                            page: "App",
                            fileName: "tuya_blueTooth_scan",
                        });

                        setResOutput(_ => JSON.stringify(res));
                    })
                        .catch(err => {
                            console.log(`Error: ${err}`);
                            setResOutput(_ => JSON.stringify(err));
                        });
                }
            })
            .catch(err => {
                console.log(`Error: ${err}`);
                setResOutput(_ => JSON.stringify(err));
            });

    }

    const onHomeList = () => {
        console.log(queryHomeList);
        queryHomeList().then(res => {
            Logger.info({
                content: res,
                page: "App",
                fileName: "tuya_query_home",
            });

            setResOutput(_ => JSON.stringify(res));

            const { homeId } = res[0];
            setHomeId(homeId);

        })
            .catch(err => {
                console.log(`Error: ${err}`);
                setResOutput(_ => JSON.stringify(err));
            });
    }

    const onDeviceList = () => {
        console.log(getHomeDetail);
        getHomeDetail({
            homeId: homeId
        })
            .then(res => {
                Logger.info({
                    content: res,
                    page: "App",
                    fileName: "tuya_device_list",
                });

                setResOutput(_ => JSON.stringify(res));

                const { deviceList } = res;
                const { devId: rDevId } = deviceList[0];

                setDevId(_ => rDevId);
            })
            .catch(err => {
                console.log(`Error: ${err}`);
                setResOutput(_ => JSON.stringify(err));
            });
    }

    const onRemoveDevice = () => {
        console.log(removeDevice);
        removeDevice({
            devId: devId
        })
            .then(res => {
                Logger.info({
                    content: res,
                    page: "App",
                    fileName: "tuya_remove_device",
                });

                setResOutput(_ => JSON.stringify(res));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
                setResOutput(_ => JSON.stringify(err));
            });
    }

    const onBlueToothScan = () => {
        console.log(startBluetoothScan);
        startBluetoothScan()
            .then(res => {
                Logger.info({
                    content: res,
                    page: "App",
                    fileName: "tuya_bluetooth",
                });

                setResOutput(_ => JSON.stringify(res));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
                setResOutput(_ => JSON.stringify(err));
            });
    }

    const onLogout = () => {
        console.log(logout);
        logout()
            .then(res => {
                Logger.info({
                    content: res,
                    page: "App",
                    fileName: "tuya_logout",
                });

                setResOutput(_ => JSON.stringify(res));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
                setResOutput(_ => JSON.stringify(err));
            });
    }

    const onCreateHome = () => {
        console.log(createHome);
        createHome({
            name: "TuyaSDKTest",
            geoName: null,
            lat: 0,
            lon: 0,
            rooms: []
        })
            .then(res => {
                Logger.info({
                    content: res,
                    page: "App",
                    fileName: "tuya_create_home",
                });

                setResOutput(_ => JSON.stringify(res));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
                setResOutput(_ => JSON.stringify(err));
            });
    }

    const clearRes = () => {
        setResOutput(_ => "Press Any Button!");
    }
    // #endregion

    // #region Permission
    const requestPermission = async () => {
        if (Platform.OS === "ios") {
            return true;
        }

        if (Platform.OS === "android") {
            const flagI = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
            const flagII = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

            res = flagI === PermissionsAndroid.RESULTS.GRANTED
                && flagII === PermissionsAndroid.RESULTS.GRANTED;
        }

        return true;
    }
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                <BcHeader>Tuya Panel</BcHeader>

                <View style={{ height: 10 }} />

                <View style={{ alignItems: "center", justifyContent: "center", rowGap: 10 }}>
                    {/* Button */}
                    <View style={{ rowGap: 10 }}>
                        <View style={{ flexDirection: "row", columnGap: 5, width: 360 }}>
                            <Btn onPress={onRegister} bgColor={"#F0F"} title={"Register"} />
                            <Btn onPress={onLogin} bgColor={"#F0F"} title={"Login"} />
                            <Btn onPress={onLogout} title={"Logout"} />
                        </View>

                        <View style={{ flexDirection: "row", columnGap: 5, width: 360 }}>
                            <Btn onPress={onRegisterDevice} bgColor={"#00F"} title={"Register Device"} />
                            <Btn onPress={onRemoveDevice} bgColor={"#0FF"} title={"Remove Device"} />
                            <Btn onPress={onDeviceList} bgColor={"#00F"} title={"Device List"} />
                        </View>

                        <View style={{ flexDirection: "row", columnGap: 5, width: 360 }}>
                            <Btn onPress={onCreateHome} bgColor={"#0F0"} title={"Create Home"} />
                            <Btn onPress={onHomeList} title={"Home List"} />
                        </View>

                        <View style={{ flexDirection: "row", columnGap: 5, width: 360 }}>
                            <Btn onPress={onBlueToothScan} bgColor={"#000"} title={"BlueTooth Scan"} />
                            <Btn onPress={clearRes} title={"Clear Output"} />

                        </View>
                    </View>

                    <View style={{
                        backgroundColor: "#d3d3d3",
                        width: 360,
                        height: 400,
                        borderRadius: 8,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                    }}>
                        <ScrollView>
                            <Text style={[{
                                fontSize: 14,
                                fontWeight: "bold",
                                color: "#000",
                            }]}>{resOutput}</Text>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Index;