import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetHomeList";
    const url = Utility.genServerUrl(action);

    // Static Data
    let obj = Utility.requestObj(param);

    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    });

    const data = await resp.json();
    onSetLoading(false);

    if (data["ResponseCode"] === "00") {
        // return data;

        const { Data } = data;

        let arr = [...Data]

        arr = arr.map((obj, ind) => ({
            ...obj,
            pos: ind,
            flag: false
        }))

        arr[0].flag = true;

        return arr;
    }
    else {
        console.log(`GetHomeList - Request - ${JSON.stringify(obj)}`);
        console.log(`GetHomeList - Response - ${JSON.stringify(data)}`);
    }

    return [];
};

export default Index;