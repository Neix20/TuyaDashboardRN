import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";
import { View, HStack, VStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import * as echarts from 'echarts/core';
import { SvgChart, SVGRenderer, SkiaChart } from '@wuba/react-native-echarts';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent, DatasetComponent } from 'echarts/components';

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

    const [chart, setChart, chartLegend] = hook;
    const { dataset = [] } = chart;

    const renderItem = (item, ind) => {

        const { name = "", tCol = "" } = item[0];

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
}

export default Index;