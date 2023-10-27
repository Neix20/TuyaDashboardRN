import React, { useState, useEffect, useRef } from "react";
import { Text } from "react-native";
import { View } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import * as echarts from 'echarts/core';
import { SVGRenderer, SkiaChart } from '@wuba/react-native-echarts';
import { LineChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent } from 'echarts/components';

import { useOrientation, useCoor } from "@hooks";

import { Logger, Utility } from "@utility";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

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

	const { height = 480, width = 320 } = props;
	const { option = {}, chartRef = null } = props;
	const { dataset = [], coor = {} } = props;

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
	}, [coor, dataset, width]);

	return (<SkiaChart ref={chartRef} />);
}

// Component usage
function Index(props) {

	const { hook = [] } = props;

	const [chart, setChart, chartKey, setChartKey, chartData, setChartData, chartLegend, chartKeyOption, setChartKeyOption] = hook;

	const { label = [], dataset = [] } = chartData;

	const homeId = useSelector(Selectors.homeIdSelect);

	const coor_state = [
        { start: 75, end: 100, pos: 0 },
        { start: 50, end: 100, pos: 1, },
        { start: 25, end: 100, pos: 2 },
        { start: 0, end: 100, pos: 3 },
    ];

	// #region UseState
	const chartRef = useRef(null);
	const [width] = useOrientation();

	const [coor, updateCoor, updateCoorByData] = useCoor(0, coor_state);

	const [unit, setUnit] = useState("");
	// #endregion

	// #region UseEffect
	useEffect(() => {
		if (chartRef.current) {
			const { start, end } = echarts.getInstanceByDom(chartRef.current).getOption()?.dataZoom[0] || coor;
			const { pos } = coor;
			updateCoorByData({ start, end, pos });	
		}

		let ut = Utility.genUnit(chartKey);
		setUnit(_ => ut);
	}, [chartKey]);

	// Update HomeId
	useEffect(() => {
		if (dataset.length > 0) {
			updateCoorByData(coor_state[0])
		}
	}, [homeId]);

	useEffect(() => {
		if (width > 530) {
			updateCoorByData(coor_state.at(-1))
		} else {
			updateCoorByData(coor_state[0])
		}
	}, [width]);
	// #endregion

	const optDataSet = dataset.map(x => ({ ...x, type: "line", symbol: "circle", symbolSize: 5 }));

	const option = {
		animation: false,
		tooltip: {
			trigger: 'axis',
			renderMode: "richText",
			valueFormatter: (value) => `${value}${unit}`
		},
		toolbox: {
			feature: {
				myFullZoom: {
					show: true,
					title: 'Zoom Interval',
					icon: 'path://m21.897 13.404.008-.057v.002c.024-.178.044-.357.058-.537.024-.302-.189-.811-.749-.811-.391 0-.715.3-.747.69-.018.221-.044.44-.078.656-.645 4.051-4.158 7.153-8.391 7.153-3.037 0-5.704-1.597-7.206-3.995l1.991-.005c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-4.033c-.414 0-.75.336-.75.75v4.049c0 .414.336.75.75.75s.75-.335.75-.75l.003-2.525c1.765 2.836 4.911 4.726 8.495 4.726 5.042 0 9.217-3.741 9.899-8.596zm-19.774-2.974-.009.056v-.002c-.035.233-.063.469-.082.708-.024.302.189.811.749.811.391 0 .715-.3.747-.69.022-.28.058-.556.107-.827.716-3.968 4.189-6.982 8.362-6.982 3.037 0 5.704 1.597 7.206 3.995l-1.991.005c-.414 0-.75.336-.75.75s.336.75.75.75h4.033c.414 0 .75-.336.75-.75v-4.049c0-.414-.336-.75-.75-.75s-.75.335-.75.75l-.003 2.525c-1.765-2.836-4.911-4.726-8.495-4.726-4.984 0-9.12 3.654-9.874 8.426z',
					onclick: updateCoor
				}
				// restore: {}
			},
			top: 0,
			right: 5,
		},
		legend: {
			data: chartLegend,
			orient: 'horizontal',
			top: 'bottom'
		},
		xAxis: {
			type: "time",
			axisLabel: {
				formatter: '{HH}:{mm}',
				rotate: 45,
				showMinLabel: true,
				showMaxLabel: true
			},
			hideOverlap: true,
			animation: false,
			axisPointer: {
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
			},
			boundaryGap: false,
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
			min: (val) => {
				return Math.floor(val.min * 0.9);
			},
			max: (val) => {
				return Math.ceil(val.max * 1.1);
			}
		},
		dataZoom: [
			{
				type: 'inside',
				...coor,
				xAxisIndex: [0]
			},
			// {
			// 	type: 'inside',
			// 	yAxisIndex: [0]
			// }
		],
		grid: {
			top: 10,
			bottom: 60,
			left: 5,
			right: 5,
			containLabel: true,
		},
		series: optDataSet
	};

	return (
		<>
			<View alignItems={"center"}>
				<Text style={{ fontStyle: 'italic' }}>
					Hint: Use Finger Gesture to zoom in on graph
				</Text>
			</View>
			<ChartComponent width={width * 0.85}
				option={option}
				chartRef={chartRef}
				coor={coor}
				dataset={dataset}
				{...props}
			/>
		</>
	)
}

export default Index;