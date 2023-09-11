const initialState = {
    defaultValue: -1,
    userId: -1,
    homeId: -1,
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
        default: {
            return {
                ...state,
            }
        }
    }
}

export default setReducer;