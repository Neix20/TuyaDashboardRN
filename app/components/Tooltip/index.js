import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";

import Tooltip from 'react-native-walkthrough-tooltip';

import { useToggle } from "@hooks" ;

function Index(props) {

    const { content = () => (<></>), children } = props;

    const [open, setOpen, toggleOpen] = useToggle(false);

    return (
        <Tooltip
            isVisible={open}
            onClose={toggleOpen}
            content={content}
            placement={"top"}
            contentStyle={{ backgroundColor: "#d6d6d6"}}
            backgroundColor={"rgba(0, 0, 0, 0)"}>
            <TouchableOpacity onPress={toggleOpen}>
                {children}
            </TouchableOpacity>
        </Tooltip>
    )
};

export default Index;