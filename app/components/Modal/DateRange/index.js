import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Dimensions, SafeAreaView, ScrollView, FlatList } from "react-native";
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

// #region Base Modal
function BaseModal(props) {
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
// #endregion

// #region Components
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

    // #region UseState
    const [compare, setCompare] = useState(false);
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

    const toggleCompare = () => setCompare(!compare);
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

                {/* <HStack style={{width: 360}} alignItems={"center"} justifyContent={"space-between"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#000"
                    }}>Compare</Text>
                    <Switch value={compare} onValueChange={toggleCompare} />
                </HStack> */}
            </VStack>
        </TabView.Item>
    )
}

function CalendarView(props) {

    // #region Props
    const { toggleCusStartDt, toggleCusEndDt } = props;
    const { data, setData = () => {} } = props;
    // #endregion

    // #region UseState
    const [compare, setCompare] = useState(false);
    // #endregion

    // #region Helper
    const toggleCompare = () => setCompare(!compare);
    // #endregion

    return (
        <TabView.Item style={{ width: '100%' }}>
            <VStack space={3} alignItems={"center"}>

                <View>
                    <DRangeItem onPress={toggleCusStartDt} flag={false} {...data[0]} />
                    <Divider my={2} width={width - 40} />

                    <DRangeItem onPress={toggleCusEndDt} flag={false} {...data[1]} />
                    <Divider my={2} width={width - 40} />
                </View>

                {/* <HStack style={{width: 360}} alignItems={"center"} justifyContent={"space-between"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#000"
                    }}>Compare</Text>
                    <Switch value={compare} onValueChange={toggleCompare} />
                </HStack> */}

            </VStack>
        </TabView.Item>
    );
}
// #endregion

function Index(props) {

    // #region Props
    const { showModal, setShowModal } = props;
    const { dt = "" } = props;
    const { startDt, setStartDt = () => {} } = props;
    const { endDt, setEndDt = () => {} } = props;
    // #endregion

    // #region Init
    const init = {
        activeColor: "#2898FF",
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
        <BaseModal {...props}>
            <YtCalendar
                dt={dt} setDt={updateCusStartDt}
                showModal={showCusStartDt} setShowModal={setShowCusStartDt} />
            <YtCalendar
                dt={dt} setDt={updateCusEndDt}
                showModal={showCusEndDt} setShowModal={setShowCusEndDt} />
            <View
                bgColor={"#FFF"}
                style={{ flexGrow: 1 }}>
                <View alignItems={"center"}>
                    <HStack py={3}
                        alignItems={"center"} 
                        justifyContent={"space-between"}
                        style={{ width: width - 40 }}>
                        <TouchableOpacity onPress={closeModal}>
                            <View 
                                alignItems={"center"} 
                                justifyContent={"center"}
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
                        <CalendarView 
                            toggleCusStartDt={toggleCusStartDt}
                            toggleCusEndDt={toggleCusEndDt}
                            data={dateRange["Custom"]} setData={updateCustomRange}
                            startDt={fStartDt} setStartDt={setFStartDt} 
                            endDt={fEndDt} setEndDt={setFEndDt} />
                    </TabView>
                </ScrollView>
            </View>
        </BaseModal>
    )
}

export default Index;