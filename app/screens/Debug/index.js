import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, Dimensions, SafeAreaView, ScrollView, FlatList, TouchableWithoutFeedback } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { BcSvgChart } from "@components";

import { iRData } from "@config";

import { Checkbox as PaperCheckbox } from "react-native-paper";
import { CheckBox as ElemCheckbox } from '@rneui/base';
import { Checkbox as NativeCheckbox } from "native-base";

import { CheckBox, Tab, TabView } from "@rneui/themed";

import { Switch } from "@rneui/base";

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
                            <ElemCheckbox checked={elemFlag} onPress={toggleElemFlag} checkedColor="#F00" />
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
// #endregion

// #region Calendar
import { Calendar } from 'react-native-calendars';

function CusCalendar(props) {

    // #region Props
    const { flag = false, setFlag = () => { } } = props;
    const { dt, setDt = () => {} } = props;
    // #endregion

    const [selected, setSelected] = useState('');

    // #region Helper
    const closeCalendar = () => setFlag(false);
    const updateDay = (day) => {
        const {dateString} = day;

        setDt(dateString);
        setSelected(dateString);
        closeCalendar();
    }
    // #endregion

    if (!flag) {
        return (<></>);
    }

    return (
        <>
            <View
                bgColor={"#000"}
                opacity={.5}
                style={{
                    position: "absolute",
                    zIndex: 4,
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}>
            </View>
            <TouchableWithoutFeedback onPress={closeCalendar}>
                <View
                    alignItems={"center"}
                    justifyContent={"center"}
                    style={{
                        position: "absolute",
                        zIndex: 5,
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}>
                    <TouchableOpacity>
                        <Calendar
                            onDayPress={updateDay}
                            markedDates={{
                                [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </>
    );
}
// #endregion

// #region Modal
import Modal from 'react-native-modal';

import CustomToast from "@components/Modal/CustomToast";

import { DateTime } from "luxon";

function DateModalParent(props) {
    // #region Initial
    const init = {
        toast: {
            msg: "Test",
            flag: false
        }
    }
    // #endregion

    // #region Props
    const { children } = props;
    const { showModal, setShowModal } = props;
    const { cusToast = init.toast } = props;
    // #endregion

    return (
        <Modal
            isVisible={showModal}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            onBackButtonPress={() => setShowModal(false)}
            onBackdropPress={() => setShowModal(false)}
            style={{ margin: 0 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Front Layer */}
                    <View style={{
                        position: "absolute",
                        zIndex: 20,
                        bottom: 10,
                        left: 0,
                        right: 0,
                        display: (cusToast.flag) ? "flex" : "none"
                    }} alignItems={"center"}>
                        <CustomToast>{cusToast.msg}</CustomToast>
                    </View>

                    {/* Content */}
                    {children}
                </View>
            </SafeAreaView>
        </Modal>
    )
}

function DRangeItem(props) {
    const { title, description, flag } = props;
    const { onPress = () => { } } = props;

    return (
        <TouchableOpacity onPress={onPress}>
            <View alignItems={"center"} py={1}>
                <HStack
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{ width: 360 }}>
                    <VStack space={1}>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 16,
                            color: flag ? "#F00" : "#000"
                        }}>{title}</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 16,
                            color: "#c6c6c6"
                        }}>{description}</Text>
                    </VStack>

                    <View
                        display={flag ? "flex" : "none"}
                        alignItems={"center"} justifyContent={"center"}
                        style={{ width: 40, height: 40 }}>
                        <AntDesign name={"check"} size={25} color={"#F00"} />
                    </View>
                </HStack>
            </View>
        </TouchableOpacity>
    );
}

function DateView(props) {

    // #region Props
    const { data, setData = () => {} } = props;
    const { startDt, setStartDt = () => {} } = props;
    const { endDt, setEndDt = () => {} } = props;
    // #endregion

    // #region Render
    const renderSelectDate = ({ item, index }) => {
        const {flag} = item;
        const onSelect = () => toggleItem(index);
        return (
            <>
                <DRangeItem flag={flag} onPress={onSelect} {...item} />
                <View alignItems={"center"}>
                    <Divider my={2} width={width - 40} />
                </View>
            </>
        );
    }
    // #endregion

    // #region Helper
    const toggleItem = (index) => {

        let arr = [...data];

        for (let ind in arr) {
            arr[ind].flag = false;
        }

        arr[index].flag = true;

        setData(arr);

        const { startDt, endDt } = data[index];
        setStartDt(startDt);
        setEndDt(endDt);
    }
    // #endregion

    return (
        <TabView.Item style={{ width: '100%' }}>
            <VStack 
                space={3}
                alignItems={"center"}>
                <FlatList
                    data={data}
                    renderItem={renderSelectDate}
                />
                <HStack style={{width: 360}} alignItems={"center"} justifyContent={"space-between"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#000"
                    }}>Compare</Text>
                    {/* Switch */}

                    <Switch />
                </HStack>
            </VStack>
        </TabView.Item>
    )
}

function CustomView(props) {

    // #region Props
    const { toggleCusStartDt, toggleCusEndDt } = props;
    const { data, setData = () => {} } = props;
    // #endregion

    return (
        <TabView.Item style={{ width: '100%' }}>
            <View alignItems={"center"}>

                <DRangeItem onPress={toggleCusStartDt} flag={false} {...data[0]} />
                <Divider my={2} width={width - 40} />

                <DRangeItem onPress={toggleCusEndDt} flag={false} {...data[1]} />
                <Divider my={2} width={width - 40} />
            </View>
        </TabView.Item>
    );
}

function DateModal(props) {

    // #region Props
    const { showModal, setShowModal } = props;
    const { dt = "" } = props;
    const { startDt, setStartDt = () => {} } = props;
    const { endDt, setEndDt = () => {} } = props;
    // #endregion

    // #region Init
    const init = {
        activeColor: "#F00",
        inActiveColor: "#000",
        dateRange: {
            "Day": [],
            "Week": [],
            "Month": [],
            "Custom": [{}, {}]
        }
    }
    // #endregion

    // #region UseState
    const [datePaneInd, setDatePaneInd] = useState(0);

    const [showCusStartDt, setShowCusStartDt] = useState(false);
    const [showCusEndDt, setShowCusEndDt] = useState(false);

    const [dateRange, setDateRange] = useState(init.dateRange);

    const [fStartDt, setFStartDt] = useState(dt);
    const [fEndDt, setFEndDt] = useState(dt);

    const [calRefresh, setCalRefresh] = useState(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        
        let today_dt = DateTime.now();

        if (dt !== "") {
            today_dt = DateTime.fromISO(dt);
        }

        // Create Date Range Based on Current Date
        // Yesterday, Today
        const dtArr = dateArrGen(today_dt);

        // Create Week Range Based on Current Date
        // Last 7 Days, This Week
        const weekArr = weekArrGen(today_dt);

        // Create Month Range Based on Current Date
        // Last 30 Days, This Month
        const monthArr = monthArrGen(today_dt);

        // Create Custom Calendar Modal
        const customArr = customArrGen(today_dt);

        setDateRange({
            "Day": dtArr,
            "Week": weekArr,
            "Month": monthArr,
            "Custom": customArr,
        });
    }, []);
    // #endregion

    // #region Helper
    const closeModal = () => setShowModal(false);

    const saveModal = () => {
        setStartDt(fStartDt);
        setEndDt(fEndDt);
        closeModal();
    }

    function dateArrGen(dt) {
        let arr = [];

        const ytdDt = dt.plus({days: -1});

        const ytdObj = {
            title: "Yesterday",
            description: ytdDt.toFormat("EEEE, d MMMM"),
            startDt: ytdDt.toFormat("yyyy-MM-dd"),
            endDt: ytdDt.toFormat("yyyy-MM-dd"),
            flag: false,
        };

        arr.push(ytdObj);

        const tdObj = {
            title: "Today",
            description: dt.toFormat("EEEE, d MMMM"),
            startDt: dt.toFormat("yyyy-MM-dd"),
            endDt: dt.toFormat("yyyy-MM-dd"),
            flag: false,
        };

        arr.push(tdObj);

        return arr;
    }

    function weekArrGen(dt) {
        let arr = [];

        const sDt = dt.plus({days: -7});

        // Last 7 Days
        const sObj = {
            title: "Last 7 Days",
            description: `${sDt.toFormat("d MMM")} - ${dt.toFormat("d MMM")}`,
            startDt: sDt.toFormat("yyyy-MM-dd"),
            endDt: dt.toFormat("yyyy-MM-dd"),
            flag: false,
        }

        arr.push(sObj);

        // This Week

        const stWeekDt = dt.startOf("week");
        const eWeekDt = dt.endOf("week");

        const tObj = {
            title: "This Week",
            description: `${stWeekDt.toFormat("d MMM")} - ${eWeekDt.toFormat("d MMM")}`,
            startDt: stWeekDt.toFormat("yyyy-MM-dd"),
            endDt: eWeekDt.toFormat("yyyy-MM-dd"),
            flag: false
        }


        arr.push(tObj);

        return arr;
    }

    function monthArrGen(dt) {
        let arr = [];

        const sDt = dt.plus({days: -30});

        // Last 30 Days
        const sObj = {
            title: "Last 30 Days",
            description: `${sDt.toFormat("d MMM")} - ${dt.toFormat("d MMM")}`,
            startDt: sDt.toFormat("yyyy-MM-dd"),
            endDt: dt.toFormat("yyyy-MM-dd"),
            flag: false,
        }

        arr.push(sObj);

        // This Month

        const stMonthDt = dt.startOf("month");
        const eMonthDt = dt.endOf("month");

        const tObj = {
            title: "This Month",
            description: `${stMonthDt.toFormat("d MMM")} - ${eMonthDt.toFormat("d MMM")}`,
            startDt: stMonthDt.toFormat("yyyy-MM-dd"),
            endDt: eMonthDt.toFormat("yyyy-MM-dd"),
            flag: false
        }


        arr.push(tObj);

        return arr;
    }

    function customArrGen(dt) {
        let arr = [];

        const ytdDt = dt.plus({days: -1});

        const ytdObj = {
            title: "Start Date",
            description: ytdDt.toFormat("EEEE, d MMMM"),
            startDt: ytdDt.toFormat("yyyy-MM-dd"),
            endDt: ytdDt.toFormat("yyyy-MM-dd"),
            flag: false,
        };

        arr.push(ytdObj);

        const tdObj = {
            title: "End Date",
            description: dt.toFormat("EEEE, d MMMM"),
            startDt: dt.toFormat("yyyy-MM-dd"),
            endDt: dt.toFormat("yyyy-MM-dd"),
            flag: false,
        };

        arr.push(tdObj);

        return arr;
    }

    const updateDateRange = (key, value) => {
        let data = {...dateRange};
        data[key] = value;
        setDateRange(data);
    }

    const updateDayRange = (value) => updateDateRange("Day", value);
    const updateWeekRange = (value) => updateDateRange("Week", value);
    const updateMonthRange = (value) => updateDateRange("Month", value);
    const updateCustomRange = (value) => updateDateRange("Custom", value);

    const toggleCusStartDt = () => setShowCusStartDt(!showCusStartDt);
    const toggleCusEndDt = () => setShowCusEndDt(!showCusEndDt);

    const toggleCalRefresh = () => setCalRefresh(!calRefresh);
    
    const updateCusStartDt = (dt) => {
        let arr = [...dateRange["Custom"]];
        arr[0].startDt = dt;
        updateCustomRange(arr);
        toggleCalRefresh();
    }

    const updateCusEndDt = (dt) => {
        let arr = [...dateRange["Custom"]];
        arr[1].startDt = dt;
        updateCustomRange(arr);
        toggleCalRefresh();
    }

    // #endregion

    return (
        <DateModalParent {...props}>
            <CusCalendar 
                setDt={updateCusStartDt}
                flag={showCusStartDt} setFlag={setShowCusStartDt} />
            <CusCalendar 
                setDt={updateCusEndDt}
                flag={showCusEndDt} setFlag={setShowCusEndDt} />
            <View
                bgColor={"#FFF"}
                style={{ flexGrow: 1 }}>
                <View alignItems={"center"}>
                    <HStack py={3}
                        alignItems={"center"} justifyContent={"space-between"}
                        style={{ width: width - 40 }}>
                        <TouchableOpacity onPress={closeModal}>
                            <View alignItems={"center"} justifyContent={"center"}
                                style={{ width: 40, height: 40 }}>
                                <AntDesign name={"close"} size={25} />
                            </View>
                        </TouchableOpacity>

                        <View style={{ width: width - 160 }}>
                            <Text style={{
                                fontFamily: "Roboto-medium",
                                fontSize: 18
                            }}>Date Range</Text>
                        </View>

                        <TouchableOpacity onPress={saveModal}>
                            <View>
                                <Text style={{
                                    fontFamily: "Roboto-medium",
                                    fontSize: 16,
                                    color: "#00F"
                                }}>Save</Text>
                            </View>
                        </TouchableOpacity>
                    </HStack>
                </View>

                <Tab
                    dense
                    value={datePaneInd}
                    onChange={(e) => setDatePaneInd(e)}
                    indicatorStyle={{
                        backgroundColor: init.activeColor,
                        height: 3
                    }}>
                    <Tab.Item title={"Day"} titleStyle={(active) => ({ color: (active) ? init.activeColor : init.inActiveColor })} />
                    <Tab.Item title={"Week"} titleStyle={(active) => ({ color: (active) ? init.activeColor : init.inActiveColor })} />
                    <Tab.Item title={"Month"} titleStyle={(active) => ({ color: (active) ? init.activeColor : init.inActiveColor })} />
                    <Tab.Item title={"Custom"} titleStyle={(active) => ({ color: (active) ? init.activeColor : init.inActiveColor })} />
                </Tab>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <TabView
                        value={datePaneInd}
                        onChange={(e) => setDatePaneInd(e)}>
                        <DateView 
                            data={dateRange["Day"]} setData={updateDayRange} 
                            startDt={fStartDt} setStartDt={setFStartDt} 
                            endDt={fEndDt} setEndDt={setFEndDt} />
                        <DateView 
                            data={dateRange["Week"]} setData={updateWeekRange} 
                            startDt={fStartDt} setStartDt={setFStartDt} 
                            endDt={fEndDt} setEndDt={setFEndDt} />
                        <DateView 
                            data={dateRange["Month"]} setData={updateMonthRange} 
                            startDt={fStartDt} setStartDt={setFStartDt} 
                            endDt={fEndDt} setEndDt={setFEndDt} />
                        <CustomView 
                            key={calRefresh}
                            toggleCusStartDt={toggleCusStartDt}
                            toggleCusEndDt={toggleCusEndDt}
                            data={dateRange["Custom"]} setData={updateCustomRange}
                            startDt={fStartDt} setStartDt={setFStartDt} 
                            endDt={fEndDt} setEndDt={setFEndDt} />
                    </TabView>
                </ScrollView>
            </View>
        </DateModalParent>
    )
}
// #endregion

function Index(props) {

    // #region UseState
    const [showDtModal, setShowDtModal] = useState(false);

    const [dt, setDt] = useState("2023-08-18");
    const [startDt, setStartDt] = useState("2023-08-18");
    const [endDt, setEndDt] = useState("2023-08-19");
    // #endregion

    // #region Helper
    const toggleDtModal = () => setShowDtModal(showDtModal => !showDtModal);
    // #endregion

    return (
        <>
            <DateModal
                dt={dt}
                startDt={startDt} setStartDt={setStartDt}
                endDt={endDt} setEndDt={setEndDt}
                showModal={showDtModal} setShowModal={setShowDtModal} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    <VStack space={3} p={3}>
                        
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 16
                        }}>Start Date: {Utility.formatDt(startDt, "EEEE, d MMM")}</Text>

                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 16
                        }}>End Date: {Utility.formatDt(endDt, "EEEE, d MMM")}</Text>

                        <TouchableOpacity onPress={toggleDtModal}>
                            <View backgroundColor={"#ff0000"}
                                alignItems={"center"} justifyContent={"center"}
                                style={{ width: 100, height: 40 }}>
                                <Text style={[{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "white",
                                }]}>Date Range</Text>
                            </View>
                        </TouchableOpacity>
                    </VStack>
                </View>
            </SafeAreaView>
        </>
    )
}

export default Index;