import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg, Animation } from "@config";

import { BcHeaderWithAdd, BcLoading, BcSvgIcon, BcTooltip } from "@components";
import { useToggle } from "@hooks";

import { fetchSubscriptionProPlan } from "@api";

import { Tab, TabView } from "@rneui/themed";
import LinearGradient from "react-native-linear-gradient";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import Lottie from "lottie-react-native";

// #region Components
function EmptyList(props) {
    return (
        <View flexGrow={1} justifyContent={"center"}>
            <VStack space={3} alignItems={"center"}>
                <Lottie
                    autoPlay
                    source={Animation.YatuLoader}
                    loop={true}
                    style={{
                        width: 360,
                        height: 360
                    }} />

                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 24,
                    color: "#2898FF"
                }}>Loading ...</Text>
            </VStack>
        </View>
    )
}

function Footer(props) {

    const { height = 60 } = props;
    return (
        <View alignItems={"center"}
            justifyContent={"center"}
            style={{ height: height }}>
            <Text style={{
                width: "90%",
                textAlign: "center",
                fontFamily: "Roboto-Medium",
                fontSize: 14,
                color: "#585858"
            }}>
                All Subscription are automatically renewed unless cancelled during the subscription period.
            </Text>
        </View>
    )
}

function TPHeader(props) {

    const { hook = [], colors = {}, borderRadius = 4, payDictHook = [] } = props;

    const [tpInd, setTpInd, onChangeTpInd] = hook;
    const [payDict, setPayDict, payDictKey] = payDictHook;

    if (payDictKey.length == 0) {
        return (<></>)
    }

    return (
        <Tab dense
            value={tpInd}
            onChange={onChangeTpInd}
            disableIndicator={true}
            style={{
                height: 32,
                width: "90%", columnGap: 5,

            }}>
            {
                payDictKey.map((term, ind) => {
                    return (
                        <Tab.Item key={ind}
                            title={term}
                            titleStyle={(active) => ({
                                color: (active) ? "#FFF" : "#ACB3BB",
                                fontSize: 12
                            })}
                            buttonStyle={(active) => ({
                                width: "100%", height: "100%",
                                padding: 0, borderRadius: borderRadius,
                                backgroundColor: (active) ? colors.activeColor : colors.inActiveColor
                            })}
                        />
                    )
                })
            }
        </Tab>
    )
}

function Detail(props) {

    const { inverse = false, data = [], colors = {} } = props;

    const iconColor = inverse ? colors.inActiveColor : colors.activeColor;
    const txtColor = inverse ? "#FFF" : "#000";
    const infoColor = inverse ? "#484848" : "#98A0A8";

    const renderItem = ({ item, index }) => {

        // To Remove
        if (typeof (item) === "string") {
            return (
                <>
                    <HStack key={index} alignItems={"center"} space={5}>
                        <FontAwesome name={"check-circle"} color={"#FFF"} size={24} />
                        <View flex={1}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 18,
                                color: txtColor
                            }}>{item}</Text>
                        </View>
                        <View style={{ height: 24, width: 24 }} />
                    </HStack>
                    <View style={{ height: 5 }} />
                </>
            )
        }

        const { title = "", description = "", icon = "", info = "", showInfo = false } = item;
        return (
            <>
                <HStack key={index} alignItems={"center"} space={5} onStartShouldSetResponder={() => true}>
                    <BcSvgIcon name={icon} size={24} color={iconColor} />
                    <View flex={1}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 16,
                            color: txtColor
                        }}>{title}</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: txtColor
                        }}>{description}</Text>
                    </View>
                    {
                        (showInfo) ? (
                            <BcTooltip content={<Text style={{ textAlign: "justify" }}>{info}</Text>}>
                                <FontAwesome5 name={"info-circle"} color={infoColor} size={24} />
                            </BcTooltip>
                        ) : (
                            <View style={{ height: 24, width: 24 }} />
                        )
                    }
                </HStack>
                <View style={{ height: 10 }} />
            </>
        );
    }

    return (
        <View flexGrow={1} alignItems={"center"}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyboardShouldPersistTaps={"always"}
                style={{ flex: 1, width: "90%" }} />
        </View>
    );
}

function TPBody(props) {

    const navigation = useNavigation();
    const { inverse = false, title = "", hook = [], colors = {} } = props;
    const [payDict, setPayDict, payDictKey] = hook;

    if (payDictKey.length == 0) {
        return <></>
    }

    const obj = payDict[title];
    const { price = 0, detail = [], title: oTitle = "", data: oData = {}, showBtn = false } = obj;

    const GoToPayment = () => {
        navigation.navigate("Payment", {
            data: [oData]
        });
    }

    const txtColor = inverse ? "#FFF" : "#000";
    const bgColor = inverse ? colors.activeColor : colors.inActiveColor;
    const bgInvColor = inverse ? colors.inActiveColor : colors.activeColor;

    return (
        <TabView.Item style={{ width: "100%", alignItems: "center" }}>

            <VStack flexGrow={1} space={2} py={3} bgColor={bgColor}
                width={"90%"}
                justifyContent={"space-between"}
                borderRadius={8}>

                {/* Price */}
                <View alignItems={"center"}>
                    <HStack alignItems={"center"} justifyContent={"space-between"} width={"90%"}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 20,
                            textAlign: "center",
                            color: txtColor,
                        }}>Pro</Text>
                        <HStack alignItems={"center"} space={1}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                color: bgInvColor,
                            }}>RM {price.toFixed(2)}</Text>

                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                color: bgInvColor,
                            }}>/ Month</Text>
                        </HStack>
                    </HStack>
                </View>

                {/* Details */}
                <Detail data={detail} {...props} />

                {/* Buy Now Button */}
                {
                    (showBtn) ? (
                        <View alignItems={"center"}>
                            <TouchableOpacity onPress={GoToPayment} style={{ width: "90%", height: 48 }}>
                                <HStack flex={1}
                                    borderRadius={4}
                                    bgColor={bgInvColor}
                                    alignItems={"center"}
                                    justifyContent={"center"}>
                                    <Text style={{
                                        fontFamily: "Roboto-Bold",
                                        fontSize: 18,
                                        textAlign: "center",
                                        color: bgColor,
                                    }}>Buy Now</Text>
                                </HStack>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ height: 40 }} />
                    )
                }
            </VStack>

        </TabView.Item>
    )
}

function Logo(props) {

    const { img = {} } = props

    return (
        <VStack space={2} alignItems={"center"}>
            {/* Term */}
            <Text style={{
                fontFamily: "Roboto-Bold",
                fontSize: 20
            }}>Yatu Pro</Text>

            {/* Logo */}
            <Image
                source={img}
                resizeMode={"contain"}
                style={{
                    height: 100,
                    width: 100,
                    borderRadius: 8
                }}
                alt={"Yatu Pro Subscription"}
            />
        </VStack>
    )
}

function InfoTooltip(props) {

    const { hook = [] } = props;
    const [open, setOpen, toggleOpen] = hook;

    const navigation = useNavigation();

    const style = {
        hyperlink: {
            textDecorationLine: "underline",
            fontFamily: "Roboto-Medium",
            color: "#3366CC"
        },
        txt: {
            fontFamily: "Roboto-Medium",
            fontSize: 14,
            color: "#484848"
        }
    }

    const GoToTnc = () => {
        toggleOpen();
        navigation.navigate("Tnc");
    }

    const GoToPolicy = () => {
        toggleOpen();
        navigation.navigate("Policy");
    }

    const Tnc = () => (
        <TouchableOpacity onPress={GoToTnc}>
            <Text style={style.hyperlink}>Terms of use</Text>
        </TouchableOpacity>
    );

    const Policy = () => (
        <TouchableOpacity onPress={GoToPolicy}>
            <Text style={style.hyperlink}>Privacy Policy</Text>
        </TouchableOpacity>
    );

    return (
        <VStack>
            <Text style={{ textAlign: "justify", ...style.txt }}>Payment will be charged to your Payment Service at the confirmation of purchase. If you have paid for renewal service, your account will be charged for renewal within 24 hours prior to the end of the current period. You can cancel your subscriptions at any time.</Text>
            <HStack alignItems={"flex-start"} space={1.5}>
                <Text style={style.txt}>Read Subscription:</Text>
                <Tnc />
                <Text>&</Text>
                <Policy />
            </HStack>
        </VStack>
    )
}

function InfoIcon(props) {

    const openHook = useToggle(false);

    return (
        <BcTooltip hook={openHook}
            placement={"bottom"} bgColor={"#FFF"}
            modalBgColor={"rgba(0, 0, 0, 0.25)"} borderWidth={0}
            content={<InfoTooltip hook={openHook} />}>
            <BcSvgIcon name={"InfoIcon"} size={24} />
        </BcTooltip>
    )
}
// #endregion

// #region Custom Hooks
function useTabPane(val = 0) {
    const [ind, setInd] = useState(val);

    const onChangeInd = (e) => setInd(_ => e);

    return [ind, setInd, onChangeInd];
}

function usePayDict() {

    const [dict, setDict] = useState({});
    const [data, setData] = useState([]);
    const [key, setKey] = useState([]);
    const [img, setImg] = useState({
        uri: "https://i.imgur.com/lwNqBtJ.png"
    });

    useEffect(() => {
        if (data.length > 0) {
            let arr = [...data];

            arr = arr.map(obj => {

                const { data: oData = {} } = obj
                const { Image = "https://i.imgur.com/lwNqBtJ.png", Price = 0 } = oData;

                return {
                    ...obj,
                    data: {
                        ...oData,
                        img: { uri: Image }
                    },
                    price: Price,
                }
            })

            if (arr.length > 0) {
                const { data: { img: oImg = {} } } = arr[0];
                setImg(_ => oImg);
            }

            let aDict = {};

            for (let obj of arr) {
                const { key } = obj;
                aDict[key] = obj;
            }

            let keys = Object.keys(aDict);
            setKey(keys);

            setDict(aDict);
        }
    }, [data]);

    return [dict, setData, key, img];
}
// #endregion

function Body(props) {

    const { hook = [], colors = {} } = props;

    const tpHook = useTabPane(0);
    const [tpInd, setTpInd, onChangeTpInd] = tpHook;

    const [payDict, setPayDict, payDictKey, payProImg] = hook;

    const renderTabBody = (term, ind) => (
        <TPBody key={ind}
            title={term}
            inverse={ind % 2 == 1}
            hook={hook}
            colors={colors} />
    )

    return (
        <VStack space={3} flexGrow={1}>
            {/* Tab Header */}
            <View alignItems={"center"}>
                <TPHeader hook={tpHook} colors={colors} payDictHook={hook} />
            </View>

            {/* Tab Body */}
            <TabView value={tpInd} onChange={onChangeTpInd}>
                {payDictKey.map(renderTabBody)}
            </TabView>
        </VStack>
    )
}

import { useModalToast } from "@hooks";

import Modal from 'react-native-modal';

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
            style={{ margin: 0 }}>
            <View bgColor={"#F3F8FC"} py={5} height={"90%"}>
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

function ProSubModal(props) {
    const { hook = [] } = props;

    const [cusToast, showMsg] = useModalToast();
    const [payDict, setPayDict, payDictKey, payProImg] = hook;

    return (
        <BaseModal cusToast={cusToast} {...props}>
            <VStack space={3} flexGrow={1}>
                {/* Logo */}
                <Body {...props} />

                <Footer height={40} />
            </VStack>
        </BaseModal>
    )
}

function ProSubBtn(props) {

    const colors = {
        activeColor: "#2898FF",
        inActiveColor: "#FFF",
    }

    const userId = useSelector(Selectors.userIdSelect);

    // #region UseState
    const [loading, setLoading, toggleLoading] = useToggle(false);

    const payDictHook = usePayDict();
    const [payDict, setPayDict, payDictKey, payProImg] = payDictHook;

    const [showPsModal, setShowPsModal, togglePsModal] = useToggle(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        SubscriptionProPlan();
    }, []);
    // #endregion

    // #region Api
    const SubscriptionProPlan = () => {
        setLoading(true);
        fetchSubscriptionProPlan({
            param: {
                UserId: userId
            },
            onSetLoading: setLoading
        })
            .then(data => {
                setPayDict(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    return (
        <>
            <ProSubModal showModal={showPsModal} setShowModal={setShowPsModal} hook={payDictHook} colors={colors} />
            <TouchableOpacity onPress={togglePsModal}>
                <View backgroundColor={"#ff0000"}
                    alignItems={"center"} justifyContent={"center"}
                    style={{ width: 100, height: 48 }}>
                    <Text style={[{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "white",
                    }]}>Show Modal</Text>
                </View>
            </TouchableOpacity>
        </>
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
            {/* Logo */}
            <Logo img={payProImg} />

            <Body {...props} />
        </VStack>
    )
}

function Index(props) {

    const colors = {
        activeColor: "#2898FF",
        inActiveColor: "#FFF",
    }

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const userId = useSelector(Selectors.userIdSelect);

    // #region UseState
    const [loading, setLoading, toggleLoading] = useToggle(false);

    const payDictHook = usePayDict();
    const [payDict, setPayDict, payDictKey, payProImg] = payDictHook;
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            SubscriptionProPlan();
            // setPayDict(subProData);
        }
    }, [isFocused]);
    // #endregion

    // #region Api
    const SubscriptionProPlan = () => {
        setLoading(true);
        fetchSubscriptionProPlan({
            param: {
                UserId: userId
            },
            onSetLoading: setLoading
        })
            .then(data => {
                setPayDict(data);
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#F3F8FC"} style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeaderWithAdd Right={<InfoIcon />}>Subscription</BcHeaderWithAdd>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <Content hook={payDictHook} colors={colors} />

                    {/* Footer */}
                    <Footer />

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;