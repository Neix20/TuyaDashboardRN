import { Utility } from "@utility";

import { clsConst } from "@config";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetAppVersion";
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
        const num_a = Utility.checkAppVersion(Data);
        const num_b = Utility.checkAppVersion(clsConst.APP_VERSION);
        return num_a > num_b;
    }
    else {
        console.log(`GetAppVersion - Request - ${JSON.stringify(obj)}`);
        console.log(`GetAppVersion - Response - ${JSON.stringify(data)}`);
    }

    return false;
};

export default Index;