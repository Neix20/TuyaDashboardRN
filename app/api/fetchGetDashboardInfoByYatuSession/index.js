import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetDashboardInfoByYatuSession";
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
        const { Data = {} } = data;
        return Data;
    }
    else {
        console.log(`GetDashboardInfoByYatuSession - Request - ${JSON.stringify(obj)}`);
        console.log(`GetDashboardInfoByYatuSession - Response - ${JSON.stringify(data)}`);
    }

    return {};
};

export default Index;