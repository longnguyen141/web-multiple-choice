const initialState = '';
const selectFieldReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ChangeField":
            return action.payload
        default:
            return state;
    }
}
export default selectFieldReducer;