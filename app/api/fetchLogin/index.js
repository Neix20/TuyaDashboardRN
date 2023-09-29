import { Logger, Utility } from "@utility";

// import { loginWithEmail } from "@volst/react-native-tuya";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "Login";
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

        // let res = await loginWithEmail({
        //     countryCode: 'MY',
        //     email: 'txen2000@gmail.com',
        //     password: 'arf11234'
        // })
        
        // res = await Logger.info({ content: res, page: "App", fileName: "tuya_login" });
        
        return data;
    }
    else if (data["ResponseCode"] === "011001") {

    }
    else {
        console.log(`Login - Login - Request - ${JSON.stringify(obj)}`);
        console.log(`Login - Login - Response - ${JSON.stringify(data)}`);
    }

    return null;
};

export default Index;