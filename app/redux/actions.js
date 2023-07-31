const onChangeDefaultValue = (defaultValue) => {
    return {
        type: "SET_DEFAULT_VALUE",
        defaultValue: defaultValue,
    }
};

export {
    onChangeDefaultValue
}