import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetDeviceInfo";
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
        
        let res = {...Data[0]};

        const { MetaData, DeviceImg } = Data[0];

        res["img"] = { uri: DeviceImg };

        let mObj = JSON.parse(MetaData);

        res["Temperature"] = +mObj["temp_current"];
        res["Humidity"] = +mObj["humidity_value"];

        return res;
    }
    else {
        console.log(`GetDeviceDetails - Request - ${JSON.stringify(obj)}`);
        console.log(`GetDeviceDetails - Response - ${JSON.stringify(data)}`);
    }

    return {};
};

export default Index;