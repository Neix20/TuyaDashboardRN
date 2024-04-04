import React, { useState, useEffect, useRef } from "react";
import { Text } from "react-native";
import { View } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import * as echarts from 'echarts/core';
import { SvgChart, SVGRenderer, SkiaChart } from '@wuba/react-native-echarts';
import { LineChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent } from 'echarts/components';

import { useOrientation, useCoor, useToggle } from "@hooks";

import { Logger, Utility } from "@utility";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { ChartSvg } from "@config";

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
	const { dataset = [], coor = {}, toolTip = false, comfort = true } = props;

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
	}, [toolTip, comfort, coor, dataset, width]);

	return (<SkiaChart ref={chartRef} />);
}

// #region Constants
const coor_state = [
	{ start: 75, end: 100, pos: 0 },
	{ start: 50, end: 100, pos: 1, },
	{ start: 25, end: 100, pos: 2 },
	{ start: 0, end: 100, pos: 3 },
];

const itvLs = ["06Hr", "12Hr", "18Hr", "24Hr"];
const seLs = ["start", "end"];
// #endregion

// Component usage
function Index(props) {

	const { hook = [] } = props;

	const [chart, setChart, chartKey, setChartKey, chartData, setChartData, chartLegend, chartKeyOption, setChartKeyOption] = hook;

	const { label = [], dataset = [] } = chartData;

	const homeId = useSelector(Selectors.homeIdSelect);

	// #region UseState
	const chartRef = useRef(null);
	const [width] = useOrientation();

	const [coor, updateCoor, updateCoorByData, flag, toggleFlag] = useCoor();
	const { pos = 0 } = coor;

	const [unit, setUnit] = useState("");

	const [toolTip, setToolTip, toggleToolTip] = useToggle(true);
	const [comfort, setComfort, toggleComfort] = useToggle(true);
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

	// #region Variables
	// Should Use UseEffect
	const optDataSet = dataset.map(x => ({ ...x, type: "line", symbol: "square", symbolSize: 5 }));

	if (false) {

		let ts = [];

		if (dataset.length >= 1) {

			let { data: ts_val = [] } = dataset[0];

			ts = ts_val.map(x => x.value[0]);

			// Removed Undefined
			ts = ts.filter(x => x);
		}

		// Upper Boundary
		optDataSet.push({
			name: 'Lower Boundary',
			type: 'line',
			symbol: "none",
			stack: 'Total',
			color: "rgba(255, 173, 177, 0.4)",
			areaStyle: { color: "#FFF" },
			data: ts.map(x => ({value: [x, 14]}))
		});

		// Lower Boundary
		optDataSet.push({
			name: 'Upper Boundary',
			type: 'line',
			symbol: "none",
			stack: 'Total',
			color: "rgba(255, 173, 177, 0.4)",
			areaStyle: {},
			data: ts.map(x => ({value: [x, 5]}))
		})
	}

	const seTerm = seLs[flag ? 0 : 1];
	const itvTerm = itvLs[pos];

	const mtgColor = flag ? "#F01421" : Utility.getColor();
	const mtgTitle = flag ? "Toggle End" : "Toggle Start";

	const ttColor = toolTip ? "#39B54A" : "#98A0A8";
	const czColor = comfort ? "#FF5F1F" : "#98A0A8";
	// #endregion

	option = {
		animation: false,
		toolbox: {
			feature: {
				myToggleComfort: {
					show: true,
					title: "Toggle Comfort Zone",
					iconStyle: {
						color: czColor,
						borderColor: czColor
					},
					icon: `path://${ChartSvg["comfort"]}`,
					onclick: toggleComfort,
				},
				myToggleToolTip: {
					show: true,
					title: "Toggle Tooltip",
					iconStyle: {
						color: ttColor,
						borderColor: ttColor
					},
					icon: `path://${ChartSvg["tooltip"]}`,
					onclick: toggleToolTip,
				},
				myToggleZoom: {
					show: true,
					title: mtgTitle,
					iconStyle: {
						color: mtgColor,
						borderColor: mtgColor
					},
					icon: `path://${ChartSvg[seTerm]}`,
					onclick: toggleFlag
				},
				myFullZoom: {
					show: true,
					title: 'Zoom Interval',
					icon: `path://${ChartSvg[itvTerm]}`,
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
			itemGap: 10,
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

	if (toolTip) {
		option = {
			...option,
			tooltip: {
				show: true,
				trigger: 'axis',
				renderMode: "richText",
				formatter: function (params) {
					if (params.length > 0) {
						const { axisValueLabel: header } = params[0];

						let resArr = [header];

						if (comfort) {
							params = params.slice(0, params.length - 2);
						}

						params.forEach(obj => {
							let { data: { value }, marker } = obj;
							value = value[1];

							const res = `${marker} ${value.toFixed(2)}${unit}`;
							resArr.push(res);
						})

						return resArr.join("\n");
					}

					return "";
				},
				textStyle: {
					color: "rgba(0, 0, 0, 1)",
				},
				backgroundColor: "rgba(255, 255, 255, 1)",
			},
		}
	}

	return (
		<>
			<View alignItems={"center"}>
				<Text style={{ fontStyle: 'italic' }}>
					Hint: Use Finger Gesture to zoom in on graph
				</Text>
			</View>
			<ChartComponent key={flag}
				chartRef={chartRef} width={width * 0.85}
				option={option} dataset={dataset}
				coor={coor} toolTip={toolTip}
				comfort={comfort}
				{...props}
			/>
		</>
	)
}

export default Index;