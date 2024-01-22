import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetDashboardInfoByProfileWorkspace";
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
        return Data;
    }
    else {
        console.log(`fetchDashboardInfoByProfileWorkspace - Request - ${JSON.stringify(obj)}`);
        console.log(`fetchDashboardInfoByProfileWorkspace - Response - ${JSON.stringify(data)}`);
    }

    return data;
};

export default Index;