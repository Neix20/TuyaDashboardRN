import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "ErrorLog";
    const url = Utility.genServerUrl(action);

    // Static Data
    let obj = {
        content: {
            ...param,
            app: "Yatu Dashboard",
        }
    };

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
        console.error("Error Logging!");
    }
    else {
        console.log(`ErrorLog - Request - ${JSON.stringify(obj)}`);
        console.log(`ErrorLog - Response - ${JSON.stringify(data)}`);
    }

    return data;
};

export default Index;