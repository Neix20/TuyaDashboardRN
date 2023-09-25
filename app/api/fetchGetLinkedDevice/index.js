import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetLinkedDeviceList";
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
        const { Data } = data;

        let arr = [...Data];

        arr = arr.map((obj, ind) => {
            const { Status } = obj;
            return {
                ...obj,
                pos: ind,
                flag: Status === 1
            }
        });

        return arr;
    }
    else {
        console.log(`GetLinkedDeviceList - Request - ${JSON.stringify(obj)}`);
        console.log(`GetLinkedDeviceList - Response - ${JSON.stringify(data)}`);
    }

    return [];
};

export default Index;