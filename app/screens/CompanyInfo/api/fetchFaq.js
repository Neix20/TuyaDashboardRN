import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "GetFaq";
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

        Data["content"] = Data["content"].map(obj => {
            // Remove All <br/> from description
            const { description = "" } = obj;
            return {
                ...obj,
                description: description.replace(/<br\/>/g, "\n")
            }
        });

        return Data;
    }
    else {
        console.log(`GetFaq - Request - ${JSON.stringify(obj)}`);
        console.log(`GetFaq - Response - ${JSON.stringify(data)}`);
    }

    return {};
};

export default Index;