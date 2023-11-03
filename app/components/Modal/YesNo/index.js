import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, VStack, HStack, useToast, Divider } from "native-base";

import { BaseModal } from "@components";

function Index(props) {

    const { title = "", description = "" } = props;
    const { onPressYes = () => {}, onPressNo = () => {} } = props;

    return (

        <BaseModal {...props}>
            {/* Content */}
            <VStack py={3} space={3}
                width={"90%"} alignItems={"center"}>
                
                <Text style={{ fontFamily: "Roboto-Bold", fontSize: 20 }}>{title}</Text>

                <Text style={{
                    fontFamily: "Roboto-Bold",
                    fontSize: 16,
                    textAlign: "justify",
                    color: "#000",
                }}>{description}</Text>

                {/* Button Panel */}
                <HStack space={3}>
                    <TouchableOpacity onPress={onPressYes}>
                        <HStack
                            bgColor={"#2898FF"}
                            borderRadius={8}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{ width: 120, height: 40 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                textAlign: "center",
                                color: "#fff",
                            }}>Yes</Text>
                        </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressNo}>
                        <HStack
                            borderRadius={8}
                            bgColor={"#E6E6E6"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{ width: 120, height: 40 }}>
                            <Text style={{
                                fontFamily: "Roboto-Bold",
                                fontSize: 20,
                                textAlign: "center",
                                color: "#6A7683",
                            }}>No</Text>
                        </HStack>
                    </TouchableOpacity>
                </HStack>
            </VStack>
        </BaseModal>
    )
}

export default Index;