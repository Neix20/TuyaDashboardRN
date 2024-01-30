import React, { useState, useEffect } from "react";

import { TouchableOpacity } from "react-native";
import { View } from "native-base";

import Modal from 'react-native-modal';
import FontAwesome from "react-native-vector-icons/FontAwesome";

import CustomToast from "./CustomToast";

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
    const { cusToast = init.toast, backdropOpacity = 0.7, style = {} } = props;
    // #endregion

    const closeModal = () => setShowModal(false);

    const modalStyle = {
        closeStyle: {
            position: "absolute",
            zIndex: 1,
            top: 20,
            right: 20,
        },
        toastStyle: {
            position: "absolute",
            zIndex: 20,
            bottom: 10,
            left: 0,
            right: 0,
            display: (cusToast.flag) ? "flex" : "none"
        }
    }

    return (
        <Modal
            isVisible={showModal}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            onBackButtonPress={closeModal}
            onBackdropPress={closeModal}
            backdropOpacity={backdropOpacity}
            style={style}>
            <View bgColor={"#FFF"} borderRadius={20}>
                {/* Front Layer */}
                {
                    (showCross) ? (
                        <View style={modalStyle.closeStyle}>
                            <TouchableOpacity onPress={closeModal}>
                                <CloseBtn />
                            </TouchableOpacity>
                        </View>
                    ) : (<></>)
                }

                {/* Front Layer */}
                <View alignItems={"center"} style={modalStyle.toastStyle} >
                    <CustomToast>{cusToast.msg}</CustomToast>
                </View>

                {/* Content */}
                <View flexGrow={1} py={5}>
                    {children}
                </View>
            </View>
        </Modal>
    )
}

export default Index;
