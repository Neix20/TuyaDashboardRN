import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Lottie from 'lottie-react-native';
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Animation } from "@config";
import { info, error, Utility } from "@utility";

import { BcSvgIcon, BcBoxShadow, BcHeader } from "@components";

import { LineChart } from "react-native-chart-kit";

import { LineChart as LineChartSvg, YAxis, XAxis, Grid } from 'react-native-svg-charts';

import { iRData } from "@config";

// #region Components
function Header(props) {
    const { children } = props;
    return (
        <BcBoxShadow>
            <View
                pb={2}
                alignItems={"center"}
                justifyContent={"flex-end"}
                style={{
                    height: 60,
                    width: width,
                    backgroundColor: "#fff",
                }}>
                <HStack
                    style={{ width: width - 40 }}>
                    {/* Logo */}
                    <Lottie
                        source={Animation.Yuta}
                        style={{
                            width: 80,
                            height: 40
                        }} />
                </HStack>
            </View>
        </BcBoxShadow>
    )
}
// #endregion

function LineChartV1(props) {
    const { chart } = props;
    return (
        <LineChart
            data={chart}
            width={width - 40} // from react-native
            height={200}
            chartConfig={{
                backgroundColor: "#e26a00",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                }
            }}
            style={{
                marginVertical: 8,
                borderRadius: 16
            }}
        />
    )
}

function SvgLineChart(props) {
    const { chart } = props;

    let labels = Array.from(Array(24).keys());
    labels = labels.map(x => x.toString().padStart(2, '0'));

    return (
        <BcBoxShadow>
            <View
                bgColor={"#FFF"}
                alignItems={"center"}
                style={{
                    width: width
                }}>
                <LineChartSvg
                    style={{ height: 200, width: width - 40 }}
                    data={chart}
                    contentInset={{ top: 20, bottom: 20 }}
                >
                    <Grid />
                </LineChartSvg>
                <XAxis
                    style={{ width: width - 40 }}
                    data={labels}
                    formatLabel={(_, index) => labels[index]}
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'black' }}
                />
            </View>
        </BcBoxShadow>
    )
}

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Initial
    const init = {
        lChart: {
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
                {
                    data: [
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100
                    ]
                }
            ]
        },
        svgChart: [
            {
                data: [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
            }
        ],
        colors: ["#DB7D86", "#E7E005", "#188B9A", "#DB2E54", "#A53202", "#82EB20", "#75368B", "#395DAD", "#EC259F", "#0FA1AF", "#ADAC72", "#7FD106", "#6AC237", "#C5F022", "#76862A"]
    }
    // #endregion

    // #region UseState
    const [lChart, setLChart] = useState(init.lChart);
    const [svgChart, setSvgChart] = useState(init.svgChart);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {

            const legend = Object.keys(iRData);

            let datasets = [];

            let ind = 0;
            for (let key in iRData) {
                let val = iRData[key];

                // Limit value
                val = val.slice(0, 600);

                val = val.map(obj => obj["Absolute_Humidity"])

                let obj = {
                    data: val,
                    svg: { stroke: init.colors[ind] },
                    strokeWidth: 2,
                }

                datasets.push(obj);

                ind += 1;
            }

            setSvgChart(datasets);
            setLChart({
                datasets: datasets,
                legend: legend,
            });
        }
    }, [isFocused]);
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View
                style={{ flex: 1 }}>

                {/* Header */}
                <Header>Dashboard</Header>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <VStack space={3}>
                        <SvgLineChart chart={svgChart} />
                        {/* <LineChartV1 chart={lChart} /> */}
                    </VStack>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default Index;