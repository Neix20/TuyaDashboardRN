import React, { useState, useEffect, useRef } from "react";
import { Dimensions, SafeAreaView, ScrollView, Text } from "react-native";
import { View } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import * as echarts from 'echarts/core';
import { SVGRenderer, SkiaChart } from '@wuba/react-native-echarts';
import { LineChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent } from 'echarts/components';

import { useOrientation } from "@hooks";
import { Logger, Utility } from "@utility";

import { GestureHandlerRootView } from "react-native-gesture-handler";

// Register extensions
echarts.use([
	SVGRenderer,
	LineChart,
	BarChart,
	TitleComponent,
	TooltipComponent,
	GridComponent,
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

	return (
		<SkiaChart ref={chartRef} />
	);
}

// Component usage
function Index(props) {

	const { hook = [] } = props;

	const [chart, setChart, chartKey, setChartKey, chartData, setChartData, chartLegend, chartKeyOption, setChartKeyOption] = hook;

	const { label = [], dataset = [], min_dt = 0, max_dt = 0, min = 0, max = 25 } = chartData;

	const init = {
		coor: { start: 0, end: 100 }
	}

	const [width] = useOrientation();

	const [coor, setCoor] = useState(init.coor);
	const isFocused = useIsFocused();

	useEffect(() => {
		if (isFocused) {
			setCoor(_ => init.coor)
		}
	}, [isFocused]);

	const option = {
		animation: false,
		tooltip: {
			trigger: 'item',
			renderMode: "richText"
		},
		toolbox: {
			feature: {
				myFullZoom: {
					show: true,
					title: 'Full Zoom',
					icon: 'path://m21.897 13.404.008-.057v.002c.024-.178.044-.357.058-.537.024-.302-.189-.811-.749-.811-.391 0-.715.3-.747.69-.018.221-.044.44-.078.656-.645 4.051-4.158 7.153-8.391 7.153-3.037 0-5.704-1.597-7.206-3.995l1.991-.005c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-4.033c-.414 0-.75.336-.75.75v4.049c0 .414.336.75.75.75s.75-.335.75-.75l.003-2.525c1.765 2.836 4.911 4.726 8.495 4.726 5.042 0 9.217-3.741 9.899-8.596zm-19.774-2.974-.009.056v-.002c-.035.233-.063.469-.082.708-.024.302.189.811.749.811.391 0 .715-.3.747-.69.022-.28.058-.556.107-.827.716-3.968 4.189-6.982 8.362-6.982 3.037 0 5.704 1.597 7.206 3.995l-1.991.005c-.414 0-.75.336-.75.75s.336.75.75.75h4.033c.414 0 .75-.336.75-.75v-4.049c0-.414-.336-.75-.75-.75s-.75.335-.75.75l-.003 2.525c-1.765-2.836-4.911-4.726-8.495-4.726-4.984 0-9.12 3.654-9.874 8.426z',
					onclick: function () {
						setCoor(_ => ({
							start: 0,
							end: 100
						}))
					}
				},
				my12HrZoom: {
					show: true,
					title: 'Half Zoom',
					icon: 'path://M19.905 11.343L19.897 11.4C19.215 16.255 15.04 19.996 9.998 19.996C6.414 19.996 3.268 18.106 1.503 15.27L1.5 17.795C1.5 18.21 1.164 18.545 0.75 18.545C0.336 18.545 0 18.209 0 17.795V13.746C0 13.332 0.336 12.996 0.75 12.996H4.783C5.197 12.996 5.533 13.332 5.533 13.746C5.533 14.16 5.197 14.496 4.783 14.496L2.792 14.501C4.294 16.899 6.961 18.496 9.998 18.496C14.231 18.496 17.744 15.394 18.389 11.343C18.423 11.127 18.449 10.908 18.467 10.687C18.499 10.297 18.823 9.997 19.214 9.997C19.774 9.997 19.987 10.506 19.963 10.808C19.949 10.988 19.929 11.167 19.905 11.345V11.343ZM0.114 8.482L0.123 8.426C0.877 3.654 5.013 0 9.997 0C13.581 0 16.727 1.89 18.492 4.726L18.495 2.201C18.495 1.786 18.831 1.451 19.245 1.451C19.659 1.451 19.995 1.787 19.995 2.201V6.25C19.995 6.664 19.659 7 19.245 7H15.212C14.798 7 14.462 6.664 14.462 6.25C14.462 5.836 14.798 5.5 15.212 5.5L17.203 5.495C15.701 3.097 13.034 1.5 9.997 1.5C5.824 1.5 2.351 4.514 1.635 8.482C1.586 8.753 1.55 9.029 1.528 9.309C1.496 9.699 1.172 9.999 0.781 9.999C0.221 9.999 0.00800006 9.49 0.0320001 9.188C0.0510001 8.949 0.0790001 8.713 0.114 8.48V8.482ZM7.55957 13V5.85156H7.41797L4.83496 6.82812V7.64355L6.65625 6.97949V13H7.55957ZM14.874 13V12.2578H11.3096L13.2139 10.1924C13.3962 9.99382 13.5671 9.79199 13.7266 9.58691C13.8893 9.38184 14.0309 9.1735 14.1514 8.96191C14.2751 8.75033 14.3711 8.53874 14.4395 8.32715C14.5111 8.1123 14.5469 7.90072 14.5469 7.69238C14.5469 7.31152 14.4606 6.97949 14.2881 6.69629C14.1188 6.40983 13.8747 6.18848 13.5557 6.03223C13.2367 5.87272 12.8525 5.79297 12.4033 5.79297C11.8988 5.79297 11.474 5.89225 11.1289 6.09082C10.7839 6.28613 10.5234 6.5498 10.3477 6.88184C10.1719 7.21387 10.084 7.58008 10.084 7.98047H10.9873C10.9873 7.69727 11.0394 7.44661 11.1436 7.22852C11.2477 7.01042 11.404 6.84115 11.6123 6.7207C11.8239 6.59701 12.0876 6.53516 12.4033 6.53516C12.667 6.53516 12.8916 6.59212 13.0771 6.70605C13.2627 6.81999 13.4027 6.97298 13.4971 7.16504C13.5947 7.35384 13.6436 7.56543 13.6436 7.7998C13.6436 7.98535 13.611 8.16764 13.5459 8.34668C13.484 8.52246 13.3734 8.72266 13.2139 8.94727C13.0576 9.16862 12.8363 9.4388 12.5498 9.75781L10.2207 12.3506V13H14.874Z',
					onclick: function () {
						setCoor(_ => ({
							start: 50,
							end: 100
						}))
					}
				},
				my4HrZoom: {
					show: true,
					title: 'Quarter Zoom',
					icon: 'path://M19.905 11.343L19.897 11.4C19.215 16.255 15.04 19.996 9.998 19.996C6.414 19.996 3.268 18.106 1.503 15.27L1.5 17.795C1.5 18.21 1.164 18.545 0.75 18.545C0.336 18.545 0 18.209 0 17.795V13.746C0 13.332 0.336 12.996 0.75 12.996H4.783C5.197 12.996 5.533 13.332 5.533 13.746C5.533 14.16 5.197 14.496 4.783 14.496L2.792 14.501C4.294 16.899 6.961 18.496 9.998 18.496C14.231 18.496 17.744 15.394 18.389 11.343C18.423 11.127 18.449 10.908 18.467 10.687C18.499 10.297 18.823 9.997 19.214 9.997C19.774 9.997 19.987 10.506 19.963 10.808C19.949 10.988 19.929 11.167 19.905 11.345V11.343ZM0.114 8.482L0.123 8.426C0.877 3.654 5.013 0 9.997 0C13.581 0 16.727 1.89 18.492 4.726L18.495 2.201C18.495 1.786 18.831 1.451 19.245 1.451C19.659 1.451 19.995 1.787 19.995 2.201V6.25C19.995 6.664 19.659 7 19.245 7H15.212C14.798 7 14.462 6.664 14.462 6.25C14.462 5.836 14.798 5.5 15.212 5.5L17.203 5.495C15.701 3.097 13.034 1.5 9.997 1.5C5.824 1.5 2.351 4.514 1.635 8.482C1.586 8.753 1.55 9.029 1.528 9.309C1.496 9.699 1.172 9.999 0.781 9.999C0.221 9.999 0.00800006 9.49 0.0320001 9.188C0.0510001 8.949 0.0790001 8.713 0.114 8.48V8.482ZM12.3955 11.3496V10.6074H11.4043V5.89062H11.1797H10.501H10.4424L7.25879 10.8174V11.3496H10.501V13H11.4043V11.3496H12.3955ZM10.501 7.11398L10.3887 7.31641L8.28418 10.6074H10.501V7.11398Z',
					onclick: function () {
						setCoor(_ => ({
							start: 75,
							end: 100
						}))
					}
				},
				// restore: {}
			},
			top: 40,
			right: 5,
		},
		legend: {
			data: chartLegend,
			orient: 'horizontal',
			top: 'bottom'
		},
		xAxis: {
			type: "time",
			min: min_dt,
			max: max_dt,
			axisLabel: {
				formatter: '{HH}:{mm}',
				rotate: 45,
				showMinLabel: true,
				showMaxLabel: true
			},
			hideOverlap: true,
			animation: false,
			axisPointer: {
				value: max_dt,
				snap: true,
				lineStyle: {
					color: '#7581BD',
					width: 2
				},
				label: {
					show: true,
					formatter: function (params) {
						return echarts.format.formatTime('hh:mm', params.value);
					},
					backgroundColor: '#7581BD'
				},
				handle: {
					show: true,
					color: '#7581BD',
					size: [48, 48]
				},
				zlevel: 0,
			}
		},
		// xAxis: {
		// 	type: "category",
		// 	axisLabel: {
		// 		rotate: 45,
		// 		showMinLabel: true,
		// 		showMaxLabel: true
		// 	},
		// 	boundaryGap: false,
		// 	data: label,
		// },
		yAxis: {
			type: 'value',
			renderMode: "richText",
			min: Math.ceil(min * 0.9),
			max: Math.floor(max * 1.1)
		},
		dataZoom: [
			{
				type: 'slider',
				...coor,
				top: 0,
				left: 5,
				right: 5,
			},
			{
				type: 'inside',
				xAxisIndex: [0]
			},
			// {
			// 	type: 'inside',
			// 	yAxisIndex: [0]
			// }

		],
		grid: {
			left: 5,
			right: 5,
			containLabel: true,
		},
		series: dataset.map(x => ({
			...x,
			type: "line",
			symbol: "circle",
			symbolSize: 5
		}))
	};

	return (
		<>
			<View alignItems={"center"}>
				<Text style={{ fontStyle: 'italic' }}>
					Hint: Drag the bar to zoom out graph
				</Text>
			</View>
			<ChartComponent width={width * 0.85} option={option} {...props} />
		</>
	)
}

export default Index;