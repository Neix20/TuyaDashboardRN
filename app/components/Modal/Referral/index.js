// import React, { useState, useEffect } from "react";
// import { Text, TouchableOpacity, Image, TextInput, Dimensions, ImageBackground } from "react-native";
// import { View, VStack, HStack, useToast, Divider } from "native-base";

// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

// import { useNavigation, useIsFocused } from "@react-navigation/native";

// const screen = Dimensions.get("screen");
// const { width, height } = screen;

// import { info, error, Utility } from "@utility";

// import { Images, GlobalStyles, GlobalColors } from "@config";

// import { BaseModal, BcSvgIcon } from "@components";

// import { useDispatch, useSelector } from 'react-redux';
// import { Actions, Selectors } from "@redux";

// import Clipboard from '@react-native-clipboard/clipboard';

// import { TouchableWithoutFeedback, Keyboard } from "react-native";

// import ReferralStatusDict from "@config/data/referralStatus";

// function Index(props) {

//     // #region Redux
//     const { userId, sessionId } = useSelector(Selectors.userSelect);
//     const lang = useSelector(Selectors.langSelect);
//     // #endregion

//     const init = {
//         toast: {
//             msg: "",
//             flag: false
//         },
//         refProfile: {
//             "ReferralCount": 0,
//             "UserId": -1,
//             "ReferralCode": "Guest Mode",
//             "ReferralBy": ""
//         }
//     }

//     // #region Props
//     const { refProfile = init.refProfile, setRefProfile } = props;
//     const { ReferralBy, ReferralCode, ReferralCount } = refProfile;

//     const { showModal, setShowModal } = props;

//     const { setLoading } = props;
//     // #endregion

//     // #region UseState
//     const [refCode, setRefCode] = useState("");

//     const [submitFlag, setSubmitFlag] = useState(false);

//     const [editFlag, setEditFlag] = useState(true);
//     // #endregion

//     // #region Toast
//     const [cusToast, setCusToast] = useState(init.toast);

//     const setToastFlag = (val) => {
//         setCusToast({
//             ...cusToast,
//             flag: val
//         });
//     }

//     const showToastMsg = (val) => {
//         setCusToast({
//             ...cusToast,
//             msg: val,
//             flag: true
//         })
//     }

//     useEffect(() => {
//         if (cusToast.flag) {
//             setTimeout(() => {
//                 setToastFlag(false);
//             }, 3 * 1000);
//         }
//     }, [cusToast.flag]);
//     // #endregion

//     // #region API List
//     const fetchUpdateRefCode = async () => {
//         const action = "UpdateReferralCode";
//         const url = Utility.genLoyaltyServerUrl(action);

//         // Static Data
//         let obj = Utility.requestObj({
//             UserId: userId,
//             SessionId: sessionId,
//             ReferralCode: refCode,
//         });

//         const resp = await fetch(url, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(obj),
//         });

//         const data = await resp.json();
//         setLoading(false);

//         let responseCodeLs = ["00", "002011", "002012", "002013"];

//         if (responseCodeLs.includes(data["ResponseCode"])) {
//             const { ResponseCode, ReferralName } = data;

//             let msg = ReferralStatusDict[ResponseCode];
//             msg = Utility.translate(msg, lang);
//             showToastMsg(msg);

//             if (ResponseCode == "00") {
//                 setEditFlag(false);
//                 setRefCode(ReferralName);
//             }

//         }
//         else {
//             console.log(`ReferralModal - UpdateReferralCode - Request - ${JSON.stringify(obj)}`);
//             console.log(`ReferralModal - UpdateReferralCode - Response - ${JSON.stringify(data)}`);
//         }
//     };
//     // #endregion

//     // #region UseEffect
//     useEffect(() => {
//         let tFlag = false;
//         tFlag = (refCode != "" && ReferralBy === "" && editFlag);
//         setSubmitFlag(tFlag);
//     }, [refCode, editFlag]);

//     useEffect(() => {
//         setRefCode(ReferralBy);
//         setEditFlag(ReferralBy === "")
//     }, []);
//     // #endregion

//     // #region Helper Functions
//     const submitReferral = () => {
//         setLoading(true);
//         fetchUpdateRefCode().catch((err) => {
//             setLoading(false);
//             console.log(`Error: ${err}`);
//         });
//     }

//     const copyReferralCode = () => {
//         const { ReferralCode } = refProfile;

//         const msg = Utility.translate("Successfully Copied to Clipboard!", lang);
//         showToastMsg(msg);

//         Clipboard.setString(ReferralCode);
//     }

//     const dismissKeyboard = () => {
//         Keyboard.dismiss();
//     }
//     // #endregion

//     return (
//         <BaseModal {...props} cusToast={cusToast}>
//             <TouchableWithoutFeedback onPress={dismissKeyboard}>

//                 {/* Content */}
//                 <VStack
//                     py={5}
//                     w={width - 100}
//                     alignItems={"center"}
//                     space={3}>

//                     {/* Logo */}
//                     <BcSvgIcon name={"ReferralPerson"} width={48} height={48} fill={Utility.getColor()} />


//                     {/* Title */}
//                     <VStack space={2} style={{ width: width - 100 }}>
//                         <Text style={[GlobalStyles.txtTitle, {
//                             fontSize: 20,
//                             textAlign: "center"
//                         }]}>{Utility.translate("Refer Your Family & friends And Get Rewarded!", lang)}</Text>
//                         <Text style={{
//                             fontFamily: "Roboto-Bold",
//                             fontSize: 14,
//                             textAlign: "justify",
//                             color: "#000"
//                         }}>{Utility.translate("Introduce family and friends to start sending love with Buah Cinta, enjoy surprise reward for every referral.", lang)}</Text>
//                     </VStack>

//                     <VStack w={width - 100} space={3}>

//                         <VStack space={1}>
//                             <Text
//                                 style={{
//                                     fontFamily: "Roboto-Bold",
//                                     fontSize: 16,
//                                 }}>
//                                 {Utility.translate("Your Referral Code", lang)}
//                             </Text>

//                             <HStack
//                                 px={5} borderRadius={4}
//                                 bgColor={"#E6E6E6"}
//                                 alignItems={"center"}
//                                 justifyContent={"space-between"}
//                                 style={{
//                                     width: width - 100,
//                                     height: 48,
//                                 }}>
//                                 <Text
//                                     style={{
//                                         fontFamily: "Roboto-Medium",
//                                         fontSize: 20,
//                                     }}>
//                                     {ReferralCode}
//                                 </Text>
//                                 <TouchableOpacity onPress={copyReferralCode}>
//                                     <HStack alignItems={"center"} space={1}>
//                                         <FontAwesome5 name={"clone"} size={20} color={GlobalColors.darkRed} />
//                                         <Text
//                                             style={{
//                                                 fontFamily: "Roboto-Bold",
//                                                 fontSize: 16,
//                                                 color: GlobalColors.darkRed,
//                                             }}>
//                                             {Utility.translate("Copy", lang)}
//                                         </Text>
//                                     </HStack>
//                                 </TouchableOpacity>
//                             </HStack>
//                         </VStack>

//                         <Divider bgColor={"#EBEBEB"} />

//                         <VStack space={1}>
//                             <Text
//                                 style={{
//                                     fontFamily: "Roboto-Bold",
//                                     fontSize: 16,
//                                 }}>
//                                 {Utility.translate("You are referred by", lang)}
//                             </Text>

//                             <HStack
//                                 key={ReferralCode}
//                                 px={5} borderRadius={4}
//                                 bgColor={"#E6E6E6"}
//                                 alignItems={"center"}
//                                 justifyContent={"space-between"}
//                                 style={{
//                                     width: width - 100,
//                                     height: 48,
//                                 }}>
//                                 <TextInput
//                                     defaultValue={refCode}
//                                     onChangeText={setRefCode}
//                                     keyboardType={"default"}
//                                     editable={editFlag}
//                                     placeholder={Utility.translate("Enter", lang)}
//                                     style={{
//                                         // backgroundColor: "#000",
//                                         fontFamily: "Roboto-Medium",
//                                         fontSize: 20,
//                                         color: "#000",
//                                         width: 150,
//                                     }} />
//                                 {
//                                     (submitFlag) ?
//                                         (
//                                             <TouchableOpacity onPress={submitReferral}>
//                                                 <Text style={[{
//                                                     fontSize: 18,
//                                                     fontFamily: "Roboto-Bold",
//                                                     color: GlobalColors.darkRed,
//                                                 }]}>{Utility.translate("Submit", lang)}</Text>
//                                             </TouchableOpacity>
//                                         ) : (
//                                             <></>
//                                         )
//                                 }
//                             </HStack>
//                         </VStack>

//                         <Divider bgColor={"#EBEBEB"} />
//                     </VStack>

//                     <HStack
//                         alignItems={"center"}
//                         justifyContent={"space-between"}
//                         style={{ width: width - 100 }}>
//                         {/* Your Referrals */}
//                         <VStack
//                             bgColor={"#F5F5F5"}
//                             alignItems={"center"}
//                             justifyContent={"center"}
//                             borderRadius={8}
//                             style={{
//                                 width: (width - 110) / 2,
//                                 height: 80
//                             }}>
//                             <Text style={{
//                                 fontFamily: "Roboto-Bold",
//                                 fontSize: 16,
//                                 color: "#000"
//                             }}>{Utility.translate("Your Referrals", lang)}</Text>
//                             <Text style={{
//                                 fontFamily: "Roboto-Bold",
//                                 fontSize: 20,
//                             }}>{ReferralCount}</Text>
//                         </VStack>

//                         {/* Collected Points */}
//                         <VStack
//                             bgColor={"#F5F5F5"}
//                             alignItems={"center"}
//                             justifyContent={"center"}
//                             borderRadius={8}
//                             style={{
//                                 width: (width - 110) / 2,
//                                 height: 80
//                             }}>
//                             <Text style={{
//                                 fontFamily: "Roboto-Bold",
//                                 fontSize: 16,
//                                 color: "#000"
//                             }}>{Utility.translate("Collected Points", lang)}</Text>
//                             <Text style={{
//                                 fontFamily: "Roboto-Bold",
//                                 fontSize: 20,
//                             }}>{ReferralCount * 25}</Text>
//                         </VStack>
//                     </HStack>
//                 </VStack>

//             </TouchableWithoutFeedback>
//         </BaseModal>
//     )
// }

// export default Index;

function Index() {
    return (
        <></>
    )
}

export default Index;