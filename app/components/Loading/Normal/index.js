import React from 'react';
import { Text, SafeAreaView } from "react-native";
import { View, Spinner, VStack } from 'native-base';

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
                {/* <VStack space={3}>
                    <Spinner size={128} color={"#2898FF"} />

                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 24,
                        color: "#2898FF"
                    }}>Loading ...</Text>
                </VStack> */}
                <VStack space={3} alignItems={"center"}>
                    <Lottie
                        autoPlay
                        source={Animation.YatuLoader}
                        loop={true}
                        style={{
                            width: 360,
                            height: 360
                        }} />

                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 24,
                        color: "#2898FF"
                    }}>Loading ...</Text>
                </VStack>
            </View>

        </Modal>
    )
}

export default Index;