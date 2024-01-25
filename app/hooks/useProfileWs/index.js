import React, { useState } from "react";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';

function Index(prwsId = -1) {

    const init = {
        profileWs: {
            Name: "",
            flag: false,
        }
    }

    const dispatch = useDispatch();

    const [ws, setWs] = useState(init.profileWs);
    const [ls, setLs] = useState([]);

    const updateLs = (data = []) => {

        if (data.length <= 0) {
            return;
        }

        let arr = [...data];

        arr = arr.map((obj, pos) => ({
            ...obj,
            pos,
            flag: false,
        }));

        const wsArr = arr.filter(x => x.Id === prwsId);
        if (wsArr.length == 0) {
            setWs(arr[0]);
            dispatch(Actions.onChangeProfileWorkspaceId(arr[0].Id));
        } else {
            const wsObj = wsArr[0];
            setWs(wsObj);

            const { pos: wsPos } = wsObj;
            arr[wsPos].flag = true;
        }

        setLs(_ => arr);
    }

    const selectProfileWs = ({ pos }) => {
        let arr = [...ls];

        for (let ind in arr) {
            arr[ind].flag = false;
        }

        arr[pos].flag = true;
        setLs(_ => arr);

        const { Id: ProfileWorkspaceId } = arr[pos];
        setWs(arr[pos]);
        dispatch(Actions.onChangeProfileWorkspaceId(ProfileWorkspaceId));
    }

    return [ws, ls, updateLs, selectProfileWs];
}

export default Index;