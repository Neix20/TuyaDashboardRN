import React, { useState, useEffect } from "react";

function Index(val) {

    const [data, setData] = useState(val);

    const updateData = (param) => {
        const { content = [] } = param;
        if (content.length > 0) {
            let arr = [...content];

            arr = arr.map(obj => {
                const { description = "" } = obj;
                return {
                    ...obj,
                    description: description.split(/\n|<br\/>/g)
                }
            });

            const next_state = {
                ...param,
                content: arr
            }
            setData(_ => next_state);
        }
    }

    return [data, updateData];
}

export default Index;