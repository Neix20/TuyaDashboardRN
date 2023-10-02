import { useState, useEffect } from "react";

function Index() {

    const init = {
        form: {
            Title: "",
            Description: "",
            Param: "",
            Operation: "",
            Expression: ""
        }
    }

    const [form, setForm] = useState({});

    const onChange = (name, val) => {
        const nextState = { ...form };
        nextState[name] = val;
        setForm(() => nextState);
    }

    const onChangeTitle = (val) => onChange("Title", val);
    const onChangeDescription = (val) => onChange("Description", val);
    const onChangeParam = (val) => onChange("Param", val);
    const onChangeOperation = (val) => onChange("Operation", val);
    const onChangeExpression = (val) => onChange("Expression", val);

    const isFormEmpty = () => {
        
        let flag = false;

        for (const key in init.form) {
            if (key in form) {
                const val = form[key];
                flag = flag || val.length == 0;
            } else {
                flag = true;
            }
        }

        return flag;
    }

    return [form, setForm, onChangeTitle, onChangeDescription, onChangeParam, onChangeOperation, onChangeExpression, isFormEmpty];
}

export default Index;