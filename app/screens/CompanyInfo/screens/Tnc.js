import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg, clsConst } from "@config";

import { BcHeader, BcLoading } from "@components";
import { useToggle } from "@hooks";

import { BcVersion, BcFooter } from "./../components";
import { useTextInfo } from "./../hooks";
import { Tnc as TestData, TncII as TestDataII } from "./../data";
import { fetchTnc } from "./../api";

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

    const [proData, setProData] = useTextInfo(init.data);
    const [liteData, setLiteData] = useTextInfo(init.data);

    const [loading, setLoading, toggleLoading] = useToggle(false);

    const { content = [] } = data;
    // const { content: proContent = [] } = proData;
    // const { content: liteContent = [] } = liteData;

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
        fetchTnc({
            param: {
                UserId: 10
            },
            onSetLoading: setLoading
        })
            .then(data => {
                // setProData(data);
                setData(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);

                // setProData(TestData);
                setData(TestData);
            })
    }

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
        }
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
                            <BcVersion {...proData} />

                            {/* Content */}
                            {/* <VStack width={"90%"} space={3}>
                                <Text style={style.title}>Yatu Pro Terms & Condition</Text>
                                <TnC data={proContent} />
                            </VStack>

                            <VStack width={"90%"} space={3} pt={3}>
                                <Text style={style.title}>Yatu Lite Terms & Condition</Text>
                                <TnC data={liteContent} />
                            </VStack> */}

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