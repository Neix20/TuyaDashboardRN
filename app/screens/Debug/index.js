import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, Dimensions, SafeAreaView, ScrollView, FlatList, TouchableWithoutFeedback } from "react-native";
import { View, VStack, HStack, Divider, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { BcSvgChart, BcDateRangeModal, BcViewShot, BcDropdown } from "@components";

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
// #endregion

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

                    <Text>{val}</Text>
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

const Index = DebugDateRange;

export default Index;