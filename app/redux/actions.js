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

const onChangeFirstTimeLink = (firstTimeLink) => {
    return {
        type: "SET_FIRST_TIME_LINK",
        firstTimeLink: firstTimeLink,
    }
};

const onChangeLinkTimer = (linkTimer) => {
    return {
        type: "SET_LINK_TIMER",
        linkTimer: linkTimer,
    }
};

const onChangeLinkTotalDuration = (linkTotalDuration) => {
    return {
        type: "SET_LINK_TOTAL_DURATION",
        linkTotalDuration: linkTotalDuration,
    }
};

const onChangeLinkDeviceLs = (linkDeviceLs) => {
    return {
        type: "SET_LINK_DEVICE_LS",
        linkDeviceLs: linkDeviceLs,
    }
};

const onChangeLinkTsStart = (linkTsStart) => {
    return {
        type: "SET_LINK_TS_START",
        linkTsStart: linkTsStart,
    }
};

export {
    onChangeDefaultValue,
    onChangeUserId,
    onChangeHomeId,
    onChangeRoomId,
    onChangeWifi,
    onChangeTuyaHomeId,
    onChangeFirstTimeLink,
    onChangeLinkTimer,
    onChangeLinkTotalDuration,
    onChangeLinkDeviceLs,
    onChangeLinkTsStart
}