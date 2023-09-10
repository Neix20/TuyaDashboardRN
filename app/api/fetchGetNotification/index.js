import { Utility } from "@utility";

import { AlertDataList } from "@config";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetNotification";
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

    // const data = await resp.json();
    // onSetLoading(false);

    // if (data["ResponseCode"] === "00") {
    //     // return data;
    // }
    // else {
    //     console.log(`Alert - GetNotification - Request - ${JSON.stringify(obj)}`);
    //     console.log(`Alert - GetNotification - Response - ${JSON.stringify(data)}`);
    // }

    // return data;

    let arr = [...AlertDataList];

    let data = {};

    for (let alert of arr) {
        const { Timestamp } = alert;

        const dt = Utility.formatDt(Timestamp, "yyyy-MM-dd");

        if (dt in data) {
            data[dt].push(alert)
        } else {
            data[dt] = [alert];
        }
    }

    onSetLoading(false);

    return data;
};

export default Index;