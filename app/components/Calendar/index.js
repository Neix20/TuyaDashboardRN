import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Calendar } from 'react-native-calendars';

import { DateTime } from "luxon";
import { useToggle } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function CalendarHeader(props) {

    const { calHook = [], flagHook = [] } = props;

    const [dt, parseDt, addDay, minusDay] = calHook.slice(0, 4);
    const [mFlag, setMFlag, toggleMFlag] = flagHook;

    const onPressLeft = () => minusDay(-1, "months");
    const onPressRight = () => addDay(1, "months");

    return (
        <TouchableOpacity onPress={toggleMFlag}>
            <HStack alignItems={"center"} justifyContent={"space-between"} style={{ height: 40 }}>
                <TouchableOpacity onPress={onPressLeft}>
                    <View alignItems={"center"} justifyContent={"center"}
                        style={{ width: 40, height: 40 }}>
                        <FontAwesome5 name={"angle-left"} size={24} />
                    </View>
                </TouchableOpacity>
                <View alignItems={"center"}>
                    <Text>{parseDt.toFormat("MMMM yyyy")}</Text>
                </View>
                <TouchableOpacity onPress={onPressRight}>
                    <View alignItems={"center"} justifyContent={"center"}
                        style={{ width: 40, height: 40 }}>
                        <FontAwesome5 name={"angle-right"} size={24} />
                    </View>
                </TouchableOpacity>
            </HStack>
        </TouchableOpacity>
    )
}

function Index(props) {

    const { calHook = [], onUpdateDay = () => {} } = props;
    const flagHook = useToggle(true);

    const [dt, parseDt, addDay, minusDay, setDay, updateCalendarDay] = calHook;
    const [mFlag, setMFlag, toggleMFlag] = flagHook;

    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { AccountType = -1 } = subUserAccess;

    // Dynamic
    const genYearArr = (year = 2023, num = 12) => {
        let arr = [];

        for(let ind = 0; ind < num; ind += 1) {
            let c_year = year - ind;

            let obj = {
                name: c_year + "",
                value: c_year
            };
            arr.push(obj);
        }

        // Sort By Ascending
        arr.sort((objA, objB) => objA.value - objB.value);

        return arr;
    };

    // [{ "name": "2012", "value": 2012 }]
    const [termArr, setTermArr] = useState([]);

    useEffect(() => {
        const year = DateTime.now().toFormat("yyyy") * 1;
        const arr = genYearArr(year, 15);
        setTermArr(arr);
    }, []);

    if (!mFlag) {
        // Fix This
        const renderItem = (item, index) => {

            const { name, value } = item;

            const onSelectTerm = () => {
                setDay(value, "year");
                toggleMFlag();
            }

            return (
                <TouchableOpacity key={index} onPress={onSelectTerm}
                    style={{ width: "33%", height: "100%" }}>
                    <View
                        alignItems={"center"} justifyContent={"center"}
                        height={"100%"}>
                        <Text style={{ fontSize: 18 }}>{name}</Text>
                    </View>
                </TouchableOpacity>
            )
        }

        return (
            <VStack alignItems={"center"} space={5}>
                <View py={1.5}>
                    <CalendarHeader calHook={calHook} flagHook={flagHook} />
                </View>
                <HStack
                    alignItems={"center"}
                    flexWrap={"wrap"}
                    style={{ 
                        height: 48,
                        rowGap: 5,
                    }}>
                    {termArr.map(renderItem)}
                </HStack>
            </VStack>
        )
    }

    const onDayPress = (day) => {
        updateCalendarDay(day);
        onUpdateDay();
    }

    const minDt = (AccountType <= 1) ? DateTime.now().plus({ days: -7 }).toFormat("yyyy-MM-dd") : DateTime.now().plus({ months: -3 }).toFormat("yyyy-MM-dd");

    return (
        <Calendar
            key={dt} current={dt}
            onDayPress={onDayPress}
            minDate={minDt}
            maxDate={DateTime.now().toFormat("yyyy-MM-dd")}
            markedDates={{
                [dt]: { selected: true, disableTouchEvent: true }
            }}
            style={{ width: "100%" }}
            hideArrows={true}
            renderHeader={_ => <CalendarHeader calHook={calHook} flagHook={flagHook} />}
        />
    )
}

export default Index;