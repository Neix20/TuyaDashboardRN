import React, { useState, useEffect } from "react";

import { TouchableOpacity, Dimensions } from "react-native";
import { View } from "native-base";
import { GlobalColors } from "@config";

import Modal from 'react-native-modal';
import FontAwesome from "react-native-vector-icons/FontAwesome";

import CustomToast from "./CustomToast";

const { width, height } = Dimensions.get("screen");

function CloseBtn(props) {
    return (
        <View
            bgColor={"#c6c6c6"}
            borderRadius={15}
            alignItems={"center"}
            justifyContent={"center"}
            style={{
                height: 24,
                width: 24,
            }}>
            <FontAwesome name={"close"} size={15} color={"#fff"} />
        </View>
    );
}

function Index(props) {

    // #region Initial
    const init = {
        toast: {
            msg: "",
            flag: false
        }
    }
    // #endregion

    // #region Props
    const { children } = props;
    const { showCross = true } = props;
    const { showModal, setShowModal } = props;
    const { cusToast = init.toast } = props;
    // #endregion

    return (
        <Modal isVisible={showModal}
            style={{
                justifyContent: "flex-end",
                margin: 0,
            }}
            avoidKeyboard={true}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            onBackButtonPress={() => setShowModal(false)}
            onBackdropPress={() => setShowModal(false)}>
            <View
                style={{
                    backgroundColor: 'white',
                    borderTopLeftRadius: 30,
                    borderTopEndRadius: 30,
                }}>
                {/* Front Layer */}
                {
                    (showCross) ? (
                        <View
                            style={{
                                position: "absolute",
                                zIndex: 1,
                                top: 20,
                                right: 20,
                                // height: 40,
                                // width: width,

                            }}
                        >
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <CloseBtn />
                            </TouchableOpacity>
                        </View>
                    ) : (<></>)
                }

                {/* Front Layer */}
                <View style={{
                    position: "absolute",
                    zIndex: 20,
                    bottom: 10,
                    left: 0,
                    right: 0,
                    display: (cusToast.flag) ? "flex" : "none"
                }} alignItems={"center"}>
                    <CustomToast>{cusToast.msg}</CustomToast>
                </View>

                {/* Content */}

                <View alignItems={"center"} py={5}>
                    {children}
                </View>
            </View>
        </Modal>
    )
}

export default Index;
