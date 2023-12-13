import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import Modal from 'react-native-modal';

import { useToggle, useModalToast } from "@hooks";

import { fetchSubscriptionProPlan } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { Body, EmptyList, Footer } from "./components";
import { usePayDict } from "./hooks";

// #region Components
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

function BaseModal(props) {

    // #region Props
    const { children } = props;
    const { showModal, setShowModal } = props;
    const { showCross = true } = props;
    // #endregion

    const closeModal = () => setShowModal(false);

    return (
        <Modal
            isVisible={showModal}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            onBackButtonPress={closeModal}
            onBackdropPress={closeModal}
            style={{ margin: 10 }}>
            <View bgColor={"#F3F8FC"} py={5} height={"90%"} borderRadius={20}>
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
                            <TouchableOpacity onPress={closeModal}>
                                <CloseBtn />
                            </TouchableOpacity>
                        </View>
                    ) : (<></>)
                }
                {children}
            </View>
        </Modal>
    )
}

function Logo(props) {

    const { img = {} } = props;

    const style = {
        txt: {
            fontFamily: "Roboto-Bold",
            fontSize: 14
        },
        titleTxt: {
            fontFamily: "Roboto-Bold",
            fontSize: 20
        }
    }

    return (
        <View alignItems={"center"}>
            <HStack alignItems={"center"} space={3}>
                <Image
                    source={img}
                    resizeMode={"contain"}
                    style={{
                        height: 60,
                        width: 60,
                        borderRadius: 8
                    }}
                    alt={"Yatu Pro Subscription"}
                />
                <VStack>
                    <Text style={style.txt}>Get on top of devices data</Text>
                    <HStack space={1} alignItems={"center"}>
                        <Text style={style.titleTxt}>Subscribe</Text>
                        <Text style={{ ...style.titleTxt, color: "#2898FF" }}>Yatu Plan</Text>
                    </HStack>
                </VStack>
            </HStack>
        </View>
    )
}

function Content(props) {

    const { hook = [] } = props;
    const [payDict, setPayDict, payDictKey, payProImg] = hook;

    if (payDictKey.length <= 0) {
        return (
            <EmptyList />
        )
    }

    return (
        <VStack space={3} flexGrow={1}>
            {/* Body */}
            <Body {...props} />

            {/* Footer */}
            <Footer height={40} />
        </VStack>
    )
}
// #endregion

function Index(props) {

    const { showModal = false, setShowModal = () => {} } = props;

    const userId = useSelector(Selectors.userIdSelect);
    
    const colors = {
        activeColor: "#2898FF",
        inActiveColor: "#FFF",
    }

    // #region UseState
    const [cusToast, showMsg] = useModalToast();

    const payDictHook = usePayDict();
    const [payDict, setPayDict, payDictKey, payProImg] = payDictHook;
    // #endregion

    // #region UseEffect
    useEffect(() => {
        SubscriptionProPlan();
    }, []);
    // #endregion

    // #region Api
    const SubscriptionProPlan = () => {
        fetchSubscriptionProPlan({
            param: {
                UserId: 10
            },
            onSetLoading: () => {}
        })
            .then(data => {
                setPayDict(data);
            })
            .catch(err => {
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    return (
        <BaseModal cusToast={cusToast} {...props}>
            <VStack space={3} flexGrow={1}>
                {/* Logo */}
                <Logo img={payProImg} />

                <Content hook={payDictHook} colors={colors} />
            </VStack>
        </BaseModal>
    )
}

export default Index;