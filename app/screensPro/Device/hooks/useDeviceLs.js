import { useState } from "react";

function Index(val = []) {
    const init = {
        position: {
            tempHumd: 0,
            smartPlug: 1,
        }
    }

    const [data, setData] = useState(val);
    const [oridLs, setOridLs] = useState([]);
    const [posObj, setPosObj] = useState(init.position);

    const updateData = (arr = []) => {
        arr = arr.map((obj, pos) => ({
            ...obj,
            pos,
            flag: obj.Status == 1,
            pwsFlag: obj.ProfileWorkspaceStatus == 1,
            img: { uri: obj.DeviceImg }
        }));
        setData(_ => arr);

        let _oridLs = arr.filter(x => x.flag).map(x => x.Id);
        setOridLs(_ => _oridLs);

        let _posObj = { ...posObj };
        for (let ind in arr) {
            const { IsSmartPlug } = arr[ind];

            if (IsSmartPlug == 1) {
                _posObj["smartPlug"] = ind;
                break;
            }
        }
        setPosObj(_ => _posObj);
    }

    const toggleFlag = (item) => {
        const { pos, flag = false } = item;

        let arr = [...data];
        arr[pos].flag = !flag;

        setData(arr);
    }

    const addToFavorite = (item) => {
        const { pos, pwsFlag = false } = item;

        let arr = [...data];
        arr[pos].pwsFlag = !pwsFlag;

        setData(arr);
    }

    const syncCount = data.filter(x => x.Status).length;

    const nOridLs = data.filter(x => x.flag).map(x => x.Id).join("");
    const sessionFlag = nOridLs !== oridLs.join("");

    return [data, updateData, toggleFlag, addToFavorite, syncCount, sessionFlag, posObj];
}

export default Index;