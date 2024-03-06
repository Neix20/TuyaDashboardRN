import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView, Keyboard } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";

import { Animation, clsConst, Images } from "@config";

import { BcSvgIcon, BcLoading, BcDisable, BcDeleteAccountModal, BcExpiredAccountModal, BcYesNoModal, BcCheckUserModal, BcDisableII } from "@components";
import { BottomModal, BaseModal } from "@components";

import { fetchRequestOtp, fetchLogin, fetchDemoLogin, fetchSubUserAccess, fetchSubUserLogin, fetchJoinViewerSession } from "@api";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

import { useTimer, useToggle, useModalToast } from "@hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// #region Custom Hooks
function useChangeBg() {

    const imgLs = [Images.sunsetBg, Images.sunsetBgII, Images.sunsetBgIII];

    const [img, setImg] = useState(imgLs[0]);

    const [ind, setInd] = useState(0);

    useEffect(() => {
        setImg(_ => imgLs[ind])
    }, [ind])

    useEffect(() => {
        const tick = () => setInd(val => (val + 1) % imgLs.length);
        const delay = 15 * 1000;

        const timer = setInterval(tick, delay);
        return () => clearInterval(timer);
    }, []);

    return [img];
}
// #endregion

// #region Components
function Timer(props) {
    const { timer = 0 } = props;

    const style = {
        txtStyle: {
            fontSize: 14,
            fontWeight: "bold"
        }
    }

    if (timer == 0) {
        return (<></>)
    }

    return (
        <Text style={{ fontFamily: "Roboto-Medium" }}>
            <Text>Didn't Receive OTP? </Text>
            <Text style={style.txtStyle}>Resend ({timer}s)</Text>
        </Text>
    )
}

function RequestOtpBtn(props) {

    const { flag = true, onPress = () => { } } = props;

    const [oFlag, setOFlag, toggleOFlag] = useToggle(false);

    const Item = () => {
        return (
            <View backgroundColor={"#fff"}
                alignItems={"center"} justifyContent={"center"}
                style={{ width: 100, height: 40 }}>
                <Text style={[{
                    fontSize: 14,
                    fontWeight: "bold",
                }]}>{oFlag ? "Resend" : "Request"} OTP</Text>
            </View>
        )
    }

    const onSelect = () => {
        onPress();
        setOFlag(_ => true);
    }

    if (!flag) {
        return (
            <BcDisable>
                <Item />
            </BcDisable>
        )
    }

    return (
        <TouchableOpacity onPress={onSelect}>
            <Item />
        </TouchableOpacity>
    )
}

function LoginBtn(props) {

    const { flag = true, onPress = () => { } } = props;

    const Item = () => (
        <View backgroundColor={Utility.getColor()}
            alignItems={"center"} justifyContent={"center"}
            style={{ height: 50 }}>
            <Text style={[{
                fontSize: 14,
                fontWeight: "bold",
                color: "white",
            }]}>Login</Text>
        </View>
    )

    if (!flag) {
        return (
            <BcDisable>
                <Item />
            </BcDisable>
        )
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <Item />
        </TouchableOpacity>
    )
}
// #endregion

// #region Existing User Login
function useExistLoginForm() {
    const init = {
        form: {
            email: "",
            otp: "",
            sessionId: "",
        }
    }

    const [form, setForm] = useState(init.form);
    const [loginFlag, setLoginFlag, toggleLoginFlag] = useToggle(false);

    const { email, otp } = form;

    useEffect(() => {
        let flag = email.length > 0 && otp.length >= 6;
        flag = flag && Utility.validateEmail(email);
        setLoginFlag(flag);
    }, [email, otp])

    const onChangeForm = (name, val) => {
        let obj = { ...form };
        obj[name] = val;
        setForm(obj);
    }
    const clearForm = () => setForm(init.form);

    const setEmail = (val) => onChangeForm("email", val);
    const setOtp = (val) => onChangeForm("otp", val);
    const setSessionId = (val) => onChangeForm("sessionId", val);

    return [form, clearForm, setEmail, setOtp, setSessionId, loginFlag];
}

function ExistLoginForm(props) {

    // const { loading, setLoading = () => { } } = props;

    const { toastHook = [], formHook = [] } = props;

    const { delAccHook = [], expAccHook = [], chkUserHook = [] } = props;

    const { showModal, setShowModal = () => { } } = props;

    const [mToast, showMsg] = toastHook;

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    // #region Initial
    const init = {
        duration: 30
    }
    // #endregion

    // #region UseState
    const [form, clearForm, setEmail, setOtp, setSessionId, loginFlag] = formHook;

    const [showDelAccModal, setShowDelAccModal, toggleDelAccModal] = delAccHook;
    const [showExpAccModal, setShowExpAccModal, toggleExpAccModal] = expAccHook;
    const [showChkUserModal, setShowChkUserModal, toggleChkUserModal] = chkUserHook;

    const [timer, setTimer] = useTimer(0);
    const [otpFlag, setOtpFlag, toggleOtpFlag] = useToggle(false);
    const [loading, setLoading, toggleLoading] = useToggle(false);
    // #endregion

    const { email, otp, sessionId } = form;

    // #region UseEffect
    // useEffect(() => {
    //     if (isFocused) {
    //         clearForm();
    //         setTimer(0);
    //     }
    // }, [isFocused]);

    useEffect(() => {
        let flag = email.length > 0 && timer == 0;
        flag = flag && Utility.validateEmail(email);
        setOtpFlag(flag);
    }, [email, timer]);
    // #endregion

    // #region Helper
    const RequestOtp = () => {
        setTimer(init.duration);
        // toast.show({
        //     description: "OTP Requested. Please Check your Email for OTP Code"
        // })
        showMsg("OTP Requested. Please Check your Email for OTP Code")
        Keyboard.dismiss();

        fetchRequestOtp({
            param: {
                Email: email
            },
            onSetLoading: setLoading,
        })
            .then(data => {
                const { Otp, SessionId, MsgTemplate, ShowDebugFlag = false, IsFirstTimeSignIn = false } = data;
                if (ShowDebugFlag) {
                    showMsg(MsgTemplate);
                }
                setSessionId(SessionId);

                if (IsFirstTimeSignIn) {
                    // setTimeout(() => {
                    //     toggleChkUserModal();
                    // }, 100);
                    // setShowModal(_ => false);
                    toggleChkUserModal();
                }
            })
            .catch(err => {
                console.log(`Error: ${err}`);
            })
    }

    const RequestAccess = (userId) => {
        fetchSubUserAccess({
            param: {
                UserId: userId
            },
            onSetLoading: () => { },
        })
            .then(data => {
                dispatch(Actions.onChangeSubUserAccess(data));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
            })
    }

    const Login = () => {
        setLoading(true);
        fetchLogin({
            param: {
                Email: email,
                Otp: otp,
                SessionId: sessionId
            },
            onSetLoading: setLoading,
        })
            .then(data => {
                if (data !== null) {

                    const { Data: { User_Id, FirstTimeUserId, ResponseMessage, UserTariff = "Residential" } } = data;

                    if (FirstTimeUserId < 3) {
                        
                        Utility.OneSignalSubscribe(email);
                        dispatch(Actions.onChangeUserId(User_Id));
                        dispatch(Actions.onChangeUserTariff(UserTariff));

                        RequestAccess(User_Id);

                        // If User Logins For First Time
                        if (FirstTimeUserId == 1) {
                            dispatch(Actions.onChangeFirstTimeLink(true));
                            navigation.navigate("AuthTuya", {
                                Email: email,
                            })
                        }
                        // User has login first time, but failed to authenticate
                        else if (FirstTimeUserId == 2) {
                            dispatch(Actions.onChangeFirstTimeLink(true));
                            navigation.navigate("AuthTuya", {
                                Email: email,
                            })
                        }
                        // User is Existing User: FirstTimeUserId == -1
                        else if (FirstTimeUserId == -1) {
                            dispatch(Actions.onChangeFirstTimeLink(false));
                            GoToHome();
                        }

                        if (ResponseMessage != "") {
                            showMsg(ResponseMessage);
                        }
                    }
                    // User has Expired
                    else if (FirstTimeUserId == 3) {
                        toggleExpAccModal();
                    }
                    // User Account has Deleted
                    else if (FirstTimeUserId == 6) {
                        toggleDelAccModal();
                    }
                    // User Account is Admin Account
                    else if (FirstTimeUserId == 99) {
                        navigation.navigate("YatuEngine");
                    }

                    clearForm();
                    setShowModal(false);
                } else {
                    showMsg("Account / otp is incorrect!");
                    setOtp("");
                }

            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    // #region Navigation
    const GoToHome = () => {
        navigation.navigate("TabNavigation", {
            screen: "Dashboard",
        });

        clearForm();
        setTimer(0);
    }

    const GoToDevice = () => {
        navigation.navigate("TabNavigation", {
            screen: "Device",
        });

        clearForm();
        setTimer(0);
    }
    // #endregion

    const style = {
        title: {
            fontSize: 20,
            fontWeight: "bold"
        },
        txtTitle: {
            fontSize: 14,
            fontWeight: "bold"
        },
        emailTxtInput: {
            fontFamily: "Roboto-Medium",
            fontSize: 16,
            color: "#000",
        },
        otpTxtInput: {
            fontFamily: "Roboto-Medium",
            fontSize: 20,
            color: "#000",
            height: 50,
        }
    }

    return (
        <>
            <BcLoading loading={loading} />
            <VStack width={"80%"} space={3}>
                <Text style={style.title}>Login</Text>

                {/* Email */}
                <View>
                    <Text style={style.txtInput}>Email</Text>

                    <HStack px={1} bgColor={"#EEF3F6"}
                        alignItems={"center"} justifyContent={"space-between"}>
                        <View flex={1} style={{ height: 60 }} justifyContent={"center"}>
                            <TextInput
                                defaultValue={email}
                                onChangeText={setEmail}
                                autoCapitalize={"none"}
                                placeholder={"xxx@gmail.com"}
                                keyboardType={"email-address"}
                                multiline={true}
                                style={style.emailTxtInput} />
                        </View>
                        <RequestOtpBtn flag={otpFlag} onPress={RequestOtp} />
                        {/* <RequestOtpBtn flag={otpFlag} onPress={toggleChkUserModal} /> */}
                    </HStack>

                    <View alignItems={"flex-end"}>
                        <Timer timer={timer} />
                    </View>
                </View>

                {/* Enter OTP */}
                <View>
                    <Text style={style.txtInput}>OTP</Text>
                    <View bgColor={"#EEF3F6"}>
                        <TextInput
                            defaultValue={otp}
                            onChangeText={setOtp}
                            autoCapitalize={"none"}
                            keyboardType={"numeric"}
                            // placeholder={"Enter OTP"}
                            style={style.otpTxtInput} />
                    </View>
                </View>

                {/* Login Btn */}
                <LoginBtn flag={loginFlag} onPress={Login} />
            </VStack>
        </>
    )
}

function ExistLoginModal(props) {

    const { formHook = [] } = props;

    const toastHook = useModalToast();
    const [toast, showMsg] = toastHook;

    return (
        <BottomModal cusToast={toast} {...props}>
            <ExistLoginForm toastHook={toastHook} formHook={formHook} {...props} />
        </BottomModal>
    )
}
// #endregion

// #region Sub User Login
function useSubLoginForm() {
    const init = {
        form: {
            username: "",
            password: "",
        }
    }

    const [form, setForm] = useState(init.form);
    const [loginFlag, setLoginFlag, toggleLoginFlag] = useToggle(false);

    const { username, password } = form;

    useEffect(() => {
        let flag = username.length > 0 && password.length >= 6;
        // flag = flag && Utility.validateEmail(email);
        setLoginFlag(flag);
    }, [username, password])

    const onChangeForm = (name, val) => {
        let obj = { ...form };
        obj[name] = val;
        setForm(obj);
    }
    const clearForm = () => setForm(init.form);

    const setUsername = (val) => onChangeForm("username", val);
    const setPassword = (val) => onChangeForm("password", val);

    return [form, clearForm, setUsername, setPassword, loginFlag];
}

function SubLoginForm(props) {

    const { toastHook = [], formHook = [] } = props;

    const [mToast, showMsg] = toastHook;

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    // #region UseState
    // const [form, clearForm, setUsername, setPassword, loginFlag] = useSubLoginForm();
    const [form, clearForm, setUsername, setPassword, loginFlag] = formHook;
    const [loading, setLoading, toggleLoading] = useToggle(false);
    // #endregion

    const { username, password } = form;

    // #region Helper
    const RequestAccess = (userId) => {
        fetchSubUserAccess({
            param: {
                UserId: userId
            },
            onSetLoading: () => { },
        })
            .then(data => {
                dispatch(Actions.onChangeSubUserAccess(data));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
            })
    }

    const SubUserLogin = () => {
        fetchSubUserLogin({
            param: {
                Username: username,
                Password: password,
            },
            onSetLoading: setLoading,
        })
            .then(data => {
                if (data !== null) {

                    const { UserId, FirstTimeUserId } = data;

                    Utility.OneSignalSubscribe(username);
                    dispatch(Actions.onChangeUserId(UserId));

                    RequestAccess(UserId);

                    if (FirstTimeUserId == 1) {
                        dispatch(Actions.onChangeFirstTimeLink(true));
                        navigation.navigate("CheckTuyaEmail", {
                            Email: email,
                        })
                    } else {
                        dispatch(Actions.onChangeFirstTimeLink(false));
                        GoToHome();
                    }



                } else {
                    showMsg("Username / Password is incorrect!");
                    setPassword("");
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    const GoToHome = () => {
        navigation.navigate("TabNavigation", {
            screen: "Dashboard",
        });

        clearForm();
    }

    const style = {
        title: {
            fontSize: 20,
            fontWeight: "bold"
        },
        txtTitle: {
            fontSize: 14,
            fontWeight: "bold"
        },
        txtInput: {
            fontFamily: "Roboto-Medium",
            fontSize: 16,
            color: "#000"
        }
    }

    return (
        <>
            <BcLoading loading={loading} />
            <VStack width={"80%"} space={3}>
                <Text style={style.title}>Sub-User Login</Text>

                {/* Email */}
                <View>
                    <Text style={style.txtTitle}>Username</Text>
                    <View px={1} bgColor={"#EEF3F6"}>
                        <TextInput
                            defaultValue={username}
                            onChangeText={setUsername}
                            placeholder={"XXX"}
                            autoCapitalize={"none"}
                            multiline={true}
                            style={style.txtInput} />
                    </View>
                </View>

                {/* Enter Password */}
                <View>
                    <Text style={style.txtTitle}>Password</Text>
                    <View bgColor={"#EEF3F6"}>
                        <TextInput
                            secureTextEntry
                            defaultValue={password}
                            onChangeText={setPassword}
                            autoCapitalize={"none"}
                            style={style.txtInput} />
                    </View>
                </View>

                {/* Login Btn */}
                <LoginBtn flag={loginFlag} onPress={SubUserLogin} />
            </VStack>
        </>
    )
}

function SubLoginModal(props) {

    const { formHook = [] } = props;

    const toastHook = useModalToast();
    const [toast, showMsg] = toastHook;

    return (
        <BottomModal {...props} cusToast={toast}>
            <SubLoginForm toastHook={toastHook} formHook={formHook} />
        </BottomModal>
    )
}
// #endregion

function useViewerForm(props) {

    const init = {
        form: {
            email: "",
            accessCode: ""
        }
    }

    const [form, setForm] = useState(init.form);

    const updateForm = (val, name) => {
        const next_state = { ...form };
        next_state[name] = val;
        setForm(_ => next_state);
    }

    const setEmail = (val) => updateForm(val, "email");
    const setAccessCode = (val) => updateForm(val, "accessCode");

    const clearForm = () => {
        setForm(_ => init.form);
    }

    const flag = form.email.length > 0 && form.accessCode.length >= 6;

    return [form, clearForm, setEmail, setAccessCode, flag];
}

function BcViewerModal(props) {

    const { showModal = false, setShowModal = () => { } } = props;

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const style = {
        title: {
            fontWeight: "bold",
            fontSize: 14,
            color: "#000"
        },
        txtInput: {
            fontFamily: "Roboto-Medium",
            fontSize: 16,
            color: "#000"
        },
        btnTitle: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#FFF",
        }
    }

    const [form, clearForm, setEmail, setAccessCode, formFlag] = useViewerForm();
    const [cusToast, setToastMsg] = useModalToast();

    const { email, accessCode } = form;

    const submitCode = () => {
        fetchJoinViewerSession({
            param: {
                Email: email,
                AccessCode: accessCode,
            },
            onSetLoading: () => { }
        })
            .then(data => {
                const { ResponseCode = "", FinalResponseMessage = "" } = data;

                if (ResponseCode === "023001" || ResponseCode === "023002" || ResponseCode === "023003") {
                    setAccessCode("");
                    setToastMsg(FinalResponseMessage);
                } else {

                    const { Data = {} } = data;

                    dispatch(Actions.onChangeViewerSession(Data));
                    navigation.navigate("ViewerSession");

                    clearForm();
                    setShowModal(false);
                }


            })
            .catch(err => {
                console.error(err);
            })
    }

    return (
        <BaseModal cusToast={cusToast} {...props}>
            <VStack py={3} space={3} width={"100%"} alignItems={"center"}>
                <View width={"80%"}>
                    <Text style={style.title}>Email</Text>
                    <View px={1} bgColor={"#EEF3F6"}>
                        <TextInput
                            keyboardType={"email-address"}
                            defaultValue={email}
                            onChangeText={setEmail}
                            autoCapitalize={"none"}
                            placeholder={"Email"}
                            multiline={true}
                            style={style.txtInput} />
                    </View>
                </View>

                <View width={"80%"}>
                    <Text style={style.title}>Viewer Code</Text>
                    <View px={1} bgColor={"#EEF3F6"}>
                        <TextInput
                            keyboardType="numeric"
                            defaultValue={accessCode}
                            onChangeText={setAccessCode}
                            autoCapitalize={"none"}
                            placeholder={"Access Code"}
                            multiline={true}
                            style={style.txtInput} />
                    </View>
                </View>

                {
                    (formFlag) ?
                        (<TouchableOpacity onPress={submitCode} style={{ width: "60%", height: 40 }}>
                            <View flex={1} backgroundColor={"#F00"}
                                alignItems={"center"} justifyContent={"center"}>
                                <Text style={style.btnTitle}>Submit</Text>
                            </View>
                        </TouchableOpacity>) :

                        (<BcDisableII style={{ width: "60%", height: 40 }}>
                            <View flex={1} backgroundColor={"#F00"}
                                alignItems={"center"} justifyContent={"center"}>
                                <Text style={style.btnTitle}>Submit</Text>
                            </View>
                        </BcDisableII>)
                }
            </VStack>
        </BaseModal>
    )
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const dispatch = useDispatch();

    // #region UseState
    const [showExLoginModal, setShowExLoginModal, toggleExLoginModal] = useToggle(false);
    const [showSubLoginModal, setShowSubLoginModal, toggleSubLoginModal] = useToggle(false);

    const delAccHook = useToggle(false);
    const [showDelAccModal, setShowDelAccModal, toggleDelAccModal] = delAccHook;

    const expAccHook = useToggle(false);
    const [showExpAccModal, setShowExpAccModal, toggleExpAccModal] = expAccHook;

    const chkUserHook = useToggle(false);
    const [showChkUserModal, setShowChkUserModal, toggleChkUserModal] = chkUserHook;

    const [showViewerModal, setShowViewerModal, toggleViewerModal] = useToggle(false);

    const existLoginFormHook = useExistLoginForm();
    const subLoginFormHook = useSubLoginForm();

    const [loading, setLoading, toggleLoading] = useToggle(false);

    const [img] = useChangeBg();
    // #endregion

    // #region Helper
    const TryAsGuest = () => {
        setLoading(true);
        fetchDemoLogin({
            param: {},
            onSetLoading: setLoading
        })
            .then(data => {
                const { User_Id, Email = "" } = data;

                Utility.OneSignalSubscribe(Email);
                dispatch(Actions.onChangeUserId(User_Id));

                RequestAccess(User_Id);

                dispatch(Actions.onChangeFirstTimeLink(false));
                GoToHome();

            })
            .catch(err => {
                setLoading(false);
                console.log(`Error: ${err}`);
            })
    }

    const GoToHome = () => {
        navigation.navigate("TabNavigation", {
            screen: "Dashboard",
        });
    }

    const RequestAccess = (userId) => {
        fetchSubUserAccess({
            param: {
                UserId: userId
            },
            onSetLoading: () => { },
        })
            .then(data => {
                dispatch(Actions.onChangeSubUserAccess(data));
            })
            .catch(err => {
                console.log(`Error: ${err}`);
            })
    }
    // #endregion

    const insets = useSafeAreaInsets();

    const onPressCheckUserConfirm = () => {
        setShowChkUserModal(false);
        setShowExLoginModal(true);
    }

    return (
        <>
            <BcViewerModal showModal={showViewerModal} setShowModal={setShowViewerModal} />
            <BcCheckUserModal showModal={showChkUserModal} setShowModal={setShowChkUserModal} onPressYes={onPressCheckUserConfirm} />
            <BcLoading loading={loading} />
            <BcDeleteAccountModal showModal={showDelAccModal} setShowModal={setShowDelAccModal} />
            <BcExpiredAccountModal showModal={showExpAccModal} setShowModal={setShowExpAccModal} />
            <ExistLoginModal
                formHook={existLoginFormHook} delAccHook={delAccHook}
                expAccHook={expAccHook} chkUserHook={chkUserHook}
                showModal={showExLoginModal} setShowModal={setShowExLoginModal} />
            <SubLoginModal formHook={subLoginFormHook} showModal={showSubLoginModal} setShowModal={setShowSubLoginModal} />
            <SafeAreaView style={{ flex: 1 }}>
                <ImageBackground
                    source={img}
                    resizeMode={"cover"}
                    style={{ flex: 1, opacity: 0.4 }} />
                <View position={"absolute"} style={{ top: insets.top, bottom: insets.bottom, left: 0, right: 0 }}>
                    <View style={{ height: 40 }} />

                    {/* Body */}
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        contentContainerStyle={{ flexGrow: 1 }}>
                        <View justifyContent={"center"}
                            style={{ flexGrow: 1 }}>

                            <VStack alignItems={"center"}
                                justifyContent={"space-between"}
                                style={{ height: "80%" }}>
                                {/* Logo Header */}
                                <View alignItems={"center"}>
                                    {/* <Image source={Images.YatuProLogo} resizeMode={"contain"} style={{ height: 160, width: 160, borderRadius: 20 }} /> */}
                                    <Image source={Images.YatuLiteLogo} resizeMode={"contain"} style={{ height: 160, width: 160, borderRadius: 20 }} />
                                    {/* <Image source={Images.YatuViewerLogo} resizeMode={"contain"} style={{ height: 160, width: 160, borderRadius: 20 }} /> */}
                                </View>

                                {/* <LoginForm loading={loading} setLoading={setLoading} /> */}

                                <VStack width={"100%"} space={5} alignItems={"center"}>
                                    <TouchableOpacity onPress={toggleExLoginModal}
                                        style={{ width: "80%", height: 48 }}>
                                        <View flex={1} alignItems={"center"} justifyContent={"center"} bgColor={Utility.getColor()}>
                                            <Text style={{
                                                fontFamily: "Roboto-Bold",
                                                fontSize: 16,
                                                color: "#FFF"
                                            }}>Login</Text>
                                        </View>
                                    </TouchableOpacity>
                                </VStack>

                            </VStack>
                        </View>
                    </ScrollView>

                    {/* Footer */}

                    <View alignItems={"center"} justifyContent={"center"} style={{ height: 80 }}>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 16
                        }}>Powered By {clsConst.ORG_NAME}</Text>
                        <Text style={{
                            fontFamily: "Roboto-Medium",
                            fontSize: 14
                        }}>© Version {clsConst.LITE_APP_VERSION}</Text>
                    </View>

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;