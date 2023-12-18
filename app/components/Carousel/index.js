import React, { useState, useEffect } from "react";
import { View, VStack, HStack } from "native-base";

import Carousel from 'react-native-reanimated-carousel';
import { GestureHandlerRootView } from "react-native-gesture-handler";

function Backup(props) {
    const { data = [], renderItem = () => { } } = props;
    const { height = 400, autoPlay = true, autoPlayInterval = 3000 } = props;
    const { width = 400 } = props;

    if (data.length == 0) {
        return (<></>)
    }

    const [tabPaneInd, setTabPaneInd] = useState(0);
    const onChangeTabPane = (e) => setTabPaneInd(e);

    const onProgressChange = (_, progress) => {
        setTabPaneInd(val => (Math.round(progress) + 1) % data.length);
    }

    const posArr = [...Array(data.length).keys()];

    return (
        <VStack flexGrow={1} space={3} 
            style={{ height: height }}>
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
            <View alignItems={"center"}>
                <PaginationDot
                    activeDotColor={"#F01821"}
                    inactiveDotColor={"#F01821"}
                    curPage={tabPaneInd}
                    maxPage={data.length}
                    sizeRatio={2}
                />
            </View>
        </VStack>
    )
}

import { TabView } from "@rneui/themed";
import PaginationDot from 'react-native-animated-pagination-dot';

function Index(props) {

    const { data = [], renderItem = () => { } } = props;
    const { height = 400, autoPlay = true, autoPlayInterval = 3000 } = props;

    if (data.length == 0) {
        return (<></>)
    }

    const [tabPaneInd, setTabPaneInd] = useState(0);
    const onChangeTabPane = (e) => setTabPaneInd(e);

    const renderChild = (item, index) => {
        return (
            <TabView.Item key={index} style={{ width: "100%" }}>
                {renderItem(item)}
            </TabView.Item>
        )
    }

    // Auto-Loop Timer
    useEffect(() => {
        let tick = () => {};

        if (autoPlay) {
            tick = () => setTabPaneInd(val => (val + 1) % data.length);
        }

        const timer = setInterval(tick, autoPlayInterval);
        return () => clearInterval(timer);
    }, [autoPlay, autoPlayInterval]);

    return (
        <VStack flexGrow={1} space={3}
            style={{ height: height }}>
            <TabView value={tabPaneInd} onChange={onChangeTabPane}>
                {data.map(renderChild)}
            </TabView>
            <View alignItems={"center"}>
                <PaginationDot
                    activeDotColor={"#F01821"}
                    inactiveDotColor={"#F01821"}
                    curPage={tabPaneInd}
                    maxPage={data.length}
                    sizeRatio={2}
                />
            </View>
        </VStack>
    )
}

export default Index;