import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

// #region Stylesheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dropdown: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

const colors = {
    lightGray: "#FFF",
    darkGray: '#505B67',
    mgray: '#A0AAB6',
    gray: "#DAE1EA",
};

const dd_picker_styles = StyleSheet.create({
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
// #endregion

function Index(props) {

    const { value = "", setValue = () => {} } = props;
    const { items = [], placeholder } = props;
    
    const [isFocus, setIsFocus] = useState(false);

    const onChange = (item) => {
        setValue(item.value);
        setIsFocus(false);
    }

    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                iconStyle={styles.iconStyle}
                maxHeight={220}
                data={items}
                value={value}
                placeholder={placeholder}
                labelField="label"
                valueField="value"
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={onChange}
                renderRightIcon={() => (
                    <FontAwesome name={isFocus ? "angle-up" : "angle-down"} size={20} color={isFocus ? 'blue' : 'black'} />
                )}
            />
        </View>
    );
};

export default Index;