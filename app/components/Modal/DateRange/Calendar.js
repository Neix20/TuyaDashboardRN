import React, { useState, useEffect } from "react";
import { View, VStack, HStack, useToast } from "native-base";

import { Calendar } from 'react-native-calendars';

import Modal from "react-native-modal";

function Index(props) {

    const { showModal = false, setShowModal = () => { } } = props;
    const { dt, setDt = () => { } } = props;

    const [selected, setSelected] = useState(dt);

    const closeModal = () => setShowModal(false);
    const updateDay = (day) => {
        const { dateString } = day;

        setDt(dateString);
        setSelected(dateString);

        closeModal();
    }

    if (!showModal) {
        return (<></>);
    }

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
                <Calendar
                    current={dt}
                    onDayPress={updateDay}
                    markedDates={{
                        [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                    }}
                />
            </View>
        </Modal>
    )
}

export default Index;