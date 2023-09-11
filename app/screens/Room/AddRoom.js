import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { Logger, Utility } from "@utility";

import { BcDisable, BcLoading, BcBoxShadow } from "@components"

// #region Components
function Header(props) {

    // #region Props
    const { children, onBack = () => { }, onSave = () => { } } = props;
    const { flag = false } = props;
    // #endregion

    const navigation = useNavigation();

    // #region Helper Functions
    const GoBack = () => {
        onBack();
        navigation.goBack();
    }
    // #endregion

    return (
        <View bgColor={"#FFF"}
            alignItems={"center"}>
            <HStack alignItems={"center"}
                justifyContent={"space-between"}
                style={{ height: 60, width: "90%" }}>
                <TouchableOpacity onPress={GoBack}>
                    <Text style={{
                        fontSize: 20,
                        color: "#ccc",
                    }}>Cancel</Text>
                </TouchableOpacity>
                <Text style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#000",
                }}>{children}</Text>
                {
                    (flag) ? (
                        <TouchableOpacity onPress={onSave}>
                            <Text style={{
                                fontSize: 20,
                                color: "#2898FF"
                            }}>Save</Text>
                        </TouchableOpacity>
                    ) : (
                        <BcDisable>
                            <Text style={{
                                fontSize: 20,
                                color: "#2898FF"
                            }}>Save</Text>
                        </BcDisable>
                    )
                }
            </HStack>
        </View>
    )
}

function HomeForm(props) {

    const isFocused = useIsFocused();

    // #region Props
    const { form, setForm = () => { } } = props;
    // #endregion

    // #region Initial
    const init = {
        roomLs: ["Living Room", "Master Bedroom", "Dining Room", "Office", "Kitchen",]
    }
    // #endregion

    const { name } = form;

    // #region UseState
    const [roomLs, setRoomLs] = useState([]);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            let arr = [...init.roomLs];
            setRoomLs(arr);
        }
    }, [isFocused]);
    // #endregion

    // #region Helper
    const onChangeName = (val) => {
        const nextState = {
            ...form,
            name: val
        }
        setForm(nextState);
    }
    // #endregion

    // #region Render
    const renderItem = (item, index) => {
        const onSelect = () => onChangeName(item);
        return (
            <TouchableOpacity key={index}
                 onPress={onSelect}>
                <View borderWidth={1} borderRadius={8} p={2}>
                    <Text>{item}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    // #endregion

    return (
        <VStack space={3}>
            <View bgColor={"#FFF"}
                alignItems={"center"}>
                <HStack
                    alignItems={"center"}
                    width={"90%"}
                    style={{ height: 60 }}>
                    <View flex={.3}>
                        <Text style={{
                            fontSize: 18
                        }}>Room Name</Text>
                    </View>
                    <View flex={.7}>
                        <TextInput
                            defaultValue={name}
                            onChangeText={onChangeName}
                            placeholder={"Room Name"}
                            autoCapitalize={"none"}
                            style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                                color: "#000",
                            }} />
                    </View>
                </HStack>
            </View>

            <View alignItems={"center"}>
                <HStack width={'90%'}>
                    <Text>Recommended</Text>
                </HStack>
            </View>

            <View alignItems={"center"}>
                <HStack space={3} rowGap={10}
                    flexWrap={"wrap"}
                    width={'90%'}>
                    {
                        roomLs.map(renderItem)
                    }
                </HStack>
            </View>


        </VStack>
    )
}
// #endregion

function Index(props) {
    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    // #region Initial
    const init = {
        form: {
            name: ""
        }
    }
    // #endregion

    // #region UseState
    const [flag, setFlag] = useState(false);
    const [form, setForm] = useState(init.form);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        let flag = true;

        flag = flag && form.name !== "";

        setFlag((_) => flag);
    }, [JSON.stringify(form)]);
    // #endregion

    // #region Helper
    const clearForm = () => {
        setForm(init.form);
    }
    const save = () => {
        console.log(form);
        clearForm();

        navigation.navigate("TabNavigation", {
            screen: "Device"
        })
    }
    // #endregion

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Header */}
                <Header flag={flag} onSave={save}>Add Room</Header>

                <View style={{ height: 10 }} />

                {/* Body */}
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>
                    <View flexGrow={1}>
                        <HomeForm form={form} setForm={setForm} />
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={{ height: 60 }} />
            </View>
        </SafeAreaView>
    );
}

export default Index;