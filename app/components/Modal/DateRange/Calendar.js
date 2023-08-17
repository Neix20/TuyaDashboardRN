import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Calendar } from 'react-native-calendars';

function Index(props) {

    // #region Props
    const { flag = false, setFlag = () => { } } = props;
    const { dt, setDt = () => {} } = props;
    // #endregion

    const [selected, setSelected] = useState(dt);

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
                            current={dt}
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

export default Index;