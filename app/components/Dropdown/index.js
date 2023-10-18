import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, StyleSheet, Dimensions } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import DropDownPicker from "react-native-dropdown-picker";

const colors = {
    lightGray: "#FFF",
    darkGray: '#505B67',
    mgray: '#A0AAB6',
    gray: "#DAE1EA",
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        backgroundColor: colors.lightGray,
        borderColor: colors.gray,
        minHeight: 0,
    },
    dropDownContainer: {
        borderColor: colors.gray,
        alignSelf: "center",
        zIndex: 100,
    },
    placeHolder: {
        fontFamily: "Roboto-Medium",
        fontSize: 14,
        textAlign: "center",
        color: colors.darkGray
    },
    label: {
        fontFamily: "Roboto-Medium",
        fontSize: 14,
        textAlign: "center",
        color: colors.darkGray
    },
    text: {
        fontFamily: "Roboto-Medium",
        fontSize: 14,
        color: colors.darkGray
    },
});

function Index(props) {

    // #region Prop
    const { value, setValue } = props;
    const { items, placeholder = "Select Item" } = props;
    const { width, height} = props;
    // #endregion

    // #region UseState
    const [open, setOpen] = useState(false);
    // #endregion

    return (
        <DropDownPicker items={items}
            open={open} setOpen={setOpen}
            value={value} setValue={setValue}
            placeholder={placeholder}
            style={[styles.container, { width: width, height: height }]}
            containerStyle={{ width: width, height: height }}
            dropDownContainerStyle={[styles.dropDownContainer, { width: width }]}
            placeholderStyle={styles.placeHolder}
            labelStyle={styles.label}
            textStyle={styles.text}
        />
    );

}

export default Index;