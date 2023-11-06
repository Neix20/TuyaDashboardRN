import React, { useState, useEffect } from "react";
import { View, VStack, HStack, useToast } from "native-base";

import Modal from "react-native-modal";

import { DateTime } from "luxon";

import { BcCalendar } from "@components";

import { useCalendarDate } from "@hooks";

import { Calendar } from 'react-native-calendars';

function Index(props) {

    const { showModal = false, setShowModal = () => { } } = props;
    const { dt, setDt = () => { } } = props;

    const closeModal = () => setShowModal(false);

    const calHook = useCalendarDate(dt);
    const [calDt] = calHook;

    useEffect(() => {
        setDt(calDt);
    }, [calDt]);

    return (
        <Modal
            isVisible={showModal}
            animationInTiming={1}
            animationOutTiming={1}
            onBackButtonPress={closeModal}
            onBackdropPress={closeModal}
            backdropOpacity={.5}>
            <View
                alignItems={"center"}
                justifyContent={"center"}>
                <View bgColor={"#FFF"} style={{ width: "90%", height: 360 }}>
                    <BcCalendar calHook={calHook} onUpdateDay={closeModal} />
                </View>
            </View>
        </Modal>
    )
}

export default Index;