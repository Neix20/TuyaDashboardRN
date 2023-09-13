import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetDeviceNotification";
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

    if (data["ResponseCode"] === "00") {

        const { Data } = data;

        let resData = {};

        for (let alert of Data) {
            const { Timestamp } = alert;
    
            const dt = Utility.formatDt(Timestamp, "yyyy-MM-dd");
    
            if (dt in resData) {
                resData[dt].push(alert)
            } else {
                resData[dt] = [alert];
            }
        }

        onSetLoading(false);

        return resData;
    }
    else {
        console.log(`DeviceNotification - Request - ${JSON.stringify(obj)}`);
        console.log(`DeviceNotification - Response - ${JSON.stringify(data)}`);
    }

    onSetLoading(false);

    return {};
};

export default Index;