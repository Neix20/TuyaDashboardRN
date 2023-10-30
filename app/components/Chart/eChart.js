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

import { DataIntervalSvg } from "@config";

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
	const { pos = 0 } = coor;

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
					icon: `path://${DataIntervalSvg[pos]}`,
					iconStyle: {
						color: "#a3a3a3",
						borderColor: "#a3a3a3",
					},
					onclick: updateCoor
				}
				// restore: {}
			},
			top: 0,
			right: 5,
			itemSize: 24,
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