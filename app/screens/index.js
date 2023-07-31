import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused, useFocusEffect } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import SplashScreen from "react-native-splash-screen";

// import { Images, Svg, GlobalStyles, GlobalColors } from "@config";

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <View>
            <Text>Hello this is from Tuya Dashboard</Text>
        </View>
    );
}

export default Index;