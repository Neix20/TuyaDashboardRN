import React, { useState, useEffect, useRef } from "react";
import { Dimensions, SafeAreaView, ScrollView, useWindowDimensions } from "react-native";

import * as echarts from 'echarts/core';
import { SVGRenderer, SkiaChart } from '@wuba/react-native-echarts';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent } from 'echarts/components';

import { Logger, Utility } from "@utility";

// Register extensions
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	SVGRenderer,
	LineChart,
	LegendComponent,
	ToolboxComponent,
	DataZoomComponent
])

// Initialize
function ChartComponent(props) {

	const { height = 480, width = 320, option } = props;

	const chartRef = useRef(null);

	useEffect(() => {
		let chart;

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

	return <SkiaChart ref={chartRef} />;
}

// Component usage
function Index(props) {

	const { hook = [] } = props;

	const [chart, setChart, chartKey, setChartKey, chartData, setChartData, chartLegend, chartKeyOption, setChartKeyOption] = hook;

	const { label = [], dataset = [] } = chartData;

	const { width } = useWindowDimensions();

	const option = {
		// animation: false,
		animationDuration: 10,
		tooltip: {
			trigger: 'axis',
			renderMode: "richText"
		},
		toolbox: {
			feature: {
				restore: {}
			},
			top: 20,
			right: 10,
		},
		legend: {
			data: chartLegend,
			type: "scroll"
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: label
		},
		yAxis: {
			type: 'value',
			renderMode: "richText",
		},
		dataZoom: [
			{
				start: 0,
				end: 100,
				bottom: 30,
			}
		],
		grid: {
			left: 10,
			right: 10,
			containLabel: true,
		},
		series: dataset
	};

	return (
		<ChartComponent 
			option={option} 
			width={width * 0.8}
			{...props} />
	)
}

export default Index;