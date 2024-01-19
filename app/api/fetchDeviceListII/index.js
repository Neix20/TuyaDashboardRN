import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetDeviceListII";
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
        const { Data = {} } = data;

        // Add Uri and Pos To Each Device Row
        for (let room in Data) {
            let arr = [...Data[room]];

            arr = arr.map((obj, ind) => (
                {
                    ...obj,
                    img: { uri: obj.DeviceImg },
                    pos: ind,
                }
            ));

            Data[room] = arr;
        }

        return Data;
    }
    else {
        console.log(`GetDeviceListII - Request - ${JSON.stringify(obj)}`);
        console.log(`GetDeviceListII - Response - ${JSON.stringify(data)}`);
    }

    return {};
};

export default Index;