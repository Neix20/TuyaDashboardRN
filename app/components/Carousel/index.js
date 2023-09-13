import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import { View } from "native-base";

import Carousel from 'react-native-reanimated-carousel';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PaginationDot from 'react-native-animated-pagination-dot';

function Index(props) {
    const { images = [], renderItem = () => { } } = props;

    const { width, height } = useWindowDimensions();

    // #region UseState
    const [dotInd, setDotInd] = useState(0);
    // #endregion

    return (
        <View key={width}>
            <GestureHandlerRootView >
                <Carousel
                    loop
                    width={width - 40}
                    height={180}
                    autoPlay={true}
                    autoPlayInterval={5000}
                    scrollAnimationDuration={1500}
                    data={images.map((_, ind) => ind)}
                    onProgressChange={(_, progress) => {
                        let num = Math.round(progress);
                        if (num >= images.length) {
                            num = 0;
                        }
                        setDotInd(num);
                    }}
                    renderItem={renderItem}
                />
            </GestureHandlerRootView>
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
                    maxPage={images.length}
                />
            </View>
        </View>
    )
}

export default Index;