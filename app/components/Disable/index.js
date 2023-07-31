import React from "react";

import { StyleSheet } from "react-native";

import { View } from "native-base";

function Index(props) {
    const { children, backgroundColor = "#fff", opacity = 0.5, styles = {} } = props;
    return (
        <View style={styles}>
            {/* Front Layer */}
            <View style={{
                position: "absolute",
                zIndex: 10,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <View backgroundColor={backgroundColor} height={"80%"} width={"80%"} opacity={opacity}></View>
            </View>
            <View>
                {children}
            </View>
        </View>
    );
}


export default Index;