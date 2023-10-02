import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, SafeAreaView, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Modal from 'react-native-modal';

import PaginationDot from 'react-native-animated-pagination-dot';

import { TabView } from "@rneui/themed";

function BaseModal(props) {

    // #region Props
    const { children } = props;
    const { showModal, setShowModal } = props;
    const { cusToast = {} } = props;
    // #endregion

    const closeModal = () => setShowModal(false);

    return (
        <Modal
            isVisible={showModal}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            onBackButtonPress={closeModal}
            onBackdropPress={closeModal}
            style={{ margin: 0 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {/* Content */}
                    {children}
                </View>
            </SafeAreaView>
        </Modal>
    )
}

function CloseBtn(props) {
    return (
        <View
            bgColor={"#c6c6c6"}
            borderRadius={15}
            alignItems={"center"}
            justifyContent={"center"}
            style={{
                height: 30,
                width: 30,
            }}>
            <FontAwesome name={"close"} size={18} color={"#fff"} />
        </View>
    );
}

function Index(props) {

    const { showModal = false, setShowModal = () => { } } = props;
    const { images = [] } = props;

    if (images.length == 0) {
        return (<></>)
    }

    const [tabPaneInd, setTabPaneInd] = useState(0);

    const closeModal = () => setShowModal(false);

    const renderItem = (item, index) => {
        const { uri } = item;
        return (
            <TabView.Item key={index} style={{ width: "100%" }}>
                <TouchableWithoutFeedback onPress={closeModal} style={{ flex: 1 }}>
                    <View flexGrow={1} justifyContent={"center"}>
                        <TouchableWithoutFeedback>
                            <Image
                                source={uri}
                                style={{
                                    width: "100%",
                                    height: 540,
                                }}
                                resizeMode={"contain"}
                                alt={uri + ""} />
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </TabView.Item>
        )
    }

    return (
        <BaseModal {...props}>
            {/* Front Layer */}
            <View style={{
                position: "absolute",
                zIndex: 2,
                top: 10,
                right: 10,
            }}>
                <TouchableOpacity onPress={closeModal}>
                    <CloseBtn />
                </TouchableOpacity>
            </View>

            <View alignItems={"center"}
                style={{
                    position: "absolute",
                    zIndex: 2,
                    top: 80,
                    left: 0,
                    right: 0
                }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                    color: "#FFF"
                }}>
                    Tutorial
                </Text>
            </View>

            <TabView
                value={tabPaneInd}
                onChange={(e) => setTabPaneInd(e)}>
                {
                    images.map(renderItem)
                }
            </TabView>

            <View alignItems={"center"}
                style={{
                    position: "absolute",
                    zIndex: 2,
                    bottom: 20,
                    left: 0,
                    right: 0,
                    display: (images.length > 0) ? "flex" : "none"
                }}>
                <PaginationDot
                    activeDotColor={"#fff"}
                    inactiveDotColor={"#fff"}
                    curPage={tabPaneInd}
                    maxPage={images.length}
                    sizeRatio={2}
                />
            </View>
        </BaseModal>

    );
}

export default Index;