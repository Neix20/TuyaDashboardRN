import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, Dimensions, SafeAreaView, ScrollView, FlatList, TouchableWithoutFeedback } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { BcSvgChart, BcDateRangeModal, BcViewShot, BcBoxShadow, BcDropdown, BcSvgIcon } from "@components";

import { iRData } from "@config";

import { Checkbox as PaperCheckbox } from "react-native-paper";
import { CheckBox as ElemCheckbox } from '@rneui/base';
import { Checkbox as NativeCheckbox } from "native-base";

import WChart from "./WChart";

import DropDownPicker from "react-native-dropdown-picker";

// #region Trash
function Chart(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [chart, setChart] = useState([]);
    const [label, setLabel] = useState([]);

    const data = iRData["DCH-AHUX"]

    useEffect(() => {
        if (isFocused) {
            let val = data.slice(0, 100);
            val = val.map(obj => obj["Absolute_Humidity"]);

            setChart(val);

            val = data.slice(0, 100);
            val = val.map(obj => obj["Timestamp"]);
            val = val.map(obj => obj.replace(" ", "T"));
            val = val.map(obj => Utility.formatDt(obj, "hh:mm"));

            setLabel(val)
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <View style={{ height: 80 }} />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
                        <BcSvgChart
                            key={label.length}
                            data={chart} labels={label} />
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 80 }} />
            </View>
        </SafeAreaView>
    );
}

function TestCheckbox(props) {

    const navigation = useNavigation();

    // #region UseState
    const [nativeFlag, setNativeFlag] = useState(false);
    const [elemFlag, setElemFlag] = useState(false);
    const [paperFlag, setPaperFlag] = useState(false);

    const [tabIndex, setTabIndex] = useState(0);
    // #endregion

    // #region Toggle
    const togglePaperFlag = () => setPaperFlag(paperFlag => !paperFlag);
    const toggleNativeFlag = () => setNativeFlag(nativeFlag => !nativeFlag);
    const toggleElemFlag = () => setElemFlag(elemFlag => !elemFlag);
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <View style={{ height: 80 }} />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"} alignItems={"center"}>
                        <VStack space={1}>
                            <HStack space={3} alignItems={"center"}>
                                <NativeCheckbox colorScheme={"red"} />
                                <Text>Native Checkbox</Text>
                            </HStack>
                            <HStack space={3} alignItems={"center"}>
                                <NativeCheckbox defaultIsChecked />
                                <Text>Native Checkbox: Checked</Text>
                            </HStack>
                        </VStack>
                        <VStack space={1}>
                            <HStack space={3} alignItems={"center"}>
                                <PaperCheckbox status={paperFlag ? "checked" : "unchecked"} onPress={togglePaperFlag} />
                                <Text>Paper Checkbox</Text>
                            </HStack>
                            <HStack space={3} alignItems={"center"}>
                                <PaperCheckbox status={"checked"} />
                                <Text>Paper Checkbox: Checked</Text>
                            </HStack>
                        </VStack>
                        <VStack space={1}>
                            <ElemCheckbox checked={elemFlag} onPress={toggleElemFlag} checkedColor="#2898FF" />
                            <ElemCheckbox checked={true} />
                        </VStack>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 80 }} />
            </View>
        </SafeAreaView>
    )
}

import Modal from "react-native-modal";

function CustomDropdownModal(props) {
    // #region Props
    const { showModal = false, setShowModal = () => { } } = props;
    // #endregion

    // #region Helper
    const closeModal = () => setShowModal(false);
    // #endregion
    return (
        <Modal
            isVisible={showModal}
            animationInTiming={1} animationOutTiming={1}
            onBackButtonPress={closeModal}
            onBackdropPress={closeModal}
            backdropOpacity={0}>
            <View position={"absolute"}>
                <View bgColor={"#000"} h={100} w={200} />
            </View>
        </Modal>
    )
}

function CustomDropdownBtn(props) {
    const { title } = props;

    // #region UseState
    const [showModal, setShowModal] = useState(false);
    // #endregion

    // #region Helper
    const toggleModal = () => setShowModal((val) => !val);
    // #endregion

    return (
        <>
            <CustomDropdownModal showModal={showModal} setShowModal={setShowModal} />
            <TouchableOpacity onPress={toggleModal}>
                <View backgroundColor={"#ff0000"}
                    alignItems={"center"} justifyContent={"center"}
                    style={{ height: 60, width: 180 }}>
                    <Text style={[{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "white",
                    }]}>{title}</Text>
                </View>
            </TouchableOpacity>
        </>
    )
}

function DebugDateRange(props) {

    // #region Init
    const init = {
        dt: "2023-09-04",
        homeLs: [
            { label: 'Apple', value: 'test' },
            { label: 'Banana', value: 'test_banana' }
        ]
    }
    // #endregion

    // #region UseState
    const [showDtModal, setShowDtModal] = useState(false);
    const [startDt, setStartDt] = useState("2023-08-18");
    const [endDt, setEndDt] = useState("2023-08-19");

    const [val, setVal] = useState(null);
    const [homeLs, setHomeLs] = useState(init.homeLs);
    // #endregion

    // #region Helper
    const toggleDtModal = () => setShowDtModal(!showDtModal);
    // #endregion

    return (
        <>
            <BcDateRangeModal dt={init.dt}
                startDt={startDt} setStartDt={setStartDt}
                endDt={endDt} setEndDt={setEndDt}
                showModal={showDtModal} setShowModal={setShowDtModal} />
            <SafeAreaView style={{ flex: 1 }}>
                <View flex={1} alignItems={"center"}>

                    <VStack pt={3} space={3} alignItems={"center"}>

                        {/* Date Range */}
                        <TouchableOpacity onPress={toggleDtModal}>
                            <VStack backgroundColor={"#2898FF"}
                                p={3} space={3}
                                style={{ width: width - 100 }}>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    fontSize: 16,
                                    color: "#FFF",
                                }}>Start Date: {Utility.formatDt(startDt, "EEEE, d MMM")}</Text>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    fontSize: 16,
                                    color: "#FFF",
                                }}>End Date: {Utility.formatDt(endDt, "EEEE, d MMM")}</Text>
                            </VStack>
                        </TouchableOpacity>

                        {/* Dropdown Picker */}
                        <BcDropdown items={homeLs}
                            value={val} setValue={setVal}
                            width={200}
                            placeholder={"Home"}
                        />

                        {/* Modal I */}
                        <CustomDropdownBtn title={"Modal I"} />

                        {/* Modal II */}
                        <CustomDropdownBtn title={"Modal II"} />
                    </VStack>
                </View>
            </SafeAreaView>
        </>
    )
}

function DebugChart() {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View flex={1} alignItems={"center"} justifyContent={"center"}>
                <WChart />
            </View>
        </SafeAreaView>
    )
}

import Carousel from 'react-native-reanimated-carousel';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PaginationDot from 'react-native-animated-pagination-dot';

function ImgItem(props) {

    const { bgName = "CardGradientRed" } = props;
    return (
        <BcBoxShadow>

            <View
                style={{
                    height: 180,
                    width: width - 40
                }}>
                <BcSvgIcon name={bgName} />
                <VStack p={2}
                    space={4}
                    position={"absolute"}>
                    <View>
                        <Text>Cozy Home</Text>
                    </View>

                    <HStack space={3}>
                        <FontAwesome5 name={"cloud"} color={"#FFF"} size={36} />
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 32
                        }}>29°C</Text>
                    </HStack>

                    <HStack alignItems={"center"} space={1}>
                        <VStack>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                            }}>Excellent</Text>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 14,
                            }}>Outdoor PM 2.5</Text>
                        </VStack>
                        <VStack>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                            }}>74.0%</Text>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 14,
                            }}>Outdoor Humidity</Text>
                        </VStack>
                        <VStack>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                            }}>1006.9hPa</Text>
                            <Text style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 14,
                            }}>Outdoor Air Pres...</Text>
                        </VStack>
                    </HStack>
                </VStack>
            </View>
        </BcBoxShadow>
    )
}

function ImgCarousel(props) {
    const { images } = props;

    // #region UseState
    const [dotInd, setDotInd] = useState(0);
    const [mDot, setMDot] = useState(0);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        setMDot(dotInd);
    }, [dotInd]);
    // #endregion

    // #region Helper Functions
    // #endregion

    return (
        <>
            <GestureHandlerRootView>
                <Carousel
                    width={width - 40}
                    height={180}
                    loop
                    autoPlay={true}
                    autoPlayInterval={5000}
                    scrollAnimationDuration={1500}
                    data={images.map((_, ind) => ind)}
                    onProgressChange={(_, progress) => {
                        let num = Math.round(progress);
                        if (num >= images.length) {
                            num = 0;
                        }
                        setDotInd(num);
                    }}
                    renderItem={({ index }) => {
                        return (
                            <ImgItem />
                        )
                    }}
                />
            </GestureHandlerRootView>
            <View style={{
                position: "absolute",
                top: 160
            }}>
                <PaginationDot
                    activeDotColor={"#F00"}
                    inactiveDotColor={"#fff"}
                    curPage={mDot}
                    maxPage={images.length}
                />
            </View>
        </>
    )
}

import TopModal from "@components/Modal/TopModal";

function DebugTopModal(props) {

    // #region Initital
    const init = {
        svgLs: ["CardGradientRed", "CardGradientGreen", "CardGradientOrange", "CardGradientBlue"]
    }
    // #endregion

    // #region UseState
    const [svgLs, setSvgLs] = useState(init.svgLs);
    const [showTopModal, setShowTopModal] = useState(false);
    // #endregion

    // #region Helper
    const toggleTopModal = () => setShowTopModal((val) => !val);
    // #endregion

    return (
        <>
    <TopModal showCross={false}
        showModal={showTopModal} 
        setShowModal={setShowTopModal}>
        <View style={{height: 200}}>

        </View>
    </TopModal>
        <SafeAreaView style={{ flex: 1 }}>
            <View bgColor={"#f6f7fa"} style={{ flex: 1 }}>

                {/* Header */}
                <View style={{ height: 80 }} />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <VStack flexGrow={1}
                        alignItems={"center"}
                        justifyContent={"center"}>
                        {/* <ImgCarousel images={svgLs} /> */}
                        <ImgItem />

                        <TouchableOpacity onPress={toggleTopModal}>
                            <View backgroundColor={"#ff0000"}
                                alignItems={"center"} justifyContent={"center"}
                                style={{ width: 100, height: 40 }}
                            >
                                <Text style={[{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "white",
                                }]}>Modal</Text>
                            </View>
                        </TouchableOpacity>

                    </VStack>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
        </>
    )
}
// #endregion

const Index = DebugTopModal;

export default Index;