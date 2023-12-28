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

import { CheckBox as ElemCheckbox } from '@rneui/base';
import { Checkbox as NativeCheckbox } from "native-base";

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

import WChart from "./WChart";

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

// #region Trash II
function DownTimeTable(props) {

    const color = {
        active: "#F00",
        inactive: "#0F0"
    }

    // const duration = 1000;

    // const [opacity, setOpacity] = useState(0);
    // const [flag, setFlag, toggleFlag] = useToggle(false);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         // setOpacity(opacity => (opacity + 1) % 21)
    //         toggleFlag();
    //     }, duration);

    //     return () => clearInterval(interval);
    // }, [])

    const { data = [] } = props;

    if (data.length == 0) {
        return (
            <></>
        )
    }

    // #region Render
    const Active = () => {
        return (
            <View flex={1} opacity={1} bgColor={color.active} />
        )
    }

    const InActive = () => {
        return (
            <View flex={1} bgColor={color.inactive} />
        )
    }

    const renderValues = (item, index) => {

        const { Name, Timestamp, Status } = item;

        const StatusDiv = (Status) ? Active : InActive;

        return (
            <HStack key={index} alignItems={"center"} justifyContent={"space-between"}>
                <View flex={.3}>
                    <Text style={{
                        fontFamily: "Roboto-Bold"
                    }}>{Name}</Text>
                </View>
                <View flex={.5}>
                    <Text>{Utility.formatDt(Timestamp, "yyyy-MM-dd HH:mm:ss")}</Text>
                </View>
                <View flex={.2}>
                    <StatusDiv />
                </View>
            </HStack>
        )
    }
    // #endregion

    // return (
    //     <Text>{1 - Math.abs(opacity / 5 - 1)}</Text>
    // )

    return (
        <VStack>{data.slice(0, 2).map(renderValues)}</VStack>
    )
}

function TestIndex(props) {

    const toast = useToast();

    const init = {
        dateObj: {
            startDt: "2023-08-18",
            endDt: "2023-08-19"
        },
        prevDateObj: {
            startDt: "2023-07-18",
            endDt: "2023-07-19"
        }
    }

    const dateHook = useDate(init.dateObj);

    const startDt = dateHook[0];
    const endDt = dateHook[2];

    const prevHook = useDate(init.prevDateObj);

    const pStartDt = prevHook[0];
    const pEndDt = prevHook[2];

    const flagHook = useToggle(false);
    const [flag, setFlag, toggleFlag] = flagHook;

    const [width, height, isPort, isLand, c_width, c_height] = useOrientation();

    const [timer, setTimer, totalDuration, setTotalDuration, progress] = useTimer(30);

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <View style={{ height: 80 }} />

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <VStack flexGrow={1} space={3}>
                            <HStack
                                flexWrap={"wrap"}
                                rowGap={10}
                                alignItems={"flex-start"}
                                justifyContent={"space-between"}>
                                <View px={3} style={{ width: width }}>
                                    <BcViewShot title={"Test"}>

                                    </BcViewShot>
                                </View>
                                <View px={3} style={{ width: width }}>
                                    <BcViewShot title={"Device Downtime"}>
                                        <DownTimeTable data={DowntimeData} />
                                    </BcViewShot>
                                </View>
                            </HStack>

                            {
                                (isPort) ? (
                                    <BcDateRange showCompare={false}
                                        hook={dateHook}
                                        flagHook={flagHook}
                                        prevHook={prevHook} />
                                ) : (
                                    <></>
                                )
                            }

                            <View>
                                <Text>Start Date: {startDt}</Text>
                                <Text>End Date: {endDt}</Text>

                                {
                                    (flag) ? (
                                        <>
                                            <Text>Start Date: {pStartDt}</Text>
                                            <Text>End Date: {pEndDt}</Text>
                                        </>
                                    ) : (
                                        <></>
                                    )
                                }
                            </View>

                            <Text>{progress.toFixed(2)}</Text>
                            <Text>{timer}</Text>
                        </VStack>
                    </ScrollView>

                    {/* Footer */}
                    <View style={{ height: 60 }} />
                </View>
            </SafeAreaView>

        </>
    )
}

function DeviceChart(props) {

    const isFocused = useIsFocused();

    const chartHook = useEChart("Absolute Humidity");
    const [chart, setChart] = chartHook.slice(0, 2);

    const barChartHook = useBarChart("Total KiloWatt (KWh)");
    const [barChart, setBarChart] = barChartHook.slice(0, 2);

    const [coor, updateCoor] = useCoor();

    const devDistChartHook = useDevDistChart();
    const [devDistChart, setDevDistChart, devDistChartData, devDistChartLegend] = devDistChartHook;

    const [width] = useOrientation();

    const [timer, setTimer] = useTimer(0);
    const [kaTimer, setKATimer] = useTimer(0);

    useEffect(() => {
        if (isFocused) {
            // setBarChart(DashboardSmartPlugFullData);
            // setChart(iRDataUnit);

            // setDevDistChart(DeviceDistributionData);
            fetchGetDeviceDistribution({
                param: {
                    UserId: 2,
                    HomeId: 85
                },
                onSetLoading: () => { }
            })
                .then(data => {
                    setDevDistChart(data);
                })
                .catch(err => {
                    console.log(`Error: ${err}`);
                })
        }
    }, [isFocused]);

    const updateTimer = () => {
        setTimer(30);
    }

    const updateKATimer = () => {
        setKATimer(30);
    }

    const reset = () => {
        setTimer(0);
        setKATimer(0);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={"handled"}
                contentContainerStyle={{ flexGrow: 1 }}>
                <VStack py={3} space={3} alignItems={"center"}>
                    {/* <BcApacheChartFull hook={chartHook} height={480} /> */}
                    {/* <BcApacheChartDebug /> */}
                    {/* <BcApacheBarChart hook={barChartHook} height={480} /> */}
                    {/* <Text>{JSON.stringify(coor)}</Text>
                    <TouchableOpacity onPress={updateCoor}>
                        <View bgColor={"#F00"} p={3}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                color: "#FFF",
                                fontSize: 24,
                            }}>Coor</Text>
                        </View>
                    </TouchableOpacity> */}
                    <View px={3} style={{ width: width }} >
                        <BcViewShot title={"Total Device Distribution"}>
                            <BcApachePieChart hook={devDistChartHook} />
                        </BcViewShot>
                    </View>

                    <HStack space={5}>
                        <Text>{timer}</Text>
                        <Text>{kaTimer}</Text>
                    </HStack>

                    <HStack space={3}>
                        <TouchableOpacity onPress={updateTimer}>
                            <View bgColor={"#F00"} p={3}>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    color: "#FFF",
                                    fontSize: 16,
                                }}>Set Timer</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={updateKATimer}>
                            <View bgColor={"#F00"} p={3}>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    color: "#FFF",
                                    fontSize: 16,
                                }}>Set Timer (Keep Awake)</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={reset}>
                            <View bgColor={"#F00"} p={3}>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    color: "#FFF",
                                    fontSize: 16,
                                }}>Reset</Text>
                            </View>
                        </TouchableOpacity>
                    </HStack>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    )
}

function CalendarDiv(props) {

    const calHook = useCalendarDate(DateTime.now().toFormat("yyyy-MM-dd"));
    const [dt, parseDt] = calHook;

    const init = {
        dateObj: {
            startDt: "2023-08-18",
            endDt: "2023-08-19"
        },
        prevDateObj: {
            startDt: "2023-07-18",
            endDt: "2023-07-19"
        }
    }

    const dateHook = useDate(init.dateObj);

    const startDt = dateHook[0];
    const endDt = dateHook[2];

    const prevHook = useDate(init.prevDateObj);

    const pStartDt = prevHook[0];
    const pEndDt = prevHook[2];

    const flagHook = useToggle(false);
    const [flag, setFlag, toggleFlag] = flagHook;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={"handled"}
                contentContainerStyle={{ flexGrow: 1 }}>
                <VStack flexGrow={1} alignItems={"center"} justifyContent={"center"} space={3}>
                    <View bgColor={"#FFF"} style={{ width: "90%", height: 360 }}>
                        <BcCalendar calHook={calHook} />
                    </View>
                    <Text>{parseDt.toFormat("yyyy-MM-dd")}</Text>

                    <BcDateRange hook={dateHook} flagHook={flagHook} prevHook={prevHook} />
                    <Text>{startDt} {endDt}</Text>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    )
}

import PayProSubModal from "@screens/PaymentModule/screens/ProSubscription/Modal";

function PayProSubBtn(props) {
    const [showPsModal, setShowPsModal, togglePsModal] = useToggle(false);
    const openModal = () => setShowPsModal(true);

    return (
        <>
            <PayProSubModal showModal={showPsModal} setShowModal={setShowPsModal} />
            <TouchableOpacity onPress={openModal}>
                <View backgroundColor={"#ff0000"}
                    alignItems={"center"} justifyContent={"center"}
                    style={{ width: 120, height: 40 }}>
                    <Text style={[{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: "white",
                    }]}>Test</Text>
                </View>
            </TouchableOpacity>
        </>
    );
}

function TutorialGuideBtn(props) {
    const [showTGModal, setShowTGModal, toggleTGModal] = useToggle(false);

    const images = [
        { uri: Images.LinkDeviceI },
        { uri: Images.LinkDeviceII },
        { uri: Images.LinkDeviceIII },
        { uri: Images.LinkDeviceIV },
        { uri: Images.LinkDeviceV },
    ]

    return (
        <>
            <BcPhotoGalleryModal showModal={showTGModal} setShowModal={setShowTGModal} images={images} />
            <TouchableOpacity onPress={toggleTGModal}>
                <View borderRadius={20}
                    bgColor={"#d3d3d3"}
                    alignItems={"center"} justifyContent={"center"}
                    style={{ width: 32, height: 32 }}>
                    <FontAwesome name={"info"} size={16} color={"#FFF"} />
                </View>
            </TouchableOpacity>
        </>
    )
}


function PaymentProSub(props) {

    const introLs = [
        {
            name: "intro",
            img: Images.sunsetBg,
            animation: Animation.onboarding,
        },
        {
            name: "introII",
            img: Images.sunsetBgII,
            animation: Animation.onboardingII,
        },
        {
            name: "introIII",
            img: Images.sunsetBgIII,
            animation: Animation.onboardingIII,
        }
    ];

    const renderItem = (item) => {
        const { animation } = item;
        return (
            <View flexGrow={1}>
                <Lottie
                    autoPlay
                    source={animation}
                    loop={true}
                    style={{
                        width: "100%",
                        height: "100%"
                    }} />
                
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View alignItems={"center"}
                justifyContent={"center"}
                style={{ flex: 1 }}>
                <View width={"90%"}>
                    <BcCarousel
                        autoPlay={true}
                        autoPlayInterval={5000}
                        data={introLs}
                        renderItem={renderItem} />
                </View>
            </View>
        </SafeAreaView>
    )
}
// #endregion

const Index = () => (<></>);
export default DebugChart;