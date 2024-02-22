import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";
import { Images, Svg, clsConst } from "@config";

import { BcHeader, BcBoxShadow, BcSvgIcon, BcLoading } from "@components";
import { useToggle } from "@hooks";
import { fetchGetParamApi } from "@api";

import { BcVersion, BcFooter } from "./../components";
import { useTextInfo } from "./../hooks";
import { TncII as TestData } from "./../data";

function TnC(props) {
    const { data = [] } = props;

    if (data.length == 0) {
        return (<></>);
    }

    const renderItem = ({ title = "", description = [] }, index) => {
        const renderDesc = (desc, jnd) => (<Text key={jnd} style={{ textAlign: "justify" }}>{desc}</Text>)
        return (
            <VStack key={index} space={1}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                }}>{index + 1}. {title}</Text>

                <VStack space={1}>
                    {
                        (description.length > 0) ? (
                            description.map(renderDesc)
                        ) : (
                            <></>
                        )
                    }
                </VStack>
            </VStack>
        )
    };

    return (
        <VStack space={3}>
            {data.map(renderItem)}
        </VStack>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const init = {
        data: {
            version: "",
            content: []
        }
    };

    const [data, setData] = useTextInfo(init.data);

    const [loading, setLoading, toggleLoading] = useToggle(false);

    const { content = [] } = data;

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            // setProData(TestData);
            // setLiteData(TestDataII);
            GetData();
        }
    }, [isFocused]);
    // #endregion

    const GetData = () => {
        setLoading(true);
        fetchGetParamApi({
            param: {
                ParamKey: "Yatu_TncData"
            },
            onSetLoading: setLoading
        })
            .then(data => {
                const { Content = {}, Version = "" } = data;

                const next_state = {
                    ...Content,
                    Version: Version
                }
                setData(next_state);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);

                setData(TestData);
            })
    }

    return (
        <>
            <BcLoading loading={false} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Terms & Conditions</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack flexGrow={1}
                            bgColor={"#FFF"} alignItems={"center"}>
                            {/* Version */}
                            <BcVersion {...data} />

                            {/* Content */}
                            <View width={"90%"}>
                                <TnC data={content} />
                            </View>
                        </VStack>
                    </ScrollView>

                    <View bgColor={"#FFF"} alignItems={"center"}>
                        <BcFooter />
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;