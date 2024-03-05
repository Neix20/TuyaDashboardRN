import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack, useToast, Divider } from "native-base";

import { BaseModal } from "@components";

import { Utility } from "@utility";

function Index(props) {

    const { title = "Title", description = "Description" } = props;

    const { titleYes = "Yes", titleNo = "No" } = props;
    const { onPressYes = () => {}, onPressNo = () => {} } = props;

    const style = {
        title: { 
            fontFamily: "Roboto-Bold", 
            fontSize: 20 
        },
        description: {
            fontFamily: "Roboto-Bold",
            fontSize: 16,
            textAlign: "center",
            color: "#000",
        },
        titleYes: {
            fontFamily: "Roboto-Bold",
            fontSize: 20,
            textAlign: "center",
            color: "#fff",
        },
        titleNo: {
            fontFamily: "Roboto-Bold",
            fontSize: 20,
            textAlign: "center",
            color: "#6A7683",
        }
    };

    return (
        <BaseModal {...props}>
            {/* Content */}
            <VStack py={3} space={3}
                width={"90%"} alignItems={"center"}>
                
                <Text style={style.title}>{title}</Text>

                <Text style={style.description}>{description}</Text>

                {/* Button Panel */}
                <HStack space={3}>
                    <TouchableOpacity onPress={onPressYes}>
                        <HStack
                            borderRadius={8} bgColor={Utility.getColor()}
                            alignItems={"center"} justifyContent={"center"}
                            style={{ width: 120, height: 40 }}>
                            <Text style={style.titleYes}>{titleYes}</Text>
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressNo}>
                        <HStack
                            borderRadius={8} bgColor={"#E6E6E6"}
                            alignItems={"center"} justifyContent={"center"}
                            style={{ width: 120, height: 40 }}>
                            <Text style={style.titleNo}>{titleNo}</Text>
                        </HStack>
                    </TouchableOpacity>
                </HStack>
            </VStack>
        </BaseModal>
    )
}

export default Index;