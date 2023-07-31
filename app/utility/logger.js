const { genLogUrl } = require("./utility");

class Log {
    info(page, content) {
        console.log(JSON.stringify({
            app: "Tuya Dashboard",
            page: page,
            content: content
        }));
        
        const fetchData = async () => {
            const action = "InfoLog";
            const url = genLogUrl(action);

            // Static Data
            let obj = {
                content: {
                    app: "Tuya Dashboard",
                    page: page,
                    content: content
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

            if (data["ResponseCode"] === "00") {
                // const { } = data;
                console.log("Info Logging!");
            }
        };

        fetchData().catch((err) => {
            console.log(`Error: ${err}`);
        });
    }

    error(page, content) {

        console.log(JSON.stringify({
            app: "Tuya Dashboard",
            page: page,
            content: content
        }));

        const fetchData = async () => {
            const action = "ErrorLog";
            const url = genLogUrl(action);

            // Static Data
            let obj = {
                content: {
                    app: "Tuya Dashboard",
                    page: page,
                    content: content
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

            if (data["ResponseCode"] === "00") {
                // const { } = data;
                console.log("Error Logging!");
            }
        };

        fetchData().catch((err) => {
            console.log(`Error: ${err}`);
        });

    }
}

const info = new Log();
const error = new Log();

module.exports = {
    info,
    error
};