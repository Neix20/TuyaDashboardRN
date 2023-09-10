import React, { useState, useEffect } from "react";

import { TouchableOpacity, Dimensions } from "react-native";
import { View } from "native-base";

import Modal from 'react-native-modal';
import FontAwesome from "react-native-vector-icons/FontAwesome";

import CustomToast from "./CustomToast";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { BcSvgIcon } from "@components";

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
    // return (
    //     <BcSvgIcon name={"Cross"} width={24} height={24} fill={"#C6C6C6"} />
    // )
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
    const { cusToast = init.toast, backdropOpacity = 0.7 } = props;
    // #endregion

    return (
        <Modal
            isVisible={showModal}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            onBackButtonPress={() => setShowModal(false)}
            onBackdropPress={() => setShowModal(false)}
            backdropOpacity={backdropOpacity}>
            <View
                style={{
                    backgroundColor: 'white',
                    borderRadius: 20,
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
