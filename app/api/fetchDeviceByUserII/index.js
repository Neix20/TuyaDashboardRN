import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetDeviceByUserII";
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
        const { Data = [] } = data;
        return Data;
    }
    else {
        console.log(`GetDeviceByUserII - Request - ${JSON.stringify(obj)}`);
        console.log(`GetDeviceByUserII - Response - ${JSON.stringify(data)}`);
    }

    return [];
};

export default Index;