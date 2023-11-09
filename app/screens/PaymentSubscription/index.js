import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import { BcHeader } from "@components";

function PaymentHeader(props) {
    return (
        <VStack width={"90%"}>
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 16,
            }}>Plan Subscriptions</Text>
        </VStack>
    )
}

function PaymentBodyItem(props) {
    const { title, description, img } = props;
    return (
        <HStack>
            
        </HStack>
    )
}

function PaymentBody(props) {

    let data = [
        {
            "title": "Storage Module",
            "description": "Storage Fee 1 Year Data Keeping",
            "img": "https://i.imgur.com/dQDxXYa.png"
        },
        {
            "title": "Email Module",
            "description": "Archive Report Using Email",
            "img": "https://i.imgur.com/nQCj6ea.png"
        },
    ];

    data = data.map(obj => {
        const { img } = obj;
        return {
            ...obj,
            img: { uri: img }
        }
    });

    const renderItem = ({ item, index }) => {
        return (<></>)
    }

    return (
        <VStack width={"90%"} space={3}>
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 16,
            }}>Add-Ons</Text>
            <FlatList 
                data={data} 
                renderItem={renderItem} />
        </VStack>
    )
}

function PaymentInfo(props) {
    return (
        <VStack py={3} alignItems={"center"}>
            {/* Header */}
            <PaymentHeader />

            {/* Body */}
            <PaymentBody />
        </VStack>
    )
}


function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <BcHeader>Payment Subscription</BcHeader>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} bgColor={"#FFF"}>
                        <PaymentInfo />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default Index;