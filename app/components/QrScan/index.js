import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, Image } from "react-native";
import { View, VStack, HStack } from "native-base";
import Lottie from "lottie-react-native";
import { Animation, Images, clsConst } from "@config";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Camera, useCameraPermission, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
import { BcSvgIcon, CustomToast } from "@components";
import { useToggle } from "@hooks";

function Scanner(props) {

    const { hasPermission } = useCameraPermission();
    const device = useCameraDevice("back");

    if (device == null || !hasPermission) {
        return (<></>);
    }

    const { onRead = () => { } } = props;

    const [qrFlag, setQrFlag] = useState(false);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes = []) => {
            if (codes && codes.length == 0) {
                return;
            }

            try {
                const { value = "" } = codes[0];

                if (value.length > 0 && !qrFlag) {
                    setQrFlag(_ => true);
                    onRead(value);
                }
            } catch (err) {
                console.error(err);
            }

            // const isNewQr = value !== qrCode;
            // const isFirstQr = qrCode.length == 0;

            // const flag = (isNewQr || isFirstQr) && value.length > 0;
            // if (flag) {
            //     setQrCode(value);
            //     onRead(value);
            // }
        }
    });

    useEffect(() => {
        if (qrFlag) {
            const timer = setTimeout(() => setQrFlag(_ => false), 1000 * 1.5);
            return () => clearTimeout(timer);
        }
    }, [qrFlag]);

    return (
        <Camera
            codeScanner={codeScanner}
            device={device}
            isActive={true}
            style={{ height: "70%" }}
        />
    )
}

function Marker(props) {

    const style = {
        frontLayer: {
            position: "absolute",
            zIndex: 2,
            top: 30,
            left: 0,
            right: 0,
            // bottom: 0,
        },
        rect: {
            width: 320,
            height: 320,
            borderWidth: 5,
            borderColor: "#2898FF",
        },
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 20,
            color: "#FFF"
        }
    }

    return (
        <VStack space={3} alignItems={"center"} justifyContent={"center"} style={style.frontLayer}>
            <HStack space={2} alignItems={'center'}>
                <Text style={style.title}>Scan the QR in the camera</Text>

                <FontAwesome name={"qrcode"} size={24} color={"#FFF"} />
            </HStack>
            <Lottie
                autoPlay
                source={Animation.CameraScan}
                loop={true}
                style={{
                    width: 360,
                    height: 360
                }} />
            {/* <View style={style.rect} /> */}
        </VStack>
    )
}

function QrCamera(props) {

    const { hasPermission, requestPermission = () => { } } = useCameraPermission();

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, []);

    return (
        <>
            {/* Front Layer */}
            <Marker />
            {/* Camera */}
            <Scanner key={hasPermission} {...props} />
        </>
    )
}

import Modal from 'react-native-modal';

function BaseModal(props) {

    // #region Props
    const { children, showCross = true, cusToast = {} } = props;
    const { showModal = false, setShowModal = () => { } } = props;
    // #endregion

    const init = {
        toast: {
            msg: "",
            flag: false
        }
    }

    const closeModal = () => setShowModal(false);

    const style = {
        close: {
            position: "absolute",
            zIndex: 5,
            top: 10,
            right: 10,
        },
        closeBtn: {
            height: 30,
            width: 30,
            borderRadius: 15,
            backgroundColor: "#c6c6c6"
        },
        toast: {
            position: "absolute",
            zIndex: 20,
            bottom: 10,
            left: 0,
            right: 0,
            display: (cusToast.flag) ? "flex" : "none"
        }
    }

    const CloseBtn = () => (
        <View alignItems={"center"} justifyContent={"center"} style={style.closeBtn}>
            <FontAwesome name={"close"} size={18} color={"#fff"} />
        </View>
    )

    return (
        <Modal
            isVisible={showModal}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            onBackButtonPress={closeModal}
            onBackdropPress={closeModal}
            style={{ margin: 0 }}>
            {
                (showCross) ? (
                    <View style={style.close}>
                        <TouchableOpacity onPress={closeModal}>
                            <CloseBtn />
                        </TouchableOpacity>
                    </View>
                ) : (<></>)
            }

            {/* Front Layer */}
            <View alignItems={"center"} style={style.toast} >
                <CustomToast>{cusToast.msg}</CustomToast>
            </View>

            {/* Content */}
            {children}
        </Modal>
    )
}

function QrCameraModal(props) {
    const { onRead = () => { } } = props;
    return (
        <BaseModal {...props}>
            <QrCamera onRead={onRead} />
        </BaseModal>
    )
}

function QrCameraBtn(props) {

    const [showQrModal, setShowQrModal, toggleQrModal] = useToggle(false);

    return (
        <>
            <QrCameraModal showModal={showQrModal} setShowModal={setShowQrModal} {...props} />
            <TouchableOpacity onPress={toggleQrModal}>
                <View borderRadius={20} bgColor={"#2898FF"}
                    alignItems={"center"} justifyContent={"center"}
                    style={{ height: 40, width: 40 }}>
                    <BcSvgIcon name={"QrScan"} size={24} color={"#FFF"} />
                </View>
            </TouchableOpacity>
        </>
    )
}

export {
    QrCamera,
    QrCameraBtn,
    QrCameraModal,
}