import React, { useState, useEffect } from "react";

function Index(val = []) {

    const [dict, setDict] = useState({});
    const [data, setData] = useState(val);
    const [key, setKey] = useState([]);
    const [img, setImg] = useState({
        uri: "https://i.imgur.com/lwNqBtJ.png"
    });

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
                    },
                    price: Price,
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

            let keys = Object.keys(aDict);
            setKey(keys);

            setDict(aDict);
        }
    }, [data]);

    return [dict, setData, key, img];

}

export default Index;