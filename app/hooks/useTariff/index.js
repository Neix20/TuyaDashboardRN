import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '@redux';


function Index(props) {

    const dispatch = useDispatch();

    const [data, setData] = useState([]);

    const updateData = (val,) => {
        let arr = [...val];

        arr = arr.map((x, ind) => {
            let { Id, Title, Value } = x;

            Value = JSON.parse(Value);

            return {
                Id, Title,
                Rate: +Value["rate"],
                pos: ind,
                flag: false
            }
        });

        setData(_ => arr);
    }

    const toggleTariff = (item) => {
        const { pos = -1, flag = false } = item;

        let arr = [...data];

        for (let ind = 0; ind < arr.length; ind += 1) {
            arr[ind].flag = false;
        }

        if (pos >= 0 && pos < arr.length) {
            arr[pos].flag = true;
        }

        setData(_ => arr);
        dispatch(Actions.onChangeUserTariff(item));
    }

    const selectByTariff = (tariffId) => {
        let arr = [...data];
        arr = arr.filter(x => x.Id == tariffId);

        if (arr.length > 0) {
            const item = arr[0];
            item.flag = true;

            return item;
        }

        return {
            Id: -1,
            Title: "",
            Rate: 1
        }
    }

    return [data, updateData, toggleTariff, selectByTariff];
}

export default Index;