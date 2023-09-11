import { Utility } from "@utility";

const init = {
    roomLs: [
        { Name: "Living Room" },
        { Name: "Office" },
        { Name: "Kitchen" },
        { Name: "Master Bedroom" },
        { Name: "Dining Room" }
    ]
}

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetRoomList";
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

    onSetLoading(false);

    // const data = await resp.json();
    // onSetLoading(false);

    // if (data["ResponseCode"] === "00") {
    //     return data;
    // }
    // else {
    //     console.log(`Room List - Request - ${JSON.stringify(obj)}`);
    //     console.log(`Room List - Response - ${JSON.stringify(data)}`);
    // }

    let arr = [...init.roomLs];

    arr = arr.map((obj, ind) => ({
        ...obj,
        pos: ind,
        flag: false
    }));

    return arr;
};

export default Index;