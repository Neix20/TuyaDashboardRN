import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";
import { Images, clsConst } from "@config";

import { BcHeader, BcBoxShadow, BcSvgIcon, BcLoading } from "@components";
import { useToggle } from "@hooks";
import { fetchGetParamApi } from "@api";

import { BcVersion, BcFooter, BcReachUs } from "./../components";
import { AboutUs as TestData } from "./../data";

// #region Components
function AboutUs(props) {
    const { data = [] } = props;

    if (data.length == 0) {
        return (<></>);
    }

    const renderItem = (term, ind) => (<Text key={ind} style={{ textAlign: "justify" }}>{term}</Text>);

    return (
        <VStack space={3}>
            {data.map(renderItem)}
        </VStack>
    )
}
// #endregion

// #region Custom Hooks
function useTextInfo(val) {
    const [data, setData] = useState(val);

    const updateData = (param) => {
        const { info = "" } = param;
        if (info.length > 0) {
            let arr = info.split("\n");

            const obj = {
                ...param,
                info: arr
            };

            setData(_ => obj);

        }
    }

    return [data, updateData];
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const lang = "en";

    const init = {
        data: {
            version: "",
            info: ""
        }
    };

    const [data, setData] = useTextInfo(init.data);
    const [loading, setLoading, toggleLoading] = useToggle(false);

    const { version = "", info = [], phone_no = "", business_phone_no = "", email = "" } = data;

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            // setData(TestData);
            GetData();
        }
    }, [isFocused]);
    // #endregion

    // #region Helper
    const GetData = () => {
        setLoading(true);
        fetchGetParamApi({
            param: {
                ParamKey: "Yatu_AboutUsData"
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
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>{Utility.translate("About Us", lang)}</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1} bgColor={"#FFF"} alignItems={"center"}>

                            {/* Version */}
                            <BcVersion {...data} />

                            {/* Logo */}
                            {/* <View width={"90%"}>
                                <BcSvgIcon name={"Yatu"} color={require("@utility").Utility.getColor()} width={100} height={50} />
                            </View> */}

                            {/* Content */}
                            <View width={"90%"}>
                                <AboutUs data={info} />
                            </View>

                            <View style={{ height: 20 }} />

                            {/* Reach Us Panel */}
                            <BcReachUs />

                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View alignItems={"center"} bgColor={"#FFF"}>
                        <BcFooter lang={lang} />
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

export default Index;