import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, StyleSheet, Dimensions } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width: gWidth, height: gHeight } = screen;

import { info, error, Utility } from "@utility";

import {Images, GlobalStyles, GlobalColors} from "@config";

import DropDownPicker from "react-native-dropdown-picker";

const colors = {
    lightGray: "#F1F6FC",
    darkGray: '#505B67',
    mgray: '#A0AAB6',
    gray: "#DAE1EA",
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        backgroundColor: colors.lightGray,
        borderColor: colors.lightGray,
    },
    dropDownContainer: {
        borderColor: colors.gray,
        backgroundColor: "white",
        width: gWidth - 50,
        alignSelf: "center",
    },
    placeHolder: {
        textAlign: "center",
        marginLeft: 20,
        fontSize: 14,
        fontWeight: '500',
        color: colors.darkGray
    },
    selectedLabel: {
        textAlign: "center",
        marginLeft: 20,
        fontSize: 14,
        fontWeight: '600',
        color: colors.darkGray
    },
    itemLabel: {
        textAlign: "left",
        fontSize: 14,
        fontWeight: '500',
        color: colors.darkGray
    },
});

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { ls = [], placeholder = "" } = props;
    const { width = gWidth - 50, height = 200 } = props;
    const { val, setVal } = props;
    const { flag = false } = props;
    const [open, setOpen] = useState(false);
    
    return (
        <DropDownPicker items={ls}
            disabled={flag}
            placeholder={placeholder}
            open={open} setOpen={setOpen}
            value={val} setValue={setVal}
            style={[styles.container, { width: width }]}
            dropDownContainerStyle={[styles.dropDownContainer, { width: width, height: height }]}
            placeholderStyle={styles.placeHolder}
            labelStyle={styles.selectedLabel}
            listParentLabelStyle={styles.itemLabel}
        />
    );

}

export default Index;