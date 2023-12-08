import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";

import Tooltip from 'react-native-walkthrough-tooltip';

import { useToggle } from "@hooks";

const style = {
    shadowStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5 
    }
}

function Index(props) {

    const { content = () => (<></>), hook = [], children } = props;
    const { placement = "top", bgColor = "#F6F6F6", modalBgColor = "rgba(0, 0, 0, 0)", borderWidth = 1 } = props;

    const [open, setOpen, toggleOpen] = hook;

    return (
        <Tooltip
            isVisible={open}
            onClose={toggleOpen}
            content={content}
            placement={placement}
            showChildInTooltip={false}
            contentStyle={{ 
                backgroundColor: bgColor, 
                borderWidth: borderWidth,
            }}
            backgroundColor={modalBgColor}
            arrowStyle={{ top: 0 }}>
            <TouchableOpacity onPress={toggleOpen}>
                {children}
            </TouchableOpacity>
        </Tooltip>
    )
};

export default Index;