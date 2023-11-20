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
        const next_state = {
            ...toast,
            flag: val
        };
        setToast(() => next_state);
    }

    const showMsg = (val) => {
        const next_state = {
            ...toast,
            msg: val,
            flag: true
        };
        setToast(() => next_state);
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