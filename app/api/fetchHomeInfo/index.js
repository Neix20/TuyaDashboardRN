import { Utility } from "@utility";

const init = {
    home: {
        "Id": 2,
        "Code": "B0001",
        "Name": "S8-HOME",
        "Address": null,
        "Lon": null,
        "Lat": null,
        "Merchant_Id": 1,
        "Status": "1",
        "Remark": "",
        "Created_By": "System",
        "Created_Date": "2023-09-04T09:38:05.83",
        "Last_Updated_By": "System",
        "Last_Updated_Date": "2023-09-04T09:38:05.83"
    }
}

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetHomeInfo";
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
    const data = init.home;
    onSetLoading(false);

    // if (data["ResponseCode"] === "00") {
    //     // return data;
    // }
    // else {
    //     console.log(`HomeInfo - Request - ${JSON.stringify(obj)}`);
    //     console.log(`HomeInfo - Response - ${JSON.stringify(data)}`);
    // }

    return data;
};

export default Index;