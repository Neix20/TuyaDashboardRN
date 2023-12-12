import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetAboutUs";
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
        return Data;
    }
    else {
        console.log(`GetAboutUs - Request - ${JSON.stringify(obj)}`);
        console.log(`GetAboutUs - Response - ${JSON.stringify(data)}`);
    }

    return {};
};

export default Index;