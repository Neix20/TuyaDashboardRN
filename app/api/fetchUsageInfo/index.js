import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetUsageInfo";
    const url = Utility.genLoyaltyServerUrl(action);

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
    }
    else {
        console.log(`DeviceData - GetUsageInfo - Request - ${JSON.stringify(obj)}`);
        console.log(`DeviceData - GetUsageInfo - Response - ${JSON.stringify(data)}`);
    }

    return data;
};

export default Index;