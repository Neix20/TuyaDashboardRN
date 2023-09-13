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

const onChangeHomeId = (homeId) => {
    return {
        type: "SET_HOME_ID",
        homeId: homeId,
    }
};

const onChangeWifi = (wifi) => {
    return {
        type: "SET_WIFI",
        wifi: wifi,
    }
};

const onChangeTuyaHomeId = (tuyaHomeId) => {
    return {
        type: "SET_TUYA_HOME_ID",
        tuyaHomeId: tuyaHomeId,
    }
};

const onChangeRoomId = (roomId) => {
    return {
        type: "SET_ROOM_ID",
        roomId: roomId,
    }
};

export {
    onChangeDefaultValue,
    onChangeUserId,
    onChangeHomeId,
    onChangeRoomId,
    onChangeWifi,
    onChangeTuyaHomeId,
}