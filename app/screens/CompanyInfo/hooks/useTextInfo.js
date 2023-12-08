import React, { useState, useEffect } from "react";

function Index(val) {

    const [txt, setTxt] = useState(val);
    const [data, setData] = useState({});

    useEffect(() => {
        const { version = "", content = [] } = data;
        if (content.length > 0) {
            let arr = [...content];

            arr = arr.map(obj => {
                const { description = "" } = obj;
                return {
                    ...obj,
                    description: description.split("\n")
                }
            });

            const next_state = {
                ...data,
                content: arr
            }
            setTxt(_ => next_state);
        }
    }, [data]);

    return [txt, setData];
}

export default Index;