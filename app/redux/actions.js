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

const onChangeSubUserAccess = (subUserAccess) => {
    return {
        type: "SET_SUB_USER_ACCESS",
        subUserAccess: subUserAccess,
    }
};

const onChangeDashboardReportFlag = (dashboardReportFlag) => {
    return {
        type: "SET_DASHBOARD_REPORT_FLAG",
        dashboardReportFlag: dashboardReportFlag,
    }
};

const onChangePremiumPayFlag = (premiumPayFlag) => {
    return {
        type: "SET_PREMIUM_PAY_FLAG",
        premiumPayFlag: premiumPayFlag,
    }
};

const onChangeProfileWorkspaceId = (profileWorkspaceId) => {
    return {
        type: "SET_PROFILE_WORKSPACE_ID",
        profileWorkspaceId: profileWorkspaceId,
    }
};

const onChangeLoginAccess = (loginAccess) => {
    return {
        type: "SET_LOGIN_ACCESS",
        loginAccess: loginAccess,
    }
}

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
    onChangeLinkTsStart,
    onChangeSubUserAccess,
    onChangeDashboardReportFlag,
    onChangePremiumPayFlag,
    onChangeProfileWorkspaceId,
    onChangeLoginAccess
}