import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";

import { BaseIIModal } from "@components";

import Carousel from 'react-native-reanimated-carousel';
import PaginationDot from 'react-native-animated-pagination-dot';

import { fetchGetParamApi } from "@api";


function AdBtn(props) {
    const { onPress = () => { }, Icon } = props;

    const color = Utility.getColor();

    const style = {
        btn: {
            width: 48,
            height: 48
        }
    }
    return (
        <TouchableOpacity onPress={onPress}>
            <View alignItems={"center"} justifyContent={"center"} style={style.btn}>
                <FontAwesome5 name={Icon} color={color} size={24} />
            </View>
        </TouchableOpacity>
    )
}

function Modal(props) {

    const { images = [] } = props;

    if (images.length <= 0) {
        return (<></>)
    }

    const style = {
        title: {
            fontFamily: "Roboto-Bold",
            fontSize: 18,
            color: "#000"
        },
        img: {
            height: "100%",
            width: "100%"
        }
    }

    // #region UseState
    const [tabPaneInd, setTabPaneInd] = useState(0);
    const imgView = useRef(null);

    const color = Utility.getColor();
    const display = images.length <= 1 ? "none" : "flex";
    // #endregion

    // #region Helper
    const renderItem = ({ item: { src, pos } }) => (
        <View key={pos} bgColor={"#000"}
            alignItems={"center"} onStartShouldSetResponder={() => true}>
            <Image
                source={src}
                style={style.img}
                resizeMode={"contain"}
                alt={src + ""} />
        </View>
    )

    const onProgressChange = (_, progress) => {
        const num = Math.round(progress) % images.length;
        setTabPaneInd(_ => num);
    }

    const nextImg = () => {
        imgView.current.scrollTo({ count: 1, animated: true });
    }

    const prevImg = () => {
        imgView.current.scrollTo({ count: -1, animated: true });
    }
    // #endregion

    return (
        <BaseIIModal {...props}>
            <VStack space={3} alignItems={"center"}>
                {/* Title */}
                <Text style={style.title}>Advertisement</Text>

                <Carousel ref={imgView}
                    data={images} renderItem={renderItem}
                    onProgressChange={onProgressChange}
                    width={360} height={480}
                />

                {/* Pagination */}
                <HStack width={"90%"} display={display}
                    alignItems={"center"} justifyContent={"space-between"}>
                    <AdBtn onPress={prevImg} Icon={"chevron-left"} />
                    {/* Pagination */}
                    <PaginationDot
                        activeDotColor={color}
                        inactiveDotColor={Utility.colorOpacity(color, 0.5)}
                        curPage={tabPaneInd}
                        maxPage={images.length}
                        sizeRatio={2}
                    />
                    <AdBtn onPress={nextImg} Icon={"chevron-right"} />
                </HStack>
            </VStack>
        </BaseIIModal>
    )
}

function useAdImgLs() {
    const [ls, setLs] = useState([]);

    const updateLs = (data) => {
        let arr = [...data];

        arr = arr.map((img, ind) => {
            return {
                src: { uri: img },
                pos: ind
            }
        });

        setLs(_ => arr);
    }
    return [ls, updateLs];
}

function Index(props) {

    const [adLs, setAdLs] = useAdImgLs();

    useEffect(() => {
        GetAdList();
    }, []);

    const GetAdList = () => {
        fetchGetParamApi({
            param: {
                ParamKey: "Yatu_AdUrl"
            },
            onSetLoading: () => { }
        })
            .then(data => {
                const { Content = [] } = data;
                setAdLs(Content);
            })
            .catch(error => {
                console.error(error);
            })
    };

    return (
        <Modal images={adLs} {...props} />
    )
}

export {
    Modal,
    Index
};