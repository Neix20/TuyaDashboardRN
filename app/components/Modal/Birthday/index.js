import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { Images, GlobalStyles, GlobalColors, Svg } from "@config";

import { BaseModal } from "@components";
import { BcLongNormalBtn } from "@components";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from "@redux";

import DatePicker from 'react-native-date-picker';
import { DateTime } from "luxon";

function DateText(props) {

    const { dob } = props;
    const dobVal = DateTime.fromJSDate(dob);

    return (
        <View style={{
            width: 300,
        }}>
            {/* Front Layer */}
            <View style={{
                position: "absolute",
                top: 10,
                right: 10,
            }}>
                <Svg.Calendar
                    width={21}
                    height={21}
                    fill={"#f00"} />
            </View>
            <Text style={{
                textAlign: "center",
                fontSize: 14,
                borderBottomColor: "#EBEBEB",
                borderBottomWidth: 2,
                paddingVertical: 10,
            }}>
                {dobVal.toFormat("yyyy-MM-dd")}
            </Text>
        </View>
    )
}

function Index(props) {

    // #region Redux
    const lang = useSelector(Selectors.langSelect);
    // #endregion

    // #region Props
    const { showModal, setShowModal } = props;
    const { dob, setDob } = props;
    const { onConfirm = () => { } } = props;
    // #endregion

    // #region UseState
    const [datePicker, setDatePicker] = useState(false);
    // #endregion

    // #region Helper
    const closeModal = () => {
        setShowModal(false);
    }

    const toggleDatePicker = () => {
        setDatePicker(!datePicker);
    }
    // #endregion

    return (
        <BaseModal {...props}>
            <View style={{ height: 30 }} />
            <VStack
                space={5}
                alignItems={"center"}
                style={{
                    width: 300,
                }}>
                <View alignItems={"center"}>
                    <Text style={{
                        fontFamily: "Roboto-Bold",
                        fontSize: 18,
                        color: "#000"
                    }}>{Utility.translate("Date of Birth", lang)}</Text>
                    {
                        (datePicker) ? (
                            <DatePicker
                                date={dob}
                                mode={"date"}
                                onDateChange={setDob} />
                        ) : (
                            <TouchableOpacity onPress={toggleDatePicker}>
                                <DateText {...props} />
                            </TouchableOpacity>
                        )
                    }
                </View>

                {
                    (datePicker) ? (
                        <TouchableOpacity onPress={toggleDatePicker}>
                            <BcLongNormalBtn>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "white",
                                }}>{Utility.translate("Confirm", lang)}</Text>
                            </BcLongNormalBtn>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={onConfirm}>
                            <BcLongNormalBtn>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: "white",
                                }}>{Utility.translate("Confirm", lang)}</Text>
                            </BcLongNormalBtn>
                        </TouchableOpacity>
                    )
                }
            </VStack>

            <View style={{ height: 30 }} />
        </BaseModal>
    )
}

export default Index;