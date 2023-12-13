import React, { useState } from "react";
import { View, VStack, HStack } from "native-base";

import Carousel from 'react-native-reanimated-carousel';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PaginationDot from 'react-native-animated-pagination-dot';

function Index(props) {
    const { data = [], renderItem = () => { } } = props;
    const { width, height } = props;

    const [dotInd, setDotInd] = useState(0);

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
}

export default Index;