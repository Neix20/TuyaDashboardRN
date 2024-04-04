import React, { useState, useEffect, useRef } from "react";
import { Dimensions, SafeAreaView, ScrollView, Text } from "react-native";
import { View } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import * as echarts from 'echarts/core';
import { SvgChart, SVGRenderer, SkiaChart } from '@wuba/react-native-echarts';
import { LineChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent } from 'echarts/components';

import { Logger, Utility } from "@utility";

// Register extensions
echarts.use([
    SVGRenderer,
    LineChart,
    GridComponent,
])

// Initialize
function ChartComponent(props) {

    const { height = 240, width = 320 } = props;
    const { option = {}, chartRef = null } = props;

    useEffect(() => {
        if (chartRef.current) {

            const chart = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current, 'light', {
            	renderer: 'svg',
            	width: width,
            	height: height
            });

            chart.setOption(option);
        }
    }, [option]);

    return (
        <SkiaChart ref={chartRef} />
    );
}

// Component usage
function Index(props) {

    const chartRef = useRef(null);

    const option = {
        animation: false,
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value',
            min: function (value) {
                return Math.floor(value.min * 0.9);
            }
        },
        series: [
            {
                name: 'Email',
                type: 'line',
                data: [120, 132, 101, 134, 90, 230, 210]
            }
        ]
    };;

    return ( 
        <ChartComponent 
            option={option} 
            chartRef={chartRef} />
    )
}

export default Index;