// Choose your preferred renderer
// import { SkiaChart, SVGRenderer } from '@wuba/react-native-echarts';
import { SvgChart, SVGRenderer } from '@wuba/react-native-echarts';
import * as echarts from 'echarts/core';
import { useRef, useEffect } from 'react';
import {
    BarChart,
} from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
} from 'echarts/components';

// Register extensions
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    SVGRenderer,
    BarChart,
])

const E_HEIGHT = 250;
const E_WIDTH = 300;

// Initialize
function ChartComponent({ option }) {
    const chartRef = useRef(null);

    useEffect(() => {
        let chart;
        if (chartRef.current) {
            // @ts-ignore
            chart = echarts.init(chartRef.current, 'light', {
                renderer: 'svg',
                width: E_WIDTH,
                height: E_HEIGHT,
            });
            chart.setOption(option);
        }
        return () => chart?.dispose();
    }, [option]);

    // Choose your preferred chart component
    // return <SkiaChart ref={chartRef} />;
    return <SvgChart ref={chartRef} />;
}

// Component usage
export default function App() {
    const option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 150],
                type: 'bar',
            },
        ],
    }
    return <ChartComponent option={option} />
}