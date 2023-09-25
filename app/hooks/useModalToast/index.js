import React, { useState, useEffect } from "react";

function Index(props) {
    const init = {
        toast: {
            msg: "",
            flag: false
        }
    }

    const [toast, setToast] = useState(init.toast);

    const setToastFlag = (val) => {
        setToast(() => ({
            ...toast,
            flag: val
        }));
    }

    const showMsg = (val) => {
        setToast(() => ({
            ...toast,
            msg: val,
            flag: true
        }))
    }

    useEffect(() => {
        if (toast.flag) {
            const timer = setTimeout(() => setToastFlag(false), 3 * 1000);
            return () => clearTimeout(timer);
        }
    }, [toast.flag]);

    return [toast, showMsg];
}

export default Index;