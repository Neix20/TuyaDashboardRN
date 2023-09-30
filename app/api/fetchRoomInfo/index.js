import { Utility } from "@utility";

const init = {
    room: {
        Name: "Living Room"
    }
}

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetRoomInfo";
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
    // const data = init.room;
    onSetLoading(false);

    if (data["ResponseCode"] === "00") {
        // return data;
        const { Data } = data;
        return Data;
    }
    else {
        console.log(`RoomInfo - Request - ${JSON.stringify(obj)}`);
        console.log(`RoomInfo - Response - ${JSON.stringify(data)}`);
    }

    return {};
};

export default Index;