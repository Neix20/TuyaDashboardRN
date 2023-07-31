const initialState = {
    defaultValue: -1,
};

function setReducer(state = initialState, action = {}) {
    switch (action.type) {
        case "SET_DEFAULT_VALUE":
            return {
                ...state,
                defaultValue: action.defaultValue,
            };
    }
}

export default setReducer;