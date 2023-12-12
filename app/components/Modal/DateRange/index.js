import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Dimensions, SafeAreaView, ScrollView, FlatList, useWindowDimensions } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Utility } from "@utility";

import Modal from 'react-native-modal';

import AntDesign from "react-native-vector-icons/AntDesign";

import { DateTime } from "luxon";
import { CheckBox, Tab, TabView } from "@rneui/themed";

import CustomToast from "./../CustomToast";

import YtCalendar from "./Calendar";

import { dateArrGen, weekArrGen, monthArrGen, customArrGen } from "./Generator";

import { useToggle, useModalToast, useDate } from "@hooks";

import { Switch } from "@rneui/base";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

// #region Base Modal
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
// #endregion

// #region Components
function DRangeItem(props) {
    const { title, description, flag } = props;
    const { onPress = () => { } } = props;

    return (
        <TouchableOpacity onPress={onPress} style={{ width: "90%" }}>
            <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}>
                <VStack space={1}>
                    <Text style={{
                        fontFamily: "Roboto-Medium",
                        fontSize: 16,
                        color: flag ? "#2898FF" : "#000"
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
                    <AntDesign name={"check"} size={25} color={"#2898FF"} />
                </View>
            </HStack>
        </TouchableOpacity>
    );
}

function DateView(props) {

    // #region Props
    const { data, setData = () => { } } = props;
    const { prevData, setPrevData = () => { } } = props;

    const { hook = [], prevHook = [], flagHook = [], showCompare } = props;
    const [startDt, setStartDt, endDt, setEndDt] = hook.slice(0, 4);
    const [pStartDt, setPStartDt, pEndDt, setPEndDt] = prevHook.slice(0, 4);

    const [compare, setCompare, toggleCompare] = flagHook;
    // #endregion

    // #region Render
    const renderCurDt = ({ item, index }) => {
        const { flag } = item;
        const onSelect = () => toggleCurDt(index);
        return (
            <View alignItems={"center"}>
                <DRangeItem flag={flag} onPress={onSelect} {...item} />
                <Divider my={2} width={"90%"} />
            </View>
        );
    }

    const renderPrevDt = ({ item, index }) => {
        const { flag } = item;
        const onSelect = () => togglePrevDt(index);
        return (
            <View alignItems={"center"}>
                <DRangeItem flag={flag} onPress={onSelect} {...item} />
                <Divider my={2} width={"90%"} />
            </View>
        );
    }
    // #endregion

    // #region Helper
    const toggleCurDt = (index) => {

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

    const togglePrevDt = (index) => {

        let arr = [...prevData];

        for (let ind in arr) {
            arr[ind].flag = false;
        }

        arr[index].flag = true;
        setPrevData(arr);

        const { startDt, endDt } = prevData[index];
        setPStartDt(startDt);
        setPEndDt(endDt);
    }
    // #endregion

    return (
        <TabView.Item style={{ width: "100%" }}>
            <VStack space={2}>
                <FlatList data={data} renderItem={renderCurDt} />

                {
                    (showCompare) ? (
                        <View alignItems={"center"}>
                            <HStack alignItems={"center"} justifyContent={"space-between"} width={"90%"}>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    fontSize: 18,
                                    color: "#000"
                                }}>Compare</Text>
                                <Switch value={compare} onValueChange={toggleCompare} />
                            </HStack>
                        </View>
                    ) : (
                        <></>
                    )
                }

                {
                    (compare) ? (
                        <FlatList data={prevData} renderItem={renderPrevDt} />
                    ) : (
                        <></>
                    )
                }
            </VStack>
        </TabView.Item>
    )
}

function CalendarView(props) {

    // #region Props
    const { data = [], setData = () => { }, flagHook = [], showCompare } = props;
    const { prevData = [], setPrevData = () => { } } = props;
    const { toggleCSDt, toggleCEDt } = props;
    const { togglePSDt, togglePEDt } = props;
    const [compare, setCompare, toggleCompare] = flagHook;
    // #endregion

    return (
        <TabView.Item style={{ width: "100%" }}>
            <VStack space={2}>
                <View alignItems={"center"}>
                    <DRangeItem onPress={toggleCSDt} flag={false} {...data[0]} />
                    <Divider my={2} width={"90%"} />

                    <DRangeItem onPress={toggleCEDt} flag={false} {...data[1]} />
                    <Divider my={2} width={"90%"} />
                </View>

                {
                    (showCompare) ? (
                        <View alignItems={"center"}>
                            <HStack alignItems={"center"} justifyContent={"space-between"} width={"90%"}>
                                <Text style={{
                                    fontFamily: "Roboto-Bold",
                                    fontSize: 18,
                                    color: "#000"
                                }}>Compare</Text>
                                <Switch value={compare} onValueChange={toggleCompare} />
                            </HStack>
                        </View>
                    ) : (
                        <></>
                    )
                }

                {
                    (compare) ? (
                        <View alignItems={"center"}>
                            <DRangeItem onPress={togglePSDt} flag={false} {...prevData[0]} />
                            <Divider my={2} width={"90%"} />

                            <DRangeItem onPress={togglePEDt} flag={false} {...prevData[1]} />
                            <Divider my={2} width={"90%"} />
                        </View>
                    ) : (
                        <></>
                    )
                }

            </VStack>
        </TabView.Item>
    );
}
// #endregion

// #region Hooks
function useDateRange() {
    const init = {
        dateRange: {
            "Day": [],
            "Week": [],
            "Month": [],
            "Custom": [{}, {}]
        }
    }

    const [dateRange, setDateRange] = useState(init.dateRange);

    const initDateRange = (start_dt, end_dt) => {
        // Create Date Range Based on Current Date
        // Yesterday, Today
        const dtArr = dateArrGen(start_dt);

        // Create Week Range Based on Current Date
        // Last 7 Days, This Week
        const weekArr = weekArrGen(start_dt);

        // Create Month Range Based on Current Date
        // Last 30 Days, This Month
        const monthArr = monthArrGen(start_dt);

        // Create Custom Calendar Modal
        const customArr = customArrGen(start_dt, end_dt);

        setDateRange({
            "Day": dtArr,
            "Week": weekArr,
            "Month": monthArr,
            "Custom": customArr,
        });
    }

    const updateDateRange = (key, value) => {
        let data = { ...dateRange };
        data[key] = value;
        setDateRange(data);
    }

    const updateDayRange = (value) => updateDateRange("Day", value);
    const updateWeekRange = (value) => updateDateRange("Week", value);
    const updateMonthRange = (value) => updateDateRange("Month", value);
    const updateCustomRange = (value) => updateDateRange("Custom", value);

    return [dateRange, setDateRange, initDateRange, updateDayRange, updateWeekRange, updateMonthRange, updateCustomRange];
}
// #endregion

function Index(props) {

    const colors = {
        activeColor: "#2898FF",
        inActiveColor: "#000",
    }

    // #region Props
    const { showModal, setShowModal, hook = [], flagHook = [], prevHook = [], showCompare = true } = props;
    const [startDt, setStartDt, endDt, setEndDt] = hook.slice(0, 4);
    const [pStartDt, setPStartDt, pEndDt, setPEndDt] = prevHook.slice(0, 4);
    // #endregion

    // #region UseState
    const [datePaneInd, setDatePaneInd] = useState(0);

    const dateRangeHook = useDateRange();
    const [dateRange, setDateRange, initDateRange, updateDayRange, updateWeekRange, updateMonthRange, updateCustomRange] = dateRangeHook

    const prevDateRangeHook = useDateRange();
    const [prevDateRange, setPrevDateRange, initPrevDateRange, updatePrevDayRange, updatePrevWeekRange, updatePrevMonthRange, updatePrevCustomRange] = prevDateRangeHook;

    const dateHook = useDate({ startDt, endDt });
    const [fStartDt, setFStartDt, fEndDt, setFEndDt] = dateHook.slice(0, 4);

    const prevDateHook = useDate({ startDt: pStartDt, endDt: pEndDt });
    const [fPrevStartDt, setFPrevStartDt, fPrevEndDt, setFPrevEndDt] = prevDateHook.slice(0, 4);

    const [cusToast, showMsg] = useModalToast();
    // #endregion

    // #region UseEffect
    useEffect(() => {
        let start_dt = DateTime.now();
        let end_dt = DateTime.now();

        if (startDt !== "") {
            start_dt = DateTime.fromISO(startDt);
        }

        if (endDt !== "") {
            end_dt = DateTime.fromISO(endDt)
        }

        initDateRange(start_dt, end_dt);
    }, [startDt + endDt]);

    useEffect(() => {
        let start_dt = DateTime.now();
        let end_dt = DateTime.now();

        if (pStartDt !== "") {
            start_dt = DateTime.fromISO(pStartDt);
        }

        if (pEndDt !== "") {
            end_dt = DateTime.fromISO(pEndDt)
        }

        initPrevDateRange(start_dt, end_dt);
    }, [pStartDt + pEndDt]);
    // #endregion

    // #region Helper
    const closeModal = () => setShowModal(false);

    const saveModal = () => {

        if (fStartDt !== undefined && fEndDt !== undefined) {
            setStartDt(fStartDt);
            setEndDt(fEndDt);
        }

        if (fPrevStartDt !== undefined && fPrevEndDt !== undefined) {
            setPStartDt(fPrevStartDt);
            setPEndDt(fPrevEndDt);
        }


        closeModal();
    }
    // #endregion

    // #region Date Range UseState
    const [showCSDt, setShowCSDt, toggleCSDt] = useToggle(false);
    const [showCEDt, setShowCEDt, toggleCEDt] = useToggle(false);

    const [showPSDt, setShowPSDt, togglePSDt] = useToggle(false);
    const [showPEDt, setShowPEDt, togglePEDt] = useToggle(false);
    // #endregion

    // #region Date Range
    const updateCSDt = (dt) => {
        let arr = [...dateRange["Custom"]];
        arr[0].description = Utility.formatDt(dt, "EEEE, d MMMM");
        arr[0].startDt = dt;
        updateCustomRange(arr);

        setFStartDt(dt);
    }

    const updateCEDt = (dt) => {
        let arr = [...dateRange["Custom"]];
        arr[1].description = Utility.formatDt(dt, "EEEE, d MMMM");
        arr[1].startDt = dt;
        updateCustomRange(arr);

        setFEndDt(dt);
    }

    const updatePSDt = (dt) => {
        let arr = [...prevDateRange["Custom"]];
        arr[0].description = Utility.formatDt(dt, "EEEE, d MMMM");
        arr[0].startDt = dt;
        updatePrevCustomRange(arr);

        setFPrevStartDt(dt)
    }

    const updatePEDt = (dt) => {
        let arr = [...prevDateRange["Custom"]];
        arr[1].description = Utility.formatDt(dt, "EEEE, d MMMM");
        arr[1].startDt = dt;
        updatePrevCustomRange(arr);

        setFPrevEndDt(dt);
    }
    // #endregion

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AccountType = -1 } = subUserAccess;

    return (
        <BaseModal cusToast={cusToast} {...props}>
            <YtCalendar dt={fStartDt} setDt={updateCSDt} showModal={showCSDt} setShowModal={setShowCSDt} />
            <YtCalendar dt={fEndDt} setDt={updateCEDt} showModal={showCEDt} setShowModal={setShowCEDt} />
            <YtCalendar dt={fPrevStartDt} setDt={updatePSDt} showModal={showPSDt} setShowModal={setShowPSDt} />
            <YtCalendar dt={fPrevEndDt} setDt={updatePEDt} showModal={showPEDt} setShowModal={setShowPEDt} />
            <View bgColor={"#FFF"} style={{ flexGrow: 1 }}>
                <View alignItems={"center"}>
                    <HStack py={3}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        style={{ width: "90%" }}>
                        <TouchableOpacity onPress={closeModal}>
                            <View
                                alignItems={"center"}
                                justifyContent={"center"}
                                style={{ width: 40, height: 40 }}>
                                <AntDesign name={"close"} size={25} />
                            </View>
                        </TouchableOpacity>

                        <View style={{ width: "72%" }}>
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

                <Tab dense value={datePaneInd} onChange={(e) => setDatePaneInd(e)}
                    indicatorStyle={{
                        backgroundColor: colors.activeColor,
                        height: 3
                    }}>
                    <Tab.Item title={"Day"} titleStyle={(active) => ({ color: (active) ? colors.activeColor : colors.inActiveColor })} />
                    <Tab.Item title={"Week"} titleStyle={(active) => ({ color: (active) ? colors.activeColor : colors.inActiveColor })} />
                    <Tab.Item title={"Month"} titleStyle={(active) => ({ color: (active) ? colors.activeColor : colors.inActiveColor })} />
                    <Tab.Item title={"Custom"} titleStyle={(active) => ({ color: (active) ? colors.activeColor : colors.inActiveColor })} />
                </Tab>

                <View style={{ height: 10 }} />

                {/* Body */}
                <TabView
                    value={datePaneInd}
                    onChange={(e) => setDatePaneInd(e)}>
                    <DateView flagHook={flagHook} showCompare={showCompare}
                        hook={dateHook} prevHook={prevDateHook}
                        data={dateRange["Day"]} setData={updateDayRange}
                        prevData={prevDateRange["Day"]} setPrevData={updatePrevDayRange} />
                    <DateView flagHook={flagHook} showCompare={showCompare}
                        hook={dateHook} prevHook={prevDateHook}
                        data={dateRange["Week"]} setData={updateWeekRange}
                        prevData={prevDateRange["Week"]} setPrevData={updatePrevWeekRange} />
                    <DateView flagHook={flagHook} showCompare={showCompare}
                        hook={dateHook} prevHook={prevDateHook}
                        data={dateRange["Month"]} setData={updateMonthRange}
                        prevData={prevDateRange["Month"]} setPrevData={updatePrevMonthRange} />
                    <CalendarView flagHook={flagHook} showCompare={showCompare}
                        data={dateRange["Custom"]} setData={updateCustomRange}
                        prevData={prevDateRange["Custom"]} setPrevData={updatePrevCustomRange}
                        toggleCSDt={toggleCSDt} toggleCEDt={toggleCEDt}
                        togglePSDt={togglePSDt} togglePEDt={togglePEDt} />
                </TabView>
            </View>
        </BaseModal>
    )
}

export default Index;