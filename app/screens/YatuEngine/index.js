import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcLoading, BcBoxShadow } from "@components";
import { fetchYatuEngineStatus } from "@api";
import { useToggle } from "@hooks";

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
        <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
            <VStack space={2} width={"90%"} alignItems={"center"}>
                <FontAwesome5 name={"tools"} color={"#d3d3d3"} size={80} />
                <Text style={style.txt}>No Data Available, Please contact support.</Text>
            </VStack>
        </View>
    )
}

function Version(props) {
    const { lang = "en", version = "" } = props;

    const style = {
        version: {
            fontFamily: "Roboto-Medium",
            fontWeight: "500",
            fontSize: 12,
        }
    };

    return (
        <View width={"90%"} justifyContent={"center"} style={{ height: 40 }}>
            <Text style={style.version}>{Utility.translate("Last Updated at", lang)} {Utility.formatDt(version, "yyyy-MM-dd HH:mm:ss")}</Text>
        </View>
    )
}

function BlinkStatus(props) {
    const { flag = true } = props;

    if (flag) {
        return (
            <View bgColor={"#0F0"} style={{ height: 10, width: 10, borderRadius: 5 }} />
        )
    }

    const [cFlag, setCFlag, toggleCFlag] = useToggle(false);

    useEffect(() => {
        const timeout = setInterval(() => {
            toggleCFlag();
        }, 500)
        return () => clearInterval(timeout);
    }, []);

    const color = cFlag ? "#FFF" : "#F00";

    return (
        <View bgColor={color} style={{ height: 10, width: 10, borderRadius: 5 }} />
    )
}

function EngineItem(props) {

    const { Code, Name, Description, Last_Active_Date, Last_Active_Status } = props;

    const style = {
        name: {
            fontFamily: "Roboto-Bold",
            fontSize: 14
        },
        code: {
            fontFamily: "Roboto-Bold",
            fontSize: 16
        },
        lastActive: {
            fontFamily: "Roboto-Medium",
            color: "#000"
        }
    }

    const color = Last_Active_Status ? "#28984F" : "#F00";

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"} alignItems={"center"}>
                <VStack py={2} space={1} width={"90%"}>
                    <Text style={[style.code, { color }]}>{Code}</Text>
                    <Text style={style.name}>{Name}</Text>
                    <Text>{Description}</Text>
                    <HStack space={1}>
                        <View alignItems={"center"} justifyContent={"center"}><BlinkStatus flag={Last_Active_Status} /></View>
                        <Text style={style.lastActive}>Last Active: {Utility.formatDt(Last_Active_Date, "EEE, d MMM HH:mm:ss")}</Text>
                    </HStack>
                </VStack>
            </View>
        </BcBoxShadow>
    )
}

function EngineList(props) {

    const { data = {} } = props;

    const { Data: engineLs = [], version = "" } = data;

    if (true) {
        return (
            <EmptyList />
        )
    }

    const renderItem = ({ item, index }) => (<EngineItem key={index} {...item} />);

    return (
        <View flexGrow={1} py={3}>
            <View bgColor={"#FFF"} alignItems={"center"}>
                <Version version={version} />
            </View>
            <FlatList
                data={engineLs}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={<View style={{ height: 10 }} />}
                style={{ flex: 1 }}
            />
        </View>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const init = {
        data: {
            version: "",
            Data: []
        }
    };

    // #region UseState
    const [data, setData] = useState(init.data);

    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [refresh, setRefresh, toggleRefresh] = useToggle(false);
    // #endregion

    useEffect(() => {
        GetYatuEngineStatus();
    }, [refresh]);

    useEffect(() => {
        const timeout = setInterval(() => {
            toggleRefresh();
        }, 5 * 60 * 1000);

        return () => clearInterval(timeout);
    }, []);

    // #region API
    const GetYatuEngineStatus = () => {
        setLoading(true);
        fetchYatuEngineStatus({
            param: {},
            onSetLoading: setLoading
        })
            .then(data => {
                setData(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#f6f6f6"} style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Engine Status</BcHeader>

                    {/* Body */}
                    <EngineList data={data} />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;