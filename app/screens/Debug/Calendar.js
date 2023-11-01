import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Calendar } from 'react-native-calendars';

import { DateTime } from "luxon";


function useToggle(value = false) {
    const [flag, setFlag] = useState(value);

    const toggleFlag = () => setFlag((val) => !val);

    return [flag, setFlag, toggleFlag];
}

function useCalendarDate(init = "2023-10-01") {

    // yyyy-MM-dd: 2023-10-01
    const [dt, setDt] = useState(init);

    const [luxonDt, setLuxonDt] = useState(DateTime.now());

    useEffect(() => {
        if (dt.length > 0) {
            const t_dt = DateTime.fromFormat(dt, "yyyy-MM-dd");
            setLuxonDt(t_dt);
        }
    }, [dt]);

    const addDay = (duration = 1, delimiter = "days") => {

        const next_state = {};
        next_state[delimiter] = duration;

        const t_dt = luxonDt.plus(next_state);
        setLuxonDt(_ => t_dt);

        const t_dt_str = t_dt.toFormat("yyyy-MM-dd");
        setDt(_ => t_dt_str);
    }

    const minusDay = (duration = 1, delimiter = "days") => {
        const next_state = {};
        next_state[delimiter] = duration;

        const t_dt = luxonDt.plus(next_state);
        setLuxonDt(_ => t_dt);
        
        const t_dt_str = t_dt.toFormat("yyyy-MM-dd");
        setDt(_ => t_dt_str);
    }

    const setDay = (duration = 1, delimiter = "days") => {
        const next_state = {};
        next_state[delimiter] = duration;

        const t_dt = luxonDt.set(next_state);
        setLuxonDt(_ => t_dt);
        
        const t_dt_str = t_dt.toFormat("yyyy-MM-dd");
        setDt(_ => t_dt_str);
    }

    const updateCalendarDay = (day) => {
        const { dateString } = day;
        setDt(dateString);
    }

    return [dt, luxonDt, addDay, minusDay, setDay, updateCalendarDay];
}

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

    const { calHook = [] } = props;
    const flagHook = useToggle(true);

    const [dt, parseDt, addDay, minusDay, setDay, updateCalendarDay] = calHook;
    const [mFlag, setMFlag, toggleMFlag] = flagHook;

    // Dynamic
    const genYearArr = (year = 2023, num = 12) => {
        let arr = [];

        for(let ind = 0; ind < num; ind += 1) {
            let c_year = year - (ind + 1);

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
        const year = +DateTime.now().toFormat("yyyy");
        const arr = genYearArr(year, 15);
        setTermArr(arr);
    }, []);

    if (!mFlag) {
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

    return (
        <Calendar
            key={dt} current={dt}
            onDayPress={updateCalendarDay}
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