import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetReportSchedule";
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

        const { Email = [], Device = [] } = data;

        const Data = {};

        let email_arr = [...Email];

        email_arr = email_arr.map(x => ({
            name: x
        }));

        Data["Email"] = email_arr;
        Data["Device"] = Device;

        return Data;
    }
    else {
        console.log(`ReportSchedule - Request - ${JSON.stringify(obj)}`);
        console.log(`ReportSchedule - Response - ${JSON.stringify(data)}`);
    }

    return {};
};

export default Index;