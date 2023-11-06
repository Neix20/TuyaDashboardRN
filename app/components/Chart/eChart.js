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

const svg_toggle_ls = [
	"M32.8836 18.1524L32.8704 18.2436C31.7437 26.0132 24.8465 32 16.517 32C10.5961 32 5.39882 28.9754 2.48299 24.4369L2.47804 28.4777C2.47804 29.1418 1.92296 29.6779 1.23902 29.6779C0.555081 29.6779 0 29.1402 0 28.4777V21.998C0 21.3355 0.555081 20.7978 1.23902 20.7978H7.90164C8.58558 20.7978 9.14066 21.3355 9.14066 21.998C9.14066 22.6605 8.58558 23.1982 7.90164 23.1982L4.61246 23.2062C7.0938 27.0438 11.4998 29.5995 16.517 29.5995C23.51 29.5995 29.3135 24.6353 30.3791 18.1524C30.4353 17.8068 30.4782 17.4563 30.508 17.1026C30.5608 16.4785 31.0961 15.9984 31.742 15.9984C32.6672 15.9984 33.019 16.813 32.9794 17.2963C32.9563 17.5843 32.9232 17.8708 32.8836 18.1556V18.1524ZM0.188331 13.5739L0.203199 13.4843C1.44883 5.84757 8.2816 0 16.5153 0C22.4362 0 27.6334 3.0246 30.5493 7.56311L30.5542 3.5223C30.5542 2.85817 31.1093 2.32206 31.7932 2.32206C32.4772 2.32206 33.0323 2.85977 33.0323 3.5223V10.002C33.0323 10.6645 32.4772 11.2022 31.7932 11.2022H25.1306C24.4467 11.2022 23.8916 10.6645 23.8916 10.002C23.8916 9.33947 24.4467 8.80176 25.1306 8.80176L28.4198 8.79376C25.9385 4.95619 21.5325 2.40048 16.5153 2.40048C9.6214 2.40048 3.88391 7.22385 2.70106 13.5739C2.62011 14.0076 2.56064 14.4493 2.5243 14.8974C2.47143 15.5215 1.93617 16.0016 1.29023 16.0016C0.365098 16.0016 0.0132163 15.187 0.0528649 14.7037C0.0842534 14.3213 0.13051 13.9436 0.188331 13.5707V13.5739ZM17.9883 17.917C18.043 18.0583 18.0703 18.2178 18.0703 18.3955C18.0703 18.6188 18.0133 18.8193 17.8994 18.9971C17.79 19.1748 17.6191 19.3138 17.3867 19.4141C17.1589 19.5143 16.8672 19.5645 16.5117 19.5645C16.2201 19.5645 15.9512 19.5348 15.7051 19.4756C15.4635 19.4163 15.2539 19.3206 15.0762 19.1885C14.903 19.0563 14.7686 18.8831 14.6729 18.6689C14.5771 18.4548 14.5293 18.1927 14.5293 17.8828H12.4717C12.4717 18.4434 12.5879 18.9287 12.8203 19.3389C13.0527 19.749 13.3626 20.0863 13.75 20.3506C14.1419 20.6149 14.5771 20.8132 15.0557 20.9453C15.5342 21.0729 16.0195 21.1367 16.5117 21.1367C17.0586 21.1367 17.5531 21.0752 17.9951 20.9521C18.4372 20.8291 18.8177 20.6491 19.1367 20.4121C19.4557 20.1751 19.6995 19.8857 19.8682 19.5439C20.0368 19.2021 20.1211 18.8148 20.1211 18.3818C20.1211 17.9717 20.0505 17.6048 19.9092 17.2812C19.7679 16.9577 19.5583 16.6683 19.2803 16.4131C19.0023 16.1579 18.6559 15.9277 18.2412 15.7227C17.8311 15.5176 17.3548 15.333 16.8125 15.1689C16.4889 15.0687 16.2041 14.9661 15.958 14.8613C15.7119 14.7565 15.5046 14.6449 15.3359 14.5264C15.1673 14.4079 15.0397 14.2803 14.9531 14.1436C14.8711 14.0068 14.8301 13.8542 14.8301 13.6855C14.8301 13.4622 14.8893 13.2617 15.0078 13.084C15.1263 12.9017 15.304 12.7581 15.541 12.6533C15.778 12.5439 16.0742 12.4893 16.4297 12.4893C16.7988 12.4893 17.1042 12.5531 17.3457 12.6807C17.5918 12.8083 17.7741 12.9837 17.8926 13.207C18.0156 13.4258 18.0771 13.681 18.0771 13.9727H20.1143C20.1143 13.3802 19.9616 12.8538 19.6562 12.3936C19.3555 11.9333 18.9316 11.571 18.3848 11.3066C17.8379 11.0423 17.1976 10.9102 16.4639 10.9102C15.9261 10.9102 15.4316 10.9762 14.9805 11.1084C14.5339 11.2406 14.1465 11.4297 13.8184 11.6758C13.4902 11.9173 13.235 12.209 13.0527 12.5508C12.8704 12.888 12.7793 13.264 12.7793 13.6787C12.7793 14.1071 12.8659 14.4831 13.0391 14.8066C13.2168 15.1302 13.4583 15.415 13.7637 15.6611C14.0736 15.9027 14.429 16.1146 14.8301 16.2969C15.2357 16.4792 15.6641 16.6432 16.1152 16.7891C16.5208 16.9167 16.8512 17.0397 17.1064 17.1582C17.3617 17.2767 17.5599 17.3975 17.7012 17.5205C17.8424 17.639 17.9382 17.7712 17.9883 17.917Z",
	"M32.8836 18.1524L32.8704 18.2436C31.7437 26.0132 24.8465 32 16.517 32C10.5961 32 5.39882 28.9754 2.48299 24.4369L2.47804 28.4777C2.47804 29.1418 1.92296 29.6779 1.23902 29.6779C0.555081 29.6779 0 29.1402 0 28.4777V21.998C0 21.3355 0.555081 20.7978 1.23902 20.7978H7.90164C8.58558 20.7978 9.14066 21.3355 9.14066 21.998C9.14066 22.6605 8.58558 23.1982 7.90164 23.1982L4.61246 23.2062C7.0938 27.0438 11.4998 29.5995 16.517 29.5995C23.51 29.5995 29.3135 24.6353 30.3791 18.1524C30.4353 17.8068 30.4782 17.4563 30.508 17.1026C30.5608 16.4785 31.0961 15.9984 31.742 15.9984C32.6672 15.9984 33.019 16.813 32.9794 17.2963C32.9563 17.5843 32.9232 17.8708 32.8836 18.1556V18.1524ZM0.188331 13.5739L0.203199 13.4843C1.44883 5.84757 8.2816 0 16.5153 0C22.4362 0 27.6334 3.0246 30.5493 7.56311L30.5542 3.5223C30.5542 2.85817 31.1093 2.32206 31.7932 2.32206C32.4772 2.32206 33.0323 2.85977 33.0323 3.5223V10.002C33.0323 10.6645 32.4772 11.2022 31.7932 11.2022H25.1306C24.4467 11.2022 23.8916 10.6645 23.8916 10.002C23.8916 9.33947 24.4467 8.80176 25.1306 8.80176L28.4198 8.79376C25.9385 4.95619 21.5325 2.40048 16.5153 2.40048C9.6214 2.40048 3.88391 7.22385 2.70106 13.5739C2.62011 14.0076 2.56064 14.4493 2.5243 14.8974C2.47143 15.5215 1.93617 16.0016 1.29023 16.0016C0.365098 16.0016 0.0132163 15.187 0.0528649 14.7037C0.0842534 14.3213 0.13051 13.9436 0.188331 13.5707V13.5739ZM19.5674 21V19.4004H14.9395V16.6592H18.877V15.1006H14.9395V12.6533H19.5605V11.0469H14.9395H14.2695H12.8887V21H14.2695H14.9395H19.5674Z",
]

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

	const [coor, updateCoor, updateCoorByData, flag, toggleFlag] = useCoor();
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
				myToggleZoom: {
					show: true,
					title: flag ? "Toggle End" : "Toggle Start",
					icon: `path://${svg_toggle_ls[flag ? 0 : 1]}`,
					iconStyle: {
						color: flag ? "#F00" : "#2898FF",
						borderColor: flag ? "#F00" : "#2898FF",
					},
					onclick: toggleFlag
				},
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
			<ChartComponent key={flag}
				width={width * 0.85}
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