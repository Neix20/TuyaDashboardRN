import React from 'react';
import { Text, SafeAreaView } from "react-native";
import { View, Spinner } from 'native-base';

import Modal from "react-native-modal";

import { Animation } from "@config";

import Lottie from "lottie-react-native";

function Index(props) {

    // #region Props
    const { loading = true } = props;
    // #endregion

    return (
        <Modal
            isVisible={loading}
            animationInTiming={1}
            animationOutTiming={1}
            backdropOpacity={0.7}>
            <View
                alignItems={"center"}
                justifyContent={"center"}>
                {/* <Lottie
                    autoPlay
                    source={Animation.YatuLoader}
                    loop={true}
                    style={{
                        width: 360,
                        height: 360
                    }} /> */}
                <Spinner size={128} color={"#2898FF"} />
            </View>
            <View
                // display={"none"}
                alignItems={"center"}
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 10,
                }}
            >
                {/* <Text>{Utility.translate("Loading", lang)}</Text> */}
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                    color: "#2898FF"
                }}>Loading ...</Text>
            </View>
        </Modal>
    )
}

export default Index;