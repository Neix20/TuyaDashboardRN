import { genLogUrl } from "./utility";

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
    if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
            return;
        }
        seen.add(value);
    }
    return value;
    };
};


// #region API
const fetchInfoLogData = async (param) => {
    const action = "InfoLog";
    const url = genLogUrl(action);

    const { fileName = "" } = param;

    // Static Data
    let obj = {
        content: {
            ...param,
            app: "Yatu Dashboard",
        },
        fileName: fileName,
    };

    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj, getCircularReplacer()),
    });

    const data = await resp.json();

    if (data["ResponseCode"] === "00") {
        console.log("Info Logging!");
    }

    return data;
};

const fetchErrorLogData = async (param) => {
    const action = "ErrorLog";
    const url = genLogUrl(action);

    const { fileName = "" } = param;

    // Static Data
    let obj = {
        content: {
            ...param,
            app: "Yatu Dashboard",
        },
        fileName: fileName,
    };

    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj, getCircularReplacer()),
    });

    const data = await resp.json();

    if (data["ResponseCode"] === "00") {
        console.error("Error Logging!");
    }

    return data;
};
// #endregion

class Log {
    info(param) {
        console.log(param);

        fetchInfoLogData(param)
        .then(res => {
            console.log(res);
        })
        .catch((err) => {
            console.error(`Error: ${err}`);
        });
    }

    error(param) {
        console.error(param);

        fetchErrorLogData(param)
        .then(res => {
            console.log(res);
        })
        .catch((err) => {
            console.error(`Error: ${err}`);
        });
    }
}

module.exports = new Log();