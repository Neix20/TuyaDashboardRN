import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ImageBackground } from "react-native";
import { View, VStack, HStack, Divider, FlatList, useToast } from "native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const screen = Dimensions.get("screen");
const { width, height } = screen;

import { info, error, Utility } from "@utility";

import { Images, GlobalStyles, GlobalColors } from "@config";

import { BaseModal } from "@components";
import { BcLongNormalBtn } from "@components";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from "@redux";

function ItemElem(props) {
    const { flag, name, src } = props;

    return (
        <View
            alignItems={"center"}
            style={{ width: 300 }}>
            <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                style={{
                    width: 200
                }}>
                <Image
                    source={src}
                    style={{
                        width: 30,
                        height: 30,
                    }}
                    resizeMode={"contain"}
                    alt={""} />
                <Text style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: (flag) ? GlobalColors.red : "#000"
                }}>{name}</Text>

                {
                    (flag) ? (
                        <View
                            bgColor={"#4ECB71"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                            }}
                        >
                            <FontAwesome name={"check"} color={"#fff"} size={18} />
                        </View>
                    ) : (
                        <View style={{ width: 24, height: 24 }} />
                    )
                }
            </HStack>
        </View>
    )
}

function Index(props) {

    // #region Redux
    const lang = useSelector(Selectors.langSelect);
    // #endregion

    // #region Props
    const { showModal, setShowModal } = props;
    const { gender, setGender } = props;
    const { onConfirm = () => { } } = props;
    // #endregion

    // #region Initial
    const init = {
        genderLs: [
            {
                "name": "Male",
                "src": Images.iconMale,
            },
            {
                "name": "Female",
                "src": Images.iconFemale,
            }
        ]
    }
    // #endregion

    // #region UseState
    const [ls, setLs] = useState([]);
    // #endregion

    // #region UseEffect
    useEffect(() => {
        if (showModal) {
            let arr = [...init.genderLs];

            arr = arr.map((obj, ind) => {

                const { name } = obj;

                let flag = name === gender;
                return {
                    ...obj,
                    pos: ind,
                    flag: flag
                }
            });

            setLs(arr);
        }
    }, [showModal]);
    // #endregion

    // #region Helper
    const onSelectItem = (item) => {
        const { pos, name } = item;

        let arr = [...ls];
        arr = arr.map(obj => {
            return {
                ...obj,
                flag: false
            }
        });

        arr[pos].flag = true;

        setLs(arr);
        setGender(name);
    }
    // #endregion

    // #region Render
    const renderItem = ({ item }) => {
        return (
            <>
                <TouchableOpacity onPress={() => onSelectItem(item)}>
                    <ItemElem {...item} />
                </TouchableOpacity>
                <Divider bgColor={"#EBEBEB"} w={width - 40} my={2} />
            </>
        )
    }
    // #endregion

    return (
        <BaseModal {...props}>
            <VStack w={width - 100} space={3} alignItems={"center"} py={3}>
                <Text style={{
                    fontSize: 20,
                    fontFamily: "Roboto-Bold",
                    color: "#000"
                }}>{Utility.translate("Select Gender", lang)}</Text>
                <Divider bgColor={"#EBEBEB"} w={width - 100} />
                <FlatList
                    data={ls}
                    renderItem={renderItem}
                />
                <TouchableOpacity onPress={onConfirm}>
                    <BcLongNormalBtn>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "white",
                        }}>{Utility.translate("Confirm", lang)}</Text>
                    </BcLongNormalBtn>
                </TouchableOpacity>
            </VStack>
        </BaseModal>
    )
}

export default Index;