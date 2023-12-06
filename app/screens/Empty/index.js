import React, { useState, useEffect } from "react";
import { Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { BcSvgIcon, BcBoxShadow } from "@components";

function Header(props) {
    return (
        <BcBoxShadow style={{ width: "100%" }}>
            <View
                alignItems={"center"}
                justifyContent={"center"}
                style={{
                    height: 60,
                    backgroundColor: "#FFF",
                }}>
                <HStack style={{ width: "90%" }}>
                    <BcSvgIcon name={"Yatu"} width={80} height={40} />
                </HStack>
            </View>
        </BcBoxShadow>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const openDrawer = () => navigation.openDrawer();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <Header />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <VStack space={3} flexGrow={1} justifyContent={"center"} alignItems={"center"}>
                        <Text>This is Empty Page</Text>
                        <TouchableOpacity onPress={openDrawer}
                            style={{ width: "60%", height: 40 }}>
                            <View flex={1} backgroundColor={"#F00"}
                                alignItems={"center"} justifyContent={"center"}>
                                <Text style={[{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "white",
                                }]}>Press Me</Text>
                            </View>
                        </TouchableOpacity>
                    </VStack>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;