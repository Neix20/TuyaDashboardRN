const onChangeDefaultValue = (defaultValue) => {
    return {
        type: "SET_DEFAULT_VALUE",
        defaultValue: defaultValue,
    }
};

const onChangeUserId = (userId) => {
    return {
        type: "SET_USER_ID",
        userId: userId,
    }
};

export {
    onChangeDefaultValue,
    onChangeUserId,
}