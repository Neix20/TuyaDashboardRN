import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import { View, VStack, HStack } from "native-base";

import Carousel from 'react-native-reanimated-carousel';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PaginationDot from 'react-native-animated-pagination-dot';

function Index(props) {
    const { data = [], renderItem = () => { } } = props;
    const { width, height } = props;

    // #region UseState
    const [dotInd, setDotInd] = useState(0);
    // #endregion

    const onProgressChange = (_, progress) => {
        let num = Math.round(progress);
        if (num >= data.length) {
            num = 0;
        }
        setDotInd(_ => num);
    }

    const posArr = [...Array(data.length).keys()];

    return (
        <VStack alignItems={"center"}>
            <GestureHandlerRootView >
                <Carousel loop
                    width={width}
                    height={height}
                    autoPlay={true}
                    autoPlayInterval={5000}
                    scrollAnimationDuration={1500}
                    data={posArr}
                    onProgressChange={onProgressChange}
                    renderItem={renderItem}
                />
            </GestureHandlerRootView>
            <PaginationDot
                activeDotColor={"#F00"}
                inactiveDotColor={"#000"}
                curPage={dotInd}
                maxPage={data.length}
            />
        </VStack>
    )

    return (
        <View key={width}>
            <GestureHandlerRootView >
                <Carousel loop
                    width={width}
                    height={height}
                    autoPlay={true}
                    autoPlayInterval={5000}
                    scrollAnimationDuration={1500}
                    data={posArr}
                    onProgressChange={onProgressChange}
                    renderItem={renderItem}
                />
            </GestureHandlerRootView>
            <PaginationDot
                activeDotColor={"#F00"}
                inactiveDotColor={"#fff"}
                curPage={dotInd}
                maxPage={data.length}
            />
            <View
                position={"absolute"}
                alignItems={"center"}
                style={{
                    left: 0,
                    right: 0,
                    bottom: 20,
                }}>
                <PaginationDot
                    activeDotColor={"#F00"}
                    inactiveDotColor={"#fff"}
                    curPage={dotInd}
                    maxPage={data.length}
                />
            </View>
        </View>
    )
}

export default Index;