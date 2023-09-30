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
    const { data, setData = () => { }, hook = [] } = props;
    const [startDt, setStartDt, endDt, setEndDt] = hook.slice(0, 4);
    // #endregion

    // #region Render
    const renderSelectDate = ({ item, index }) => {
        const { flag } = item;
        const onSelect = () => toggleItem(index);
        return (
            <View alignItems={"center"}>
                <DRangeItem flag={flag} onPress={onSelect} {...item} />
                <Divider my={2} width={"90%"} />
            </View>
        );
    }
    // #endregion

    // #region UseState
    const [compare, setCompare, toggleCompare] = useToggle(false);
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
        <TabView.Item>
            <VStack>
                <FlatList data={data} renderItem={renderSelectDate} />

                <View alignItems={"center"}>
                    <HStack alignItems={"center"} justifyContent={"space-between"} style={{ width: 360 }}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18,
                            color: "#000"
                        }}>Compare</Text>
                        <Switch value={compare} onValueChange={toggleCompare} />
                    </HStack>
                </View>
            </VStack>
        </TabView.Item>
    )
}

function CalendarView(props) {

    // #region Props
    const { data, setData = () => { } } = props;
    const { toggleCusStartDt, toggleCusEndDt } = props;
    // #endregion

    // #region UseState
    const [compare, setCompare, toggleCompare] = useToggle(false);
    // #endregion

    return (
        <TabView.Item style={{ width: "100%" }}>
            <VStack>
                <View alignItems={"center"}>
                    <DRangeItem onPress={toggleCusStartDt} flag={false} {...data[0]} />
                    <Divider my={2} width={"90%"} />

                    <DRangeItem onPress={toggleCusEndDt} flag={false} {...data[1]} />
                    <Divider my={2} width={"90%"} />
                </View>

                <View alignItems={"center"}>
                    <HStack alignItems={"center"} justifyContent={"space-between"} style={{ width: 360 }}>
                        <Text style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 18,
                            color: "#000"
                        }}>Compare</Text>
                        <Switch value={compare} onValueChange={toggleCompare} />
                    </HStack>
                </View>

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
    const { showModal, setShowModal, hook = [] } = props;
    const [startDt, setStartDt, endDt, setEndDt] = hook.slice(0, 4);
    // #endregion

    // #region UseState
    const [datePaneInd, setDatePaneInd] = useState(0);

    const dateRangeHook = useDateRange();
    const [dateRange, setDateRange, initDateRange, updateDayRange, updateWeekRange, updateMonthRange, updateCustomRange] = dateRangeHook

    const dateHook = useDate({ startDt, endDt });
    const [fStartDt, setFStartDt, fEndDt, setFEndDt] = dateHook.slice(0, 4);

    const [showCusStartDt, setShowCusStartDt, toggleCusStartDt] = useToggle(false);
    const [showCusEndDt, setShowCusEndDt, toggleCusEndDt] = useToggle(false);

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
    // #endregion

    // #region Helper
    const closeModal = () => setShowModal(false);

    const saveModal = () => {
        setStartDt(fStartDt);
        setEndDt(fEndDt);
        closeModal();
    }

    const updateCusStartDt = (dt) => {
        let arr = [...dateRange["Custom"]];
        arr[0].description = Utility.formatDt(dt, "EEEE, d MMMM");
        arr[0].startDt = dt;
        updateCustomRange(arr);

        setFStartDt(dt);
    }

    const updateCusEndDt = (dt) => {
        let arr = [...dateRange["Custom"]];
        arr[1].description = Utility.formatDt(dt, "EEEE, d MMMM");
        arr[1].startDt = dt;
        updateCustomRange(arr);

        setFEndDt(dt);
    }
    // #endregion

    return (
        <BaseModal cusToast={cusToast} {...props}>
            <YtCalendar
                dt={startDt} setDt={updateCusStartDt}
                showModal={showCusStartDt} setShowModal={setShowCusStartDt} />
            <YtCalendar
                dt={startDt} setDt={updateCusEndDt}
                showModal={showCusEndDt} setShowModal={setShowCusEndDt} />
            <View
                bgColor={"#FFF"}
                style={{ flexGrow: 1 }}>
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

                <Tab
                    dense
                    value={datePaneInd}
                    onChange={(e) => setDatePaneInd(e)}
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
                    <DateView hook={dateHook}
                        data={dateRange["Day"]} setData={updateDayRange} />
                    <DateView hook={dateHook}
                        data={dateRange["Week"]} setData={updateWeekRange} />
                    <DateView hook={dateHook}
                        data={dateRange["Month"]} setData={updateMonthRange} />
                    <CalendarView
                        data={dateRange["Custom"]} setData={updateCustomRange}
                        toggleCusStartDt={toggleCusStartDt} toggleCusEndDt={toggleCusEndDt} />
                </TabView>
            </View>
        </BaseModal>
    )
}

export default Index;