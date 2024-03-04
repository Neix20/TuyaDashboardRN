import React, { useState, useEffect } from "react";

function Index(val = []) {

    const [dict, setDict] = useState({});
    const [data, setData] = useState(val);
    const [img, setImg] = useState({ uri: "https://i.imgur.com/lwNqBtJ.png" });

    // Input: { "key": "1 Month", "title": "1 Month", "showBtn": true, "detail": [ { "title": "Real-Time Data Analysis", "description": "Data sync across linked devices for real-time analysis.", "icon": "DataAnalysis", "showInfo": false, "info": "" } ], "data": { "Code": "MSPP0100", "Price": 39.99, "TypeCode": "MSP_PP", "DurationTypeCode": "DT_MM", "Status": 1, "Image": "https://i.imgur.com/duGvnXn.png", "StoreCode": "com.subscription.mspp0100" } }
    // TODO: Dont Use UseEffect
    useEffect(() => {
        if (data.length > 0) {
            let arr = [...data];

            arr = arr.map(obj => {

                const { data: oData = {} } = obj
                const { Image = "https://i.imgur.com/lwNqBtJ.png", Price = 0 } = oData;

                return {
                    ...obj,
                    data: {
                        ...oData,
                        img: { uri: Image }
                    }
                }
            })

            if (arr.length > 0) {
                const { data: { img: oImg = {} } } = arr[0];
                setImg(_ => oImg);
            }

            let aDict = {};

            for (let obj of arr) {
                const { key } = obj;
                aDict[key] = obj;
            }

            setDict(aDict);
        }
    }, [data]);

    // Output: { "1 Month": { "key": "1 Month", "title": "1 Month", "showBtn": true, "detail": [ { "title": "Real-Time Data Analysis", "description": "Data sync across linked devices for real-time analysis.", "icon": "DataAnalysis", "showInfo": false, "info": "" } ], "data": { "Code": "MSPP0100", "Price": 39.99, "TypeCode": "MSP_PP", "DurationTypeCode": "DT_MM", "Status": 1, "Image": { uri: "https://i.imgur.com/duGvnXn.png" }, "StoreCode": "com.subscription.mspp0100" } } }

    const key = Object.keys(dict);

    return [dict, setData, key, img];

}

export default Index;