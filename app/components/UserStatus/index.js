import React from "react";
import { TouchableOpacity } from "react-native";
import { useToast } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { BcYesNoModal } from "@components";
import { useToggle } from "@hooks";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function Index(props) {

    const navigation = useNavigation();

    const { flag = false } = props;

    // #region Use State
    const subUserAccess = useSelector(Selectors.subUserAccessSelect);
    const { Email = "", UserStatus = 0 } = subUserAccess;

    const [showModal, setShowModal, toggleModal] = useToggle(flag);
    // #endregion

    const GoToCheckTuyaEmail = () => {
        toggleModal();
        navigation.navigate("CheckTuyaEmail", {
            Email: Email
        });
    }

    if (UserStatus > 0) {
        return (<></>)
    }

    return (
        <>
            <BcYesNoModal showModal={showModal} setShowModal={setShowModal}
                title={"You're not authenticated"}
                titleYes={"Yes"} titleNo={"Cancel"}
                onPressYes={GoToCheckTuyaEmail} onPressNo={toggleModal}
                description={"Would you like to authenticate your account?"} />
            <TouchableOpacity onPress={toggleModal}>
                <FontAwesome5 name={"exclamation-triangle"} size={20} color={"#F00"} />
            </TouchableOpacity>
        </>
    )
}

export default Index;