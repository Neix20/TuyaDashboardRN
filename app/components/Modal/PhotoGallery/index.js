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
    const { cusToast = {}, showCross = true } = props;
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
            <VStack py={5} height={"80%"} minHeight={250}> 
                {
                    (showCross) ? (
                        <View
                            style={{
                                position: "absolute",
                                zIndex: 1,
                                top: 10,
                                right: 10,
                            }}
                        >
                            <TouchableOpacity onPress={closeModal}>
                                <CloseBtn />
                            </TouchableOpacity>
                        </View>
                    ) : (<></>)
                }
                {/* Content */}
                {children}
            </VStack>
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

    const renderItem = ({ uri }, index) => {
        return (
            <TabView.Item key={index} style={{ width: "100%" }}>
                <View flexGrow={1} bgColor={"rgba(0,0,0,0.5)"}
                    onStartShouldSetResponder={() => true}>
                    <Image
                        source={uri}
                        style={{
                            height: "100%",
                            width: "100%"
                        }}
                        resizeMode={"contain"}
                        alt={uri + ""} />
                </View>
            </TabView.Item>
        )
    }

    return (
        <BaseModal {...props}>
            {/* Close Button */}
            <VStack flexGrow={1} space={3}>

                <View alignItems={"center"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 20,
                        color: "#FFF"
                    }}>Tutorial</Text>
                </View>

                <TabView value={tabPaneInd} onChange={(e) => setTabPaneInd(e)}>
                    {images.map(renderItem)}
                </TabView>

                {/* Pagination */}
                <View alignItems={"center"}>
                    <PaginationDot
                        activeDotColor={"#FFF"}
                        inactiveDotColor={"#FFF"}
                        curPage={tabPaneInd}
                        maxPage={images.length}
                        sizeRatio={2}
                    />
                </View>
            </VStack>
        </BaseModal>

    );
}

export default Index;