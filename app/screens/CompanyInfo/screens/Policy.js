import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";
import { Images, Svg, clsConst } from "@config";

import { BcHeader, BcBoxShadow, BcSvgIcon, BcLoading } from "@components";
import { useToggle } from "@hooks";
import { fetchGetParamApi } from "@api";

import { BcVersion, BcFooter } from "./../components";
import { useTextInfo } from "./../hooks";
import { Policy as TestData } from "./../data";

function Policy(props) {
    const { data = [] } = props;

    if (data.length == 0) {
        return (<></>);
    }

    const renderItem = ({ title = "", description = [] }, index) => {
        const renderDesc = (desc, jnd) => (<Text key={jnd}>{desc}</Text>)
        return (
            <VStack key={index} space={1}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                }}>{index + 1}. {title}</Text>

                <VStack space={1}>
                    <Text style={{ textAlign: 'justify' }}>
                        {
                            (description.length > 0) ? (
                                description.map(renderDesc)
                            ) : (
                                <></>
                            )
                        }
                    </Text>
                </VStack>
            </VStack>
        )
    }

    return (
        <VStack space={3}>
            {data.map(renderItem)}
        </VStack>
    );
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
            // setData(TestData)
            GetData();
        }
    }, [isFocused]);
    // #endregion

    const GetData = () => {
        setLoading(true);
        fetchGetParamApi({
            param: {
                ParamKey: "Yatu_PolicyData"
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
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Privacy Policy</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1} bgColor={"#FFF"} alignItems={"center"}>
                            {/* Version */}
                            <BcVersion {...data} />

                            {/* Content */}
                            <View width={"90%"} >
                                <Policy data={content} />
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View bgColor={"#FFF"} alignItems={"center"}>
                        <BcFooter />
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;