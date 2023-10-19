import React, { useState, useEffect, useRef } from "react";
import { Text, Image, TextInput, TouchableOpacity, Dimensions, SafeAreaView, ScrollView, FlatList, useWindowDimensions } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { BcSvgChart, BcDateRangeModal, BcViewShot, BcBoxShadow, BcDropdown, BcSvgIcon, BcLoading, BcCarousel } from "@components";

import { iRData, Devices, Animation, Images } from "@config";

import { Checkbox as PaperCheckbox } from "react-native-paper";
import { CheckBox as ElemCheckbox } from '@rneui/base';
import { Checkbox as NativeCheckbox } from "native-base";

import WChart from "./WChart";

import DropDownPicker from "react-native-dropdown-picker";

import Lottie from "lottie-react-native"

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
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
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
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
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


function ImgItem(props) {
    const { bgName = "CardGradientRed" } = props;
    return (
        <View style={{ height: 180 }}>
            <Image source={Images[bgName]}
                style={{ width: "100%", height: "100%", borderRadius: 15 }}
                resizeMode={"cover"}
                alt={bgName}
            />
            <VStack p={2} space={4} position={"absolute"} style={{
                left: 0,
                right: 0,
            }}>
                <View>
                    <Text style={{
                        fontSize: 12,
                        color: "#FFF",
                    }}>Cozy Home</Text>
                </View>

                <HStack space={3}>
                    <FontAwesome5 name={"cloud"} color={"#FFF"} size={36} />
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 32
                    }}>29°C</Text>
                </HStack>

                <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    space={1}>
                    <VStack>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#FFF",
                        }}>Excellent</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: "#FFF",
                        }}>Outdoor PM 2.5</Text>
                    </VStack>
                    <VStack>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#FFF",
                        }}>74.0%</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: "#FFF",
                        }}>Outdoor Humidity</Text>
                    </VStack>
                    <VStack>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 18,
                            color: "#FFF",
                        }}>1006.9hPa</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14,
                            color: "#FFF",
                        }}>Outdoor Air Pres...</Text>
                    </VStack>
                </HStack>
            </VStack>
        </View>
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
    const [loading, setLoading] = useState(false);
    // #endregion

    // #region Helper
    const toggleTopModal = () => setShowTopModal((val) => !val);
    const toggleLoading = () => setLoading((val) => !val);
    // #endregion

    // #region Render
    const renderItem = ({ index }) => {
        const bgName = svgLs[index];
        return (
            <ImgItem key={index} bgName={bgName} />
        )
    }
    // #endregion

    return (
        <>
            <BcLoading loading={false} />
            <TopModal showCross={false} showModal={showTopModal}
                setShowModal={setShowTopModal}>
                <View style={{ height: 200 }}>
                </View>
            </TopModal>
            <SafeAreaView style={{ flex: 1 }}>
                <View bgColor={"#f6f7fa"} style={{ flex: 1 }}>

                    {/* Header */}
                    <View style={{ height: 80 }} />

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack flexGrow={1}
                            space={3}
                            alignItems={"center"}
                            justifyContent={"center"}>
                            
                            <BcCarousel images={svgLs} renderItem={renderItem} />

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

                            <TouchableOpacity onPress={toggleLoading}
                                style={{ width: "40%" }}>
                                <View bgColor={"#ff0000"}
                                    alignItems={"center"} justifyContent={"center"}
                                    style={{ height: 60 }}
                                >
                                    <Text style={[{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        color: "white",
                                    }]}>Show Loading</Text>
                                </View>
                            </TouchableOpacity>

                        </VStack>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    )
}

function DeviceItem(props) {
    const { name, img, icon, product_name, description } = props;

    const borderRadius = 8;

    return (
        <TouchableOpacity>
            <BcBoxShadow
                style={{
                    borderRadius: borderRadius,
                    minWidth: 170,
                    width: "100%",
                }}>
                <VStack
                    p={2} space={2}
                    style={{
                        backgroundColor: "#FFF",
                        borderRadius: borderRadius,
                    }}>
                    <Image
                        source={img}
                        style={{
                            height: 60,
                            width: 60,
                        }}
                        resizeMode={"cover"}
                        alt={name} />
                    <VStack>
                        <Text style={{
                            fontSize: 14,
                            fontFamily: 'Roboto-Bold',
                            color: "#000",
                        }}>{name}</Text>
                        <Text style={{
                            fontSize: 12,
                            fontFamily: 'Roboto-Medium',
                            color: "#c6c6c6"
                        }}>{description}</Text>
                    </VStack>
                </VStack>
            </BcBoxShadow>
        </TouchableOpacity>
    )
}

function Search(props) {
    const { lang } = props;
    const { query, setQuery } = props;
    return (
        <View
            alignItems={"center"}
            justifyContent={"center"}
            style={{
                height: 60,
            }}>
            <View
                bgColor={"#EDEEEF"}
                borderRadius={4}>
                <TextInput
                    style={{
                        fontSize: 14,
                        fontFamily: "Roboto-Medium",
                        height: 40,
                        width: 360,
                        paddingHorizontal: 16,
                        color: "#000",
                    }}
                    placeholder={Utility.translate("Search", lang)}
                    placeholderTextColor={"#6A7683"}
                    defaultValue={query}
                    onChangeText={setQuery}
                />

                {/* Front Layer */}
                <View
                    justifyContent={"center"}
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        right: 16,
                        display: (query !== "") ? "none" : "flex"
                    }}>
                    <FontAwesome5 name={"search"} size={20} color={"#6A7683"} />
                </View>
            </View>
        </View>
    )
}

function DebugDevice(props) {

    const isFocused = useIsFocused();

    // #region UseState
    const [deviceLs, setDeviceLs] = useState([]);
    const [filterLs, setFilterLs] = useState([]);

    const [viewMode, setViewMode] = useState("grid");
    const [refresh, setRefresh] = useState(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            let arr = Devices;

            arr = arr.map((obj, ind) => (
                {
                    ...obj,
                    img: { uri: obj.icon },
                    pos: ind,
                }
            ));

            setDeviceLs(arr);

            toggleRefresh();
        }
    }, [isFocused]);
    // #endregion

    // #region Filter Query
    const [query, setQuery] = useState("");

    useEffect(() => {
        let arr = [...deviceLs];
        if (query !== "" && arr.length > 0) {
            arr = arr.filter(x => x["name"].toLowerCase().includes(query.toLowerCase()));
        }

        // let fArr = Utility.splitItemsIntoK(arr);
        // setItemLs(fArr);

        setFilterLs(arr);
    }, [query, refresh]);
    // #endregion

    // #region Render
    const renderItem = ({ item, index }) => {
        return (
            <DeviceItem key={index} {...item} />
        )
    }
    // #endregion

    // #region Helper
    const toggleViewMode = () => setViewMode((val) => (val === "list") ? "grid" : "list");
    const toggleRefresh = () => setRefresh((val) => !val);
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View bgColor={"#FFF"} style={{ flex: 1 }}>

                {/* Header */}
                <View
                    alignItems={"center"}>
                    <HStack alignItems={"center"}
                        justifyContent={"flex-end"}
                        style={{ width: width - 40, height: 60 }}>
                        <TouchableOpacity onPress={toggleViewMode}>
                            <View backgroundColor={"#ff0000"}
                                alignItems={"center"} justifyContent={"center"}
                                style={{ height: 40, width: 100 }}>
                                <Text style={[{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "white",
                                }]}>{viewMode == "grid" ? "List" : "Grid"} View</Text>
                            </View>
                        </TouchableOpacity>
                    </HStack>
                </View>

                {/* Search */}
                <Search lang={"en"} query={query} setQuery={setQuery} />

                {/* Body */}
                <View flexGrow={1}
                    alignItems={"center"}>
                    <FlatList
                        key={viewMode === "grid"}
                        data={filterLs}
                        renderItem={renderItem}
                        contentContainerStyle={{
                            flexDirection: (viewMode === "grid") ? "row" : "column",
                            flexWrap: (viewMode === "grid") ? "wrap" : "nowrap",
                            justifyContent: (viewMode === "grid") ? "space-between" : "center",
                            paddingHorizontal: 5,
                            paddingVertical: 5,
                            rowGap: 8,

                        }}
                        style={{ flex: 1, width: width - 30 }}
                    />
                </View>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    )
}

function TestSvgChart(props) {

    const chartHook = useChart("Absolute Humidity");
    const [chart, setChart, chartKey, setChartKey, chartData, setChartData, chartLegend, setChartLegend, chartKeyOption, setChartKeyOption] = chartHook;

    const legendHook = useToggle(false);
    const [showLegend, setShowLegend, toggleShowLegend] = legendHook;

    const labels = Utility.genLabel("2023-09-28", "2023-09-29", 5);

    useEffect(() => {
        setChart(iRData);
    }, []);

    const updateLegend = (pos) => {
        let arr = [...chartLegend];

        const { flag } = arr[pos];
        arr[pos].flag = !flag;

        setChartLegend(arr);
    };

    const funcLs = [
        {
            Title: showLegend ? "Hide Legend" : "Show Legend",
            onPress: toggleShowLegend,
            Icon: FontAwesome5,
            IconName: showLegend ? "eye-slash" : "eye"
        }
    ]

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <View style={{ height: 80 }} />

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1} justifyContent={"center"}>
                        <View px={3}>
                            <BcViewShot title={"Daily Device Report"} functionLs={funcLs}>
                                {/* <BcLineChart key={chartKey} labels={labels} {...chartData} />
                                {
                                    (showLegend) ? (
                                        <BcLineLegend legend={chartLegend} onUpdateLegend={updateLegend} />
                                    ) : (
                                        <></>
                                    )
                                } */}
                                <BcLineChartFull hook={chartHook} legendHook={legendHook} labels={labels} />
                            </BcViewShot>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}
// #endregion

const Index = DebugTopModal;

export default Index;