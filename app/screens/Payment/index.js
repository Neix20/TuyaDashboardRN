import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, Divider, FlatList, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";

import { BcHeader, BcBoxShadow, BcDisable, BcFooter, BaseModal, BcSvgIcon, BcLoading } from "@components";
import { useToggle, useModalToast } from "@hooks";

import { CheckBox } from "@rneui/base";

import { fetchPaymentTypeList, fetchVerifyPromoCode } from "@api";

// #region Custom Hooks
function usePaymentLs() {

    const init = {
        selItem: {
            TypeId: -1
        }
    }

    // #region UseState
    const [data, setData] = useState([]);
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
    }, [JSON.stringify(data)]);

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

    return [ls, setLs, selItem, toggleItem, setData];
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

// #region Payment Type Components
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
            <Divider my={2} bgColor={"#EBEBEB"} />
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
    const { Icon, name, item = {} } = props;

    const color = {
        active: "#F01421",
        inactive: "#98A0A8",
        txt: "#000"
    }

    const { img: sImg, Name: sName } = item;

    const clr = flag ? color.active : color.inactive;
    const txtClr = flag ? color.txt : color.inactive;

    return (
        <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
            <VStack space={2}>
                <BcBoxShadow>
                    <View py={1} bgColor={"#FFF"}
                        borderRadius={8}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ height: 48 }}>
                        {
                            (flag) ? (
                                <Image
                                    source={sImg}
                                    style={{
                                        width: 80,
                                        height: 40
                                    }}
                                    alt={sName} />
                            ) : (
                                <Icon name={name} color={clr} size={36} />
                            )
                        }
                    </View>
                </BcBoxShadow>
                <View alignItems={"center"}>
                    <HStack space={1} alignItems={"center"}>
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
            <PaymentTypeModal showModal={showModal} setShowModal={setShowModal}
                term={term} data={ls} onSelect={toggleItem} />
            <BcBoxShadow>
                <VStack py={3} space={3}
                    bgColor={"#FFF"}
                    alignItems={"center"}>

                    {/* Title */}
                    <View width={"90%"}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 16,
                        }}>Select Payment Method</Text>
                    </View>

                    {/* Payment */}
                    <HStack space={3} width={"90%"}
                        alignItems={"center"} justifyContent={"space-between"}>
                        <PaymentTypeBtn onPress={onSelWallet}
                            flag={selItem.TypeId == 1} item={selItem}
                            Icon={BcSvgIcon} name={"EWallet"}>E-Wallet</PaymentTypeBtn>
                        <PaymentTypeBtn onPress={onSelFpx}
                            flag={selItem.TypeId == 2} item={selItem}
                            Icon={BcSvgIcon} name={"Fpx"}>Online Banking</PaymentTypeBtn>
                        <PaymentTypeBtn onPress={onSelCard}
                            flag={selItem.TypeId == 3} item={selItem}
                            Icon={BcSvgIcon} name={"ECard"}>Credit Card</PaymentTypeBtn>
                    </HStack>
                </VStack>
            </BcBoxShadow>
        </>
    )
}
// #endregion

// #region Components
function CusBtn(props) {

    const { flag = false, onPress = () => { } } = props;
    const { children = "", width = "90%" } = props;

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
            <TouchableOpacity style={{ width: width }} onPress={onPress}>
                <Item />
            </TouchableOpacity>
        )
    }

    return (
        <View width={width}>
            <BcDisable>
                <Item />
            </BcDisable>
        </View>
    )
}

function PaymentBodyItem(props) {
    const { data = {} } = props;
    const { Name, Description, img, flag = true } = data

    const borderRadius = 8;

    return (
        <>
            <BcBoxShadow style={{ borderRadius, width: "100%" }}>
                <HStack bgColor={"#FFF"}
                    borderRadius={borderRadius}
                    alignItems={"center"}>
                    <Image
                        source={img}
                        style={{
                            height: 100,
                            width: 100,
                            borderTopLeftRadius: borderRadius,
                            borderBottomLeftRadius: borderRadius,
                        }}
                        alt={Name}
                    />
                    <VStack px={3} flex={1}
                        space={2}
                        style={{
                            height: 80
                        }}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 16,
                        }}>{Name}</Text>
                        <Text>{Description}</Text>
                    </VStack>
                </HStack>
            </BcBoxShadow>
            <View style={{ height: 10 }} />
        </>
    )
}

function PaymentBody(props) {
    const { data = [] } = props;

    const renderItem = ({ item, index }) => {
        return <PaymentBodyItem key={index} data={item} />
    }

    return (
        <VStack flex={1} py={3} space={3}
            bgColor={"#FFF"} alignItems={"center"}>
            <View width={"90%"} style={{ paddingHorizontal: 2 }}>
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                }}>Product</Text>
            </View>
            <FlatList
                data={data} renderItem={renderItem}
                style={{ width: "90%" }}
                contentContainerStyle={{ padding: 2 }} />
        </VStack>
    );
}

function PaymentDetailItem(props) {

    const { title = "", value = "" } = props;

    return (
        <HStack width={"90%"}
            alignItems={"center"} justifyContent={"space-between"}>
            <Text style={{
                fontFamily: "Roboto-Medium",
                fontSize: 16
            }}>{title}</Text>
            <Text style={{
                fontFamily: "Roboto-Medium",
                fontSize: 16
            }}>{value}</Text>
        </HStack>
    )
}

function usePromoCode() {


    const init = {
        promo: {
            code: "",
            val: 0
        }
    };

    const [promo, setPromo] = useState(init.promo);

    const onChangePromo = (name, val) => {
        const next_state = {...promo};
        next_state[name] = val;
        setPromo(_ => next_state);
    }

    const setPromoCode = (val) => onChangePromo("code", val);
    const setPromoVal = (val) => onChangePromo("val", val);

    
    const flag = promo.code.length > 0;
    return [promo, setPromoCode, setPromoVal, flag];
}

function PromoCodeModal(props) {

    const { hook = [], SubscriptionCode = "" } = props;
    const { showModal = false, setShowModal = () => {} } = props;

    const [promo, setPromoCode, setPromoVal, flag] = hook;
    const { code: promoCode, val: promoVal} = promo;

    const [cusToast, showMsg] = useModalToast();

    const VerifyPromoCode = () => {
        fetchVerifyPromoCode({
            param: {
                PromoCode: promoCode,
                SubscriptionCode: SubscriptionCode
            },
            onSetLoading: () => {}
        })
        .then(data => {
            const { DiscountCode = 1 } = data;
            setPromoVal(DiscountCode);
            setShowModal(false);
        })
        .catch(err => {
            console.log(`Error: ${err}`)
        })
    }

    return (
        <BaseModal {...props} cusToast={cusToast}>
            <VStack alignItems={"center"} space={3} width={"100%"}>
                {/* Title */}
                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16
                }}>Enter Promo Code</Text>

                <View px={1} bgColor={"#EEF3F6"} width={"80%"}>
                    <TextInput
                        onChangeText={setPromoCode}
                        autoCapitalize={"none"}
                        placeholder={"XXX"}
                        style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 16,
                            color: "#000"
                        }} />
                </View>

                {/* Button */}
                <CusBtn flag={flag} width={"80%"} onPress={VerifyPromoCode}>Submit Promo Code</CusBtn>
            </VStack>
        </BaseModal>
    )
}

function PromoCode(props) {

    const { data = "" } = props;

    if (data.length > 0) {
        return (
            <TouchableOpacity {...props}>
            <Text style={{
                fontFamily: "Roboto-Medium",
                fontSize: 16,
                textDecorationLine: 'underline',
                color: "#A6AFB8"
            }}>Code: {data}</Text>
            </TouchableOpacity>
        )
    }
    
    return (
        <TouchableOpacity {...props}>
            <Text style={{
                fontFamily: "Roboto-Medium",
                fontSize: 16,
                textDecorationLine: 'underline',
                color: "#A6AFB8"
            }}>Enter Promo Code</Text>
        </TouchableOpacity>
    )
}

function PaymentDetail(props) {

    const { data = [] } = props;

    const [showPcModal, setShowPcModal, togglePcModal] = useToggle(false);

    const promoHook = usePromoCode();
    const [promo, setPromoCode, setPromoVal, flag] = promoHook;
    const { code: promoCode, val: promoVal} = promo;

    const SubTotal = data.map(x => +x.Price).reduce((a, b) => a + b);
    const Promo = SubTotal * promoVal / 100;
    const Total = SubTotal - Promo;

    if (data.length <= 0) {
        return (<></>)
    }

    return (
        <>
            <PromoCodeModal hook={promoHook} SubscriptionCode={data[0]?.Code}
                showModal={showPcModal} 
                setShowModal={setShowPcModal} />
            <VStack py={3}
                bgColor={"#FFF"}
                alignItems={"center"}>

                {/* Title */}
                <View width={"90%"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 16,
                    }}>Details</Text>
                </View>

                {/* Body */}
                <Divider mt={3} mb={2} bgColor={"#EBEBEB"} width={"90%"} />

                <PaymentDetailItem title={"Price"} value={`RM ${SubTotal.toFixed(2)}`} />
                <Divider my={2} bgColor={"#EBEBEB"} width={"90%"} />

                <HStack width={"90%"} alignItems={"center"} justifyContent={"space-between"}>
                    <HStack alignItems={"center"} space={3}>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 16
                        }}>Promo</Text>
                        <PromoCode onPress={togglePcModal} data={promoCode} />
                    </HStack>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 16
                    }}>{`RM ${Promo.toFixed(2)}`}</Text>
                </HStack>
                <Divider my={2} bgColor={"#EBEBEB"} width={"90%"} />

                <PaymentDetailItem title={"Total"} value={`RM ${Total.toFixed(2)}`} />
                <Divider my={2} bgColor={"#EBEBEB"} width={"90%"} />
            </VStack>
        </>
    )
}
// #endregion

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { data = [] } = props.route.params;
    // const data = [
    //     {
    //         "title": "Storage Module",
    //         "description": "Storage Fee 1 Year Data Keeping",
    //         "img": "https://i.imgur.com/dQDxXYa.png"
    //     }
    // ];

    const paymentHook = usePaymentLs();
    const [ls, setLs, selItem, toggleItem, setData] = paymentHook;

    const [loading, setLoading, toggleLoading] = useToggle(false);

    useEffect(() => {
        if (isFocused) {
            fetchPaymentTypeList({
                param: {
                    UserId: 25,
                },
                onSetLoading: setLoading
            })
                .then(data => {
                    setData(data)
                })
                .catch(res => {
                    console.log(`Error: ${res}`);
                })
        }
    }, [isFocused]);

    const GoToWebPayment = () => {
        navigation.navigate("WebPayment");
    }

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Payment</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <VStack space={3} flexGrow={1}>
                        <PaymentBody data={data} />

                        <PaymentType hook={paymentHook} />

                        <PaymentDetail data={data} />
                    </VStack>

                    {/* Footer */}
                    <BcFooter>
                        <CusBtn flag={selItem.TypeId != -1} onPress={GoToWebPayment}>Confirm & Pay</CusBtn>
                    </BcFooter>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;