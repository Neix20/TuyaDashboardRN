import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { Utility } from "@utility";

import { BcBoxShadow } from "@components";

import ViewShot from "react-native-view-shot";

import BottomModal from "@components/Modal/BottomModals";
import Modal from "@components/Modal/CommunityModals";

import Share from "react-native-share";

import { useToggle } from "@hooks";

function ExpandModal(props) {
    const { children } = props;
    return (
        <Modal showCross={false} {...props}>
            <View width={"90%"}>{children}</View>
        </Modal>
    )
}

function VSItem(props) {

    const { Title = "", onPress = () => { } } = props;
    const { Icon = MaterialIcons, IconName = "dashboard-customize" } = props;

    return (
        <TouchableOpacity onPress={onPress}>
            <View alignItems={"center"} justifyContent={"center"} style={{ height: 40 }}>
                <HStack width={"90%"} space={5} alignItems={"center"}>
                    <Icon name={IconName} size={27} />
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                    }}>{Title}</Text>
                </HStack>
            </View>
        </TouchableOpacity>
    )
}

function VSModal(props) {

    // #region Props
    const { setShowModal = () => {} } = props;
    const { functionLs = [] } = props;
    const { onDownload = () => { }, onShare = () => { }, onExpand = () => { } } = props;
    // #endregion

    const closeModal = () => setShowModal(false);

    const default_ls = [
        {
            Title: "Expand",
            onPress: onExpand,
            Icon: FontAwesome5,
            IconName: "expand-arrows-alt"
        },
        {
            Title: "Share",
            onPress: onShare,
            Icon: FontAwesome5,
            IconName: "share-alt"
        },
        {
            Title: "Download",
            onPress: onDownload,
            Icon: FontAwesome5,
            IconName: "download"
        },
    ]

    const renderDefaultItem = (item, index) => (<VSItem key={index} {...item} />);
    const renderItem = (item, index) => {
        const { onPress = () => {} } = item;

        const wrapper = () => {
            onPress();
            closeModal();
        }
        return (
            <VSItem key={index} {...item} onPress={wrapper} />
        )
    }


    return (
        <BottomModal {...props} showCross={false}>
            <VStack space={3} width={"100%"}>
                {functionLs.map(renderItem)}
                {default_ls.map(renderDefaultItem)}
            </VStack>
        </BottomModal>
    );
}

function Index(props) {

    // #region Props
    const { title, children } = props;
    // #endregion

    // #region UseState
    const [showVsModal, setShowVsModal, toggleVsModal] = useToggle(false);
    const [showExModal, setShowExModal, toggleExModal] = useToggle(false);
    // #endregion

    // #region Helper
    const expandFunc = () => {
        toggleExModal();
        toggleVsModal();
    }

    const closeModal = () => setShowVsModal(false);
    // #endregion

    // #region ViewShot
    const itemRef = useRef(null);

    const shareFunc = () => {
        itemRef.current.capture()
            .then(async (uri) => {
                const shareOptions = {
                    title: 'Yatu Devices Dashboard',
                    url: uri,
                    subject: 'Yatu Daily dashboard',
                };
                Share.open(shareOptions)
                    .then(res => {
                        console.log('res:', res);
                        closeModal();
                    }).catch(err => {
                        throw new Error("An Error has occurred", err.message);
                    });
            })
            .catch(err => {
                console.log("Error ", err)
            });
    }

    const dlFunc = () => {
        itemRef.current.capture()
            .then(async (uri) => {
                await Utility.cacheDownloadFile(uri);
                closeModal();
            })
            .catch(err => {
                console.log("Error ", err)
            });
    }
    // #endregion

    return (
        <>
            <VSModal showModal={showVsModal} 
                setShowModal={setShowVsModal}
                onShare={shareFunc} onDownload={dlFunc} 
                onExpand={expandFunc} {...props}
            />
            <ExpandModal showModal={showExModal} setShowModal={setShowExModal}>{children}</ExpandModal>
            <BcBoxShadow>
                <VStack py={3} space={3} bgColor={"#FFF"} alignItems={"center"}>
                    <HStack width={"90%"}
                        alignItems={"center"}
                        justifyContent={"space-between"}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18,
                        }}>{title}</Text>
                        <TouchableOpacity onPress={toggleVsModal}>
                            <FontAwesome5 name={"ellipsis-v"} size={27} />
                        </TouchableOpacity>
                    </HStack>

                    <ViewShot ref={itemRef}
                        options={{ fileName: "test", format: "jpg", quality: 0.9 }}
                        style={{ width: "90%" }}>
                        <View bgColor={"#FFF"}>
                            {children}
                        </View>
                    </ViewShot>
                </VStack>
            </BcBoxShadow>
        </>
    );
}

export default Index;