import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { BcHeader, BcBoxShadow } from "@components";

function DetailsText(props) {
    const { title, children, disabled = false } = props;

    return (
        <HStack
            bgColor={"#fff"}
            space={3}
            alignItems={"center"}
            justifyContent={"space-between"}
            style={{
                width: width - 40,
            }}
        >
            <Text style={[{
                fontSize: 16,
                color: "#1E1E1E",
                fontFamily: "Roboto-Medium",
            }]}>{title}</Text>
            <Text style={[{
                fontSize: 16,
                color: "#1E1E1E",
                fontFamily: "Roboto-Medium",
                textAlign: "right",
            }]}>{children}</Text>
        </HStack>
    )
}

function Details(props) {
    const { name, product_name, id, model, icon } = props
    return (
        <BcBoxShadow>
            <View
                py={3}
                bgColor={"#fff"}
                alignItems={"center"}
                style={{
                    width: width,
                }}>

                <View style={{ width: width - 40 }}>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: "Roboto-Bold",
                        color: "#000"
                    }}>Details</Text>

                    <Divider bgColor={"#EBEBEB"} my={2} />
                </View>
                <VStack space={3}>
                    <DetailsText title={"Name"}>{name}</DetailsText>
                    <DetailsText title={"Id"}>{id}</DetailsText>
                    <DetailsText title={"Model"}>{model}</DetailsText>
                    <DetailsText title={"Product"}>{product_name}</DetailsText>
                </VStack>
            </View>
        </BcBoxShadow>
    )
}

function DevicePhoto(props) {
    const { name, img } = props;
    return (
        <BcBoxShadow>
            <VStack
                py={2}
                space={2}
                bgColor={"#FFF"}
                alignItems={"center"}
                style={{ width: width }}>
                {/* Profile Picture */}
                <View >

                    {/* Front Layer */}
                    <View
                        style={{
                            position: "absolute",
                            display: "none",
                            zIndex: 1,
                            bottom: -5,
                            right: -5,
                        }}>
                    </View>
                    <Image
                        source={img}
                        style={{
                            width: 200,
                            height: 200,
                            borderRadius: 100,
                        }}
                        alt={"Model"} />
                </View>

                {/* Name */}
                <Text style={{
                    fontSize: 22,
                    fontFamily: "Roboto-Medium",
                    color: "#000"
                }}>{name}</Text>
            </VStack>
        </BcBoxShadow>
    )
}

function ChartView(props) {
    return (
        <TouchableOpacity {...props}>
            <BcBoxShadow>
                <View
                    py={3}
                    bgColor={"#fff"}
                    alignItems={"center"}
                    style={{
                        width: width,
                    }}>
                    <View style={{ width: width - 40 }}>
                        <Text style={{
                            fontSize: 16,
                            color: "#2898FF",
                            fontFamily: "Roboto-Medium",
                        }}>View Chart</Text>
                    </View>
                </View>
            </BcBoxShadow>
        </TouchableOpacity>
    )
}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Props
    const device = props.route.params;
    // #endregion

    const lang = "en";

    // #region Navigation
    const GoToChart = () => {
        navigation.navigate("DeviceChart", device);
    }

    const GoBack = () => {
        navigation.goBack();
    }
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View
                style={{ flex: 1 }}>
                {/* Header */}
                <BcHeader>Device Detail</BcHeader>

                <View style={{ height: 10 }} />

                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <VStack space={3}>
                        <DevicePhoto {...device} />
                        <Details {...device} />
                        <ChartView onPress={GoToChart} />
                    </VStack>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default Index;