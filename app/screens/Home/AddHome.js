import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, TextInput, FlatList } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";
import { CheckBox } from "@rneui/themed";

import { Logger, Utility } from "@utility";

import { BcBoxShadow, BcDisable, BcLoading } from "@components";

import { fetchAddHome } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

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
                                color: Utility.getColor()
                            }}>Save</Text>
                        </TouchableOpacity>
                    ) : (
                        <BcDisable>
                            <Text style={{
                                fontSize: 20,
                                color: Utility.getColor()
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

    // #region Init
    const init = {
        roomLs: ["Living Room", "Office", "Kitchen", "Master Bedroom", "Dining Room"]
    }
    // #endregion

    // #region UseState
    const [roomLs, setRoomLs] = useState([])
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (isFocused) {
            let arr = [...init.roomLs];

            arr = arr.map((obj, ind) => ({
                Name: obj,
                pos: ind,
                flag: false
            }));

            setRoomLs(arr);
        }
    }, [isFocused]);
    // #endregion

    const { name } = form;

    // #region Helper
    const onChangeName = (val) => {
        const nextState = {
            ...form,
            name: val
        }
        setForm(nextState);
    }

    const onChangeRoom = (val) => {
        val = val.map(obj => obj.Name);

        const nextState = {
            ...form,
            roomLs: val
        }
        setForm(nextState);
    }

    const selectRoom = (item) => {
        const { pos, flag } = item;

        let arr = [...roomLs];
        arr[pos].flag = !flag;

        setRoomLs(arr);

        let fArr = arr.filter(obj => obj.flag === true);
        onChangeRoom(fArr);
    }
    // #endregion

    // #region Render
    const renderItem = ({ item, index }) => {
        const { Name, flag } = item;
        const selectItem = () => selectRoom(item);
        return (
            <TouchableOpacity onPress={selectItem}>
                <HStack key={index}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    style={{ height: 60 }}>
                    <Text style={{
                        fontSize: 18
                    }}>{Name}</Text>
                    <CheckBox
                        containerStyle={{
                            paddingHorizontal: 5,
                            paddingVertical: 0,
                        }}
                        iconType={"material-community"}
                        checkedIcon={"checkbox-marked"}
                        uncheckedIcon={"checkbox-blank-outline"}
                        checked={flag}
                        onPress={selectItem}
                        checkedColor={Utility.getColor()} />
                </HStack>
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
                    <View flex={.2}>
                        <Text style={{
                            fontSize: 18
                        }}>Name</Text>
                    </View>
                    <View flex={.8}>
                        <TextInput
                            defaultValue={name}
                            onChangeText={onChangeName}
                            placeholder={"Home Name"}
                            autoCapitalize={"none"}
                            style={{
                                fontFamily: "Roboto-Medium",
                                fontSize: 18,
                                color: "#000",
                            }} />
                    </View>
                </HStack>
            </View>

            <View bgColor={"#FFF"}
                alignItems={"center"}>
                <FlatList
                    data={roomLs}
                    renderItem={renderItem}
                    style={{ width: "90%" }} />
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
            name: "",
            roomLs: []
        }
    }
    // #endregion

    // #region Redux
    const userId = useSelector(Selectors.userIdSelect);
    // #endregion

    // #region UseState
    const [flag, setFlag] = useState(false);
    const [form, setForm] = useState(init.form);
    const [loading, setLoading] = useState(false);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        let flag = true;

        flag = flag && form.name !== "";
        flag = flag && form.roomLs.length > 0;

        setFlag((_) => flag);
    }, [JSON.stringify(form)]);
    // #endregion

    // #region Helper
    const clearForm = () => {
        setForm(init.form);
    }
    const save = () => {

        const { name, roomLs} = form;

        setLoading(true);
        fetchAddHome({
            param: {
                UserId: userId,
                HomeName: name,
                RoomLs: roomLs
            },
            onSetLoading: setLoading,
        })
        .then(data => {
            clearForm();

            navigation.navigate("HomeManagement");
        })
        .catch(err => {
            setLoading(false);
            console.log(`Error: ${err}`);

            toast.show({
                description:  `Error: ${err}`
            })
        })
    }
    // #endregion

    return (
        <>
            <BcLoading loading={loading} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <Header flag={flag} onSave={save}>Create a Home</Header>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View flexGrow={1}>
                            {/* Add Home */}
                            <HomeForm
                                form={form} setForm={setForm} />
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;