import React, { useState, useEffect } from "react";

import { TouchableOpacity, Dimensions, Text } from "react-native";
import { View } from "native-base";

import Modal from 'react-native-modal';
import FontAwesome from "react-native-vector-icons/FontAwesome";

import CustomToast from "./CustomToast";

import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    const { children, noAnimation = false } = props;
    const { showCross = true } = props;
    const { showModal, setShowModal } = props;
    const { cusToast = init.toast } = props;
    // #endregion

    const insets = useSafeAreaInsets();
    const pt_top = (insets.top <= 0) ? 10 : insets.top;

    const closeModal = () => setShowModal(false);

    if (noAnimation) {
        return (
            <Modal isVisible={showModal}
                style={{
                    justifyContent: "flex-start",
                    margin: 0,
                }}
                avoidKeyboard={true}
                animationIn={{ from: { opacity: 1 }, to: { opacity: 1 } }}
                animationOut={{ from: { opacity: 0 }, to: { opacity: 0 } }}
                animationInTiming={1}
                animationOutTiming={1}
                onBackButtonPress={closeModal}
                onBackdropPress={closeModal}>
                <View
                    style={{
                        backgroundColor: 'white',
                        borderBottomLeftRadius: 15,
                        borderBottomRightRadius: 15,
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
                                <TouchableOpacity onPress={closeModal}>
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

                    <View alignItems={"center"} style={{
                        paddingTop: pt_top,
                        paddingBottom: 10,
                    }}>
                        {children}
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <Modal isVisible={showModal}
            style={{
                justifyContent: "flex-start",
                margin: 0,
            }}
            avoidKeyboard={true}
            animationIn={'slideInDown'}
            animationOut={'slideOutUp'}
            onBackButtonPress={closeModal}
            onBackdropPress={closeModal}>
            <View
                style={{
                    backgroundColor: 'white',
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
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
                            <TouchableOpacity onPress={closeModal}>
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

                <View alignItems={"center"} style={{
                    paddingTop: pt_top,
                    paddingBottom: 10,
                }}>
                    {children}
                </View>
            </View>
        </Modal>
    )
}

export default Index;
