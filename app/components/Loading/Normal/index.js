import React from 'react';
import { Text, StyleSheet, Dimensions } from "react-native";
import { View, VStack, HStack, Spinner } from 'native-base';

import { GlobalStyles, GlobalColors } from "@config";

const screen = Dimensions.get("screen");
const { width, height } = screen;

const styles = StyleSheet.create({
    loading: {
        position: "absolute",
        zIndex: 4,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    }
});

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from "@redux";

import { Utility } from "@utility";

// import { RippleLoader, TextLoader } from 'react-native-indicator';

const Index = (props) => {

    // const lang = useSelector(Selectors.langSelect);

    const { backgroundColor = "black", opacity = 0.3 } = props;
    const { showLoading = true } = props;

    return (showLoading) ? (
        <>
            <View
                opacity={opacity}
                backgroundColor={backgroundColor}
                style={[styles.loading, {
                    zIndex: 3
                    // zIndex: showLoading ? 3 : -1,
                    // display: showLoading ? "flex" : "none",
                }]}
            />
            <View
                alignItems={"center"}
                justifyContent={"center"}
                style={[styles.loading, {
                    zIndex: 4
                }]}>
                <Spinner size={128} color={"#2898FF"} />
            </View>
            <View
                alignItems={"center"}
                justifyContent={"flex-end"}
                style={[styles.loading, {
                    bottom: height * 0.2,
                    zIndex: 4
                }]}
            >
                {/* <Text>{Utility.translate("Loading", lang)}</Text> */}
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                    color: "#2898FF"
                }}>Loading ...</Text>
            </View>
        </>
    ) : (<></>)
}

export default Index;