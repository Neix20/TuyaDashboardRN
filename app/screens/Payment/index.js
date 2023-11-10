import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, FlatList, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg, PaymentTypeData } from "@config";

import { BcHeader, BcBoxShadow, BcDisable, BcFooter, BaseModal, BcSvgIcon } from "@components";
import { useToggle } from "@hooks";

// #region Custom Hooks
function usePaymentLs(data = []) {

    const init = {
        selItem: {
            TypeId: -1
        }
    }

    // #region UseState
    const [ls, setLs] = useState([]);
    const [selItem, setSelItem] = useState(init.selItem);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        let arr = [...data];

        arr = arr.map((obj, ind) => {
            const { Image } = obj;
            return {
                ...obj,
                img: { uri: Image },
                flag: false,
                pos: ind,
            }
        });

        setLs(_ => arr);
    }, []);

    useEffect(() => {
        const arr = ls.filter(x => x.flag);
        if (arr.length > 0) {
            const item = arr[0];
            setSelItem(_ => item);
        }
    }, [JSON.stringify(ls)]);
    // #endregion

    const toggleItem = (item) => {
        const { pos, flag = true } = item;

        let arr = [...ls];

        // Set All as false
        arr = arr.map(x => ({ ...x, flag: false }));

        arr[pos].flag = !flag;

        setLs(_ => arr);
    }

    return [ls, setLs, selItem, toggleItem];
}

function usePaymentTerm() {

    const init = {
        term: {
            name: "",
            type: 1
        }
    }

    const [term, setTerm] = useState(init.term)

    // #region Helper
    const onPressEWallet = () => {
        const next_state = {
            name: "E-Wallet",
            type: 1
        }
        setTerm(_ => next_state);
    }

    const onPressFpx = () => {
        const next_state = {
            name: "Online Banking",
            type: 2
        }
        setTerm(_ => next_state);
    }

    const onPressECard = () => {
        const next_state = {
            name: "Credit Card",
            type: 3
        }
        setTerm(_ => next_state);
    }
    // #endregion

    return [term, onPressEWallet, onPressFpx, onPressECard];
}
// #endregion

// #region Components
function PaymentBtn(props) {

    const { flag = false, onPress = () => { } } = props;
    const { children = "" } = props;

    const Item = (props) => {
        return (
            <View bgColor={"#F01421"}
                borderRadius={12}
                alignItems={"center"}
                justifyContent={"center"}
                style={{ height: 48 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                    color: "#FFF"
                }}>{children}</Text>
            </View>
        )
    }

    if (flag) {
        return (
            <TouchableOpacity style={{ width: "90%" }} onPress={onPress}>
                <Item />
            </TouchableOpacity>
        )
    }

    return (
        <View width={"90%"}>
            <BcDisable>
                <Item />
            </BcDisable>
        </View>
    )
}

function PaymentTypeItem(props) {
    const { flag = false, onPress = () => { } } = props;
    const { Name, img } = props;
    return (
        <>
            <TouchableOpacity onPress={onPress}>
                <HStack alignItems={"center"} justifyContent={"space-between"}>
                    <Image
                        source={img}
                        style={{
                            width: 80,
                            height: 40
                        }}
                        resizeMode={"contain"}
                        alt={Name} />
                    <View flex={1}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 16
                        }}>{Name}</Text>
                    </View>
                    {
                        (flag) ? (
                            <View alignItems={"center"} style={{ width: 60 }}>
                                <FontAwesome name={"check-circle"} size={24} color={"#39B54A"} />
                            </View>
                        ) : (
                            <View style={{ width: 60, height: 40 }} />
                        )
                    }
                </HStack>
            </TouchableOpacity>
            <Divider my={2} />
        </>
    )
}

function PaymentTypeModal(props) {

    const { showModal = false, setShowModal = () => { } } = props;
    const { term = {}, data = [], onSelect = () => { } } = props;
    const renderItem = ({ item, index }) => {
        const onPress = () => {
            onSelect(item);
            setShowModal(_ => false);
        };
        return (
            <PaymentTypeItem key={index} {...item} onPress={onPress} />
        )
    }

    const { name = "", type = -1 } = term;

    return (
        <BaseModal {...props}>
            <VStack bgColor={"#FFF"} width={"100%"} alignItems={"center"}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 18
                }}>Select {name}</Text>
                <Divider my={2} bgColor={"#EBEBEB"} width={"80%"} />
                <FlatList
                    data={data.filter(x => x.TypeId == type)}
                    renderItem={renderItem}
                    style={{ width: "90%" }}
                />
            </VStack>
        </BaseModal>
    )
}

function PaymentTypeBtn(props) {

    const { children = null, flag = false } = props;
    const { onPress = () => { } } = props;
    const { Icon, name, img } = props;

    const color = {
        active: "#F01421",
        inactive: "#98A0A8",
        txt: "#000"
    }

    const clr = flag ? color.active : color.inactive;
    const txtClr = flag ? color.txt : color.inactive;

    return (
        <TouchableOpacity onPress={onPress}
            style={{ flex: 1 }}>
            <VStack space={2}>
                <BcBoxShadow>
                    <View py={1}
                        borderRadius={8}
                        bgColor={"#FFF"}
                        alignItems={"center"} justifyContent={"center"}>
                        {
                            (flag) ? (
                                <Image
                                    source={img}
                                    style={{
                                        width: 80,
                                        height: 40
                                    }}
                                    alt={name} />
                            ) : (
                                <Icon name={name} color={clr} size={36} />
                            )
                        }
                    </View>
                </BcBoxShadow>
                <View alignItems={"center"}>
                    <HStack space={1}
                        alignItems={"center"}>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: "Roboto-Bold",
                            color: txtClr
                        }}>{children}</Text>
                        {
                            (flag) ? <FontAwesome name={"check-circle"} size={18} color={"#39B54A"} /> : <></>
                        }
                    </HStack>
                </View>
            </VStack>
        </TouchableOpacity>
    )
}

function PaymentType(props) {

    const { hook = [] } = props;
    const [ls, setLs, selItem, toggleItem] = hook;

    const [showModal, setShowModal, toggleModal] = useToggle(false);
    const [term, onPressEWallet, onPressFpx, onPressECard] = usePaymentTerm();

    // #region Helper
    const onSelWallet = () => {
        toggleModal();
        onPressEWallet();
    }

    const onSelFpx = () => {
        toggleModal();
        onPressFpx();
    }

    const onSelCard = () => {
        toggleModal();
        onPressECard();
    }
    // #endregion

    return (
        <>
            <PaymentTypeModal
                showModal={showModal} setShowModal={setShowModal}
                term={term} data={ls} onSelect={toggleItem} />
            <BcBoxShadow>
                <VStack py={3} space={3}
                    bgColor={"#FFF"}
                    alignItems={"center"}>

                    {/* Title */}
                    <View width={"90%"}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 14,
                        }}>Select Payment Method</Text>
                    </View>

                    {/* Payment */}
                    <HStack space={3} width={"90%"}
                        alignItems={"center"} justifyContent={"space-between"}>
                        <PaymentTypeBtn onPress={onSelWallet} 
                            flag={selItem.TypeId == 1} img={selItem.img}
                            Icon={BcSvgIcon} name={"EWallet"}>E-Wallet</PaymentTypeBtn>
                        <PaymentTypeBtn onPress={onSelFpx} 
                            flag={selItem.TypeId == 2} img={selItem.img}
                            Icon={BcSvgIcon} name={"Fpx"}>Online Banking</PaymentTypeBtn>
                        <PaymentTypeBtn onPress={onSelCard} 
                            flag={selItem.TypeId == 3} img={selItem.img}
                            Icon={BcSvgIcon} name={"ECard"}>Credit Card</PaymentTypeBtn>
                    </HStack>
                </VStack>
            </BcBoxShadow>
        </>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const paymentHook = usePaymentLs(PaymentTypeData);
    const [ls, setLs, selItem, toggleItem] = paymentHook;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <BcHeader>Payment</BcHeader>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>

                    <VStack space={3} flexGrow={1}>
                        <BcBoxShadow>
                            <View bgColor={"#FFF"} style={{ height: 200 }} />
                        </BcBoxShadow>

                        <PaymentType hook={paymentHook} />

                        <BcBoxShadow>
                            <View bgColor={"#FFF"} style={{ height: 600 }} />
                        </BcBoxShadow>
                    </VStack>

                </ScrollView>

                {/* Footer */}
                <BcFooter>
                    <PaymentBtn flag={selItem.TypeId >= 1}>Confirm & Pay</PaymentBtn>
                </BcFooter>
            </View>
        </SafeAreaView>
    );
}

export default Index;