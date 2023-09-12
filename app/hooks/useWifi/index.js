import React, {useState, useEffect} from "react";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function Index() {

    const init = {
        wifi: {
            ssid: null,
            password: null
        }
    }

    const [wifi, setWifi] = useState(init.wifi);

    const onChangeSSID = (val) => {
        const nextState = {
            ...wifi,
            ssid: val
        }
        setWifi(nextState);
    }

    const onChangePassword = (val) => {
        const nextState = {
            ...wifi,
            password: val
        }
        setWifi(nextState);
    }

    return [wifi, onChangeSSID, onChangePassword];
}

export default Index;