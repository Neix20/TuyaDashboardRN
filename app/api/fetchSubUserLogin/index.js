import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "SubUserLogin";
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
        const { Data = null } = data;

        if (Object.keys(Data).length == 0) {
            return null;
        }

        return Data;
    }
    else {
        console.log(`SubUserLogin - Request - ${JSON.stringify(obj)}`);
        console.log(`SubUserLogin - Response - ${JSON.stringify(data)}`);
    }

    return null;
};

export default Index;