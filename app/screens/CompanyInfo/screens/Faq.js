import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg, clsConst } from "@config";

import { BcHeader, BcAccordion, BcLoading } from "@components";
import { useToggle } from "@hooks";
import { fetchGetParamApi } from "@api";

import { BcVersion, BcFooter } from "./../components";
import { useTextInfo } from "./../hooks";
import { FaqII as TestData } from "./../data";

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
                ParamKey: "Yatu_FaqData"
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
                    <BcHeader>Frequently Asked Questions</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack flexGrow={1} bgColor={"#FFF"} alignItems={"center"}>
                            {/* Version */}
                            <BcVersion {...data} />

                            {/* Content */}
                            <View width={"90%"}>
                                <BcAccordion data={content} />
                            </View>
                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <View alignItems={"center"} bgColor={"#FFF"}>
                        <BcFooter />
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;