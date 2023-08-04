import React, { useState, useEffect, useRef } from "react";
import { Dimensions, PanResponder } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { AreaChart, XAxis, YAxis } from 'react-native-svg-charts';
import {
    Circle,
    Defs,
    G,
    Line,
    LinearGradient,
    Path,
    Rect,
    Stop,
    Text as SvgText,
} from 'react-native-svg';
import * as shape from 'd3-shape';

function Index(props) {

    const { labels, data } = props;

    const apx = (size = 0) => {
        let wt = width - 40;
        return (wt / 750) * size;
    };

    const size = useRef(labels.length);

    const [positionX, setPositionX] = useState(-1);// The currently selected X coordinate position

    const panResponder = useRef(
        PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                updatePosition(evt.nativeEvent.locationX);
                return true;
            },
            onPanResponderMove: (evt, gestureState) => {
                updatePosition(evt.nativeEvent.locationX);
                return true;
            },
            onPanResponderRelease: () => {
                setPositionX(-1);
            },
        })
    );

    const posInterval = (pos) => {
        pos = pos / labels.length * data.length;
        return Math.ceil(pos);
    }

    const updatePosition = (x) => {
        const YAxisWidth = apx(90);
        const x0 = apx(0);// x0 position
        const chartWidth = apx(750) - YAxisWidth - x0;

        const xN = x0 + chartWidth;//xN position
        const xDistance = chartWidth / size.current;// The width of each coordinate point
        if (x <= x0) {
            x = x0;
        }
        if (x >= xN) {
            x = xN;
        }

        // The selected coordinate x :
        // (x - x0)/ xDistance = value
        let value = ((x - x0) / xDistance).toFixed(0);
        if (value >= size.current - 1) {
            value = size.current - 1; // Out of chart range, automatic correction
        }

        value = posInterval(value);

        setPositionX(value);
    };

    const CustomGrid = ({ x, y, ticks }) => (
        <G>
            {
                // Horizontal grid
                ticks.map((tick) => (
                    <Line
                        key={tick}
                        x1="0%"
                        x2="100%"
                        y1={y(tick)}
                        y2={y(tick)}
                        stroke="#EEF3F6"
                    />
                ))
            }
            {
                // Vertical grid
                data.map((_, index) => (
                    <Line
                        key={index.toString()}
                        y1="0%"
                        y2="100%"
                        x1={x(index)}
                        x2={x(index)}
                        stroke="#EEF3F6"
                    />
                ))
            }
        </G>
    );

    const CustomLine = ({ line }) => (
        <Path
            key="line"
            d={line}
            stroke="#FEBE18"
            strokeWidth={apx(6)}
            fill="none"
        />
    );

    const Shadow = ({ line }) => (
        <Path
            key={'shadow'}
            y={2}
            d={line}
            fill={'none'}
            strokeWidth={8}
            stroke={'rgba(134, 65, 244, 0.2)'}
        />
    )

    const CustomGradient = ({ index }) => (
        <Defs key={index}>
            <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FEBE18" stopOpacity={0.25} />
            </LinearGradient>
        </Defs>
    );

    const Tooltip = ({ x, y, ticks }) => {
        if (positionX < 0) {
            return null;
        }

        return (
            <G x={x(positionX)} key="tooltip">
                <G
                    x={positionX > 60 ? -apx(300 + 10) : apx(10)}
                    y={40}>
                    <Rect
                        y={-apx(24 + 24 + 20) / 2}
                        rx={apx(12)} // borderRadius
                        ry={apx(12)} // borderRadius
                        width={apx(300)}
                        height={apx(96)}
                        stroke="rgba(254, 190, 24, 0.27)"
                        fill="rgba(255, 255, 255, 0.8)"
                    />

                    <SvgText x={apx(20)} fill="#617485" opacity={0.65} fontSize={20}>
                        {labels[positionX]}
                    </SvgText>
                    <SvgText
                        x={apx(20)}
                        y={apx(24 + 20)}
                        fontSize={18}
                        fontWeight="bold"
                        fill="rgba(224, 188, 136, 1)">
                        {data[positionX]}%
                    </SvgText>
                </G>

                <G x={x}>
                    <Line
                        y1={0}
                        y2={600}
                        stroke="#FEBE18"
                        strokeWidth={apx(4)}
                        strokeDasharray={[6, 3]}
                    />

                    <Circle
                        cy={y(data[positionX])}
                        r={apx(20 / 2)}
                        stroke="#fff"
                        strokeWidth={apx(2)}
                        fill="#FEBE18"
                    />
                </G>
            </G>
        );
    };

    const yAxisContentInset = { top: 100, bottom: 45 };
    const xAxisContentInset = { left: 10, right: 10 };
    const verticalContentInset = { top: 100, bottom: 20 };

    return (
        <View
            bgColor={"#FFF"}
            alignItems={"center"}>
            <HStack>
                <YAxis
                    style={{
                        width: apx(90),
                    }}
                    data={data}
                    contentInset={yAxisContentInset}
                    svg={{ fontSize: apx(20), fill: '#617485' }}
                />
                <VStack
                    style={{
                        width: apx(660),
                        height: 600,
                    }}>
                    <View style={{ flex: 1 }} {...panResponder.current.panHandlers}>
                        <AreaChart
                            style={{ flex: 1 }}
                            data={data}
                            // curve={shape.curveNatural}
                            curve={shape.curveMonotoneX}
                            contentInset={verticalContentInset}
                            svg={{ fill: 'url(#gradient)' }}>
                            <CustomLine />
                            <CustomGrid />
                            <CustomGradient />
                            <Tooltip />
                        </AreaChart>
                    </View>
                    <XAxis
                        style={{
                            width: apx(660),
                            height: apx(60),
                        }}
                        numberOfTicks={8}
                        data={labels}
                        formatLabel={(value, index) => labels[value]}
                        contentInset={xAxisContentInset}
                        svg={{
                            fontSize: apx(20),
                            fill: '#617485',
                            y: apx(20),
                        }}
                    />
                </VStack>
            </HStack>
        </View>
    );
}

export default Index;