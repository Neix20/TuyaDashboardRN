import React, { useState, useEffect } from "react";

function Index(val = 0) {
    const [ind, setInd] = useState(val);

    const onChangeInd = (e) => setInd(_ => e);

    return [ind, setInd, onChangeInd];
}

export default Index;