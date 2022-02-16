const initialState = {};

const SelectUpdateTags = (state = initialState, action) => {
    switch (action.type) {
        case "ChangeCategory":
            return action.payload
        default:
            return state;
    }
}

export default SelectUpdateTags;