import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetDashboardInfo";
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
    }
    else {
        console.log(`Dashboard - GetDashboardInfo - Request - ${JSON.stringify(obj)}`);
        console.log(`Dashboard - GetDashboardInfo - Response - ${JSON.stringify(data)}`);
    }

    let res_data = {};
    res_data["Data"] = {};
    res_data["Data"]["DCH-AHUX"] = data["Data"]["DCH-AHUX"];

    return res_data;
};

export default Index;