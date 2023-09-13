const initialState = {
    defaultValue: -1,
    userId: -1,
    homeId: -1,
    roomId: "",
    tuyaHomeId: 166388041,
    wifi: {
        ssid: null,
        password: null,
    }
};

function setReducer(state = initialState, action = {}) {
    switch (action.type) {
        case "SET_DEFAULT_VALUE":
            return {
                ...state,
                defaultValue: action.defaultValue,
            };
        case "SET_USER_ID":
            return {
                ...state,
                userId: action.userId,
            };
        case "SET_HOME_ID":
            return {
                ...state,
                homeId: action.homeId,
            };
        case "SET_ROOM_ID":
            return {
                ...state,
                roomId: action.roomId,
            };
        case "SET_WIFI":
            return {
                ...state,
                wifi: action.wifi,
            };
        case "SET_TUYA_HOME_ID":
            return {
                ...state,
                tuyaHomeId: action.tuyaHomeId,
            };
        default: {
            return {
                ...state,
            }
        }
    }
}

export default setReducer;