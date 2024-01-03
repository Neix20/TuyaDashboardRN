import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader, BcLoading, BcBoxShadow, BcFooter } from "@components";
import { fetchYatuEngineStatus } from "@api";
import { useToggle } from "@hooks";

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

    const onlineColor = Last_Active_Status == 1 ? "#0F0" : "#F00";

    return (
        <BcBoxShadow>
            <View bgColor={"#FFF"} alignItems={"center"}>
                <VStack py={2} space={1} width={"90%"}>
                    <Text style={style.code}>{Code}</Text>
                    <Text style={style.name}>{Name}</Text>
                    <Text>{Description}</Text>
                    <HStack space={1}>
                        <View alignItems={"center"} justifyContent={"center"}>
                            <View bgColor={onlineColor} style={{ height: 10, width: 10, borderRadius: 5 }} />
                        </View>
                        <Text style={style.lastActive}>Last Active: {Utility.formatDt(Last_Active_Date, "EEE, d MMMM yyyy hh:mm:ss")}</Text>
                    </HStack>
                </VStack>
            </View>
        </BcBoxShadow>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading, toggleLoading] = useToggle(false);
    const [engineLs, setEngineLs] = useState([]);

    useEffect(() => {
        if (isFocused) {
            GetYatuEngineStatus();
        }
    }, [isFocused]);

    // #region API
    const GetYatuEngineStatus = () => {
        setLoading(true);
        fetchYatuEngineStatus({
            param: {},
            onSetLoading: setLoading
        })
            .then(data => {
                setLoading(false);
                setEngineLs(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    const renderItem = ({ item, index }) => (<EngineItem key={index} {...item} />);

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Engine Status</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <FlatList
                        data={engineLs}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={<View style={{ height: 10 }} />}
                        style={{ flex: 1 }}
                    />
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;