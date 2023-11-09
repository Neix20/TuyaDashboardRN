import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";
import { View, HStack, VStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import * as echarts from 'echarts/core';
import { SVGRenderer, SkiaChart } from '@wuba/react-native-echarts';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent, DatasetComponent } from 'echarts/components';

import { useOrientation, useCoor } from "@hooks";

import { Logger, Utility } from "@utility";

// Register extensions
echarts.use([
    SVGRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent,
    DatasetComponent
])

// Initialize
function ChartComponent(props) {

    const { height = 480, width = 320 } = props;
    const { option = {} } = props;

    const chartRef = useRef(null);

    let chart;

    useEffect(() => {
        if (chartRef.current) {
            // const chart = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current, 'light', {
            // 	renderer: 'svg',
            // 	width: width,
            // 	height: height
            // });

            chart = echarts.init(chartRef.current, 'light', {
                renderer: 'svg',
                width: width,
                height: height
            });

            chart.setOption(option);
        }

        return () => chart?.dispose();
    }, [option]);

    return (
        <SkiaChart ref={chartRef} />
    );
}

// Component usage
function Index(props) {

    const { hook = [] } = props;

    const [chart, setChart, chartData, chartLegend] = hook;
    const { dataset = [] } = chartData;

    const [width, height, isPortrait, isLandscape, wt, ht] = useOrientation();

    const renderItem = (item, ind) => {

        const { name = "", tCol = "" } = item[0];

        const colorLs = ["rgba(0, 0, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 255, 255, 1)", "rgba(255, 0, 0, 1)", "rgba(255, 0, 255, 1)", "rgba(255, 255, 0, 1)", "rgba(255, 255, 255, 1)"];

        // console.log(color, color.slice(0, -2) + "0.25)");

        const option = {
            animation: false,
            tooltip: {
                trigger: 'item',
                renderMode: "richText",
            },
            title: {
                text: name,
                left: 'center'
            },
            grid: {
                top: 0,
                bottom: 0,
                left: 5,
                right: 5,
            },
            color: [tCol, tCol.slice(0, -2) + "0.25)"],
            series: item,
        };

        return (
            <ChartComponent key={ind}
                height={170}
                width={150}
                option={option} />
        )
    }

    return (
        <HStack alignItems={"center"} 
            justifyContent={"space-between"}
            flexWrap={"wrap"}>
            {dataset.map(renderItem)}
        </HStack>
    )

    return (
        <>
            <View alignItems={"center"}>
                <Text style={{ fontStyle: 'italic' }}>
                    Hint: Use Finger Gesture to Zoom in on graph
                </Text>
            </View>
            <HStack alignItems={"center"} space={3} px={3}>
                {dataset.map(renderItem)}
            </HStack>
        </>
    )
}

export default Index;