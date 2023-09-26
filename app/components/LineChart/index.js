import React, { useState, useEffect } from "react";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { LineChart as LineChartSvg, YAxis, XAxis, Path } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

function Index(props) {

    const { labels = [] } = props;
    const { min = 0, max = 0, dataset = [] } = props;

    const Shadow = (props) => {
        const { lines } = props;
        return (
            <Path
                key={'shadow'}
                y={2}
                d={lines}
                fill={"none"}
                strokeWidth={4}
                stroke={'rgba(134, 65, 244, 0.2)'}
            />
        )
    }

    if (dataset.length == 0) {
        return (<></>)
    }

    return (
        <HStack space={2}>
            <YAxis
                data={[min, max]}
                contentInset={{ top: 20, bottom: 20 }}
                svg={{
                    fill: 'grey',
                    fontSize: 10,
                }}
            />
            <VStack width={"100%"}>
                <LineChartSvg
                    data={dataset}
                    style={{ height: 300, width: "90%" }}
                    svg={{ strokeWidth: 2 }}
                    curve={shape.curveNatural}
                    contentInset={{ top: 20, bottom: 20 }}
                ></LineChartSvg>
                {
                    (labels.length > 0) ? (
                        <XAxis
                            style={{ width: "90%" }}
                            data={labels}
                            formatLabel={(_, index) => labels[index]}
                            contentInset={{ left: 10, right: 10 }}
                            svg={{ fontSize: 10, fill: 'black' }}
                        />
                    ) : (
                        <></>
                    )
                }
            </VStack>
        </HStack>
    )
}

export default Index;