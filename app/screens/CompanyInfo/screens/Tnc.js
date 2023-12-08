import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg, clsConst } from "@config";

import { BcHeader } from "@components";

import { BcVersion, BcFooter } from "./../components";
import { useTextInfo } from "./../hooks";
import { Tnc as TestData } from "./../data";

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

                {/* DONE: Modify this into Array */}
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
    const { version = "", content = [] } = data;

    useEffect(() => {
        if (isFocused) {
            setData(TestData)
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <BcHeader>Terms & Conditions</BcHeader>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} bgColor={"#FFF"} alignItems={"center"}>
                        {/* Version */}
                        <BcVersion {...data} />

                        {/* Content */}
                        <View width={"90%"}>
                            <TnC data={content} />
                        </View>
                    </View>
                </ScrollView>

                <View bgColor={"#FFF"} alignItems={"center"}>
                    <BcFooter />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Index;