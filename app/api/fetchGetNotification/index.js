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

    const data = await resp.json();

    if (data["ResponseCode"] === "00") {
        // return data;

        const { Data = [] } = data;

        if (Data.length == 0 || Data == "[]") {
            onSetLoading(false);
            return {}
        }

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
        console.log(`Alert - GetNotification - Request - ${JSON.stringify(obj)}`);
        console.log(`Alert - GetNotification - Response - ${JSON.stringify(data)}`);
    }

    onSetLoading(false);
    return {};
};

export default Index;