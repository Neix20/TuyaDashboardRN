import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { BcHeader, BcBoxShadow, BcSvgChart } from "@components";

import { iRData } from "@config";

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Props
    const device = props.route.params;
    const { name } = device;
    // #endregion

    // #region UseState
    const [chartData, setChartData] = useState([]);
    const [chartLabel, setChartLabel] = useState([]);
    // #endregion

    const data = iRData[name];

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {

            let val = data.slice(0, 100);
            val = val.map(obj => obj["Absolute_Humidity"]);

            setChartData(val);

            val = data.slice(0, 100);
            val = val.map(obj => obj["Timestamp"]);
            val = val.map(obj => obj.replace(" ", "T"));
            val = val.map(obj => Utility.formatDt(obj, "hh:mm"));

            setChartLabel(val);
        }
    }, [isFocused]);
    // #endregion

    const GoBack = () => {
        navigation.goBack();
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <BcHeader>Device Chart</BcHeader>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"}>
                        <BcSvgChart
                            key={chartLabel.length}
                            data={chartData} labels={chartLabel} />
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 80 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;